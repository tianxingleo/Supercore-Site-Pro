<template>
  <div class="space-y-12">
    <div>
      <TypographyHeader :level="2" size="h2" class="mb-4"> 儀錶盤 Dashboard </TypographyHeader>
      <p class="text-swiss-text-muted mt-4">歡迎回來，系統概覽如下。</p>
    </div>

    <!-- Stats Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-swiss-text/10"
    >
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white p-8 border-r border-b border-swiss-text/10"
      >
        <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-4">
          {{ stat.name }}
        </p>
        <p class="text-4xl font-black tracking-tight text-swiss-text">{{ stat.value }}</p>
        <p
          class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4 flex items-center"
          v-if="stat.trend"
        >
          {{ stat.trend }}
        </p>
      </div>
    </div>

    <!-- Server Status -->
    <div class="bg-white border border-swiss-text/10">
      <div class="p-6 md:p-8 border-b border-swiss-text/10">
        <TypographyHeader :level="3" size="h4" class="!mb-0">
          服务器状态 Server Status
        </TypographyHeader>
      </div>
      <div class="p-6 md:p-8 space-y-4">
        <!-- Frontend Status -->
        <div class="flex items-center justify-between p-4 border border-swiss-text/10">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-1">
              Frontend Server
            </p>
            <p class="text-sm text-swiss-text/60">{{ serverStatus.frontend.url }}</p>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end gap-2 mb-1">
              <span
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-green-500': serverStatus.frontend.status === 'online',
                  'bg-red-500': serverStatus.frontend.status === 'offline',
                  'bg-yellow-500':
                    serverStatus.frontend.status === 'error' ||
                    serverStatus.frontend.status === 'unknown',
                }"
              ></span>
              <span
                class="text-xs font-bold uppercase tracking-wider"
                :class="{
                  'text-green-600': serverStatus.frontend.status === 'online',
                  'text-red-600': serverStatus.frontend.status === 'offline',
                  'text-yellow-600':
                    serverStatus.frontend.status === 'error' ||
                    serverStatus.frontend.status === 'unknown',
                }"
              >
                {{ serverStatus.frontend.status }}
              </span>
            </div>
            <p class="text-[10px] font-mono text-swiss-text-muted">
              {{
                serverStatus.frontend.responseTime
                  ? `${serverStatus.frontend.responseTime}ms`
                  : '--'
              }}
            </p>
          </div>
        </div>

        <!-- Backend Status -->
        <div class="flex items-center justify-between p-4 border border-swiss-text/10">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-1">
              Backend Server (Supabase)
            </p>
            <p class="text-sm text-swiss-text/60">{{ serverStatus.backend.url }}</p>
          </div>
          <div class="text-right">
            <div class="flex items-center justify-end gap-2 mb-1">
              <span
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-green-500': serverStatus.backend.status === 'online',
                  'bg-red-500': serverStatus.backend.status === 'offline',
                  'bg-yellow-500':
                    serverStatus.backend.status === 'error' ||
                    serverStatus.backend.status === 'unknown',
                }"
              ></span>
              <span
                class="text-xs font-bold uppercase tracking-wider"
                :class="{
                  'text-green-600': serverStatus.backend.status === 'online',
                  'text-red-600': serverStatus.backend.status === 'offline',
                  'text-yellow-600':
                    serverStatus.backend.status === 'error' ||
                    serverStatus.backend.status === 'unknown',
                }"
              >
                {{ serverStatus.backend.status }}
              </span>
            </div>
            <p class="text-[10px] font-mono text-swiss-text-muted">
              {{
                serverStatus.backend.responseTime ? `${serverStatus.backend.responseTime}ms` : '--'
              }}
            </p>
          </div>
        </div>

        <!-- Last Updated -->
        <div
          class="flex items-center justify-between text-[10px] text-swiss-text-muted uppercase tracking-widest pt-2"
        >
          <span>Last Updated</span>
          <span>{{ lastUpdated }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Inquiries -->
    <div class="bg-white border border-swiss-text/10">
      <div class="p-6 md:p-8 border-b border-swiss-text/10 flex justify-between items-center">
        <TypographyHeader :level="3" size="h4" class="!mb-0"> 近期詢盤 </TypographyHeader>
        <NuxtLink
          to="/admin/inquiries"
          class="text-[10px] font-bold uppercase tracking-widest text-swiss-text hover:text-swiss-text-muted transition-colors"
        >
          查看全部 <span class="ml-2">→</span>
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="bg-swiss-bg-soft text-swiss-text-muted uppercase text-[10px] tracking-widest font-bold"
          >
            <tr>
              <th class="px-6 md:px-8 py-4">客戶 / 公司</th>
              <th class="px-6 md:px-8 py-4">信息摘要</th>
              <th class="px-6 md:px-8 py-4">時間</th>
              <th class="px-6 md:px-8 py-4">狀態</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-swiss-text/10">
            <tr
              v-for="inquiry in inquiries"
              :key="inquiry.id"
              class="hover:bg-swiss-bg-soft transition-colors"
            >
              <td class="px-6 md:px-8 py-4">
                <div class="font-medium text-swiss-text">{{ inquiry.email }}</div>
                <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
                  {{ inquiry.company || '個人' }}
                </div>
              </td>
              <td class="px-6 md:px-8 py-4 text-swiss-text-muted truncate max-w-xs">
                {{ inquiry.message }}
              </td>
              <td
                class="px-6 md:px-8 py-4 text-swiss-text-muted text-[10px] uppercase tracking-wider"
              >
                {{ formatDate(inquiry.created_at) }}
              </td>
              <td class="px-6 md:px-8 py-4">
                <span
                  class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                  :class="[
                    inquiry.status === 'new'
                      ? 'bg-swiss-text text-white'
                      : 'bg-swiss-bg-soft text-swiss-text',
                  ]"
                >
                  {{ inquiry.status }}
                </span>
              </td>
            </tr>
            <tr v-if="inquiries.length === 0">
              <td
                colspan="4"
                class="px-6 md:px-8 py-12 text-center text-swiss-text-muted uppercase tracking-widest text-[10px]"
              >
                暫無記錄
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const stats = ref([
  { name: '總產品數', value: '0', trend: '' },
  { name: '待處理詢盤', value: '0', trend: '' },
  { name: '本月新聞', value: '0', trend: '' },
  { name: '系統狀態', value: '穩定', trend: '' },
])

const inquiries = ref<any[]>([])
const serverStatus = ref({
  frontend: { url: '', status: 'unknown', responseTime: null } as any,
  backend: { url: '', status: 'unknown', responseTime: null } as any,
})
const lastUpdated = ref('')

onMounted(async () => {
  await fetchStats()
  await fetchInquiries()
  await fetchServerStatus()

  // 自动刷新服务器状态（每30秒）
  setInterval(() => {
    fetchServerStatus()
  }, 30000)
})

async function fetchStats() {
  try {
    const response = (await $fetch('/api/stats')) as any
    if (response.success) {
      stats.value[0].value = String(response.data.products)
      stats.value[1].value = String(response.data.inquiries)
      stats.value[2].value = String(response.data.posts)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

async function fetchInquiries() {
  try {
    const response = (await $fetch('/api/inquiries')) as any
    if (response.success) {
      inquiries.value = response.data.slice(0, 5)
    }
  } catch (error) {
    console.error('获取询盘失败:', error)
  }
}

async function fetchServerStatus() {
  try {
    const response = (await $fetch('/api/system/ping')) as any
    if (response.success) {
      serverStatus.value = response.data
      lastUpdated.value = new Date().toLocaleString('zh-HK')
    }
  } catch (error) {
    console.error('获取服务器状态失败:', error)
    serverStatus.value = {
      frontend: { url: '-', status: 'error', responseTime: null },
      backend: { url: '-', status: 'error', responseTime: null },
    }
    lastUpdated.value = new Date().toLocaleString('zh-HK')
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>
