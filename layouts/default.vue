<template>
  <div class="min-h-screen">
    <div :class="{ 'pt-24 md:pt-28': !isAdminPath }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isAdminPath = computed(() => {
  return route.path.split('/').some(segment => segment === 'admin')
})
// Default layout with padding for fixed navbar
</script>
