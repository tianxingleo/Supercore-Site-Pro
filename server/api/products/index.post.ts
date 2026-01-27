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
      statusMessage: `数据库查询失败：${checkError.message}`
    })
  }

  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: `slug "${productData.slug}" 已存在，请使用其他 slug`
    })
  }

  // 5. 插入新产品
  const { data: newProduct, error: insertError } = await client
    .from('products')
    .insert({
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: `创建产品失败：${insertError.message}`
    })
  }

  // 6. 返回创建的产品
  return {
    success: true,
    data: newProduct as Product
  }
})
