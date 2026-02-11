<template>
  <div :class="containerClass">
    <NuxtImg
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imageClass"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  containerClass?: string
  imageClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  containerClass: '',
  imageClass: '',
})
</script>
