// server/api/chat/sessions/[id]/index.get.ts
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

    // 4. 获取会话详情
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session not found'
      })
    }

    // 5. 获取会话的消息
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Failed to fetch messages:', messagesError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch messages'
      })
    }

    // 6. 返回会话和消息（确保日期转换）
    return {
      success: true,
      data: {
        session: {
          id: session.id,
          sessionId: session.session_id,
          title: session.session_title,
          language: session.language,
          status: session.status,
          createdAt: new Date(session.created_at),
          updatedAt: new Date(session.updated_at)
        },
        messages: messages?.map(msg => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          metadata: msg.metadata,
          createdAt: new Date(msg.created_at)
        })) || []
      }
    }
  } catch (e: any) {
    console.error('Fetch session error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)

    // 如果是已知的错误，直接抛出
    if (e instanceof Error && 'statusCode' in e) {
      throw e
    }

    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
