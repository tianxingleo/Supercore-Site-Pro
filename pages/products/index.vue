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

    <!-- Filter Section -->
    <section v-if="!pending && rawProducts && rawProducts.length > 0" class="mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12">
          <div class="flex flex-wrap gap-2 md:gap-4">
            <SwissButton v-for="cat in categoryList" :key="cat.id"
              :variant="activeCategory === cat.id ? 'primary' : 'ghost'" size="sm" class="!text-[10px] !px-6 !py-2.5"
              @click="activeCategory = cat.id">
              {{ cat.name }}
            </SwissButton>
          </div>
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
          <div v-for="(product, index) in products" :key="product.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 product-card-item opacity-0 translate-y-8">
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

const { t } = useI18n()

// 选中的分类
const activeCategory = ref('all')

// 使用 useLazyFetch 获取产品所有数据
const { data: rawProducts, pending } = useLazyFetch<Product[]>('/api/products/public', {
  default: () => []
})

// 计算可选分类列表
const categoryList = computed(() => {
  const list = [
    { id: 'all', name: t('solutions.categories.all') || '全部' },
    { id: 'server', name: t('products.categories.serverProducts.title') || '伺服器產品' },
    { id: 'storage', name: '儲存產品' },
    { id: 'network', name: t('products.categories.network.title') || '網絡產品' },
    { id: 'hpc', name: t('products.categories.hpc.title') || '高性能計算' }
  ]

  if (!rawProducts.value?.length) return list

  // 过滤掉没有产品的分类，同时合并 storage 和 storage-hp
  const activeIds = new Set<string>((rawProducts.value || []).map(p => {
    if (p.category === 'storage-hp') return 'storage'
    return p.category
  }))

  return list.filter(cat => cat.id === 'all' || activeIds.has(cat.id))
})

// 根据选中的分类过滤产品
const products = computed(() => {
  const currentCategory = activeCategory.value
  if (currentCategory === 'all') return rawProducts.value || []
  return (rawProducts.value || []).filter((p: Product) => {
    if (currentCategory === 'storage') {
      return p.category === 'storage' || p.category === 'storage-hp'
    }
    return (p.category as string) === currentCategory
  })
})

console.log('[Products] Page mounted, data:', rawProducts.value, 'pending:', pending.value)

useHead({
  title: computed(() => `${t('products.title')} - XX`),
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
        // 清除之前的 ScrollTrigger
        const oldTriggers = $ScrollTrigger.getAll()
        oldTriggers.forEach((st: any) => {
          if (st.vars && st.vars.trigger === '.product-card-item') {
            st.kill()
          }
        })

        const cards = document.querySelectorAll('.product-card-item')
        console.log('[Products] Found cards:', cards.length)

        if (cards.length > 0) {
          console.log('[Products] Starting GSAP animation...')
          // 重置卡片初始状态
          $gsap.set(cards, { opacity: 0, y: 30 })

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

// 监听分类切换
watch(activeCategory, () => {
  console.log('[Products] Category changed to:', activeCategory.value)
  initAnimation()
})

// 监听原始数据变化
watch(rawProducts, (newVal) => {
  if (newVal && newVal.length > 0) {
    console.log('[Products] Data loaded, re-initializing animation...')
    initAnimation()
  }
})
</script>
