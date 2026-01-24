<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Animated Text Overlay -->
    <AnimatedTextOverlay :phase="animationPhase" />

    <!-- Hero Section with 3D Scene -->
    <section class="min-h-screen flex items-center" id="hero-section">
      <GridContainer>
        <div class="col-span-12 lg:col-span-6 flex flex-col justify-center">
          <TypographyHeader level="1" size="display" class="mb-6">
            {{ $t('home.hero.title') }}
          </TypographyHeader>
          <TypographyHeader level="2" size="h3" color="secondary" class="mb-12">
            {{ $t('home.hero.subtitle') }}
          </TypographyHeader>
          <div class="flex flex-col sm:flex-row gap-4">
            <SwissButton variant="primary" size="lg">
              {{ $t('home.hero.cta') }}
            </SwissButton>
            <SwissButton variant="ghost" size="lg">
              {{ $t('home.hero.ctaSecondary') }}
            </SwissButton>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 min-h-[500px] relative">
          <ServerScene
            ref="serverSceneRef"
            background-color="#F5F5F7"
            :auto-rotate="false"
            :mouse-parallax="true"
          />
        </div>
      </GridContainer>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <GridContainer>
        <!-- Section Header -->
        <div class="col-span-12 text-center mb-16">
          <TypographyHeader level="2" size="h2" align="center" class="mb-4">
            {{ $t('home.features.title') }}
          </TypographyHeader>
        </div>

        <!-- Feature 1 -->
        <div class="col-span-12 md:col-span-4 mb-8 md:mb-0">
          <div class="text-center p-8">
            <TypographyHeader level="3" size="h4" class="mb-4">
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
            <TypographyHeader level="3" size="h4" class="mb-4">
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
            <TypographyHeader level="3" size="h4" class="mb-4">
              {{ $t('home.features.feature3.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary">
              {{ $t('home.features.feature3.description') }}
            </p>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Component Demo Section -->
    <section class="py-24 bg-swiss-bg">
      <GridContainer>
        <div class="col-span-12 mb-12">
          <TypographyHeader level="2" size="h2">
            Swiss Design Components
          </TypographyHeader>
          <p class="text-swiss-secondary mt-4">
            Swiss International Style - 瑞士国际主义风格组件库
          </p>
        </div>

        <!-- Button Variants -->
        <div class="col-span-12 mb-8">
          <TypographyHeader level="3" size="h4" class="mb-4">
            Button Variants
          </TypographyHeader>
          <div class="flex flex-wrap gap-4">
            <SwissButton variant="primary">Primary</SwissButton>
            <SwissButton variant="secondary">Secondary</SwissButton>
            <SwissButton variant="ghost">Ghost</SwissButton>
            <SwissButton variant="primary" disabled>Disabled</SwissButton>
          </div>
        </div>

        <!-- Button Sizes -->
        <div class="col-span-12 mb-8">
          <TypographyHeader level="3" size="h4" class="mb-4">
            Button Sizes
          </TypographyHeader>
          <div class="flex flex-wrap gap-4 items-center">
            <SwissButton variant="primary" size="sm">Small</SwissButton>
            <SwissButton variant="primary" size="md">Medium</SwissButton>
            <SwissButton variant="primary" size="lg">Large</SwissButton>
          </div>
        </div>

        <!-- Typography Examples -->
        <div class="col-span-12">
          <TypographyHeader level="3" size="h4" class="mb-4">
            Typography Scale
          </TypographyHeader>
          <div class="space-y-4">
            <TypographyHeader level="1" size="h1">
              Display Heading (H1) - 专业基礎設施解決方案
            </TypographyHeader>
            <TypographyHeader level="2" size="h2">
              Heading 2 (H2) - 瑞士國際主義風格
            </TypographyHeader>
            <TypographyHeader level="3" size="h3">
              Heading 3 (H3) - Swiss International Style
            </TypographyHeader>
            <TypographyHeader level="4" size="h4" color="secondary">
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

useHead({
  title: t('nav.home'),
})

// 動畫系統
const serverSceneRef = ref()
const animationPhase = ref(0)

onMounted(() => {
  // 確保在客戶端執行
  if (process.client) {
    // 等待下一個 tick，確保組件已掛載
    nextTick(() => {
      initScrollAnimation()
    })
  }
})

const initScrollAnimation = () => {
  // 獲取 ScrollTrigger 實例
  const { ScrollTrigger } = useNuxtApp().$ScrollTrigger as { ScrollTrigger: any }

  if (!ScrollTrigger) {
    console.warn('ScrollTrigger not available')
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
