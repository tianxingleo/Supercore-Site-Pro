<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 统计数据接口
interface StatsOverview {
  totalSessions: number
  totalMessages: number
  totalTokens: number
  totalCost: number
  avgResponseTime: number
  satisfactionRate: number
  activeSessions: number
}

interface DailyStats {
  date: string
  messages: number
  sessions: number
  tokens: number
  cost: number
}

const isLoading = ref(true)
const error = ref<string | null>(null)
const stats = ref<StatsOverview>({
  totalSessions: 0,
  totalMessages: 0,
  totalTokens: 0,
  totalCost: 0,
  avgResponseTime: 0,
  satisfactionRate: 0,
  activeSessions: 0
})

const dailyStats = ref<DailyStats[]>([])
const period = ref<'7d' | '30d' | '90d'>('7d')

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化货币
const formatCost = (cost: number) => {
  return '¥' + cost.toFixed(4)
}

// 加载统计数据
const loadStats = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await $fetch<any>('/api/chat/admin/stats', {
      params: { period: period.value }
    })

    if (response.success) {
      stats.value = response.data.overview
      dailyStats.value = response.data.daily
    }
  } catch (err: any) {
    console.error('Failed to load stats:', err)
    error.value = err.message || 'Failed to load statistics'
  } finally {
    isLoading.value = false
  }
}

// 计算满意度显示
const satisfactionDisplay = computed(() => {
  return stats.value.satisfactionRate.toFixed(1) + '%'
})

// 生命周期
onMounted(() => {
  loadStats()
})

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <div class="space-y-12">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> AI Chat Analytics </TypographyHeader>
        <p class="text-swiss-text-muted">聊天系统使用统计和分析</p>
      </div>
      <div class="flex items-center gap-4">
        <!-- 时间范围选择 -->
        <select
          v-model="period"
          @change="loadStats"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 bg-white hover:border-swiss-text transition-all outline-none"
        >
          <option value="7d">最近 7 天</option>
          <option value="30d">最近 30 天</option>
          <option value="90d">最近 90 天</option>
        </select>
        <!-- 刷新按钮 -->
        <button
          @click="loadStats"
          :disabled="isLoading"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-swiss-text text-white hover:opacity-80 transition-all disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm"
    >
      {{ error }}
    </div>

    <!-- 统计卡片 -->
    <div v-if="!isLoading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-swiss-text/10">
      <!-- 总会话数 -->
      <div class="bg-white p-8 border-r border-b border-swiss-text/10">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Total Sessions
          </span>
          <svg class="w-5 h-5 text-swiss-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="text-4xl font-black tracking-tight text-swiss-text">
          {{ formatNumber(stats.totalSessions) }}
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4">
          活跃会话: {{ stats.activeSessions }}
        </div>
      </div>

      <!-- 总消息数 -->
      <div class="bg-white p-8 border-r border-b border-swiss-text/10">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Total Messages
          </span>
          <svg class="w-5 h-5 text-swiss-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div class="text-4xl font-black tracking-tight text-swiss-text">
          {{ formatNumber(stats.totalMessages) }}
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4">
          平均响应: {{ stats.avgResponseTime }}ms
        </div>
      </div>

      <!-- 总 Token 数 -->
      <div class="bg-white p-8 border-r border-b border-swiss-text/10">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Total Tokens
          </span>
          <svg class="w-5 h-5 text-swiss-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="text-4xl font-black tracking-tight text-swiss-text">
          {{ formatNumber(stats.totalTokens) }}
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4">
          模型: qwen-plus
        </div>
      </div>

      <!-- 满意度 & 成本 -->
      <div class="bg-white p-8 border-r border-b border-swiss-text/10">
        <div class="flex items-center justify-between mb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Satisfaction
          </span>
          <svg class="w-5 h-5 text-swiss-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </div>
        <div class="text-4xl font-black tracking-tight text-swiss-text">
          {{ satisfactionDisplay }}
        </div>
        <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4">
          总成本: {{ formatCost(stats.totalCost) }}
        </div>
      </div>
    </div>

    <!-- 趋势图表 -->
    <div v-if="!isLoading && !error" class="bg-white border border-swiss-text/10 p-6">
      <h2 class="text-lg font-bold tracking-tight mb-6">使用趋势</h2>
      <div class="h-64 flex items-center justify-center border border-swiss-text/10">
        <p class="text-swiss-text-muted text-sm">
          图表功能开发中...
          <br>
          <span class="text-xs">Daily Stats: {{ dailyStats.length }} days</span>
        </p>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div v-if="!isLoading && !error" class="bg-white border border-swiss-text/10 p-6">
      <h2 class="text-lg font-bold tracking-tight mb-6">快捷操作</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          to="/admin/chat/sessions"
          class="px-4 py-3 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text hover:bg-swiss-text hover:text-white transition-all text-center"
        >
          管理会话
        </NuxtLink>
        <button
          class="px-4 py-3 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all disabled:opacity-50"
          disabled
        >
          导出报告 (开发中)
        </button>
        <button
          class="px-4 py-3 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all disabled:opacity-50"
          disabled
        >
          查看日志 (开发中)
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-swiss-text border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
          Loading statistics...
        </p>
      </div>
    </div>
  </div>
</template>
