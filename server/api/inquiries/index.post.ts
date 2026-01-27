import { serverSupabaseServiceRole } from '#supabase/server'
import { validateCreateInquiry } from '~/server/utils/validation/inquiry'

export default defineEventHandler(async (event) => {
  // 1. 解析请求体
  const body = await readBody(event)

  // 2. 验证输入数据
  const inquiryData = validateCreateInquiry(body)

  // 3. 插入新询盘
  const client = serverSupabaseServiceRole(event)
  const { data: newInquiry, error: insertError } = await client
    .from('inquiries')
    .insert({
      ...inquiryData,
      status: 'new',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: `提交詢盤失敗：${insertError.message}`,
    })
  }

  // 4. 返回创建的询盘
  return {
    success: true,
    data: newInquiry,
  }
})
