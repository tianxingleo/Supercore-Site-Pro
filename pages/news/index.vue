<template>
    <div class="min-h-screen bg-white">
        <!-- Page Header -->
        <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
            <GridContainer :grid="true">
                <div class="col-span-12 lg:col-span-8">
                    <TypographyHeader :level="1" size="display" class="mb-8 font-black tracking-tighter uppercase">
                        {{ $t('news.title') }}
                    </TypographyHeader>
                    <TypographyHeader :level="2" size="h3" color="secondary" weight="normal"
                        class="max-w-2xl opacity-80">
                        {{ $t('news.subtitle') }}
                    </TypographyHeader>
                </div>
            </GridContainer>
        </section>

        <!-- News Grid -->
        <section class="pb-32">
            <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
                <template v-if="pending">
                    <div v-for="i in 6" :key="i"
                        class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 p-6 animate-pulse">
                        <div class="aspect-video bg-gray-100 mb-6"></div>
                        <div class="h-4 bg-gray-100 w-1/4 mb-4"></div>
                        <div class="h-8 bg-gray-100 w-3/4 mb-4"></div>
                        <div class="h-20 bg-gray-100 w-full mb-4"></div>
                    </div>
                </template>
                <template v-else-if="posts && posts.length">
                    <div v-for="post in posts" :key="post.id"
                        class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100">
                        <NewsCard :post="post" class="!border-none" />
                    </div>
                </template>
                <template v-else>
                    <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
                        <p class="text-swiss-secondary uppercase tracking-widest text-sm">
                            {{ $t('news.noNews') }}
                        </p>
                    </div>
                </template>
            </GridContainer>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types'

const { data: posts, pending } = await useFetch<Post[]>('/api/news')

useHead({
    title: '行业咨询 - SUPERCORE',
    meta: [
        { name: 'description', content: '广东博迩科技有限公司海外官方网站行业咨询界面，为您提供最新的行业动态及公司快讯。' }
    ]
})
</script>
