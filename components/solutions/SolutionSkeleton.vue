<template>
    <div class="h-full bg-white border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
        <div class="p-8 flex flex-col h-full">
            <!-- Header Skeleton -->
            <div class="flex justify-between items-start mb-8">
                <div class="h-4 w-24 bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-4 w-4 bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Title Skeleton -->
            <div class="mb-4 space-y-2">
                <div class="h-8 w-3/4 bg-gray-100 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Description Skeleton -->
            <div class="space-y-2 mb-8 flex-grow">
                <div v-for="i in 3" :key="i" class="h-3 w-full bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Footer Skeleton -->
            <div class="pt-6 border-t border-gray-100">
                <div class="h-4 w-24 bg-gray-100 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>
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
