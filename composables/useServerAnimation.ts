/**
 * ============================================================================
 * 服务器动画组合式函数（Server Animation Composable）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是一个 Vue 3 组合式函数（Composable），用于管理 3D 服务器的滚动触发动画。
 * 它封装了 GSAP（GreenSock Animation Platform）和 ScrollTrigger 的复杂逻辑，
 * 提供简洁的 API 供其他组件使用。
 *
 * 实现手段：
 * 1. 使用 Vue 3 Composition API（ref、onMounted、onUnmounted）
 * 2. 封装 GSAP 时间轴（Timeline）和 ScrollTrigger 插件
 * 3. 提供回调函数机制，将动画进度传递给外部组件
 * 4. 自动管理资源清理，避免内存泄漏
 * 5. 支持视差效果和文字叠加动画
 *
 * 核心功能：
 * - initAnimationTimeline()：初始化 4 个阶段的滚动动画时间轴
 *   - 阶段 1：淡入效果（0-20%）
 *   - 阶段 2：机柜打开（20-50%）
 *   - 阶段 3：组件爆炸（50-80%）
 *   - 阶段 4：重新组装（80-100%）
 * - animateTextOverlays()：为文字元素创建滚动触发的进场动画
 * - addParallaxEffect()：为元素添加滚动视差效果
 * - cleanup()：清理所有动画实例和 ScrollTrigger
 *
 * 动画阶段说明：
 * 1. 淡入（Fade In）：3D 服务器从透明逐渐变为可见
 * 2. 机柜打开（Case Open）：服务器机柜打开，展示内部结构
 * 3. 组件爆炸（Explode）：组件从机柜中弹出，展示细节
 * 4. 重新组装（Reassemble）：组件回到机柜中，恢复原状
 *
 * 使用示例：
 * ```vue
 * <script setup>
 * const { initAnimationTimeline, isAnimating } = useServerAnimation()
 *
 * initAnimationTimeline({
 *   onFadeIn: (progress) => {
 *     // 根据 progress 更新 3D 场景的淡入效果
 *     // progress: 0 到 1
 *   },
 *   onCaseOpen: (progress) => {
 *     // 根据 progress 更新机柜打开效果
 *   },
 *   onExplode: (progress) => {
 *     // 根据 progress 更新组件爆炸效果
 *   },
 *   onReassemble: (progress) => {
 *     // 根据 progress 更新重新组装效果
 *   }
 * })
 * </script>
 * ```
 *
 * 技术细节：
 * - 使用 ScrollTrigger 的 scrub 属性实现平滑滚动跟随
 * - 时间轴将 0-100% 的滚动进度映射到 4 个阶段
 * - 每个阶段通过回调函数通知外部组件更新 3D 场景
 * - 组件卸载时自动清理所有动画实例
 *
 * 回调函数参数说明：
 * - progress：当前阶段内的进度（0 到 1）
 *   - 例如：阶段 2 的 progress=0.5 表示机柜打开了 50%
 *
 * ScrollTrigger 配置：
 * - trigger: 'body'：整个页面作为触发区域
 * - start: 'top top'：页面顶部到达视口顶部时开始
 * - end: 'bottom bottom'：页面底部到达视口底部时结束
 * - scrub: 1：动画跟随滚动，延迟 1 秒（平滑效果）
 *
 * 性能优化：
 * - 使用 requestAnimationFrame（GSAP 内置）优化动画性能
 * - 组件卸载时立即清理资源，避免内存泄漏
 * - 视差效果使用 CSS transform，性能优于改变 position
 *
 * 依赖项：
 * - vue：Vue 3 核心库
 * - gsap：GSAP 动画库
 * - @nuxtjs/scrolltrigger：GSAP ScrollTrigger 插件
 * - #app：Nuxt 应用类型定义
 *
 * TypeScript 类型：
 * - gsapType：GSAP 类型定义
 * - ScrollTriggerType：ScrollTrigger 类型定义
 * - Timeline：GSAP 时间轴类型
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// ref：Vue 响应式引用函数
// onMounted：Vue 生命周期钩子，组件挂载时执行
// onUnmounted：Vue 生命周期钩子，组件卸载时执行
import { ref, onMounted, onUnmounted } from 'vue'

// 类型定义：GSAP 和 ScrollTrigger
// #app：Nuxt 应用类型定义
import type { gsapType, ScrollTriggerType } from '#app'

// ============================================================================
// 组合式函数定义
// ============================================================================
// useServerAnimation()：自定义组合式函数
// 返回一个对象，包含动画控制的方法和响应式状态
export const useServerAnimation = () => {
  // ============================================================================
  // 获取 Nuxt 应用实例
  // ============================================================================
  // useNuxtApp()：Nuxt 提供的组合式函数，获取 Nuxt 应用实例
  // 用于访问全局插件（如 $gsap、$ScrollTrigger）
  const nuxtApp = useNuxtApp()

  // 从 Nuxt 应用实例中获取 GSAP 和 ScrollTrigger
  // 类型断言：告诉 TypeScript 这些属性的类型
  const { $gsap, $ScrollTrigger } = nuxtApp as {
    $gsap: { gsap: gsapType }
    $ScrollTrigger: { ScrollTrigger: ScrollTriggerType }
  }

  // 解构赋值，获取 gsap 和 ScrollTrigger 对象
  const { gsap } = $gsap
  const { ScrollTrigger } = $ScrollTrigger

  // ============================================================================
  // 响应式状态
  // ============================================================================
  // timeline：GSAP 时间轴实例
  // ref<gsapType.Timeline>()：类型为 GSAP 时间轴的响应式引用
  const timeline = ref<gsapType.Timeline>()

  // isAnimating：动画是否正在运行
  // 用于判断当前是否有动画在运行
  const isAnimating = ref(false)

  // ============================================================================
  // 初始化滚动动画时间轴
  // ============================================================================
  /**
   * 初始化滚动动画时间轴
   *
   * 功能：
   * 创建一个与页面滚动绑定的 GSAP 时间轴，包含 4 个动画阶段。
   * 每个阶段通过回调函数将进度传递给外部组件，用于更新 3D 场景。
   *
   * @param callbacks - 动画回调函数对象
   * @param callbacks.onFadeIn - 阶段 1 回调（淡入效果）
   * @param callbacks.onCaseOpen - 阶段 2 回调（机柜打开）
   * @param callbacks.onExplode - 阶段 3 回调（组件爆炸）
   * @param callbacks.onReassemble - 阶段 4 回调（重新组装）
   *
   * 回调函数参数：
   * - progress：当前阶段内的进度（0 到 1）
   *
   * 示例：
   * initAnimationTimeline({
   *   onFadeIn: (progress) => {
   *     console.log('淡入进度：', progress)
   *     // progress = 0.5 表示淡入了 50%
   *   }
   * })
   *
   * 技术实现：
   * 1. 使用 gsap.timeline() 创建时间轴
   * 2. 使用 ScrollTrigger 将时间轴绑定到页面滚动
   * 3. 每个阶段使用 .to({}, { duration, onUpdate }) 创建占位动画
   * 4. onUpdate 回调中计算当前阶段的进度
   * 5. 使用可选链操作符（?.）安全调用回调函数
   *
   * 阶段划分：
   * - 阶段 1：0-20%（duration: 20）
   * - 阶段 2：20-50%（duration: 30）
   * - 阶段 3：50-80%（duration: 30）
   * - 阶段 4：80-100%（duration: 20）
   * 总计：100 单位时间
   *
   * ScrollTrigger 配置：
   * - trigger: 'body'：整个页面作为触发区域
   * - start: 'top top'：页面顶部到达视口顶部时开始
   * - end: 'bottom bottom'：页面底部到达视口底部时结束
   * - scrub: 1：动画跟随滚动，延迟 1 秒（平滑效果）
   * - pin: false：不固定元素（如果为 true，会固定触发元素）
   */
  const initAnimationTimeline = (callbacks: {
    onFadeIn?: (progress: number) => void
    onCaseOpen?: (progress: number) => void
    onExplode?: (progress: number) => void
    onReassemble?: (progress: number) => void
  }) => {
    // 創建主時間軸，綁定到整個頁面滾動
    // gsap.timeline()：创建 GSAP 时间轴实例
    // 时间轴可以按顺序播放多个动画
    timeline.value = gsap.timeline({
      // scrollTrigger：滚动触发器配置
      scrollTrigger: {
        // trigger：触发元素
        // 'body'：整个页面作为触发区域
        trigger: 'body',

        // start：开始位置
        // 'top top'：页面顶部到达视口顶部时开始
        // 语法：'triggerPosition viewportPosition'
        start: 'top top',

        // end：结束位置
        // 'bottom bottom'：页面底部到达视口底部时结束
        end: 'bottom bottom',

        // scrub：平滑滚动
        // 1：动画跟随滚动，延迟 1 秒（平滑效果）
        // true：动画立即跟随滚动
        // false：不跟随滚动（只触发一次）
        scrub: 1,

        // pin：固定元素
        // false：不固定元素
        // true：固定触发元素，直到动画完成
        pin: false,
      },
    })

    // 階段 1: 淡入效果 (0-20%)
    // .to()：创建补间动画（从当前状态到目标状态）
    timeline.value.to(
      {}, // 目标对象（空对象，因为不实际动画任何元素）
      {
        // duration：动画持续时间
        // 20 单位时间，占总时间的 20%
        duration: 20,

        // onUpdate：动画更新时的回调
        // 每一帧都会调用此函数
        onUpdate: function () {
          // this.progress()：获取当前时间轴的进度（0 到 1）
          // 注意：这是整个时间轴的进度，不是当前阶段的进度
          const progress = this.progress()

          // 使用可选链操作符（?.）安全调用回调函数
          // 如果回调未定义，则不会调用
          callbacks.onFadeIn?.(progress)
        },
      }
    )

    // 階段 2: 機櫃打開 (20-50%)
    timeline.value.to(
      {},
      {
        duration: 30, // 30 单位时间，占总时间的 30%
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onCaseOpen?.(progress)
        },
      }
    )

    // 階段 3: 組件爆炸 (50-80%)
    timeline.value.to(
      {},
      {
        duration: 30, // 30 单位时间，占总时间的 30%
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onExplode?.(progress)
        },
      }
    )

    // 階段 4: 重新組裝或過渡 (80-100%)
    timeline.value.to(
      {},
      {
        duration: 20, // 20 单位时间，占总时间的 20%
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onReassemble?.(progress)
        },
      }
    )
  }

  // ============================================================================
  // 创建文字叠加层动画
  // ============================================================================
  /**
   * 创建文字叠加层动画
   *
   * 功能：
   * 为指定的文字元素创建滚动触发的进场动画。
   * 元素从下方滑入并淡入显示。
   *
   * @param elements - 要动画化的元素选择器数组
   *                  例如：['.title', '.subtitle', '.description']
   *
   * 动画效果：
   * - 初始状态：opacity: 0, y: 50（透明，向下偏移 50px）
   * - 结束状态：opacity: 1, y: 0（完全可见，回到原位）
   * - 触发条件：元素顶部到达视口 80% 位置
   * - 持续时间：1 秒
   * - 交错延迟：每个元素延迟 0.2 秒（index * 0.2）
   *
   * 技术实现：
   * 1. 使用 forEach 遍历元素数组
   * 2. 使用 gsap.fromTo() 定义初始和结束状态
   * 3. 使用 ScrollTrigger 绑定到滚动
   * 4. 使用 scrub 属性实现平滑滚动跟随
   *
   * 示例：
   * animateTextOverlays(['.hero-title', '.hero-subtitle'])
   *
   * ScrollTrigger 配置：
   * - trigger: selector：每个元素作为自己的触发器
   * - start: 'top 80%'：元素顶部到达视口 80% 时开始
   * - end: 'top 50%'：元素顶部到达视口 50% 时结束
   * - scrub: 1：动画跟随滚动，延迟 1 秒
   */
  const animateTextOverlays = (elements: string[]) => {
    // 遍历每个元素选择器
    // forEach：数组方法，遍历数组的每个元素
    // index：当前元素的索引（0, 1, 2, ...）
    elements.forEach((selector, index) => {
      // gsap.fromTo()：从初始状态到结束状态创建动画
      // 参数：
      // 1. selector：目标元素选择器
      // 2. 初始状态对象
      // 3. 结束状态对象
      gsap.fromTo(
        selector,
        {
          // 初始状态
          opacity: 0, // 完全透明
          y: 50, // 向下偏移 50px
        },
        {
          // 结束状态
          opacity: 1, // 完全不透明
          y: 0, // 回到原位
          duration: 1, // 动画持续 1 秒

          // ScrollTrigger 配置
          scrollTrigger: {
            trigger: selector, // 触发器：元素自己
            start: 'top 80%', // 元素顶部到达视口 80% 时开始
            end: 'top 50%', // 元素顶部到达视口 50% 时结束
            scrub: 1, // 动画跟随滚动，延迟 1 秒
          },

          // delay：交错延迟
          // index * 0.2：每个元素延迟 0.2 秒
          // 例如：第 1 个元素立即开始，第 2 个延迟 0.2 秒，第 3 个延迟 0.4 秒
          delay: index * 0.2,
        }
      )
    })
  }

  // ============================================================================
  // 为元素添加视差效果
  // ============================================================================
  /**
   * 为元素添加视差效果
   *
   * 功能：
   * 为指定的元素创建滚动视差效果。
   * 元素会随着页面滚动以不同的速度移动，产生深度感。
   *
   * @param selector - 元素选择器
   *                  例如：'.background-image'
   * @param speed - 视差速度（0-1）
   *                0：无效果
   *                0.5：中等速度（默认）
   *                1：最大速度
   *
   * 动画效果：
   * - 元素随着页面滚动移动
   * - 移动距离：-50 * speed（负值表示向上移动）
   * - 例如：speed=0.5，元素向上移动 25% 的高度
   *
   * 技术实现：
   * 1. 使用 gsap.to() 创建动画
   * 2. yPercent：百分比位移（相对于元素自身高度）
   * 3. ScrollTrigger：绑定到滚动
   * 4. scrub: true：动画跟随滚动
   *
   * 示例：
   * addParallaxEffect('.hero-bg', 0.5)  // 中等速度
   * addParallaxEffect('.hero-bg', 0.2)  // 慢速
   *
   * ScrollTrigger 配置：
   * - trigger: selector：元素作为触发器
   * - start: 'top bottom'：元素顶部到达视口底部时开始
   * - end: 'bottom top'：元素底部到达视口顶部时结束
   * - scrub: true：动画立即跟随滚动
   *
   * 性能说明：
   * - 使用 CSS transform（yPercent）而非 top/bottom 属性
   * - transform 不会触发重排（reflow），性能更好
   * - 使用 ease: 'none' 线性缓动，与滚动速度一致
   */
  const addParallaxEffect = (selector: string, speed: number = 0.5) => {
    // gsap.to()：从当前状态到结束状态创建动画
    gsap.to(selector, {
      // yPercent：Y 轴百分比位移
      // 负值表示向上移动
      // -50 * speed：速度系数 * 最大位移
      // 例如：speed=0.5，yPercent=-25（向上移动 25% 的元素高度）
      yPercent: -50 * speed,

      // ease：缓动函数
      // 'none'：线性缓动，没有加速或减速
      // 适合视差效果，与滚动速度一致
      ease: 'none',

      // ScrollTrigger 配置
      scrollTrigger: {
        trigger: selector, // 触发器：元素自己
        start: 'top bottom', // 开始位置：元素顶部到达视口底部
        end: 'bottom top', // 结束位置：元素底部到达视口顶部
        scrub: true, // 立即跟随滚动
      },
    })
  }

  // ============================================================================
  // 清理动画资源
  // ============================================================================
  /**
   * 清理动画资源
   *
   * 功能：
   * 停止并删除所有动画实例和 ScrollTrigger，释放内存。
   * 避免组件卸载后动画仍在运行导致的内存泄漏。
   *
   * 调用时机：
   * - 组件卸载时（onUnmounted 钩子）
   * - 路由切换前
   * - 手动需要重置动画时
   *
   * 技术实现：
   * 1. 调用 timeline.kill()：停止并删除时间轴
   * 2. 调用 ScrollTrigger.getAll()：获取所有 ScrollTrigger 实例
   * 3. 对每个实例调用 trigger.kill()：停止并删除
   *
   * 注意事项：
   * - kill() 会停止动画，删除所有事件监听器
   * - 调用后无法恢复动画（需要重新初始化）
   * - 必须在组件卸载时调用，否则会导致内存泄漏
   *
   * 示例：
   * const { cleanup } = useServerAnimation()
   *
   * onUnmounted(() => {
   *   cleanup()
   * })
   */
  const cleanup = () => {
    // 检查时间轴是否存在
    if (timeline.value) {
      // timeline.kill()：停止并删除时间轴
      // 停止所有动画，删除事件监听器，释放内存
      timeline.value.kill()
    }

    // 获取所有 ScrollTrigger 实例并删除
    // ScrollTrigger.getAll()：返回所有 ScrollTrigger 实例的数组
    ScrollTrigger.getAll().forEach((trigger: ScrollTriggerType) => {
      // trigger.kill()：停止并删除 ScrollTrigger 实例
      // 删除滚动事件监听器，释放内存
      trigger.kill()
    })
  }

  // ============================================================================
  // 生命周期钩子
  // ============================================================================
  // onMounted：Vue 生命周期钩子，组件挂载到 DOM 后执行
  onMounted(() => {
    // 设置动画状态为运行中
    isAnimating.value = true
  })

  // onUnmounted：Vue 生命周期钩子，组件卸载前执行
  onUnmounted(() => {
    // 清理所有动画资源
    cleanup()
  })

  // ============================================================================
  // 返回对象
  // ============================================================================
  // 返回一个对象，包含所有公共方法和响应式状态
  // 其他组件可以通过解构赋值使用这些方法
  return {
    timeline, // GSAP 时间轴实例
    isAnimating, // 动画是否正在运行
    initAnimationTimeline, // 初始化动画时间轴
    animateTextOverlays, // 创建文字叠加动画
    addParallaxEffect, // 添加视差效果
    cleanup, // 清理动画资源
  }
}
