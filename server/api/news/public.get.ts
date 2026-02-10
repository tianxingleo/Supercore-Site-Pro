import { createClient } from '@supabase/supabase-js'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : undefined

    const config = useRuntimeConfig()
    // 优先使用 service_role key 以绕过 RLS，如果没有配置则回退到 anon key
    // 注意：如果有 RLS 策略限制，使用 anon key 可能会导致查不到数据
    const supabaseUrl = config.supabaseService?.url || config.public?.supabaseUrl
    const supabaseKey = config.supabaseService?.key || config.public?.supabaseKey

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase configuration missing in /api/news/public')
        throw createError({
            statusCode: 500,
            message: 'Supabase configuration is missing. Please check SUPABASE_URL and SUPABASE_SECRET_KEY/SUPABASE_KEY in .env',
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
        console.error('Supabase error in /api/news/public:', error)
        throw createError({
            statusCode: 500,
            message: `Supabase Error: ${error.message} (${error.code})`,
        })
    }

    return (data as Post[]) || []
})
