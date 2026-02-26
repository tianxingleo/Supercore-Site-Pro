import { getInternalSupabaseClient } from '~/server/utils/supabase'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : undefined

    // 使用统一的 service_role 客户端工具函数
    const client = getInternalSupabaseClient(event)

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
            message: error.message,
        })
    }

    return (data as Post[]) || []
})
