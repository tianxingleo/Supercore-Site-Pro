<template>
  <div class="min-h-screen bg-white">
    <!-- Back Navigation -->
    <div class="pt-24 border-b border-gray-100">
      <GridContainer>
        <div class="col-span-12 py-4">
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
      class="border-l border-gray-100"
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
          class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 bg-swiss-bg-soft relative flex flex-col items-stretch overflow-visible"
        >
          <!-- Technical Grid Background -->
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
               style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 32px 32px;"></div>

          <!-- Technical Watermark / Fill Empty Space -->
          <div class="absolute bottom-16 left-16 select-none pointer-events-none opacity-[0.02]">
            <span class="text-[8vw] font-black tracking-tighter uppercase leading-none text-swiss-text">
              Blueprint / {{ product.slug }}
            </span>
          </div>

          <div class="relative flex-1 min-h-[400px] lg:min-h-[600px] p-8 md:p-16 lg:p-20 flex items-center justify-center">
            <!-- Product Image -->
            <div v-if="product && product.images && product.images.length > 0" class="relative">
              <NuxtImg
                v-if="currentImage"
                ref="mainImageRef"
                :src="currentImage"
                :alt="product.name[locale] || product.name['zh-HK'] || product.name.en"
                width="1600"
                height="900"
                format="webp"
                quality="90"
                loading="eager"
                :key="currentImageIndex"
                :preload="currentImageIndex === 0"
                sizes="xs:100vw sm:100vw md:70vw lg:70vw"
                @load="handleImageLoad"
                @error="handleImageLoad"
                class="max-w-full max-h-full object-contain transition-all duration-700 ease-in-out"
                :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
              />
            </div>

            <div v-else class="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 24 24" class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="0.5">
                <rect x="2" y="2" width="20" height="20" />
                <path d="M2 2l20 20M22 2L2 22" />
              </svg>
            </div>

            <!-- Navigation Controls -->
            <template v-if="product && product.images && product.images.length > 1">
              <button
                @click="previousImage"
                class="absolute left-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 flex items-center justify-center bg-transparent group/btn z-10"
                aria-label="Previous image"
              >
                <div class="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-swiss-text/5 group-hover/btn:border-swiss-text transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-swiss-text/40 group-hover/btn:text-swiss-text transition-colors" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
              <button
                @click="nextImage"
                class="absolute right-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 flex items-center justify-center bg-transparent group/btn z-10"
                aria-label="Next image"
              >
                <div class="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-swiss-text/5 group-hover/btn:border-swiss-text transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-swiss-text/40 group-hover/btn:text-swiss-text transition-colors" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </button>
            </template>
          </div>

          <!-- Bottom Gallery Info Bar -->
          <div v-if="product.images && product.images.length > 1" class="border-t border-swiss-text/5 p-6 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <button
                v-for="(img, index) in product.images"
                :key="index"
                @click="setCurrentImage(index)"
                class="h-1 transition-all duration-500 ease-out"
                :class="currentImageIndex === index ? 'w-12 bg-swiss-text' : 'w-4 bg-swiss-text/10 hover:bg-swiss-text/30'"
                :aria-label="`View image ${index + 1}`"
              />
            </div>
            <div class="font-mono text-[10px] uppercase tracking-widest text-swiss-text/40">
              FRAME_{{ String(currentImageIndex + 1).padStart(2, '0') }} / {{ String(product.images.length).padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- Product Info (Right) -->
        <div
          class="col-span-12 lg:col-span-5 border-r border-b border-gray-100 p-8 md:p-12 lg:p-16 flex flex-col justify-between h-full bg-white"
        >
          <div class="space-y-8">
            <SwissTextReveal tag="div" :delay="100">
              <div
                class="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono"
              >
                TECHNICAL_SPEC // 01
              </div>
            </SwissTextReveal>

            <SwissTextReveal tag="div" :delay="200">
              <TypographyHeader :level="1" size="h1" class="!mb-4 !tracking-tighter">
                {{ product.name[locale] || product.name['zh-HK'] || product.name.en }}
              </TypographyHeader>
            </SwissTextReveal>

            <SwissTextReveal tag="div" :delay="300">
              <p class="text-swiss-text-muted text-lg leading-relaxed font-medium">
                {{
                  product.description[locale] ||
                  product.description['zh-HK'] ||
                  product.description.en
                }}
              </p>
            </SwissTextReveal>

            <!-- Product Metadata List -->
            <div class="border-t border-swiss-text/5 pt-10 space-y-8">
              <SwissTextReveal tag="div" :delay="400">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/20 font-mono">Model_Ref</span>
                  <span class="text-2xl md:text-3xl font-black tracking-tighter text-swiss-text uppercase leading-none">{{ product.slug }}</span>
                </div>
              </SwissTextReveal>

              <SwissTextReveal tag="div" :delay="500">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/20 font-mono">Category_Id</span>
                  <span class="text-2xl md:text-3xl font-black tracking-tighter text-swiss-text uppercase leading-none">{{ getCategoryLabel(product.category) }}</span>
                </div>
              </SwissTextReveal>
            </div>
          </div>

          <div class="pt-12 border-t border-gray-100 flex justify-between items-end">
            <div class="flex flex-col gap-2">
              <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text/40">Build_Status: Online</span>
              <span class="text-[10px] font-mono opacity-20 uppercase tracking-tighter px-2 py-0.5 bg-gray-50 border border-gray-200">UUID: {{ product.id }}</span>
            </div>
            <SwissButton variant="primary" size="lg" @click="navigateTo(localePath('/contact'))">
              GET_QUOTE
            </SwissButton>
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

const currentLocale = computed(() => locale.value)

// 图片画廊状态
const currentImageIndex = ref(0)

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

// 当前显示的图片
const currentImage = computed(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    return ''
  }
  return product.value.images[currentImageIndex.value]
})

// 图片加载处理
const mainImageRef = ref()
const handleImageLoad = () => {
  console.log('[Product Detail] Image load event triggered')
  imageLoaded.value = true
}

// 检查图片是否已经加载完成（处理缓存情况）
const checkImageComplete = () => {
  nextTick(() => {
    // NuxtImg 可能需要通过 $el 访问原生 img
    const imgElement = mainImageRef.value?.$el || mainImageRef.value
    if (imgElement && imgElement instanceof HTMLImageElement && imgElement.complete) {
      handleImageLoad()
    }
  })
}

// 切换到下一张图片
function nextImage() {
  if (!product.value?.images) return
  imageLoaded.value = false
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length
  checkImageComplete()
}

// 切换到上一张图片
function previousImage() {
  if (!product.value?.images) return
  imageLoaded.value = false
  currentImageIndex.value = currentImageIndex.value === 0
    ? product.value.images.length - 1
    : currentImageIndex.value - 1
  checkImageComplete()
}

// 设置当前图片
function setCurrentImage(index: number) {
  if (!product.value?.images || index < 0 || index >= product.value.images.length) return
  if (currentImageIndex.value === index) return
  imageLoaded.value = false
  currentImageIndex.value = index
  checkImageComplete()
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

  // 初始挂载后检查第一张图是否已加载
  checkImageComplete()

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

// 当产品数据加载完成时
watch(product, (newProduct) => {
  if (newProduct) {
    currentImageIndex.value = 0
    imageLoaded.value = false
    checkImageComplete()
  }
}, { immediate: true })

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
    const langKey = locale.value
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
      { name: product.value.name[langKey] || product.value.name['zh-HK'], url: currentPath },
    ])

    useHead({
      title: `${product.value.name[langKey as keyof typeof product.value.name] || product.value.name['zh-HK']} - Supercore`,
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
