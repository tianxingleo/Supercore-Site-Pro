<template>
  <div class="space-y-12">
    <div>
      <TypographyHeader :level="2" size="h2" class="mb-4"> 詢盤管理 Inquiries </TypographyHeader>
      <p class="text-swiss-text-muted">來自客戶的聯繫表單提交。</p>
    </div>

    <div class="bg-white border border-swiss-text/10">
      <UTable
        :rows="inquiries"
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
        <template #email-data="{ row }">
          <div>
            <div class="font-medium text-swiss-text">{{ row.email }}</div>
            <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
              {{ row.company || '個人' }}
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
          <span
            class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
            :class="[
              row.status === 'new'
                ? 'bg-swiss-text text-white'
                : 'bg-swiss-bg-soft text-swiss-text-muted',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UButton
            v-if="row.status === 'new'"
            size="sm"
            color="black"
            variant="ghost"
            @click="markAsRead(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest"
          >
            標記為已讀
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            size="sm"
            @click="deleteInquiry(row.id)"
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

const client = useSupabaseClient()
const loading = ref(true)
const inquiries = ref([])

const columns = [
  { key: 'email', label: '客戶聯絡' },
  { key: 'message', label: '留言內容' },
  { key: 'created_at', label: '時間' },
  { key: 'status', label: '狀態' },
  { key: 'actions', label: '' },
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
