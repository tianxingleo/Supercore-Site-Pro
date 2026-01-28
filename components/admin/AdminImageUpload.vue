<template>
    <div class="space-y-4">
        <!-- Image Preview Area -->
        <div v-if="modelValue || previewUrl"
            class="relative group rounded-lg overflow-hidden border border-swiss-text/10 aspect-video bg-swiss-bg-soft">
            <img :src="previewUrl || modelValue" alt="Preview" 
                @load="imageLoaded = true"
                class="w-full h-full object-cover transition-opacity duration-500 ease-in-out" 
                :class="imageLoaded ? 'opacity-100' : 'opacity-0'" />
            <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <UButton icon="i-heroicons-pencil-square" size="sm" color="white" variant="solid"
                    @click="triggerFileSelect">
                    {{ $t?.('admin.change_image') || '更換' }}
                </UButton>
                <UButton icon="i-heroicons-trash" size="sm" color="red" variant="solid" @click="removeImage">
                    {{ $t?.('admin.remove') || '移除' }}
                </UButton>
            </div>
            <!-- Processing Overlay -->
            <div v-if="uploading"
                class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-2">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
                <span class="text-xs font-bold uppercase tracking-widest">{{ uploadStatus }}</span>
            </div>
        </div>

        <!-- Drop Zone -->
        <div v-else class="relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center"
            :class="[
                dragActive
                    ? 'border-swiss-text bg-swiss-text/5 scale-[1.01]'
                    : 'border-swiss-text/20 hover:border-swiss-text/40 bg-swiss-bg',
                uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
            ]" @dragenter.prevent="dragActive = true" @dragover.prevent="dragActive = true"
            @dragleave.prevent="dragActive = false" @drop.prevent="handleDrop" @click="triggerFileSelect">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />

            <div v-if="!uploading" class="space-y-3">
                <div class="flex justify-center">
                    <div class="p-3 rounded-full bg-swiss-text/5">
                        <UIcon name="i-heroicons-photo" class="w-8 h-8 text-swiss-text-muted" />
                    </div>
                </div>
                <div>
                    <p class="text-sm font-medium text-swiss-text">
                        {{ $t?.('admin.upload_prompt') || '點擊或拖拽圖片到此處' }}
                    </p>
                    <p class="text-xs text-swiss-text-muted mt-1">
                        {{ $t?.('admin.upload_hint') || '支持 JPG, PNG, WebP (自動壓縮)' }}
                    </p>
                </div>
            </div>

            <div v-else class="space-y-3 py-4">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto text-swiss-text-muted" />
                <p class="text-xs font-bold uppercase tracking-widest text-swiss-text-muted">
                    {{ uploadStatus }}
                </p>
            </div>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-xs text-red-500 font-medium">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue?: string
    bucketName?: string
    uploadEndpoint?: string
    maxSizeMB?: number
    maxWidth?: number
}>()

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragActive = ref(false)
const previewUrl = ref('')
const error = ref('')
const uploadStatus = ref('')
const imageLoaded = ref(false)

const config = {
    maxSizeMB: props.maxSizeMB || 2,
    maxWidth: props.maxWidth || 1920,
    endpoint: props.uploadEndpoint || '/api/upload/image'
}

function triggerFileSelect() {
    fileInput.value?.click()
}

function removeImage() {
    emit('update:modelValue', '')
    previewUrl.value = ''
    if (fileInput.value) fileInput.value.value = ''
}

async function handleDrop(e: DragEvent) {
    dragActive.value = false
    const file = e.dataTransfer?.files[0]
    if (file) await processAndUpload(file)
}

async function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) await processAndUpload(file)
}

async function processAndUpload(file: File) {
    if (!file.type.startsWith('image/')) {
        error.value = '請選擇有效的圖片文件'
        return
    }

    error.value = ''
    uploading.value = true
    uploadStatus.value = '正在讀取...'

    try {
        // 1. Create a local preview immediately
        previewUrl.value = URL.createObjectURL(file)

        // 2. Compress the image
        uploadStatus.value = '正在壓縮...'
        const compressedBlob = await compressImage(file)

        // 3. Upload
        uploadStatus.value = '正在上傳...'
        const formData = new FormData()
        // Append the blob as a file
        formData.append('file', compressedBlob, file.name)
        if (props.bucketName) {
            formData.append('bucket', props.bucketName)
        }

        const response = (await $fetch(config.endpoint, {
            method: 'POST',
            body: formData,
        })) as any

        if (response.success) {
            const newUrl = response.data.publicUrl
            emit('update:modelValue', newUrl)
            emit('upload-success', newUrl)
            uploadStatus.value = '完成'
        } else {
            throw new Error(response.statusMessage || '上傳失敗')
        }
    } catch (err: any) {
        console.error('[ImageUpload] Error:', err)
        error.value = err.message || '上傳出錯，請重試'
        emit('upload-error', err)
        // Clear preview on error if there was no previous image
        if (!props.modelValue) previewUrl.value = ''
    } finally {
        uploading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Calculate aspect ratio and new dimensions
                if (width > config.maxWidth) {
                    height = Math.round((height * config.maxWidth) / width)
                    width = config.maxWidth
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)

                // Quality adjustment based on original size
                let quality = 0.8
                if (file.size > 2 * 1024 * 1024) quality = 0.7
                if (file.size > 5 * 1024 * 1024) quality = 0.6

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            console.log(`Original: ${(file.size / 1024).toFixed(1)}KB, Compressed: ${(blob.size / 1024).toFixed(1)}KB`)
                            resolve(blob)
                        } else {
                            reject(new Error('Blob creation failed'))
                        }
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = () => reject(new Error('Image load failed'))
        }
        reader.onerror = () => reject(new Error('File read failed'))
    })
}
</script>
