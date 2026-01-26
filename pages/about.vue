<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative pt-48 pb-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <div class="col-span-12 text-center relative z-10">
          <TypographyHeader :level="1" size="display"
            class="mb-8">
            {{ $t('about.pageTitle') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal"
            class="max-w-3xl mx-auto opacity-80">
            {{ $t('about.pageSubtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- Company Overview -->
    <section class="py-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-6 mb-16 lg:mb-0 pr-0 lg:pr-24">
          <div
            class="inline-block mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
            Company Overview
          </div>
          <TypographyHeader :level="2" size="h1" class="mb-12">
            {{ $t('about.companyOverview.title') }}
          </TypographyHeader>
          <div class="space-y-8 text-swiss-text-muted text-lg leading-relaxed font-medium">
            <p>{{ $t('about.companyOverview.description1') }}</p>
            <p>{{ $t('about.companyOverview.description2') }}</p>
          </div>

          <div
            class="mt-20 p-12 border border-gray-100 relative overflow-hidden bg-swiss-bg-soft">
            <TypographyHeader :level="3" size="h4"
              class="mb-10 font-black tracking-tighter">
              {{ $t('about.companyOverview.philosophy.title') }}
            </TypographyHeader>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-swiss-text-muted">
              <li v-for="i in 4" :key="i" class="flex flex-col space-y-2">
                <span class="text-[10px] font-bold text-swiss-text opacity-30">0{{ i }}</span>
                <span class="font-bold text-swiss-text tracking-tight">{{ $t(`about.companyOverview.philosophy.point${i}`)
                  }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
            <!-- Stats Card 1 -->
            <div
              class="bg-swiss-text p-12 flex flex-col justify-between min-h-[300px]">
              <div
                class="text-white/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Performance</div>
              <div>
                <div class="text-6xl font-black text-white mb-2 tracking-tighter">{{
                  $t('about.coreAdvantages.support24.value') }}</div>
                <div class="text-white/60 text-xs font-bold uppercase tracking-widest">{{
                  $t('about.coreAdvantages.support24.label') }}</div>
              </div>
            </div>

            <!-- Stats Card 2 -->
            <div
              class="bg-white p-12 flex flex-col justify-between min-h-[300px]">
              <div
                class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Availability</div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">{{
                  $t('about.coreAdvantages.availability.value') }}</div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">{{
                  $t('about.coreAdvantages.availability.label') }}</div>
              </div>
            </div>

            <!-- Stats Card 3 -->
            <div
              class="bg-white p-12 flex flex-col justify-between min-h-[300px] sm:col-span-2">
              <div
                class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Response Accuracy</div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">{{
                  $t('about.coreAdvantages.response.value') }}</div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">{{
                  $t('about.coreAdvantages.response.label') }}</div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

            <!-- Stats Card 4 -->
            <div
              class="bg-swiss-accent p-6 sm:p-10 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[220px]">
              <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div
                class="text-white/70 font-display font-medium mb-2 tracking-wider uppercase text-[10px] sm:text-xs relative z-10">
                Experience</div>
              <div class="relative z-10">
                <div class="text-3xl sm:text-5xl font-bold text-white mb-1 font-display">{{
                  $t('about.coreAdvantages.team.value') }}</div>
                <div class="text-white/80 text-sm sm:text-base font-medium">{{ $t('about.coreAdvantages.team.label') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Why Choose Us / Features -->
    <section class="py-32 bg-swiss-text relative overflow-hidden">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-swiss-accent/10 to-transparent"></div>

      <GridContainer :grid="true">
        <div class="col-span-12 text-center mb-20">
          <div
            class="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-swiss-accent bg-swiss-accent/20 rounded-full">
            Our Edge
          </div>
          <TypographyHeader :level="2" size="h2" class="mb-4 text-white font-display">
            {{ $t('about.solutionFeatures.title') }}
          </TypographyHeader>
        </div>

        <div v-for="(feature, key) in solutionFeatures" :key="key" class="col-span-12 md:col-span-4 mb-8">
          <div
            class="bg-white/5 backdrop-blur-lg rounded-3xl p-8 h-full border border-white/10 hover:border-swiss-accent/50 transition-all duration-500 hover:-translate-y-2 group">
            <div
              class="w-14 h-14 bg-swiss-accent/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-swiss-accent transition-colors duration-500">
              <component :is="feature.icon"
                class="w-7 h-7 text-swiss-accent group-hover:text-white transition-colors" />
            </div>
            <TypographyHeader :level="3" size="h4" class="mb-4 text-white font-display">
              {{ $t(`about.solutionFeatures.${key}.title`) }}
            </TypographyHeader>
            <p class="text-swiss-secondary leading-relaxed text-sm sm:text-base">
              {{ $t(`about.solutionFeatures.${key}.description`) }}
            </p>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Call to Action -->
    <section class="py-24 bg-[#FBFBFE]">
      <GridContainer>
        <div class="col-span-12">
          <div
            class="bg-gradient-to-r from-swiss-accent to-[#005bb5] rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div
              class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10">
            </div>
            <div class="relative z-10">
              <TypographyHeader :level="2" size="h2" class="text-white mb-8 font-display">
                Ready to optimize your infrastructure?
              </TypographyHeader>
              <div class="flex flex-col sm:flex-row justify-center gap-6">
                <SwissButton variant="primary" size="lg" class="!bg-white !text-swiss-accent hover:!bg-gray-100">
                  {{ $t('home.hero.ctaSecondary') }}
                </SwissButton>
                <SwissButton variant="ghost" size="lg" class="!text-white !border-white/30 hover:!bg-white/10">
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
useHead({
  title: '關於博迩 - 廣東博迩科技有限公司',
})

const solutionFeatures = {
  stable: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' })
      ])
    })
  },
  cost: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 6v12m-3-2.818l.879.659c1.546 1.16 3.743 1.16 5.289 0m-5.289-8l.879.659c1.546 1.16 3.743 1.16 5.289 0m-7.289 4h10' })
      ])
    })
  },
  technology: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 18L20.25 7.5L3.75 7.5L12 18Z' })
      ])
    })
  },
  security: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' })
      ])
    })
  },
  responseSpeed: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' })
      ])
    })
  },
  oneStop: {
    icon: defineComponent({
      render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.96 1.24m5.96-5.96a14.926 14.926 0 00-1.24 5.96m-3.388-3.388a4.885 4.885 0 013.667-3.667m-7.334 7.334a4.885 4.885 0 01-3.667 3.667m7.334-7.334L15 6.41' })
      ])
    })
  }
}
</script>
