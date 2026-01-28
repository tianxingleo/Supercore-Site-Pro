<template>
  <div class="space-y-4">
    <!-- Images Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Existing Images -->
      <div v-for="(img, index) in modelValue" :key="index" class="relative group">
        <div class="h-full border border-swiss-text/10 rounded-lg overflow-hidden relative">
          <AdminImageUpload
            :model-value="img"
            @update:model-value="(url) => updateImage(index, url)"
            bucket-name="news-covers"
            class="h-full"
          />
        </div>
      </div>

      <!-- Add New Image Slot (Always visible at the end) -->
      <div class="relative h-full">
        <div class="h-full border-2 border-dashed border-swiss-text/10 rounded-lg overflow-hidden hover:border-swiss-text/30 transition-colors">
          <AdminImageUpload
            :key="modelValue.length"
            :model-value="newImagePlaceholder"
            @upload-success="onNewImageUpload"
            bucket-name="news-covers"
            class="h-full"
          />
          <!-- Overlay to indicate this is for "Adding" if needed -->
          <div v-if="!modelValue.length" class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <!-- Purely decorative or informative if you want -->
          </div>
        </div>
      </div>
    </div>

    <!-- Image Counter & Actions -->
    <div v-if="modelValue.length > 0" class="flex items-center justify-between pt-4 border-t border-swiss-text/5">
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-photo" class="w-4 h-4 text-swiss-text-muted" />
        <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
          已上傳 {{ modelValue.length }} 張圖片
        </span>
      </div>
      <button
        type="button"
        @click="clearAll"
        class="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
      >
        清空全部 GALLERY
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

import AdminImageUpload from './AdminImageUpload.vue'

const newImagePlaceholder = ref('')

function onNewImageUpload(url: string) {
  const newImages = [...props.modelValue, url]
  emit('update:modelValue', newImages)
  // The placeholder remains '' which keeps the "Add" slot as a drop zone
  newImagePlaceholder.value = ''
}

function updateImage(index: number, url: string) {
  if (!url) {
    removeImage(index)
    return
  }
  const newImages = [...props.modelValue]
  newImages[index] = url
  emit('update:modelValue', newImages)
}

function removeImage(index: number) {
  const newImages = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newImages)
}

function clearAll() {
  if (confirm('確定要清空所有圖片嗎？')) {
    emit('update:modelValue', [])
  }
}
</script>
