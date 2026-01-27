<template>
    <div class="bg-white">
        <div class="px-6 md:px-12 grid grid-cols-12 border-l border-gray-100 min-h-screen">
            <!-- Left Side Skeleton -->
            <div
                class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 bg-swiss-bg-soft flex items-center justify-center">
                <div class="aspect-square w-full p-24 relative flex items-center justify-center">
                    <div class="w-2/3 h-2/3 bg-white/50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
            </div>

            <!-- Right Side Skeleton -->
            <div class="col-span-12 lg:col-span-5 border-r border-b border-gray-100 p-12 md:p-20">
                <div class="h-4 w-48 bg-gray-50 mb-12 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-12 w-full bg-gray-100 mb-8 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="space-y-4 mb-16">
                    <div v-for="i in 3" :key="i" class="h-4 w-full bg-gray-50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="h-14 w-full bg-gray-100 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    <div class="h-14 w-full bg-gray-50 relative overflow-hidden border border-gray-100">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
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
