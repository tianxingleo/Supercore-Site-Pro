/**
 * Products API Endpoint
 * 返回所有產品列表
 */

import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    // 1. 检查身份验证
    await requireAdminAuth(event)

    // 2. 获取所有产品
    const client = serverSupabaseServiceRole(event)
    const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `获取产品列表失败：${error.message}`
        })
    }

    return {
        success: true,
        data: data || []
    }
})
