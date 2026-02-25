import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. Shader: 幽灵加深 & 动画逻辑 ---
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelScale; 
  
  attribute vec3 aColor;
  attribute float aServerIndex;
  attribute float aPartType;    
  attribute vec3 aRandom;
  attribute float aIsGhost;

  varying vec3 vColor;
  varying float vGhost;

  float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }

  void main() {
    vColor = aColor;
    vGhost = aIsGhost;
    vec3 pos = position;

    // --- A. 幽灵服务器 (背景) ---
    if (aIsGhost > 0.5) {
       // 微微呼吸
       pos.z += sin(uTime * 0.5 + pos.y * 0.1) * 0.1;
    }
    // --- B. 焦点服务器 (爆炸动画) ---
    else if (aPartType < 9.5 && aServerIndex > -0.5) {
      
      // 波浪延迟
      float delay = aServerIndex * 0.12; 
      
      // 计算有效进度
      float effectiveProgress = smoothstep(0.0, 1.0, (uProgress * 1.5 - delay)); 

      // 阶段1: 滑出
      float slideDist = smoothstep(0.0, 0.3, effectiveProgress) * 40.0;
      pos.z += slideDist;

      // 阶段2: 揭盖
      if (abs(aPartType - 1.0) < 0.1) {
        float open = smoothstep(0.2, 0.6, effectiveProgress);
        pos.y += open * 22.0; 
        pos.z -= open * 18.0; 
        pos.x += sin(open * 3.14) * 2.0 * (aRandom.x - 0.5); 
      }

      // 阶段3: 组件爆炸
      if (aPartType > 1.5 && aPartType < 9.5) {
        float explode = smoothstep(0.45, 1.0, effectiveProgress);
        float easeExplode = easeOutCubic(explode);

        pos.y += easeExplode * 6.0;

        // 硬盘 (Type 2)
        if (abs(aPartType - 2.0) < 0.1) { 
             pos.z += easeExplode * 12.0; 
             pos.y += easeExplode * 2.0;
        } 
        // 风扇墙 (Type 6)
        else if (abs(aPartType - 6.0) < 0.1) { 
             pos.y += easeExplode * 14.0;
        }
        // CPU散热器 (Type 4)
        else if (abs(aPartType - 4.0) < 0.1) { 
             pos.y += easeExplode * 22.0; 
        } 
        // 内存条 (Type 5)
        else if (abs(aPartType - 5.0) < 0.1) { 
             float dir = pos.x > 0.0 ? 1.0 : -1.0;
             pos.x += dir * easeExplode * 9.0; 
             pos.y += easeExplode * 8.0;
        } 
        // GPU (Type 8)
        else if (abs(aPartType - 8.0) < 0.1) { 
             pos.z -= easeExplode * 16.0; 
             pos.y += easeExplode * 12.0; 
             pos.x += pos.x * 0.15 * easeExplode; 
        }
        
        pos += (aRandom - 0.5) * easeExplode * 0.2;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    float dist = -mvPosition.z;
    
    // 幽灵粒子大小
    float sizeMult = aIsGhost > 0.5 ? 0.7 : 1.0;
    
    gl_PointSize = max(1.0, (200.0 * uPixelScale * sizeMult) / max(dist, 0.1)); 
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vGhost;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(abs(coord.x) > 0.48 || abs(coord.y) > 0.48) discard;
    
    vec3 finalColor = vColor;
    
    // 幽灵模式：深灰色
    if (vGhost > 0.5) {
        finalColor = vec3(0.2, 0.2, 0.2); 
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// --- 2. 建模逻辑 ---
const generateModel = (qualityLevel) => {
  const particles = [];
  const colors = [];
  const serverIndices = [];
  const partTypes = [];
  const randoms = [];
  const isGhosts = [];

  const add = (x, y, z, color, sIdx, pType, isGhost = 0.0) => {
    particles.push(x, y, z);
    const c = new THREE.Color(color);
    colors.push(c.r, c.g, c.b);
    serverIndices.push(sIdx);
    partTypes.push(pType);
    randoms.push(Math.random(), Math.random(), Math.random());
    isGhosts.push(isGhost);
  };

  let baseStep = qualityLevel === 'ultra' ? 0.35 : 0.55;
  let detailStep = qualityLevel === 'ultra' ? 0.12 : 0.25;
  let ghostStep = 0.6;

  const C_FRAME = '#111111';
  const C_CASE = '#1a1a1a';
  const C_LID = '#222222';
  const C_PCB = '#111111';
  const C_HEATSINK = '#cccccc';
  const C_HDD_BODY = '#111111';
  const C_HDD_LABEL = '#dddddd';
  const C_FAN_WALL = '#050505';

  const C_GPU_TITANIUM = '#555555';
  const C_GPU_BLACK = '#1a1a1a';
  const C_GPU_SILVER = '#e0e0e0';
  const C_RAM_DARK = '#222222';

  // 布局参数
  const frameW = 17.5;
  const frameH = 42;
  const frameD = 28;
  const unitHeight = 5.0;

  // A. 机柜框架
  for (let y = 0; y < frameH; y += baseStep) {
    for (let x = -frameW / 2; x <= frameW / 2; x += baseStep) {
      for (let z = -frameD / 2; z <= frameD / 2; z += baseStep) {
        const isEdgeX = Math.abs(x) > frameW / 2 - baseStep * 2;
        const isEdgeZ = Math.abs(z) > frameD / 2 - baseStep * 2;
        if (isEdgeX && isEdgeZ) add(x, y - frameH / 2, z, C_FRAME, -1, 10);
        if (isEdgeX && !isEdgeZ && Math.abs((y - frameH / 2) - z * 0.5) % 10 < 0.5) add(x, y - frameH / 2, z, C_FRAME, -1, 10);
      }
    }
  }

  // B. 服务器生成
  const totalSlots = 7;
  const centerStart = 2;
  const centerEnd = 4;

  for (let i = 0; i < totalSlots; i++) {
    const offsetIndex = i - 3;
    const baseY = offsetIndex * unitHeight;
    const isFocus = (i >= centerStart && i <= centerEnd);
    const serverIdx = i;

    // --- 1. 幽灵服务器 (背景) ---
    if (!isFocus) {
      const ghostColor = '#000000';

      // 机箱轮廓
      for (let x = -7.5; x <= 7.5; x += ghostStep) {
        for (let z = -11; z <= 11; z += ghostStep) {
          const isEdge = Math.abs(x) > 7.0 || Math.abs(z) > 10.5 || z == 11 || z == -11;
          if (isEdge) {
            add(x, baseY, z, ghostColor, -1, 0, 1.0);
            add(x, baseY + 3.8, z, ghostColor, -1, 0, 1.0);
          }
        }
      }
      // 内部简单示意
      const hddZ = 9.0;
      for (let hx = -6.0; hx < 6.0; hx += 1.5) {
        for (let hy = 0.5; hy < 3.0; hy += ghostStep / 2) add(hx, baseY + hy, hddZ, ghostColor, -1, 0, 1.0);
      }
      const fanZ = 4.5;
      for (let fx = -6.0; fx < 6.0; fx += 2.5) {
        for (let fy = 0.5; fy < 2.5; fy += ghostStep / 2) add(fx, baseY + fy, fanZ, ghostColor, -1, 0, 1.0);
      }
      continue;
    }

    // --- 2. 精细服务器 ---

    // 机箱
    for (let x = -7.5; x <= 7.5; x += baseStep) {
      for (let z = -11; z <= 11; z += baseStep) {
        add(x, baseY, z, C_CASE, serverIdx, 0);
        if (Math.abs(x) > 7.3 || z < -10.8) {
          add(x, baseY + 0.5, z, C_CASE, serverIdx, 0);
          add(x, baseY + 2.0, z, C_CASE, serverIdx, 0);
        }
      }
    }

    // 硬盘 (Front)
    const hddStartZ = 7.5;
    for (let h = 0; h < 12; h++) {
      const hx = -6.5 + h * 1.2;
      for (let x = hx; x < hx + 0.8; x += detailStep) {
        for (let y = 0; y < 2.8; y += detailStep) {
          for (let z = hddStartZ; z < hddStartZ + 3.0; z += detailStep) {
            let col = C_HDD_BODY;
            if (y > 2.5 && z > hddStartZ + 2.0) col = C_HDD_LABEL;
            add(x, baseY + 0.5 + y, z, col, serverIdx, 2);
          }
        }
      }
      add(hx + 0.4, baseY + 2.8, hddStartZ + 3.0, '#ffffff', serverIdx, 2);
    }

    // 风扇墙
    const fanCenterZ = 4.5;
    const fanThickness = 1.5;
    for (let f = 0; f < 8; f++) {
      const fx = -6.5 + f * 1.9;
      for (let x = fx; x < fx + 1.4; x += detailStep) {
        for (let y = 0; y < 2.0; y += detailStep) {
          for (let z = fanCenterZ - fanThickness / 2; z < fanCenterZ + fanThickness / 2; z += detailStep) {
            add(x, baseY + 0.5 + y, z, C_FAN_WALL, serverIdx, 6);
          }
        }
      }
    }

    // 主板
    for (let x = -7; x <= 7; x += baseStep) for (let z = -8; z <= 6; z += baseStep) add(x, baseY + 0.2, z, C_PCB, serverIdx, 3);

    // CPU & 散热器
    const cpuZ = 1.0;
    for (let socket = 0; socket < 2; socket++) {
      const cx = socket === 0 ? -3.5 : 3.5;
      for (let x = cx - 1.8; x <= cx + 1.8; x += detailStep) {
        for (let z = cpuZ - 2.0; z <= cpuZ + 2.0; z += detailStep) {
          add(x, baseY + 0.5, z, '#444444', serverIdx, 4);
          if (Math.abs(x % 0.4) < detailStep) {
            for (let h = 0; h < 2.2; h += detailStep) {
              add(x, baseY + 0.8 + h, z, C_HEATSINK, serverIdx, 4);
            }
          }
        }
      }
    }

    // 内存条
    const ramGroups = [-7, -1, 1, 7];
    for (let gx of ramGroups) {
      for (let r = 0; r < 8; r++) {
        const stickX = gx + (r * 0.25) * (gx > 0 ? -1 : 1);
        for (let z = cpuZ - 2.2; z <= cpuZ + 2.2; z += detailStep) {
          for (let h = 0; h < 1.0; h += detailStep) {
            add(stickX, baseY + 0.5 + h, z, C_RAM_DARK, serverIdx, 5);
          }
        }
      }
    }

    // GPU (Titanium Style)
    const gpuStartZ = -9.5;
    const gpuEndZ = -1.5;
    const gpuCount = 8;
    const gpuW = 1.4;
    const gap = 0.3;

    for (let g = 0; g < gpuCount; g++) {
      const gx = -6.8 + g * (gpuW + gap);

      for (let x = gx; x < gx + gpuW; x += detailStep) {
        for (let z = gpuStartZ; z <= gpuEndZ; z += detailStep) {
          add(x, baseY + 0.8, z, '#111111', serverIdx, 8);

          for (let y = 1.0; y < 3.0; y += detailStep) {
            let col;
            if (z < gpuStartZ + 0.3) col = C_GPU_SILVER;
            else {
              const localX = (x - gx) / gpuW;
              if (localX > 0.65) col = C_GPU_BLACK;
              else col = C_GPU_TITANIUM;
            }
            if (y > 2.8 || x < gx + detailStep || x > gx + gpuW - detailStep) {
              add(x, baseY + y, z, col, serverIdx, 8);
            }
          }
        }
        for (let y = 1.0; y < 3.0; y += detailStep) add(x, baseY + y, gpuStartZ, C_GPU_SILVER, serverIdx, 8);
      }
      add(gx + gpuW / 2, baseY + 3.0, -3.5, '#444444', serverIdx, 8);
    }

    // 机箱盖
    for (let x = -7.5; x <= 7.5; x += baseStep) {
      for (let z = -11; z <= 11; z += baseStep) {
        add(x, baseY + 3.8, z, C_LID, serverIdx, 1);
      }
    }
  }

  return {
    positions: new Float32Array(particles),
    colors: new Float32Array(colors),
    serverIndices: new Float32Array(serverIndices),
    partTypes: new Float32Array(partTypes),
    randoms: new Float32Array(randoms),
    isGhosts: new Float32Array(isGhosts),
    count: particles.length / 3
  };
};

const ParticleSystem = ({ progress, quality }) => {
  const shaderRef = useRef();
  const groupRef = useRef();
  const data = useMemo(() => generateModel(quality), [quality]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelScale: { value: 1.0 }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = progress;
    uniforms.uPixelScale.value = quality === 'ultra' ? 1.0 : 1.5;

    // --- 运镜同步逻辑 (Synchronized Camera Rig) ---
    if (groupRef.current) {

      // 同步启动阈值，确保运镜与底部服务器动画同步
      const startThreshold = 0.15;
      let rigProgress = 0;

      if (progress > startThreshold) {
        rigProgress = (progress - startThreshold) / (1.0 - startThreshold);
      }

      const easeRig = 1.0 - Math.pow(1.0 - rigProgress, 3.0);

      const targetZ = easeRig * -35.0;
      const targetY = easeRig * -10.0;
      const targetScale = 1.0 - (easeRig * 0.2);

      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={data.count} array={data.positions} itemSize={3} />
          <bufferAttribute attach="attributes-aColor" count={data.count} array={data.colors} itemSize={3} />
          <bufferAttribute attach="attributes-aServerIndex" count={data.count} array={data.serverIndices} itemSize={1} />
          <bufferAttribute attach="attributes-aPartType" count={data.count} array={data.partTypes} itemSize={1} />
          <bufferAttribute attach="attributes-aRandom" count={data.count} array={data.randoms} itemSize={3} />
          <bufferAttribute attach="attributes-aIsGhost" count={data.count} array={data.isGhosts} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={false}
        />
      </points>
    </group>
  );
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState('ultra');

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>

      <Canvas camera={{ position: [25, 12, 35], fov: 30 }} dpr={[1, 2]}>
        <color attach="background" args={['#f5f5f5']} />

        <ParticleSystem progress={progress} quality={quality} />

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={5}
          maxDistance={200}
          target={[0, 0, 0]}
          enablePan={false}
        />
        <Stats className="stats" />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
        width: '420px',
        display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#111', letterSpacing: '2px' }}>
            HGX COMPACT
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Synchronized Rig / Dark Ghost
          </p>
        </div>

        <div style={{
          width: '100%', background: '#fff', padding: '12px 20px',
          borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)',
          border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '15px'
        }}>
          <input
            type="range" min="0" max="1" step="0.001" value={progress}
            onChange={e => setProgress(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#444', cursor: 'pointer', height: '2px' }}
          />
        </div>

        <button
          onClick={() => setQuality(q => q === 'ultra' ? 'low' : 'ultra')}
          style={{
            background: 'transparent', border: 'none',
            fontSize: '9px', color: '#aaa', cursor: 'pointer',
            letterSpacing: '0.5px'
          }}
        >
          Rendering: {quality}
        </button>
      </div>
    </div>
  );
}