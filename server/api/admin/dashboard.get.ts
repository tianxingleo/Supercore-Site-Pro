import { createClient } from '@supabase/supabase-js'
import { withApiHandler, createSuccessResponse, createErrorResponse } from '~/utils/apiHandler'
import { logger, createRequestContext } from '~/utils/logger'

export default withApiHandler(async (event) => {
  const requestContext = createRequestContext(event)

  // 验证配置
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    await logger.error('Supabase configuration is missing', null, 'API' as any, {
      ...requestContext,
    })

    return createErrorResponse('Supabase configuration is missing', 500)
  }

  // 创建客户端
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // 并行获取所有数据
    const [productsResult, inquiriesResult, postsResult] = await Promise.all([
      client.from('products').select('id', { count: 'exact', head: true }),
      client.from('inquiries').select('id', { count: 'exact', head: true }),
      client.from('posts').select('id', { count: 'exact', head: true }),
    ])

    // 调试日志
    console.log('[Dashboard API] Query results:', {
      products: productsResult,
      inquiries: inquiriesResult,
      posts: postsResult,
    })

    const stats = {
      products: productsResult.count || 0,
      inquiries: inquiriesResult.count || 0,
      posts: postsResult.count || 0,
    }

    console.log('[Dashboard API] Stats:', stats)

    // 获取最近的询盘
    const { data: recentInquiries } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // 检查服务器状态
    // 从请求头获取实际的前端 URL
    const protocol = event.headers.get('x-forwarded-proto') || 'http'
    const host = event.headers.get('host') || 'localhost:3000'
    const frontendUrl = `${protocol}://${host}`
    const backendUrl = process.env.SUPABASE_URL || 'Unknown'

    // 测量前端响应时间
    let frontendStatus = 'online'
    let frontendResponseTime: number | null = null

    try {
      const start = Date.now()
      // 发送一个简单的请求到前端首页来测量响应时间
      await $fetch(frontendUrl, {
        method: 'HEAD',
        timeout: 5000,
      })
      frontendResponseTime = Date.now() - start
      frontendStatus = 'online'
      console.log('[Dashboard API] Frontend ping successful:', {
        url: frontendUrl,
        responseTime: frontendResponseTime + 'ms'
      })
    } catch (error) {
      frontendStatus = 'offline'
      console.error('[Dashboard API] Frontend ping failed:', error)
    }

    const serverStatus = {
      frontend: {
        url: frontendUrl,
        status: frontendStatus,
        responseTime: frontendResponseTime,
      },
      backend: {
        url: backendUrl,
        status: 'online', // 如果能连接到 Supabase，就是 online
        responseTime: null,
      },
    }

    await logger.info('Dashboard data loaded successfully', 'API' as any, {
      ...requestContext,
      stats,
      inquiriesCount: recentInquiries?.length || 0,
    })

    return createSuccessResponse({
      stats,
      recentInquiries: recentInquiries || [],
      serverStatus,
    })
  } catch (error: any) {
    await logger.error('Failed to load dashboard data', error, 'API' as any, {
      ...requestContext,
    })

    return createErrorResponse(error.message || 'Failed to load dashboard data', 500)
  }
})
