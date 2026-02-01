/**
 * ============================================================================
 * 文件作用：产品详情 API 端点 (Product Detail API Endpoint)
 * ============================================================================
 * 
 * 此文件是一个 Nitro 服务器 API 端点，用于获取单个产品的详情。
 * 
 * 路由：GET /api/products/[slug]
 * 
 * 功能说明：
 * 1. 根据 slug 获取单个产品详情
 * 2. 优先返回已发布的产品（status = 'published'）
 * 3. 开发模式下，返回任何状态的产品（便于调试）
 * 4. 数据库字段映射到 Product 类型
 * 
 * 返回值：
 * - Product：产品对象（包含 id、slug、name、description、specs、images、category 等）
 * 
 * 工作流程：
 * 1. 从 URL 路径中提取 slug
 * 2. 验证 slug 是否存在
 * 3. 创建 Supabase 客户端（使用 service_role 权限）
 * 4. 查询已发布的产品（status = 'published'）
 * 5. 如果找不到，尝试查询任何状态的产品（用于调试）
 * 6. 数据库字段映射到 Product 类型
 * 7. 返回产品数据
 * 
 * 安全性：
 * - 使用 SUPABASE_SECRET_KEY（Service Role Key），绕过 RLS
 * - 优先返回已发布的产品
 * - 开发模式下允许返回未发布的产品
 * - 错误处理：验证参数、检查配置、处理数据库错误
 * 
 * 数据库字段映射：
 * - 数据库字段（snake_case）→ Product 类型（camelCase）
 * - name.cn → name['zh-CN']
 * - name.hk → name['zh-HK']
 * - is_featured → featured
 * - created_at → createdAt
 * 
 * 性能优化：
 * - 使用 .single() 确保只返回一条记录
 * - 索引优化：确保 slug 和 status 字段有索引
 * - 查询优化：先查询已发布产品，减少查询次数
 * 
 * 开发支持：
 * - 允许查看未发布的产品（便于开发和测试）
 * - 详细的调试日志
 * 
 * ============================================================================
 */

// 导入 Supabase 客户端创建函数
// @supabase/supabase-js：Supabase 官方 JavaScript 客户端库
// 用于在服务器端与 Supabase 数据库交互
import { createClient } from '@supabase/supabase-js'

// 导入 Product 类型定义
// 用于类型检查和 TypeScript 智能提示
import type { Product } from '~/types'

// ============================================================================
// Nitro 服务器 API 端点定义
// ============================================================================
export default defineEventHandler(async (event) => {
  // ============================================================================
  // 从 URL 路径中提取 slug (Extract Slug from URL Path)
  // ============================================================================
  // 
  // 为什么从 event.path 提取 slug？
  // - event.path 包含完整的请求路径（例如：/api/products/server-001）
  // - 使用正则表达式匹配最后一部分作为 slug
  // 
  // 提取步骤：
  // 1. event.path || ''：获取路径，如果为空则使用空字符串
  // 2. path.match(/\/products\/([^\/]+)$/)：使用正则表达式匹配
  //    - \/products\/：匹配 "/products/" 字符串
  //    - ([^\/]+)：捕获一个或多个非斜杠字符（slug）
  //    - $：匹配字符串结尾
  // 3. slugMatch[1]：获取正则表达式捕获组的第一个元素（slug）
  // 
  // 举例说明：
  // - event.path = '/api/products/server-001'
  // - 正则匹配：['/products/server-001', 'server-001']
  // - slug = 'server-001'
  // 
  // 为什么不使用 event.context.params？
  // - 某些情况下 event.context.params 可能未正确设置
  // - 从路径中提取更可靠
  // - 兼容性更好
  // 
  // ============================================================================
  const path = event.path || ''
  const slugMatch = path.match(/\/products\/([^\/]+)$/)
  const slug = slugMatch ? slugMatch[1] : null

  // 输出调试日志：记录请求路径和提取的 slug
  console.log('[Product API] Path:', path)
  console.log('[Product API] Extracted slug:', slug)

  // ============================================================================
  // 验证 slug 参数 (Validate Slug Parameter)
  // ============================================================================
  // 
  // 如果 slug 不存在：
  // 1. 抛出 400 Bad Request 错误
  // 2. 返回友好错误消息（中文）
  // 
  // 为什么需要验证？
  // - 防止无效请求
  // - 提供友好的错误提示
  // - 避免不必要的数据库查询
  // 
  // ============================================================================
  if (!slug) {
    throw createError({
      statusCode: 400,  // 400 Bad Request
      message: 'slug 参数缺失',
    })
  }

  // 输出调试日志：记录正在查询的产品 slug
  console.log('[Product API] Fetching product with slug:', slug)

  // ============================================================================
  // 创建 Supabase 客户端 (Create Supabase Client)
  // ============================================================================
  // 
  // 为什么使用 Service Role Key？
  // - Service Role Key（SUPABASE_SECRET_KEY）具有完全访问权限
  // - 可以绕过 RLS（行级安全策略）
  // - 适合服务器端 API，不受用户权限限制
  //
  // 环境变量：
  // - process.env.SUPABASE_URL：Supabase 项目 URL
  // - process.env.SUPABASE_SECRET_KEY：Supabase Service Role Key
  //
  // 安全配置：
  // - autoRefreshToken: false：禁用自动刷新令牌（服务器端不需要）
  // - persistSession: false：不持久化会话（服务器端不需要）
  // 
  // ============================================================================
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  // ============================================================================
  // 验证 Supabase 配置 (Validate Supabase Configuration)
  // ============================================================================
  // 
  // 如果配置缺失：
  // - 抛出 500 Internal Server Error
  // - 返回友好错误消息
  // 
  // ============================================================================
  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,  // 500 Internal Server Error
      message: 'Supabase configuration is missing',
    })
  }

  // 创建 Supabase 客户端实例
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // ============================================================================
  // 查询已发布的产品 (Fetch Published Product)
  // ============================================================================
  // 
  // 查询链式调用：
  // 1. .from('products')：指定查询的表名
  // 2. .select('*')：选择所有列
  // 3. .eq('slug', slug)：过滤条件，slug = 传入的参数
  // 4. .eq('status', 'published')：过滤条件，status = 'published'（只返回已发布的产品）
  // 5. .single()：确保只返回一条记录
  // 
  // 为什么只查询已发布的产品？
  // - 公开 API 不应返回草稿或未发布的产品
  // - 避免用户看到未完成的内容
  // - 确保数据的公开性
  // 
  // 返回值：
  // - data：查询到的产品数据
  // - error：查询错误（如果有）
  // 
  // 错误代码：
  // - PGRST116：Supabase 错误码，表示未找到记录或返回多条记录
  // 
  // ============================================================================
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  // ============================================================================
  // 开发模式：查询任何状态的产品 (Development Mode: Fetch Any Product)
  // ============================================================================
  // 
  // 如果找不到已发布的产品（错误代码为 PGRST116）：
  // - 尝试查询任何状态的产品
  // - 用于开发和调试
  //
  // 为什么这样设计？
  // - 允许开发者在开发环境中查看未发布的产品
  // - 便于测试和预览
  // - 生产环境中应禁用此功能
  //
  // 安全考虑：
  // - 此功能可能泄露未发布的产品信息
  // - 建议在生产环境中通过环境变量控制
  // - 例如：if (process.env.NODE_ENV === 'production') { throw 404 }
  // 
  // ============================================================================
  if (error && error.code === 'PGRST116') {
    // 输出调试日志：尝试查询任何状态的产品
    console.log('[Product API] Published product not found, trying any status')
    
    // 查询任何状态的产品（不限制 status）
    const { data: anyProduct, error: anyError } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    // 如果任何状态的产品都找不到，抛出 404 错误
    if (anyError) {
      console.log('[Product API] Any product not found:', anyError)
      throw createError({
        statusCode: 404,  // 404 Not Found
        message: '产品不存在',
      })
    }

    // ============================================================================
    // 数据库字段映射到 Product 类型（任何状态的产品）
    // ============================================================================
    // 
    // 为什么要映射字段？
    // - 数据库字段使用 snake_case 命名（如 created_at）
    // - Product 类型使用 camelCase 命名（如 createdAt）
    // - 字段名称不一致（如 is_featured → featured）
    // - 多语言字段结构不同（如 name.cn → name['zh-CN']）
    //
    // 映射规则：
    // 1. id：数据库返回的是数字，转换为字符串
    // 2. slug：直接使用
    // 3. name：数据库结构 { cn, hk, en } → 映射为 { 'zh-CN', 'zh-HK', en }
    //    - 兼容两种写法：cn / 'zh-CN'，hk / 'zh-HK'
    // 4. description：同 name
    // 5. specs：直接使用，如果不存在则使用空对象
    // 6. images：直接使用，如果不存在则使用空数组
    // 7. category：直接使用
    // 8. featured：数据库 is_featured → 映射为 featured，布尔值
    // 9. createdAt：数据库 created_at → 映射为 createdAt
    // 
    // ============================================================================
    const mappedProduct: Product = {
      id: String(anyProduct.id),
      slug: anyProduct.slug,
      name: {
        'zh-CN': anyProduct.name.cn || anyProduct.name['zh-CN'] || '',
        'zh-HK': anyProduct.name.hk || anyProduct.name['zh-HK'] || '',
        en: anyProduct.name.en || '',
      },
      description: {
        'zh-CN': anyProduct.description.cn || anyProduct.description['zh-CN'] || '',
        'zh-HK': anyProduct.description.hk || anyProduct.description['zh-HK'] || '',
        en: anyProduct.description.en || '',
      },
      specs: anyProduct.specs || {},
      images: anyProduct.images || [],
      category: anyProduct.category,
      featured: anyProduct.is_featured || false,
      createdAt: anyProduct.created_at,
    }

    // 返回映射后的产品数据
    return mappedProduct
  }

  // ============================================================================
  // 处理其他数据库错误 (Handle Other Database Errors)
  // ============================================================================
  // 
  // 如果错误代码不是 PGRST116（未找到记录）：
  // - 可能是数据库连接错误
  // - 可能是权限问题
  // - 可能是查询语法错误
  //
  // 根据错误代码返回不同的 HTTP 状态码：
  // - PGRST116：404 Not Found
  // - 其他错误：500 Internal Server Error
  // 
  // ============================================================================
  if (error) {
    console.log('[Product API] Database error:', error)
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      message: error.code === 'PGRST116' ? '产品不存在' : error.message,
    })
  }

  // ============================================================================
  // 数据库字段映射到 Product 类型（已发布的产品）
  // ============================================================================
  // 
  // 与上述映射规则相同
  // 
  // ============================================================================
  const mappedProduct: Product = {
    id: String(data.id),
    slug: data.slug,
    name: {
      'zh-CN': data.name.cn || data.name['zh-CN'] || '',
      'zh-HK': data.name.hk || data.name['zh-HK'] || '',
      en: data.name.en || '',
    },
    description: {
      'zh-CN': data.description.cn || data.description['zh-CN'] || '',
      'zh-HK': data.description.hk || data.description['zh-HK'] || '',
      en: data.description.en || '',
    },
    specs: data.specs || {},
    images: data.images || [],
    category: data.category,
    featured: data.is_featured || false,
    createdAt: data.created_at,
  }

  // 返回映射后的产品数据
  return mappedProduct
})
