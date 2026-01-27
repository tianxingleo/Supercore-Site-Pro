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

onMounted(async () => {
  await fetchStats()
  await fetchInquiries()
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>
