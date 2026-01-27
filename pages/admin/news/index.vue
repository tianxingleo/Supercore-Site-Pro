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
          <div class="font-medium text-swiss-text">
            {{ row.title?.['zh-HK'] || row.title?.['hk'] }}
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

// 暴露刷新函数供外部使用
defineExpose({
  refresh
})
</script>
