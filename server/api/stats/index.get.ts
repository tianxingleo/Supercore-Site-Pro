import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  await requireAdminAuth(event)

  // 2. 获取统计数据
  const client = serverSupabaseServiceRole(event)

  const [
    { count: productCount },
    { count: inquiryCount },
    { count: postCount }
  ] = await Promise.all([
    client.from('products').select('*', { count: 'exact', head: true }),
    client.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    client.from('posts').select('*', { count: 'exact', head: true })
  ])

  // 3. 返回统计数据
  return {
    success: true,
    data: {
      products: productCount || 0,
      inquiries: inquiryCount || 0,
      posts: postCount || 0
    }
  }
})
