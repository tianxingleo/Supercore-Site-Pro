<template>
    <div class="relative">
        <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="全局搜索..."
                class="w-full px-4 py-2 pr-10 bg-white border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text placeholder-swiss-text-muted/40"
                @focus="showResults = true" @blur="handleBlur" />
            <UIcon name="i-heroicons-magnifying-glass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-swiss-text-muted w-5 h-5" />
        </div>

        <!-- Search Results Dropdown -->
        <div v-if="showResults && searchQuery.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white border border-swiss-text/10 shadow-lg max-h-96 overflow-y-auto z-50">
            <div v-if="loading" class="p-4 text-center text-swiss-text-muted text-sm">
                搜索中...
            </div>

            <div v-else-if="hasResults" class="divide-y divide-swiss-text/10">
                <!-- Products -->
                <div v-if="results.products.length > 0" class="p-4">
                    <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                        產品 ({{ results.products.length }})
                    </div>
                    <div v-for="product in results.products" :key="product.id"
                        class="py-2 hover:bg-swiss-bg-soft cursor-pointer"
                        @click="navigateTo(`/admin/products/${product.id}`)">
                        <div class="font-medium text-sm text-swiss-text">
                            {{ product.name?.['zh-HK'] || product.name?.hk }}
                        </div>
                        <div class="text-xs text-swiss-text-muted">{{ product.slug }}</div>
                    </div>
                </div>

                <!-- Posts -->
                <div v-if="results.posts.length > 0" class="p-4">
                    <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                        新聞 ({{ results.posts.length }})
                    </div>
                    <div v-for="post in results.posts" :key="post.id" class="py-2 hover:bg-swiss-bg-soft cursor-pointer"
                        @click="navigateTo(`/admin/news/${post.id}`)">
                        <div class="font-medium text-sm text-swiss-text">
                            {{ post.title?.['zh-HK'] || post.title?.hk }}
                        </div>
                        <div class="text-xs text-swiss-text-muted">{{ post.slug }}</div>
                    </div>
                </div>

                <!-- Inquiries -->
                <div v-if="results.inquiries.length > 0" class="p-4">
                    <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                        詢盤 ({{ results.inquiries.length }})
                    </div>
                    <div v-for="inquiry in results.inquiries" :key="inquiry.id"
                        class="py-2 hover:bg-swiss-bg-soft cursor-pointer" @click="navigateTo(`/admin/inquiries`)">
                        <div class="font-medium text-sm text-swiss-text">{{ inquiry.email }}</div>
                        <div class="text-xs text-swiss-text-muted truncate">{{ inquiry.message }}</div>
                    </div>
                </div>
            </div>

            <div v-else class="p-4 text-center text-swiss-text-muted text-sm">
                沒有找到結果
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const showResults = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// 搜索结果
const { data: searchResponse, pending: loading } = await useLazyFetch(
    () => `/api/admin/search?q=${searchQuery.value}`,
    {
        key: () => `admin-search-${searchQuery.value}`,
        immediate: false,
        watch: [searchQuery],
    }
)

const results = computed(() => {
    const response = searchResponse.value
    if (!response || !response.success) {
        return { products: [], posts: [], inquiries: [] }
    }
    // Type guard check
    if ('data' in response && response.data) {
        return response.data as { products: any[]; posts: any[]; inquiries: any[] }
    }
    return { products: [], posts: [], inquiries: [] }
})

const hasResults = computed(() => {
    return (
        results.value.products.length > 0 ||
        results.value.posts.length > 0 ||
        results.value.inquiries.length > 0
    )
})

// 延迟搜索
watch(searchQuery, () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    if (searchQuery.value.length > 0) {
        searchTimeout.value = setTimeout(() => {
            // 触发搜索
        }, 300)
    }
})

function handleBlur() {
    // 延迟隐藏，让点击事件有时间触发
    setTimeout(() => {
        showResults.value = false
    }, 200)
}
</script>
