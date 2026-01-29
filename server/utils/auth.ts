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
    const cookie = event.getHeaders().cookie
    console.error('[Auth] No user found in session. Cookies present:', !!cookie)
    throw createError({
      statusCode: 401,
      message: '未授权：请先登录'
    })
  }

  // JWT token 中用户 ID 存储在 id 或 sub 字段中
  // 在某些 Nuxt Supabase 版本中，serverSupabaseUser 返回的是 JWT 载荷，ID 在 sub 字段
  const userId = user?.id || user?.sub

  // 验证 userId 是否存在且是有效的 UUID 格式
  // 防止 "undefined" 字符串或空值进入数据库查询
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!userId || userId === 'undefined' || !uuidRegex.test(userId)) {
    console.error('[Auth] Invalid User ID detected:', userId, 'User object:', JSON.stringify(user))
    throw createError({
      statusCode: 401,
      message: '未授权：无效的用户身份标识'
    })
  }

  // 使用 service role client 验证管理员角色
  const client = serverSupabaseServiceRole(event)

  const { data: profile, error } = await client
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    console.error('[Auth] Admin role check failed for user:', userId, error?.message || 'Role mismatch or profile not found')
    throw createError({
      statusCode: 403,
      message: '禁止访问：需要管理员权限'
    })
  }

  return { user, profile }
}
