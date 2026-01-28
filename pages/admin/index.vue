<template>
  <div>
    <!-- Error State -->
    <div v-if="error" class="min-h-screen bg-white p-8">
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
          <button @click="retryLoad"
            class="mt-6 text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-text text-white hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all rounded-none">
            重新加载
          </button>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
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
        <!-- Shimmer Skeleton for Stats Value -->
        <div v-if="stat.loading" class="h-12 w-32 bg-gray-50 relative overflow-hidden mb-4">
          <div class="shimmer absolute inset-0"></div>
        </div>

        <p v-else class="text-4xl font-black tracking-tight text-swiss-text">{{ stat.value }}</p>

        <!-- Shimmer Skeleton for Trend -->
        <div v-if="stat.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden mt-4">
          <div class="shimmer absolute inset-0"></div>
        </div>

        <p
          class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4 flex items-center"
          v-if="stat.trend && !stat.loading"
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
             <!-- Shimmer Skeleton for URL -->
             <div v-if="serverStatus.frontend.loading" class="h-4 w-48 bg-gray-50 relative overflow-hidden">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <p v-else class="text-sm text-swiss-text/60">{{ serverStatus.frontend.url }}</p>
           </div>
           <div class="text-right">
             <!-- Shimmer Skeleton for Status Indicator -->
             <div v-if="serverStatus.frontend.loading" class="w-3 h-3 rounded-full bg-gray-100 relative overflow-hidden mb-1">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <!-- Actual Status Indicator -->
             <span
               v-else
               class="w-3 h-3 rounded-full"
               :class="{
                 'bg-green-500': serverStatus.frontend.status === 'online',
                 'bg-red-500': serverStatus.frontend.status === 'offline',
                 'bg-yellow-500':
                   serverStatus.frontend.status === 'error' ||
                   serverStatus.frontend.status === 'unknown',
               }"
             ></span>
             <div class="flex flex-col items-end">
               <!-- Shimmer Skeleton for Status Text -->
               <div v-if="serverStatus.frontend.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden">
                 <div class="shimmer absolute inset-0"></div>
               </div>

               <!-- Actual Status Text -->
               <span
                 v-else
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

             <!-- Shimmer Skeleton for Response Time -->
             <div v-if="serverStatus.frontend.loading" class="h-3 w-12 bg-gray-50 relative overflow-hidden">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <p v-else-if="serverStatus.frontend.responseTime" class="text-[10px] font-mono text-swiss-text-muted">
               {{ serverStatus.frontend.responseTime }}ms
             </p>
             <p v-else class="text-[10px] font-mono text-swiss-text-muted">--</p>
          </div>
        </div>

        <!-- Backend Status -->
        <div class="flex items-center justify-between p-4 border border-swiss-text/10">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-1">
              Backend Server (Supabase)
            </p>
             <!-- Shimmer Skeleton for URL -->
             <div v-if="serverStatus.backend.loading" class="h-4 w-48 bg-gray-50 relative overflow-hidden">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <p v-else class="text-sm text-swiss-text/60">{{ serverStatus.backend.url }}</p>
           </div>
           <div class="text-right">
             <!-- Shimmer Skeleton for Status Indicator -->
             <div v-if="serverStatus.backend.loading" class="w-3 h-3 rounded-full bg-gray-100 relative overflow-hidden mb-1">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <!-- Actual Status Indicator -->
             <span
               v-else
               class="w-3 h-3 rounded-full"
               :class="{
                 'bg-green-500': serverStatus.backend.status === 'online',
                 'bg-red-500': serverStatus.backend.status === 'offline',
                 'bg-yellow-500':
                   serverStatus.backend.status === 'error' ||
                   serverStatus.backend.status === 'unknown',
               }"
             ></span>

             <!-- Shimmer Skeleton for Status Text -->
             <div v-if="serverStatus.backend.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <!-- Actual Status Text -->
             <span
               v-else
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

             <!-- Shimmer Skeleton for Response Time -->
             <div v-if="serverStatus.backend.loading" class="h-3 w-12 bg-gray-50 relative overflow-hidden">
               <div class="shimmer absolute inset-0"></div>
             </div>

             <p v-else-if="serverStatus.backend.responseTime" class="text-[10px] font-mono text-swiss-text-muted">
               {{ serverStatus.backend.responseTime }}ms
             </p>
             <p v-else class="text-[10px] font-mono text-swiss-text-muted">--</p>
           </div>
        </div>

        <!-- Last Updated -->
        <div
          class="flex items-center justify-between text-[10px] text-swiss-text-muted uppercase tracking-widest pt-2"
        >
          <span>Last Updated</span>
          <span v-if="serverStatus.loading" class="animate-pulse">更新中...</span>
          <span v-else>{{ lastUpdated }}</span>
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
         <!-- Shimmer Skeleton for Table -->
         <div v-if="inquiriesLoading" class="space-y-4 p-6 md:p-8">
           <!-- Table Header Skeleton -->
           <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
             <div v-for="i in 4" :key="i" class="flex-1 px-4">
               <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
                 <div class="shimmer absolute inset-0"></div>
               </div>
             </div>
           </div>
           <!-- Table Rows Skeleton -->
           <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4">
             <div v-for="i in 4" :key="i" class="flex-1 px-4">
               <div
                 class="h-4 bg-gray-50 relative overflow-hidden"
                 :style="{ width: (Math.random() * 40 + 40) + '%' }"
               >
                 <div class="shimmer absolute inset-0"></div>
               </div>
             </div>
           </div>
         </div>
 
         <!-- Empty State for Inquiries -->
         <div
           v-else-if="inquiries.length === 0"
           class="p-12 text-center text-swiss-text-muted uppercase tracking-widest text-[10px]"
         >
           暂無記錄
         </div>

         <!-- Inquiries Table -->
         <table v-else class="w-full text-left text-sm">
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
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const stats = ref([
  { name: '總產品數', value: '0', loading: true, trend: '' },
  { name: '待處理詢盤', value: '0', loading: true, trend: '' },
  { name: '本月新聞', value: '0', loading: true, trend: '' },
  { name: '系統狀態', value: '穩定', loading: false, trend: '' },
])

const inquiries = ref<any[]>([])
const inquiriesLoading = ref(true)
const serverStatus = ref({
  loading: true,
  frontend: { url: '', status: 'unknown', responseTime: null } as any,
  backend: { url: '', status: 'unknown', responseTime: null } as any,
})
const lastUpdated = ref('加载中...')
let statusInterval: any = null

// 使用独立的加载状态
const error = ref<any>(null)
const initialLoadComplete = ref(false)

// 加载统计数据
async function loadStats() {
  try {
    const response = (await $fetch('/api/admin/dashboard')) as any
    if (response.success) {
      const data = response.data
      if (data.stats) {
        stats.value[0].value = String(data.stats.products || 0)
        stats.value[0].loading = false
        stats.value[1].value = String(data.stats.inquiries || 0)
        stats.value[1].loading = false
        stats.value[2].value = String(data.stats.posts || 0)
        stats.value[2].loading = false
      }
    }
  } catch (e) {
    console.error('[Admin Dashboard] Stats load error:', e)
    // 单独设置错误，不影响其他部分
    stats.value[0].loading = false
    stats.value[1].loading = false
    stats.value[2].loading = false
  }
}

// 加载服务器状态
async function loadServerStatus() {
  try {
    const response = (await $fetch('/api/admin/dashboard')) as any
    if (response.success) {
      const data = response.data
      if (data.serverStatus) {
        serverStatus.value.loading = false
        serverStatus.value.frontend = data.serverStatus.frontend
        serverStatus.value.backend = data.serverStatus.backend
        lastUpdated.value = new Date().toLocaleString('zh-HK')
      }
    }
  } catch (e) {
    console.error('[Admin Dashboard] Server status load error:', e)
    serverStatus.value.serverStatus = false
    serverStatus.value.frontend = { url: '-', status: 'unknown', responseTime: null }
    serverStatus.value.backend = { url: '-', status: 'unknown', responseTime: null }
    lastUpdated.value = '加载失败'
  }
}

// 加载询盘数据
async function loadInquiries() {
  try {
    const response = (await $fetch('/api/admin/dashboard')) as any
    if (response.success) {
      const data = response.data
      if (data.recentInquiries) {
        inquiries.value = data.recentInquiries
        inquiriesLoading.value = false
      }
    }
  } catch (e) {
    console.error('[Admin Dashboard] Inquiries load error:', e)
    inquiriesLoading.value = false
    inquiries.value = []
  }
}

// 并发加载所有数据
async function loadAllData() {
  error.value = null
  initialLoadComplete.value = false

  try {
    // 并发加载所有部分
    await Promise.all([loadStats(), loadServerStatus(), loadInquiries()])

    initialLoadComplete.value = true
  } catch (e) {
    console.error('[Admin Dashboard] Load error:', e)
    error.value = e.message || '加载失败'
  }
}

// 重试加载
function retryLoad() {
  console.log('[Admin Dashboard] Retrying...')
  loadAllData()
}

// 页面加载时获取数据
onMounted(() => {
  loadAllData()
})

// 定期刷新服务器状态
onMounted(() => {
  statusInterval = setInterval(async () => {
    try {
      const resp = (await $fetch('/api/admin/dashboard')) as any
      if (resp.success) {
        const data = resp.data
        if (data.serverStatus) {
          serverStatus.value.frontend = data.serverStatus.frontend
          serverStatus.value.backend = data.serverStatus.backend
          lastUpdated.value = new Date().toLocaleString('zh-HK')
        }
      }
    } catch (e) {
      console.error('Refresh status failed:', e)
    }
  }, 30000)
})

onBeforeUnmount(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})

 function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.4) 55%,
            rgba(255, 255, 255, 0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
