<template>
  <div ref="containerRef" class="w-full h-full min-h-[500px] relative">
    <canvas ref="canvasRef" class="w-full h-full block outline-none"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// --- Shader Definitions ---
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelScale; 
  
  attribute vec3 aColor;
  attribute float aServerIndex;
  attribute float aPartType;    
  attribute vec3 aRandom;
  attribute float aIsGhost;
  attribute float aEmissive;

  varying vec3 vColor;
  varying float vGhost;
  varying float vEmissive;
  varying float vAlpha;
  varying float vPartType; // Pass part type to fragment
  varying vec3 vPos;       // Pass local position to fragment

  float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }

  void main() {
    vColor = aColor;
    vGhost = aIsGhost;
    vEmissive = aEmissive;
    vPartType = aPartType;
    vec3 pos = position;
    vPos = pos; // Store initial local position (before explosion) for consistent texture mapping

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
    
    // Material Size Adjustments
    // Metal (Heatsink 4.0, GPU 8.0): Smaller, sharper
    if (abs(aPartType - 4.0) < 0.1 || abs(aPartType - 8.0) < 0.1) {
        sizeMult *= 0.85; 
    } 
    // Plastic (Fan 6.0): Larger, softer
    else if (abs(aPartType - 6.0) < 0.1) {
        sizeMult *= 1.3; 
    }
    
    // Fade out / Shrink logic near end of scroll
    // NEW: Instead of global fade, fade only the BOTTOM part relative to screen
    // ndcY ranges from -1 (bottom) to 1 (top)
    float ndcY = gl_Position.y / gl_Position.w;
    
    // Calculate bottom fade mask: 
    // Particles at bottom (-1.0) are transparent (0.0), particles higher up (> -0.2) are opaque (1.0)
    // Extended range -1.2 to 0.1 for smoother transition
    float bottomFade = smoothstep(-1.2, 0.1, ndcY);
    
    // Only apply this fade effect in the VERY late stages of scroll (transition to Products)
    // DELAYED: Start blending in the effect at uProgress 0.8 (was 0.6), fully active by 1.0
    float maskStrength = smoothstep(0.8, 1.0, uProgress);
    
    // Final alpha blends between 1.0 (no fade) and bottomFade
    float finalAlpha = mix(1.0, bottomFade, maskStrength);
    
    vAlpha = finalAlpha; // Pass to fragment

    gl_PointSize = max(0.0, (200.0 * uPixelScale * sizeMult * finalAlpha) / max(dist, 0.1)); 
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vGhost;
  varying float vEmissive;
  varying float vAlpha;
  varying float vPartType;
  varying vec3 vPos;
  
  uniform float uTime;
  
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    // Default Shape: Square (Hard Edge)
    if(abs(coord.x) > 0.48 || abs(coord.y) > 0.48) discard;

    // Material Differentiation Logic
    
    // 1. Soft / Plastic (Fan Type 6.0) OR Emissive (LEDs)
    // Make them circular
    if (abs(vPartType - 6.0) < 0.1 || vEmissive > 0.5) {
        // Circular cut
        if (dist > 0.48) discard;
        
        // Soft Glow for LEDs
        if (vEmissive > 0.5) {
            // Gaussian-ish falloff from center lightness
            // Center is bright, edges fade slightly
            float glow = 1.0 - smoothstep(0.2, 0.5, dist);
            // Don't fade alpha, fade brightness/mix to prevent transparency sorting issues?
            // Actually fading color is safer for additive look
            // But we want sharp core.
        }
    }
    
    // 2. Metal (Heatsink Type 4.0, GPU Type 8.0)
    // Sharp, Specular Highlight
    if (abs(vPartType - 4.0) < 0.1 || abs(vPartType - 8.0) < 0.1) {
        // Add a subtle center highlight to simulate metal reflection
        if (dist < 0.2) {
             // Specular highlight
             // No operation on coord, just boost color later
        }
    }

    vec3 finalColor = vColor;
    
    // 幽灵模式：深灰色
    if (vGhost > 0.5) {
        finalColor = vec3(0.12, 0.12, 0.12); 
    } else {
        // --- Data Flow Effects ---
        // 1. PCB Data Flow (Type 3) - Moving pulses along Z axis
        if (abs(vPartType - 3.0) < 0.1) {
            // Create a "digital rain" or circuit flow effect
            // Wave moving from back (-Z) to front (+Z) or vice versa
            float flow = sin(vPos.z * 1.5 - uTime * 4.0) + sin(vPos.x * 2.0);
            float pulse = smoothstep(1.5, 1.8, flow); // Sharp peaks
            
            if (pulse > 0.01) {
                // Add Cyan/Blue data pulse
                finalColor += vec3(0.0, 0.6, 1.0) * pulse * 0.8; 
            }
        }
        

        // Emissive Logic for Bloom
        if (vEmissive > 0.5) {
           // Reduced boost to prevent flickering/fireflies artifacts
           finalColor *= 2.0; 
           
           // Apply soft edge from shape logic
           // (Optional: simple gradient)
           float glow = 1.0 - smoothstep(0.3, 0.5, dist);
           finalColor *= (0.5 + 0.5 * glow); // Keep core bright
           
        } else {
           // Dim non-emissive
           finalColor *= 1.0;
           
           // Apply Metal Highlight
           if (abs(vPartType - 4.0) < 0.1 || abs(vPartType - 8.0) < 0.1) {
               if (dist < 0.15) finalColor *= 1.3; // Shiny point
           }
        }
    }
    
    gl_FragColor = vec4(finalColor, vAlpha);
  }
`;

// --- Model Generation Logic ---
const generateModel = (qualityLevel: string) => {
  const particles: number[] = [];
  const colors: number[] = [];


  const serverIndices: number[] = [];
  const partTypes: number[] = [];
  const randoms: number[] = [];
  const isGhosts: number[] = [];
  const emissives: number[] = [];

  let baseStep = qualityLevel === 'ultra' ? 0.35 : 0.55;
  let detailStep = qualityLevel === 'ultra' ? 0.12 : 0.25;
  let ghostStep = 0.6;

  const C_FRAME = '#080808'; // Very Dark Grey
  const C_CASE = '#111111';  // Almost Black
  const C_LID = '#181818';   // Dark Grey
  const C_PCB = '#05101a'; // Darker Navy
  const C_HEATSINK = '#d0d0d0'; // Standard Aluminum
  const C_HDD_BODY = '#0d0d0d';
  const C_HDD_LABEL = '#e8e8e8';
  const C_HDD_LED = '#0066ff'; // Blue Status Light
  const C_FAN_WALL = '#030303';

  const C_GPU_TITANIUM = '#3a3a3a';
  const C_GPU_BLACK = '#050505';
  const C_GPU_SILVER = '#c0c0c0';
  const C_GPU_ACCENT = '#ffcc00'; // Nvidia Professional Yellow
  const C_RAM_DARK = '#141414';
  const C_RAM_GOLD = '#d4af37'; // Gold contacts
  const C_SOCKET = '#222222';
  const C_FAN_RING = '#444444'; // Grey Fan Ring (No Blue Light)
  const C_POWER_LED = '#22ff22'; // Green Power LED

  const add = (x: number, y: number, z: number, color: string, sIdx: number, pType: number, isGhost = 0.0) => {
    particles.push(x, y, z);
    const c = new THREE.Color(color);
    colors.push(c.r, c.g, c.b);
    serverIndices.push(sIdx);
    partTypes.push(pType);
    randoms.push(Math.random(), Math.random(), Math.random());
    isGhosts.push(isGhost);

    // Check for emissive colors (LEDs, Gold, Accents)
    const isEmissive = [C_GPU_ACCENT, C_RAM_GOLD, C_HDD_LED, C_POWER_LED].includes(color);
    emissives.push(isEmissive ? 1.0 : 0.0);
  };


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

    // Power LED (Green) on the right ear/handle
    add(7.4, baseY + 1.5, 11.0, C_POWER_LED, serverIdx, 0);
    add(7.3, baseY + 1.5, 11.0, C_POWER_LED, serverIdx, 0); // Double point for visibility

    // 硬盘 (Front)
    const hddStartZ = 7.5;
    for (let h = 0; h < 12; h++) {
      const hx = -6.5 + h * 1.2;
      for (let x = hx; x < hx + 0.8; x += detailStep) {
        for (let y = 0; y < 2.8; y += detailStep) {
          for (let z = hddStartZ; z < hddStartZ + 3.0; z += detailStep) {
            let col = C_HDD_BODY;
            if (y > 2.5 && z > hddStartZ + 2.0) col = C_HDD_LABEL;
            // Add LED indicator (Green) - made smaller/subtle
            if (y > 0.15 && y < 0.35 && z > hddStartZ + 2.9 && x > hx + 0.65) col = C_HDD_LED;
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
            let col = C_FAN_WALL;
            // Grey Ring Accent (Fan frame)
            const dx = x - (fx + 0.7);
            const dy = y - 1.0;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.45 && dist < 0.6 && z > fanCenterZ + 0.3) {
              // Randomly skip some pixels
              if ((x * 10) % 2 < 1.5) col = C_FAN_RING;
            }
            add(x, baseY + 0.5 + y, z, col, serverIdx, 6);
          }
        }
      }
    }

    // 主板
    for (let x = -7; x <= 7; x += baseStep) {
      for (let z = -8; z <= 6; z += baseStep) {
        // Socket/Chipset areas
        let col = C_PCB;
        if (Math.abs(x) < 3.0 && Math.abs(z - 1.0) < 3.0) col = C_SOCKET;
        add(x, baseY + 0.2, z, col, serverIdx, 3);
      }
    }

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
            let col = C_RAM_DARK;
            if (h < 0.03) col = C_RAM_GOLD; // Gold contacts very thin
            add(stickX, baseY + 0.5 + h, z, col, serverIdx, 5);
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
              else if (localX > 0.3 && localX < 0.4) col = C_GPU_ACCENT; // Red Accent Stripe
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
    emissives: new Float32Array(emissives),
    count: particles.length / 3
  };
};

// --- Hooks and State ---

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const quality = ref('ultra'); // Default quality
const progress = ref(0);

// Expose setProgress for parent component
const setProgress = (val: number) => {
  progress.value = val;
};
// Compatible method for old interface, though we just use linear progress now
const setAnimationPhase = (phase: number, phaseProgress: number) => {
  // Assuming phases map linearly to 0-1 range roughly
  // But we prefer direct 0-1 control if possible.
  // If we must implement compatibility:
  // Phase 0 (0-20%): 0.2 * phaseProgress
  // Phase 1 (20-50%): 0.2 + 0.3 * phaseProgress
  // Phase 2 (50-80%): 0.5 + 0.3 * phaseProgress
  // Phase 3 (80-100%): 0.8 + 0.2 * phaseProgress
  let mappedProgress = 0;
  if (phase === 0) mappedProgress = 0.2 * phaseProgress;
  else if (phase === 1) mappedProgress = 0.2 + 0.3 * phaseProgress;
  else if (phase === 2) mappedProgress = 0.5 + 0.3 * phaseProgress;
  else if (phase === 3) mappedProgress = 0.8 + 0.2 * phaseProgress;
  progress.value = mappedProgress;
};

defineExpose({
  setProgress,
  setAnimationPhase
});

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let particleSystem: THREE.Points;
let pointsMaterial: THREE.ShaderMaterial;
let animationFrameId: number;
let controls: OrbitControls;
let rotationPivot: THREE.Group; // Pivot for mouse rotation around dynamic center

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return;

  // Initialize Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // Pure White Background

  // Initialize Camera
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera = new THREE.PerspectiveCamera(30, width / height, 5, 200); // FOV 30
  // ... camera position ...
  camera.position.set(25, 5, 65);

  // Initialize Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance" // Ensure good performance for HDR
  });
  renderer.setSize(width, height);
  // Remove duplicate setSize
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Initialize Post-Processing Composer with HDR Buffer (HalfFloatType)
  // This allows values > 1.0 so we can isolate bloom from white background (1.0)
  const renderTarget = new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
  });

  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.0,  // strength
    0.5,  // radius (slightly smoother)
    1.05   // threshold (Lowered slightly to match reduced emissive)
  );

  composer = new EffectComposer(renderer, renderTarget);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Initialize OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5; // Slightly faster rotation
  controls.minDistance = 5;
  controls.maxDistance = 200;
  controls.target.set(0, 0, 0);
  controls.enablePan = false;
  controls.enableZoom = false; // Disable zoom to prevent wheel scroll from changing view
  controls.enableDamping = true; // Add smooth damping

  // Generate Geometry
  const data = generateModel(quality.value);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3));
  geometry.setAttribute('aServerIndex', new THREE.BufferAttribute(data.serverIndices, 1));
  geometry.setAttribute('aPartType', new THREE.BufferAttribute(data.partTypes, 1));
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(data.randoms, 3));
  geometry.setAttribute('aIsGhost', new THREE.BufferAttribute(data.isGhosts, 1));
  geometry.setAttribute('aEmissive', new THREE.BufferAttribute(data.emissives, 1));

  // Setup Material
  pointsMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelScale: { value: quality.value === 'ultra' ? 1.0 : 1.5 },
    },
    transparent: true,
  });

  particleSystem = new THREE.Points(geometry, pointsMaterial);

  // Create rotation pivot for proper mouse rotation center
  rotationPivot = new THREE.Group();
  rotationPivot.position.y = -4.8; // Initial position at bottom server motherboard (baseY=-5.0 + 0.2 for PCB)
  rotationPivot.add(particleSystem);
  scene.add(rotationPivot);

  // Disable frustum culling to prevent model disappearing during rotation/explosion
  particleSystem.frustumCulled = false;

  // Resize Handler
  let viewWidth = 0;
  let viewHeight = 0;

  const handleResize = () => {
    if (!containerRef.value) return;
    viewWidth = containerRef.value.clientWidth;
    viewHeight = containerRef.value.clientHeight;
    camera.aspect = viewWidth / viewHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewWidth, viewHeight);
    composer.setSize(viewWidth, viewHeight);
  };
  window.addEventListener('resize', handleResize);
  // Initial capture
  handleResize();

  // Mouse Interaction for Parallax/Rotation
  let mouseX = 0;
  let mouseY = 0;
  const handleMouseMove = (event: MouseEvent) => {
    // Normalize mouse position -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', handleMouseMove);

  // Animation Loop
  const clock = new THREE.Clock();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    if (pointsMaterial) {
      pointsMaterial.uniforms['uTime']!.value = elapsedTime;
      pointsMaterial.uniforms['uProgress']!.value = progress.value;
    }

    // Rig Logic (Camera/Group movement)
    // 1. Calculate Rig Progress based on animation progress
    const startThreshold = 0.05; // Start moving sooner
    let rigProgress = 0;
    if (progress.value > startThreshold) {
      rigProgress = (progress.value - startThreshold) / (1.0 - startThreshold);
    }
    // Easing function for smooth transition
    const easeRig = 1.0 - Math.pow(1.0 - rigProgress, 3.0);


    // 2. View Offset for Horizontal Movement (Right -> Center) and Vertical tracking
    if (viewWidth > 0 && viewHeight > 0) {
      const isMobile = viewWidth < 768; // Mobile Breakpoint

      // Horizontal:
      // Desktop: Start right (-0.25), move to center (0)
      // Mobile: Start center (0), stay center (0)
      const currentOffset = isMobile ? 0 : -viewWidth * 0.25 * (1.0 - easeRig);

      // Vertical offset: Start with downward offset (model lower), then move UP to follow explosion
      // Initial: Negative value moves model DOWN in the frame
      // Mobile: Move further down (0.75) to avoid title overlap completely
      const downRatio = isMobile ? 0.75 : 0.15;
      const initialDownOffset = -viewHeight * downRatio;

      // We want to move from initialDownOffset (low) to a centered or slightly high position
      const targetUpOffset = isMobile ? viewHeight * 0.0 : -viewHeight * 0.15; // End at center (mobile) or slight up (desktop)

      const totalMoveUp = targetUpOffset - initialDownOffset; // Positive distance

      const cameraUpwardEase = Math.pow(rigProgress, 1.2); // Slightly more linear ease for better tracking
      const currentOffsetY = initialDownOffset + (totalMoveUp * cameraUpwardEase);

      camera.setViewOffset(viewWidth, viewHeight, currentOffset, currentOffsetY, viewWidth, viewHeight);
    }


    // 3. Calculate explosion progress first (needed for camera distance)
    // Bottom server: serverIndex=2, baseY=-5.0, motherboard at baseY+0.2=-4.8
    const bottomServerIndex = 2;
    const delay = bottomServerIndex * 0.12; // 0.24
    const rawProgress = (progress.value * 1.5 - delay);

    // smoothstep function
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    const effectiveProgress = smoothstep(0.0, 1.0, rawProgress);

    // Stage 3: Explosion progress (starts at effectiveProgress=0.45)
    const explode = smoothstep(0.45, 1.0, effectiveProgress);

    // Camera Zoom/Position Logic:
    // REMOVED Z-axis pull back to fix "shrinking" issue and conflict with controls.
    // instead, we will adjust Camera Y to maintain a "Top-Down" view (Look Down)

    // 4. Calculate Bottom Server Motherboard Position (replicating shader logic)
    // Three servers: serverIndex=2,3,4
    // Bottom server (2): baseY=-5.0, motherboard at -4.8
    // Middle server (3): baseY=0.0, motherboard at 0.2
    // Top server (4): baseY=5.0, motherboard at 5.2
    const motherboardInitialY = -4.8;
    const topMotherboardInitialY = 5.2; // Top server motherboard
    const motherboardInitialZ = 0.0;

    const easeOutCubic = (x: number) => 1.0 - Math.pow(1.0 - x, 3.0);
    const easeExplode = easeOutCubic(explode);

    // Stage 1: Slide out (Z axis)
    const slideDist = smoothstep(0.0, 0.3, effectiveProgress) * 40.0;

    // Rotation Center Logic:
    // - During slide-out (explode = 0): Fixed at bottom motherboard (-4.8)
    // - During explosion (explode = 0->1): Transition from bottom (-4.8) to top (5.2) motherboard
    const rotationCenterBaseY = motherboardInitialY + (topMotherboardInitialY - motherboardInitialY) * easeExplode;
    const rotationCenterExplosionY = easeExplode * 6.0; // Explosion upward movement

    // Calculate rotation center position in shader local coordinates
    const rotationCenterShaderY = rotationCenterBaseY + rotationCenterExplosionY;
    const rotationCenterShaderZ = motherboardInitialZ + slideDist;

    // 5. Rig Logic
    const targetZ = easeRig * -80.0; // Camera movement
    const targetY = easeRig * -5.0;  // Object movement
    const targetScale = 0.75 + (easeRig * 0.55);

    // 6. Transform
    if (particleSystem && rotationPivot) {
      // Calculate rotation center world position
      const rotationCenterWorldY = rotationCenterShaderY * targetScale + targetY;
      const rotationCenterWorldZ = rotationCenterShaderZ * targetScale + targetZ;

      // Set pivot to rotation center position
      rotationPivot.position.y = rotationCenterWorldY;
      rotationPivot.position.z = rotationCenterWorldZ;
      controls.target.y = rotationCenterWorldY;
      controls.target.z = rotationCenterWorldZ;

      // CRITICAL: Update Camera Y to maintain "Top-Down" view
      // Always keep camera higher than the target center
      // Initial CenterWorldY is approx -3.6. Initial CameraY is 5. Difference is ~8.6
      const cameraHeightOffset = 9.0;
      const targetCameraY = rotationCenterWorldY + cameraHeightOffset;
      // Lerp camera Y to follow the center UP
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY, 0.1);

      // Adjust particleSystem position to compensate
      // We want: particleSystem.position + shader * scale = 0 (relative to pivot)
      // So: particleSystem.position = -shader * scale
      particleSystem.position.x = 0;

      const targetParticleY = targetY - rotationCenterWorldY;
      const targetParticleZ = targetZ - rotationCenterWorldZ;

      particleSystem.position.y = THREE.MathUtils.lerp(particleSystem.position.y, targetParticleY, 0.05);
      particleSystem.position.z = THREE.MathUtils.lerp(particleSystem.position.z, targetParticleZ, 0.05);

      // Scale
      const currentScale = particleSystem.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      particleSystem.scale.setScalar(nextScale);

      // Rotation (Mouse Interaction)
      const targetRotX = mouseY * 0.10;
      const targetRotY = mouseX * 0.80;

      rotationPivot.rotation.x = THREE.MathUtils.lerp(rotationPivot.rotation.x, targetRotX, 0.05);
      rotationPivot.rotation.y = THREE.MathUtils.lerp(rotationPivot.rotation.y, targetRotY, 0.05);
    }

    controls.update();
    // Use composer for bloom effect instead of standard renderer
    composer.render();
  };

  animate();

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationFrameId);
    renderer.dispose();
    geometry.dispose();
    pointsMaterial.dispose();
  });
});
</script>

<style scoped>
/* Ensure canvas block display to avoid inline spacing issues */
canvas {
  display: block;
}
</style>
