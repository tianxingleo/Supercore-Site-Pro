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

  console.log('[Product Update] Received data:', JSON.stringify(body, null, 2))

  // 4. 验证更新数据
  let updateData
  try {
    updateData = validateUpdateProduct(body)
    console.log('[Product Update] Validated data:', JSON.stringify(updateData, null, 2))
  } catch (validationError: any) {
    console.error('[Product Update] Validation error:', validationError)
    throw validationError
  }

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
      message: '产品不存在'
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
  // 移除不应该被更新的字段，并转换字段名
  const { id: _id, created_at: _created, updated_at: _updated, createdAt: _createdAt, updatedAt: _updatedAt, featured: _featured, ...safeUpdateData } = updateData as any

  // 如果前端发送了 featured 字段，转换为 is_featured
  const dbUpdateData: any = { ...safeUpdateData }

  if (_featured !== undefined) {
    dbUpdateData.is_featured = _featured
  }

  console.log('[Product Update] DB update data:', JSON.stringify(dbUpdateData, null, 2))

  const { data: updatedProduct, error: updateError } = await client
    .from('products')
    .update(dbUpdateData)
    .eq('id', Number(id))
    .select()
    .single()

  if (updateError) {
    console.error('[Product Update] Database error:', updateError)
    throw createError({
      statusCode: 500,
      statusMessage: `更新产品失败：${updateError.message}`
    })
  }

  console.log('[Product Update] Updated product:', JSON.stringify(updatedProduct, null, 2))

  // 8. 转换返回数据（数据库格式 -> 前端格式）
  const transformedProduct: Product = {
    ...updatedProduct,
    featured: updatedProduct.is_featured,  // is_featured -> featured
    createdAt: updatedProduct.created_at,  // created_at -> createdAt
    updatedAt: updatedProduct.updated_at,  // updated_at -> updatedAt
  } as Product

  // 移除数据库字段名
  delete (transformedProduct as any).is_featured
  delete (transformedProduct as any).created_at
  delete (transformedProduct as any).updated_at

  console.log('[Product Update] Transformed response:', JSON.stringify(transformedProduct, null, 2))

  return {
    success: true,
    data: transformedProduct
  }
})
