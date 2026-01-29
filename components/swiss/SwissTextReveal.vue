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
      :style="{ transitionDelay: `${delay}ms` }"
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
  trigger?: boolean // If false, manual trigger
  block?: boolean
  widthClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  text: '',
  delay: 0,
  duration: 0.8,
  trigger: true,
  block: false,
  widthClass: 'w-full'
})

const el = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

const { $gsap } = useNuxtApp() as any

onMounted(() => {
  if (!el.value) return

  ctx = $gsap.context(() => {
    // Initial State
    $gsap.set(el.value!.querySelector('.swiss-text-reveal__inner'), {
      y: '120%',
      opacity: 0,
      rotateX: -10
    })

    if (props.trigger) {
      $gsap.to(el.value!.querySelector('.swiss-text-reveal__inner'), {
        scrollTrigger: {
          trigger: el.value,
          start: 'top 90%', // Trigger when top of element hits 90% viewport height
          toggleActions: 'play none none reverse'
        },
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: props.duration,
        ease: 'power3.out',
        delay: props.delay / 1000
      })
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
  /* Ensure mask works */
}

/* 3D perspective for rotation effect */
.swiss-text-reveal {
  perspective: 1000px;
}
</style>
