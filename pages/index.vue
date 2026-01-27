<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Hero Section with 3D Scene -->
    <section class="min-h-screen flex items-center relative overflow-hidden bg-white" id="hero-section">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-12 xl:col-span-8 flex flex-col justify-center py-24 lg:py-0 relative z-10">
          <TypographyHeader :level="1" size="display" class="mb-8">
            {{ $t('home.hero.title') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="mb-12 max-w-2xl opacity-90">
            {{ $t('home.hero.subtitle') }}
          </TypographyHeader>
          <div class="flex flex-col sm:flex-row gap-6">
            <SwissButton variant="primary" size="lg" class="!px-10" @click="navigateTo(localePath('/solutions'))">
              {{ $t('home.hero.cta') }}
            </SwissButton>
            <SwissButton variant="ghost" size="lg" class="!px-10 border-swiss-text"
              @click="navigateTo(localePath('/contact'))">
              {{ $t('home.hero.ctaSecondary') }}
            </SwissButton>
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
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-swiss-text/30 text-sm">Loading 3D Scene...</div>
              </div>
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
              class="border-t border-gray-100 pt-8 transition-colors duration-500 group-hover:border-swiss-text h-full">
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
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0">
          <div class="text-center p-8">
            <TypographyHeader :level="3" size="h4" class="mb-4">
              {{ $t('home.features.feature1.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary">
              {{ $t('home.features.feature1.description') }}
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0">
          <div class="text-center p-8">
            <TypographyHeader :level="3" size="h4" class="mb-4">
              {{ $t('home.features.feature2.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary">
              {{ $t('home.features.feature2.description') }}
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="col-span-12 md:col-span-4">
          <div class="text-center p-8">
            <TypographyHeader :level="3" size="h4" class="mb-4">
              {{ $t('home.features.feature3.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary">
              {{ $t('home.features.feature3.description') }}
            </p>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Latest News Section -->
    <section class="py-24 bg-white border-b border-gray-100">
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
            class="text-xs font-bold uppercase tracking-widest text-swiss-secondary hover:text-swiss-text transition-colors flex items-center mb-1">
            {{ $t('news.viewMore') }} <span class="ml-2">→</span>
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
            <div v-for="post in latestPosts" :key="post.id" class="border-r border-b border-gray-100">
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
    <section class="py-32 bg-white relative overflow-hidden">
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

const { t } = useI18n()
const localePath = useLocalePath()

// 使用 useLazyFetch 获取新闻数据（懒加载，不阻塞导航）
const { data: latestPosts, pending: pendingNews } = useLazyFetch<Post[]>('/api/news/public', {
  query: { limit: 3 },
  default: () => []
})

useHead({
  title: '首页 - 超核技術有限公司',
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
  if (process.client && canUse3D.value) {
    // 等待下一個 tick，確保組件已掛載
    nextTick(() => {
      // 再等待一個 tick 以確保 ClientOnly 內的組件已經渲染
      nextTick(() => {
        initScrollAnimation()
      })
    })
  }
})

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
