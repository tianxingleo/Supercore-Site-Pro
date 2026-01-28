<template>
  <NuxtLayout name="admin">
    <div class="max-w-4xl mx-auto space-y-12">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/news"
          class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
          ←
        </NuxtLink>
        <TypographyHeader :level="2" size="h3" class="!mb-0">
          {{ isNew ? '發佈資訊' : '編輯資訊' }}
        </TypographyHeader>
      </div>

      <form @submit.prevent="savePost" class="space-y-8 pb-24">
        <div class="bg-white border border-swiss-text/10">
          <div class="p-6 md:p-8 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex-1">
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  標題 *
                </label>
                <div class="space-y-2">
                  <div v-for="lang in langTabs" :key="lang.key">
                    <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                      lang.label
                    }}</label>
                    <input v-model="form.title[lang.key]" :placeholder="`輸入 ${lang.label} 標題`"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  URL Slug (唯一標識) *
                </label>
                <input v-model="form.slug" placeholder="industry-news-title"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                <p class="text-[10px] text-swiss-text-muted mt-1">
                  用於網址，例如：/news/industry-news-title
                </p>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                摘要 *
              </label>
              <div class="space-y-2">
                <div v-for="lang in langTabs" :key="lang.key">
                  <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                    lang.label
                  }}</label>
                  <textarea v-model="(form.summary as any)[lang.key]" :placeholder="`輸入 ${lang.label} 摘要`" :rows="3"
                    class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                正文 (富文本) *
              </label>
              <div class="space-y-2">
                <div v-for="lang in langTabs" :key="lang.key">
                  <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                    lang.label
                  }}</label>
                  <RichTextEditor v-model="(form.content as any)[lang.key]" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                封面圖片
              </label>
              <div class="space-y-4">
                <AdminImageUpload v-model="form.cover_image" bucket-name="news-covers" />

                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">或輸入 URL：</span>
                  <input v-model="form.cover_image" placeholder="https://example.com/image.jpg"
                    class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                標籤 (Tags, 逗號分隔)
              </label>
              <input v-model="tagsInput" placeholder="AI, Infrastructure"
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                發佈時間
              </label>
              <input type="datetime-local" v-model="publishedAtLocal"
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
            </div>
          </div>
        </div>

        <div
          class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-swiss-text/10 p-4 md:pl-72 z-40">
          <div class="max-w-4xl mx-auto flex justify-end space-x-4">
            <NuxtLink to="/admin/news"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              取消
            </NuxtLink>
            <button type="submit" :disabled="saving"
              :class="saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg'"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-text text-white transition-all rounded-none">
              <span v-if="saving">保存中...</span>
              <span v-else>保存資訊</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)

import AdminImageUpload from '~/components/admin/AdminImageUpload.vue'

// 调试日志
console.log('[News Edit] Page mounting:', {
  path: route.path,
  params: route.params,
  isNew: isNew.value,
})

const langTabs = [
  { key: 'hk', label: '繁體 (HK)' },
  { key: 'cn', label: '簡體 (CN)' },
  { key: 'en', label: 'English' },
]

const form = ref({
  slug: '',
  title: { hk: '', cn: '', en: '' } as Record<string, string>,
  summary: { hk: '', cn: '', en: '' } as Record<string, string>,
  content: { hk: '', cn: '', en: '' } as Record<string, string>,
  cover_image: '',
  tags: [] as string[],
  published_at: null as string | null,
})

const tagsInput = computed({
  get: () => form.value.tags.join(', '),
  set: (val: string) => {
    form.value.tags = val
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)
  },
})

const publishedAtLocal = computed({
  get: () =>
    form.value.published_at ? new Date(form.value.published_at).toISOString().slice(0, 16) : '',
  set: (val: string) => {
    form.value.published_at = val ? new Date(val).toISOString() : null
  },
})

onMounted(async () => {
  if (!isNew.value) {
    try {
      const response = (await $fetch(`/api/news/${route.params.id}`)) as any
      if (response.success) {
        const data = response.data
        form.value = {
          ...form.value,
          ...data,
          title: { ...form.value.title, ...data.title },
          summary: { ...form.value.summary, ...data.summary },
          content: { ...form.value.content, ...data.content },
        }
      }
    } catch (error: any) {
      console.error('获取文章失败:', error)
      const errorMessage = error.data?.statusMessage || error.message || '获取文章失敗'
      alert(errorMessage)
    }
  }
})


/**
 * 保存文章（创建或更新）
 */
async function savePost() {
  saving.value = true

  try {
    const payload = { ...form.value }
    let response

    if (isNew.value) {
      // 创建新文章
      response = await $fetch('/api/news', {
        method: 'POST',
        body: payload,
      })
    } else {
      // 更新现有文章
      response = (await $fetch(`/api/news/${route.params.id}`, {
        method: 'PUT' as any,
        body: payload,
      })) as any
    }

    if (response.success) {
      navigateTo('/admin/news')
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    const errorMessage = error.data?.statusMessage || error.message || '保存失敗，請重試'
    alert(errorMessage)
  } finally {
    saving.value = false
  }
}
</script>
