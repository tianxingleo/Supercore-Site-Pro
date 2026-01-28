<template>
  <NuxtLayout name="admin">
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

      <form @submit.prevent="saveProduct" class="space-y-8 pb-24">
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
            <div v-for="(val, key, index) in form.specs" :key="index" class="flex items-center space-x-2">
              <input :model-value="key" @input="updateSpecKey(key, ($event.target as HTMLInputElement).value)"
                placeholder="Key (如 CPU)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <input :model-value="val" @input="form.specs[key] = ($event.target as HTMLInputElement).value"
                placeholder="Value (如 2x AMD)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <button type="button" @click="removeSpec(key)"
                class="px-3 py-3 text-swiss-text hover:text-red-500 transition-colors">
                ✕
              </button>
            </div>
            <div v-if="Object.keys(form.specs).length === 0"
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
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)

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


onMounted(async () => {
  if (!isNew.value) {
    try {
      const data = await $fetch(`/api/products/admin/${route.params.id}`)
      if (data) {
        // Merge with default ensuring all keys exist
        form.value = {
          ...form.value,
          ...data,
          name: { ...form.value.name, ...data.name },
          description: { ...form.value.description, ...data.description },
          specs: data.specs || {},
        }
      }
    } catch (e: any) {
      alert('加載產品失敗: ' + e.message)
      navigateTo('/admin/products')
    }
  }
})

function addSpec() {
  form.value.specs['new_key_' + Object.keys(form.value.specs).length] = ''
}

function updateSpecKey(oldKey: string, newKey: string) {
  if (oldKey === newKey) return
  const value = form.value.specs[oldKey]
  delete form.value.specs[oldKey]
  form.value.specs[newKey] = value
}

function removeSpec(key: string) {
  delete form.value.specs[key]
}

async function saveProduct() {
  saving.value = true
  try {
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
