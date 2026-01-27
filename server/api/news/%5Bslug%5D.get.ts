import { serverSupabaseClient } from '#supabase/server'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const slug = getRouterParam(event, 'slug')

    // Try to find post by slug, or ID if slug is numeric
    let query = client.from('posts').select('*')

    if (slug && /^\d+$/.test(slug)) {
        query = query.or(`slug.eq.${slug},id.eq.${slug}`)
    } else {
        query = query.eq('slug', slug)
    }

    const { data: post, error } = await query.single()

    if (error || !post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found',
        })
    }

    // Fetch prev and next posts for navigation
    const { data: prevPost } = await client
        .from('posts')
        .select('id, slug, title')
        .lt('published_at', post.published_at || post.created_at)
        .order('published_at', { ascending: false })
        .limit(1)
        .single()

    const { data: nextPost } = await client
        .from('posts')
        .select('id, slug, title')
        .gt('published_at', post.published_at || post.created_at)
        .order('published_at', { ascending: true })
        .limit(1)
        .single()

    return {
        post: post as Post,
        prevPost: prevPost as Partial<Post>,
        nextPost: nextPost as Partial<Post>
    }
})
