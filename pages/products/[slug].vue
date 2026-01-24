<template>
  <div class="min-h-screen bg-swiss-bg py-24">
    <GridContainer>
      <!-- Back Button -->
      <div class="col-span-12 mb-8">
        <NuxtLink to="/products" class="inline-flex items-center text-swiss-secondary hover:text-swiss-accent transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          {{ $t('products.allProducts') }}
        </NuxtLink>
      </div>

      <!-- Product Not Found -->
      <div v-if="!product" class="col-span-12 text-center py-24">
        <TypographyHeader level="2" size="h2" class="mb-4">
          產品未找到
        </TypographyHeader>
        <SwissButton variant="primary" @click="navigateTo('/products')">
          返回產品列表
        </SwissButton>
      </div>

      <!-- Product Details -->
      <template v-else>
        <!-- Product Header -->
        <div class="col-span-12 lg:col-span-6 mb-12">
          <!-- Product Image Placeholder -->
          <div class="aspect-square bg-gradient-to-br from-swiss-bg to-gray-200 rounded-lg relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-48 h-48 bg-swiss-text rounded-lg opacity-10"></div>
            </div>

            <!-- Category Badge -->
            <div class="absolute top-6 left-6">
              <span class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-swiss-text">
                {{ getCategoryLabel(product.category) }}
              </span>
            </div>

            <!-- Featured Badge -->
            <div v-if="product.featured" class="absolute top-6 right-6">
              <span class="px-4 py-2 bg-swiss-accent text-white rounded-full text-sm font-medium">
                {{ $t('products.featured') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="col-span-12 lg:col-span-6 mb-12">
          <TypographyHeader level="1" size="h2" class="mb-4">
            {{ product.name[locale] || product.name.zhHK }}
          </TypographyHeader>
          <p class="text-swiss-secondary text-lg mb-8">
            {{ product.description[locale] || product.description.zhHK }}
          </p>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4">
            <SwissButton variant="primary" size="lg">
              聯絡我們
            </SwissButton>
            <SwissButton variant="ghost" size="lg">
              下載規格書
            </SwissButton>
          </div>
        </div>

        <!-- Specifications -->
        <div class="col-span-12">
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="2" size="h3" class="mb-6">
              {{ $t('products.specifications') }}
            </TypographyHeader>
            <SpecTable :specs="product.specs" />
          </div>
        </div>
      </template>
    </GridContainer>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const route = useRoute()
const { locale } = useI18n()

// Fetch product data
const { data: product } = await useFetch<Product>(`/api/products/${route.params.slug}`, {
  transform: () => {
    return mockProducts.find(p => p.slug === route.params.slug) || null
  },
})

// Import mock data
import { mockProducts } from '~/utils/mockData'

const categoryLabels: Record<string, string> = {
  server: '伺服器',
  storage: '存儲',
  network: '網絡',
  software: '軟件',
}

const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category
}

// Set page title
if (product.value) {
  useHead({
    title: `${product.value.name[locale.value] || product.value.name.zhHK} - Project NEXUS (HK)`,
  })
}
</script>
