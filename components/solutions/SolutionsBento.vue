<template>
  <div class="solutions-bento-grid">
    <GridContainer>
      <!-- Featured Solutions (Large Cards) -->
      <template v-for="(solution, index) in featuredSolutions" :key="solution.id">
        <!-- Large featured cards -->
        <div
          v-if="index === 0"
          class="col-span-12 lg:col-span-8 mb-8"
        >
          <SolutionCard :solution="solution" />
        </div>
        <div
          v-else-if="index === 1"
          class="col-span-12 lg:col-span-4 mb-8"
        >
          <SolutionCard :solution="solution" />
        </div>
      </template>

      <!-- Regular Solutions Grid -->
      <div
        v-for="solution in regularSolutions"
        :key="solution.id"
        class="col-span-12 md:col-span-6 lg:col-span-4 mb-8"
      >
        <SolutionCard :solution="solution" />
      </div>
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
