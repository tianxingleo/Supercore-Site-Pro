<template>
  <div class="solutions-bento-grid">
    <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
      <!-- Featured Solutions (Large Cards) -->
      <template v-for="(solution, index) in solutions" :key="solution.id">
        <div
          class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
          :class="{
            'lg:col-span-8': index === 0,
            'lg:col-span-4': index !== 0
          }"
        >
          <SolutionCard :solution="solution" />
        </div>
      </template>
    </GridContainer>
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '~/types'

interface Props {
  solutions: Solution[]
}

const props = defineProps<Props>()

// Split solutions into featured (first 2) and regular
const featuredSolutions = computed(() => props.solutions.slice(0, 2))
const regularSolutions = computed(() => props.solutions.slice(2))
</script>

<style scoped>
.solutions-bento-grid {
  @apply min-h-screen;
}
</style>
