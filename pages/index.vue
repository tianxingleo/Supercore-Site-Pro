<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Hero Section -->
    <section class="min-h-screen flex items-center justify-center">
      <GridContainer>
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="display" align="center" class="mb-6">
            {{ $t('home.hero.title') }}
          </TypographyHeader>
          <TypographyHeader level="2" size="h3" color="secondary" align="center" class="mb-12">
            {{ $t('home.hero.subtitle') }}
          </TypographyHeader>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SwissButton variant="primary" size="lg">
              {{ $t('home.hero.cta') }}
            </SwissButton>
            <SwissButton variant="ghost" size="lg">
              {{ $t('home.hero.ctaSecondary') }}
            </SwissButton>
          </div>
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
</script>
