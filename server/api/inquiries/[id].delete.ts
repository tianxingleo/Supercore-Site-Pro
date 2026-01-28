import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: '無效的詢盤 ID',
    })
  }

  await requireAdminAuth(event)

  const client = serverSupabaseServiceRole(event)
  const { error } = await client.from('inquiries').delete().eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: `刪除詢盤失敗：${error.message}`,
    })
  }

  return {
    success: true,
  }
})
