<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> 產品管理 Products </TypographyHeader>
        <p class="text-swiss-text-muted">管理您的產品目錄及 3D 模型配置。</p>
      </div>
      <SwissButton
        tag="a"
        to="/admin/products/new"
        variant="primary"
        size="lg"
        class="w-full md:w-auto"
      >
        新增產品
      </SwissButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <input
        v-model="search"
        placeholder="搜索產品..."
        class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-64 focus:outline-none focus:border-swiss-text placeholder-swiss-text-muted/40"
      />
      <select
        v-model="selectedCategory"
        class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-40 focus:outline-none focus:border-swiss-text"
      >
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="bg-white border border-swiss-text/10">
      <UTable
        :rows="filteredProducts"
        :columns="columns"
        :loading="pending"
        :ui="{
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
        }"
      >
        <template #name-data="{ row }">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-swiss-bg-soft overflow-hidden flex-shrink-0">
              <img
                v-if="row.images?.[0]"
                :src="row.images[0]"
                :alt="row.name?.['zh-HK'] || row.name?.['hk']"
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-swiss-bg flex items-center justify-center">
                <span class="text-[8px] text-swiss-text-muted">No Image</span>
              </div>
            </div>
            <div>
              <div class="font-medium text-swiss-text">
                {{ row.name?.['zh-HK'] || row.name?.['hk'] }}
              </div>
              <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
                {{ row.slug }}
              </div>
            </div>
          </div>
        </template>

        <template #category-data="{ row }">
          <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">{{
            row.category
          }}</span>
        </template>

        <template #status-data="{ row }">
          <span
            class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
            :class="[
              row.status === 'published'
                ? 'bg-swiss-text text-white'
                : 'bg-swiss-bg-soft text-swiss-text-muted',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="getActionItems(row)" :ui="{ item: { size: 'text-sm' } }">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const search = ref('')
const selectedCategory = ref('All')
const refreshKey = ref(0)

const categories = ['All', 'server', 'storage', 'network', 'hpc', 'storage-hp']

const columns = [
  { key: 'name', label: '產品信息' },
  { key: 'category', label: '分類' },
  { key: 'status', label: '狀態' },
  { key: 'actions', label: '' },
]

// 使用 useLazyFetch 实现动态数据加载和自动刷新
const { data: response, pending, refresh, error } = await useLazyFetch('/api/products', {
  key: () => `products-${refreshKey.value}`,
  transform: (data: any) => data,
  default: () => ({ success: false, data: [] })
})

const products = computed(() => response.value?.success ? response.value.data : [])

// 监听错误
watchEffect(() => {
  if (error.value) {
    console.error('获取产品列表失败:', error.value)
  }
})

const getActionItems = (row: any) => [
  [
    {
      label: '編輯',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => navigateTo(`/admin/products/${row.id}`),
    },
    {
      label: '預覽',
      icon: 'i-heroicons-eye-20-solid',
      click: () => window.open(`/products/${row.slug}`, '_blank'),
    },
  ],
  [
    {
      label: '刪除',
      icon: 'i-heroicons-trash-20-solid',
      class: 'text-red-500 hover:text-red-600',
      click: () => deleteProduct(row.id),
    },
  ],
]

const filteredProducts = computed(() => {
  return products.value.filter((p: any) => {
    const matchesSearch =
      p.slug.toLowerCase().includes(search.value.toLowerCase()) ||
      JSON.stringify(p.name).toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || p.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

async function deleteProduct(id: number) {
  if (!confirm('確定要刪除此產品嗎？')) return

  try {
    await $fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    // 立刻刷新数据，实现动态更新
    refreshKey.value++
    await refresh()
  } catch (error: any) {
    console.error('刪除失敗:', error)
    const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
    alert(errorMessage)
  }
}

// 暴露刷新函数供外部使用
defineExpose({
  refresh
})
</script>
