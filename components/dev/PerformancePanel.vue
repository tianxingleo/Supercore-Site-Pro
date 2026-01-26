<template>
  <div v-if="isDev && showPanel" class="fixed bottom-4 right-4 z-50">
    <button
      @click="togglePanel"
      class="mb-2 px-4 py-2 bg-swiss-text text-white text-sm rounded-lg hover:bg-swiss-accent transition-colors"
    >
      {{ isExpanded ? '隱藏' : '顯示' }}性能面板
    </button>

    <div
      v-if="isExpanded"
      class="bg-white rounded-lg shadow-lg p-4 max-w-sm max-h-96 overflow-y-auto border border-swiss-secondary/20"
    >
      <h3 class="text-lg font-bold mb-4 text-swiss-text">性能指標</h3>

      <div class="space-y-3">
        <MetricCard
          v-for="(value, key) in metrics"
          :key="key"
          :label="getMetricLabel(key)"
          :value="value"
          :grade="getPerformanceGrade(key as keyof PerformanceMetrics)"
        />
      </div>

      <div class="mt-4 pt-4 border-t border-swiss-secondary/20">
        <button
          @click="runLighthouse"
          class="w-full px-4 py-2 bg-swiss-accent text-white rounded-lg hover:bg-[#0077ed] transition-colors"
        >
          運行 Lighthouse 測試
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PerformanceMetrics } from '~/composables/usePerformanceMonitor'

interface Props {
  metrics: PerformanceMetrics
  isDev: boolean
}

const props = defineProps<Props>()

const isExpanded = ref(false)
const showPanel = ref(true)

const togglePanel = () => {
  isExpanded.value = !isExpanded.value
}

const getMetricLabel = (key: string): string => {
  const labels: Record<string, string> = {
    LCP: 'Largest Contentful Paint',
    FID: 'First Input Delay',
    CLS: 'Cumulative Layout Shift',
    FCP: 'First Contentful Paint',
    TTI: 'Time to Interactive',
    loadTime: 'Page Load Time',
  }
  return labels[key] || key
}

const getPerformanceGrade = (key: keyof PerformanceMetrics): string => {
  const value = props.metrics[key]
  if (value === null) return 'N/A'

  switch (key) {
    case 'LCP':
      if (value < 2500) return 'Good'
      if (value < 4000) return 'Needs Improvement'
      return 'Poor'
    case 'FID':
      if (value < 100) return 'Good'
      if (value < 300) return 'Needs Improvement'
      return 'Poor'
    case 'CLS':
      if (value < 0.1) return 'Good'
      if (value < 0.25) return 'Needs Improvement'
      return 'Poor'
    case 'FCP':
      if (value < 1800) return 'Good'
      if (value < 3000) return 'Needs Improvement'
      return 'Poor'
    case 'loadTime':
      if (value < 2000) return 'Good'
      if (value < 4000) return 'Needs Improvement'
      return 'Poor'
    default:
      return 'N/A'
  }
}

const runLighthouse = () => {
  if (process.client) {
    window.open('chrome-lighthouse://', '_blank')
  }
}
</script>

<script setup lang="ts">
// MetricCard subcomponent
const MetricCard = defineComponent({
  name: 'MetricCard',
  props: {
    label: String,
    value: [Number, null] as PropType<number | null>,
    grade: String,
  },
  setup(props) {
    const gradeColor = computed(() => {
      switch (props.grade) {
        case 'Good':
          return 'text-green-600'
        case 'Needs Improvement':
          return 'text-yellow-600'
        case 'Poor':
          return 'text-red-600'
        default:
          return 'text-swiss-secondary'
      }
    })

    return { gradeColor }
  },
  template: `
    <div class="flex justify-between items-center p-2 bg-swiss-bg rounded">
      <span class="text-sm text-swiss-secondary">{{ label }}</span>
      <div class="text-right">
        <span v-if="value !== null" class="font-mono text-sm font-bold">{{ value.toFixed(0) }}ms</span>
        <span v-else class="text-sm text-swiss-secondary">測量中...</span>
        <span :class="gradeColor" class="ml-2 text-xs">{{ grade }}</span>
      </div>
    </div>
  `,
})
</script>
