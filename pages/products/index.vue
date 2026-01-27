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
        <!-- Loading State -->
        <template v-if="pending">
          <div v-for="i in 6" :key="i"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100">
            <ProductSkeleton class="!border-none" />
          </div>
        </template>

        <!-- Data Loaded State -->
        <template v-else-if="products && products.length">
          <div v-for="product in products" :key="product.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100">
            <ProductCard :product="product" class="!border-none" />
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

// 使用 useFetch 在服务端预加载数据，避免闪烁
const { data: products, pending } = useFetch<Product[]>('/api/products/public', {
  transform: (data) => {
    if (!data || data.length === 0) return []
    return data
  },
})

useHead({
  title: '产品 - 超核技術有限公司',
})
</script>
