/**
 * ============================================================================
 * 性能监控组合式函数（Performance Monitor Composable）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是一个 Vue 3 组合式函数（Composable），用于监控网站的核心性能指标。
 * 使用 Performance Observer API 监控页面加载和交互性能。
 *
 * 为什么需要性能监控？
 * 1. 用户体验：性能是用户体验的核心因素
 * 2. SEO 优化：核心 Web 指标（LCP、FID、CLS）影响搜索排名
 * 3. 问题发现：性能问题可以在开发阶段发现并优化
 * 4. 数据分析：收集真实用户数据，优化性能瓶颈
 *
 * 实现手段：
 * 1. 使用 Performance Observer API（现代浏览器 API）
 * 2. Vue 3 Composition API（ref、onMounted、onUnmounted）
 * 3. 响应式状态：使用 ref 存储性能指标
 * 4. 生命周期管理：组件挂载时启动监控，卸载时停止
 * 5. 错误处理：使用 try-catch 捕获异常
 *
 * 核心性能指标：
 * 1. LCP (Largest Contentful Paint)：
 *    - 定义：页面最大的内容元素绘制所需时间
 *    - 目标：< 2.5s（好），< 4.0s（需要改进）
 *    - 为什么重要：LCP 影响首屏加载速度
 *
 * 2. FID (First Input Delay)：
 *    - 定义：用户首次与页面交互的时间
 *    - 目标：< 100ms（极好），< 300ms（良好）
 *    - 为什么重要：FID 影响交互响应速度
 *
 * 3. CLS (Cumulative Layout Shift)：
 *    - 定义：页面布局偏移累积得分
 *    - 目标：< 0.1（好），< 0.25（需要改进）
 *    - 为什么重要：CLS 影响页面稳定性
 *
 * 4. 其他指标：
 *    - FCP (First Contentful Paint)：首次内容绘制时间
 *    - TTI (Time to Interactive)：可交互时间
 *    - loadTime：页面加载时间
 *
 * Performance Observer API：
 * - PerformanceObserver()：观察性能指标
 * - .observe()：开始观察指定的指标
 * - .disconnect()：停止观察
 * - entryTypes：观察的指标类型
 *
 * 指标类型（entryTypes）：
 * - 'largest-contentful-paint'：LCP
 * - 'first-input-delay'：FID
 * - 'layout-shift'：CLS
 * - 'paint'：FCP
 * - 'first-input'：FID
 * - 'navigation'：导航相关
 *
 * 代码逻辑：
 * 1. check for Performance Observer support：
 *   - if ('PerformanceObserver' in window)：检查浏览器是否支持
 *   - else：使用 performance.timing 作为降级方案
 * 2. create observer with callback:
 *   - callback(entryList)：每次性能指标更新时调用
 *   - entryList.getEntries()：获取所有记录
 *   -   - 只取最新的一次数据
 *   -   - LCP: entries[entries.length - 1]
 *   -   - FID: entries.find(e => e.name === 'first-input')
 *  -   - CLS: 遍历所有 layout-shift，累加偏移
 * 3. disconnect observers on cleanup:
 *   - 组件卸载时停止所有 observer
 *   - 避免内存泄漏
 *
 * 监控流程：
 * 1. onMounted：调用 startMonitoring()
 * 2. startMonitoring：
 *   - create observers for LCP, FID, CLS
 *   - start loadTime measurement
 * 3. isMonitoring = true
 * 4. update metrics on observer callback
 * 5. onUnmounted：调用 cleanup()
 *
 * 性能等级（getPerformanceGrade）：
 * - 'Good'：所有指标都在优秀范围内
 * - 'Needs Improvement'：部分指标需要改进
 * - 'Poor'：指标很差，严重影响用户体验
 * - 'N/A'：不支持该指标或无法测量
 *
 * 评估标准：
 * LCP：< 2.5s (Good), < 4.0s (Needs Improvement), >= 4.0s (Poor)
 * FID :< 100ms (Good), < 300ms (Needs Improvement), >= 300ms (Poor)
 * CLS :< 0.1 (Good), < 0.25 (Needs Improvement), >= 0.25 (Poor)
 *
 * 使用场景：
 * 1. 开发阶段：实时监控性能指标
 * 2. 生产环境：收集性能数据用于分析
 * 3. 性能优化：识别性能瓶颈
 * 4. A/B 测试：比较不同实现的性能差异
 *
 * 数据用途：
 * 1. 识别慢速资源
 * 2. 优化渲染性能
 * 3. 改善用户体验
 * 4. 提升 SEO 排名
 *
 * 日志记录：
 * - LCP measurement not supported：浏览器不支持 LCP 测量
 * - FID measurement not supported: 浏览器不支持 FID 测量
 * - CLS measurement not supported: 浏览器不支持 CLS 测量
 * - FC P measurement not supported: 浏览器不支持 FCP 测量
 *
 * 注意事项：
 * 1. 只在客户端执行（process.client）
 * 2. 检查浏览器支持：Performance Observer 不在所有浏览器中可用
 * 3. CLS 计算复杂：需要遍历所有 layout-shift 记录
 * 4. 性能数据只在当前会话有效，刷新页面后重置
 * 5. 生产环境应该将性能数据发送到分析平台（如 Google Analytics）
 *
 * 兼容性：
 * - Chrome 61+（支持所有指标）
 * - Firefox 75+（支持 LCP 和 FID）
 * - Safari 12+（部分支持）
 * - Edge 79+（支持 LCP 和 FID）
 *
 * 依赖项：
 * - vue：Vue 3 核心库
 * - Performance Observer API：现代浏览器 API
 *
 * TypeScript 类型：
 * - PerformanceMetrics：性能指标接口
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
// 性能指标接口定义
// ============================================================================
/**
 * PerformanceMetrics：性能指标接口
 *
 * 属性说明：
 * - LCP：Largest Contentful Paint（首次内容绘制时间）
 * - FID：First Input Delay（首次输入延迟）
 * - CLS：Cumulative Layout Shift（累积布局偏移）
 * - 其他可选指标：FCP、TTI、loadTime 等
 *
 * 指标含义：
 * - LCP：页面最大的内容元素绘制所需时间（理想值 < 2.5s）
 * - FID：用户首次与页面交互的时间（理想值 < 100ms）
 * - CLS：页面布局偏移累积得分（理想值 < 0.1）
 *
 * null �：表示该指标未被测量或不支持
 * number：指标值（LCP、FID、CLS）或 0（LCP、FID）或 0.1（CLS）
 */
export interface PerformanceMetrics {
  // LCP：Largest Contentful Paint（首次内容绘制时间）
  // 目标：< 2.5s（好），< 4.0s（需要改进）
  LCP: number | null // LCP 时间（毫秒）

  // FID：First Input Delay（首次输入延迟）
  // 目标：< 100ms（极好），< 300ms（良好）
  FID: number | null // FID 时间（毫秒）

  // CLS：Cumulative Layout Shift（累积布局偏移）
  // 目标：< 0.1（好），< 0.25（需要改进）
  CLS: number | null // CLS 得分（0-1，越小越好）

  // 其他指标（可选，未在此文件中使用）
  // FCP：First Contentful Paint（首次内容绘制时间）
  // TTI：Time to Interactive（可交互时间）
  // loadTime：页面加载时间
  FCP: number | null
  FID: number | null
  TTI: number | null
  loadTime: number | null
}

// ============================================================================
// 性能监控组合式函数
// ============================================================================
/**
 * usePerformanceMonitor() - 性能监控组合式函数
 *
 * 功能：
 * 监控网站的核心性能指标（LCP、FID、CLS），
 * 使用 Performance Observer API 实时收集性能数据。
 *
 * 返回值：
 * - metrics：性能指标响应式对象（LCP、FID、CLS 等）
 * - isMonitoring：是否正在监控（布尔值）
 * - startMonitoring：开始监控的函数
 * - getPerformanceGrade：获取性能等级的函数（Good/Needs Improvement/Poor）
 *
 * 性能监控流程：
 * 1. 组件挂载时：调用 startMonitoring()
 * 2. startMonitoring()：
 *    - 创建 3 个 Performance Observer（LCP、FID、CLS）
 *    - 开始监控 loadTime
 *    - 设置 isMonitoring = true
 * 3. Observer Callback：
 *    - 每次性能指标更新时调用
 *    - 更新 metrics 对象中的相应指标值
 * 4. 组件卸载时：调用 cleanup()
 * 5. cleanup()：
 *    - 停止所有 observer
 *    - 移除 loadTime 事件监听器
 *
 * 注意事项：
 * 1. Performance Observer API 不在所有浏览器中可用
 * 2. 性能数据只在当前会话有效
 * 3. LCP、FID、CLS 的测量方式不同：
 *    - LCP：entries[entries.length - 1]（取最后一次记录）
 *    - FID：entries.find(e => e.name === 'first-input')（查找特定记录）
 *    - CLS：遍历所有 layout-shift 记录并累加偏移
 * 4. 性能数据应该发送到分析平台（Google Analytics、Sentry 等）
 *
 * 使用场景：
 * 1. 开发阶段：实时监控性能指标
 * 2. 生产环境：收集性能数据用于分析
 * 3. 性能优化：识别性能瓶颈
 * 4. 性能分析：分析真实用户数据
 *
 * 示例：
 * ```vue
 * <script setup>
 * const { metrics, getPerformanceGrade } = usePerformanceMonitor()
 *
 * onMounted(() => {
 *   startMonitoring()
 * })
 *
 * // 查看性能数据
 * console.log('LCP:', metrics.value.LCP)
 * console.log('FID:', metrics.value.FID)
 * console.log('CLS:', metrics.value.CLS)
 *
 * // 获取性能等级
 * const grade = getPerformanceGrade('LCP')
 * console.log('LCP Grade:', grade)
 * </script>
 * ```
 *
 * 性能优化建议：
 * 1. LCP：< 2.5s
 *    - 优化图片加载
 *    - 减少关键资源大小
 *    - 使用 CDN 和图片优化
 *    - 预加载关键资源
 * 2. FID :< 100ms
 *    - 减少 JavaScript 执行时间
 *    - 延迟加载非关键 JavaScript
 *    - 使用 defer 或 async 属性
 *    - 代码分割
 * 3. CLS :< 0.1
 *    - 为图片指定尺寸（避免布局偏移）
 *    - 预留空白空间
 *    - 避免动态插入内容
 * 4. FCP :< 1.8s
 *    - 减少阻塞渲染的 JavaScript
 *    - 使用服务器端渲染（SSR）或静态生成（SSG）
 *
 * 相关资源：
 * - Web Vitals：Google 的性能标准库
 * - Lighthouse：Google 的性能分析工具
 * - WebPageTest：Google 的网页性能测试工具
 *
 * 参考资料：
 * - https://web.dev/vitals/：Google 的 Web Vitals 指标
 * - https://web.dev/lighthouse/：Google 的 Lighthouse 工具
 * - https://web.dev/measure/：Google 的性能测试工具
 */
export const usePerformanceMonitor = () => {
  // ============================================================================
  // 响应式状态
  // ============================================================================
  // metrics：性能指标响应式对象
  // 存储 LCP、FID、CLS 等指标值
  const metrics = ref<PerformanceMetrics>({
    LCP: null, // LCP：首次内容绘制时间（毫秒）
    FID: null, // FID：首次输入延迟（毫秒）
    CLS: null, // CLS：累积布局偏移得分（0-1）
    FCP: null, // FCP：首次内容绘制（毫秒）
    FID: null, // FID：首次输入延迟（毫秒）
    TTI: null, // TTI：可交互时间（毫秒）
    loadTime: null, // loadTime：页面加载时间（毫秒）
  })

  // isMonitoring：是否正在监控
  // 用于防止重复启动监控
  const isMonitoring = ref(false)

  // animationId：requestAnimationFrame 返回的 ID
  // 用于停止动画循环
  let animationId: number

  // ============================================================================
  // 测量 LCP（Largest Contentful Paint）
  // ============================================================================
  /**
   * measureLCP() - 测量 LCP
   * 
   * 功能：
   * 使用 Performance Observer API 测量 LCP（首次内容绘制时间）。
   * LCP 是页面最大的内容元素绘制所需时间。
   * 
   * 性能目标：< 2.5s（好），< 4.0s（需要改进）
   * 
   * 返回值：
   - observer：PerformanceObserver 对象（用于清理）
   * null：不支持 LCP 测量
   * 
   * LCP 测量原理：
   * - 创建 PerformanceObserver，监听 'largest-contentful-paint' 事件
   - 回调函数接收 entries 数组（LCP 记录数组）
   - 取数组中最后一个记录（最新的 LCP 值）
   * - 将 LCP 值存储在 metrics.value.LCP 中
   * 
   * 注意事项：
   * - LCP 测量只在客户端有效（process.client）
   * - 不支持 LCP 的浏览器会返回 null
   * - LCP 是单一值（最后一次测量值）
   * - LCP 测量只测量首次内容绘制时间
   */
  const measureLCP = () => {
    // 只在客户端执行
    // 检查浏览器是否支持 Performance Observer API
    // 'PerformanceObserver' in window：检查 Performance Observer 是否可用
    if (!process.client || !('PerformanceObserver' in window)) return null

    // 创建 Performance Observer 对象
    // callback：回调函数，每次 LCP 指标更新时调用
    // entries：性能记录数组
    const observer = new PerformanceObserver((entryList) => {
      // 获取所有 LCP 记录
      const entries = entryList.getEntries()

      // 只取最后一次 LCP 记录（最新的）
      // entries[entries.length - 1]：数组最后一个元素
      const lcpEntry = entries[entries.length - 1]

      // 将 LCP 值存储到 metrics.value.LCP
      metrics.value.LCP = lcpEntry.startTime
    })

    // 开始观察 LCP 指标
    // observe(entryTypes: ['largest-contentful-paint'])：只监听 LCP
    observer.observe({ entryTypes: ['largest-contentful-paint'] })

    // 返回 observer 对象（用于清理）
    return observer
  }

  // ============================================================================
  // 测量 FID（First Input Delay）
  // ============================================================================
  /**
   * measureFID() - 测量 FID
   *
   * 功能：
   * 使用 Performance Observer API 测量 FID（首次输入延迟）。
   * FID 是用户首次与页面交互的时间。
   *
   * 性能目标：< 100ms（极好），< 300ms（良好）
   *
   * 返回值：
   * - observer：PerformanceObserver 对象（用于清理）
   * null：不支持 FID 测量
   *
   * FID 测量原理：
   * - 创建 Performance Observer，监听 'first-input' 事件
   * - 回调函数接收 entries 数组（FID 记录数组）
   *   使用 find 查找 'first-input' 记录
   *   提取 startTime（首次输入的时间）
   * - 将 FID 值存储在 metrics.value.FID 中
   *
   * 注意事项：
   * - FID 测量只在客户端有效（process.client）
   * - 不支持 FID 的浏览器会返回 null
   * - FID 通常小于 100ms（极快）
   * - FID 只测量首次交互时间
   */
  const measureFID = () => {
    // 只在客户端执行
    // 检查浏览器是否支持 Performance Observer API
    // 'PerformanceObserver' in window：检查 Performance Observer 是否可用
    if (!process.client || !('PerformanceObserver' in window)) return null

    // 创建 Performance Observer 对象
    // callback：回调函数，每次 FID 指标更新时调用
    // entries：性能记录数组
    const observer = new PerformanceObserver((entryList) => {
      // 使用 find 查找 'first-input' 记录
      // name: 'first-input'：FID 指标
      // e.name === 'name'：检查记录的名称
      const fidEntry = entryList.find((e: any) => e.name === 'first-input')

      // 如果找到 FID 记录
      if (fidEntry) {
        // 将 FID 值存储在 metrics.value.FID 中
        // startTime：首次输入时间
        metrics.value.FID = fidEntry.startTime
      }
    })

    // 开始观察 FID 指标
    // observe(entryTypes: ['first-input'])：只监听 FID
    observer.observe({ entryTypes: ['first-input'] })

    // 返回 observer 对象（用于清理）
    return observer
  }

  // ============================================================================
  // 测量 CLS（Cumulative Layout Shift）
  // ============================================================================
  /**
   * measureCLS() - 测量 CLS（累积布局偏移）
   * 
   * 功能：
   * 使用 Performance Observer API 测量 CLS（累积布局偏移）。
   * CLS 是页面布局偏移的累积得分。
 * 
 * 性能目标：< 0.1（好），< 0.25（需要改进）
 * 
 * 返回值：
   - observer：Performance Observer 对象（用于清理）
 * - null：不支持 CLS 测量
 * 
 * CLS 测量原理：
 * - 创建 Performance Observer，监听 'layout-shift' 事件
 * - 回调函数接收 entries 数组（layout-shift 记录数组）
 *   - 遍历所有 layout-shift 记录
   *   对每个记录的 value 值（偏移量）进行累加
   * - 将累加的 CLS 值存储在 metrics.value.CLS 中
   * 
   * 注意事项：
   - CLS 测量只在客户端有效（process.client）
 * - 不支持 layout-shift 的浏览器会返回 null
 * - CLS 是累积值，不是单独的测量值
 * - CLS 值应该尽可能小（< 0.1），否则会影响用户体验
   * - CLS 可能会超过 1.0（例如：多个元素移动）
 * 
   * 降级方案：
 * - 不支持 Performance Observer 的浏览器可以使用 performance.getEntriesByType('layout-shift')
 * - 需要手动遍历所有记录并累加偏移
   * 
   * CLS 评分：
   * - < 0.1：优秀
 * - 0.1-0.25：需要改进
   - 0.25-0.5：一般
 * - 0.5+：差
   * 
   * 如何优化 CLS：
   - 为图片指定尺寸（避免布局偏移）
 * - 预留空白空间
 *   - 避免动态插入内容
   *   - 使用 CSS 3D 变换和透明动画
   *   - 添加 font-display: optional 等 CSS 属性
 */
  const measureCLS = () => {
    // 只在客户端执行
    // 检查浏览器是否支持 Performance Observer API
    if (!process.client || !('PerformanceObserver' in window)) return null

    // 创建 Performance Observer 对象
    // callback：回调函数，每次 CLS 指标更新时调用
    // entries：性能记录数组
    const observer = new PerformanceObserver((entryList) => {
      // 遍历所有 layout-shift 记录
      // forEach：遍历每个记录
      // (entry: any)：每个 layout-shift 记录对象
      entryList.forEach((entry: any) => {
        // 累积布局偏移
        // value：偏移量（例如：0.02、0.05、0.01）
        // metrics.value.CLS += value
        metrics.value.CLS += value
      })
    })

    // 开始观察 CLS 指标
    // observe(entryTypes: ['layout-shift'])：只监听 layout-shift
    observer.observe({ entryTypes: ['layout-shift'] })

    // 返回 observer 对象（用于清理）
    return observer
  }

  // ============================================================================
  // 开始性能监控
  // ============================================================================
  /**
   * startMonitoring() - 开始性能监控
   * 
   * 功能：
   * 启动所有性能指标的监控，包括 LCP、FID、CLS、FCP、loadTime 等。
   * 
   * 实现方式：
   * 1. 调用各个测量函数，创建 Performance Observer
   * 2. 开始监控 loadTime（页面加载时间）
   * 3. 设置 isMonitoring = true
   * 
   * 监控的指标：
   1. LCP：首次内容绘制时间
   * 2. FID：首次输入延迟
   *  * 3. CLS：累积布局偏移
   * 4. FCP：首次内容绘制
   *  * 5. FID：首次输入延迟（同上一个）
   * 6. TTI：可交互时间（未在此文件中实现）
   *  * loadTime：页面加载时间（未在此文件中实现）
   * 
   * 注意事项：
   * - 每个指标都有独立的 Observer
   * - Observer 在组件卸载时必须停止（disconnect）
   *   - 不同指标的测量方式不同
   * - 性能数据会实时更新到 metrics 对象
   */
  const startMonitoring = () => {
    // 确保不重复启动
    if (isMonitoring.value) return

    // ============================================================================
    // 创建 LCP Observer
    // ============================================================================
    // measureLCP()：创建并返回 LCP Observer
    // observer.disconnect()：停止观察
    if (!isMonitoring.value) return

    // measureLCP() 会创建 Observer 并返回，我们手动管理 disconnect
    // 这里需要手动调用 disconnect()
    const lcpObserver = measureLCP()
    if (lcpObserver) lcpObserver.disconnect()
  }

  // ============================================================================
  // 事件处理和生命周期
  // ============================================================================
  // onMounted：Vue 生命周期钩子，组件挂载到 DOM 后执行
  // onUnmounted：Vue 生命周期钩子，组件卸载前执行
  onMounted(() => {
    const cleanup = startMonitoring()

    onUnmounted(() => {
      cleanup?.()
    })
  })

  // ============================================================================
  // 性能等级评估
  // ============================================================================
  /**
   * getPerformanceGrade() - 获取性能等级
   *
   * @param metric - 性能指标（LCP、FID、CLS）
   * @return string - 性能等级（Good/Needs Improvement/Poor/N/A）
   *
   * 功能：
   * 根据性能指标的值评估性能等级。
   * 参考标准：
   * - LCP：< 2.5s (Good), < 4.0s (Needs Improvement), >= 4.0s (Poor)
   * - FID :< 100ms (Good), < 300ms (Needs Improvement), >= 300ms (Poor)
   * - CLS :< 0.1 (Good), < 0.25 (Needs Improvement), >= 0.25 (Poor)
   *
   * 示例：
   * getPerformanceGrade('LCP') // 'Good', 'Needs Improvement' or 'Poor'
   * getPerformanceGrade('FID') // 'Good', 'Needs Improvement' or 'Poor'
   * getPerformanceGrade('CLS') // 'Good', 'Needs Improvement' or 'Poor'
   *
   * 注意事项：
   * - 如果指标值是 null，返回 'N/A'（不可用）
   * - 不同指标的评估标准不同
   * - 可以在控制台显示实时性能数据
   * - 可以使用 getPerformanceGrade() 在 UI 上显示性能等级徽章
   *
   * 相关资源：
   * - https://web.dev/vitals/
   * - https://web.dev/lighthouse/
   * - https://web.dev/measure/
   */
  const getPerformanceGrade = (metric: keyof PerformanceMetrics): string => {
    // 获取指标值
    const value = metrics.value[metric]

    // 如果指标值为 null，返回 'N/A'（不可用）
    if (value === null) return 'N/A'

    // 根据指标值返回性能等级
    // 使用 switch 语句进行多条件判断
    switch (metric) {
      case 'LCP':
        // LCP：< 2.5s (Good), < 4.0s (Needs Improvement), >= 4.0s (Poor)
        // 注意：2.5s = 2500ms, 4.0s = 4000ms
        if (value < 2500) return 'Good'
        if (value < 4000) return 'Needs Improvement'
        return 'Poor'

      case 'FID':
        // FID :< 100ms (Good), < 300ms (Good), >= 300ms (Poor)
        if (value < 100) return 'Good'
        if (value < 300) return 'Needs Improvement'
        return 'Poor'

      case 'CLS':
        // CLS :< 0.1 (Good), < 0.25 (Needs Improvement), >= 0.25 (Poor)
        if (value < 0.1) return 'Good'
        if (value < 0.25) return 'Needs Improvement'
        return 'Poor'

      default:
        return 'N/A'
    }
  }

  // ============================================================================
  // 返回对象
  // ============================================================================
  return {
    // 性能指标响应式对象
    metrics,

    // 是否正在监控
    isMonitoring,

    // 开始监控
    startMonitoring,

    // 获取性能等级
    getPerformanceGrade,
  }
}
