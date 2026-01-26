<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Animated Text Overlay -->
    <AnimatedTextOverlay :phase="animationPhase" />

    <!-- Hero Section with 3D Scene -->
    <section class="min-h-screen flex items-center relative overflow-hidden bg-white" id="hero-section">
      <!-- Engineering Details -->
      <div
        class="absolute top-12 left-12 text-[8px] font-mono text-swiss-text opacity-20 tracking-[0.4em] uppercase hidden lg:block">
        ref_id: 2026_HK_BOER // 22.3193° N, 114.1694° E
      </div>
      <div
        class="absolute bottom-12 right-12 text-[8px] font-mono text-swiss-text opacity-20 tracking-[0.4em] uppercase hidden lg:block vertical-text">
        infrastructure_simplified_v4.0
      </div>

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
          <!-- 桌面端：3D 場景 -->
          <ServerScene v-if="canUseAdvanced3D()" ref="serverSceneRef" background-color="#FFFFFF" :auto-rotate="false"
            :mouse-parallax="true" :initial-rotation="{ x: 0, y: (70 * Math.PI) / 180, z: 0 }" />
          <!-- 移動端：降級版本 -->
          <MobileFallback v-else :show-scroll-indicator="true" />
        </div>
      </GridContainer>
    </section>

    <!-- Trust Section (Partners) -->
    <section class="py-12 bg-white border-y border-gray-100">
      <GridContainer>
        <div
          class="col-span-12 flex flex-wrap items-center justify-between gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <div v-for="i in 5" :key="i"
            class="flex items-center space-x-2 font-display font-bold text-2xl tracking-tighter">
            <div class="w-8 h-8 bg-swiss-text rounded-lg"></div>
            <span>PARTNER {{ i }}</span>
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

    <!-- Component Demo Section -->
    <section class="py-24 bg-swiss-bg">
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
const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: '首页 - 广东博迩科技有限公司',
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
  if (process.client && canUse3D.value) {
    // 等待下一個 tick，確保組件已掛載
    nextTick(() => {
      initScrollAnimation()
    })
  }
})

const initScrollAnimation = () => {
  // 獲取 ScrollTrigger 實例
  const ScrollTrigger = useNuxtApp().$ScrollTrigger as any

  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not available')
    return
  }

  // 僅在桌面端啟用滾動動畫
  if (!canUse3D.value) {
    return
  }

  // 創建滾動時間軸
  const timeline = ScrollTrigger.timeline({
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

  // 階段 1: 淡入 (0-20%)
  timeline.to({}, { duration: 20 })

  // 階段 2: 機櫃打開 (20-50%)
  timeline.to({}, { duration: 30 })

  // 階段 3: 組件爆炸 (50-80%)
  timeline.to({}, { duration: 30 })

  // 階段 4: 重新組裝 (80-100%)
  timeline.to({}, { duration: 20 })
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
    const { ScrollTrigger } = useNuxtApp().$ScrollTrigger as { ScrollTrigger: any }
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }
})
</script>
