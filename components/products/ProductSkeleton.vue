<template>
    <div class="h-full bg-white border border-gray-100 overflow-hidden flex flex-col">
        <!-- Product Image Skeleton -->
        <div class="aspect-square bg-swiss-bg-soft relative overflow-hidden">
            <div class="shimmer absolute inset-0"></div>

            <!-- Category Badge Skeleton -->
            <div class="absolute top-4 left-4">
                <div class="h-6 w-20 bg-white/50 backdrop-blur-sm rounded-full relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>
        </div>

        <!-- Product Info Skeleton -->
        <div class="p-6">
            <!-- Title Skeleton -->
            <div class="h-6 w-3/4 bg-gray-100 mb-2 relative overflow-hidden">
                <div class="shimmer absolute inset-0"></div>
            </div>

            <!-- Description Skeleton -->
            <div class="space-y-2 mb-4">
                <div class="h-3 w-full bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-3 w-2/3 bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- Specs Skeleton -->
            <div class="flex items-center justify-between">
                <div class="h-4 w-1/3 bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-8 w-24 bg-gray-100 relative overflow-hidden">
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
