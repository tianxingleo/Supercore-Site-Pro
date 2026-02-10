import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { getHeaders, getRequestHeader } from 'h3'
import { createClient } from '@supabase/supabase-js'

/**
 * 验证用户是否已登录且具有管理员角色
 * 如果未登录，抛出401错误
 * 如果不是管理员，抛出403错误
 *
 * @returns 用户信息和个人资料
 */
export async function requireAdminAuth(event: any) {
  // 方法1: 尝试使用 serverSupabaseUser
  let user = await serverSupabaseUser(event)

  // 方法2: 如果方法1失败，手动从 cookie 读取 session
  if (!user) {
    try {
      const cookie = getRequestHeader(event, 'cookie')
      if (cookie) {
        // 尝试多种 Supabase cookie 格式
        // 格式1: sb-access-token / sb-refresh-token (旧版)
        // 格式2: sb-<project-ref>-auth-token (新版)

        let accessToken = null
        let refreshToken = null

        // 尝试格式1
        const accessTokenMatch = cookie.match(/sb-access-token=([^;]+)/)
        const refreshTokenMatch = cookie.match(/sb-refresh-token=([^;]+)/)

        if (accessTokenMatch && refreshTokenMatch) {
          accessToken = decodeURIComponent(accessTokenMatch[1])
          refreshToken = decodeURIComponent(refreshTokenMatch[1])
        } else {
          // 尝试格式2: 新版 Supabase 使用单个 auth token cookie
          const authTokenMatch = cookie.match(/sb-[^-]+-auth-token=([^;]+)/)
          if (authTokenMatch) {
            // 新版本中，auth token 包含了 session 信息
            // 尝试直接使用这个 token
            try {
              const authToken = JSON.parse(decodeURIComponent(authTokenMatch[1]))
              accessToken = authToken.access_token
              refreshToken = authToken.refresh_token
            } catch {
              // 如果不是 JSON，可能是 base64 编码的 token
              accessToken = decodeURIComponent(authTokenMatch[1])
            }
          }
        }

        if (accessToken) {
          const config = useRuntimeConfig(event)
          const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
          const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

          if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey, {
              auth: {
                autoRefreshToken: false,
                persistSession: false,
              },
            })

            // 尝试使用 access token 获取用户
            const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)

            if (!userError && userData?.user) {
              user = userData.user as any
              console.log('[Auth] Successfully restored session from cookie')
            }
          }
        }
      }
    } catch (error) {
      console.error('[Auth] Failed to restore session from cookie:', error)
    }
  }

  if (!user) {
    const headers = getHeaders(event)
    const cookie = headers.cookie
    console.error('[Auth] No user found in session.')
    console.error('[Auth] Cookies present:', !!cookie)
    console.error('[Auth] Request path:', event.node.req.url)
    console.error('[Auth] Cookie preview:', cookie ? cookie.substring(0, 100) + '...' : 'none')
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

  // 使用 robust client 验证管理员角色
  const config = useRuntimeConfig(event)
  const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
  const supabaseKey = config.supabaseService.key || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Auth] Cannot verify admin role: Supabase config missing')
    throw createError({
      statusCode: 500,
      message: '服务器配置错误：无法验证管理员权限'
    })
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

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
