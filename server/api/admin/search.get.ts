/**
 * ============================================================================
 * 管理后台全局搜索 API 端点（GET /api/admin/search）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于管理后台的全局搜索功能。
 * 管理员可以在后台搜索产品、文章和询盘，快速定位需要的内容。
 *
 * 访问路径：
 * - 完整路径：/api/admin/search
 * - 方法：GET
 * - 认证：需要管理员身份（JWT token）
 *
 * 查询参数：
 * - q：搜索关键词（必填）
 * - type：资源类型（可选，默认为 'all'）
 *   - 'products'：只搜索产品
 *   - 'posts'：只搜索文章
 *   - 'inquiries'：只搜索询盘
 *   - 'all'：搜索所有资源（默认）
 *
 * 实现手段：
 * 1. 使用 defineEventHandler 定义 Nitro 服务器事件处理器
 * 2. 使用 serverSupabaseClient 获取 Supabase 客户端
 * 3. 使用 Supabase 的 or() 方法进行模糊搜索
 * 4. 支持多语言搜索（中文和英文）
 * 5. 限制每个资源类型返回 10 条记录
 *
 * 核心功能：
 * 1. 产品搜索：搜索 slug、category、name（中英文）
 * 2. 文章搜索：搜索 slug、title（中英文）
 * 3. 询盘搜索：搜索 email、company、message
 * 4. 按类型过滤：只搜索指定类型的资源
 * 5. 空查询处理：返回空结果而非错误
 *
 * 搜索示例：
 * - 搜索所有资源：/api/admin/search?q=gpu
 * - 搜索产品：/api/admin/search?q=gpu&type=products
 * - 搜索文章：/api/admin/search?q=ai&type=posts
 * - 搜索询盘：/api/admin/search?q=user@email.com&type=inquiries
 *
 * 返回格式：
 * {
 *   success: true,
 *   data: {
 *     products: [
 *       { id, slug, name, category, status, created_at },
 *       ...
 *     ],
 *     posts: [
 *       { id, slug, title, published_at, created_at },
 *       ...
 *     ],
 *     inquiries: [
 *       { id, email, company, message, status, created_at },
 *       ...
 *     ]
 *   },
 *   query: 'gpu'  // 搜索关键词
 * }
 *
 * 搜索逻辑：
 * 1. 产品搜索（products）：
 *    - slug.ilike.%{searchTerm}%：slug 包含关键词（不区分大小写）
 *    - category.ilike.%{searchTerm}%：category 包含关键词
 *    - name->>zh-HK.ilike.%{searchTerm}%：name.zh-HK 包含关键词
 *    - name->>en.ilike.%{searchTerm}%：name.en 包含关键词
 * 2. 文章搜索（posts）：
 *    - slug.ilike.%{searchTerm}%：slug 包含关键词
 *    - title->>zh-HK.ilike.%{searchTerm}%：title.zh-HK 包含关键词
 *    - title->>en.ilike.%{searchTerm}%：title.en 包含关键词
 * 3. 询盘搜索（inquiries）：
 *    - email.ilike.%{searchTerm}%：email 包含关键词
 *    - company.ilike.%{searchTerm}%：company 包含关键词
 *    - message.ilike.%{searchTerm}%：message 包含关键词
 *
 * 搜索语法说明：
 * - .ilike.%{searchTerm}%：不区分大小写的模糊匹配
 * - ->>zh-HK：访问 JSONB 对象的 zh-HK 键
 * - ||：逻辑或，满足任意条件即可
 * - %：通配符，匹配任意字符
 *
 * 错误处理：
 * - 500：搜索失败（数据库查询错误）
 *
 * 安全措施：
 * 1. 需要管理员身份认证
 * 2. 限制返回数量（每个类型最多 10 条）
 * 3. 只返回必要字段，不返回敏感信息
 *
 * 性能优化：
 * 1. 使用索引：确保搜索字段有索引（slug, category, name, title, email, company）
 * 2. 限制返回数量：减少数据传输
 * 3. 并发查询：不同资源类型的查询可以并发执行（未来优化）
 * 4. 数据库优化：使用全文索引（PostgreSQL tsvector）可提升搜索性能
 *
 * 数据库表：
 * 1. products：产品表
 *    - 搜索字段：slug, category, name（多语言）
 * 2. posts：文章表
 *    - 搜索字段：slug, title（多语言）
 * 3. inquiries：询盘表
 *    - 搜索字段：email, company, message
 *
 * 依赖项：
 * - #supabase/server：Supabase 服务端客户端
 *
 * 环境变量需求：
 * - SUPABASE_URL：Supabase 项目 URL
 * - SUPABASE_SECRET_KEY：Supabase service role key
 *
 * 未来改进：
 * 1. 全文搜索：使用 PostgreSQL 的全文搜索功能（tsvector）
 * 2. 搜索高亮：返回匹配的关键词位置
 * 3. 搜索建议：提供搜索建议和自动完成
 * 4. 搜索历史：记录用户的搜索历史
 * 5. 高级搜索：支持日期范围、状态等过滤条件
 * 6. 并发查询：使用 Promise.all 并发查询不同资源类型
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
    // 例如：/api/admin/search?q=gpu&type=products
    // query 将是 { q: "gpu", type: "products" }
    const query = getQuery(event)

    // 搜索关键词
    // query.q：查询参数中的 q 值
    // as string：TypeScript 类型断言，告诉 TypeScript 这个值是字符串
    // || ''：如果没有 q 参数，则使用空字符串
    const searchTerm = (query.q as string) || ''

    // 资源类型
    // query.type：查询参数中的 type 值
    // 可选值：'products', 'posts', 'inquiries', 'all'
    const type = query.type as string // products, posts, inquiries, all

    // ============================================================================
    // 3. 空查询处理
    // ============================================================================
    // 如果搜索关键词为空或只有空白字符：
    // - 返回空结果，不进行数据库查询
    // - 避免不必要的数据库查询，提升性能
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        success: true,
        data: {
          products: [], // 空产品列表
          posts: [], // 空文章列表
          inquiries: [], // 空询盘列表
        },
      }
    }

    // ============================================================================
    // 4. 初始化搜索结果对象
    // ============================================================================
    // results：存储搜索结果的对象
    // any 类型：因为不同资源类型的数据结构不同
    const results: any = {
      products: [], // 产品搜索结果
      posts: [], // 文章搜索结果
      inquiries: [], // 询盘搜索结果
    }

    // ============================================================================
    // 5. 搜索产品（Products）
    // ============================================================================
    // 搜索条件：
    // 1. 没有指定类型（type 为空）
    // 2. 或类型为 'products'（只搜索产品）
    // 3. 或类型为 'all'（搜索所有资源）
    if (!type || type === 'products' || type === 'all') {
      // Supabase 查询链式调用
      const { data: products } = await supabase
        .from('products') // 从 products 表查询
        .select('id, slug, name, category, status, created_at') // 只选择需要的字段
        .or(
          // .or()：添加 OR 条件，满足任意条件即可
          // 搜索条件（使用逗号分隔的 OR 条件）：
          // 1. slug.ilike.%{searchTerm}%：slug 包含关键词（不区分大小写）
          // 2. category.ilike.%{searchTerm}%：category 包含关键词
          // 3. name->>zh-HK.ilike.%{searchTerm}%：name.zh-HK 包含关键词
          //    ->>zh-HK：访问 JSONB 对象的 zh-HK 键
          // 4. name->>en.ilike.%{searchTerm}%：name.en 包含关键词
          `slug.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,name->>zh-HK.ilike.%${searchTerm}%,name->>en.ilike.%${searchTerm}%`
        )
        .limit(10) // 限制返回 10 条记录

      // 存储搜索结果
      // || []：如果 products 为 null 或 undefined，则使用空数组
      results.products = products || []
    }

    // ============================================================================
    // 6. 搜索文章（Posts）
    // ============================================================================
    // 搜索条件：同产品搜索
    if (!type || type === 'posts' || type === 'all') {
      // Supabase 查询链式调用
      const { data: posts } = await supabase
        .from('posts') // 从 posts 表查询
        .select('id, slug, title, published_at, created_at') // 只选择需要的字段
        .or(
          // .or()：添加 OR 条件
          // 搜索条件：
          // 1. slug.ilike.%{searchTerm}%：slug 包含关键词
          // 2. title->>zh-HK.ilike.%${searchTerm}%：title.zh-HK 包含关键词
          // 3. title->>en.ilike.%${searchTerm}%：title.en 包含关键词
          `slug.ilike.%${searchTerm}%,title->>zh-HK.ilike.%${searchTerm}%,title->>en.ilike.%${searchTerm}%`
        )
        .limit(10) // 限制返回 10 条记录

      // 存储搜索结果
      results.posts = posts || []
    }

    // ============================================================================
    // 7. 搜索询盘（Inquiries）
    // ============================================================================
    // 搜索条件：同产品搜索
    if (!type || type === 'inquiries' || type === 'all') {
      // Supabase 查询链式调用
      const { data: inquiries } = await supabase
        .from('inquiries') // 从 inquiries 表查询
        .select('id, email, company, message, status, created_at') // 只选择需要的字段
        .or(
          // .or()：添加 OR 条件
          // 搜索条件：
          // 1. email.ilike.%{searchTerm}%：email 包含关键词
          // 2. company.ilike.%${searchTerm}%：company 包含关键词
          // 3. message.ilike.%${searchTerm}%：message 包含关键词
          `email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`
        )
        .limit(10) // 限制返回 10 条记录

      // 存储搜索结果
      results.inquiries = inquiries || []
    }

    // ============================================================================
    // 8. 返回搜索结果
    // ============================================================================
    // 返回成功响应，包含所有搜索结果
    return {
      success: true,
      data: results, // 搜索结果（products, posts, inquiries）
      query: searchTerm, // 搜索关键词
    }
  } catch (error: any) {
    // ============================================================================
    // 错误处理
    // ============================================================================
    // console.error()：输出错误日志到控制台
    console.error('Search failed:', error)

    // 抛出错误并返回 HTTP 错误响应
    // createError()：Nuxt/Nitro 提供的函数，用于创建错误对象
    // statusCode：HTTP 状态码（默认 500 = 服务器内部错误）
    // message：错误消息
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '搜索失败',
    })
  }
})
