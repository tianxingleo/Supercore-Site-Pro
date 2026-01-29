<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Hero Section with 3D Scene -->
    <section class="min-h-screen flex items-center relative overflow-hidden bg-white" id="hero-section">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-12 xl:col-span-8 flex flex-col justify-center py-24 lg:py-0 relative z-10">
          <SwissTextReveal tag="div" :delay="200" :duration="1.2">
            <TypographyHeader :level="1" size="display" class="mb-4 lg:mb-8">
              {{ $t('home.hero.title') }}
            </TypographyHeader>
          </SwissTextReveal>
          
          <SwissTextReveal tag="div" :delay="400" :duration="1">
            <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="mb-8 lg:mb-12 max-w-2xl opacity-90">
              {{ $t('home.hero.subtitle') }}
            </TypographyHeader>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="600" :duration="0.8" class="flex flex-col sm:flex-row gap-6">
            <SwissButton variant="primary" size="lg" class="!px-10 hover-lift" @click="navigateTo(localePath('/solutions'))"
              aria-label="Explore our infrastructure solutions">
              {{ $t('home.hero.cta') }}
            </SwissButton>
            <SwissButton variant="ghost" size="lg" class="!px-10 border-swiss-text hover:bg-swiss-text hover:text-white transition-colors duration-300"
              @click="navigateTo(localePath('/contact'))" aria-label="Contact us for project consultation">
              {{ $t('home.hero.ctaSecondary') }}
            </SwissButton>
          </SwissTextReveal>
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
          <div
            class="inline-block mb-6 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
            {{ $t('products.title') }}
          </div>
        </div>

        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div v-for="(cat, index) in [
            'generalCompute',
            'hpc',
            'highPerformanceStorage',
            'generalStorage'
          ]" :key="cat" class="group">
            <div
              class="border-t border-gray-100 pt-8 transition-all duration-500 group-hover:border-swiss-text h-full hover-scale-subtle cursor-pointer">
              <div class="text-[8px] font-mono text-swiss-text/30 mb-4 uppercase">CAT_0{{ index + 1 }}</div>
              <TypographyHeader :level="3" size="h5" class="!mb-2 !tracking-tight">
                {{ $t(`products.categories.${cat}.title`) }}
              </TypographyHeader>
              <div class="text-[9px] text-swiss-text/40 font-bold uppercase tracking-widest mb-6">
                {{ $t(`products.categories.${cat}.subtitle`) }}
              </div>
              <p v-if="cat !== 'serverProducts'"
                class="text-[11px] text-swiss-text-muted leading-relaxed line-clamp-4 group-hover:text-swiss-text transition-colors duration-500">
                {{ $t(`products.categories.${cat}.description`) }}
              </p>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <GridContainer :grid="true">
        <!-- Section Header -->
        <div class="col-span-12 text-center mb-16">
          <TypographyHeader :level="2" size="h2" align="center" class="mb-4">
            {{ $t('home.features.title') }}
          </TypographyHeader>
        </div>

        <!-- Feature 1 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item">
          <div class="swiss-feature-number">01</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <div class="reveal-text-mask mb-4">
              <span>
                <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors">
                  {{ $t('home.features.feature1.title') }}
                </TypographyHeader>
              </span>
            </div>
            <div class="reveal-text-mask">
              <span class="delay-100">
                <p class="text-swiss-secondary text-sm leading-relaxed">
                  {{ $t('home.features.feature1.description') }}
                </p>
              </span>
            </div>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item">
          <div class="swiss-feature-number">02</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
             <div class="reveal-text-mask mb-4">
              <span>
                <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors">
                  {{ $t('home.features.feature2.title') }}
                </TypographyHeader>
              </span>
            </div>
             <div class="reveal-text-mask">
              <span class="delay-100">
                <p class="text-swiss-secondary text-sm leading-relaxed">
                  {{ $t('home.features.feature2.description') }}
                </p>
              </span>
            </div>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="col-span-12 md:col-span-4 group cursor-default relative feature-item">
          <div class="swiss-feature-number">03</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
             <div class="reveal-text-mask mb-4">
              <span>
                <TypographyHeader :level="3" size="h4" class="group-hover:text-swiss-accent transition-colors">
                  {{ $t('home.features.feature3.title') }}
                </TypographyHeader>
              </span>
            </div>
             <div class="reveal-text-mask">
              <span class="delay-100">
                <p class="text-swiss-secondary text-sm leading-relaxed">
                  {{ $t('home.features.feature3.description') }}
                </p>
              </span>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Latest News Section -->
    <section class="py-24 bg-white border-b border-gray-100 reveal-section">
      <GridContainer>
        <div class="col-span-12 flex justify-between items-end mb-16">
          <div>
            <div
              class="inline-block mb-6 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              {{ $t('news.title') }}
            </div>
            <TypographyHeader :level="2" size="h2" class="!tracking-tighter">
              {{ $t('news.latest') }}
            </TypographyHeader>
          </div>
          <NuxtLink :to="localePath('/news')"
            class="text-xs font-bold uppercase tracking-widest text-swiss-secondary hover:text-swiss-text transition-colors flex items-center mb-1 hover-arrow-slide link-underline">
            {{ $t('news.viewMore') }} <span class="ml-2 arrow-icon">→</span>
          </NuxtLink>
        </div>

        <div class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-gray-100">
          <!-- Loading State -->
          <template v-if="pendingNews">
            <div v-for="i in 3" :key="i" class="border-r border-b border-gray-100">
              <NewsSkeleton class="!border-none" />
            </div>
          </template>

          <!-- Data Loaded State -->
          <template v-else-if="latestPosts && latestPosts.length > 0">
            <div v-for="post in latestPosts" :key="post.id" class="border-r border-b border-gray-100 transition-all duration-300 hover:shadow-lg hover:z-10 hover:border-gray-200 bg-white news-card-item opacity-0 translate-y-8">
              <NewsCard :post="post" class="!border-none" />
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="col-span-3 py-24 text-center border-r border-b border-gray-100">
            <p class="text-swiss-secondary uppercase tracking-widest text-sm opacity-50">{{ $t('news.noNews') }}</p>
          </div>
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
          <TypographyHeader :level="2" size="h2" class="mb-6">
            {{ $t('about.pageTitle') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h4" color="secondary" weight="normal" class="mb-8 leading-relaxed">
            {{ $t('company.slogan') }}
          </TypographyHeader>
          <SwissButton variant="secondary" @click="navigateTo(localePath('/about'))">
            {{ $t('products.viewDetails') }}
          </SwissButton>
        </div>
        <div class="col-span-12 lg:col-span-6 lg:col-start-7 flex items-center">
          <p class="text-swiss-text text-xl sm:text-2xl leading-relaxed font-light italic">
            "{{ $t('company.mission') }}"
          </p>
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

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// 使用 useLazyFetch 获取新闻数据（懒加载，不阻塞导航）
const { data: latestPosts, pending: pendingNews } = useLazyFetch<Post[]>('/api/news/public', {
  query: { limit: 3 },
  default: () => []
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
  title: '首页 - 超核技術有限公司',
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
  const { $gsap, $ScrollTrigger } = useNuxtApp() as any
  if (!$gsap || !$ScrollTrigger) return

  // 1. Feature Items Staggered Reveal
  const featureItems = document.querySelectorAll('.feature-item')
  if (featureItems.length) {
    featureItems.forEach((item, index) => {
      const tl = $gsap.timeline({
         scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        }
      })
      
      // Separator expands
      tl.to(item.querySelectorAll('.swiss-separator'), { 
        duration: 0.8, 
        scaleX: 1, 
        ease: 'power3.out' 
      })
      
      // Text reveals up
      tl.to(item.querySelectorAll('.reveal-text-mask span'), { 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power2.out' 
      }, '-=0.4') // overlap slightly
      
      // Number fades in
      $gsap.from(item.querySelector('.swiss-feature-number'), { 
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
        opacity: 0, 
        x: -20, 
        duration: 1, 
        ease: 'power2.out' 
      })
    })
  }

  // 2. News Cards Stagger
  // Wait for news to load effectively or use a specialized trigger if lazy loaded
  // Simple check for now
  $ScrollTrigger.batch('.news-card-item', {
    onEnter: (batch: any) => {
      $gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' })
    },
    start: 'top 85%'
  })

  // 3. General Reveal Sections
  $ScrollTrigger.batch('.reveal-section', {
    onEnter: (batch: any) => {
      $gsap.from(batch, { opacity: 0, y: 30, duration: 1, ease: 'power2.out' })
    },
     start: 'top 85%'
  })
}

const initScrollAnimation = () => {
  // 获取 GSAP 和 ScrollTrigger 实例
  const { $gsap, $ScrollTrigger } = useNuxtApp() as any

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
    const { $ScrollTrigger } = useNuxtApp() as any
    if ($ScrollTrigger) {
      $ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }
})
</script>
