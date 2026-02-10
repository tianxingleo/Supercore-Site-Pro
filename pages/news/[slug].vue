<template>
    <div class="min-h-screen bg-white pb-32">
        <template v-if="post">
            <!-- Article Header -->
            <section class="pt-48 pb-24 border-b border-gray-100">
                <GridContainer :grid="true">
                    <div class="col-span-12 lg:col-span-10 lg:offset-1">
                        <div class="mb-8 flex items-center space-x-4">
                            <NuxtLink :to="localePath('/news')"
                                class="text-xs font-bold uppercase tracking-widest text-swiss-secondary hover:text-swiss-text transition-colors flex items-center">
                                <span class="mr-2">←</span> {{ $t('news.backToList') }}
                            </NuxtLink>
                        </div>

                        <div class="flex flex-wrap gap-3 mb-6">
                            <span v-for="tag in post.tags" :key="tag"
                                class="text-[10px] font-bold uppercase tracking-widest text-swiss-accent border border-swiss-accent/20 px-3 py-1 rounded-full">
                                {{ tag }}
                            </span>
                        </div>

                        <TypographyHeader :level="1" size="display"
                            class="mb-8 font-black tracking-tighter uppercase leading-tight">
                            {{ post.title[lang] }}
                        </TypographyHeader>

                        <div class="flex items-center space-x-6 text-sm text-swiss-secondary uppercase tracking-widest">
                            <span>{{ formatDate(post.published_at || post.created_at) }}</span>
                            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>SUPERCORE NEWS</span>
                        </div>
                    </div>
                </GridContainer>
            </section>

            <!-- Article Content -->
            <section class="mt-20">
                <GridContainer :grid="true">
                    <div class="col-span-12 lg:col-span-8 lg:offset-2">
                        <!-- Cover Image -->
                        <div v-if="post.cover_image"
                            class="mb-16 aspect-video bg-gray-50 overflow-hidden border border-gray-100 relative">
                            <div v-if="!imageLoaded" class="shimmer absolute inset-0 z-10"></div>
                            <NuxtImg
                              :src="post.cover_image"
                              :alt="post.title[lang]"
                              width="1200"
                              height="675"
                              format="webp"
                              quality="90"
                              loading="eager"
                              preload
                              sizes="xs:100vw sm:100vw md:83vw"
                              @load="imageLoaded = true"
                              class="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                              :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
                              placeholder
                            />
                        </div>

                        <!-- Content Area -->
                        <div
                            class="prose prose-lg prose-gray max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-swiss-accent prose-img:rounded-none prose-img:border prose-img:border-gray-100">
                            <div v-html="renderedContent" class="news-content"></div>
                        </div>

                        <!-- Footer Navigation -->
                        <div
                            class="mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                            <NuxtLink v-if="prevPost" :to="localePath('/news/' + (prevPost.slug || prevPost.id))"
                                class="group flex flex-col items-start max-w-[40%]">
                                <span
                                    class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Previous
                                    Article</span>
                                <span
                                    class="text-sm font-bold group-hover:text-swiss-accent transition-colors line-clamp-1">{{
                                    prevPost.title[lang] }}</span>
                            </NuxtLink>
                            <div v-else></div>

                            <NuxtLink v-if="nextPost" :to="localePath('/news/' + (nextPost.slug || nextPost.id))"
                                class="group flex flex-col items-end text-right max-w-[40%]">
                                <span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Next
                                    Article</span>
                                <span
                                    class="text-sm font-bold group-hover:text-swiss-accent transition-colors line-clamp-1">{{
                                    nextPost.title[lang] }}</span>
                            </NuxtLink>
                            <div v-else></div>
                        </div>
                    </div>
                </GridContainer>
            </section>
        </template>

        <template v-else-if="pending">
            <ArticleSkeleton />
        </template>

        <template v-else>
            <div class="min-h-screen flex flex-col items-center justify-center pt-48">
                <h1 class="text-4xl font-black tracking-tighter uppercase mb-6">Article Not Found</h1>
                <NuxtLink :to="localePath('/news')"
                    class="text-swiss-accent font-bold uppercase tracking-widest text-sm hover:underline">
                    Return to News List
                </NuxtLink>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'
import { marked } from 'marked'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const slug = route.params.slug as string
const imageLoaded = ref(false)

// 使用 useLazyFetch 避免阻塞渲染，防止路由切换时白屏
const {
    data: newsData,
    pending,
    error,
} = useLazyFetch<{ post: Post; prevPost?: Post; nextPost?: Post }>(`/api/news/${slug}`, {
    default: () => ({ post: null as any }),
})

const post = computed(() => newsData.value?.post)
const prevPost = computed(() => newsData.value?.prevPost)
const nextPost = computed(() => newsData.value?.nextPost)

// 处理错误
watchEffect(() => {
    if (error.value) {
        console.error('Failed to load news article:', error.value)
    }
})

const lang = computed(() => {
    const l = locale.value as string
    if (l.includes('HK') || l.includes('hk')) return 'hk'
    if (l.includes('CN') || l.includes('cn')) return 'cn'
    return 'en'
})

const renderedContent = computed(() => {
    const content = post.value?.content?.[lang.value]
    if (!content) return ''

    // 检查内容是否为 HTML（富文本）
    const trimmedContent = String(content).trim()
    const isHtml = trimmedContent.startsWith('<') && trimmedContent.endsWith('>')

    // 如果是 HTML，直接渲染；如果是 Markdown，使用 marked 转换
    if (isHtml) {
        return trimmedContent
    } else {
        return marked(trimmedContent)
    }
})

function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-HK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

// Set page title, structured data, and canonical
watchEffect(() => {
  if (post.value) {
    const baseUrl = 'https://www.supercore.hk'
    const currentPath = route.path
    const canonicalUrl = locale.value === 'en'
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}/${locale.value}${currentPath}`

    // 生成文章結構化數據
    const structuredData = useArticleStructuredData(post.value, locale.value)

    // 生成麵包屑結構化數據
    const breadcrumbStructuredData = useBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: 'News', url: '/news' },
      { name: post.value.title[lang.value] || 'News', url: currentPath },
    ])

    useHead({
      title: (post.value?.title[lang.value] || 'News') + ' - Supercore',
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbStructuredData),
        },
      ],
      meta: [
        {
          property: 'article:published_time',
          content: post.value.created_at,
        },
        {
          property: 'article:modified_time',
          content: post.value.updated_at || post.value.created_at,
        },
        {
          property: 'article:section',
          content: post.value.category || 'Technology',
        },
        ...(post.value.tags?.map(tag => ({
          property: 'article:tag',
          content: tag,
        })) || []),
      ],
    })
  }
})
</script>

<style scoped>
.news-content :deep(p) {
    margin-bottom: 2rem;
    line-height: 1.8;
    color: #4a4a4a;
}

.news-content :deep(h2),
.news-content :deep(h3) {
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    color: #000;
}

.news-content :deep(img) {
    margin: 3rem 0;
    width: 100%;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    overflow: hidden;
}
</style>
