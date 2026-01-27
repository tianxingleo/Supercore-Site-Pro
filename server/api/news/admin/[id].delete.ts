import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 从 URL 获取文章 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的文章 ID'
    })
  }

  // 3. 检查文章是否存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('posts')
    .select('id, title')
    .eq('id', id)
    .single()

  if (checkError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在'
    })
  }

  // 4. 删除文章
  const { error: deleteError } = await client
    .from('posts')
    .delete()
    .eq('id', id)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: `删除文章失败：${deleteError.message}`
    })
  }

  // 5. 返回成功信息
  return {
    success: true,
    message: '文章已成功删除',
    data: { id: Number(id) }
  }
})
