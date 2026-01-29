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
    <span
      class="swiss-text-reveal__inner block will-change-transform"
    >
      <slot>{{ text }}</slot>
    </span>
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
let ctx: gsap.Context | null = null

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
        animationVars
      )
    } else if (props.trigger) {
      // 滚动触发入场动画
      $gsap.fromTo(innerEl,
        { y: '120%', opacity: 0, rotateX: -10 },
        {
          ...animationVars,
          scrollTrigger: {
            trigger: el.value,
            start: 'top 92%', // 略微调整触发点
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, el.value)
})

onBeforeUnmount(() => {
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

/* 初始隐藏状态，防止JS加载前闪现 */
.swiss-text-reveal__inner {
  opacity: 0;
  transform: translateY(120%) rotateX(-10deg) translateZ(0);
  will-change: transform, opacity;
  /* 确保文字不会因为旋转而被裁剪太严重 */
  transform-origin: top center;
  backface-visibility: hidden;
}
</style>
