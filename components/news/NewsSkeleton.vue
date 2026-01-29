<template>
    <div class="h-full bg-white border border-gray-100 overflow-hidden flex flex-col">
        <!-- Cover Image Skeleton -->
        <div class="aspect-video bg-swiss-bg-soft relative overflow-hidden">
            <div class="shimmer absolute inset-0"></div>

            <!-- Date Badge Skeleton -->
            <div class="absolute bottom-4 left-4">
                <div class="h-6 w-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>
        </div>

        <!-- Content Skeleton -->
        <div class="p-6 flex-grow flex flex-col">
            <!-- Tags Skeleton -->
            <div class="flex flex-wrap gap-2 mb-4">
                <div v-for="i in 2" :key="i"
                    class="h-4 w-12 bg-gray-50 rounded-full relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Title Skeleton -->
            <div class="mb-4 space-y-2">
                <div class="h-5 w-full bg-gray-100 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-5 w-2/3 bg-gray-100 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Summary Skeleton -->
            <div class="mb-6 space-y-2 flex-grow">
                <div v-for="i in 3" :key="i" class="h-3 w-full bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Read More Skeleton -->
            <div class="h-4 w-24 bg-gray-100 relative overflow-hidden mt-auto">
                <div class="shimmer absolute inset-0"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 45%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.6) 55%,
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
