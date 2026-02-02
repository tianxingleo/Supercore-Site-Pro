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
            v-for="(product, index) in products"
            :key="product.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 product-card-item opacity-0 translate-y-8"
          >
            <ProductCard :product="product" class="!border-none" />
          </div>
        </template>

        <!-- No Data State -->
        <template v-else>
          <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
            <p class="text-swiss-secondary uppercase tracking-widest text-sm">暂無產品數據</p>
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

console.log('[Products] Page mounting...')

// 使用 useLazyFetch 获取产品数据
const { data: products, pending } = useLazyFetch<Product[]>('/api/products/public', {
  default: () => []
})

console.log('[Products] Page mounted, data:', products.value, 'pending:', pending.value)

const { t } = useI18n()

useHead({
  title: computed(() => `${t('products.title')} - Supercore`),
})

// 添加动画逻辑
const nuxtApp = useNuxtApp()
const { $gsap, $ScrollTrigger } = nuxtApp as any

// 动画初始化函数
const initAnimation = () => {
  // 使用 nextTick 等待 DOM 更新完成
  nextTick(() => {
    // 再等待一下，确保子组件也渲染完成
    setTimeout(() => {
      console.log('[Products] Checking GSAP and DOM...')

      if ($gsap && $ScrollTrigger && process.client) {
        const cards = document.querySelectorAll('.product-card-item')
        console.log('[Products] Found cards:', cards.length)

        if (cards.length > 0) {
          console.log('[Products] Starting GSAP animation...')
          $ScrollTrigger.batch('.product-card-item', {
            onEnter: (batch: any) => {
              console.log('[Products] GSAP onEnter fired for batch:', batch.length)
              $gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: true
              })
            },
            start: 'top 90%',
            once: true
          })
          $ScrollTrigger.refresh()
          console.log('[Products] Animation triggered successfully!')
        } else {
          console.warn('[Products] No cards found in DOM')
        }
      }
    }, 100)
  })
}

// 使用 onMounted 确保组件已挂载到 DOM
onMounted(() => {
  console.log('[Products] onMounted triggered')
  initAnimation()
})

// 监听数据变化，确保数据加载后执行动画
watch(products, (newVal) => {
  if (newVal && newVal.length > 0) {
    console.log('[Products] Data loaded, re-initializing animation...')
    initAnimation()
  }
})
</script>
