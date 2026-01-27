<template>
    <div class="space-y-8">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">詢盤管理 Inquiries</h2>
            <p class="text-gray-500 mt-2">來自客戶的聯繫表單提交。</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <UTable :rows="inquiries" :columns="columns" :loading="loading">
                <template #email-data="{ row }">
                    <div>
                        <div class="font-medium">{{ row.email }}</div>
                        <div class="text-xs text-gray-400 capitalize">{{ row.company || '個人' }}</div>
                    </div>
                </template>

                <template #message-data="{ row }">
                    <div class="truncate max-w-sm" :title="row.message">{{ row.message }}</div>
                </template>

                <template #created_at-data="{ row }">
                    <span class="text-xs text-gray-500">{{ formatDate(row.created_at) }}</span>
                </template>

                <template #status-data="{ row }">
                    <UBadge :color="row.status === 'new' ? 'blue' : 'gray'" variant="soft"
                        class="uppercase text-[10px]">
                        {{ row.status }}
                    </UBadge>
                </template>

                <template #actions-data="{ row }">
                    <UButton v-if="row.status === 'new'" size="xs" color="black" variant="ghost"
                        @click="markAsRead(row.id)">
                        標記為已讀
                    </UButton>
                    <UButton icon="i-heroicons-trash" color="red" variant="ghost" size="xs"
                        @click="deleteInquiry(row.id)" />
                </template>
            </UTable>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

const client = useSupabaseClient()
const loading = ref(true)
const inquiries = ref([])

const columns = [
    { key: 'email', label: '客戶聯絡' },
    { key: 'message', label: '留言內容' },
    { key: 'created_at', label: '時間' },
    { key: 'status', label: '狀態' },
    { key: 'actions', label: '' }
]

onMounted(async () => {
    await fetchInquiries()
})

async function fetchInquiries() {
    loading.value = true
    const { data } = await client
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

    if (data) inquiries.value = data
    loading.value = false
}

async function markAsRead(id: number) {
    const { error } = await client.from('inquiries').update({ status: 'read' }).eq('id', id)
    if (!error) {
        const item = inquiries.value.find((i: any) => i.id === id)
        if (item) item.status = 'read'
    }
}

async function deleteInquiry(id: number) {
    if (!confirm('確定刪除此詢盤？')) return
    const { error } = await client.from('inquiries').delete().eq('id', id)
    if (!error) {
        inquiries.value = inquiries.value.filter((i: any) => i.id !== id)
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('zh-HK')
}
</script>
