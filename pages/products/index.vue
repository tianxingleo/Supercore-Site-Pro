<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-8">
          <TypographyHeader :level="1" size="display" class="mb-8">
            {{ $t('products.title') }}
          </TypographyHeader>
          <TypographyHeader
            :level="2"
            size="h3"
            color="secondary"
            weight="normal"
            class="max-w-2xl opacity-80"
          >
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
          <div
            v-for="i in 6"
            :key="i"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
          >
            <ProductSkeleton class="!border-none" />
          </div>
        </template>

        <!-- Data Loaded State -->
        <template v-else-if="products && products.length">
          <div
            v-for="product in products"
            :key="product.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
          >
            <ProductCard :product="product" class="!border-none" />
          </div>
        </template>

        <!-- No Data State -->
        <template v-else>
          <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
            <p class="text-swiss-secondary uppercase tracking-widest text-sm">暂无產品數據</p>
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
import { mockProducts } from '~/utils/mockData'

console.log('[Products] Page mounting...')

// 使用 useLazyFetch 确保加载动画可见
const { data: apiProducts, pending, error } = useLazyFetch('/api/products/public')

// 监听数据变化
watch(apiProducts, (newData) => {
  console.log('[Products] apiProducts changed:', {
    isNull: newData === null,
    isUndefined: newData === undefined,
    isArray: Array.isArray(newData),
    length: newData?.length,
    data: newData,
  })
})

// 数据加载完成后的处理
const products = computed(() => {
  console.log('[Products] Computed called')

  const apiResponse = apiProducts.value
  const isError = error.value
  const isLoading = pending.value

  console.log('[Products] API response structure:', {
    isLoading,
    isError,
    apiResponse,
    hasSuccess: apiResponse?.success,
    hasData: apiResponse?.data,
    dataArray: apiResponse?.data,
    isArray: Array.isArray(apiResponse?.data),
    length: apiResponse?.data?.length,
  })

  // 如果还在加载中，返回空数组（让 pending 状态显示骨架屏）
  if (isLoading || !apiResponse) {
    console.log('[Products] Still loading, returning empty array')
    return []
  }

  // 如果有错误
  if (isError) {
    console.error('[Products] API Error:', isError)
    return []
  }

  // API 正常返回数据
  if (apiResponse.success && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
    console.log('[Products] Using API data', {
      count: apiResponse.data.length,
      data: apiResponse.data,
    })
    return apiResponse.data
  }

  // 如果数据为空
  console.log('[Products] API returned no data')
  return []
})

// 监听产品变化
watch(products, (newProducts) => {
  console.log('[Products] Display products changed:', {
    length: newProducts.length,
    isUsingMock: newProducts === mockProducts,
    apiProductsLength: apiProducts.value?.data?.length || 0,
    mockProductsLength: mockProducts.length,
  })
})

// 监听错误和数据状态
watch([error, apiProducts, pending], ([newError, newData, isPending]) => {
  console.log('[Products] State changed:', {
    error: newError,
    isPending,
    apiProductsLength: newData?.value?.length || 0,
  })
})

useHead({
  title: '产品 - 超核技術有限公司',
})
</script>
