import { createClient } from '@supabase/supabase-js'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    // 获取路由参数
    const slug = event.context.params?.slug || getRouterParam(event, 'slug')

    if (!slug) {
        console.log('[News API] Params:', event.context.params)
        throw createError({
            statusCode: 400,
            message: 'Slug is required',
        })
    }

    console.log('[News API] Fetching post with slug:', slug)

    // 使用 service_role 客户端绕过 RLS（公开 API）
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SECRET_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw createError({
            statusCode: 500,
            message: 'Supabase configuration is missing',
        })
    }

    const client = createClient(
        supabaseUrl,
        supabaseKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // 获取当前文章
    const { data: post, error: postError } = await client
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .single()

    if (postError || !post) {
        throw createError({
            statusCode: 404,
            message: 'Post not found',
        })
    }

    // 获取上一篇和下一篇文章
    const { data: allPosts } = await client
        .from('posts')
        .select('id, slug, title, published_at')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })

    let prevPost: Post | undefined
    let nextPost: Post | undefined

    if (allPosts) {
        const currentIndex = allPosts.findIndex(p => p.id === post.id)

        if (currentIndex > 0) {
            prevPost = allPosts[currentIndex - 1] as Post
        }

        if (currentIndex < allPosts.length - 1) {
            nextPost = allPosts[currentIndex + 1] as Post
        }
    }

    return {
        post: post as Post,
        prevPost,
        nextPost
    }
})
