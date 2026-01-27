<template>
  <div v-if="solution" class="min-h-screen bg-white">
    <!-- Hero Header -->
    <section class="relative pt-48 pb-32 border-b border-gray-100 overflow-hidden">
      <!-- Background Ornament -->
      <div class="absolute top-0 right-0 w-1/3 h-full bg-swiss-bg-soft -skew-x-12 transform translate-x-12 z-0"></div>

      <GridContainer :grid="true" class="relative z-10">
        <div class="col-span-12 lg:col-span-8">
          <div class="flex items-center space-x-4 mb-10">
            <NuxtLink :to="localePath('/solutions')"
              class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text/40 hover:text-swiss-text transition-colors">
              [ {{ $t('nav.solutions') }} ]
            </NuxtLink>
            <span class="text-gray-300">/</span>
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text">
              {{ localizedTitle }}
            </span>
          </div>

          <TypographyHeader :level="1" size="display" class="mb-8 !tracking-[0.02em]">
            {{ localizedTitle }}
          </TypographyHeader>

          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="max-w-2xl opacity-80 mb-12">
            {{ localizedDescription }}
          </TypographyHeader>

          <div class="flex flex-wrap gap-6">
            <SwissButton variant="primary" size="lg" class="!px-10" @click="navigateTo(localePath('/contact'))">
              {{ $t('home.hero.cta') }}
            </SwissButton>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Main Content -->
    <section class="py-32">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-12">
          <div class="border-l-[12px] border-swiss-text pl-12 md:pl-20 py-8">
            <div
              class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              Solution Specifications
            </div>

            <div class="prose prose-2xl max-w-none text-swiss-text font-medium leading-relaxed">
              <p class="mb-12 text-3xl md:text-4xl tracking-tight">
                {{ localizedDescription }}
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
                <div v-for="(feature, index) in solution.features" :key="index" class="border-t border-gray-100 pt-10">
                  <div class="text-[10px] font-bold text-swiss-text/30 mb-6 font-mono">FEATURE_O{{ index + 1 }}</div>
                  <h3 class="text-2xl font-bold mb-4 tracking-tight">{{ feature }}</h3>
                  <div class="w-12 h-1 bg-swiss-text/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Swiss Grid Callout -->
    <section class="py-24 bg-swiss-bg-soft border-y border-gray-100">
      <GridContainer>
        <div class="col-span-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div class="max-w-2xl">
            <TypographyHeader :level="2" size="h2" class="mb-6">
              {{ $t('about.solutionFeatures.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary leading-relaxed">
              {{ $t('about.companyOverview.description1') }}
            </p>
          </div>
          <SwissButton variant="ghost" size="lg" class="border-swiss-text whitespace-nowrap"
            @click="navigateTo(localePath('/contact'))">
            {{ $t('home.hero.ctaSecondary') }}
          </SwissButton>
        </div>
      </GridContainer>
    </section>
  </div>

  <div v-else-if="pending">
    <ArticleSkeleton />
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '~/types'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()
const slug = route.params.slug as string

const { data: response, pending } = useLazyFetch<{ success: boolean, data: Solution }>(`/api/solutions/${slug}`, {
  default: () => ({ success: false, data: null as any })
})

const solution = computed(() => response.value?.data)

// Get localized content
const localizedTitle = computed(() => {
  if (!solution.value) return ''
  return typeof solution.value.title === 'object'
    ? solution.value.title[locale.value as keyof typeof solution.value.title] || solution.value.title['zh-CN']
    : solution.value.title
})

const localizedDescription = computed(() => {
  if (!solution.value) return ''
  return typeof solution.value.description === 'object'
    ? solution.value.description[locale.value as keyof typeof solution.value.description] || solution.value.description['zh-CN']
    : solution.value.description
})

useHead({
  title: localizedTitle.value ? `${localizedTitle.value} - Solutions` : 'Loading Solution...',
})
</script>
