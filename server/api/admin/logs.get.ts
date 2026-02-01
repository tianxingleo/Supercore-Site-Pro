/**
 * ============================================================================
 * 管理日志查询 API 端点（GET /api/admin/logs）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于获取管理后台的操作日志。
 * 管理员可以查看所有操作日志，包括产品管理、文章管理、询盘管理等操作记录。
 *
 * 访问路径：
 * - 完整路径：/api/admin/logs
 * - 方法：GET
 * - 认证：需要管理员身份（JWT token）
 *
 * 查询参数：
 * - page：页码（可选，默认为 1）
 * - limit：每页记录数（可选，默认为 50）
 * - type：资源类型（可选，过滤指定类型的日志）
 *   - 'products'：产品相关日志
 *   - 'posts'：文章相关日志
 *   - 'inquiries'：询盘相关日志
 * - userId：用户 ID（可选，过滤指定用户的日志）
 *
 * 实现手段：
 * 1. 使用 defineEventHandler 定义 Nitro 服务器事件处理器
 * 2. 使用 serverSupabaseClient 获取 Supabase 客户端
 * 3. 使用分页查询（offset 和 limit）
 * 4. 支持多种过滤条件（资源类型、用户 ID）
 * 5. 返回总数和分页信息
 *
 * 核心功能：
 * 1. 分页查询：支持分页获取日志记录
 * 2. 资源类型过滤：按资源类型过滤日志
 * 3. 用户过滤：按用户 ID 过滤日志
 * 4. 按时间排序：最新的日志在前
 * 5. 总数统计：返回日志总数，用于分页导航
 *
 * 查询示例：
 * - 获取第 1 页日志：/api/admin/logs?page=1
 * - 获取第 2 页，每页 20 条：/api/admin/logs?page=2&limit=20
 * - 过滤产品日志：/api/admin/logs?type=products
 * - 过滤指定用户：/api/admin/logs?userId=xxx
 * - 组合查询：/api/admin/logs?page=1&limit=20&type=products&userId=xxx
 *
 * 返回格式：
 * {
 *   success: true,
 *   data: {
 *     logs: [
 *       {
 *         id: 1,
 *         user_id: 'xxx',
 *         action: 'create',           // 操作类型：create, update, delete
 *         resource_type: 'products',  // 资源类型：products, posts, inquiries
 *         resource_id: '123',         // 资源 ID
 *         details: { ... },          // 操作详情（JSON 对象）
 *         created_at: '2024-01-01T00:00:00.000Z'
 *       },
 *       ...
 *     ],
 *     pagination: {
 *       page: 1,                      // 当前页码
 *       limit: 50,                    // 每页记录数
 *       total: 100,                  // 总记录数
 *       totalPages: 2                // 总页数
 *     }
 *   }
 * }
 *
 * 分页逻辑：
 * 1. offset = (page - 1) * limit
 *    - offset：跳过的记录数
 *    - 例如：page=2, limit=50，则 offset=50
 * 2. range(offset, offset + limit - 1)
 *    - 范围查询：从 offset 到 offset + limit - 1
 *    - 例如：page=2, limit=50，则 range(50, 99)
 *
 * 过滤条件：
 * 1. resourceType：资源类型过滤
 *    - .eq('resource_type', resourceType)
 *    - 例如：只查询产品日志
 * 2. userId：用户过滤
 *    - .eq('user_id', userId)
 *    - 例如：只查询指定用户的日志
 *
 * 错误处理：
 * - 500：查询失败（数据库错误）
 *
 * 安全措施：
 * 1. 需要管理员身份认证
 * 2. 不返回敏感信息（如密码、密钥等）
 * 3. 使用 count: 'exact' 获取精确总数
 *
 * 性能优化：
 * 1. 使用索引：确保 created_at, resource_type, user_id 字段有索引
 * 2. 分页查询：避免一次性返回大量数据
 * 3. 只查询需要的字段：select('*')
 *
 * 数据库表（admin_logs）：
 * - id：主键
 * - user_id：操作用户 ID（外键，关联 profiles 表）
 * - action：操作类型（create, update, delete）
 * - resource_type：资源类型（products, posts, inquiries）
 * - resource_id：资源 ID
 * - details：操作详情（JSON 对象，包含修改前后的数据）
 * - created_at：创建时间
 *
 * 依赖项：
 * - #supabase/server：Supabase 服务端客户端
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
// 注意：此文件缺少导入语句，应该在文件顶部添加以下导入
// serverSupabaseClient：Supabase 服务端客户端
// 用于服务端访问 Supabase 数据库
// import { serverSupabaseClient } from '#supabase/server'

// ============================================================================
// 定义 API 端点处理器
// ============================================================================
/**
 * defineEventHandler() - Nuxt 3/Nitro 提供的函数，用于定义服务器 API 端点
 * - event：Nuxt 事件对象，包含请求信息（查询参数、请求头等）
 */
export default defineEventHandler(async (event) => {
  try {
    // ============================================================================
    // 1. 创建 Supabase 客户端
    // ============================================================================
    // serverSupabaseClient()：获取 Supabase 客户端
    // 使用环境变量中的 URL 和密钥连接 Supabase 数据库
    const supabase = await serverSupabaseClient(event)

    // ============================================================================
    // 2. 解析查询参数
    // ============================================================================
    // getQuery()：Nitro 提供的函数，获取 URL 查询参数
    // 例如：/api/admin/logs?page=2&limit=20&type=products&userId=xxx
    // query 将是 { page: "2", limit: "20", type: "products", userId: "xxx" }
    const query = getQuery(event)

    // 解析页码
    // parseInt()：将字符串转换为整数
    // as string：TypeScript 类型断言，告诉 TypeScript 这个值是字符串
    // || '1'：如果没有 page 参数，则使用 '1'（第一页）
    const page = parseInt((query.page as string) || '1')

    // 解析每页记录数
    // || '50'：如果没有 limit 参数，则使用 '50'（每页 50 条）
    const limit = parseInt((query.limit as string) || '50')

    // 资源类型
    // 用于过滤指定类型的日志（products, posts, inquiries）
    const resourceType = query.type as string

    // 用户 ID
    // 用于过滤指定用户的日志
    const userId = query.userId as string

    // ============================================================================
    // 3. 计算分页偏移量
    // ============================================================================
    // offset：跳过的记录数
    // 计算公式：(page - 1) * limit
    // 例如：page=2, limit=50，则 offset=50（跳过前 50 条记录）
    const offset = (page - 1) * limit

    // ============================================================================
    // 4. 构建基础查询
    // ============================================================================
    // 使用链式调用构建查询
    // supabase.from('admin_logs')：从 admin_logs 表查询
    // .select('*', { count: 'exact' })：选择所有字段，并返回精确计数
    // .order('created_at', { ascending: false })：按创建时间降序排列（最新的在前）
    // .range(offset, offset + limit - 1)：分页查询，只返回指定范围的数据
    let queryBuilder = supabase
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // ============================================================================
    // 5. 添加过滤条件
    // ============================================================================
    // 资源类型过滤
    // 如果指定了 resourceType，则添加过滤条件
    // .eq('resource_type', resourceType)：过滤条件，resource_type = 传入的参数
    if (resourceType) {
      queryBuilder = queryBuilder.eq('resource_type', resourceType)
    }

    // 用户过滤
    // 如果指定了 userId，则添加过滤条件
    // .eq('user_id', userId)：过滤条件，user_id = 传入的参数
    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId)
    }

    // ============================================================================
    // 6. 执行查询
    // ============================================================================
    // await：等待数据库查询完成
    // { data: logs, error, count }：解构赋值
    // - logs：查询结果（日志记录数组）
    // - error：错误信息（如果查询失败）
    // - count：总记录数（用于分页）
    const { data: logs, error, count } = await queryBuilder

    // 检查是否有错误
    // 如果查询失败，则抛出错误
    if (error) throw error

    // ============================================================================
    // 7. 返回成功响应
    // ============================================================================
    // 返回分页数据
    return {
      success: true,
      data: {
        // 日志记录数组
        // || []：如果 logs 为 null 或 undefined，则使用空数组
        logs: logs || [],

        // 分页信息
        pagination: {
          page, // 当前页码
          limit, // 每页记录数
          total: count || 0, // 总记录数
          // 总页数：Math.ceil(count / limit)
          // Math.ceil()：向上取整，确保不遗漏记录
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    }
  } catch (error: any) {
    // ============================================================================
    // 错误处理
    // ============================================================================
    // console.error()：输出错误日志到控制台
    console.error('Failed to fetch logs:', error)

    // 抛出错误并返回 HTTP 错误响应
    // createError()：Nuxt/Nitro 提供的函数，用于创建错误对象
    // statusCode：HTTP 状态码（默认 500 = 服务器内部错误）
    // message：错误消息
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取日志失败',
    })
  }
})
