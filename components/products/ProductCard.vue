<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
  >
    <!-- Product Image Placeholder -->
    <div class="aspect-video bg-gradient-to-br from-swiss-bg to-gray-200 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-24 h-24 bg-swiss-text rounded-lg opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500"
        ></div>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-swiss-text">
          {{ getCategoryLabel(product.category) }}
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="product.featured" class="absolute top-4 right-4">
        <span class="px-3 py-1 bg-swiss-accent text-white rounded-full text-xs font-medium">
          {{ $t('products.featured') }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <TypographyHeader level="3" size="h4" class="mb-2 group-hover:text-swiss-accent transition-colors">
        {{ product.name[currentLocale] }}
      </TypographyHeader>
      <p class="text-swiss-secondary text-sm line-clamp-2 mb-4">
        {{ product.description[currentLocale] }}
      </p>

      <!-- Key Specs Preview -->
      <div class="flex items-center justify-between text-xs text-swiss-secondary">
        <span v-if="product.specs.cpu">{{ product.specs.cpu }}</span>
        <span v-if="product.specs.rackUnits">{{ product.specs.rackUnits }}</span>
        <SwissButton variant="ghost" size="sm">
          {{ $t('products.viewDetails') }} →
        </SwissButton>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
  product: Product
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

const categoryLabels: Record<string, string> = {
  server: '伺服器',
  storage: '存儲',
  network: '網絡',
  software: '軟件',
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
