<template>
  <div class="w-full h-full relative flex items-center justify-center bg-white overflow-hidden rounded-lg">
    <!-- Grid Background -->
    <div class="absolute inset-0 opacity-[0.03]" :style="{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }"></div>
    
    <!-- Server Rack Skeleton -->
    <div class="relative w-48 h-64 md:w-64 md:h-80 border border-gray-100 bg-gray-50/50 rounded-sm shadow-sm flex flex-col p-4 animate-pulse">
      <!-- Top Section -->
      <div class="h-4 w-1/3 bg-gray-200 rounded-full mb-6 relative overflow-hidden">
        <div class="shimmer absolute inset-0"></div>
      </div>
      
      <!-- Server Units -->
      <div class="flex-1 space-y-3">
        <div v-for="i in 6" :key="i" class="h-6 w-full bg-gray-200/60 rounded-sm relative overflow-hidden">
          <div class="shimmer absolute inset-0"></div>
          <div class="absolute left-2 top-1/2 -translate-y-1/2 flex space-x-1">
            <div class="w-1 h-1 rounded-full bg-gray-300"></div>
            <div class="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Detail -->
      <div class="h-2 w-full bg-gray-200/40 mt-6 rounded-full relative overflow-hidden">
        <div class="shimmer absolute inset-0"></div>
      </div>

      <!-- Center Logo/Icon Placeholder -->
      <div class="absolute inset-0 flex items-center justify-center opacity-10">
        <div class="w-16 h-16 border-2 border-swiss-text rounded-full flex items-center justify-center">
            <div class="w-8 h-8 bg-swiss-text rounded-sm"></div>
        </div>
      </div>
    </div>
    
    <!-- Loading Text -->
    <div class="absolute bottom-8 flex flex-col items-center">
      <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text/40 mb-2">
        Initializing 3D Environment
      </div>
      <div class="flex space-x-1">
        <div class="w-1 h-1 bg-swiss-text/20 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-1 h-1 bg-swiss-text/20 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-1 h-1 bg-swiss-text/20 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props kept for compatibility though simplified for fallback use
interface Props {
  backgroundColor?: string
}

withDefaults(defineProps<Props>(), {
  backgroundColor: '#FFFFFF',
})
</script>

<style scoped>
.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 45%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.6) 55%,
            rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>
