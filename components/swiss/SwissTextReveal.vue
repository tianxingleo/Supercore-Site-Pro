<template>
  <component
    :is="tag"
    ref="el"
    class="swiss-text-reveal"
    :class="[
      block ? 'block' : 'inline-block',
      widthClass
    ]"
  >
    <div
      class="swiss-text-reveal__inner block will-change-transform"
    >
      <slot>{{ text }}</slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'

interface Props {
  tag?: string
  text?: string
  delay?: number
  duration?: number
  stagger?: number
  trigger?: boolean // If false, no scroll trigger
  immediate?: boolean // If true, animate immediately on mount
  block?: boolean
  widthClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  text: '',
  delay: 0,
  duration: 0.8,
  trigger: true,
  immediate: false,
  block: false,
  widthClass: 'w-full'
})

const el = ref<HTMLElement | null>(null)
// 使用 any 类型暂存 context，避免 setup 内部类型推断问题
let ctx: any = null

const nuxtApp = useNuxtApp()
const { $gsap, $ScrollTrigger } = nuxtApp as any

onMounted(() => {
  if (!el.value) return

  // 检查 GSAP 和 ScrollTrigger 是否可用
  if (!$gsap || !$ScrollTrigger) {
    console.warn('[SwissTextReveal] GSAP or ScrollTrigger not available')
    return
  }

  const innerEl = el.value.querySelector('.swiss-text-reveal__inner')
  if (!innerEl) return

  ctx = $gsap.context(() => {
    // 显式设置初始状态，确保 animation 从正确的起点开始
    // 即使 CSS 已经被移除，这里也能保证初始隐藏
    $gsap.set(innerEl, { 
      y: '120%', 
      opacity: 0, 
      rotateX: -10 
    })

    const animationVars = {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      duration: props.duration,
      ease: 'power3.out',
      delay: props.delay / 1000,
      overwrite: 'auto' // 防止动画叠加
    }

    if (props.immediate) {
      // 立即触发入场动画（首屏优化）
      $gsap.fromTo(innerEl,
        { y: '120%', opacity: 0, rotateX: -10 },
        { ...animationVars, y: '0%', opacity: 1, rotateX: 0 }
      )
    } else if (props.trigger) {

    // 滚动触发入场动画 - 使用 fromTo 确保起止状态明确
      $gsap.fromTo(innerEl,
        { y: '120%', opacity: 0, rotateX: -10 },
        {
          ...animationVars,
          y: '0%',
          opacity: 1,
          rotateX: 0,
          scrollTrigger: {
            trigger: el.value,
            // 只要元素顶部接触到视口底部95%的位置就触发，极大地提高了可见性
            start: 'top 95%',
            // 确保只播放一次，且不会因为页面重排而隐藏
            toggleActions: 'play none none none',
            // 刷新时重置动画值，适应布局变化
            invalidateOnRefresh: true,
            onEnter: () => console.log(`[SwissTextReveal] Enter: "${props.text?.substring(0, 10)}..."`),
            onRefresh: () => console.log(`[SwissTextReveal] Refresh: "${props.text?.substring(0, 10)}..."`),
            onLeave: () => console.log(`[SwissTextReveal] Leave: "${props.text?.substring(0, 10)}..."`),
          },
          onStart: () => console.log(`[SwissTextReveal] Animation Start: "${props.text?.substring(0, 10)}..."`),
        }
      )
    }
  }, el.value)
})

onBeforeUnmount(() => {
  console.log(`[SwissTextReveal] Unmounting: "${props.text?.substring(0, 10)}..."`)
  ctx?.revert()
})
</script>

<style scoped>
.swiss-text-reveal {
  overflow: hidden;
  perspective: 1000px;
  /* 确保作为 inline-block 时不会塌陷 */
  min-height: 1.25em;
}

/* 
  初始样式由 JS 控制 (gsap.set)，
  但也保留 CSS 基础属性以防 JS 异常时的布局崩坏
*/
.swiss-text-reveal__inner {
  will-change: transform, opacity;
  transform-origin: top center;
  backface-visibility: hidden;
}
</style>
