<template>
    <div class="space-y-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-bold tracking-tight">資訊管理 News</h2>
                <p class="text-gray-500 mt-2">發佈行業動態及公司新聞。</p>
            </div>
            <UButton to="/admin/news/new" icon="i-heroicons-plus" color="black" size="lg" class="rounded-xl">
                發佈諮訊
            </UButton>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <UTable :rows="posts" :columns="columns" :loading="loading">
                <template #title-data="{ row }">
                    <div class="font-medium text-gray-900">{{ row.title?.['zh-HK'] || row.title?.['hk'] }}</div>
                </template>

                <template #published_at-data="{ row }">
                    <span class="text-xs text-gray-500">{{ row.published_at ? formatDate(row.published_at) : '未發佈'
                    }}</span>
                </template>

                <template #actions-data="{ row }">
                    <UButton icon="i-heroicons-pencil-square" variant="ghost" color="gray"
                        :to="`/admin/news/${row.id}`" />
                    <UButton icon="i-heroicons-trash" variant="ghost" color="red" @click="deletePost(row.id)" />
                </template>
            </UTable>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin'
})

const loading = ref(true)
const posts = ref([])

const columns = [
    { key: 'title', label: '標題' },
    { key: 'published_at', label: '發佈時間' },
    { key: 'actions', label: '' }
]

onMounted(async () => {
    await fetchPosts()
})

async function fetchPosts() {
    loading.value = true
    try {
        const response = await $fetch('/api/news') as any
        if (response.success) {
            posts.value = response.data
        }
    } catch (error) {
        console.error('获取文章列表失败:', error)
    } finally {
        loading.value = false
    }
}

async function deletePost(id: number) {
    if (!confirm('確定刪除此文章？')) return

    try {
        await $fetch(`/api/news/${id}`, {
            method: 'DELETE'
        })
        posts.value = posts.value.filter((p: any) => p.id !== id)
    } catch (error: any) {
        console.error('刪除失敗:', error)
        const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
        alert(errorMessage)
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>
