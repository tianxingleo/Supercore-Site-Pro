import { serverSupabaseClient } from '#supabase/server'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : undefined

    // 使用普通客户端（不需要管理员权限）
    const client = await serverSupabaseClient(event)

    let queryBuilder = client
        .from('posts')
        .select('*')
        .not('published_at', 'is', null)  // 只获取已发布的文章
        .lte('published_at', new Date().toISOString())  // 发布时间 <= 当前时间
        .order('published_at', { ascending: false })

    if (limit) {
        queryBuilder = queryBuilder.limit(limit)
    }

    const { data, error } = await queryBuilder

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }

    return (data as Post[]) || []
})
