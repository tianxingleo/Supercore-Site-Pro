<template>
    <NuxtLayout name="admin">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="flex items-center space-x-4">
                <UButton icon="i-heroicons-arrow-left" variant="ghost" color="gray" to="/admin/products" />
                <h2 class="text-2xl font-bold tracking-tight">{{ isNew ? '新增產品' : '編輯產品' }}</h2>
            </div>

            <form @submit.prevent="saveProduct" class="space-y-6 pb-24">
                <!-- Basic Info Card -->
                <UCard>
                    <template #header>
                        <div class="font-bold">基本信息</div>
                    </template>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UFormGroup label="URL 標識 (Slug)" required help="用於網址鏈接，如 nexus-g2-server">
                            <UInput v-model="form.slug" placeholder="nexus-g2-server" />
                        </UFormGroup>

                        <UFormGroup label="分類" required>
                            <USelect v-model="form.category" :options="['server', 'storage', 'network']" />
                        </UFormGroup>

                        <div class="md:col-span-2">
                            <UFormGroup label="多語言名稱" required>
                                <UTabs :items="langTabs">
                                    <template #item="{ item }">
                                        <UInput v-model="form.name[item.key]" :placeholder="`輸入 ${item.label} 名稱`"
                                            class="mt-2" />
                                    </template>
                                </UTabs>
                            </UFormGroup>
                        </div>

                        <div class="md:col-span-2">
                            <UFormGroup label="多語言描述" required>
                                <UTabs :items="langTabs">
                                    <template #item="{ item }">
                                        <UTextarea v-model="form.description[item.key]"
                                            :placeholder="`輸入 ${item.label} 描述`" class="mt-2" rows="4" />
                                    </template>
                                </UTabs>
                            </UFormGroup>
                        </div>
                    </div>
                </UCard>

                <!-- Media Card -->
                <UCard>
                    <template #header>
                        <div class="font-bold">媒體與 3D</div>
                    </template>

                    <div class="space-y-6">
                        <UFormGroup label="圖片路徑 (JSON 數組)" help="暫時使用公共路徑，未來可用 Storage 上傳">
                            <UInput v-model="imagesInput" placeholder='["/images/server.png"]' />
                        </UFormGroup>

                        <UFormGroup label="3D 模型 URL (Spline/GLB)">
                            <UInput v-model="form.model_3d_url" placeholder="https://prod.spline.design/..." />
                        </UFormGroup>

                        <div class="flex items-center space-x-4">
                            <UCheckbox v-model="form.is_featured" label="首頁推薦" />
                            <USelect v-model="form.status" :options="['draft', 'published', 'archived']" class="w-32" />
                        </div>
                    </div>
                </UCard>

                <!-- Specs Card -->
                <UCard>
                    <template #header>
                        <div class="font-bold text-gray-900 flex justify-between items-center">
                            <span>規格參數 (Specs)</span>
                            <UButton icon="i-heroicons-plus" size="xs" variant="ghost" @click="addSpec">添加</UButton>
                        </div>
                    </template>

                    <div class="space-y-3">
                        <div v-for="(val, key, index) in form.specs" :key="index" class="flex items-center space-x-2">
                            <UInput :model-value="key" @update:model-value="updateSpecKey(key, $event)"
                                placeholder="Key (如 CPU)" class="flex-1" />
                            <UInput :model-value="val" @update:model-value="form.specs[key] = $event"
                                placeholder="Value (如 2x AMD)" class="flex-1" />
                            <UButton icon="i-heroicons-x-mark" color="red" variant="ghost" size="xs"
                                @click="removeSpec(key)" />
                        </div>
                        <div v-if="Object.keys(form.specs).length === 0" class="text-center text-gray-400 text-sm py-4">
                            點擊右上角添加規格
                        </div>
                    </div>
                </UCard>

                <!-- Sticky Footer -->
                <div
                    class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 p-4 md:pl-72 z-40">
                    <div class="max-w-4xl mx-auto flex justify-end space-x-4">
                        <UButton variant="ghost" color="gray" to="/admin/products">取消</UButton>
                        <UButton type="submit" color="black" :loading="saving">保存更改</UButton>
                    </div>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})

const route = useRoute()
const client = useSupabaseClient()
const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)

const langTabs = [
    { key: 'hk', label: '繁體 (HK)' },
    { key: 'cn', label: '簡體 (CN)' },
    { key: 'en', label: 'English' }
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
    status: 'draft'
})

const imagesInput = computed({
    get: () => JSON.stringify(form.value.images),
    set: (val: string) => {
        try {
            form.value.images = JSON.parse(val)
        } catch (e) { }
    }
})

onMounted(async () => {
    if (!isNew.value) {
        const { data } = await client.from('products').select('*').eq('id', route.params.id).single()
        if (data) {
            // Merge with default ensuring all keys exist
            form.value = {
                ...form.value,
                ...data,
                name: { ...form.value.name, ...data.name },
                description: { ...form.value.description, ...data.description },
                specs: data.specs || {}
            }
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
        let error

        if (isNew.value) {
            const { error: err } = await client.from('products').insert(payload)
            error = err
        } else {
            const { error: err } = await client.from('products').update(payload).eq('id', route.params.id)
            error = err
        }

        if (error) throw error
        navigateTo('/admin/products')
    } catch (e: any) {
        alert('保存失敗: ' + e.message)
    } finally {
        saving.value = false
    }
}
</script>
