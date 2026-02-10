/**
 * Server 3D Scene Composable
 * 管理3D伺服器場景的狀態和動畫
 */

import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export const useServerScene = () => {
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const canvasRef = ref<HTMLCanvasElement>()
  const containerRef = ref<HTMLDivElement>()
  const isLoaded = useState('server-scene-loaded', () => false)

  let animationId: number

  /**
   * 初始化3D場景
   */
  const initScene = () => {
    if (!canvasRef.value || !containerRef.value) return

    // 創景
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color('#F5F5F7')

    // 相機
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    const aspect = width / height

    camera.value = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.value.position.set(0, 0, 5)

    // 渲染器
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    })
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(window.devicePixelRatio)

    // 燈光配置（瑞士風格攝影燈光）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.value.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1)
    mainLight.position.set(5, 5, 5)
    scene.value.add(mainLight)

    const rimLight = new THREE.SpotLight(0x0071e3, 2)
    rimLight.position.set(-5, 5, -5)
    rimLight.angle = Math.PI / 6
    scene.value.add(rimLight)

    isLoaded.value = true
  }

  /**
   * 載入 3D 模型
   */
  const loadModel = async (mtlPath: string, objPath: string) => {
    if (!scene.value) return

    const mtlLoader = new MTLLoader()
    const objLoader = new OBJLoader()

    return new Promise<THREE.Group>((resolve, reject) => {
      mtlLoader.load(mtlPath, (materials) => {
        materials.preload()
        objLoader.setMaterials(materials)
        objLoader.load(objPath, (object) => {
          // 自定義處理
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })

          // 自動居中和縮放
          const box = new THREE.Box3().setFromObject(object)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 4 / maxDim
          object.scale.setScalar(scale)
          object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

          const group = new THREE.Group()
          group.add(object)
          group.name = 'server'
          scene.value?.add(group)
          resolve(group)
        }, undefined, reject)
      }, undefined, reject)
    })
  }

  /**
   * 添加立方體（舊版佔位符伺服器）
   */
  const addPlaceholderServer = () => {
    if (!scene.value) return

    // 使用立方體作為伺服器的佔位符
    const geometry = new THREE.BoxGeometry(2, 3, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 0x1D1D1F,
      metalness: 0.9,
      roughness: 0.1,
    })

    const serverMesh = new THREE.Mesh(geometry, material)
    serverMesh.name = 'server'
    scene.value.add(serverMesh)

    return serverMesh
  }

  /**
   * 動畫循環
   */
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    if (renderer.value && scene.value && camera.value) {
      renderer.value.render(scene.value, camera.value)
    }
  }

  /**
   * 處理窗口大小變化
   */
  const handleResize = () => {
    if (!containerRef.value || !camera.value || !renderer.value) return

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()

    renderer.value.setSize(width, height)
  }

  /**
   * 清理資源
   */
  const cleanup = () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)

    if (renderer.value) {
      renderer.value.dispose()
    }
    if (scene.value) {
      scene.value.clear()
    }
  }

  return {
    scene,
    camera,
    renderer,
    canvasRef,
    containerRef,
    isLoaded,
    initScene,
    loadModel,
    animate,
    handleResize,
    cleanup,
  }
}
