/**
 * ============================================================================
 * 管理仪表盘 API 端点（GET /api/admin/dashboard）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于获取管理仪表盘所需的数据。
 * 管理员访问仪表盘时，前端会调用此 API 获取统计数据、服务器状态和近期询盘。
 *
 * 访问路径：
 * - 完整路径：/api/admin/dashboard
 * - 方法：GET
 * - 认证：需要管理员身份（JWT token）
 *
 * 实现手段：
 * 1. 使用 defineEventHandler 定义 Nitro 服务器事件处理器
 * 2. 使用 serverSupabaseServiceRole 获取 Supabase Service Role 客户端
 * 3. 使用 Promise.all 并发查询多个表，提升性能
 * 4. 使用 count 查询获取记录数量，而非实际数据
 * 5. 使用日志记录器（logger）记录请求和响应
 * 6. 使用 withApiHandler 包装器统一处理响应和错误
 *
 * 核心功能：
 * 1. 身份验证：验证管理员身份（JWT token）
 * 2. 统计数据：
 *    - 产品总数
 *    - 询盘总数
 *    - 文章总数
 * 3. 服务器状态：
 *    - Frontend Server 状态和响应时间
 *    - Backend Server（Supabase）状态和响应时间
 * 4. 近期询盘：最新的 5 条询盘记录
 *
 * 返回格式：
 * {
 *   success: true,
 *   data: {
 *     stats: {
 *       products: 7,      // 产品总数
 *       inquiries: 1,     // 询盘总数
 *       posts: 2          // 文章总数
 *     },
 *     recentInquiries: [
 *       { id, email, company, message, status, created_at },
 *       ...
 *     ],
 *     serverStatus: {
 *       frontend: {
 *         url: 'http://...',
 *         status: 'online',
 *         responseTime: 123  // 毫秒
 *       },
 *       backend: {
 *         url: 'https://...',
 *         status: 'online',
 *         responseTime: 45   // 毫秒
 *       }
 *     }
 *   }
 * }
 *
 * 错误处理：
 * - 401：未授权（JWT token 无效或过期）
 * - 500：服务器错误（数据库查询失败）
 *
 * 安全措施：
 * 1. 使用 requireAdminAuth 验证管理员身份
 * 2. 使用 serverSupabaseServiceRole（Service Role Key）绕过 RLS
 * 3. 记录所有请求和错误（审计日志）
 * 4. 不返回敏感信息（如密码、密钥等）
 *
 * 性能优化：
 * 1. Promise.all 并发查询，减少总响应时间
 * 2. 使用 count 查询而非 select '*'，减少数据传输
 * 3. 只查询最近的 5 条询盘，而非所有询盘
 * 4. 使用 head: true 只返回计数，不返回实际数据
 *
 * 日志记录：
 * - 请求上下文（IP、User Agent 等）
 * - 查询结果统计
 * - 服务器状态
 * - 错误信息
 * - 处理时间
 *
 * 数据库表：
 * 1. products：产品表
 *    - 字段：id, name, slug, status, created_at 等
 * 2. inquiries：询盘表
 *    - 字段：id, email, company, message, status, created_at 等
 * 3. posts：文章表
 *    - 字段：id, title, slug, status, created_at 等
 *
 * 依赖项：
 * - #supabase/server：Supabase 服务端客户端
 * - ~/server/utils/auth：认证工具（requireAdminAuth）
 * - ~/utils/apiHandler：API 处理器工具（withApiHandler、createSuccessResponse、createErrorResponse）
 * - ~/utils/logger：日志记录器（logger、createRequestContext）
 *
 * 环境变量需求：
 * - SUPABASE_URL：Supabase 项目 URL
 * - SUPABASE_SECRET_KEY：Supabase service role key
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// serverSupabaseServiceRole：Supabase 服务端客户端
// 用于服务端访问 Supabase 数据库，使用 Service Role Key（最高权限）
import { serverSupabaseServiceRole } from '#supabase/server'

// requireAdminAuth：验证管理员身份
// 检查 JWT token，确保请求来自已登录的管理员
import { requireAdminAuth } from '~/server/utils/auth'

// withApiHandler：API 处理器包装器
// 统一处理响应格式、错误处理、日志记录等
// createSuccessResponse：创建成功响应
// createErrorResponse：创建错误响应
import { withApiHandler, createSuccessResponse, createErrorResponse } from '~/utils/apiHandler'

// logger：日志记录器
// createRequestContext：创建请求上下文（IP、User Agent 等）
import { logger, createRequestContext } from '~/utils/logger'

// ============================================================================
// 定义 API 端点处理器
// ============================================================================
// withApiHandler()：包装器函数，统一处理响应和错误
// - event：Nuxt 事件对象，包含请求信息
export default withApiHandler(async (event) => {
  // ============================================================================
  // 创建请求上下文
  // ============================================================================
  // createRequestContext()：创建请求上下文对象
  // 包含 IP、User Agent、请求时间等信息，用于日志记录和审计
  const requestContext = createRequestContext(event)

  // startTime：请求开始时间
  // 用于计算 API 处理时间（响应时间）
  const startTime = Date.now()

  // ============================================================================
  // 1. 验证管理员身份
  // ============================================================================
  // requireAdminAuth()：验证管理员身份
  // 检查 JWT token 是否有效，是否来自已登录的管理员
  // 如果验证失败，会抛出错误
  try {
    await requireAdminAuth(event)
  } catch (err: any) {
    // 如果验证失败，返回 401 错误
    // err.message：错误消息
    // err.statusCode：HTTP 状态码（默认 401）
    return createErrorResponse(err.message || 'Unauthorized', err.statusCode || 401)
  }

  // ============================================================================
  // 2. 获取针对后端的 Service Role 客户端
  // ============================================================================
  // serverSupabaseServiceRole()：获取 Supabase Service Role 客户端
  // 使用 Service Role Key（最高权限），可以绕过 RLS（行级安全）策略
  // 用于服务端数据库操作
  const client = serverSupabaseServiceRole(event)

  // ============================================================================
  // 3. 并发查询所有统计数据
  // ============================================================================
  try {
    // backendStartTime：后端查询开始时间
    // 用于计算后端数据库查询时间（Supabase 响应时间）
    const backendStartTime = Date.now()

    // 并行获取所有数据
    // Promise.all()：等待所有 Promise 完成
    // 优势：并发查询，总时间 = 最慢查询的时间，而非所有查询时间之和
    const [productsResult, inquiriesResult, postsResult] = await Promise.all([
      // 查询产品总数
      // client.from('products')：从 products 表查询
      // .select('id')：选择 id 字段（实际不需要，但 select 是必需的）
      // { count: 'exact', head: true }：只返回计数，不返回实际数据
      // count: 'exact'：返回精确计数
      // head: true：只返回头部信息（计数）
      client.from('products').select('id', { count: 'exact', head: true }),

      // 查询询盘总数
      client.from('inquiries').select('id', { count: 'exact', head: true }),

      // 查询文章总数
      client.from('posts').select('id', { count: 'exact', head: true }),
    ])

    // backendPing：后端数据库查询时间（毫秒）
    // 用于显示后端服务器的响应时间
    const backendPing = Date.now() - backendStartTime

    // 调试日志：查询结果
    console.log('[Dashboard API] Query results:', {
      products: productsResult,
      inquiries: inquiriesResult,
      posts: postsResult,
    })

    // 构建统计数据对象
    // stats：统计对象，包含产品、询盘、文章的总数
    const stats = {
      // 产品总数
      // productsResult.count || 0：如果有计数则使用计数，否则使用 0
      products: productsResult.count || 0,

      // 询盘总数
      inquiries: inquiriesResult.count || 0,

      // 文章总数
      posts: postsResult.count || 0,
    }

    console.log('[Dashboard API] Stats:', stats)

    // ============================================================================
    // 4. 获取最近的询盘
    // ============================================================================
    // client.from('inquiries')：从 inquiries 表查询
    // .select('*')：选择所有字段
    // .order('created_at', { ascending: false })：按创建时间降序排列（最新的在前）
    // .limit(5)：只返回最新的 5 条记录
    const { data: recentInquiries } = await client
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    // ============================================================================
    // 5. 检查服务器状态
    // ============================================================================
    // 从请求头获取实际的前端 URL
    // 为什么不使用 process.env？
    // - process.env 是配置的环境变量，可能与实际部署环境不同
    // - 从请求头获取可以准确反映当前请求的协议和主机
    //
    // x-forwarded-proto：请求头中的协议（http 或 https）
    // 由反向代理（如 Nginx、负载均衡器）设置
    const protocol = event.headers.get('x-forwarded-proto') || 'http'

    // host：请求头中的主机（域名和端口）
    // 例如：www.supercore.hk:3000
    const host = event.headers.get('host') || 'localhost:3000'

    // frontendUrl：前端服务器 URL
    const frontendUrl = `${protocol}://${host}`

    // backendUrl：后端服务器（Supabase）URL
    // 从环境变量读取
    const backendUrl = process.env.SUPABASE_URL || 'Unknown'

    // 计算总处理时间作为前端响应时间的近似值
    // frontendPing：API 处理时间（毫秒）
    // 包括数据库查询、数据处理、响应生成等所有时间
    const frontendPing = Date.now() - startTime

    // 构建服务器状态对象
    const serverStatus = {
      // Frontend Server 状态
      frontend: {
        url: frontendUrl, // 前端服务器 URL
        status: 'online', // 状态：在线（假设总是在线，因为正在响应请求）
        responseTime: frontendPing, // 响应时间（API 处理时间）
      },

      // Backend Server（Supabase）状态
      backend: {
        url: backendUrl, // 后端服务器 URL
        status: 'online', // 状态：在线（假设总是在线，因为查询成功）
        responseTime: backendPing, // 响应时间（Supabase 查询时间）
      },
    }

    // ============================================================================
    // 6. 记录成功日志
    // ============================================================================
    // logger.info()：记录信息级别的日志
    // 包含请求上下文、统计数据、询盘数量等信息
    await logger.info('Dashboard data loaded successfully', 'API' as any, {
      ...requestContext, // 请求上下文（IP、User Agent 等）
      stats, // 统计数据
      inquiriesCount: recentInquiries?.length || 0, // 询盘数量
    })

    // ============================================================================
    // 7. 返回成功响应
    // ============================================================================
    // createSuccessResponse()：创建成功响应
    // 包装数据，统一响应格式
    return createSuccessResponse({
      stats, // 统计数据
      recentInquiries: recentInquiries || [], // 近期询盘
      serverStatus, // 服务器状态
    })
  } catch (error: any) {
    // ============================================================================
    // 错误处理
    // ============================================================================
    // logger.error()：记录错误级别的日志
    // 包含错误对象、请求上下文等信息
    await logger.error('Failed to load dashboard data', error, 'API' as any, {
      ...requestContext, // 请求上下文
    })

    // 返回错误响应
    // error.message：错误消息
    // 500：HTTP 状态码（服务器内部错误）
    return createErrorResponse(error.message || 'Failed to load dashboard data', 500)
  }
})
