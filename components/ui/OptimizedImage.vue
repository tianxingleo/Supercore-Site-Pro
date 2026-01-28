<template>
  <div ref="containerRef" class="overflow-hidden relative" :class="containerClass">
    <NuxtImg
      v-if="!lazyLoad || isIntersecting"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      :preload="!lazyLoad && preload"
      :format="format"
      :quality="quality"
      :sizes="sizes"
      :srcset="srcset"
      :modulators="modulators"
      class="transition-opacity duration-700 ease-in-out"
      :class="[imageClass, isLoading ? 'opacity-0' : 'opacity-100']"
      @load="handleLoad"
      @error="handleError"
      placeholder
    />
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-swiss-bg animate-pulse"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  lazyLoad?: boolean
  preload?: boolean
  containerClass?: string
  imageClass?: string
  format?: 'webp' | 'avif' | 'jpg' | 'png' | null
  quality?: number
  sizes?: string
  srcset?: string | string[]
  modulators?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazyLoad: true,
  preload: false,
  containerClass: '',
  imageClass: '',
  format: 'webp',
  quality: 80,
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
})

const containerRef = ref<HTMLDivElement>()
const isIntersecting = ref(!props.lazyLoad)
const isLoading = ref(true)
const hasError = ref(false)

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
