<template>
    <div class="space-y-12">
        <!-- Stats Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-swiss-text/10">
            <div v-for="i in 4" :key="i" class="bg-white p-8 border-r border-b border-swiss-text/10">
                <div class="h-3 w-16 bg-gray-50 mb-4 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-10 w-24 bg-gray-100 mb-4 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
                <div class="h-3 w-32 bg-gray-50 relative overflow-hidden">
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>
        </div>

        <!-- Server Status Skeleton -->
        <div class="bg-white border border-swiss-text/10 p-6 md:p-8 space-y-4">
            <div class="h-6 w-48 bg-gray-100 mb-6 relative overflow-hidden">
                <div class="shimmer absolute inset-0"></div>
            </div>
            <div v-for="i in 2" :key="i" class="flex items-center justify-between p-4 border border-swiss-text/10">
                <div class="space-y-2 flex-grow">
                    <div class="h-3 w-32 bg-gray-50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    <div class="h-4 w-64 bg-gray-100 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
                <div class="flex flex-col items-end space-y-2">
                    <div class="h-5 w-20 bg-gray-50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    <div class="h-3 w-12 bg-gray-50 relative overflow-hidden">
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Skeleton -->
        <div>
            <div class="h-6 w-32 bg-gray-100 mb-4 relative overflow-hidden">
                <div class="shimmer absolute inset-0"></div>
            </div>
            <TableSkeleton />
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
