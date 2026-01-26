<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-8">
          <TypographyHeader :level="1" size="display" class="mb-8">
            {{ $t('products.title') }}
          </TypographyHeader>
          <TypographyHeader :level="2" size="h3" color="secondary" weight="normal" class="max-w-2xl opacity-80">
            {{ $t('products.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- Products Grid -->
    <section class="pb-32">
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
        >
          <ProductCard :product="product" class="!border-none" />
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
