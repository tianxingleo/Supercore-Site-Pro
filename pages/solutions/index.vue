<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-8">
          <TypographyHeader :level="1" size="display" class="mb-8">
            {{ $t('solutions.title') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="max-w-2xl opacity-80">
            {{ $t('solutions.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- Category Tabs -->
    <section class="mb-24">
      <GridContainer :grid="true">
        <div class="col-span-12 flex flex-col md:flex-row items-center gap-8">
          <span class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono">Filter / Category</span>
          <div class="flex flex-wrap gap-4">
            <button
              v-for="category in categories"
              :key="category.key"
              @click="selectedCategory = category.key"
              class="px-8 py-3 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 font-mono"
              :class="
                selectedCategory === category.key
                  ? 'bg-swiss-text text-white border-black'
                  : 'bg-white text-swiss-text hover:border-black'
              "
            >
              [{{ category.label }}]
            </button>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Solutions Grid -->
    <section class="pb-32">
      <SolutionsBento :solutions="filteredSolutions" />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '~/types'

const { t } = useI18n()

const { data: solutions } = await useFetch<Solution[]>('/api/solutions', {
  transform: () => {
    return mockSolutions.sort((a, b) => a.order - b.order)
  },
})

import { mockSolutions } from '~/utils/mockData'

// Categories
const categories = [
  { key: 'all', label: t('solutions.categories.all') },
  { key: 'idc', label: t('solutions.categories.idc') },
  { key: 'operations', label: t('solutions.categories.operations') },
  { key: 'development', label: t('solutions.categories.development') },
]

const selectedCategory = ref('all')

// Filter solutions by category
const filteredSolutions = computed(() => {
  if (selectedCategory.value === 'all') {
    return solutions.value || []
  }
  return (solutions.value || []).filter((s) => s.category === selectedCategory.value)
})

useHead({
  title: '解决方案 - 广东博迩科技有限公司',
})
</script>
