import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  await requireAdminAuth(event)

  // 2. 获取所有询盘
  const client = serverSupabaseServiceRole(event)
  const { data: inquiries, error } = await client
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: `获取询盘列表失败：${error.message}`
    })
  }

  // 3. 返回询盘列表
  return {
    success: true,
    data: inquiries || []
  }
})
