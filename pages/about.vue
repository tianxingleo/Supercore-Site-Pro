<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative pt-48 pb-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-10 relative z-10">
          <SwissTextReveal tag="div" :duration="1.2" immediate>
            <TypographyHeader :level="1" size="display" class="mb-8 !tracking-tighter">
              {{ $t('about.pageTitle') }}
            </TypographyHeader>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="200" :duration="1" immediate>
            <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="opacity-80">
              {{ $t('about.pageSubtitle') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- Company Overview -->
    <section class="py-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-6 mb-16 lg:mb-0 pr-0 lg:pr-24">
          <SwissTextReveal tag="div">
            <div
              class="inline-block mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              Company Overview
            </div>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="100">
            <TypographyHeader :level="2" size="h1" class="mb-12">
              {{ $t('about.companyOverview.title') }}
            </TypographyHeader>
          </SwissTextReveal>

          <div class="space-y-8 text-swiss-text-muted text-lg leading-relaxed font-medium">
            <SwissTextReveal tag="p" :delay="200">{{ $t('about.companyOverview.description1') }}</SwissTextReveal>
            <SwissTextReveal tag="p" :delay="300">{{ $t('about.companyOverview.description2') }}</SwissTextReveal>
          </div>

          <div class="mt-20 p-12 border border-gray-100 relative overflow-hidden bg-swiss-bg-soft">
            <SwissTextReveal tag="div">
              <TypographyHeader :level="3" size="h4" class="mb-10 font-black tracking-tighter">
                {{ $t('about.companyOverview.philosophy.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-swiss-text-muted">
              <li v-for="i in 4" :key="i" class="flex flex-col space-y-2">
                <SwissTextReveal tag="div" :delay="i * 100">
                  <span class="text-[10px] font-bold text-swiss-text opacity-30 block">0{{ i }}</span>
                  <span class="font-bold text-swiss-text tracking-tight">{{
                    $t(`about.companyOverview.philosophy.point${i}`)
                  }}</span>
                </SwissTextReveal>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
            <!-- Stats Card 1 -->
            <SwissTextReveal tag="div" :delay="100"
              class="bg-swiss-text p-12 flex flex-col justify-between min-h-[300px]">
              <div class="text-white/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Performance
              </div>
              <div>
                <div class="text-6xl font-black text-white mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.support24.value') }}
                </div>
                <div class="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.support24.label') }}
                </div>
              </div>
            </SwissTextReveal>

            <!-- Stats Card 2 -->
            <SwissTextReveal tag="div" :delay="250" class="bg-white p-12 flex flex-col justify-between min-h-[300px]">
              <div class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Availability
              </div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.availability.value') }}
                </div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.availability.label') }}
                </div>
              </div>
            </SwissTextReveal>

            <!-- Stats Card 3 -->
            <SwissTextReveal tag="div" :delay="400"
              class="bg-white p-12 flex flex-col justify-between min-h-[300px] sm:col-span-2">
              <div class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Response Accuracy
              </div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.response.value') }}
                </div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.response.label') }}
                </div>
              </div>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Why Choose Us / Features -->
    <section class="py-32 bg-white">
      <GridContainer :grid="true">
        <div class="col-span-12 mb-20">
          <SwissTextReveal tag="div">
            <div
              class="inline-block mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              Our Edge
            </div>
          </SwissTextReveal>
          <SwissTextReveal tag="div" :delay="100">
            <TypographyHeader :level="2" size="h1" class="mb-4">
              {{ $t('about.solutionFeatures.title') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>

        <div v-for="(feature, key, index) in solutionFeatures" :key="key"
          class="col-span-12 md:col-span-4 border-t border-gray-100 pt-12 mt-12 first:mt-0 md:first:mt-12 md:mt-12">
          <SwissTextReveal tag="div" :delay="index * 100">
            <div class="h-full group">
              <div
                class="w-12 h-12 border border-gray-200 flex items-center justify-center mb-10 group-hover:bg-swiss-text group-hover:border-swiss-text transition-all duration-500">
                <component :is="feature.icon"
                  class="w-6 h-6 text-swiss-text group-hover:text-white transition-colors" />
              </div>
              <TypographyHeader :level="3" size="h3" class="mb-6 !tracking-tighter">
                {{ $t(`about.solutionFeatures.${key}.title`) }}
              </TypographyHeader>
              <p class="text-swiss-text-muted leading-relaxed font-medium">
                {{ $t(`about.solutionFeatures.${key}.description`) }}
              </p>
            </div>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- Call to Action -->
    <section class="py-32 border-t border-gray-100">
      <GridContainer>
        <div class="col-span-12">
          <div class="bg-swiss-text p-16 md:p-32 text-center relative overflow-hidden">
            <div class="relative z-10">
              <TypographyHeader :level="2" size="display" color="white" class="mb-16">
                Ready to optimize<br>your infrastructure?
              </TypographyHeader>
              <div class="flex flex-col sm:flex-row justify-center gap-8">
                <SwissButton tag="a" :to="localePath('/contact')" variant="primary" size="lg"
                  class="!bg-white !text-swiss-text hover:!bg-gray-100 !px-12 w-full"
                  aria-label="Contact us to optimize your infrastructure">
                  {{ $t('home.hero.ctaSecondary') }}
                </SwissButton>
                <SwissButton tag="a" :to="localePath('/products')" variant="ghost" size="lg"
                  class="!text-white !border-white/20 hover:!bg-white/10 !px-12 w-full">
                  {{ $t('nav.products') }}
                </SwissButton>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: computed(() => `${t('nav.about')} - Supercore`),
})

const localePath = useLocalePath()

const solutionFeatures = {
  stable: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
            }),
          ]
        ),
    }),
  },
  cost: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M12 6v12m-3-2.818l.879.659c1.546 1.16 3.743 1.16 5.289 0m-5.289-8l.879.659c1.546 1.16 3.743 1.16 5.289 0m-7.289 4h10',
            }),
          ]
        ),
    }),
  },
  technology: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M12 18L20.25 7.5L3.75 7.5L12 18Z',
            }),
          ]
        ),
    }),
  },
  security: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
            }),
          ]
        ),
    }),
  },
  responseSpeed: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
            }),
          ]
        ),
    }),
  },
  oneStop: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.96 1.24m5.96-5.96a14.926 14.926 0 00-1.24 5.96m-3.388-3.388a4.885 4.885 0 013.667-3.667m-7.334 7.334a4.885 4.885 0 01-3.667 3.667m7.334-7.334L15 6.41',
            }),
          ]
        ),
    }),
  },
}
</script>
