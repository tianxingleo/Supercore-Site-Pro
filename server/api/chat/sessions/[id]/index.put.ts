// server/api/chat/sessions/[id]/index.put.ts
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

    // 4. 解析请求体
    const body = await readBody(event)
    const { title, status } = body

    // 5. 构建更新对象
    const updateData: any = {}
    if (title !== undefined) updateData.session_title = title
    if (status !== undefined) updateData.status = status

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update'
      })
    }

    // 6. 更新会话
    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updateData)
      .eq('id', sessionId)
      .select()
      .single()

    if (error || !data) {
      console.error('Failed to update session:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update session'
      })
    }

    // 7. 返回更新后的会话
    return {
      success: true,
      data: {
        id: data.id,
        sessionId: data.session_id,
        title: data.session_title,
        language: data.language,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    }
  } catch (e: any) {
    console.error('Update session error:', e)
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
