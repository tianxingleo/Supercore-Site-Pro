<template>
  <div class="admin-page-container">
    <div class="max-w-4xl mx-auto space-y-12">

      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/products"
          class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
          ←
        </NuxtLink>
        <TypographyHeader :level="2" size="h3" class="!mb-0">
          {{ isNew ? '新增產品' : '編輯產品' }}
        </TypographyHeader>
      </div>

      <div v-if="loading" class="space-y-12">
        <FormSkeleton />
      </div>

      <form v-else @submit.prevent="saveProduct" class="space-y-8 pb-24">
        <!-- Basic Info Card -->
        <div class="bg-white border border-swiss-text/10">
          <div class="p-6 md:p-8 border-b border-swiss-text/10">
            <div class="font-bold text-swiss-text">基本信息</div>
          </div>
          <div class="p-6 md:p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  URL 標識 (Slug) *
                </label>
                <input v-model="form.slug" placeholder="supercore-g2-server"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                <p class="text-[10px] text-swiss-text-muted mt-1">
                  用於網址鏈接，如 supercore-g2-server
                </p>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  分類 *
                </label>
                <select v-model="form.category"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
                  <option value="server">Server</option>
                  <option value="storage">Storage</option>
                  <option value="network">Network</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  多語言名稱 *
                </label>
                <div class="space-y-2">
                  <div v-for="lang in langTabs" :key="lang.key">
                    <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                      lang.label
                    }}</label>
                    <input v-model="(form.name as any)[lang.key]" :placeholder="`輸入 ${lang.label} 名稱`"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  多語言描述 *
                </label>
                <div class="space-y-2">
                  <div v-for="lang in langTabs" :key="lang.key">
                    <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                      lang.label
                    }}</label>
                    <textarea v-model="(form.description as any)[lang.key]" :placeholder="`輸入 ${lang.label} 描述`" rows="4"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Card -->
        <div class="bg-white border border-swiss-text/10">
          <div class="p-6 md:p-8 border-b border-swiss-text/10">
            <div class="font-bold text-swiss-text">媒體與 3D</div>
          </div>
          <div class="p-6 md:p-8 space-y-6">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                產品圖片
              </label>
              <ProductGallery v-model="form.images" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                3D 模型 URL (Spline/GLB)
              </label>
              <input v-model="form.model_3d_url" placeholder="https://prod.spline.design/..."
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="form.is_featured" class="w-4 h-4" />
                <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text">首頁推薦</span>
              </label>
              <select v-model="form.status"
                class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Specs Card -->
        <div class="bg-white border border-swiss-text/10">
          <div class="p-6 md:p-8 border-b border-swiss-text/10 flex justify-between items-center">
            <div class="font-bold text-swiss-text">規格參數 (Specs)</div>
            <button type="button" @click="addSpec"
              class="text-[10px] font-bold uppercase tracking-widest text-swiss-text hover:text-swiss-text-muted">
              + 添加
            </button>
          </div>
          <div class="p-6 md:p-8 space-y-3">
            <div v-for="(item, index) in specsItems" :key="item.id" class="flex items-center space-x-2">
              <input v-model="item.key"
                @blur="syncSpecs"
                placeholder="Key (如 CPU)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <input v-model="item.value"
                @blur="syncSpecs"
                placeholder="Value (如 2x AMD)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <button type="button" @click="removeSpec(index)"
                class="px-3 py-3 text-swiss-text hover:text-red-500 transition-colors">
                ✕
              </button>
            </div>
            <div v-if="specsItems.length === 0"
              class="text-center text-swiss-text-muted text-[10px] uppercase tracking-widest py-4">
              點擊右上角添加規格
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div
          class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-swiss-text/10 p-4 md:pl-72 z-40">
          <div class="max-w-4xl mx-auto flex justify-end space-x-4">
            <NuxtLink to="/admin/products"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              取消
            </NuxtLink>
            <button type="submit" :disabled="saving"
              :class="saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg'"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-text text-white transition-all rounded-none">
              <span v-if="saving">保存中...</span>
              <span v-else>保存更改</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)
const loading = ref(false)

import FormSkeleton from '~/components/admin/FormSkeleton.vue'

const langTabs = [
  { key: 'hk', label: '繁體 (HK)' },
  { key: 'cn', label: '簡體 (CN)' },
  { key: 'en', label: 'English' },
]

const form = ref({
  slug: '',
  name: { hk: '', cn: '', en: '' },
  description: { hk: '', cn: '', en: '' },
  category: 'server',
  specs: {} as Record<string, string>,
  images: [] as string[],
  model_3d_url: '',
  is_featured: false,
  status: 'draft',
})

// 用于编辑的规格参数数组
const specsItems = ref<Array<{ id: string; key: string; value: string }>>([])

// 初始化 specsItems
const initSpecsItems = () => {
  specsItems.value = Object.keys(form.value.specs).map((key, index) => ({
    id: `spec_${index}_${Date.now()}`,
    key,
    value: form.value.specs[key]
  }))
}

// 同步 specsItems 到 form.specs
const syncSpecs = () => {
  const newSpecs: Record<string, string> = {}
  specsItems.value.forEach(item => {
    if (item.key) {
      newSpecs[item.key] = item.value
    }
  })
  form.value.specs = newSpecs
}


onMounted(async () => {
  if (!isNew.value) {
    loading.value = true
    try {
      const data = await $fetch(`/api/products/admin/${route.params.id}`) as any
      console.log('[Product Edit] Loaded product data:', JSON.stringify(data, null, 2))

      if (data) {
        // 确保 specs 字段存在，如果为 null 或 undefined 则设置为空对象
        const specs = data.specs || {}

        // Merge with default ensuring all keys exist
        form.value = {
          slug: data.slug || '',
          category: data.category || 'server',
          name: {
            hk: data.name?.hk || '',
            cn: data.name?.cn || '',
            en: data.name?.en || '',
          },
          description: {
            hk: data.description?.hk || '',
            cn: data.description?.cn || '',
            en: data.description?.en || '',
          },
          specs: specs,
          images: data.images || [],
          model_3d_url: data.model_3d_url || '',
          is_featured: data.featured || false,
          status: data.status || 'draft',
        }

        console.log('[Product Edit] Form initialized:', JSON.stringify(form.value, null, 2))
        console.log('[Product Edit] Specs keys:', Object.keys(form.value.specs))

        // 初始化 specsItems
        initSpecsItems()
      }
    } catch (e: any) {
      console.error('[Product Edit] Failed to load product:', e)
      alert('加載產品失敗: ' + e.message)
      navigateTo('/admin/products')
    } finally {
      loading.value = false
    }
  }
})

function addSpec() {
  specsItems.value.push({
    id: `spec_new_${Date.now()}`,
    key: '',
    value: ''
  })
}

function removeSpec(index: number) {
  specsItems.value.splice(index, 1)
  syncSpecs()
}

async function saveProduct() {
  saving.value = true
  try {
    // 在保存前同步 specs
    syncSpecs()

    const payload = { ...form.value }

    if (isNew.value) {
      // 创建新产品
      const response = await $fetch('/api/products', {
        method: 'POST',
        body: payload,
      })
      if (response.success) {
        navigateTo('/admin/products')
      }
    } else {
      // 更新产品
      const response = await $fetch(`/api/products/admin/${route.params.id}`, {
        method: 'PUT',
        body: payload,
      })
      if (response.success) {
        navigateTo('/admin/products')
      }
    }
  } catch (e: any) {
    alert(e.data?.statusMessage || e.message || '保存失敗，請重試')
  } finally {
    saving.value = false
  }
}
</script>
