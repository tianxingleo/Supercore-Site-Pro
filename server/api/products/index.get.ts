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
            message: `获取产品列表失败：${error.message}`
        })
    }

    // 3. 转换字段名（数据库格式 -> 前端格式）
    const transformedProducts = (data || []).map((product: any) => ({
        ...product,
        featured: product.is_featured,  // is_featured -> featured
        createdAt: product.created_at,  // created_at -> createdAt
        updatedAt: product.updated_at,  // updated_at -> updatedAt
    }))

    // 移除数据库字段名
    transformedProducts.forEach((product: any) => {
        delete product.is_featured
        delete product.created_at
        delete product.updated_at
    })

    console.log('[Products List] Transformed', transformedProducts.length, 'products')

    return {
        success: true,
        data: transformedProducts
    }
})
