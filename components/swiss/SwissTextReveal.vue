<template>
  <!-- 动态渲染标签 -->
  <!-- component：Vue 3 的动态组件，根据 is 属性渲染不同的 HTML 元素 -->
  <!-- :is="tag"：动态标签名，根据 props.tag 计算（默认 'div'） -->
  <!-- ref="el"：引用 DOM 元素，用于 GSAP 动画 -->
  <!-- class="swiss-text-reveal"：基础类名 -->
  <!-- :class：动态类名数组 -->
  <!--   - block ? 'block' : 'inline-block'：根据 block prop 决定是块级还是内联块 -->
  <!--   - widthClass：宽度类名（默认 'w-full'） -->
  <component
    :is="tag"
    ref="el"
    class="swiss-text-reveal"
    :class="[block ? 'block' : 'inline-block', widthClass]"
  >
    <!-- 内部包裹元素（用于动画） -->
    <!-- class="swiss-text-reveal__inner"：基础类名 -->
    <!-- class="block will-change-transform"：块级元素 + 优化提示（告诉浏览器 transform 会变化） -->
    <span class="swiss-text-reveal__inner block will-change-transform">
      <!-- 插槽：允许父组件传入自定义文本 -->
      <!-- 例如：<SwissTextReveal>标题内容</SwissTextReveal> -->
      <slot>{{ text }}</slot>
    </span>
  </component>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：瑞士风格文字揭示动画组件 (Swiss Design Text Reveal Component)
 * ============================================================================
 *
 * 此组件是一个瑞士风格的文字揭示动画组件，用于创建文字入场效果。
 *
 * 功能说明：
 * 1. 文字揭示动画：文字从下向上、从透明到不透明、带旋转效果
 * 2. 滚动触发：元素进入视口时触发动画
 * 3. 立即触发：页面加载后立即触发动画（immediate prop）
 * 4. 可配置性：延迟、持续时间、标签类型、块级/内联块
 *
 * 动画效果：
 * 1. Y 轴移动：从 120%（向下偏移）到 0%（正常位置）
 * 2. 透明度：从 0%（透明）到 100%（不透明）
 * 3. X 轴旋转：从 -10 度到 0 度
 * 4. 缓动函数：power3.out（结束时减速，更自然）
 *
 * 瑞士设计特点：
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 动态效果 (Dynamic)：文字揭示动画，提升视觉吸引力
 * - 功能主义 (Functionalism：快速加载，清晰导航
 *
 * 使用场景：
 * - 页面标题：大标题的文字揭示动画
 * - 副标题：副标题的文字揭示动画
 * - 卡片标题：卡片内的文字揭示动画
 * - 列表项：列表项的文字揭示动画
 *
 * 性能优化：
 * - GSAP ScrollTrigger：按需触发动画，减少初始渲染开销
 * - will-change-transform：提示浏览器优化 transform 动画
 * - overflow: hidden：隐藏溢出内容，避免布局抖动
 *
 * 可访问性 (Accessibility)：
 * - 语义化 HTML：使用正确的 HTML 标签
 * - 动画控制：提供 immediate 和 trigger 选项，避免过度动画
 *
 * 依赖库：
 * - GSAP (GreenSock Animation Platform)：JavaScript 动画库
 * - ScrollTrigger：GSAP 的滚动触发插件
 *
 * ============================================================================
 */

// 导入 Vue 3 组合式 API
// onMounted：组件挂载后执行的钩子
// onBeforeUnmount：组件卸载前执行的钩子
// ref：创建响应式引用，访问 DOM 元素
import { onMounted, ref, onBeforeUnmount } from 'vue'

// ============================================================================
// Props 类型定义 (Props Type Definition)
// ============================================================================
//
// 定义组件的 Props，使用 TypeScript 接口指定类型
//
// Props 说明：
// - tag：渲染的 HTML 标签（默认 'div'）
// - text：文本内容（默认空字符串，通常使用插槽）
// - delay：动画延迟时间，单位毫秒（默认 0）
// - duration：动画持续时间，单位秒（默认 0.8）
// - stagger：交错延迟（未使用，预留功能）
// - trigger：是否使用滚动触发（默认 true）
// - immediate：是否立即触发（默认 false）
// - block：是否块级元素（默认 false，内联块）
// - widthClass：宽度类名（默认 'w-full'）
//
// ============================================================================
interface Props {
  // 渲染的 HTML 标签
  // 默认值：'div'
  // 示例：'div', 'span', 'p', 'h1', 'h2' 等
  tag?: string

  // 文本内容（默认使用插槽）
  // 默认值：''
  // 注意：通常使用插槽 <slot> 而不是 text prop
  text?: string

  // 动画延迟时间
  // 默认值：0（毫秒）
  // 用途：多个文字动画依次触发时使用
  delay?: number

  // 动画持续时间
  // 默认值：0.8（秒）
  // 用途：控制动画速度
  duration?: number

  // 交错延迟（未使用）
  // 默认值：undefined
  // 用途：预留功能，多个子元素的交错动画
  stagger?: number

  // 是否使用滚动触发
  // 默认值：true
  // 用途：false 表示不使用 ScrollTrigger，需要手动触发
  trigger?: boolean

  // 是否立即触发
  // 默认值：false
  // 用途：页面加载后立即触发动画（首屏优化）
  immediate?: boolean

  // 是否块级元素
  // 默认值：false
  // 用途：false = inline-block（内联块），true = block（块级）
  block?: boolean

  // 宽度类名
  // 默认值：'w-full'（宽度 100%）
  // 用途：自定义宽度（如 'w-1/2', 'w-3/4' 等）
  widthClass?: string
}

// 定义 props，使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  tag: 'div',              // 默认渲染为 div
  text: '',                // 默认文本为空
  delay: 0,                 // 默认延迟 0 毫秒
  duration: 0.8,            // 默认持续 0.8 秒
  trigger: true,             // 默认启用滚动触发
  immediate: false,         // 默认不立即触发
  block: false,             // 默认为内联块
  widthClass: 'w-full'       // 默认宽度 100%
})

// ============================================================================
// DOM 元素引用 (DOM Element Ref)
// ============================================================================
//
// ref：Vue 3 的响应式引用，用于访问 DOM 元素
// el.value：当前组件的 DOM 元素（HTMLElement | null）
//
// 用途：
// - 访问 DOM 元素
// - 传递给 GSAP 进行动画
// - 查询内部元素（.swiss-text-reveal__inner）
*
// 初始值：null（组件挂载前为 null，挂载后为 HTMLElement）
*
// ============================================================================
const el = ref<HTMLElement | null>(null)

// ============================================================================
// GSAP 上下文 (GSAP Context)
// ============================================================================
//
// ctx：GSAP 上下文对象，用于管理和清理动画
//
// 用途：
// - 存储动画上下文
* - 组件卸载时清理动画（ctx.revert()）
* - 避免内存泄漏
*
// 初始值：null（onMounted 后赋值）
*
// ============================================================================
let ctx: gsap.Context | null = null

// ============================================================================
// Nuxt 应用实例 (Nuxt App Instance)
// ============================================================================
//
// useNuxtApp()：获取 Nuxt 应用上下文
//
// 返回值：
* - Nuxt 应用对象，包含全局插件、注入的属性等
* - 可以访问全局插件（如 GSAP、ScrollTrigger）
*
// ============================================================================
const nuxtApp = useNuxtApp()

// 解构获取 GSAP 和 ScrollTrigger 插件
// 这些是通过 nuxt.config.ts 中的 plugins 配置注入的全局插件
// 使用 (nuxtApp as any) 进行类型断言，因为 TS 可能不识别这些插件属性
const { $gsap, $ScrollTrigger } = nuxtApp as any

// ============================================================================
// 组件挂载时初始化动画 (Initialize Animation on Mount)
// ============================================================================
//
// onMounted：Vue 3 的生命周期钩子
// - 组件挂载到 DOM 后调用
// - 用于执行初始化逻辑
//
// 工作流程：
* 1. 检查 DOM 元素是否存在
* 2. 检查 GSAP 和 ScrollTrigger 是否可用
* 3. 查询内部元素（.swiss-text-reveal__inner）
* 4. 创建 GSAP 上下文
* 5. 设置动画参数
* 6. 根据 immediate 或 trigger 选择触发方式
*
// ============================================================================
onMounted(() => {
  // 检查 DOM 元素是否存在
  if (!el.value) return

  // 检查 GSAP 和 ScrollTrigger 是否可用
  if (!$gsap || !$ScrollTrigger) {
    console.warn('[SwissTextReveal] GSAP or ScrollTrigger not available')
    return
  }

  // 查询内部元素（.swiss-text-reveal__inner）
  // querySelector：DOM API，查找符合条件的第一个元素
  // 内部元素用于应用动画（transform 和 opacity）
  const innerEl = el.value.querySelector('.swiss-text-reveal__inner')
  if (!innerEl) return

  // 创建 GSAP 上下文
  // gsap.context()：创建动画上下文，用于管理和清理动画
  // 优势：
  // - 独立管理多个动画
  // - 可以批量回滚所有动画（ctx.revert()）
  // - 避免全局污染
  ctx = $gsap.context(() => {
    // 动画变量配置
    // 这些变量会被 gsap.fromTo() 使用
    const animationVars = {
      y: '0%',              // Y 轴目标位置（正常位置）
      opacity: 1,            // 透明度目标（100% 不透明）
      rotateX: 0,            // X 轴旋转目标（0 度）
      duration: props.duration,  // 动画持续时间
      ease: 'power3.out',     // 缓动函数（power3.out：结束时减速）
      delay: props.delay / 1000, // 延迟时间（毫秒转换为秒）
      overwrite: 'auto'      // 防止动画叠加（自动优化）
    }

    // 立即触发入场动画（首屏优化）
    // immediate = true：页面加载后立即触发，不等待滚动
    // 优点：首屏内容立即显示，提升感知性能
    // 用途：页面顶部的重要元素（标题、副标题等）
    if (props.immediate) {
      // gsap.fromTo()：从初始状态到目标状态
      // innerEl：目标元素
      // 初始状态：
      //   - y: '120%'：向下偏移 120%（屏幕外）
      //   - opacity: 0：完全透明
      //   - rotateX: -10：X 轴旋转 -10 度
      $gsap.fromTo(innerEl,
        { y: '120%', opacity: 0, rotateX: -10 },
        animationVars
      )
    }
    // 滚动触发入场动画
    // trigger = true：使用 ScrollTrigger 触发动画
    // 优点：只在元素进入视口时触发，节省性能
    // 用途：滚动到元素时才显示
    else if (props.trigger) {
      // gsap.fromTo()：从初始状态到目标状态
      // 初始状态同上
      $gsap.fromTo(innerEl,
        { y: '120%', opacity: 0, rotateX: -10 },
        {
          // 合并动画变量
          ...animationVars,
          // ScrollTrigger 配置
          scrollTrigger: {
            trigger: el.value,         // 触发元素（当前组件）
            start: 'top 92%',           // 触发位置（元素顶部到达视口 92% 位置）
            toggleActions: 'play none reverse'  // 播放动画后不再反向播放（避免重复动画）
          }
        }
      )
    }
  }, el.value) // 绑定上下文到 DOM 元素
})

// ============================================================================
// 组件卸载前清理动画 (Clean Up Animation Before Unmount)
// ============================================================================
//
// onBeforeUnmount：Vue 3 的生命周期钩子
// - 组件卸载前调用
* - 用于清理资源，避免内存泄漏
*
// 清理逻辑：
* 1. 回滚 GSAP 上下文中的所有动画
* 2. 清理 ScrollTrigger
* 3. 释放内存
*
// 为什么要清理？
* - 避免内存泄漏
* - 清理 ScrollTrigger 监听器
* - 移除动画定时器
*
// ============================================================================
onBeforeUnmount(() => {
  // 回滚 GSAP 上下文中的所有动画
  // ctx?.revert()：检查 ctx 存在后，执行 revert()
  // revert()：回滚上下文中的所有动画到初始状态
  ctx?.revert()
})
</script>

<!-- 样式定义 (Scoped Styles) -->
<!-- scoped：样式只作用于当前组件，不影响其他组件 -->
<style scoped>
<!--
  组件容器样式
  作用：设置动画容器的基本样式
-->
.swiss-text-reveal {
  <!-- overflow: hidden：隐藏溢出内容 -->
  <!-- 用途：避免动画过程中文字超出容器边界 -->
  overflow: hidden;

  <!-- perspective: 1000px：透视效果 -->
  <!-- 用途：为 3D 变换（rotateX）提供透视感 -->
  <!-- 值：1000px（适中的透视效果） -->
  perspective: 1000px;

  /* 确保作为 inline-block 时不会塌陷 */
  /* min-height: 1.25em：最小高度为 1.25em（20px） */
  /* 用途：防止元素内容为空时高度塌陷 */
  /* 1.25em 约等于字体大小（20px） */
  min-height: 1.25em;
}

<!--
  内部元素样式
  作用：设置文字的初始状态和动画属性
-->
.swiss-text-reveal__inner {
  <!-- opacity: 0：初始状态为完全透明 -->
  <!-- 用途：配合淡入动画，从透明到不透明 -->
  opacity: 0;

  <!-- transform：复合变换 -->
  <!-- translateY(120%)：向下偏移 120%（屏幕外） -->
  <!-- rotateX(-10deg)：X 轴旋转 -10 度（轻微倾斜） -->
  <!-- translateZ(0)：Z 轴平移 0 -->
  <!-- 用途：设置初始状态，动画从这些值过渡到目标值 -->
  transform: translateY(120%) rotateX(-10deg) translateZ(0);

  <!-- will-change: transform, opacity：优化提示 -->
  <!-- 告诉浏览器 transform 和 opacity 属性会变化 -->
  <!-- 优势：浏览器可以提前优化动画渲染，提升性能 -->
  will-change: transform, opacity;

  /* 确保文字不会因为旋转而被裁剪太严重 */
  /* transform-origin: top center：变换原点在顶部居中 */
  /* 用途：旋转时从顶部开始，避免文字被裁剪 */
  transform-origin: top center;

  <!-- backface-visibility: hidden：背面不可见 -->
  <!-- 用途：优化 3D 变换的性能，隐藏背面 -->
  backface-visibility: hidden;
}
</style>
