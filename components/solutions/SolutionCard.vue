<template>
  <NuxtLink
    :to="`/solutions/${solution.slug}`"
    class="group block bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <!-- Icon -->
    <div class="mb-6">
      <div
        class="w-16 h-16 bg-swiss-bg rounded-lg flex items-center justify-center group-hover:bg-swiss-accent transition-colors duration-300"
      >
        <component
          :is="getIcon(solution.icon)"
          class="w-8 h-8 text-swiss-text group-hover:text-white transition-colors duration-300"
        />
      </div>
    </div>

    <!-- Title -->
    <TypographyHeader level="3" size="h4" class="mb-3 group-hover:text-swiss-accent transition-colors">
      {{ solution.title[currentLocale] }}
    </TypographyHeader>

    <!-- Description -->
    <p class="text-swiss-secondary text-sm mb-6">
      {{ solution.description[currentLocale] }}
    </p>

    <!-- Features List -->
    <ul class="space-y-2 mb-6">
      <li
        v-for="(feature, index) in solution.features.slice(0, 3)"
        :key="index"
        class="flex items-center text-xs text-swiss-secondary"
      >
        <svg class="w-4 h-4 mr-2 text-swiss-accent" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ feature }}
      </li>
    </ul>

    <!-- Learn More Link -->
    <span class="inline-flex items-center text-sm font-medium text-swiss-accent group-hover:underline">
      了解更多
      <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Solution } from '~/types'

interface Props {
  solution: Solution
}

const props = defineProps<Props>()
const { locale } = useI18n()

// Map locale to property names
const localeMap: Record<string, 'zhHK' | 'zhCN' | 'en'> = {
  'zh-HK': 'zhHK',
  'zh-CN': 'zhCN',
  'en': 'en',
}

const currentLocale = computed(() => localeMap[locale.value] || 'zhHK')

// Icon components (simplified SVG icons)
const icons = {
  Server: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    `,
  },
  Network: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    `,
  },
  Settings: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    `,
  },
  Code: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    `,
  },
  Shield: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    `,
  },
  Cloud: {
    template: `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    `,
  },
}

const getIcon = (iconName: string) => {
  return icons[iconName as keyof typeof icons] || icons.Server
}
</script>
