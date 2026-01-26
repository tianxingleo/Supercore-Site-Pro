<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer :grid="true">
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('products.title') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            {{ $t('products.subtitle') }}
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Products Grid -->
    <section>
      <GridContainer :grid="true">
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
  title: '产品 - 广东博迩科技有限公司',
})
</script>
