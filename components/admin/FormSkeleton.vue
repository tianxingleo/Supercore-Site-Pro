<template>
  <div class="space-y-8 animate-pulse">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <div class="w-8 h-8 bg-gray-200 rounded-none"></div>
      <div class="h-8 w-48 bg-gray-200"></div>
    </div>

    <!-- Main Card -->
    <div class="bg-white border border-swiss-text/10 overflow-hidden">
      <!-- Card Header -->
      <div class="p-6 md:p-8 border-b border-swiss-text/10">
        <div class="h-4 w-24 bg-gray-200"></div>
      </div>
      
      <!-- Card Content -->
      <div class="p-6 md:p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 2" :key="'field-'+i" class="space-y-2">
            <div class="h-3 w-32 bg-gray-100"></div>
            <div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>
          </div>
          
          <div v-for="i in 2" :key="'area-'+i" class="md:col-span-2 space-y-2">
            <div class="h-3 w-32 bg-gray-100"></div>
            <div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub Card -->
    <div class="bg-white border border-swiss-text/10 overflow-hidden">
      <div class="p-6 md:p-8 border-b border-swiss-text/10">
        <div class="h-4 w-24 bg-gray-200"></div>
      </div>
      <div class="p-6 md:p-8 space-y-6">
        <div class="h-48 w-full bg-gray-50 border border-swiss-text/5"></div>
      </div>
    </div>

    <!-- Sticky Footer -->
    <div class="bg-white/80 backdrop-blur border-t border-swiss-text/10 p-4 flex justify-end space-x-4">
      <div class="h-10 w-24 bg-gray-200"></div>
      <div class="h-10 w-32 bg-gray-300"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
