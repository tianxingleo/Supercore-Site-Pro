<template>
  <NuxtLink :to="localePath(`/solutions/${solution.slug}`)"
    class="group block bg-white border border-gray-100 p-10 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 min-h-full">
    <!-- Icon -->
    <div class="mb-12">
      <div
        class="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:bg-swiss-text group-hover:border-swiss-text group-hover:scale-110 transition-all duration-500">
        <component :is="getIcon(solution.icon)"
          class="w-6 h-6 text-swiss-text group-hover:text-white transition-colors duration-500" />
      </div>
    </div>

    <!-- Title -->
    <TypographyHeader :level="3" size="h3" class="mb-6 !tracking-tighter">
      {{ solution.title[currentLocale] }}
    </TypographyHeader>

    <!-- Description -->
    <p class="text-swiss-text-muted text-base leading-relaxed mb-10 max-w-sm">
      {{ solution.description[currentLocale] }}
    </p>

    <!-- Learn More Link -->
    <div
      class="mt-auto pt-4 flex items-center text-xs font-bold tracking-widest uppercase text-swiss-text group-hover:translate-x-2 transition-transform duration-500">
      {{ $t('common.learnMore') || 'Explore' }}
      <span class="ml-2">→</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { Solution } from '~/types'

interface Props {
  solution: Solution
}

const props = defineProps<Props>()
const localePath = useLocalePath()
const { locale } = useI18n()

const currentLocale = computed(() => locale.value as 'zh-HK' | 'zh-CN' | 'en')

// Icon components using render functions instead of template strings
const icons = {
  Server: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
        })
      ),
  },
  Network: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        })
      ),
  },
  Settings: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
          }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
          }),
        ]
      ),
  },
  Code: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        })
      ),
  },
  Shield: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        })
      ),
  },
  Cloud: {
    render: () =>
      h(
        'svg',
        { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
        })
      ),
  },
}

const getIcon = (iconName: string) => {
  return icons[iconName as keyof typeof icons] || icons.Server
}
</script>
