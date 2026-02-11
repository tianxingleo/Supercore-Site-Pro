import { getInternalSupabaseClient } from '~/server/utils/supabase'
import { requireAdminAuth } from '~/server/utils/auth'
import { withApiHandler, createSuccessResponse, createErrorResponse } from '~/utils/apiHandler'
import { logger, createRequestContext } from '~/utils/logger'

export default withApiHandler(async (event) => {
  const requestContext = createRequestContext(event)
  const startTime = Date.now()

  // 1. 验证管理员身份
  try {
    await requireAdminAuth(event)
  } catch (err: any) {
    return createErrorResponse(err.message || 'Unauthorized', err.statusCode || 401)
  }

  // 2. 获取针对后端的 Service Role 客户端
  const client = getInternalSupabaseClient(event)


  try {
    // 测试后端连接时间并获取数据
    const backendStartTime = Date.now()

    // 并行获取所有数据
    const [productsResult, inquiriesResult, postsResult] = await Promise.all([
      client.from('products').select('id', { count: 'exact', head: true }),
      client.from('inquiries').select('id', { count: 'exact', head: true }),
      client.from('posts').select('id', { count: 'exact', head: true }),
    ])

    const backendPing = Date.now() - backendStartTime

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
    const config = useRuntimeConfig(event)
    // 从请求头获取实际的前端 URL
    const protocol = event.headers.get('x-forwarded-proto') || 'http'
    const host = event.headers.get('host') || 'host.docker.internal' // 或 host
    const frontendUrl = `${protocol}://${host}`
    const backendUrl = config.supabaseService.url || 'Unknown'

    // 计算总处理时间作为前端响应时间的近似值
    const frontendPing = Date.now() - startTime

    const serverStatus = {
      frontend: {
        url: frontendUrl,
        status: 'online',
        responseTime: frontendPing, // API 处理时间
      },
      backend: {
        url: backendUrl,
        status: 'online',
        responseTime: backendPing, // Supabase 查询时间
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
