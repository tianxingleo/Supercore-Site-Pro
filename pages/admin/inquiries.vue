<template>
  <div class="space-y-12">
    <div>
      <TypographyHeader :level="2" size="h2" class="mb-4"> 詢盤管理 Inquiries </TypographyHeader>
      <p class="text-swiss-text-muted">來自客戶的聯繫表單提交。</p>
    </div>

    <!-- Actions Bar -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <div class="flex-1"></div>
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

    <div class="bg-white border border-swiss-text/10">
      <TableSkeleton v-if="loading" />
      <UTable v-else :rows="inquiries" :columns="columns" :loading="false" :ui="{
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
        <template #email-data="{ row }">
          <div class="flex items-center gap-3">
            <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)"
              class="w-4 h-4 border-swiss-text/20" />
            <div>
              <div class="font-medium text-swiss-text">{{ row.email }}</div>
              <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
                {{ row.company || '個人' }}
              </div>
            </div>
          </div>
        </template>

        <template #message-data="{ row }">
          <div class="truncate max-w-sm" :title="row.message">{{ row.message }}</div>
        </template>

        <template #created_at-data="{ row }">
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
            formatDate(row.created_at)
            }}</span>
        </template>

        <template #status-data="{ row }">
          <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="[
            row.status === 'new'
              ? 'bg-swiss-text text-white'
              : 'bg-swiss-bg-soft text-swiss-text-muted',
          ]">
            {{ row.status }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <button v-if="row.status === 'new'" @click="markAsRead(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-swiss-text text-white hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all rounded-none">
            標記為已讀
          </button>
          <button @click="deleteInquiry(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
            ✕
          </button>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const refreshKey = ref(0)
const selectedItems = ref<any[]>([])

const columns = [
  { key: 'email', label: '客戶聯絡' },
  { key: 'message', label: '留言內容' },
  { key: 'created_at', label: '時間' },
  { key: 'status', label: '狀態' },
  { key: 'actions', label: '' },
]

// 使用 useLazyFetch 实现动态数据加载和自动刷新
const { data: response, pending: loading, refresh, error } = useLazyFetch('/api/inquiries', {
  key: () => `inquiries-${refreshKey.value}`,
  transform: (data: any) => data,
  default: () => ({ success: false, data: [] })
})

const inquiries = computed(() => response.value?.success ? response.value.data : [])

// 监听错误
watchEffect(() => {
  if (error.value) {
    console.error('獲取詢盤列表失敗:', error.value)
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
      label: '批量標記為已讀',
      icon: 'i-heroicons-check-circle-20-solid',
      click: () => bulkUpdate({ status: 'read' }),
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
  return new Date(dateStr).toLocaleString('zh-HK')
}

async function markAsRead(id: number) {
  try {
    await $fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      body: { status: 'read' },
    })
    // 刷新数据
    refreshKey.value++
    await refresh()
  } catch (error) {
    console.error('標記為已讀失敗:', error)
  }
}

async function deleteInquiry(id: number) {
  if (!confirm('確定刪除此詢盤？')) return
  try {
    await $fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
    })
    // 立刻刷新数据，实现动态更新
    refreshKey.value++
    await refresh()
  } catch (error) {
    console.error('刪除詢盤失敗:', error)
  }
}

// 批量删除
async function bulkDelete() {
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 個詢盤嗎？`)) return

  try {
    const ids = selectedItems.value.map((item) => item.id)
    await $fetch('/api/inquiries/admin/bulk', {
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
    await $fetch('/api/inquiries/admin/bulk', {
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
    const blob = await $fetch(`/api/inquiries/admin/export?format=${format}`, {
      method: 'GET',
      responseType: 'blob'
    })

    // 创建一个 URL 并触发下载
    const url = window.URL.createObjectURL(blob as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inquiries_${new Date().toISOString().split('T')[0]}.${format}`
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
