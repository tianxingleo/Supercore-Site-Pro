<template>
    <div class="space-y-8">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">儀錶盤 Dashboard</h2>
            <p class="text-gray-500 mt-2">歡迎回來，系統概覽如下。</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.name"
                class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p class="text-sm font-medium text-gray-500">{{ stat.name }}</p>
                <p class="text-2xl font-bold mt-2">{{ stat.value }}</p>
                <p class="text-xs text-green-500 mt-2 flex items-center" v-if="stat.trend">
                    <UIcon name="i-heroicons-arrow-trending-up" class="mr-1" />
                    {{ stat.trend }}
                </p>
            </div>
        </div>

        <!-- Recent Inquiries -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 class="font-bold">近期詢盤</h3>
                <NuxtLink to="/admin/inquiries" class="text-sm text-[#0071e3] font-medium">查看全部</NuxtLink>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider">
                        <tr>
                            <th class="px-6 py-4">客戶 / 公司</th>
                            <th class="px-6 py-4">信息摘要</th>
                            <th class="px-6 py-4">時間</th>
                            <th class="px-6 py-4">狀態</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="inquiry in inquiries" :key="inquiry.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-medium">{{ inquiry.email }}</div>
                                <div class="text-xs text-gray-500">{{ inquiry.company || '個人' }}</div>
                            </td>
                            <td class="px-6 py-4 text-gray-600 truncate max-w-xs">{{ inquiry.message }}</td>
                            <td class="px-6 py-4 text-gray-500 text-xs">{{ formatDate(inquiry.created_at) }}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase" :class="[
                                    inquiry.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                ]">
                                    {{ inquiry.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="inquiries.length === 0">
                            <td colspan="4" class="px-6 py-12 text-center text-gray-400">暫無記錄</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
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
        const response = await $fetch('/api/stats') as any
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
        const response = await $fetch('/api/inquiries') as any
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
