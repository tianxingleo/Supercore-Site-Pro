/**
 * ============================================================================
 * 服务器 3D 场景组合式函数（Server 3D Scene Composable）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是一个 Vue 3 组合式函数（Composable），用于管理 3D 服务器场景的状态和动画。
 * 使用 Three.js 库创建 3D 图形，包括场景、相机、渲染器、光照和 3D 模型。
 *
 * 为什么需要 3D 场景？
 * 1. 增强用户体验：3D 模型可以展示产品细节
 * 2. 提升品牌形象：3D 效果展示技术实力
 * 3. 交互体验：用户可以旋转、缩放查看产品
 * 4. 瑞士设计：3D 效果符合瑞士设计的现代感
 *
 * 实现手段：
 * 1. 使用 Three.js 库创建 3D 图形
 * 2. 使用 OBJLoader 和 MTLLoader 加载 3D 模型
 * 3. 使用 Vue 3 Composition API 管理状态
 * 4. 使用 requestAnimationFrame 实现动画循环
 * 5. 自动处理窗口大小变化
 * 6. 组件卸载时清理资源，避免内存泄漏
 *
 * 核心功能：
 * 1. initScene()：初始化 3D 场景
 *    - 创建场景、相机、渲染器
 *    - 配置光照（环境光、主光、轮廓光）
 * 2. loadModel()：加载 3D 模型
 *    - 使用 MTLLoader 加载材质文件（.mtl）
 *    - 使用 OBJLoader 加载模型文件（.obj）
 *    - 自动居中和缩放模型
 * 3. addPlaceholderServer()：添加立方体占位符
 *    - 用于没有 3D 模型时的降级版本
 * 4. animate()：动画循环
 *    - 每帧渲染场景
 * 5. handleResize()：处理窗口大小变化
 *    - 更新相机和渲染器尺寸
 * 6. cleanup()：清理资源
 *    - 停止动画循环
 *    - 释放内存
 *
 * Three.js 核心概念：
 * 1. Scene（场景）：3D 对象的容器
 * 2. Camera（相机）：定义观察视角
 * 3. Renderer（渲染器）：将 3D 场景渲染到 2D 屏幕
 * 4. Mesh（网格）：3D 物体，由几何体和材质组成
 * 5. Geometry（几何体）：定义形状（立方体、球体等）
 * 6. Material（材质）：定义表面属性（颜色、金属度等）
 * 7. Light（光照）：照亮场景（环境光、方向光等）
 *
 * 光照配置（瑞士风格摄影灯光）：
 * 1. Ambient Light（环境光）：基础照明，0.6 强度
 * 2. Directional Light（主光）：主要光源，1.0 强度，位置 (5, 5, 5)
 * 3. Spot Light（轮廓光）：边缘照明，2.0 强度，位置 (-5, 5, -5)
 *
 * 使用示例：
 * ```vue
 * <script setup>
 * const {
 *   scene,
 *   camera,
 *   renderer,
 *   canvasRef,
 *   containerRef,
 *   isLoaded,
 *   initScene,
 *   addServerModel,
 *   animate,
 *   handleResize,
 *   cleanup,
 * } = useServerScene()
 *
 * // 组件挂载时初始化场景
 * onMounted(() => {
 *   initScene()
 *   addServerModel('/models/server.mtl', '/models/server.obj')
 *   animate()
 *   window.addEventListener('resize', handleResize)
 * })
 *
 * // 组件卸载时清理资源
 * onUnmounted(() => {
 *   cleanup()
 * })
 * </script>
 *
 * <template>
 *   <div ref="containerRef" class="w-full h-full">
 *     <canvas ref="canvasRef"></canvas>
 *   </div>
 * </template>
 * ```
 *
 * 3D 模型格式：
 * - OBJ（.obj）：3D 模型文件，定义几何形状
 * - MTL（.mtl）：材质文件，定义材质属性
 *
 * 性能优化：
 * 1. 使用 requestAnimationFrame 优化动画性能
 * 2. 组件卸载时清理资源，避免内存泄漏
 * 3. 使用对象池（可选）
 * 4. 使用纹理压缩（可选）
 * 5. 使用 LOD（细节层次，可选）
 *
 * 依赖项：
 * - vue：Vue 3 核心库
 * - three：Three.js 3D 图形库
 * - @three/examples/jsm/loaders/OBJLoader：OBJ 加载器
 * - @three/examples/jsm/loaders/MTLLoader：MTL 加载器
 *
 * 注意事项：
 * 1. Three.js 只能在浏览器中运行（不能在服务端渲染）
 * 2. 需要确保 canvas 和 container 元素已挂载到 DOM
 * 3. 组件卸载时必须清理资源，否则会内存泄漏
 * 4. 3D 模型文件需要放在 public 目录或可访问的 CDN
 * 5. 确保模型文件路径正确
 *
 * 兼容性：
 * - 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
 * - 需要浏览器支持 WebGL
 * - 移动端性能可能受限，建议使用降级版本
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// ref：Vue 响应式引用函数
// onMounted：Vue 生命周期钩子，组件挂载时执行
// onUnmounted：Vue 生命周期钩子，组件卸载前执行
import { ref, onMounted, onUnmounted } from 'vue'

// Three.js：3D 图形库
// 包含场景、相机、渲染器等 3D 核心类
import * as THREE from 'three'

// OBJLoader：加载 OBJ 格式的 3D 模型文件
// OBJ 是一种通用的 3D 模型文件格式
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

// MTLLoader：加载 MTL 格式的材质文件
// MTL 是与 OBJ 配套的材质文件格式
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

// ============================================================================
// 服务器 3D 场景组合式函数
// ============================================================================
/**
 * useServerScene() - 服务器 3D 场景组合式函数
 *
 * 功能：
 * 管理 3D 服务器场景的状态和动画。
 * 提供 3D 场景的初始化、模型加载、动画循环和资源清理功能。
 *
 * 返回值：
 * - scene：3D 场景对象
 * - camera：相机对象
 * - renderer：渲染器对象
 * - canvasRef：canvas 元素引用
 * - containerRef：容器元素引用
 * - isLoaded：是否已加载（响应式）
 * - initScene：初始化 3D 场景的函数
 * - addServerModel：加载 3D 模型的函数
 * - animate：动画循环函数
 * - handleResize：处理窗口大小变化的函数
 * - cleanup：清理资源的函数
 *
 * 使用场景：
 * 1. 首页 Hero Section 的 3D 服务器模型
 * 2. 产品详情页的 3D 产品展示
 * 3. 其他需要 3D 效果的页面
 */
export const useServerScene = () => {
  // ============================================================================
  // 响应式状态
  // ============================================================================
  // scene：3D 场景对象
  // 3D 对象的容器，包含所有的 Mesh、Light 等
  const scene = ref<THREE.Scene | null>(null)

  // camera：相机对象
  // 定义观察视角（位置、方向、视野等）
  const camera = ref<THREE.PerspectiveCamera | null>(null)

  // renderer：渲染器对象
  // 将 3D 场景渲染到 2D 屏幕（canvas）
  const renderer = ref<THREE.WebGLRenderer | null>(null)

  // canvasRef：canvas 元素引用
  // 用于 Three.js 渲染的目标
  const canvasRef = ref<HTMLCanvasElement>()

  // containerRef：容器元素引用
  // 用于获取容器尺寸和绑定事件
  const containerRef = ref<HTMLDivElement>()

  // isLoaded：是否已加载
  // 用于判断场景是否初始化完成
  const isLoaded = ref(false)

  // ============================================================================
  // 动画循环 ID
  // ============================================================================
  // animationId：requestAnimationFrame 返回的 ID
  // 用于停止动画循环
  let animationId: number

  // ============================================================================
  // 初始化 3D 场景
  // ============================================================================
  /**
   * initScene() - 初始化 3D 场景
   * 
   * 功能：
   * 创建 Three.js 的核心对象：场景、相机、渲染器和光照。
   * 配置瑞士风格的摄影灯光效果。
   * 
   * 检查：
   * - 确保 canvas 和 container 元素已挂载
   * - 避免重复初始化
   * 
   * 创建对象：
   * 1. Scene：3D 场景容器
   * 2. PerspectiveCamera：透视相机
   * 3. WebGLRenderer：WebGL 渲染器
   * 4. AmbientLight：环境光（基础照明）
   * 5. DirectionalLight：方向光（主光）
   * 6. SpotLight：聚光灯（轮廓光）
   * 
   * 瑞士风格摄影灯光：
   * - Ambient Light：0.6 强度，提供基础照明
   * - Directional Light：1.0 强度，位置 (5, 5, 5)，主要光源
   * - Spot Light：2.0 强度，位置 (-5, 5, -5)，边缘照明
   * 
   * 相机配置：
   * - FOV：75 度（标准视野角度）
   - Aspect：根据容器尺寸计算
   - Near：0.1（最近裁剪面）
   * - Far：1000（最远裁剪面）
   * - Position：(0, 0, 5)
   * 
   * 渲染器配置：
   * - Antialias：true（抗锯齿，边缘更平滑）
   * - Alpha：true（支持透明背景）
   * - Pixel Ratio：根据设备像素比设置
   */
  const initScene = () => {
    // 检查 canvas 和 container 元素是否存在
    if (!canvasRef.value || !containerRef.value) return

    // ============================================================================
    // 场景（Scene）
    // ============================================================================
    // THREE.Scene()：创建 3D 场景对象
    // 场景是所有 3D 对象的容器
    scene.value = new THREE.Scene()

    // 设置场景背景色
    // #F5F5F7：浅灰色，瑞士设计风格
    scene.value.background = new THREE.Color('#F5F5F7')

    // ============================================================================
    // 相机（Camera）
    // ============================================================================
    // 获取容器尺寸
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    // 计算宽高比
    const aspect = width / height

    // 创建透视相机
    // THREE.PerspectiveCamera(fov, aspect, near, far)：
    // - fov：视野角度（度），75 是标准视角
    // - aspect：宽高比
    // - near：最近裁剪面（距离相机多近开始渲染）
    // - far：最远裁剪面（距离相机多远停止渲染）
    camera.value = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)

    // 设置相机位置
    // set(x, y, z)：设置 3D 坐标
    // (0, 0, 5)：x=0, y=0, z=5
    // z=5 表示相机距离场景中心 5 个单位
    camera.value.position.set(0, 0, 5)

    // ============================================================================
    // 渲染器（Renderer）
    // ============================================================================
    // 创建 WebGL 渲染器
    // THREE.WebGLRenderer(options)：
    // - canvas：渲染目标 canvas 元素
    // - antialias：抗锯齿（边缘更平滑）
    // - alpha：支持透明背景
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    })

    // 设置渲染器尺寸
    // setSize(width, height)：设置渲染画布的宽度和高度
    renderer.value.setSize(width, height)

    // 设置像素比
    // setPixelRatio(ratio)：设置渲染像素比
    // window.devicePixelRatio：设备像素比（DPR）
    // 例如：Retina 屏幕的 DPR 为 2
    renderer.value.setPixelRatio(window.devicePixelRatio)

    // ============================================================================
    // 光照（Lighting）- 瑞士风格摄影灯光
    // ============================================================================

    // 1. 环境光（Ambient Light）
    // 提供基础照明，照亮所有物体
    // THREE.AmbientLight(color, intensity)：
    // - color：光照颜色（白色）
    // - intensity：光照强度（0-1），0.6 表示 60% 强度
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.value.add(ambientLight) // 将光照添加到场景

    // 2. 主光（Directional Light）
    // 模拟太阳光或主光源，照亮主体
    // THREE.DirectionalLight(color, intensity)：
    // - color：光照颜色（白色）
    // - intensity：光照强度，1.0 表示 100% 强度
    const mainLight = new THREE.DirectionalLight(0xffffff, 1)

    // 设置主光位置
    // set(x, y, z)：设置光源位置
    // (5, 5, 5)：从右上方照射
    mainLight.position.set(5, 5, 5)
    scene.value.add(mainLight) // 将光照添加到场景

    // 3. 轮廓光（Spot Light）
    // 模拟轮廓光，从背侧照亮物体，增强边缘
    // THREE.SpotLight(color, intensity)：
    // - color：光照颜色（#0071e3，蓝色）
    // - intensity：光照强度，2.0 表示 200% 强度
    const rimLight = new THREE.SpotLight(0x0071e3, 2)

    // 设置轮廓光位置
    // (-5, 5, -5)：从左侧背方照射
    rimLight.position.set(-5, 5, -5)

    // 设置轮廓光角度
    // angle：聚光灯的角度（弧度）
    // Math.PI / 6 = 30 度
    rimLight.angle = Math.PI / 6
    scene.value.add(rimLight) // 将光照添加到场景

    // 场景加载完成
    isLoaded.value = true
  }

  // ============================================================================
  // 加载 3D 模型
  // ============================================================================
  /**
   * loadModel() - 加载 3D 模型
   *
   * 功能：
   * 加载 OBJ 格式的 3D 模型和 MTL 格式的材质文件。
   * 自动居中和缩放模型，使其适合显示。
   *
   * @param mtlPath - 材质文件路径（.mtl）
   * @param objPath - 模型文件路径（.obj）
   *
   * 返回值：
   * Promise<THREE.Group>：Promise，返回包含模型的 Group 对象
   *
   * 处理流程：
   * 1. 加载 MTL 文件（材质）
   * 2. 预加载材质纹理
   * 3. 设置 OBJLoader 使用材质
   * 4. 加载 OBJ 文件（模型）
   * 5. 遍历模型，启用阴影
   * 6. 计算包围盒
   * 7. 自动居中和缩放
   * 8. 创建 Group 对象并添加到场景
   *
   * 自动居中和缩放：
   * - 计算模型的包围盒（Box3）
   * - 计算包围盒的中心和尺寸
   * - 缩放模型使最大尺寸为 4 个单位
   * - 将模型移动到场景中心
   *
   * 阴影配置：
   * - castShadow：物体投射阴影
   * - receiveShadow：物体接收阴影
   *
   * 注意事项：
   * - MTL 和 OBJ 文件必须配套使用
   * - 文件路径需要正确，从 public 目录或 CDN 加载
   * - 如果加载失败，会 reject Promise
   */
  const loadModel = async (mtlPath: string, objPath: string) => {
    // 检查场景是否已初始化
    if (!scene.value) return

    // ============================================================================
    // 创建加载器
    // ============================================================================
    // MTLLoader：材质加载器
    // 加载 .mtl 材质文件
    const mtlLoader = new MTLLoader()

    // OBJLoader：模型加载器
    // 加载 .obj 模型文件
    const objLoader = new OBJLoader()

    // ============================================================================
    // 加载模型和材质
    // ============================================================================
    // 返回 Promise，支持 async/await
    return new Promise<THREE.Group>((resolve, reject) => {
      // 1. 加载材质文件（.mtl）
      // mtlLoader.load(url, onLoad, onProgress, onError)：
      // - url：文件路径
      // - onLoad：加载成功回调
      // - onProgress：加载进度回调（可选）
      // - onError：加载失败回调（可选）
      mtlLoader.load(
        mtlPath,
        (materials) => {
          // 预加载材质纹理
          // materials.preload()：加载所有材质纹理
          materials.preload()

          // 设置 OBJLoader 使用材质
          // objLoader.setMaterials(materials)：为 OBJ 加载器设置材质
          objLoader.setMaterials(materials)

          // 2. 加载模型文件（.obj）
          objLoader.load(
            objPath,
            (object) => {
              // ============================================================================
              // 自定义处理：启用阴影
              // ============================================================================
              // object.traverse(callback)：遍历对象的所有子元素
              // callback：每个子元素的处理函数
              object.traverse((child) => {
                // 检查是否为 Mesh（网格）对象
                // Mesh 是由 Geometry 和 Material 组成的 3D 物体
                if (child instanceof THREE.Mesh) {
                  // castShadow：投射阴影
                  // 物体会在其他物体上投射阴影
                  child.castShadow = true

                  // receiveShadow：接收阴影
                  // 物体会接收其他物体投射的阴影
                  child.receiveShadow = true
                }
              })

              // ============================================================================
              // 自动居中和缩放
              // ============================================================================

              // 创建包围盒（Box3）
              // Box3：3D 轴对齐包围盒，用于计算 3D 对象的边界
              const box = new THREE.Box3().setFromObject(object)

              // 获取包围盒中心
              // getCenter(target)：计算包围盒的中心点
              // new THREE.Vector3()：目标向量（存储结果）
              const center = box.getCenter(new THREE.Vector3())

              // 获取包围盒尺寸
              // getSize(target)：计算包围盒的尺寸（宽、高、深）
              // new THREE.Vector3()：目标向量（存储结果）
              const size = box.getSize(new THREE.Vector3())

              // 计算最大尺寸
              // Math.max(x, y, z)：找出最大的尺寸
              // 用于计算缩放比例，确保模型适合显示
              const maxDim = Math.max(size.x, size.y, size.z)

              // 计算缩放比例
              // 目标最大尺寸为 4 个单位
              // scale = 4 / maxDim
              // 例如：如果 maxDim=2，则 scale=2（放大 2 倍）
              const scale = 4 / maxDim

              // 设置模型缩放
              // setScalar(scale)：在 X、Y、Z 三个方向上等比缩放
              object.scale.setScalar(scale)

              // 设置模型位置（居中）
              // set(x, y, z)：设置位置
              // -center.x * scale：将模型向左移动，使其居中
              // -center.y * scale：将模型向下移动，使其居中
              // -center.z * scale：将模型向前移动，使其居中
              object.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

              // ============================================================================
              // 创建 Group 对象
              // ============================================================================
              // Group：组合对象，可以包含多个 Mesh
              // 用于统一管理多个相关对象
              const group = new THREE.Group()

              // 将模型添加到 Group
              group.add(object)

              // 设置 Group 名称
              group.name = 'server'

              // 将 Group 添加到场景
              scene.value?.add(group)

              // 返回 Group 对象
              resolve(group)
            },
            undefined,
            reject
          ) // onProgress：undefined（不需要进度回调）
        },
        undefined,
        reject
      ) // onProgress：undefined（不需要进度回调）
    })
  }

  // ============================================================================
  // 添加立方体占位符
  // ============================================================================
  /**
   * addPlaceholderServer() - 添加立方体（简化版占位符服务器）
   *
   * 功能：
   * 创建一个简单的立方体作为服务器的占位符。
   * 用于没有 3D 模型文件时的降级版本。
   *
   * 为什么使用占位符？
   * - 3D 模型文件加载失败时
   * - 开发阶段没有 3D 模型文件时
   * - 性能受限设备使用简化版本时
   *
   * 立方体配置：
   * - 尺寸：2 x 3 x 1（宽 x 高 x 深）
   * - 颜色：深灰色（#1D1D1F）
   * - 金属度：0.9（高金属感）
   * - 粗糙度：0.1（光滑表面）
   *
   * 返回值：
   * THREE.Mesh：立方体网格对象
   *
   * 使用场景：
   * ```javascript
   * // 如果 3D 模型加载失败，使用占位符
   * try {
   *   await addServerModel('/models/server.mtl', '/models/server.obj')
   * } catch (error) {
   *   addPlaceholderServer()
   * }
   * ```
   */
  const addPlaceholderServer = () => {
    // 检查场景是否已初始化
    if (!scene.value) return

    // ============================================================================
    // 创建立方体几何体
    // ============================================================================
    // THREE.BoxGeometry(width, height, depth)：
    // - width：宽度（X 轴）
    // - height：高度（Y 轴）
    // - depth：深度（Z 轴）
    const geometry = new THREE.BoxGeometry(2, 3, 1)

    // ============================================================================
    // 创建标准材质
    // ============================================================================
    // THREE.MeshStandardMaterial(options)：
    // 基于物理的渲染（PBR）材质
    // - color：表面颜色（深灰色）
    // - metalness：金属度（0-1），0.9 表示 90% 金属感
    // - roughness：粗糙度（0-1），0.1 表示 10% 粗糙度（光滑）
    const material = new THREE.MeshStandardMaterial({
      color: 0x1d1d1f, // 深灰色
      metalness: 0.9, // 高金属感
      roughness: 0.1, // 光滑表面
    })

    // ============================================================================
    // 创建网格（Mesh）
    // ============================================================================
    // THREE.Mesh(geometry, material)：
    // - geometry：几何体（形状）
    // - material：材质（表面属性）
    const serverMesh = new THREE.Mesh(geometry, material)

    // 设置 Mesh 名称
    // 用于后续识别和操作
    serverMesh.name = 'server'

    // 将 Mesh 添加到场景
    scene.value.add(serverMesh)

    // 返回 Mesh 对象
    return serverMesh
  }

  // ============================================================================
  // 动画循环
  // ============================================================================
  /**
   * animate() - 动画循环
   *
   * 功能：
   * 使用 requestAnimationFrame 创建渲染循环。
   * 每帧调用渲染器，将场景渲染到 canvas。
   *
   * requestAnimationFrame：
   * - 浏览器提供的 API，用于创建平滑的动画
   * - 在屏幕刷新时调用回调函数（通常 60fps）
   * - 返回动画 ID，用于停止动画循环
   *
   * 为什么需要动画循环？
   * - 3D 场景可能包含动画（旋转、移动等）
   * - 即使没有动画，也需要持续渲染以保持场景更新
   *
   * 性能优化：
   * - 只在需要时启动动画循环
   * - 组件卸载时停止动画循环
   * - 避免不必要的渲染
   */
  const animate = () => {
    // 启动动画循环
    // requestAnimationFrame(callback)：请求下一帧动画
    // 返回动画 ID，用于停止动画循环
    animationId = requestAnimationFrame(animate)

    // 渲染场景
    // 检查所有必要对象是否存在
    if (renderer.value && scene.value && camera.value) {
      // renderer.render(scene, camera)：将场景渲染到 canvas
      renderer.value.render(scene.value, camera.value)
    }
  }

  // ============================================================================
  // 处理窗口大小变化
  // ============================================================================
  /**
   * handleResize() - 处理窗口大小变化
   *
   * 功能：
   * 当窗口大小变化时，更新相机和渲染器的尺寸。
   * 确保 3D 场景始终正确显示。
   *
   * 更新内容：
   * 1. 更新相机的宽高比
   * 2. 更新相机的投影矩阵
   * 3. 更新渲染器的尺寸
   *
   * 为什么要处理窗口大小变化？
   * - 相机需要根据新的宽高比调整视角
   * - 渲染器需要根据新的尺寸调整画布
   * - 避免场景变形或拉伸
   *
   * 性能优化：
   * - 可以使用防抖（debounce）减少频繁更新
   * - 只在窗口大小真正变化时更新
   */
  const handleResize = () => {
    // 检查所有必要对象是否存在
    if (!containerRef.value || !camera.value || !renderer.value) return

    // 获取容器的新尺寸
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    // 更新相机的宽高比
    // camera.aspect：宽高比（宽度 / 高度）
    camera.value.aspect = width / height

    // 更新相机的投影矩阵
    // updateProjectionMatrix()：根据新的 aspect 重新计算投影矩阵
    camera.value.updateProjectionMatrix()

    // 更新渲染器的尺寸
    // renderer.setSize(width, height)：设置渲染画布的宽度和高度
    renderer.value.setSize(width, height)
  }

  // ============================================================================
  // 清理资源
  // ============================================================================
  /**
   * cleanup() - 清理资源
   *
   * 功能：
   * 停止动画循环，移除事件监听器，释放内存。
   * 避免组件卸载后继续运行导致的内存泄漏。
   *
   * 清理内容：
   * 1. 停止动画循环
   * 2. 移除窗口大小变化监听器
   * 3. 释放渲染器内存
   * 4. 清空场景内容
   *
   * 为什么需要清理资源？
   * - 动画循环会持续运行，消耗 CPU 和内存
   * - 事件监听器如果不移除，会导致内存泄漏
   * - Three.js 对象如果不释放，会占用大量内存
   * - 组件卸载后不清理，会影响后续渲染
   *
   * 内存泄漏：
   * - 如果不清理，动画循环会继续运行
   * - 事件监听器会继续监听
   * - Three.js 对象不会被垃圾回收
   * - 最终导致浏览器卡顿或崩溃
   *
   * 调用时机：
   * - 组件卸载时（onUnmounted）
   * - 页面切换前
   * - 不再需要 3D 场景时
   */
  const cleanup = () => {
    // 停止动画循环
    // cancelAnimationFrame(id)：停止指定的动画循环
    // animationId：动画循环的 ID
    cancelAnimationFrame(animationId)

    // 移除窗口大小变化监听器
    // removeEventListener(event, listener)：移除事件监听器
    window.removeEventListener('resize', handleResize)

    // 释放渲染器内存
    // renderer.dispose()：释放渲染器占用的 GPU 内存
    // 清理 WebGL 上下文、纹理、着色器等
    if (renderer.value) {
      renderer.value.dispose()
    }

    // 清空场景内容
    // scene.clear()：移除场景中的所有对象
    // 清理 Mesh、Light、Group 等
    if (scene.value) {
      scene.value.clear()
    }
  }

  // ============================================================================
  // 返回对象
  // ============================================================================
  // 返回一个对象，包含所有公共方法和响应式状态
  // 其他组件可以通过解构赋值使用这些方法和状态
  return {
    scene, // 3D 场景对象
    camera, // 相机对象
    renderer, // 渲染器对象
    canvasRef, // canvas 元素引用
    containerRef, // 容器元素引用
    isLoaded, // 是否已加载
    initScene, // 初始化 3D 场景
    addServerModel, // 加载 3D 模型（注意：这里返回的键名是 addServerModel，不是 loadModel）
    animate, // 动画循环
    handleResize, // 处理窗口大小变化
    cleanup, // 清理资源
  }
}
