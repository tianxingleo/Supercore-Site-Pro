import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 从 URL 获取产品 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的产品 ID'
    })
  }

  // 3. 检查产品是否存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('products')
    .select('id, name')
    .eq('id', id)
    .single()

  if (checkError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: '产品不存在'
    })
  }

  // 4. 删除产品
  const { error: deleteError } = await client
    .from('products')
    .delete()
    .eq('id', id)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: `删除产品失败：${deleteError.message}`
    })
  }

  // 5. 返回成功信息
  return {
    success: true,
    message: '产品已成功删除',
    data: { id: Number(id) }
  }
})
