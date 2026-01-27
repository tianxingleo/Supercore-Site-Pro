<template>
    <NuxtLink :to="localePath(`/news/${post.slug || post.id}`)"
        class="group block bg-white border border-gray-100 hover:border-swiss-text transition-all duration-500 overflow-hidden">
        <!-- Cover Image -->
        <div class="aspect-video bg-gray-50 relative overflow-hidden">
            <!-- Shimmer Placeholder (Visible until image loads) -->
            <div v-if="post.cover_image && !imageLoaded" class="shimmer absolute inset-0 z-10"></div>

            <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title[lang]" @load="imageLoaded = true"
                class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                :class="[imageLoaded ? 'opacity-100' : 'opacity-0']" />

            <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div class="w-12 h-12 text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                        <line x1="16" y1="5" x2="22" y2="5" />
                        <line x1="19" y1="2" x2="19" y2="8" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                </div>
            </div>

            <!-- Date Badge -->
            <div class="absolute bottom-4 left-4 z-20">
                <span
                    class="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest text-swiss-text uppercase">
                    {{ formatDate(post.published_at || post.created_at) }}
                </span>
            </div>
        </div>

        <!-- Content -->
        <div class="p-6">
            <div class="flex flex-wrap gap-2 mb-3" v-if="post.tags && post.tags.length">
                <span v-for="tag in post.tags" :key="tag"
                    class="text-[9px] font-bold uppercase tracking-tighter text-swiss-secondary border border-gray-100 px-2 py-0.5 rounded-full">
                    {{ tag }}
                </span>
            </div>

            <TypographyHeader :level="3" size="h5"
                class="mb-3 group-hover:text-swiss-accent transition-colors line-clamp-2 min-h-[3rem]">
                {{ post.title[lang] }}
            </TypographyHeader>

            <p class="text-swiss-secondary text-sm line-clamp-3 mb-6 opacity-70">
                {{ post.summary?.[lang] || post.content[lang]?.substring(0, 150) + '...' }}
            </p>

            <div
                class="flex items-center text-[10px] font-bold tracking-widest uppercase text-swiss-text group-hover:text-swiss-accent transition-colors">
                {{ $t('common.readMore') }}
                <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const props = defineProps<{
    post: Post
}>()

const localePath = useLocalePath()
const { locale } = useI18n()
const imageLoaded = ref(false)

const lang = computed(() => {
    const l = locale.value as string
    if (l.includes('HK') || l.includes('hk')) return 'hk'
    if (l.includes('CN') || l.includes('cn')) return 'cn'
    return 'en'
})

function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-HK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>

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

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    overflow: hidden;
}
</style>
