<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-8">
          <TypographyHeader :level="1" size="display" class="mb-8 font-black tracking-tighter uppercase">
            {{ $t('news.title') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="max-w-2xl opacity-80">
            {{ $t('news.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- News Grid -->
    <section class="pb-32">
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <template v-if="pending">
          <div v-for="i in 6" :key="i"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100">
            <NewsSkeleton class="!border-none" />
          </div>
        </template>
        <template v-else-if="posts && posts.length">
          <div v-for="(post, index) in posts" :key="post.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 news-page-card-item opacity-0 translate-y-8">
            <NewsCard :post="post" class="!border-none" />
          </div>
        </template>
        <template v-else>
          <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
            <p class="text-swiss-secondary uppercase tracking-widest text-sm">
              {{ $t('news.noNews') }}
            </p>
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const { t } = useI18n()

console.log('[News] Page mounting...')

// 使用 useLazyFetch 避免阻塞渲染，防止路由切换时白屏
const { data: posts, pending, error } = useLazyFetch<Post[]>('/api/news/public')

console.log('[News] Data loaded:', { posts, pending, error })

useHead({
  title: computed(() => `${t('nav.news')} - Supercore`),
  meta: [
    {
      name: 'description',
      content: 'Latest industry news and company updates from Supercore Technology.',
    },
  ],
})

// 处理错误
watchEffect(() => {
  if (error.value) {
    console.error('Failed to load news:', error.value)
  }
})

// 添加动画逻辑
const nuxtApp = useNuxtApp()
const { $gsap, $ScrollTrigger } = nuxtApp as any

// 监听数据加载完成，等待 DOM 更新后触发动画
watch([posts, pending], ([newPosts, isPending]) => {
  console.log('[News] Animation watch:', {
    isPending,
    postsLength: newPosts?.length || 0,
    isArray: Array.isArray(newPosts)
  })

  // 数据加载完成且有文章数据时触发动画
  if (!isPending && newPosts && newPosts.length > 0 && process.client) {
    console.log('[News] Triggering animation...')

    // 使用 setTimeout 确保 DOM 完全渲染
    setTimeout(() => {
      if ($gsap && $ScrollTrigger) {
        const cards = document.querySelectorAll('.news-page-card-item')
        console.log('[News] Found cards:', cards.length)

        if (cards.length > 0) {
          $ScrollTrigger.batch('.news-page-card-item', {
            onEnter: (batch: any) => {
              $gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: true
              })
            },
            start: 'top 90%',
            once: true
          })
          $ScrollTrigger.refresh()
          console.log('[News] Animation triggered successfully!')
        } else {
          console.warn('[News] No cards found for animation')
        }
      } else {
        console.warn('[News] GSAP or ScrollTrigger not available')
      }
    }, 100) // 延迟 100ms 确保 DOM 渲染完成
  }
})
</script>
