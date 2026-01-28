<template>
  <div class="min-h-screen bg-white p-8">
    <TypographyHeader :level="1" size="h1" class="mb-8"> 数据源诊断 </TypographyHeader>

    <div class="space-y-8 max-w-4xl">
      <!-- API 状态 -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">API 端点状态</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-medium">Products API</span>
            <span
              :class="[
                apiStatus.products ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'px-3 py-1 rounded-full text-sm font-medium',
              ]"
            >
              {{ apiStatus.products ? '✅ 正常' : '❌ 失败' }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="font-medium">API 返回数据</span>
            <span class="text-gray-600 text-sm"> {{ apiProducts.length }} 条记录 </span>
          </div>
        </div>
      </div>

      <!-- Mock 数据 -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Mock 数据</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-medium">Mock 数据可用</span>
            <span class="text-gray-600 text-sm"> {{ mockProducts.length }} 条记录 </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="font-medium">当前使用数据源</span>
            <span
              :class="[
                dataSource === 'api'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800',
                'px-3 py-1 rounded-full text-sm font-medium',
              ]"
            >
              {{ dataSource === 'api' ? 'API' : 'Mock 数据' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 页面状态 -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">页面状态</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="font-medium">加载状态 (pending)</span>
            <span
              :class="[
                pending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800',
                'px-3 py-1 rounded-full text-sm font-medium',
              ]"
            >
              {{ pending ? '加载中' : '已完成' }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="font-medium">错误状态 (error)</span>
            <span
              :class="[
                error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800',
                'px-3 py-1 rounded-full text-sm font-medium',
              ]"
            >
              {{ error ? '有错误' : '无错误' }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="font-medium">显示的产品数</span>
            <span class="text-gray-600 text-sm"> {{ displayProducts.length }} 条 </span>
          </div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="bg-red-50 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4 text-red-800">错误详情</h2>
        <pre class="text-sm overflow-auto bg-white p-4 rounded">{{
          JSON.stringify(error, null, 2)
        }}</pre>
      </div>

      <!-- 产品列表预览 -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">产品列表预览 (前3条)</h2>

        <div v-if="displayProducts.length > 0" class="space-y-3">
          <div
            v-for="product in displayProducts.slice(0, 3)"
            :key="product.id"
            class="bg-white p-4 rounded border border-gray-200"
          >
            <div class="font-medium">
              {{ product.name?.en || product.name?.cn || product.name?.hk }}
            </div>
            <div class="text-sm text-gray-600">{{ product.slug }}</div>
          </div>
        </div>

        <div v-else class="text-gray-500">暂无产品数据</div>
      </div>

      <!-- 测试按钮 -->
      <div class="space-x-4">
        <SwissButton @click="refreshData" variant="primary"> 刷新数据 </SwissButton>
        <SwissButton @click="goToProducts" variant="secondary"> 前往产品页 </SwissButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
import { mockProducts } from '~/utils/mockData'

const route = useRoute()

// 获取 API 数据
const {
  data: apiProducts,
  pending,
  error,
} = useLazyFetch<Product[]>('/api/products/public', {
  transform: (data) => {
    if (!data || data.length === 0) return []
    return data
  },
  default: () => [],
})

// API 状态
const apiStatus = ref({
  products: false,
})

// 监听 API 数据变化
watch(
  apiProducts,
  (newData) => {
    apiStatus.value.products = newData && newData.length > 0
    console.log('[Debug] API Products:', newData)
  },
  { immediate: true }
)

// 监听错误
watch(error, (newError) => {
  if (newError) {
    console.error('[Debug] API Error:', newError)
  }
})

// 计算属性：当前使用的数据源
const dataSource = computed(() => {
  if (apiStatus.value.products && !error.value) {
    return 'api'
  }
  return 'mock'
})

// 计算属性：显示的产品
const displayProducts = computed(() => {
  if (dataSource.value === 'api') {
    return apiProducts.value
  }
  return mockProducts
})

// 刷新数据
function refreshData() {
  console.log('[Debug] Refreshing data...')
  window.location.reload()
}

// 前往产品页
function goToProducts() {
  navigateTo('/products')
}
</script>
