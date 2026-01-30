/**
 * 调试端点 - 检查 Supabase Session
 */
import { serverSupabaseUser } from '#supabase/server'
import { getHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const headers = getHeaders(event)
  const user = await serverSupabaseUser(event)

  return {
    timestamp: new Date().toISOString(),
    cookies: {
      cookie: headers.cookie,
      hasCookie: !!headers.cookie,
      cookieKeys: headers.cookie ? Object.keys(headers.cookie) : [],
    },
    user: {
      exists: !!user,
      data: user || null,
      userId: user?.id || user?.sub || null,
    },
    request: {
      url: event.node.req.url,
      method: event.node.req.method,
    },
  }
})
