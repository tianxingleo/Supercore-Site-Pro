<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer :grid="true">
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('about.pageTitle') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            {{ $t('about.pageSubtitle') }}
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Company Overview -->
    <section class="mb-24">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-6 mb-8 lg:mb-0">
          <TypographyHeader level="2" size="h2" class="mb-6">
            {{ $t('about.companyOverview.title') }}
          </TypographyHeader>
          <div class="space-y-4 text-swiss-secondary">
            <p>
              {{ $t('about.companyOverview.description1') }}
            </p>
            <p>
              {{ $t('about.companyOverview.description2') }}
            </p>
            <div class="bg-white rounded-lg p-6 mt-6 border-l-4 border-swiss-accent">
              <TypographyHeader level="3" size="h5" class="mb-3 text-swiss-text">
                {{ $t('about.companyOverview.philosophy.title') }}
              </TypographyHeader>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-swiss-accent mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ $t('about.companyOverview.philosophy.point1') }}
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-swiss-accent mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ $t('about.companyOverview.philosophy.point2') }}
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-swiss-accent mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ $t('about.companyOverview.philosophy.point3') }}
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-swiss-accent mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ $t('about.companyOverview.philosophy.point4') }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              {{ $t('about.coreAdvantages.title') }}
            </TypographyHeader>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">{{ $t('about.coreAdvantages.support24.value') }}</div>
                <div class="text-sm text-swiss-secondary">{{ $t('about.coreAdvantages.support24.label') }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">{{ $t('about.coreAdvantages.availability.value') }}</div>
                <div class="text-sm text-swiss-secondary">{{ $t('about.coreAdvantages.availability.label') }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">{{ $t('about.coreAdvantages.response.value') }}</div>
                <div class="text-sm text-swiss-secondary">{{ $t('about.coreAdvantages.response.label') }}</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">{{ $t('about.coreAdvantages.team.value') }}</div>
                <div class="text-sm text-swiss-secondary">{{ $t('about.coreAdvantages.team.label') }}</div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Solutions Section -->
    <section class="mb-24">
      <GridContainer :grid="true">
        <div class="col-span-12 mb-12">
          <TypographyHeader level="2" size="h2" class="text-center">
            {{ $t('about.solutionFeatures.title') }}
          </TypographyHeader>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.stable.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.stable.description') }}
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3-2-1.343-2-3-2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.cost.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.cost.description') }}
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.technology.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.technology.description') }}
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.security.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.security.description') }}
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.responseSpeed.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.responseSpeed.description') }}
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-6 shadow-sm h-full text-center">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h5" class="mb-2">
              {{ $t('about.solutionFeatures.oneStop.title') }}
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              {{ $t('about.solutionFeatures.oneStop.description') }}
            </p>
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
</script>
