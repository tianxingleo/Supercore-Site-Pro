<template>
  <div ref="canvasContainer" class="w-full h-full relative">
    <!-- 3D Canvas will be mounted here -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-swiss-bg">
      <div class="text-swiss-secondary">載入中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backgroundColor?: string
  enableControls?: boolean
  autoRotate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#F5F5F7',
  enableControls: false,
  autoRotate: false,
})

const canvasContainer = ref<HTMLDivElement>()
const loading = ref(true)

// Placeholder for 3D scene initialization
// This will be implemented on Day 6 when we add TresJS
onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 500)

  // TODO: Initialize TresJS canvas here
  // const { scene, camera } = useTresScene()
  // ... rest of 3D setup
})

onUnmounted(() => {
  // TODO: Cleanup Three.js resources
})
</script>

<style scoped>
canvas-container {
  width: 100%;
  height: 100%;
}
</style>
