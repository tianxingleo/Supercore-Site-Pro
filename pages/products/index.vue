<template>
  <div class="min-h-screen bg-swiss-bg py-24">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer>
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('products.title') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            企業級基礎設施產品，為您的業務提供強大支撐
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Products Grid -->
    <section>
      <GridContainer>
        <div
          v-for="product in products"
          :key="product.id"
          class="col-span-12 md:col-span-6 lg:col-span-4 mb-8"
        >
          <ProductCard :product="product" />
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const { data: products } = await useFetch<Product[]>('/api/products', {
  transform: (_data) => {
    // Use mock data for now
    return mockProducts
  },
})

// Import mock data
import { mockProducts } from '~/utils/mockData'

useHead({
  title: '產品 - Project NEXUS (HK)',
})
</script>
