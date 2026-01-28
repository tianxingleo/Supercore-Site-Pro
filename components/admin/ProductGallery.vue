<template>
    <div class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(img, index) in modelValue" :key="index" class="relative group">
                <AdminImageUpload v-model="modelValue[index]" bucket-name="products" class="h-full" />
                <UButton v-if="modelValue.length > 1" icon="i-heroicons-trash" size="2xs" color="red" variant="solid"
                    class="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    @click="removeImage(index)" />
            </div>

            <!-- Add New Image Slot -->
            <div class="border-2 border-dashed border-swiss-text/10 rounded-lg flex items-center justify-center aspect-video hover:border-swiss-text/30 cursor-pointer transition-colors"
                @click="addImage">
                <div class="text-center">
                    <UIcon name="i-heroicons-plus" class="w-6 h-6 mx-auto text-swiss-text-muted" />
                    <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted block mt-1">
                        添加圖片
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string[]
}>()

const emit = defineEmits(['update:modelValue'])

function addImage() {
    const newImages = [...props.modelValue, '']
    emit('update:modelValue', newImages)
}

function removeImage(index: number) {
    const newImages = props.modelValue.filter((_, i) => i !== index)
    emit('update:modelValue', newImages)
}
</script>
