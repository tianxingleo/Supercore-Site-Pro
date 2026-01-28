import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import { validateUpdateProduct } from '~/server/utils/validation'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 获取产品 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的产品 ID'
    })
  }

  // 3. 解析请求体
  const body = await readBody(event)

  // 4. 验证更新数据
  const updateData = validateUpdateProduct(body)

  // 5. 检查产品是否存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('products')
    .select('id')
    .eq('id', Number(id))
    .maybeSingle()

  if (checkError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: '产品不存在'
    })
  }

  // 6. 如果更新 slug，检查新 slug 是否已被其他产品使用
  if (updateData.slug) {
    const { data: slugCheck } = await client
      .from('products')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', Number(id))
      .maybeSingle()

    if (slugCheck) {
      throw createError({
        statusCode: 409,
        message: `slug "${updateData.slug}" 已被其他产品使用`
      })
    }
  }

  // 7. 执行更新
  // 移除不应该被更新的字段
  const { id: _id, created_at: _created, ...safeUpdateData } = updateData as any

  const { data: updatedProduct, error: updateError } = await client
    .from('products')
    .update({
      ...safeUpdateData,
      // 如果你已经运行了 scripts/fix_missing_columns.sql，可以取消下面这一行的注释
      // updated_at: new Date().toISOString()
    })
    .eq('id', Number(id))
    .select()
    .single()

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: `更新产品失败：${updateError.message}`
    })
  }

  return {
    success: true,
    data: updatedProduct as Product
  }
})
