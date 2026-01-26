<template>
  <div ref="containerRef" class="overflow-hidden" :class="containerClass">
    <img
      v-if="!lazyLoad || isIntersecting"
      :src="optimizedSrc"
      :alt="alt"
      :class="imageClass"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
    />
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-swiss-bg animate-pulse"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  lazyLoad?: boolean
  containerClass?: string
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazyLoad: true,
  containerClass: '',
  imageClass: '',
})

const containerRef = ref<HTMLDivElement>()
const isIntersecting = ref(!props.lazyLoad)
const isLoading = ref(true)
const hasError = ref(false)

// 優化圖片 URL（可以根據需要添加 CDN 或圖片處理服務）
const optimizedSrc = computed(() => {
  // 如果使用 Vercel 或其他 CDN，可以在這裡添加圖片優化參數
  // 例如: `?format=webp&w=${props.width}&q=80`
  return props.src
})

const handleLoad = () => {
  isLoading.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}

// Intersection Observer for lazy loading
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (props.lazyLoad && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            observer?.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
      }
    )

    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
