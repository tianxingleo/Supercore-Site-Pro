<template>
    <NuxtLayout name="admin">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="flex items-center space-x-4">
                <UButton icon="i-heroicons-arrow-left" variant="ghost" color="gray" to="/admin/news" />
                <h2 class="text-2xl font-bold tracking-tight">{{ isNew ? '發佈資訊' : '編輯資訊' }}</h2>
            </div>

            <form @submit.prevent="savePost" class="space-y-6 pb-24">
                <UCard>
                    <div class="space-y-6">
                        <UFormGroup label="標題" required>
                            <UTabs :items="langTabs">
                                <template #item="{ item }">
                                    <UInput v-model="form.title[item.key]" :placeholder="`輸入 ${item.label} 標題`"
                                        class="mt-2" />
                                </template>
                            </UTabs>
                        </UFormGroup>

                        <UFormGroup label="正文 (Markdown)" required>
                            <UTabs :items="langTabs">
                                <template #item="{ item }">
                                    <UTextarea v-model="form.content[item.key]"
                                        :placeholder="`輸入 ${item.label} 正文內容...`" class="mt-2" rows="12" />
                                </template>
                            </UTabs>
                        </UFormGroup>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UFormGroup label="封面圖片 URL">
                                <UInput v-model="form.cover_image" placeholder="/images/news-cover.jpg" />
                            </UFormGroup>

                            <UFormGroup label="標籤 (Tags, 逗號分隔)">
                                <UInput v-model="tagsInput" placeholder="AI, Infrastructure" />
                            </UFormGroup>
                        </div>

                        <UFormGroup label="發佈時間">
                            <UInput type="datetime-local" v-model="publishedAtLocal" />
                        </UFormGroup>
                    </div>
                </UCard>

                <div
                    class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 p-4 md:pl-72 z-40">
                    <div class="max-w-4xl mx-auto flex justify-end space-x-4">
                        <UButton variant="ghost" color="gray" to="/admin/news">取消</UButton>
                        <UButton type="submit" color="black" :loading="saving">保存資訊</UButton>
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
    title: { hk: '', cn: '', en: '' },
    content: { hk: '', cn: '', en: '' },
    cover_image: '',
    tags: [] as string[],
    published_at: null as string | null
})

const tagsInput = computed({
    get: () => form.value.tags.join(', '),
    set: (val: string) => {
        form.value.tags = val.split(',').map(t => t.trim()).filter(t => t)
    }
})

const publishedAtLocal = computed({
    get: () => form.value.published_at ? new Date(form.value.published_at).toISOString().slice(0, 16) : '',
    set: (val: string) => {
        form.value.published_at = val ? new Date(val).toISOString() : null
    }
})

onMounted(async () => {
    if (!isNew.value) {
        const { data } = await client.from('posts').select('*').eq('id', route.params.id).single()
        if (data) {
            form.value = {
                ...form.value,
                ...data,
                title: { ...form.value.title, ...data.title },
                content: { ...form.value.content, ...data.content },
            }
        }
    }
})

async function savePost() {
    saving.value = true
    try {
        const payload = { ...form.value }
        let error

        if (isNew.value) {
            const { error: err } = await client.from('posts').insert(payload)
            error = err
        } else {
            const { error: err } = await client.from('posts').update(payload).eq('id', route.params.id)
            error = err
        }

        if (error) throw error
        navigateTo('/admin/news')
    } catch (e: any) {
        alert('保存失敗: ' + e.message)
    } finally {
        saving.value = false
    }
}
</script>
