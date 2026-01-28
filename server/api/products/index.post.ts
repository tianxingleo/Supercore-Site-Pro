import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import { validateCreateProduct } from '~/server/utils/validation'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 解析请求体
  const body = await readBody(event)

  // 3. 验证输入数据
  const productData = validateCreateProduct(body)

  // 4. 检查 slug 是否已存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('products')
    .select('id')
    .eq('slug', productData.slug)
    .maybeSingle()

  if (checkError) {
    throw createError({
      statusCode: 500,
      message: `数据库查询失败：${checkError.message}`
    })
  }

  if (existing) {
    throw createError({
      statusCode: 409,
      message: `slug "${productData.slug}" 已存在，请使用其他 slug`
    })
  }

  // 5. 转换字段名（前端格式 -> 数据库格式）
  const { featured: _featured, ...dbProductData } = productData as any
  const finalProductData: any = { ...dbProductData }

  if (_featured !== undefined) {
    finalProductData.is_featured = _featured  // featured -> is_featured
  }

  console.log('[Product Create] DB insert data:', JSON.stringify(finalProductData, null, 2))

  // 6. 插入新产品（让 Supabase 自动处理 created_at 和 updated_at）
  const { data: newProduct, error: insertError } = await client
    .from('products')
    .insert(finalProductData)
    .select()
    .single()

  if (insertError) {
    console.error('[Product Create] Database error:', insertError)
    throw createError({
      statusCode: 500,
      message: `创建产品失败：${insertError.message}`
    })
  }

  console.log('[Product Create] Created product:', JSON.stringify(newProduct, null, 2))

  // 7. 转换返回数据（数据库格式 -> 前端格式）
  const transformedProduct: Product = {
    ...newProduct,
    featured: newProduct.is_featured,  // is_featured -> featured
    createdAt: newProduct.created_at,  // created_at -> createdAt
    updatedAt: newProduct.updated_at,  // updated_at -> updatedAt
  } as Product

  // 移除数据库字段名
  delete (transformedProduct as any).is_featured
  delete (transformedProduct as any).created_at
  delete (transformedProduct as any).updated_at

  console.log('[Product Create] Transformed response:', JSON.stringify(transformedProduct, null, 2))

  // 8. 返回创建的产品
  return {
    success: true,
    data: transformedProduct
  }
})
