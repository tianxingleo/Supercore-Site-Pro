<template>
  <div v-if="isDev && showViewer" class="fixed bottom-0 right-0 z-[100] font-mono">
    <!-- Toggle Button -->
    <button
      @click="toggleViewer"
      class="bg-red-600 text-white text-[10px] font-bold tracking-[0.2em] px-6 py-3 uppercase hover:bg-red-700 transition-all"
    >
      {{ isExpanded ? '-' : '+' }} ERROR_LOG
    </button>

    <!-- Panel Content -->
    <div
      v-if="isExpanded"
      class="bg-white border-l border-t border-red-600 p-6 w-[400px] max-h-[600px] overflow-y-auto shadow-2xl"
    >
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h3 class="text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text">Error Logs</h3>
        <button
          @click="clearLogs"
          class="text-[9px] px-3 py-1 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          CLEAR
        </button>
      </div>

      <!-- Error List -->
      <div v-if="errorLogs.length === 0" class="text-center py-8">
        <p class="text-[10px] text-swiss-text/40">No errors logged</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(log, index) in errorLogs"
          :key="index"
          class="p-3 border border-gray-200 hover:border-red-300 transition-colors cursor-pointer"
          :class="{ 'bg-red-50': log.level === 'ERROR' || log.level === 'FATAL' }"
          @click="selectedLog = selectedLog === index ? null : index"
        >
          <!-- Error Header -->
          <div class="flex items-start justify-between mb-2">
            <span
              class="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5"
              :class="{
                'bg-red-100 text-red-700': log.level === 'ERROR' || log.level === 'FATAL',
                'bg-yellow-100 text-yellow-700': log.level === 'WARN',
                'bg-blue-100 text-blue-700': log.level === 'INFO',
                'bg-gray-100 text-gray-700': log.level === 'DEBUG',
              }"
            >
              {{ log.level }}
            </span>
            <span class="text-[8px] text-swiss-text/40">{{ formatTime(log.timestamp) }}</span>
          </div>

          <!-- Error Message -->
          <p class="text-[10px] font-medium text-swiss-text mb-2 truncate">
            {{ log.message }}
          </p>

          <!-- Error Details (when expanded) -->
          <div v-if="selectedLog === index" class="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <div v-if="log.category" class="text-[8px]">
              <span class="text-swiss-text/40">Category:</span>
              <span class="ml-2 font-mono">{{ log.category }}</span>
            </div>
            <div v-if="log.route" class="text-[8px]">
              <span class="text-swiss-text/40">Route:</span>
              <span class="ml-2 font-mono">{{ log.route }}</span>
            </div>
            <div v-if="log.method" class="text-[8px]">
              <span class="text-swiss-text/40">Method:</span>
              <span class="ml-2 font-mono">{{ log.method }}</span>
            </div>
            <div v-if="log.ip" class="text-[8px]">
              <span class="text-swiss-text/40">IP:</span>
              <span class="ml-2 font-mono">{{ log.ip }}</span>
            </div>
            <div v-if="log.requestId" class="text-[8px]">
              <span class="text-swiss-text/40">Request ID:</span>
              <span class="ml-2 font-mono">{{ log.requestId }}</span>
            </div>
            <div v-if="log.duration" class="text-[8px]">
              <span class="text-swiss-text/40">Duration:</span>
              <span class="ml-2 font-mono">{{ log.duration }}ms</span>
            </div>
            <div v-if="log.stack" class="text-[8px]">
              <span class="text-swiss-text/40">Stack Trace:</span>
              <pre class="ml-2 mt-1 text-[8px] bg-gray-100 p-2 overflow-x-auto">{{ log.stack }}</pre>
            </div>
            <div v-if="log.context && Object.keys(log.context).length > 0" class="text-[8px]">
              <span class="text-swiss-text/40">Context:</span>
              <pre class="ml-2 mt-1 text-[8px] bg-gray-100 p-2 overflow-x-auto">{{ JSON.stringify(log.context, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <div class="mt-6 pt-4 border-t border-gray-100">
        <button
          @click="exportLogs"
          class="w-full py-2 border border-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all"
        >
          EXPORT_LOGS
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDev = process.env.NODE_ENV === 'development'
const isExpanded = ref(false)
const showViewer = ref(true)
const selectedLog = ref<number | null>(null)

interface ErrorLog {
  timestamp: string
  level: string
  category: string
  message: string
  context?: Record<string, any>
  stack?: string
  route?: string
  method?: string
  ip?: string
  requestId?: string
  duration?: number
}

// 从 localStorage 读取错误日志
const errorLogs = ref<ErrorLog[]>([])

// 加载日志
const loadLogs = () => {
  try {
    const stored = localStorage.getItem('error_logs')
    if (stored) {
      errorLogs.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load error logs:', error)
  }
}

// 监听 localStorage 变化
if (process.client) {
  window.addEventListener('storage', (e) => {
    if (e.key === 'error_logs') {
      loadLogs()
    }
  })

  // 初始加载
  loadLogs()

  // 定期刷新日志
  setInterval(loadLogs, 5000)
}

const toggleViewer = () => {
  isExpanded.value = !isExpanded.value
}

const clearLogs = () => {
  errorLogs.value = []
  if (process.client) {
    localStorage.removeItem('error_logs')
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

const exportLogs = () => {
  const data = JSON.stringify(errorLogs.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `error-logs-${new Date().toISOString()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
