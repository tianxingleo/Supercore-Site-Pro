<template>
  <div class="min-h-screen">
    <AppNavbar />
    <div class="pt-24 md:pt-28">
      <slot />
    </div>

    <!-- 开发工具 -->
    <!-- <PerformancePanel v-if="isDev" :metrics="performanceMetrics" :is-dev="isDev" /> -->
    <AiChat />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerformanceMonitor } from '~/composables/usePerformanceMonitor'

// Default layout with fixed navbar
const isDev = computed(() => process.env.NODE_ENV === 'development')

// 性能監控
const { metrics: performanceMetrics } = usePerformanceMonitor()
</script>
