<template>
  <div class="min-h-screen bg-white">
    <!-- Back Navigation -->
    <div class="pt-32 border-b border-gray-100">
      <GridContainer>
        <div class="col-span-12 py-6">
          <NuxtLink :to="localePath('/products')"
            class="inline-flex items-center text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text/40 hover:text-swiss-text transition-colors">
            <span class="mr-4">←</span>
            Back to Collection
          </NuxtLink>
        </div>
      </GridContainer>
    </div>

    <GridContainer :grid="true" gap="none" class="border-l border-gray-100 min-h-[calc(100vh-140px)]">
      <!-- Loading State -->
      <div v-if="pending" class="col-span-12 border-r border-b border-gray-100">
        <ProductDetailSkeleton />
      </div>

      <!-- Product Not Found -->
      <div v-else-if="!product" class="col-span-12 text-center py-48 border-r border-b border-gray-100">
        <TypographyHeader :level="2" size="h2" class="mb-8"> 404_NOT_FOUND </TypographyHeader>
        <SwissButton variant="primary" @click="navigateTo(localePath('/products'))">
          RETURN_TO_COLLECTION
        </SwissButton>
      </div>

      <!-- Product Details -->
      <template v-else>
        <!-- Product Image (Left) -->
        <div
          class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 flex items-center justify-center bg-swiss-bg-soft">
          <div class="aspect-square w-full p-24 flex items-center justify-center relative">
            <!-- Product Image -->
            <img v-if="product.images && product.images.length > 0" :src="product.images[0]"
              :alt="product.name[locale as 'zh-HK' | 'zh-CN' | 'en'] || product.name['zh-HK']"
              class="max-w-full max-h-full object-contain" />
            <!-- Fallback placeholder -->
            <div v-else
              class="w-2/3 h-2/3 border border-swiss-text/5 bg-swiss-bg flex items-center justify-center shadow-2xl">
              <div class="w-1/2 h-1/2 bg-swiss-text opacity-5"></div>
            </div>

            <!-- Meta Labels -->
            <div class="absolute top-12 left-12 flex flex-col gap-2">
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-swiss-text">Model: {{ product.slug
              }}</span>
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-swiss-text/40">Cat: {{
                getCategoryLabel(product.category) }}</span>
            </div>

            <div v-if="product.featured" class="absolute bottom-12 right-12">
              <span class="text-[10px] font-black tracking-widest uppercase border border-swiss-text px-4 py-1">Limited
                Edition Range</span>
            </div>
          </div>
        </div>

        <!-- Product Info (Right) -->
        <div
          class="col-span-12 lg:col-span-5 border-r border-b border-gray-100 p-12 md:p-20 flex flex-col justify-between">
          <div>
            <div
              class="inline-block mb-12 text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono">
              Technical Specification / 01
            </div>
            <TypographyHeader :level="1" size="h1" class="mb-8">
              {{ product.name[locale as 'zh-HK' | 'zh-CN' | 'en'] || product.name['zh-HK'] }}
            </TypographyHeader>
            <p class="text-swiss-text-muted text-lg leading-relaxed font-medium mb-16">
              {{
                product.description[locale as 'zh-HK' | 'zh-CN' | 'en'] ||
                product.description['zh-HK']
              }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col gap-4">
              <SwissButton variant="primary" size="lg" class="!py-6">
                REQUEST_CONSULTATION
              </SwissButton>
              <SwissButton variant="ghost" size="lg" class="!py-6">
                DOWNLOAD_DATASHEET
              </SwissButton>
            </div>
          </div>

          <!-- Bottom Summary -->
          <div class="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
            <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text/40">Status: Available</span>
            <span class="text-[10px] font-mono opacity-20">BUILD_UUID: {{ product.id }}</span>
          </div>
        </div>

        <!-- Detailed Specifications (Bottom) -->
        <div class="col-span-12 border-r border-b border-gray-100 p-12 md:p-20 bg-white">
          <div class="max-w-4xl">
            <TypographyHeader :level="2" size="h3" class="mb-12 !tracking-tighter uppercase">
              {{ $t('products.specifications') }}
            </TypographyHeader>
            <SpecTable :specs="product.specs" class="!rounded-none border-t border-gray-100" />
          </div>
        </div>
      </template>
    </GridContainer>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const route = useRoute()
const localePath = useLocalePath()
const { locale } = useI18n()

// 使用 useLazyFetch 确保加载动画可见
const { data: product, pending, error } = useLazyFetch<Product>(`/api/products/${route.params.slug}`, {
  default: () => null as any
})

// Handle error state
watchEffect(() => {
  if (error.value) {
    console.error('Failed to fetch product:', error.value)
  }
})

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
watchEffect(() => {
  if (product.value) {
    const langKey = locale.value === 'zh-HK' ? 'hk' : locale.value === 'zh-CN' ? 'cn' : 'en'
    useHead({
      title: `${product.value.name[langKey] || product.value.name['hk']} - Project NEXUS (HK)`,
    })
  }
})
</script>
