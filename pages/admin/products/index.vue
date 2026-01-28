<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> 產品管理 Products </TypographyHeader>
        <p class="text-swiss-text-muted">管理您的產品目錄及 3D 模型配置。</p>
      </div>
      <SwissButton tag="a" to="/admin/products/new" variant="primary" size="lg" class="w-full md:w-auto">
        新增產品
      </SwissButton>
    </div>

    <!-- Filters and Actions -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <div class="flex flex-wrap gap-4">
        <input v-model="search" placeholder="搜索產品..."
          class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-64 focus:outline-none focus:border-swiss-text placeholder-swiss-text-muted/40" />
        <select v-model="selectedCategory"
          class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-40 focus:outline-none focus:border-swiss-text">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <!-- Bulk Actions and Export -->
      <div class="flex gap-2">
        <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-bars-3-bottom-left" size="sm"
            class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
            批量操作 ({{ selectedItems.length }})
          </UButton>
        </UDropdown>

        <UDropdown :items="exportItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm"
            class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
            導出數據
          </UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white border border-swiss-text/10">
      <TableSkeleton v-if="pending" />
      <UTable v-else :rows="filteredProducts" :columns="columns" :loading="false" v-model="selectedItems" :ui="{
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
        <template #name-data="{ row }">
          <div class="flex items-center space-x-3">
            <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)"
              class="w-4 h-4 border-swiss-text/20" />
            <div class="w-10 h-10 bg-swiss-bg-soft overflow-hidden flex-shrink-0">
              <img v-if="row.images?.[0]" :src="row.images[0]" :alt="row.name?.['zh-HK'] || row.name?.['hk']"
                loading="lazy" class="w-full h-full object-cover" />
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
          <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="[
            row.status === 'published'
              ? 'bg-swiss-text text-white'
              : 'bg-swiss-bg-soft text-swiss-text-muted',
          ]">
            {{ row.status }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="getActionItems(row)" :ui="{ item: { size: 'text-sm' } }">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"
              class="rounded-none hover:-translate-y-0.5 transition-all" />
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
const selectedItems = ref<any[]>([])

const categories = ['All', 'server', 'storage', 'network', 'hpc', 'storage-hp']

const columns = [
  { key: 'name', label: '產品信息' },
  { key: 'category', label: '分類' },
  { key: 'status', label: '狀態' },
  { key: 'actions', label: '' },
]

// 使用 useLazyFetch 实现动态数据加载和自动刷新
const { data: response, pending, refresh, error } = useLazyFetch('/api/products', {
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

// 批量操作菜单项
const bulkActionItems = computed(() => [
  [
    {
      label: '批量刪除',
      icon: 'i-heroicons-trash-20-solid',
      class: 'text-red-500',
      click: bulkDelete,
    },
    {
      label: '批量發布',
      icon: 'i-heroicons-check-circle-20-solid',
      click: () => bulkUpdate({ status: 'published' }),
    },
    {
      label: '批量草稿',
      icon: 'i-heroicons-document-text-20-solid',
      click: () => bulkUpdate({ status: 'draft' }),
    },
  ],
])

// 导出菜单项
const exportItems = [
  [
    {
      label: '導出為 JSON',
      icon: 'i-heroicons-code-bracket-20-solid',
      click: () => exportData('json'),
    },
    {
      label: '導出為 CSV',
      icon: 'i-heroicons-table-cells-20-solid',
      click: () => exportData('csv'),
    },
  ],
]

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
  if (!products.value) return []
  return products.value.filter((p: any) => {
    if (!p) return false
    const matchesSearch =
      (p.slug || '').toLowerCase().includes(search.value.toLowerCase()) ||
      JSON.stringify(p.name || {}).toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory =
      selectedCategory.value === 'All' || p.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// 切换选择
function toggleSelection(row: any) {
  const index = selectedItems.value.findIndex((item) => item.id === row.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(row)
  }
}

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

// 批量删除
async function bulkDelete() {
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 個產品嗎？`)) return

  try {
    const ids = selectedItems.value.map((item) => item.id)
    await $fetch('/api/products/admin/bulk', {
      method: 'POST',
      body: { ids, action: 'delete' },
    })

    selectedItems.value = []
    refreshKey.value++
    await refresh()
    alert('批量刪除成功')
  } catch (error: any) {
    console.error('批量刪除失敗:', error)
    alert(error.data?.message || '批量刪除失敗')
  }
}

// 批量更新
async function bulkUpdate(data: any) {
  try {
    const ids = selectedItems.value.map((item) => item.id)
    await $fetch('/api/products/admin/bulk', {
      method: 'POST',
      body: { ids, action: 'update', data },
    })

    selectedItems.value = []
    refreshKey.value++
    await refresh()
    alert('批量更新成功')
  } catch (error: any) {
    console.error('批量更新失敗:', error)
    alert(error.data?.message || '批量更新失敗')
  }
}

// 导出数据
async function exportData(format: 'json' | 'csv') {
  try {
    // 使用 $fetch 获取数据，这样可以包含认证信息并更好地处理错误
    const blob = await $fetch(`/api/products/admin/export?format=${format}`, {
      method: 'GET',
      responseType: 'blob'
    })

    // 创建一个 URL 并触发下载
    const url = window.URL.createObjectURL(blob as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `products_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error: any) {
    console.error('導出失敗:', error)
    alert('導出失敗，請重試')
  }
}

// 暴露刷新函数供外部使用
defineExpose({
  refresh
})
</script>
