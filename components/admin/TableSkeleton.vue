<template>
    <div class="h-full bg-white border border-swiss-text/10 overflow-hidden flex flex-col min-h-[400px]">
        <div class="p-8 flex flex-col h-full">
            <!-- Table Header Skeleton -->
            <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
                <div v-for="i in 4" :key="i" class="flex-1 px-4">
                    <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
            </div>

            <!-- Table Rows Skeleton -->
            <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4 last:border-0">
                <div v-for="i in 4" :key="i" class="flex-1 px-4">
                    <div class="h-4 bg-gray-50 relative overflow-hidden"
                        :style="{ width: (Math.random() * 40 + 40) + '%' }">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
            </div>

            <!-- Empty Space to match table feel -->
            <div class="flex-grow"></div>
        </div>
    </div>
</template>

<style scoped>
.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.4) 55%,
            rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
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
