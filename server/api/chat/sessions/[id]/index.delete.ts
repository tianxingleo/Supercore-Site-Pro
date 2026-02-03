// server/api/chat/sessions/[id]/index.delete.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // 1. 获取会话 ID
    const sessionId = getRouterParam(event, 'id')
    if (!sessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Session ID is required'
      })
    }

    // 2. 获取运行时配置
    const config = useRuntimeConfig()
    const { url, key } = config.supabaseService

    if (!url || !key) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing Supabase configuration'
      })
    }

    // 3. 初始化 Supabase 客户端
    const supabase = createClient(url, key)

    // 4. 解析请求体（可选：软删除或硬删除）
    const body = await readBody(event).catch(() => ({}))
    const { hard = false } = body

    if (hard) {
      // 硬删除：真正删除会话（消息会因为 CASCADE 自动删除）
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) {
        console.error('Failed to delete session:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to delete session'
        })
      }
    } else {
      // 软删除：标记为已删除
      const { error } = await supabase
        .from('chat_sessions')
        .update({ status: 'deleted' })
        .eq('id', sessionId)

      if (error) {
        console.error('Failed to archive session:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to archive session'
        })
      }
    }

    // 5. 返回成功
    return {
      success: true,
      message: hard ? 'Session deleted permanently' : 'Session archived'
    }
  } catch (e: any) {
    console.error('Delete session error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)

    if (e instanceof Error && 'statusCode' in e) {
      throw e
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
