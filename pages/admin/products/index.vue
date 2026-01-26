<template>
    <NuxtLayout name="admin">
        <div class="space-y-8">
            <div class="flex justify-between items-end">
                <div>
                    <h2 class="text-3xl font-bold tracking-tight">產品管理 Products</h2>
                    <p class="text-gray-500 mt-2">管理您的產品目錄及 3D 模型配置。</p>
                </div>
                <UButton to="/admin/products/new" icon="i-heroicons-plus" color="black" size="lg" class="rounded-xl">
                    新增產品
                </UButton>
            </div>

            <!-- Filters -->
            <div class="flex space-x-4">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="搜索產品..."
                    class="w-full max-w-xs" />
                <USelectMenu v-model="selectedCategory" :options="categories" placeholder="分類" class="w-40" />
            </div>

            <!-- Products Table -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <UTable :rows="filteredProducts" :columns="columns" :loading="loading">
                    <template #name-data="{ row }">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img v-if="row.images?.[0]" :src="row.images[0]" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <div class="font-medium text-gray-900">{{ row.name?.['zh-HK'] || row.name?.['hk'] }}
                                </div>
                                <div class="text-xs text-gray-500">{{ row.slug }}</div>
                            </div>
                        </div>
                    </template>

                    <template #category-data="{ row }">
                        <span class="text-xs font-medium text-gray-600 uppercase">{{ row.category }}</span>
                    </template>

                    <template #status-data="{ row }">
                        <UBadge :color="row.status === 'published' ? 'green' : 'gray'" variant="soft" size="xs"
                            class="capitalize">
                            {{ row.status }}
                        </UBadge>
                    </template>

                    <template #actions-data="{ row }">
                        <UDropdown :items="getActionItems(row)">
                            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                        </UDropdown>
                    </template>
                </UTable>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})

const client = useSupabaseClient()
const loading = ref(true)
const products = ref([])
const search = ref('')
const selectedCategory = ref('All')

const categories = ['All', 'server', 'storage', 'network']

const columns = [
    { key: 'name', label: '產品信息' },
    { key: 'category', label: '分類' },
    { key: 'status', label: '狀態' },
    { key: 'actions', label: '' }
]

const getActionItems = (row: any) => [
    [
        {
            label: '編輯',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => navigateTo(`/admin/products/${row.id}`)
        },
        {
            label: '預覽',
            icon: 'i-heroicons-eye-20-solid',
            click: () => window.open(`/products/${row.slug}`, '_blank')
        }
    ],
    [
        {
            label: '刪除',
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-500 hover:text-red-600',
            click: () => deleteProduct(row.id)
        }
    ]
]

const filteredProducts = computed(() => {
    return products.value.filter((p: any) => {
        const matchesSearch = p.slug.toLowerCase().includes(search.value.toLowerCase()) ||
            JSON.stringify(p.name).toLowerCase().includes(search.value.toLowerCase())
        const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value
        return matchesSearch && matchesCategory
    })
})

onMounted(async () => {
    await fetchProducts()
})

async function fetchProducts() {
    loading.value = true
    const { data, error } = await client.from('products').select('*').order('created_at', { ascending: false })
    if (data) products.value = data
    loading.value = false
}

async function deleteProduct(id: number) {
    if (!confirm('確定要刪除此產品嗎？')) return

    const { error } = await client.from('products').delete().eq('id', id)
    if (!error) {
        products.value = products.value.filter((p: any) => p.id !== id)
    }
}
</script>
