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

  const body = await readBody(event)
  const { status } = body

  if (!status || typeof status !== 'string') {
    throw createError({
      statusCode: 400,
      message: '狀態值無效',
    })
  }

  const validStatuses = ['new', 'read', 'archived']
  if (!validStatuses.includes(status)) {
    throw createError({
      statusCode: 400,
      message: `無效的狀態值，必須是 ${validStatuses.join(', ')} 之一`,
    })
  }

  const client = serverSupabaseServiceRole(event)
  const { error } = await client.from('inquiries').update({ status }).eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: `更新詢盤狀態失敗：${error.message}`,
    })
  }

  return {
    success: true,
  }
})
