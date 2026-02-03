// server/api/chat/sessions/index.post.ts
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // 1. 获取运行时配置
    const config = useRuntimeConfig()
    const { url, key } = config.supabaseService

    if (!url || !key) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing Supabase configuration'
      })
    }

    // 2. 初始化 Supabase 客户端
    const supabase = createClient(url, key)

    // 3. 解析请求体
    const body = await readBody(event)
    const { title = '新對話', language = 'zh-HK' } = body

    // 4. 创建新会话
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_title: title,
        language,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create session:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create session'
      })
    }

    // 5. 返回创建的会话
    return {
      success: true,
      data: {
        id: data.id,
        sessionId: data.session_id,
        title: data.session_title,
        language: data.language,
        status: data.status,
        createdAt: data.created_at
      }
    }
  } catch (e: any) {
    console.error('Create session error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
