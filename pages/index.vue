<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Hero Section with 3D Scene -->
    <section class="min-h-screen flex items-center relative overflow-hidden bg-white" id="hero-section">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-12 xl:col-span-8 flex flex-col justify-center py-24 lg:py-0 relative z-10">
          <!-- Eyebrow Text: Technical / Branding -->
          <SwissTextReveal tag="div" :delay="100" class="mb-4 lg:mb-6" immediate>
            <div class="flex items-center gap-4">
              <span class="text-[10px] font-black tracking-[0.4em] uppercase text-swiss-text/40 font-mono">
                Est. 2024 // Network Infrastructure
              </span>
              <div class="h-px w-12 bg-swiss-text/10"></div>
            </div>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="250" :duration="1.2" immediate block>
            <TypographyHeader :level="1" size="display" class="mb-4 lg:mb-6 whitespace-pre-line">{{
              $t('home.hero.title') }}</TypographyHeader>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="450" :duration="1" immediate>
            <div class="max-w-2xl border-l-2 border-swiss-text/5 pl-8 lg:pl-12 mt-6 lg:mt-8 mb-4 lg:mb-6">
              <TypographyHeader :level="2" size="h5" color="secondary" weight="normal"
                class="!mb-0 opacity-90 leading-tight">
                {{ $t('home.hero.subtitle') }}
              </TypographyHeader>
              <div class="mt-4 flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-swiss-accent animate-pulse"></span>
                <span
                  class="text-[9px] font-bold tracking-widest uppercase text-swiss-text/30 font-mono">Systems_Online:
                  Hypercore_v4.0</span>
              </div>
            </div>
          </SwissTextReveal>

          <div class="flex flex-row flex-wrap items-center gap-6 lg:gap-10 mt-2 overflow-visible">
            <SwissTextReveal tag="div" :delay="600" :duration="0.8" immediate width-class="w-auto">
              <SwissButton variant="primary" size="lg"
                class="!px-12 !py-5 hover-lift text-[11px] font-black tracking-[0.2em] whitespace-nowrap"
                @click="navigateTo(localePath('/solutions'))">
                {{ $t('home.hero.cta') }}
              </SwissButton>
            </SwissTextReveal>

            <SwissTextReveal tag="div" :delay="750" :duration="0.8" immediate width-class="w-auto">
              <SwissButton variant="ghost" size="lg"
                class="!px-12 !py-5 border-swiss-text hover:bg-swiss-text hover:text-white transition-colors duration-300 text-[11px] font-black tracking-[0.2em] whitespace-nowrap"
                @click="navigateTo(localePath('/contact'))">
                {{ $t('home.hero.ctaSecondary') }}
              </SwissButton>
            </SwissTextReveal>

            <SwissTextReveal tag="div" :delay="900" :duration="0.8" immediate width-class="w-auto"
              class="hidden lg:block">
              <div
                class="flex items-center gap-6 ml-4 opacity-10 group cursor-help transition-opacity hover:opacity-40">
                <div class="h-10 w-px bg-swiss-text"></div>
                <span class="text-[9px] font-mono uppercase tracking-tighter leading-none translate-y-1">
                  Ref_Code: HK_712<br>Axis_X: 114.167
                </span>
              </div>
            </SwissTextReveal>
          </div>
        </div>

        <div
          class="col-span-12 lg:col-span-12 xl:col-span-4 min-h-[400px] lg:min-h-[500px] relative mt-12 lg:mt-0 flex items-center justify-center">
          <!-- 桌面端：3D 場景 - 使用 ClientOnly 避免 hydration mismatch -->
          <ClientOnly>
            <ServerScene v-if="canUseAdvanced3D()" ref="serverSceneRef" background-color="#FFFFFF" :auto-rotate="false"
              :mouse-parallax="true" :initial-rotation="{ x: 0, y: (70 * Math.PI) / 180, z: 0 }" />
            <!-- 移動端：降級版本 -->
            <MobileFallback v-else :show-scroll-indicator="true" />
            <!-- 加載中的佔位符 -->
            <template #fallback>
              <PlaceholderCanvas />
            </template>
          </ClientOnly>
        </div>
      </GridContainer>
    </section>

    <!-- Product Categories Section -->
    <section class="py-24 bg-white border-y border-gray-100">
      <GridContainer>
        <div class="col-span-12 mb-16">
          <SwissTextReveal tag="div" :delay="100">
            <TypographyHeader :level="2" size="h2" class="mb-6">
              {{ $t('products.title') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>

        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div v-for="(cat, index) in [
            'generalCompute',
            'hpc',
            'highPerformanceStorage',
            'generalStorage'
          ]" :key="cat" class="group">
            <SwissTextReveal tag="div" :delay="index * 150" :duration="1">
              <div
                class="border-t border-gray-100 pt-8 transition-all duration-500 group-hover:border-swiss-text h-full hover-scale-subtle cursor-pointer">
                <div class="text-[10px] font-mono text-swiss-text/30 mb-4 uppercase">CAT_0{{ index + 1 }}</div>
                <TypographyHeader :level="3" size="h4" class="!mb-2 !tracking-tight">
                  {{ $t(`products.categories.${cat}.title`) }}
                </TypographyHeader>
                <div class="text-xs text-swiss-text/40 font-bold uppercase tracking-widest mb-6">
                  {{ $t(`products.categories.${cat}.subtitle`) }}
                </div>
                <p v-if="cat !== 'serverProducts'"
                  class="text-sm text-swiss-text-muted leading-relaxed line-clamp-4 group-hover:text-swiss-text transition-colors duration-500">
                  {{ $t(`products.categories.${cat}.description`) }}
                </p>
              </div>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <GridContainer :grid="true">
        <!-- Section Header -->
        <div class="col-span-12 text-center mb-16">
          <SwissTextReveal tag="div">
            <TypographyHeader :level="2" size="h2" align="center" class="mb-4">
              {{ $t('home.features.title') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>

        <!-- Feature 1 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item">
          <div class="swiss-feature-number">01</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <SwissTextReveal tag="div" :delay="100">
              <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors mb-4">
                {{ $t('home.features.feature1.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <SwissTextReveal tag="div" :delay="200">
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature1.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item">
          <div class="swiss-feature-number">02</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <SwissTextReveal tag="div" :delay="300">
              <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors mb-4">
                {{ $t('home.features.feature2.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <SwissTextReveal tag="div" :delay="400">
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature2.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="col-span-12 md:col-span-4 group cursor-default relative feature-item">
          <div class="swiss-feature-number">03</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <SwissTextReveal tag="div" :delay="500">
              <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors mb-4">
                {{ $t('home.features.feature3.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <SwissTextReveal tag="div" :delay="600">
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature3.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Latest News Section -->
    <section class="py-24 bg-white border-b border-gray-100">
      <GridContainer>
        <div class="col-span-12 flex flex-row justify-between items-end mb-16 gap-6">
          <div class="flex flex-row items-baseline gap-4 lg:gap-8">
            <SwissTextReveal tag="div" width-class="w-auto">
              <TypographyHeader :level="2" size="h2" class="!tracking-tighter !mb-0 uppercase">
                {{ $t('news.latest') }}
              </TypographyHeader>
            </SwissTextReveal>
            <SwissTextReveal tag="div" :delay="150" width-class="w-auto">
              <div
                class="hidden md:inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text/30 border-b border-swiss-text/10 pb-1 whitespace-nowrap">
                / {{ $t('news.title') }}
              </div>
            </SwissTextReveal>
          </div>
          <SwissTextReveal tag="div" :delay="300" width-class="w-auto">
            <NuxtLink :to="localePath('/news')"
              class="text-xs font-bold uppercase tracking-widest text-swiss-secondary hover:text-swiss-text transition-colors flex items-center mb-1 hover-arrow-slide link-underline whitespace-nowrap">
              {{ $t('news.viewMore') }} <span class="ml-2 arrow-icon">→</span>
            </NuxtLink>
          </SwissTextReveal>
        </div>

        <div class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-gray-100">
          <!-- 使用 ClientOnly 避免 hydration mismatch，因为数据只在客户端加载 -->
          <ClientOnly>
            <!-- Loading State -->
            <template v-if="pendingNews">
              <div v-for="i in 3" :key="i" class="border-r border-b border-gray-100">
                <NewsSkeleton class="!border-none" />
              </div>
            </template>

            <!-- Data Loaded State -->
            <template v-else-if="latestPosts && latestPosts.length > 0">
              <div v-for="post in latestPosts" :key="post.id"
                class="border-r border-b border-gray-100 bg-white news-card-item opacity-0 translate-y-8">
                <NewsCard :post="post" class="!border-none" />
              </div>
            </template>

            <!-- Empty State -->
            <div v-else class="col-span-3 py-24 text-center border-r border-b border-gray-100">
              <p class="text-swiss-secondary uppercase tracking-widest text-sm opacity-50">{{ $t('news.noNews') }}</p>
            </div>

            <!-- Server-side fallback -->
            <template #fallback>
              <div v-for="i in 3" :key="i" class="border-r border-b border-gray-100">
                <NewsSkeleton class="!border-none" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </GridContainer>
    </section>

    <!-- About Section -->
    <section class="py-32 bg-white relative overflow-hidden reveal-section">
      <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-swiss-secondary/20 to-transparent">
      </div>
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
          <SwissTextReveal tag="div">
            <TypographyHeader :level="2" size="h2" class="mb-6">
              {{ $t('about.pageTitle') }}
            </TypographyHeader>
          </SwissTextReveal>
          <SwissTextReveal tag="div" :delay="200">
            <TypographyHeader :level="2" size="h4" color="secondary" weight="normal" class="mb-8 leading-relaxed">
              {{ $t('company.slogan') }}
            </TypographyHeader>
          </SwissTextReveal>
          <SwissTextReveal tag="div" :delay="400">
            <SwissButton variant="secondary" @click="navigateTo(localePath('/about'))">
              {{ $t('products.viewDetails') }}
            </SwissButton>
          </SwissTextReveal>
        </div>
        <div class="col-span-12 lg:col-span-6 lg:col-start-7 flex items-center">
          <SwissTextReveal tag="div" :delay="600">
            <p class="text-swiss-text text-xl sm:text-2xl leading-relaxed font-light italic">
              "{{ $t('company.mission') }}"
            </p>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- Component Demo Section - Hidden by request -->
    <section v-if="false" class="py-24 bg-swiss-bg">
      <GridContainer :grid="true">
        <div class="col-span-12 mb-12">
          <TypographyHeader :level="2" size="h2"> Swiss Design Components </TypographyHeader>
          <p class="text-swiss-secondary mt-4">
            Swiss International Style - 瑞士国际主义风格组件库
          </p>
        </div>

        <!-- Button Variants -->
        <div class="col-span-12 mb-8">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Button Variants </TypographyHeader>
          <div class="flex flex-wrap gap-4">
            <SwissButton variant="primary">Primary</SwissButton>
            <SwissButton variant="secondary">Secondary</SwissButton>
            <SwissButton variant="ghost">Ghost</SwissButton>
            <SwissButton variant="primary" disabled>Disabled</SwissButton>
          </div>
        </div>

        <!-- Button Sizes -->
        <div class="col-span-12 mb-8">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Button Sizes </TypographyHeader>
          <div class="flex flex-wrap gap-4 items-center">
            <SwissButton variant="primary" size="sm">Small</SwissButton>
            <SwissButton variant="primary" size="md">Medium</SwissButton>
            <SwissButton variant="primary" size="lg">Large</SwissButton>
          </div>
        </div>

        <!-- Typography Examples -->
        <div class="col-span-12">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Typography Scale </TypographyHeader>
          <div class="space-y-4">
            <TypographyHeader :level="1" size="h1">
              Display Heading (H1) - 专业基礎設施解決方案
            </TypographyHeader>
            <TypographyHeader :level="2" size="h2">
              Heading 2 (H2) - 瑞士國際主義風格
            </TypographyHeader>
            <TypographyHeader :level="3" size="h3">
              Heading 3 (H3) - Swiss International Style
            </TypographyHeader>
            <TypographyHeader :level="4" size="h4" color="secondary">
              Secondary Text - 次要文字顏色
            </TypographyHeader>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

// Prevent component destruction on locale change to ensure animation state is preserved
definePageMeta({
  key: (route) => {
    // Strip the locale suffix (e.g., "index___en" -> "index")
    // This makes the key stable across languages, forcing Vue to reuse the component
    const name = route.name?.toString() || ''
    return name.split('___')[0]
  }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const nuxtApp = useNuxtApp()
const { $gsap, $ScrollTrigger } = nuxtApp as any

// 使用 useLazyFetch 获取新闻数据（懒加载，不阻塞导航）
const { data: latestPosts, pending: pendingNews } = useLazyFetch<Post[]>('/api/news/public', {
  query: { limit: 3 },
  default: () => [],
  server: false // 首页资讯改为仅客户端加载，以展示加载动画并提升初次加载速度
})

// 監聽新聞數據加載并播放進場動畫
watch([latestPosts, pendingNews, locale], ([newPosts, isPending, newLocale]) => {
  // 数据加载完成且有文章数据时触发动画
  if (!isPending && newPosts && newPosts.length > 0 && process.client) {
    nextTick(() => {
      if (!$gsap || !$ScrollTrigger) return

      const cards = document.querySelectorAll('.news-card-item')
      if (cards.length > 0) {
        $ScrollTrigger.batch(cards, {
          onEnter: (batch: any) => {
            $gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: 'auto'
            })
          },
          start: 'top 85%',
          once: true
        })
        // 重新刷新 ScrollTrigger 以確保其他動畫位置正確
        setTimeout(() => $ScrollTrigger.refresh(), 100)
      }
    })
  }
}, { immediate: true })

// 监听语言切换，刷新滚动触发器
watch(locale, () => {
  if (process.client && $ScrollTrigger) {
    console.log('[Home] Locale changed, deep refreshing animations...')

    // 不再使用 :key 强制重绘组件，而是依赖 Vue 的响应式更新内容
    // 仅刷新 ScrollTrigger 以纠正布局偏移
    nextTick(() => {
      // 等待 DOM 更新后的下两个 tick 或一小段时间
      setTimeout(() => {
        // 全局强制刷新 ScrollTrigger 计算位置
        $ScrollTrigger.refresh()

        // 再次刷新，确保位置计算准确
        setTimeout(() => $ScrollTrigger.refresh(), 100)

        console.log('[Home] Deep refresh completed')
      }, 350)
    })
  }
})

// 添加 canonical 標籤
const baseUrl = 'https://www.supercore.hk'
const canonicalUrl = computed(() => {
  return locale.value === 'en'
    ? `${baseUrl}${route.path}`
    : `${baseUrl}/${locale.value}${route.path}`
})

// 生成首頁麵包屑結構化數據
const breadcrumbStructuredData = useBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
])

useHead({
  title: computed(() => `${t('nav.home')} - Supercore`),
  // 移除 snap-y snap-mandatory scroll-pt-24 md:scroll-pt-32 以解决滚动卡顿问题
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbStructuredData),
    },
  ],
})

// 設備檢測
const { deviceInfo, canUseAdvanced3D } = useDeviceDetection()
const canUse3D = ref(false)

// 動畫系統
const serverSceneRef = ref()
const animationPhase = ref(0)

onMounted(() => {
  // 檢測設備並決定是否啟用 3D
  canUse3D.value = canUseAdvanced3D()

  // 確保在客戶端執行且可以使用 3D
  // 等待 ClientOnly 組件渲染完成
  if (process.client) {
    if (canUse3D.value) {
      // 等待下一個 tick，確保組件已掛載
      nextTick(() => {
        // 再等待一個 tick 以確保 ClientOnly 內的組件已經渲染
        nextTick(() => {
          initScrollAnimation()
        })
      })
    }

    // 初始化其他 GSAP 動畫 (不需要 3D 也可以運行)
    nextTick(() => {
      initGsapAnimations()
    })
  }
})

const initGsapAnimations = () => {
  console.log('[Home] initGsapAnimations started')
  if (!$gsap || !$ScrollTrigger) {
    console.warn('[Home] GSAP/ScrollTrigger missing')
    return
  }

  // 清除旧的相关的 ScrollTrigger，防止重复
  const kills = []
  $ScrollTrigger.getAll().forEach((trigger: any) => {
    if (trigger.vars && (trigger.vars.className === 'feature-trigger' || trigger.vars.className === 'reveal-trigger')) {
      kills.push(trigger)
      trigger.kill(true)
    }
  })
  console.log(`[Home] Killed ${kills.length} existing triggers`)

  // 1. Feature Items Staggered Reveal
  const featureItems = document.querySelectorAll('.feature-item')
  console.log(`[Home] Found ${featureItems.length} feature items`)

  if (featureItems.length) {
    featureItems.forEach((item, index) => {
      const tl = $gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          className: 'feature-trigger',
          toggleActions: 'play none none none',
          onEnter: () => console.log(`[Home] Feature Item ${index} Enter`),
          onRefresh: () => console.log(`[Home] Feature Item ${index} Refresh`),
        }
      })

      // Separator expands
      tl.to(item.querySelectorAll('.swiss-separator'), {
        duration: 0.8,
        scaleX: 1,
        ease: 'power3.out',
        overwrite: 'auto'
      })

      // Number fades in - 使用 fromTo 确保终态为可见
      $gsap.fromTo(item.querySelector('.swiss-feature-number'),
        {
          opacity: 0,
          x: -20
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            className: 'feature-trigger',
            toggleActions: 'play none none none'
          }
        }
      )
    })
  }

  // 3. General Reveal Sections
  const revealSections = document.querySelectorAll('.reveal-section')
  console.log(`[Home] Found ${revealSections.length} reveal sections`)

  $ScrollTrigger.batch('.reveal-section', {
    onEnter: (batch: any) => {
      console.log(`[Home] Reveal Section Batch Enter (${batch.length} items)`)
      // 同样改为 fromTo 增强鲁棒性
      $gsap.fromTo(batch,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', overwrite: 'auto' }
      )
    },
    start: 'top 85%',
    className: 'reveal-trigger'
  })
}

const initScrollAnimation = () => {
  if (!$gsap || !$ScrollTrigger) {
    console.warn('GSAP or ScrollTrigger not available')
    return
  }

  // 仅在桌面端启用滚动动画
  if (!canUse3D.value) {
    return
  }

  try {
    // 创建滚动时间轴 - 使用 gsap.timeline() 而不是 ScrollTrigger.timeline()
    const timeline = $gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self: any) => {
          const progress = self.progress
          updateAnimationPhase(progress)
        },
      },
    })

    // 阶段 1: 淡入 (0-20%)
    timeline.to({}, { duration: 20 })

    // 阶段 2: 机柜打开 (20-50%)
    timeline.to({}, { duration: 30 })

    // 阶段 3: 组件爆炸 (50-80%)
    timeline.to({}, { duration: 30 })

    // 阶段 4: 重新组装 (80-100%)
    timeline.to({}, { duration: 20 })
  } catch (error) {
    console.error('Failed to initialize scroll animation:', error)
  }
}

const updateAnimationPhase = (progress: number) => {
  if (!serverSceneRef.value) return

  let phase = 0
  let phaseProgress = 0

  if (progress < 0.2) {
    // 階段 1: 淡入
    phase = 0
    phaseProgress = progress / 0.2
  } else if (progress < 0.5) {
    // 階段 2: 機櫃打開
    phase = 1
    phaseProgress = (progress - 0.2) / 0.3
  } else if (progress < 0.8) {
    // 階段 3: 組件爆炸
    phase = 2
    phaseProgress = (progress - 0.5) / 0.3
  } else {
    // 階段 4: 重新組裝
    phase = 3
    phaseProgress = (progress - 0.8) / 0.2
  }

  animationPhase.value = phase

  // 更新 3D 場景
  serverSceneRef.value.setAnimationPhase(phase, phaseProgress)
}

onUnmounted(() => {
  // 清理 ScrollTrigger
  if (process.client) {
    if ($ScrollTrigger) {
      $ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }
})
</script>
