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
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UFormGroup label="標題" required class="flex-1">
                                <UTabs :items="langTabs">
                                    <template #item="{ item }">
                                        <UInput v-model="form.title[item.key]" :placeholder="`輸入 ${item.label} 標題`"
                                            class="mt-2" />
                                    </template>
                                </UTabs>
                            </UFormGroup>

                            <UFormGroup label="URL Slug (唯一標識)" required>
                                <UInput v-model="form.slug" placeholder="industry-news-title" class="mt-2" />
                                <p class="text-xs text-gray-400 mt-1">用於網址，例如：/news/industry-news-title</p>
                            </UFormGroup>
                        </div>

                        <UFormGroup label="摘要" required>
                            <UTabs :items="langTabs">
                                <template #item="{ item }">
                                    <UTextarea v-model="form.summary[item.key]" :placeholder="`輸入 ${item.label} 摘要`"
                                        class="mt-2" :rows="3" />
                                </template>
                            </UTabs>
                        </UFormGroup>

                        <UFormGroup label="正文 (Markdown)" required>
                            <UTabs :items="langTabs">
                                <template #item="{ item }">
                                    <UTextarea v-model="form.content[item.key]"
                                        :placeholder="`輸入 ${item.label} 正文內容...`" class="mt-2" :rows="12" />
                                </template>
                            </UTabs>
                        </UFormGroup>

                        <UFormGroup label="封面圖片">
                            <div class="space-y-3">
                                <!-- 图片预览 -->
                                <div v-if="form.cover_image" class="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                    <img :src="form.cover_image" alt="封面圖片預覽" class="w-full h-full object-cover" />
                                    <UButton
                                        icon="i-heroicons-x-mark"
                                        size="sm"
                                        color="red"
                                        variant="solid"
                                        class="absolute top-2 right-2"
                                        @click="form.cover_image = ''"
                                    >
                                        移除
                                    </UButton>
                                </div>

                                <!-- 上传区域 -->
                                <div
                                    v-else
                                    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                                    :class="{ 'pointer-events-none opacity-50': uploading }"
                                >
                                    <input
                                        ref="fileInput"
                                        type="file"
                                        accept="image/*"
                                        class="hidden"
                                        @change="handleFileSelect"
                                    />
                                    <UIcon
                                        name="i-heroicons-photo"
                                        class="mx-auto h-12 w-12 text-gray-400"
                                    />
                                    <div class="mt-2">
                                        <UButton
                                            variant="ghost"
                                            color="gray"
                                            @click="fileInput?.click()"
                                            :disabled="uploading"
                                        >
                                            {{ uploading ? '上傳中...' : '選擇圖片' }}
                                        </UButton>
                                        <p class="text-xs text-gray-500 mt-2">或拖拽圖片到此處上傳</p>
                                        <p class="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，最大 5MB</p>
                                    </div>
                                </div>

                                <!-- 或手动输入URL -->
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-500">或輸入 URL：</span>
                                    <UInput
                                        v-model="form.cover_image"
                                        placeholder="https://example.com/image.jpg"
                                        class="flex-1"
                                    />
                                </div>
                            </div>
                        </UFormGroup>

                        <UFormGroup label="標籤 (Tags, 逗號分隔)">
                            <UInput v-model="tagsInput" placeholder="AI, Infrastructure" />
                        </UFormGroup>

                        <UFormGroup label="發佈時間">
                            <UInput type="datetime-local" v-model="publishedAtLocal" />
                        </UFormGroup>
                    </div>
                </UCard>

                <div
                    class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-gray-200 p-4 md:pl-72 z-40">
                    <div class="max-w-4xl mx-auto flex justify-end space-x-4">
                        <UButton variant="ghost" color="gray" to="/admin/news">取消</UButton>
                        <UButton type="submit" color="black" :loading="saving" :disabled="uploading">保存資訊</UButton>
                    </div>
                </div>
            </form>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">

const route = useRoute()
const client = useSupabaseClient()
const isNew = computed(() => route.params.id === 'new')
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement>()

// 调试日志
console.log('[News Edit] Page mounting:', {
    path: route.path,
    params: route.params,
    isNew: isNew.value
})

const langTabs = [
    { key: 'hk', label: '繁體 (HK)' },
    { key: 'cn', label: '簡體 (CN)' },
    { key: 'en', label: 'English' }
]

const form = ref({
    slug: '',
    title: { hk: '', cn: '', en: '' } as Record<string, string>,
    summary: { hk: '', cn: '', en: '' } as Record<string, string>,
    content: { hk: '', cn: '', en: '' } as Record<string, string>,
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
                summary: { ...form.value.summary, ...data.summary },
                content: { ...form.value.content, ...data.content },
            }
        }
    }
})

/**
 * 处理文件选择
 */
async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB')
        return
    }

    await uploadImage(file)
}

/**
 * 上传图片到服务器
 */
async function uploadImage(file: File) {
    uploading.value = true

    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await $fetch('/api/upload/post-cover', {
            method: 'POST',
            body: formData
        }) as any

        if (response.success) {
            form.value.cover_image = response.data.publicUrl
        } else {
            throw new Error('上传失败')
        }
    } catch (error: any) {
        console.error('上传图片失败:', error)
        const errorMessage = error.data?.statusMessage || error.message || '上传失败，请重试'
        alert(errorMessage)
    } finally {
        uploading.value = false
        // 清空文件输入，允许重复选择同一文件
        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }
}

/**
 * 保存文章（创建或更新）
 */
async function savePost() {
    saving.value = true

    try {
        const payload = { ...form.value }
        let response

        if (isNew.value) {
            // 创建新文章
            response = await $fetch('/api/news', {
                method: 'POST',
                body: payload
            })
        } else {
            // 更新现有文章
            response = await $fetch(`/api/news/${route.params.id}`, {
                method: 'PUT',
                body: payload
            })
        }

        if (response.success) {
            navigateTo('/admin/news')
        }
    } catch (error: any) {
        console.error('保存失败:', error)
        const errorMessage = error.data?.statusMessage || error.message || '保存失敗，請重試'
        alert(errorMessage)
    } finally {
        saving.value = false
    }
}
</script>
