<template>
    <div class="space-y-12">
        <div>
            <TypographyHeader :level="2" size="h2" class="mb-4"> 操作日誌 Activity Logs </TypographyHeader>
            <p class="text-swiss-text-muted">查看所有管理員操作記錄。</p>
        </div>

        <!-- Filters -->
        <div class="flex flex-col md:flex-row gap-4">
            <select v-model="filterType"
                class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-48 focus:outline-none focus:border-swiss-text">
                <option value="">所有類型</option>
                <option value="products">產品</option>
                <option value="posts">新聞</option>
                <option value="inquiries">詢盤</option>
            </select>
        </div>

        <div class="bg-white border border-swiss-text/10">
            <TableSkeleton v-if="loading" />
            <div v-else>
                <UTable :rows="logs" :columns="columns" :loading="false" :ui="{
                    wrapper: 'overflow-x-auto',
                    thead: 'bg-swiss-bg-soft',
                    th: {
                        base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
                    },
                    td: {
                        base: 'text-sm text-swiss-text',
                    },
                    tr: {
                        active: 'bg-swiss-bg-soft',
                    },
                }">
                    <template #user_email-data="{ row }">
                        <div class="font-medium text-swiss-text">{{ row.user_email }}</div>
                    </template>

                    <template #action-data="{ row }">
                        <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-swiss-bg-soft">
                            {{ formatAction(row.action) }}
                        </span>
                    </template>

                    <template #resource_type-data="{ row }">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
                            {{ formatResourceType(row.resource_type) }}
                        </span>
                    </template>

                    <template #details-data="{ row }">
                        <div class="text-xs text-swiss-text-muted truncate max-w-xs">
                            {{ formatDetails(row.details) }}
                        </div>
                    </template>

                    <template #created_at-data="{ row }">
                        <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                            formatDate(row.created_at)
                            }}</span>
                    </template>
                </UTable>

                <!-- Pagination -->
                <div v-if="pagination.totalPages > 1"
                    class="p-4 border-t border-swiss-text/10 flex justify-center gap-2">
                    <UButton size="sm" color="gray" variant="outline" :disabled="pagination.page <= 1"
                        @click="changePage(pagination.page - 1)">
                        上一頁
                    </UButton>
                    <span class="px-4 py-2 text-sm text-swiss-text-muted">
                        第 {{ pagination.page }} / {{ pagination.totalPages }} 頁
                    </span>
                    <UButton size="sm" color="gray" variant="outline"
                        :disabled="pagination.page >= pagination.totalPages" @click="changePage(pagination.page + 1)">
                        下一頁
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin',
})

const filterType = ref('')
const currentPage = ref(1)
const limit = 50

const columns = [
    { key: 'user_email', label: '用戶' },
    { key: 'action', label: '操作' },
    { key: 'resource_type', label: '資源類型' },
    { key: 'details', label: '詳情' },
    { key: 'created_at', label: '時間' },
]

// 构建查询参数
const queryParams = computed(() => {
    const params = new URLSearchParams({
        page: String(currentPage.value),
        limit: String(limit),
    })
    if (filterType.value) {
        params.append('type', filterType.value)
    }
    return params.toString()
})

// 使用 useLazyFetch 实现动态数据加载
const { data: response, pending: loading, refresh } = await useLazyFetch(
    () => `/api/admin/logs?${queryParams.value}`,
    {
        key: () => `admin-logs-${currentPage.value}-${filterType.value}`,
        transform: (data: any) => data,
        default: () => ({ success: false, data: { logs: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } } }),
        watch: [queryParams],
    }
)

const logs = computed(() => response.value?.data?.logs || [])
const pagination = computed(() => response.value?.data?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 })

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('zh-HK')
}

function formatAction(action: string) {
    const actionMap: Record<string, string> = {
        create: '創建',
        update: '更新',
        delete: '刪除',
        bulk_delete: '批量刪除',
        bulk_update: '批量更新',
        export: '導出',
    }
    return actionMap[action] || action
}

function formatResourceType(type: string) {
    const typeMap: Record<string, string> = {
        products: '產品',
        posts: '新聞',
        inquiries: '詢盤',
        solutions: '解決方案',
        site_config: '網站配置',
    }
    return typeMap[type] || type
}

function formatDetails(details: any) {
    if (!details) return '-'
    if (details.count) return `數量: ${details.count}`
    if (details.format) return `格式: ${details.format}`
    return JSON.stringify(details).substring(0, 50)
}

function changePage(page: number) {
    currentPage.value = page
}
</script>
