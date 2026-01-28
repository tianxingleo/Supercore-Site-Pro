<template>
  <NuxtLink :to="localePath(`/products/${product.slug}`)"
    class="group block bg-white border border-gray-100 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
    <!-- Product Image -->
    <div class="aspect-square bg-swiss-bg-soft relative overflow-hidden">
      <!-- Shimmer Placeholder -->
      <div v-if="product.images && product.images.length > 0 && !imageLoaded" class="shimmer absolute inset-0 z-10">
      </div>

      <NuxtImg v-if="product.images && product.images.length > 0" :src="product.images[0]"
        :alt="product.name[currentLocale] || product.name.hk" width="400" height="400" format="webp" quality="80" loading="lazy"
        sizes="xs:100vw sm:50vw md:33vw lg:25vw" @load="imageLoaded = true"
        class="w-full h-full object-contain group-hover:scale-105 transition-all duration-700 ease-in-out"
        :class="[imageLoaded ? 'opacity-100' : 'opacity-0']" placeholder />
      <div v-else class="absolute inset-0 flex items-center justify-center p-12">
        <!-- Fallback placeholder -->
        <div class="w-full h-full bg-swiss-text opacity-[0.03] group-hover:opacity-[0.05] transition-all duration-500">
        </div>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 left-4 z-20">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-swiss-text">
          {{ getCategoryLabel(product.category) }}
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="product.featured" class="absolute top-4 right-4 z-20">
        <span class="px-3 py-1 bg-swiss-text text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
          {{ $t('products.featured') }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <TypographyHeader :level="3" size="h4" class="mb-2 group-hover:text-swiss-accent transition-colors">
        {{ product.name[currentLocale] || product.name.hk }}
      </TypographyHeader>
      <p class="text-swiss-secondary text-sm line-clamp-2 mb-4">
        {{ product.description[currentLocale] || product.description.hk }}
      </p>

      <!-- Key Specs Preview -->
      <div class="flex items-center justify-between text-xs text-swiss-secondary">
        <span v-if="product.specs.cpu">{{ product.specs.cpu }}</span>
        <span v-if="product.specs.rackUnits">{{ product.specs.rackUnits }}</span>
        <SwissButton variant="ghost" size="sm">
          {{ $t('products.viewDetails') }} →
        </SwissButton>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const localePath = useLocalePath()
const { locale } = useI18n()
const imageLoaded = ref(false)

const currentLocale = computed(() => {
  if (locale.value === 'zh-HK') return 'hk'
  if (locale.value === 'zh-CN') return 'cn'
  return 'en'
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
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.4) 45%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.4) 55%,
      rgba(255, 255, 255, 0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
