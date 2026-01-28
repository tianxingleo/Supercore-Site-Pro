<template>
  <!-- Loading State -->
  <DashboardSkeleton v-if="pending || loading" />

  <!-- Error State -->
  <div v-else-if="error" class="min-h-screen bg-white p-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-red-50 border border-red-200 rounded-lg p-8">
        <h2 class="text-xl font-bold text-red-800 mb-4">加载数据失败</h2>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <div class="space-y-2">
          <p class="text-sm text-red-600">可能的原因：</p>
          <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
            <li>Supabase 数据库连接失败</li>
            <li>网络连接问题</li>
            <li>环境变量配置错误</li>
          </ul>
        </div>
        <button
          @click="retryLoad"
          class="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          重新加载
        </button>
      </div>
    </div>
  </div>

  <!-- Data Loaded State -->
  <div v-else class="space-y-12">
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
const loading = ref(false)

// 使用 useLazyFetch 统一管理面板加载状态
const {
  data: dashboardData,
  pending,
  error,
} = useLazyFetch('/api/admin/dashboard', {
  key: 'admin-dashboard',
  default: () => ({
    stats: { products: 0, inquiries: 0, posts: 0 },
    recentInquiries: [],
    serverStatus: {
      frontend: { url: '-', status: 'unknown', responseTime: null },
      backend: { url: '-', status: 'unknown', responseTime: null },
    },
  }),
  onRequest: () => {
    loading.value = true
  },
  onResponse: () => {
    loading.value = false
  },
  onResponseError: ({ error }) => {
    loading.value = false
    console.error('[Admin Dashboard] Fetch error:', error)
  },
})

// 监听数据变化并更新界面
watchEffect(() => {
  // 如果正在加载，不更新数据
  if (pending.value || loading.value) {
    return
  }

  // 如果有错误，不更新数据
  if (error.value) {
    console.error('[Admin Dashboard] Error:', error.value)
    return
  }

  // 更新数据
  if (dashboardData.value) {
    const data = dashboardData.value as any
    // 更新统计
    stats.value[0].value = String(data.stats?.products || 0)
    stats.value[1].value = String(data.stats?.inquiries || 0)
    stats.value[2].value = String(data.stats?.posts || 0)

    // 更新询盘
    if (data.recentInquiries) {
      inquiries.value = data.recentInquiries
    }

    // 更新服务器状态
    if (data.serverStatus) {
      serverStatus.value = data.serverStatus
      lastUpdated.value = new Date().toLocaleString('zh-HK')
    }
  }
})

// 重试加载
function retryLoad() {
  console.log('[Admin Dashboard] Retrying...')
  window.location.reload()
}

onMounted(() => {
  // 自动刷新服务器状态（每30秒）
  setInterval(async () => {
    try {
      const resp = (await $fetch('/api/admin/dashboard')) as any
      if (resp.success) {
        const data = resp.data
        if (data.serverStatus) {
          serverStatus.value = data.serverStatus
          lastUpdated.value = new Date().toLocaleString('zh-HK')
        }
      }
    } catch (e) {
      console.error('Refresh status failed:', e)
    }
  }, 30000)
})

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>
