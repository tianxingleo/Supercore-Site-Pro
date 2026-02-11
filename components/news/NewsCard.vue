<template>
  <NuxtLink
    :to="localePath(`/news/${post.slug || post.id}`)"
    class="group block bg-white border border-gray-100 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden"
  >
    <!-- Cover Image -->
    <div class="aspect-video bg-gray-50 relative overflow-hidden">
      <NuxtImg
        v-if="post.cover_image"
        :src="post.cover_image"
        :alt="post.title[lang]"
        width="800"
        height="450"
        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
      />

      <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div class="w-12 h-12 text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <line x1="16" y1="5" x2="22" y2="5" />
            <line x1="19" y1="2" x2="19" y2="8" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </div>

      <!-- Date Badge -->
      <div class="absolute bottom-4 left-4 z-20">
        <span
          class="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest text-swiss-text uppercase"
        >
          {{ formatDate(post.published_at || post.created_at) }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex flex-wrap gap-2 mb-3" v-if="post.tags && post.tags.length">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="text-[9px] font-bold uppercase tracking-tighter text-swiss-secondary border border-gray-100 px-2 py-0.5 rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <TypographyHeader
        :level="3"
        size="h5"
        class="mb-3 group-hover:text-swiss-accent transition-colors line-clamp-2 min-h-[3rem]"
      >
        {{ post.title[lang] }}
      </TypographyHeader>

      <p class="text-swiss-secondary text-sm line-clamp-3 mb-6 opacity-70">
        {{ post.summary?.[lang] || extractTextPreview(post.content?.[lang] || '') }}
      </p>

      <div
        class="flex items-center text-[10px] font-bold tracking-widest uppercase text-swiss-text group-hover:text-swiss-accent transition-colors"
      >
        {{ $t('common.readMore') }}
        <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const props = defineProps<{
  post: Post
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const lang = computed(() => {
  const l = locale.value as string
  if (l.includes('HK') || l.includes('hk')) return 'hk'
  if (l.includes('CN') || l.includes('cn')) return 'cn'
  return 'en'
})

/**
 * 从 HTML 或 Markdown 内容中提取纯文本预览
 */
function extractTextPreview(content: string): string {
  if (!content) return ''

  const trimmedContent = content.trim()

  // 检查是否为 HTML（富文本）
  const isHtml = trimmedContent.startsWith('<') && trimmedContent.endsWith('>')

  if (isHtml) {
    // 提取 HTML 中的纯文本
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = trimmedContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ''

    // 去除多余空格和换行
    const cleanText = textContent.replace(/\s+/g, ' ').trim()

    // 限制长度
    return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText
  } else {
    // Markdown 内容，直接截取
    return trimmedContent.length > 150 ? trimmedContent.substring(0, 150) + '...' : trimmedContent
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-HK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>
