/**
 * ============================================================================
 * 公开新闻列表 API 端点（GET /api/news/public）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于获取已发布的新闻列表。
 * 前端新闻列表页会调用此 API 获取新闻数据。
 *
 * 访问路径：
 * - 完整路径：/api/news/public
 * - 方法：GET
 * - 认证：不需要身份认证（公开访问）
 *
 * 查询参数：
 * - limit：限制返回的新闻数量（可选，例如：?limit=3）
 *
 * 实现手段：
 * 1. 使用 defineEventHandler 定义 Nitro 服务器事件处理器
 * 2. 使用 createClient 创建 Supabase 客户端（公开密钥）
 * 3. 查询已发布的新闻（status = 'published'）
 * 4. 按发布时间降序排列（最新的在前）
 * 5. 支持分页（可选的 limit 参数）
 *
 * 核心功能：
 * 1. 解析查询参数：获取 limit 参数
 * 2. 验证 Supabase 配置：检查环境变量是否配置
 * 3. 连接数据库：使用公开密钥（SUPABASE_KEY）
 * 4. 查询已发布新闻：
 *    - status = 'published'（只获取已发布的文章）
 *    - published_at <= 当前时间（避免获取未来发布的内容）
 * 5. 排序：按 published_at 降序（最新的在前）
 * 6. 限制数量：根据 limit 参数限制返回数量
 *
 * 返回格式：
 * [
 *   {
 *     id: 1,
 *     slug: 'news-article-slug',
 *     title: {
 *       'zh-CN': '新闻标题（简体）',
 *       'zh-HK': '新聞標題（繁體）',
 *       'en': 'News Title (English)'
 *     },
 *     summary: {
 *       'zh-CN': '文章摘要（简体）',
 *       'zh-HK': '文章摘要（繁體）',
 *       'en: 'Article summary (English)'
 *     },
 *     cover_image: 'https://...',
 *     created_at: '2024-01-01T00:00:00.000Z',
 *     updated_at: '2024-01-01T00:00:00.000Z',
 *     published_at: '2024-01-01T00:00:00.000Z',
 *     status: 'published',
 *     tags: ['AI', 'GPU', 'Server'],
 *   },
 *   ...
 * ]
 *
 * 示例请求：
 * - 获取所有已发布新闻：/api/news/public
 * - 获取最新 3 篇新闻：/api/news/public?limit=3
 *
 * 错误处理：
 * - 500：Supabase 配置缺失
 * - 500：数据库查询失败
 *
 * 安全措施：
 * 1. 使用公开密钥（SUPABASE_KEY）而非 Service Role Key
 * 2. 配合 Supabase 的行级安全（RLS）策略限制访问
 * 3. 只返回已发布的文章（status = 'published'）
 * 4. 避免返回敏感信息（如草稿、私人内容）
 *
 * 性能优化：
 * 1. 查询索引：确保 published_at 字段有索引
 * 2. 限制返回数量：避免返回过多数据
 * 3. 使用 select('*') 而非只需要部分字段
 * 4. 客户端配置：autoRefreshToken: false, persistSession: false
 *
 * 数据库表结构（posts 表）：
 * - id：主键
 * - slug：URL 友好标识符（唯一）
 * - title：标题（多语言对象）
 * - summary：摘要（多语言对象）
 * - cover_image：封面图片 URL
 * - content：内容（多语言对象，HTML 或 Markdown）
 * - tags：标签数组
 * - status：状态（draft, published）
 * - created_at：创建时间
 * - updated_at：更新时间
 * - published_at：发布时间
 *
 * 依赖项：
 * - @supabase/supabase-js：Supabase SDK
 * - ~/types：TypeScript 类型定义
 *
 * 环境变量需求：
 * - SUPABASE_URL：Supabase 项目 URL
 * - SUPABASE_KEY：Supabase 公开密钥（anon key）
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// createClient：Supabase 客户端创建函数
// 用于连接 Supabase 数据库
import { createClient } from '@supabase/supabase-js'

// Post：新闻文章类型定义
// 包含文章的所有字段，用于 TypeScript 类型检查
import type { Post } from '~/types'

// ============================================================================
// 定义 API 端点处理器
// ============================================================================
/**
 * defineEventHandler() - Nuxt 3/Nitro 提供的函数，用于定义服务器 API 端点
 * - event：Nuxt 事件对象，包含请求信息（查询参数、请求头等）
 */
export default defineEventHandler(async (event) => {
  // ============================================================================
  // 1. 解析查询参数
  // ============================================================================
  // getQuery()：Nitro 提供的函数，获取 URL 查询参数
  // 例如：/api/news/public?limit=3
  // query 将是 { limit: "3" }
  const query = getQuery(event)

  // 解析 limit 参数
  // parseInt()：将字符串转换为整数
  // as string：TypeScript 类型断言，告诉 TypeScript 这个值是字符串
  // || undefined：如果没有 limit 参数，则返回 undefined（表示不限制数量）
  const limit = query.limit ? parseInt(query.limit as string) : undefined

  // ============================================================================
  // 2. 验证 Supabase 配置
  // ============================================================================
  // 从环境变量中读取 Supabase URL 和公开密钥
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_KEY

  // 检查配置是否完整
  // !supabaseUrl || !supabaseKey：如果 URL 或密钥任意一个缺失
  if (!supabaseUrl || !supabaseKey) {
    // 抛出错误并返回 HTTP 500 错误
    // createError()：Nuxt/Nitro 提供的函数，用于创建错误对象
    // statusCode：HTTP 状态码（500 = 服务器内部错误）
    // message：错误消息
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing',
    })
  }

  // ============================================================================
  // 3. 创建 Supabase 客户端
  // ============================================================================
  // createClient()：创建 Supabase 客户端实例
  // 参数：
  // 1. supabaseUrl：Supabase 项目 URL
  // 2. supabaseKey：Supabase 公开密钥（anon key）
  // 3. 选项对象：配置客户端行为
  const client = createClient(supabaseUrl, supabaseKey, {
    // auth：认证配置
    auth: {
      // autoRefreshToken：自动刷新令牌
      // false：服务端 API 不需要令牌刷新，因为使用公开密钥
      autoRefreshToken: false,

      // persistSession：持久化会话
      // false：服务端 API 不需要持久化会话
      persistSession: false,
    },
  })

  // ============================================================================
  // 4. 构建数据库查询
  // ============================================================================
  // client.from('posts')：从 posts 表查询
  // .select('*')：选择所有字段
  // .not()：添加 NOT 过滤条件
  client
    .from('posts')
    .select('*')
    // .not('published_at', 'is', null)：排除未设置发布时间的文章
    // 这也确保只返回已发布的文章
    .not('published_at', 'is', null)
    // .lte('published_at', 'is', new Date().toISOString())：只获取已发布的文章
    // <= 当前时间，避免获取未来发布的内容
    .lte('published_at', 'is', new Date().toISOString())

    // .order('published_at', { ascending: false })：按发布时间降序排列
    // ascending: false：降序（最新的在前）
    // 如果是 true，则是升序（最早的在前）
    .order('published_at', { ascending: false })

  // ============================================================================
  // 5. 限制返回数量
  // ============================================================================
  // let queryBuilder：使用临时变量存储查询构建器
  // 这样可以链式调用，但不会直接修改原始查询
  let queryBuilder = client
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', 'is', new Date().toISOString())
    .order('published_at', { ascending: false })

  // 如果有 limit 参数，则限制返回数量
  // limit(n)：只返回前 n 条记录
  if (limit) {
    queryBuilder = queryBuilder.limit(limit)
  }

  // ============================================================================
  // 6. 执行查询
  // ============================================================================
  // await：等待数据库查询完成
  // { data, error }：解构赋值
  // - data：查询结果（新闻文章数组）
  // - error：错误信息（如果查询失败）
  const { data, error } = await queryBuilder

  // ============================================================================
  // 7. 错误处理
  // ============================================================================
  // 如果查询失败，则抛出错误
  if (error) {
    // createError()：创建错误对象
    // statusCode：HTTP 状态码（500 = 服务器内部错误）
    // message：错误消息（数据库返回的错误信息）
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // ============================================================================
  // 8. 返回新闻数据
  // ============================================================================
  // 返回新闻文章数组
  // 如果查询结果为空或为 null，则返回空数组 []
  // (data || [])：如果 data 为 null 或 undefined，则使用空数组
  return (data as Post[]) || []
})
