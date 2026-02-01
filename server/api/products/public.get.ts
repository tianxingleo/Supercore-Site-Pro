/**
 * ============================================================================
 * 产品公开 API 端点（GET /api/products/public）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于获取已发布的产品列表。
 * 前端页面（如产品列表页、首页等）会调用此 API 来展示产品信息。
 *
 * 访问路径：
 * - 完整路径：/api/products/public
 * - 支持查询参数：?limit=3（限制返回 3 条记录）
 * - 示例：/api/products/public?limit=3
 *
 * 实现手段：
 * 1. 使用 defineEventHandler() 定义 Nitro 服务器事件处理器
 * 2. 使用 Supabase SDK（@supabase/supabase-js）连接数据库
 * 3. 使用 service role key（SUPABASE_SECRET_KEY）进行数据库操作
 * 4. 查询条件：status='published'（只返回已发布的产品）
 * 5. 排序：按 created_at 降序（最新的产品在前）
 * 6. 数据映射：将数据库字段转换为前端所需的格式
 * 7. 多语言支持：处理 cn/hk/en 等不同的 locale 键
 *
 * 关键功能：
 * - 数据验证：检查 Supabase 配置是否正确
 * - 错误处理：返回 HTTP 错误状态码和错误消息
 * - 多语言映射：支持 cn/hk/en 等不同的 locale 键向后兼容
 * - 分页支持：可选的 limit 参数限制返回数量
 *
 * 数据库表结构（products 表）：
 * - id: 主键
 * - slug: URL 友好的唯一标识符
 * - name: 产品名称（多语言对象）
 * - description: 产品描述（多语言对象）
 * - specs: 产品规格（JSON 对象）
 * - images: 产品图片数组
 * - category: 产品类别
 * - is_featured: 是否为推荐产品
 * - status: 状态（draft, published）
 * - created_at: 创建时间
 *
 * 返回格式：
 * 直接返回产品数组（不是 { success: true, data: [...] } 结构）
 * 与 news API 保持一致的返回格式
 *
 * 返回示例：
 * [
 *   {
 *     id: "1",
 *     slug: "gpu-server-a100",
 *     name: {
 *       "zh-CN": "A100 GPU 服务器",
 *       "zh-HK": "A100 GPU 伺服器",
 *       "en": "A100 GPU Server"
 *     },
 *     description: { ... },
 *     specs: { ... },
 *     images: [ ... ],
 *     category: "generalCompute",
 *     featured: true,
 *     createdAt: "2024-01-01T00:00:00.000Z"
 *   },
 *   ...
 * ]
 *
 * 错误处理：
 * - 500：Supabase 配置缺失
 * - 500：数据库查询错误
 *
 * 安全说明：
 * - 使用 SUPABASE_SECRET_KEY（service role key）而非 anon key
 * - 原因：服务端 API 需要绕过 RLS（行级安全）策略，访问所有数据
 * - 前端不直接访问此 API，所有请求通过 Nuxt 服务器转发
 * - 前端使用的是公开密钥（SUPABASE_ANON_KEY）
 *
 * 性能优化：
 * - 使用 index 确保 status 字段有索引（建议）
 * - 使用 index 确保 created_at 字段有索引（建议）
 * - limit 参数减少不必要的数据传输
 *
 * 依赖项：
 * - @supabase/supabase-js：Supabase SDK
 * - ~/types：TypeScript 类型定义
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
// createClient：Supabase 客户端创建函数
// 用于连接 Supabase 数据库
import { createClient } from '@supabase/supabase-js'

// Product：产品类型定义
// 定义了产品的数据结构，用于 TypeScript 类型检查
import type { Product } from '~/types'

// ============================================================================
// 定义 API 端点处理器
// ============================================================================
// defineEventHandler()：Nuxt 3/Nitro 提供的函数，用于定义服务器 API 端点
// - event：Nuxt 事件对象，包含请求信息（查询参数、请求体等）
// - async：异步函数，可以等待数据库查询等耗时操作
export default defineEventHandler(async (event) => {
  // ============================================================================
  // 获取查询参数
  // ============================================================================
  // getQuery()：Nitro 提供的函数，获取 URL 查询参数
  // 例如：/api/products/public?limit=3
  // query 将是 { limit: "3" }
  const query = getQuery(event)

  // 解析 limit 参数
  // query.limit：查询参数中的 limit 值（字符串类型）
  // parseInt()：将字符串转换为整数
  // as string：TypeScript 类型断言，告诉 TypeScript 这个值是字符串
  // undefined：如果没有 limit 参数，则返回 undefined（表示不限制数量）
  const limit = query.limit ? parseInt(query.limit as string) : undefined

  // ============================================================================
  // 验证 Supabase 配置
  // ============================================================================
  // process.env：Node.js 提供的环境变量对象
  // SUPABASE_URL：Supabase 项目 URL
  // SUPABASE_SECRET_KEY：Supabase 服务端密钥（service role key）
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  // 检查配置是否完整
  // !supabaseUrl || !supabaseKey：如果 URL 或密钥任意一个缺失
  if (!supabaseUrl || !supabaseKey) {
    // 抛出错误并返回 HTTP 500 错误
    // createError()：Nuxt/Nitro 提供的函数，用于创建错误对象
    // statusCode：HTTP 状态码
    // message：错误消息
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing',
    })
  }

  // ============================================================================
  // 创建 Supabase 客户端
  // ============================================================================
  // createClient()：创建 Supabase 客户端实例
  // 参数：
  // 1. supabaseUrl：Supabase 项目 URL
  // 2. supabaseKey：服务端密钥（service role key）
  // 3. 选项对象
  const client = createClient(supabaseUrl, supabaseKey, {
    // auth：认证配置
    auth: {
      // autoRefreshToken：自动刷新令牌
      // false：服务端 API 不需要令牌刷新，因为使用 service role key
      autoRefreshToken: false,

      // persistSession：持久化会话
      // false：服务端 API 不需要持久化会话
      persistSession: false,
    },
  })

  // ============================================================================
  // 构建数据库查询
  // ============================================================================
  // 使用链式调用构建查询
  // client.from('products')：从 products 表查询
  // .select('*')：选择所有字段
  // .eq('status', 'published')：过滤条件，只返回已发布的产品
  // .order('created_at', { ascending: false })：按创建时间降序排列（最新的在前）
  let queryBuilder = client
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  // 如果有 limit 参数，则限制返回数量
  // limit(n)：只返回前 n 条记录
  if (limit) {
    queryBuilder = queryBuilder.limit(limit)
  }

  // 执行查询
  // await：等待数据库查询完成
  // { data, error }：解构赋值，data 是查询结果，error 是错误信息
  const { data, error } = await queryBuilder

  // 检查是否有错误
  if (error) {
    // 抛出错误并返回 HTTP 500 错误
    // error.message：数据库返回的错误消息
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // ============================================================================
  // 数据映射：将数据库格式转换为前端格式
  // ============================================================================
  // mappedProducts：映射后的产品数组
  // Product[]：TypeScript 类型，表示 Product 类型的数组
  // (data || [])：如果 data 为 null 或 undefined，则使用空数组
  // .map()：数组方法，遍历每个元素并转换
  const mappedProducts: Product[] = (data || []).map((item) => ({
    // id：产品 ID
    // String(item.id)：将数据库的数字 ID 转换为字符串（前端统一使用字符串 ID）
    id: String(item.id),

    // slug：产品 URL 标识符
    // 直接使用数据库的 slug 值
    slug: item.slug,

    // name：产品名称（多语言对象）
    // 数据库格式：{ cn: "...", hk: "...", en: "..." } 或 { 'zh-CN': "...", 'zh-HK': "...", en: "..." }
    // 前端格式：{ 'zh-CN': "...", 'zh-HK': "...", en: "..." }
    // 使用 || 运算符实现向后兼容：
    // - item.name.cn：优先使用 cn 键（旧格式）
    // - item.name['zh-CN']：如果 cn 不存在，则使用 'zh-CN' 键（新格式）
    // - ''：如果都不存在，则使用空字符串作为默认值
    name: {
      'zh-CN': item.name.cn || item.name['zh-CN'] || '',
      'zh-HK': item.name.hk || item.name['zh-HK'] || '',
      en: item.name.en || '',
    },

    // description：产品描述（多语言对象）
    // 逻辑与 name 相同
    description: {
      'zh-CN': item.description.cn || item.description['zh-CN'] || '',
      'zh-HK': item.description.hk || item.description['zh-HK'] || '',
      en: item.description.en || '',
    },

    // specs：产品规格（JSON 对象）
    // || {}：如果 specs 为 null 或 undefined，则使用空对象
    specs: item.specs || {},

    // images：产品图片数组
    // || []：如果 images 为 null 或 undefined，则使用空数组
    images: item.images || [],

    // category：产品类别
    // 直接使用数据库的 category 值
    category: item.category,

    // featured：是否为推荐产品
    // 数据库字段：is_featured（布尔值）
    // 前端字段：featured（布尔值）
    // || false：如果 is_featured 为 null 或 undefined，则默认为 false
    featured: item.is_featured || false,

    // createdAt：创建时间
    // 直接使用数据库的 created_at 值（ISO 8601 格式的字符串）
    createdAt: item.created_at,
  }))

  // ============================================================================
  // 返回数据
  // ============================================================================
  // 直接返回产品数组（不是 { success: true, data: [...] } 结构）
  // 与 news API 保持一致的返回格式
  // 前端 pages/products/index.vue 会直接使用这个数组
  return mappedProducts
})
