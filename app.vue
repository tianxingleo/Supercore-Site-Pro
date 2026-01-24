<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Navigation -->
    <AppNavbar />

    <!-- Page Content with Transition -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Footer (optional, can be added later) -->
    <!-- <AppFooter /> -->
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'zh-HK',
  },
  bodyAttrs: {
    class: 'antialiased',
  },
})
</script>

<style>
/* Page Transition Animation */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Layout Transition Animation */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
