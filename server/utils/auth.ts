import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/**
 * 验证用户是否已登录且具有管理员角色
 * 如果未登录，抛出401错误
 * 如果不是管理员，抛出403错误
 *
 * @returns 用户信息和个人资料
 */
export async function requireAdminAuth(event: any) {
  // 获取已认证的用户
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: '未授权：请先登录'
    })
  }

  // 使用 service role client 验证管理员角色（绕过 RLS）
  const client = serverSupabaseServiceRole(event)

  // JWT token 中用户 ID 存储在 sub 字段中
  const userId = user.sub

  const { data: profile, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: '禁止访问：需要管理员权限'
    })
  }

  return { user, profile }
}
