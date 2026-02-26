import { getInternalSupabaseClient } from '~/server/utils/supabase'
import { requireAdminAuth } from '~/server/utils/auth'
import type { Post } from '~/types'
import { sanitizeRecords } from '~/server/utils/storageUrl'

export default defineEventHandler(async (event) => {
    // 1. 检查身份验证
    await requireAdminAuth(event)

    // 2. 获取所有文章
    const client = getInternalSupabaseClient(event)
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
        data: sanitizeRecords(data as Post[])
    }
})
