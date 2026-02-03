// server/api/chat/sessions/index.get.ts
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

    // 3. 获取查询参数
    const query = getQuery(event)
    const {
      status = 'active',
      limit = 50,
      offset = 0,
      anonymousUserId // 添加匿名用户 ID
    } = query

    console.log('[API Sessions] 查询参数:', { status, anonymousUserId })

    // 4. 查询会话列表（使用匿名用户 ID 过滤）
    let queryBuilder = supabase
      .from('chat_sessions')
      .select('*', { count: 'exact' })

    // ⭐ 添加匿名用户 ID 过滤（用户隔离）
    if (anonymousUserId && typeof anonymousUserId === 'string') {
      queryBuilder = queryBuilder.eq('anonymous_user_id', anonymousUserId)
      console.log('[API Sessions] 使用匿名用户 ID 过滤:', anonymousUserId)
    }

    // 添加状态过滤
    if (status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status)
    }

    // 添加排序和分页
    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    const { data, error, count } = await queryBuilder

    console.log('[API Sessions] 查询结果:', { data, error, count, status })

    if (error) {
      console.error('Failed to fetch sessions:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch sessions'
      })
    }

    // 5. 返回会话列表（转换日期为 Date 对象）
    return {
      success: true,
      data: {
        sessions: data?.map(session => ({
          id: session.id,
          sessionId: session.session_id,
          title: session.session_title,
          language: session.language,
          status: session.status,
          createdAt: new Date(session.created_at),
          updatedAt: new Date(session.updated_at)
        })) || [],
        pagination: {
          total: count || 0,
          limit: Number(limit),
          offset: Number(offset)
        }
      }
    }
  } catch (e: any) {
    console.error('Fetch sessions error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
