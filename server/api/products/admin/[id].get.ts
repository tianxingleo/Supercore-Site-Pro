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
      statusMessage: '无效的产品 ID'
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
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      statusMessage: error.code === 'PGRST116' ? '产品不存在' : `查询失败：${error.message}`
    })
  }

  return data as Product
})
