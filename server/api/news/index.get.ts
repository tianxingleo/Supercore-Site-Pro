import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
    // 1. 检查身份验证
    await requireAdminAuth(event)

    // 2. 获取所有文章
    const client = serverSupabaseServiceRole(event)
    const { data, error } = await client
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({
            statusCode: 500,
            message: error.message,
        })
    }

    return {
        success: true,
        data: data as Post[]
    }
})
