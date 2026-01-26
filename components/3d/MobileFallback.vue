<template>
  <div ref="containerRef" class="w-full h-full relative">
    <!-- 靜態圖片佔位符 -->
    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-swiss-bg to-gray-200">
      <div class="text-center">
        <!-- 伺服器圖示佔位符 -->
        <div class="relative w-64 h-64 mx-auto mb-8">
          <div class="absolute inset-0 bg-swiss-text rounded-lg opacity-10 animate-pulse"></div>
          <div class="absolute inset-4 bg-swiss-text rounded-lg opacity-20"></div>
          <div class="absolute inset-8 bg-swiss-text rounded-lg opacity-30"></div>
          <div class="absolute inset-12 bg-swiss-accent rounded-lg opacity-40"></div>

          <!-- LED 指示燈 -->
          <div class="absolute bottom-4 left-4 flex gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style="animation-delay: 0.5s;"></div>
            <div class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style="animation-delay: 1s;"></div>
          </div>
        </div>

        <TypographyHeader :level="3" size="h4" class="text-swiss-text mb-2">
          {{ $t('home.mobileFallback.title') }}
        </TypographyHeader>
        <p class="text-swiss-secondary text-sm">
          {{ $t('home.mobileFallback.subtitle') }}
        </p>
      </div>
    </div>

    <!-- 滾動提示 -->
    <div v-if="showScrollIndicator" class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-swiss-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  showScrollIndicator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showScrollIndicator: true,
})

const containerRef = ref<HTMLDivElement>()

onMounted(() => {
  // 可以在這裡添加圖片懶加載等優化
})

onUnmounted(() => {
  // 清理資源
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
