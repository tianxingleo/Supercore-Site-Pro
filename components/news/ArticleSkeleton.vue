<template>
    <div class="bg-white">
        <!-- Header Skeleton -->
        <section class="pt-48 pb-24 border-b border-gray-100">
            <div class="px-6 md:px-12">
                <div class="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">
                    <div class="col-span-12 lg:col-span-10 lg:offset-1">
                        <div class="h-4 w-32 bg-gray-50 mb-8 relative overflow-hidden">
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                        <div class="h-6 w-20 bg-gray-50 rounded-full mb-6 relative overflow-hidden">
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                        <div class="space-y-4 mb-8">
                            <div class="h-12 w-full bg-gray-100 relative overflow-hidden">
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                            <div class="h-12 w-2/3 bg-gray-100 relative overflow-hidden">
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                        </div>
                        <div class="flex space-x-6">
                            <div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                            <div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Content Skeleton -->
        <section class="mt-20 px-6 md:px-12">
            <div class="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">
                <div class="col-span-12 lg:col-span-8 lg:offset-2">
                    <div class="aspect-video bg-gray-50 mb-16 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    <div class="space-y-6">
                        <div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }"
                            class="h-4 bg-gray-50 relative overflow-hidden">
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
