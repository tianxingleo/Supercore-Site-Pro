<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> 資訊管理 News </TypographyHeader>
        <p class="text-swiss-text-muted">發佈行業動態及公司新聞。</p>
      </div>
      <SwissButton
        tag="a"
        to="/admin/news/new"
        variant="primary"
        size="lg"
        class="w-full md:w-auto"
      >
        發佈諮訊
      </SwissButton>
    </div>

    <div class="bg-white border border-swiss-text/10">
      <UTable
        :rows="posts"
        :columns="columns"
        :loading="loading"
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
          <UButton
            icon="i-heroicons-pencil-square"
            variant="ghost"
            color="gray"
            :to="`/admin/news/${row.id}`"
            size="sm"
          />
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="red"
            @click="deletePost(row.id)"
            size="sm"
          />
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const loading = ref(true)
const posts = ref([])

const columns = [
  { key: 'title', label: '標題' },
  { key: 'published_at', label: '發佈時間' },
  { key: 'actions', label: '' },
]

onMounted(async () => {
  await fetchPosts()
})

async function fetchPosts() {
  loading.value = true
  try {
    const response = (await $fetch('/api/news')) as any
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
      method: 'DELETE',
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
