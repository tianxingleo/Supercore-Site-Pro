import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  await requireAdminAuth(event)

  // 2. 获取产品 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: '无效的产品 ID'
    })
  }

  // 3. 查询产品
  const client = serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (error) {
    console.error('[Product Get] Database error:', error)
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      message: error.code === 'PGRST116' ? '产品不存在' : `查询失败：${error.message}`
    })
  }

  // 4. 转换字段名（数据库格式 -> 前端格式）
  const transformedProduct: Product = {
    ...data,
    featured: data.is_featured,  // is_featured -> featured
    createdAt: data.created_at,  // created_at -> createdAt
    updatedAt: data.updated_at,  // updated_at -> updatedAt
  } as Product

  // 移除数据库字段名
  delete (transformedProduct as any).is_featured
  delete (transformedProduct as any).created_at
  delete (transformedProduct as any).updated_at

  console.log('[Product Get] Transformed data:', JSON.stringify(transformedProduct, null, 2))

  return transformedProduct
})
