<template>
  <div ref="containerRef" class="w-full h-full relative">
    <canvas ref="canvasRef" class="w-full h-full block" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

interface Props {
  backgroundColor?: string
  autoRotate?: boolean
  mouseParallax?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#F5F5F7',
  autoRotate: false,
  mouseParallax: true,
})

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number
let cube: THREE.Mesh
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0

// 動畫狀態
const currentPhase = ref(0)

// 暴露給父組件的方法
const setAnimationPhase = (phase: number, progress: number) => {
  currentPhase.value = phase
  if (!cube) return

  switch (phase) {
    case 0: // 淡入階段
      cube.position.set(0, 0, 0)
      cube.rotation.set(0, 0, 0)
      cube.scale.setScalar(1 + progress * 0.2)
      break
    case 1: // 機櫃打開階段
      cube.rotation.y = progress * Math.PI * 0.5
      cube.position.x = progress * 1
      break
    case 2: // 組件爆炸階段
      const explodeDistance = progress * 2
      cube.position.set(explodeDistance, explodeDistance * 0.5, 0)
      cube.rotation.set(progress * Math.PI, progress * Math.PI * 0.5, 0)
      break
    case 3: // 重新組裝階段
      cube.position.set(2 * (1 - progress), 1 * (1 - progress), 0)
      cube.rotation.set(Math.PI * (1 - progress), Math.PI * 0.5 * (1 - progress), 0)
      break
  }
}

const resetAnimation = () => {
  if (!cube) return
  cube.position.set(0, 0, 0)
  cube.rotation.set(0, 0, 0)
  cube.scale.setScalar(1)
  currentPhase.value = 0
}

defineExpose({
  setAnimationPhase,
  resetAnimation,
  currentPhase,
})

const initScene = () => {
  if (!canvasRef.value || !containerRef.value) {
    console.warn('ServerScene: Canvas or container reference is missing')
    return
  }

  try {
    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(props.backgroundColor)

    // Camera
    const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.position.z = 5

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Geometry - Server Rack representation
    const group = new THREE.Group()

    // Main Body
    const bodyGeom = new THREE.BoxGeometry(2, 4, 2)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2e,
      metalness: 0.9,
      roughness: 0.1,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    group.add(body)

    // Segments (Server units)
    for (let i = 0; i < 8; i++) {
      const segGeom = new THREE.BoxGeometry(1.9, 0.3, 0.1)
      const segMat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0x0071e3 : 0x1d1d1f,
        emissive: i % 3 === 0 ? 0x0071e3 : 0x000000,
        emissiveIntensity: 0.5,
      })
      const seg = new THREE.Mesh(segGeom, segMat)
      seg.position.set(0, 1.4 - i * 0.4, 1.01)
      group.add(seg)
    }

    cube = group as any // Reusing the 'cube' variable name for the group
    scene.add(group)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Rim light for outline effect
    const rimLight = new THREE.SpotLight(0x0071e3, 2)
    rimLight.position.set(-5, 5, -5)
    scene.add(rimLight)

    // Event listeners
    window.addEventListener('resize', onWindowResize)
    if (props.mouseParallax) {
      document.addEventListener('mousemove', onMouseMove)
    }

    // Start animation
    animate()
  } catch (error) {
    console.error('ServerScene: Failed to initialize 3D scene', error)
  }
}

const onWindowResize = () => {
  if (!containerRef.value || !camera || !renderer) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

const onMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  if (cube && props.autoRotate) {
    cube.rotation.x += 0.005
    cube.rotation.y += 0.01
  }

  // Mouse parallax effect
  if (cube && props.mouseParallax) {
    targetX = mouseX * 0.5
    targetY = mouseY * 0.5

    cube.rotation.x += (targetY - cube.rotation.x) * 0.05
    cube.rotation.y += (targetX - cube.rotation.y) * 0.05
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  // 使用 nextTick 确保 DOM 完全准备好
  nextTick(() => {
    if (containerRef.value && canvasRef.value) {
      initScene()
    } else {
      console.warn('ServerScene: Canvas or container not available')
    }
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  if (props.mouseParallax) {
    document.removeEventListener('mousemove', onMouseMove)
  }

  // Cleanup Three.js resources
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
