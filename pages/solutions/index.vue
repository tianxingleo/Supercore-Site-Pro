<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer :grid="true">
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('solutions.title') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            {{ $t('solutions.subtitle') }}
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Category Tabs -->
    <section class="mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12">
          <div class="flex flex-wrap justify-center gap-4">
            <button
              v-for="category in categories"
              :key="category.key"
              @click="selectedCategory = category.key"
              class="px-6 py-3 rounded-lg transition-all duration-300"
              :class="
                selectedCategory === category.key
                  ? 'bg-swiss-text text-white'
                  : 'bg-white text-swiss-text hover:bg-swiss-secondary/10'
              "
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Solutions Grid -->
    <section>
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
