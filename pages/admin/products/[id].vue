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
            <div>
              <div class="font-bold text-swiss-text">規格參數 (Specs)</div>
              <div class="text-[10px] text-swiss-text-muted mt-0.5">拖拽左側 ≡ 手柄可調整行順序</div>
            </div>
            <button type="button" @click="addSpec"
              class="text-[10px] font-bold uppercase tracking-widest text-swiss-text hover:text-swiss-text-muted">
              + 添加
            </button>
          </div>
          <div class="p-6 md:p-8 space-y-2">
            <div
              v-for="(item, index) in specsItems"
              :key="item.id"
              class="flex items-center space-x-2 transition-opacity"
              :class="{ 'opacity-40': draggedIndex === index, 'ring-2 ring-swiss-text ring-inset': dragOverIndex === index && dragOverIndex !== draggedIndex }"
              draggable="true"
              @dragstart="onDragStart(index, $event)"
              @dragover.prevent="onDragOver(index, $event)"
              @drop.prevent="onDrop(index)"
              @dragend="onDragEnd"
            >
              <!-- Drag Handle -->
              <div class="cursor-grab active:cursor-grabbing px-1 py-3 text-swiss-text-muted hover:text-swiss-text select-none flex-shrink-0" title="拖拽排序">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </div>
              <input v-model="item.key"
                @blur="syncSpecs"
                placeholder="Key (如 CPU)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <input v-model="item.value"
                @blur="syncSpecs"
                placeholder="Value (如 2x AMD)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              <button type="button" @click="removeSpec(index)"
                class="px-3 py-3 text-swiss-text hover:text-red-500 transition-colors flex-shrink-0">
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
  specs: {} as Record<string, any>,
  images: [] as string[],
  model_3d_url: '',
  is_featured: false,
  status: 'draft',
})

// 用于编辑的规格参数数组
const specsItems = ref<Array<{ id: string; key: string; value: string }>>([])

// 拖拽状态
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// 初始化 specsItems —— 按 __order 中保存的顺序恢复
const initSpecsItems = () => {
  const specs = form.value.specs
  const orderArr = (specs.__order as unknown as string[]) || []
  // 先按照 __order 的顺序排列已有的 key
  const orderedKeys = orderArr.filter((k: string) => k in specs && k !== '__order')
  // 再追加不在 __order 中的 key（兼容旧数据）
  Object.keys(specs).filter(k => k !== '__order' && !orderedKeys.includes(k)).forEach(k => orderedKeys.push(k))

  specsItems.value = orderedKeys.map((key, index) => ({
    id: `spec_${index}_${Date.now()}`,
    key,
    value: specs[key] as string
  }))
}

// 同步 specsItems 到 form.specs，并写入 __order 保持顺序
const syncSpecs = () => {
  const newSpecs: Record<string, any> = {}
  const orderArr: string[] = []
  specsItems.value.forEach(item => {
    if (item.key) {
      newSpecs[item.key] = item.value
      orderArr.push(item.key)
    }
  })
  // 将顺序数组存入 specs 对象以便跨保存持久化
  newSpecs.__order = orderArr
  form.value.specs = newSpecs
}

// 拖拽排序处理
function onDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(index: number, _event: DragEvent) {
  dragOverIndex.value = index
}

function onDrop(index: number) {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  const items = [...specsItems.value]
  const [removed] = items.splice(draggedIndex.value, 1)
  items.splice(index, 0, removed)
  specsItems.value = items
  draggedIndex.value = null
  dragOverIndex.value = null
  syncSpecs()
}

function onDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
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
