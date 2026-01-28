<template>
  <div class="min-h-screen bg-white">
    <!-- Back Navigation -->
    <div class="pt-32 border-b border-gray-100">
      <GridContainer>
        <div class="col-span-12 py-6">
          <NuxtLink
            :to="localePath('/products')"
            class="inline-flex items-center text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text/40 hover:text-swiss-text transition-colors"
            aria-label="Back to products collection"
          >
            <span class="mr-4" aria-hidden="true">←</span>
            Back to Collection
          </NuxtLink>
        </div>
      </GridContainer>
    </div>

    <GridContainer
      :grid="true"
      gap="none"
      class="border-l border-gray-100 min-h-[calc(100vh-140px)]"
    >
      <!-- Loading State -->
      <div v-if="pending" class="col-span-12 border-r border-b border-gray-100">
        <ProductDetailSkeleton />
      </div>

      <!-- Product Not Found -->
      <div
        v-else-if="!product"
        class="col-span-12 text-center py-48 border-r border-b border-gray-100"
      >
        <TypographyHeader :level="2" size="h2" class="mb-8"> 404_NOT_FOUND </TypographyHeader>
        <SwissButton variant="primary" @click="navigateTo(localePath('/products'))">
          RETURN_TO_COLLECTION
        </SwissButton>
      </div>

      <!-- Product Details -->
      <template v-else>
        <!-- Product Image (Left) -->
        <div
          class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 flex items-center justify-center bg-swiss-bg-soft"
        >
          <div class="aspect-square w-full p-24 flex items-center justify-center relative">
            <!-- Product Image Gallery -->
            <div v-if="product.images && product.images.length > 0" class="w-full h-full flex items-center justify-center">
              <!-- Main Image -->
              <NuxtImg
                :src="currentImage"
                :alt="`${product.name[currentLocale] || product.name.hk} - Image ${currentImageIndex + 1}`"
                width="1200"
                height="1200"
                format="webp"
                quality="90"
                loading="eager"
                :key="currentImage"
                :preload="currentImageIndex === 0"
                sizes="xs:100vw sm:100vw md:70vw lg:70vw"
                @load="imageLoaded = true"
                class="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
                :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
                placeholder
              />

              <!-- Navigation Arrows (only show if multiple images) -->
              <template v-if="product.images.length > 1">
                <button
                  @click="previousImage"
                  class="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white border border-swiss-text/10 hover:border-swiss-text transition-all duration-200 group"
                  aria-label="Previous image"
                >
                  <span class="text-swiss-text/40 group-hover:text-swiss-text transition-colors text-xl">←</span>
                </button>
                <button
                  @click="nextImage"
                  class="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white border border-swiss-text/10 hover:border-swiss-text transition-all duration-200 group"
                  aria-label="Next image"
                >
                  <span class="text-swiss-text/40 group-hover:text-swiss-text transition-colors text-xl">→</span>
                </button>
              </template>

              <!-- Image Counter -->
              <div v-if="product.images.length > 1" class="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 border border-swiss-text/10">
                <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text">
                  {{ currentImageIndex + 1 }} / {{ product.images.length }}
                </span>
              </div>

              <!-- Thumbnail Dots -->
              <div v-if="product.images.length > 1" class="absolute bottom-12 left-12 flex items-center gap-2">
                <button
                  v-for="(img, index) in product.images"
                  :key="index"
                  @click="setCurrentImage(index)"
                  class="w-2 h-2 rounded-full transition-all duration-200"
                  :class="currentImageIndex === index ? 'bg-swiss-text scale-125' : 'bg-swiss-text/20 hover:bg-swiss-text/40'"
                  :aria-label="`View image ${index + 1}`"
                />
              </div>
            </div>

            <!-- Fallback placeholder -->
            <div
              v-else
              class="w-2/3 h-2/3 border border-swiss-text/5 bg-swiss-bg flex items-center justify-center shadow-2xl"
            >
              <div class="w-1/2 h-1/2 bg-swiss-text opacity-5"></div>
            </div>

            <!-- Meta Labels -->
            <div class="absolute top-12 left-12 flex flex-col gap-2">
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-swiss-text"
                >Model: {{ product.slug }}</span
              >
              <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-swiss-text/40"
                >Cat: {{ getCategoryLabel(product.category) }}</span
              >
            </div>

            <div v-if="product.featured" class="absolute bottom-12 right-12">
              <span
                class="text-[10px] font-black tracking-widest uppercase border border-swiss-text px-4 py-1"
                >Limited Edition Range</span
              >
            </div>
          </div>
        </div>

        <!-- Product Info (Right) -->
        <div
          class="col-span-12 lg:col-span-5 border-r border-b border-gray-100 p-12 md:p-20 flex flex-col justify-between"
        >
          <div>
            <div
              class="inline-block mb-12 text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono"
            >
              Technical Specification / 01
            </div>
            <TypographyHeader :level="1" size="h1" class="mb-8">
              {{ product.name[currentLocale] || product.name.hk }}
            </TypographyHeader>
            <p class="text-swiss-text-muted text-lg leading-relaxed font-medium mb-16">
              {{
                product.description[currentLocale] ||
                product.description.hk
              }}
            </p>

            <!-- Actions -->
            <div class="flex flex-col gap-4">
              <SwissButton
                variant="primary"
                size="lg"
                class="!py-6"
                aria-label="Request a technical consultation for this product"
              >
                REQUEST_CONSULTATION
              </SwissButton>
              <SwissButton
                variant="ghost"
                size="lg"
                class="!py-6"
                aria-label="Download technical datasheet PDF"
              >
                DOWNLOAD_DATASHEET
              </SwissButton>
            </div>
          </div>

          <!-- Bottom Summary -->
          <div class="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
            <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text/40"
              >Status: Available</span
            >
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
const imageLoaded = ref(false)

const currentLocale = computed(() => {
  if (locale.value === 'zh-HK') return 'hk'
  if (locale.value === 'zh-CN') return 'cn'
  return 'en'
})

// 图片画廊状态
const currentImageIndex = ref(0)

// 当前显示的图片
const currentImage = computed(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    return ''
  }
  return product.value.images[currentImageIndex.value]
})

// 切换到下一张图片
function nextImage() {
  if (!product.value?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
  imageLoaded.value = false
}

// 切换到上一张图片
function previousImage() {
  if (!product.value?.images) return
  currentImageIndex.value = currentImageIndex.value === 0
    ? product.value.images.length - 1
    : currentImageIndex.value - 1
  imageLoaded.value = false
}

// 设置当前图片
function setCurrentImage(index: number) {
  if (!product.value?.images || index < 0 || index >= product.value.images.length) return
  currentImageIndex.value = index
  imageLoaded.value = false
}

// 键盘导航
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!product.value?.images || product.value.images.length <= 1) return

    if (e.key === 'ArrowLeft') {
      previousImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    }
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

// 使用 useLazyFetch 确保加载动画可见
const {
  data: apiProduct,
  pending,
  error,
} = useLazyFetch<Product>(`/api/products/${route.params.slug}`, {
  default: () => null as any,
})

// 直接使用 API 返回的产品数据
const product = computed(() => {
  if (error.value) {
    console.error('[Product Detail] API Error:', error.value)
  }
  return apiProduct.value
})

// 当产品数据加载完成时，重置图片索引
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
  }
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

// Set page title, structured data, and canonical
watchEffect(() => {
  if (product.value) {
    const langKey = locale.value === 'zh-HK' ? 'hk' : locale.value === 'zh-CN' ? 'cn' : 'en'
    const baseUrl = 'https://www.supercore.hk'
    const currentPath = route.path
    const canonicalUrl =
      locale.value === 'en'
        ? `${baseUrl}${currentPath}`
        : `${baseUrl}/${locale.value}${currentPath}`

    // 生成產品結構化數據
    const structuredData = useProductStructuredData(product.value, locale.value)

    // 生成麵包屑結構化數據
    const breadcrumbStructuredData = useBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.value.name[langKey] || product.value.name['hk'], url: currentPath },
    ])

    useHead({
      title: `${product.value.name[langKey] || product.value.name['hk']} - 超核技術有限公司`,
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbStructuredData),
        },
      ],
    })
  }
})
</script>
