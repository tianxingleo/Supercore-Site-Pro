<template>
  <div v-if="isDev && showPanel" class="fixed bottom-0 right-0 z-[100] font-mono">
    <!-- Toggle Button -->
    <button
      @click="togglePanel"
      class="bg-swiss-text text-white text-[10px] font-bold tracking-[0.2em] px-6 py-3 uppercase hover:pr-8 transition-all"
    >
      {{ isExpanded ? '-' : '+' }} DEV_MONITOR
    </button>

    <!-- Panel Content -->
    <div
      v-if="isExpanded"
      class="bg-white border-l border-t border-black p-8 w-[320px] max-h-[80vh] overflow-y-auto"
    >
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h3 class="text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text">Telemetry</h3>
        <span class="text-[9px] text-swiss-text/40 tracking-widest uppercase">sys_v1.0</span>
      </div>

      <div class="space-y-6">
        <div v-for="(value, key) in metrics" :key="key" class="group">
          <div class="flex items-end justify-between mb-1">
            <span class="text-[9px] font-bold text-swiss-text/40 uppercase tracking-widest">{{ key }}</span>
            <span 
              class="text-[9px] font-bold uppercase tracking-widest"
              :class="getPerformanceColor(key as keyof PerformanceMetrics)"
            >
              [{{ getPerformanceGrade(key as keyof PerformanceMetrics) }}]
            </span>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-[10px] font-bold text-swiss-text truncate max-w-[150px]">{{ getMetricLabel(key) }}</span>
            <span class="text-xs font-black text-swiss-text">{{ formatValue(value) }}</span>
          </div>
          <!-- Tiny bar chart simulation -->
          <div class="mt-2 h-[2px] w-full bg-gray-100 overflow-hidden">
            <div 
              class="h-full bg-swiss-text transition-all duration-1000"
              :style="{ width: getMetricPercentage(key as keyof PerformanceMetrics) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-gray-100">
        <button
          @click="runLighthouse"
          class="w-full py-4 border border-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all"
        >
          EXEC_LIGHTHOUSE
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

const formatValue = (value: number | null) => {
  if (value === null) return 'ERR_NULL'
  if (value < 1) return value.toFixed(3)
  return Math.round(value) + (value > 100 ? 'ms' : '')
}

const getMetricLabel = (key: string): string => {
  const labels: Record<string, string> = {
    LCP: 'Largest Contentful Paint',
    FID: 'First Input Delay',
    CLS: 'Layout Shift',
    FCP: 'First Paint',
    TTI: 'Interactive',
    loadTime: 'Load Time',
  }
  return labels[key] || key
}

const getPerformanceGrade = (key: keyof PerformanceMetrics): string => {
  const value = props.metrics[key]
  if (value === null) return 'VOID'

  switch (key) {
    case 'LCP':
      if (value < 2500) return 'NOMINAL'
      if (value < 4000) return 'WARNING'
      return 'CRITICAL'
    case 'FID':
      if (value < 100) return 'NOMINAL'
      if (value < 300) return 'WARNING'
      return 'CRITICAL'
    case 'CLS':
      if (value < 0.1) return 'NOMINAL'
      if (value < 0.25) return 'WARNING'
      return 'CRITICAL'
    default:
      return 'OK'
  }
}

const getPerformanceColor = (key: keyof PerformanceMetrics): string => {
  const grade = getPerformanceGrade(key)
  if (grade === 'NOMINAL') return 'text-swiss-text opacity-40'
  if (grade === 'WARNING') return 'text-orange-500'
  if (grade === 'CRITICAL') return 'text-red-600'
  return 'text-swiss-text/20'
}

const getMetricPercentage = (key: keyof PerformanceMetrics): number => {
  const value = props.metrics[key]
  if (!value) return 0
  if (key === 'CLS') return Math.min(value * 100, 100)
  if (key === 'LCP') return Math.min((value / 5000) * 100, 100)
  return 70 // default fallback
}

const runLighthouse = () => {
  if (process.client) {
    window.open('chrome-lighthouse://', '_blank')
  }
}
</script>  }
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
