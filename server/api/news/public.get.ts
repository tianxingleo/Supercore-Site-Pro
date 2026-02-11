import { createClient } from '@supabase/supabase-js'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : undefined

    // 使用 service_role 客户端绕过 RLS（公开 API）
    const config = useRuntimeConfig(event)
    const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
    const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

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
