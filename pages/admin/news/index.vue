<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> 資訊管理 News </TypographyHeader>
        <p class="text-swiss-text-muted">發佈行業動態及公司新聞。</p>
      </div>
      <SwissButton tag="a" to="/admin/news/new" variant="primary" size="lg" class="w-full md:w-auto">
        發佈諮訊
      </SwissButton>
    </div>

    <!-- Actions Bar -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <div class="flex-1"></div>
      <div class="flex gap-2">
        <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-bars-3-bottom-left" size="sm">
            批量操作 ({{ selectedItems.length }})
          </UButton>
        </UDropdown>

        <UDropdown :items="exportItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm">
            導出數據
          </UButton>
        </UDropdown>
      </div>
    </div>

    <div class="bg-white border border-swiss-text/10">
      <TableSkeleton v-if="pending" />
      <UTable v-else :rows="posts" :columns="columns" :loading="false" :ui="{
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
        <template #title-data="{ row }">
          <div class="flex items-center gap-3">
            <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)"
              class="w-4 h-4 border-swiss-text/20" />
            <div class="font-medium text-swiss-text">
              {{ row.title?.['zh-HK'] || row.title?.['hk'] }}
            </div>
          </div>
        </template>

        <template #published_at-data="{ row }">
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
            row.published_at ? formatDate(row.published_at) : '未發佈'
          }}</span>
        </template>

        <template #actions-data="{ row }">
          <UButton icon="i-heroicons-pencil-square" variant="ghost" color="gray" :to="`/admin/news/${row.id}`"
            size="sm" />
          <UButton icon="i-heroicons-trash" variant="ghost" color="red" @click="deletePost(row.id)" size="sm" />
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
const refreshKey = ref(0)
const selectedItems = ref<any[]>([])

const columns = [
  { key: 'title', label: '標題' },
  { key: 'published_at', label: '發佈時間' },
  { key: 'actions', label: '' },
]

// 使用 useLazyFetch 实现动态数据加载和自动刷新
const { data: response, pending, refresh, error } = await useLazyFetch('/api/news', {
  key: () => `news-${refreshKey.value}`,
  transform: (data: any) => data,
  default: () => ({ success: false, data: [] })
})

const posts = computed(() => response.value?.success ? response.value.data : [])

// 监听错误
watchEffect(() => {
  if (error.value) {
    console.error('获取文章列表失败:', error.value)
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

// 切换选择
function toggleSelection(row: any) {
  const index = selectedItems.value.findIndex((item) => item.id === row.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(row)
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-HK')
}

async function deletePost(id: number) {
  if (!confirm('確定刪除此文章？')) return

  try {
    await $fetch(`/api/news/${id}`, {
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
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 篇文章嗎？`)) return

  try {
    const ids = selectedItems.value.map((item) => item.id)
    await $fetch('/api/news/admin/bulk', {
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

// 导出数据
async function exportData(format: 'json' | 'csv') {
  try {
    const url = `/api/news/admin/export?format=${format}`

    // 创建一个隐藏的 a 标签来触发下载
    const link = document.createElement('a')
    link.href = url
    link.download = `news_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
