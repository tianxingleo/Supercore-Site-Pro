/**
 * ============================================================================
 * 设备检测组合式函数（Device Detection Composable）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是一个 Vue 3 组合式函数（Composable），用于检测设备的类型和性能。
 * 根据检测结果，决定是否启用高级 3D 动画或其他性能敏感的功能。
 *
 * 为什么需要设备检测？
 * 1. 性能优化：低性能设备禁用 3D 动画，避免卡顿和电池消耗
 * 2. 用户体验：移动设备使用简化动画，提升加载速度
 * 3. 兼容性：检测 WebGL 支持，确保 3D 功能可用
 * 4. 响应式设计：根据屏幕尺寸调整布局和动画
 *
 * 实现手段：
 * 1. 使用 Vue 3 Composition API（ref、onMounted、onUnmounted）
 * 2. 检测 User Agent 字符串，判断设备类型
 * 3. 检测屏幕尺寸和像素比，判断设备性能
 * 4. 检测触摸支持，区分移动设备和桌面设备
 * 5. 检测 WebGL 支持，判断 3D 功能可用性
 * 6. 监听窗口大小变化，实时更新设备信息
 *
 * 核心功能：
 * 1. checkDevice()：检测设备信息
 *    - 设备类型（手机、平板、桌面）
 *    - 触摸支持
 *    - 性能等级（低性能/高性能）
 *    - 屏幕尺寸和像素比
 *
 * 2. canUseWebGL()：检测 WebGL 支持
 *    - 创建 canvas 元素
 *    - 尝试获取 WebGL 上下文
 *    - 返回是否支持
 *
 * 3. canUseAdvanced3D()：判断是否可以使用高级 3D 效果
 *    - 非低性能设备
 *    - 支持 WebGL
 *    - 桌面设备
 *
 * 设备分类：
 * 1. 手机（Mobile）：
 *    - User Agent 包含：android, webos, iphone, ipod, blackberry, iemobile, opera mini
 *    - 屏幕宽度 < 768px
 *    - 通常不支持高级 3D
 *
 * 2. 平板（Tablet）：
 *    - User Agent 包含：ipad, tablet, playbook, silk
 *    - 屏幕宽度 768px - 1023px
 *    - 可能支持基础 3D
 *
 * 3. 桌面（Desktop）：
 *    - 非手机、非平板
 *    - 屏幕宽度 >= 1024px
 *    - 通常支持高级 3D
 *
 * 性能判断：
 * 1. 高性能设备：
 *    - 像素比 <= 2
 *    - 屏幕宽度 >= 768px
 *    - 非移动设备
 *    - 可以使用高级 3D 动画
 *
 * 2. 低性能设备：
 *    - 像素比 > 2（高分辨率屏幕，如 Retina）
 *    - 屏幕宽度 < 768px（手机）
 *    - 移动设备
 *    - 禁用高级 3D 动画
 *
 * 使用示例：
 * ```vue
 * <script setup>
 * const { deviceInfo, canUseAdvanced3D } = useDeviceDetection()
 *
 * // 检查设备信息
 * console.log('设备类型：', deviceInfo.value.isMobile ? '手机' : deviceInfo.value.isTablet ? '平板' : '桌面')
 * console.log('触摸支持：', deviceInfo.value.isTouch)
 * console.log('性能等级：', deviceInfo.value.isLowPerformance ? '低性能' : '高性能')
 *
 * // 判断是否可以使用 3D
 * if (canUseAdvanced3D()) {
 *   console.log('启用高级 3D 动画')
 * } else {
 *   console.log('使用简化动画')
 * }
 * </script>
 * ```
 *
 * 模板中使用：
 * ```vue
 * <template>
 *   <!-- 桌面端：3D 场景 -->
 *   <ServerScene v-if="canUseAdvanced3D()" />
 *
 *   <!-- 移动端：降级版本 -->
 *   <MobileFallback v-else />
 * </template>
 * ```
 *
 * 技术细节：
 * 1. User Agent 检测：
 *    - navigator.userAgent：浏览器提供的用户代理字符串
 *    - toLowerCase()：转换为小写，便于匹配
 *    - 正则表达式：匹配设备特征字符串
 *
 * 2. 触摸检测：
 *    - 'ontouchstart' in window：检测触摸事件支持
 *    - navigator.maxTouchPoints > 0：检测触摸点数量
 *
 * 3. WebGL 检测：
 *    - document.createElement('canvas')：创建 canvas 元素
 *    - getContext('webgl') 或 'experimental-webgl'：获取 WebGL 上下文
 *    - 返回布尔值，表示是否支持
 *
 * 4. 响应式更新：
 *    - window.addEventListener('resize', checkDevice)：监听窗口大小变化
 *    - onUnmounted 时移除监听器，避免内存泄漏
 *
 * 性能优化：
 * 1. 懒检测：只在 onMounted 时检测，不阻塞渲染
 * 2. 事件监听器：使用 passive 模式（浏览器默认）
 * 3. 防抖（可选）：可以添加防抖，减少频繁更新
 * 4. 内存管理：onUnmounted 时移除事件监听器
 *
 * 依赖项：
 * - vue：Vue 3 核心库
 *
 * TypeScript 类型：
 * - DeviceInfo：设备信息接口
 *
 * 注意事项：
 * 1. User Agent 可能被伪造，不可完全依赖
 * 2. 屏幕尺寸更可靠，应优先使用
 * 3. WebGL 检测只在客户端有效（process.client）
 * 4. 需要确保在 onMounted 后调用检测函数
 *
 * 兼容性：
 * - 支持所有现代浏览器
 * - 支持移动设备和桌面设备
 * - 支持触摸设备和非触摸设备
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

// ============================================================================
// TypeScript 类型定义
// ============================================================================
/**
 * DeviceInfo 接口：设备信息类型定义
 *
 * 属性说明：
 * - isMobile：是否为手机设备
 * - isTablet：是否为平板设备
 * - isDesktop：是否为桌面设备
 * - isTouch：是否支持触摸
 * - isLowPerformance：是否为低性能设备
 * - pixelRatio：设备像素比（1, 2, 3 等）
 * - viewportWidth：视口宽度（像素）
 * - viewportHeight：视口高度（像素）
 */
export interface DeviceInfo {
  isMobile: boolean // 是否为手机设备
  isTablet: boolean // 是否为平板设备
  isDesktop: boolean // 是否为桌面设备
  isTouch: boolean // 是否支持触摸
  isLowPerformance: boolean // 是否为低性能设备
  pixelRatio: number // 设备像素比（DPR）
  viewportWidth: number // 视口宽度（像素）
  viewportHeight: number // 视口高度（像素）
}

// ============================================================================
// 设备检测组合式函数
// ============================================================================
/**
 * useDeviceDetection() - 设备检测组合式函数
 *
 * 功能：
 * 检测当前设备的类型、性能和特性。
 * 提供设备信息对象和判断函数，用于决定是否启用高级功能。
 *
 * 返回值：
 * - deviceInfo：设备信息响应式对象
 * - checkDevice：检测设备信息的函数
 * - canUseWebGL：判断是否支持 WebGL 的函数
 * - canUseAdvanced3D：判断是否可以使用高级 3D 的函数
 *
 * 使用场景：
 * 1. 根据设备类型加载不同的组件
 * 2. 根据性能等级启用/禁用动画
 * 3. 根据屏幕尺寸调整布局
 * 4. 根据触摸支持优化交互
 *
 * 初始值：
 * deviceInfo 默认为桌面设备（最安全的假设）
 * 在 onMounted 时会进行实际检测并更新
 */
export const useDeviceDetection = () => {
  // ============================================================================
  // 设备信息响应式对象
  // ============================================================================
  // deviceInfo：存储设备信息的响应式引用
  // 默认值：桌面设备（最安全的假设）
  // 在 onMounted 时会进行实际检测并更新
  const deviceInfo = ref<DeviceInfo>({
    isMobile: false, // 非手机
    isTablet: false, // 非平板
    isDesktop: true, // 桌面设备
    isTouch: false, // 不支持触摸
    isLowPerformance: false, // 高性能设备
    pixelRatio: 1, // 像素比为 1（标准屏幕）
    viewportWidth: 1920, // 视口宽度 1920px
    viewportHeight: 1080, // 视口高度 1080px
  })

  // ============================================================================
  // 检测设备信息
  // ============================================================================
  /**
   * checkDevice() - 检测设备信息
   *
   * 功能：
   * 检测当前设备的类型、性能和特性。
   * 更新 deviceInfo 响应式对象。
   *
   * 检测内容：
   * 1. 设备类型（手机、平板、桌面）
   * 2. 触摸支持
   * 3. 性能等级（低性能/高性能）
   * 4. 屏幕尺寸和像素比
   *
   * 调用时机：
   * - 组件挂载时（onMounted）
   * - 窗口大小变化时（resize 事件）
   *
   * 注意事项：
   * - 只在客户端执行（process.client）
   * - User Agent 可能被伪造，不可完全依赖
   * - 屏幕尺寸更可靠，应优先使用
   */
  const checkDevice = () => {
    // 确保只在客户端执行
    // process.client：Nuxt 提供的环境变量，判断是否在客户端
    if (process.client) {
      // 获取屏幕尺寸
      const width = window.innerWidth
      const height = window.innerHeight

      // 获取 User Agent 字符串并转换为小写
      const userAgent = navigator.userAgent.toLowerCase()

      // 获取设备像素比（DPR）
      // window.devicePixelRatio：设备像素比
      // 例如：1 = 标准屏幕，2 = Retina 屏幕，3 = 超高清屏幕
      const pixelRatio = window.devicePixelRatio || 1

      // 检测触摸设备
      // 'ontouchstart' in window：检测触摸事件支持
      // navigator.maxTouchPoints > 0：检测触摸点数量（支持多点触控）
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // 检测移动设备
      // 1. User Agent 匹配：android, webos, iphone, ipod, blackberry, iemobile, opera mini
      // 2. 屏幕宽度 < 768px
      // /i：忽略大小写
      // ||：逻辑或，满足任意条件即为手机
      const isMobile =
        /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width < 768

      // 检测平板
      // 1. User Agent 匹配：ipad, tablet, playbook, silk
      // 2. 屏幕宽度 768px - 1023px
      const isTablet =
        /ipad|tablet|playbook|silk/i.test(userAgent) || (width >= 768 && width < 1024)

      // 检测低性能设备（基于像素比和屏幕尺寸）
      // 1. 像素比 > 2（高分辨率屏幕，渲染压力大）
      // 2. 屏幕宽度 < 768px（手机）
      // 3. 移动设备（通常性能较低）
      // ||：逻辑或，满足任意条件即为低性能
      const isLowPerformance = pixelRatio > 2 || width < 768 || isMobile

      // 更新设备信息
      deviceInfo.value = {
        isMobile, // 是否为手机设备
        isTablet, // 是否为平板设备
        isDesktop: !isMobile && !isTablet, // 是否为桌面设备（非手机且非平板）
        isTouch, // 是否支持触摸
        isLowPerformance, // 是否为低性能设备
        pixelRatio, // 设备像素比
        viewportWidth: width, // 视口宽度
        viewportHeight: height, // 视口高度
      }
    }
  }

  // ============================================================================
  // 检测 WebGL 支持
  // ============================================================================
  /**
   * canUseWebGL() - 判断是否支持 WebGL
   *
   * 功能：
   * 检测浏览器是否支持 WebGL（Web Graphics Library）。
   * WebGL 是用于渲染 3D 图形的 JavaScript API。
   *
   * 检测方法：
   * 1. 创建 canvas 元素
   * 2. 尝试获取 WebGL 上下文
   * 3. 如果成功，则返回 true；否则返回 false
   *
   * 返回值：
   * - true：支持 WebGL，可以使用 3D 功能
   * - false：不支持 WebGL，禁用 3D 功能
   *
   * 注意事项：
   * - 只在客户端执行（process.client）
   * - 旧浏览器可能不支持 WebGL
   * - WebGL 1 和 WebGL 2 都会检测
   *
   * WebGL 支持情况：
   * - Chrome 9+：支持 WebGL
   * - Firefox 4+：支持 WebGL
   * - Safari 5.1+：支持 WebGL
   * - Edge：支持 WebGL
   * - IE 11：部分支持 WebGL
   *
   * 示例：
   * if (canUseWebGL()) {
   *   console.log('支持 WebGL，可以渲染 3D')
   * } else {
   *   console.log('不支持 WebGL，降级到 2D')
   * }
   */
  const canUseWebGL = (): boolean => {
    // 确保只在客户端执行
    if (process.client) {
      // 创建 canvas 元素
      const canvas = document.createElement('canvas')

      // 尝试获取 WebGL 上下文
      // getContext('webgl')：尝试获取 WebGL 1 上下文
      // getContext('experimental-webgl')：尝试获取实验性 WebGL 上下文（旧浏览器）
      // ||：逻辑或，尝试两种方式
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

      // 如果 gl 不为 null，则表示支持 WebGL
      // !!：双重否定，转换为布尔值
      return !!gl
    }

    // 如果不在客户端，则返回 false
    return false
  }

  // ============================================================================
  // 判断是否可以使用高级 3D 效果
  // ============================================================================
  /**
   * canUseAdvanced3D() - 判断是否可以使用高级 3D 效果
   *
   * 功能：
   * 综合判断设备是否支持高级 3D 动画。
   * 考虑设备性能、WebGL 支持和设备类型。
   *
   * 判断条件：
   * 1. 非低性能设备
   * 2. 支持 WebGL
   * 3. 桌面设备（手机和平板通常不支持高级 3D）
   *
   * 返回值：
   * - true：可以使用高级 3D 动画
   * - false：禁用高级 3D 动画，使用简化版本
   *
   * 为什么需要综合判断？
   * - 低性能设备启用 3D 会导致卡顿和电池消耗
   * - 不支持 WebGL 的设备无法渲染 3D
   * - 移动设备屏幕较小，3D 效果不明显且消耗资源
   *
   * 使用场景：
   * - 首页 Hero Section 的 3D 服务器模型
   * - 产品详情页的 3D 展示
   * - 其他性能敏感的 3D 效果
   *
   * 示例：
   * if (canUseAdvanced3D()) {
   *   // 桌面端：渲染完整的 3D 场景
   *   <ServerScene />
   * } else {
   *   // 移动端或低性能设备：使用简化动画
   *   <MobileFallback />
   * }
   *
   * 性能优化：
   * - 避免在低性能设备上启用高级动画
   * - 减少 GPU 和 CPU 负载
   * - 提升用户体验（流畅度优先）
   */
  const canUseAdvanced3D = (): boolean => {
    // 综合判断三个条件
    // &&：逻辑与，三个条件都必须满足
    return (
      // 条件 1：非低性能设备
      !deviceInfo.value.isLowPerformance &&
      // 条件 2：支持 WebGL
      canUseWebGL() &&
      // 条件 3：桌面设备
      deviceInfo.value.isDesktop
    )
  }

  // ============================================================================
  // 生命周期钩子
  // ============================================================================
  // onMounted：Vue 生命周期钩子，组件挂载到 DOM 后执行
  // 在客户端和服务端渲染（SSR）时都会执行
  onMounted(() => {
    // 初始检测设备信息
    checkDevice()

    // 监听窗口大小变化
    // 当窗口大小变化时，重新检测设备信息
    // 例如：从桌面模式切换到移动模式（浏览器开发者工具）
    window.addEventListener('resize', checkDevice)
  })

  // onUnmounted：Vue 生命周期钩子，组件卸载前执行
  // 用于清理资源，避免内存泄漏
  onUnmounted(() => {
    // 确保只在客户端执行
    if (process.client) {
      // 移除窗口大小变化监听器
      // 避免组件卸载后仍然触发事件，导致内存泄漏
      window.removeEventListener('resize', checkDevice)
    }
  })

  // ============================================================================
  // 返回对象
  // ============================================================================
  // 返回一个对象，包含所有公共方法和响应式状态
  // 其他组件可以通过解构赋值使用这些方法和状态
  return {
    deviceInfo, // 设备信息响应式对象
    checkDevice, // 检测设备信息的函数
    canUseWebGL, // 判断是否支持 WebGL 的函数
    canUseAdvanced3D, // 判断是否可以使用高级 3D 的函数
  }
}
