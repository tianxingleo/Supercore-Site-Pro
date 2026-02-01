// 导入 Supabase 客户端创建函数
// @supabase/supabase-js：Supabase 官方 JavaScript 客户端库
// 用于在服务器端与 Supabase 数据库交互
import { createClient } from '@supabase/supabase-js'

// 导入 Post 类型定义
// 用于类型检查和 TypeScript 智能提示
import type { Post } from '~/types'

// ============================================================================
// Nitro 服务器 API 端点定义
// ============================================================================
// 
// 此文件是一个 Nitro 服务器 API 端点，用于获取单个新闻文章的详情。
// 
// 路由：GET /api/news/[slug]
// 
// 参数：
// - slug：新闻文章的 URL 标识符（动态路由参数）
// 
// 返回值：
// {
//   post: Post,          // 当前文章
//   prevPost: Post | undefined,  // 上一篇文章
//   nextPost: Post | undefined   // 下一篇文章
// }
// 
// 工作流程：
// 1. 获取路由参数 slug
// 2. 验证 slug 是否存在
// 3. 创建 Supabase 客户端（使用 service_role 权限）
// 4. 查询当前文章（根据 slug）
// 5. 验证文章是否存在且已发布
// 6. 查询所有已发布文章（用于查找上一篇和下一篇）
// 7. 计算当前文章在列表中的位置
// 8. 获取上一篇和下一篇文章
// 9. 返回文章数据
// 
// 安全性：
// - 使用 SUPABASE_SECRET_KEY（Service Role Key），绕过 RLS（行级安全策略）
// - 只返回已发布的文章（published_at 不为 null 且 <= 当前时间）
// - 错误处理：验证参数、检查配置、处理数据库错误
// 
// 性能优化：
// - 使用 .single() 确保只返回一条记录
// - 查询时只选择必要的字段（prev/next 只需要 id, slug, title, published_at）
// - 索引优化：确保 slug 字段有索引
// 
// ============================================================================
export default defineEventHandler(async (event) => {
    // ============================================================================
    // 获取路由参数 (Get Route Parameter)
    // ============================================================================
    // 
    // event：Nitro 事件对象，包含请求的所有信息
    // event.context.params：动态路由参数对象（例如：{ slug: 'news-001' }）
    // 
    // 获取 slug 的两种方式：
    // 1. event.context.params?.slug：从事件上下文中获取（推荐）
    // 2. getRouterParam(event, 'slug')：使用 Nitro 工具函数获取（备用）
    // 
    // 为什么使用 ?. 和 ||？
    // - ?.：可选链操作符，防止 event.context.params 为 undefined
    // - ||：逻辑或，如果第一种方式失败，尝试第二种方式
    // 
    // 使用场景：
    // - 用户访问 /api/news/news-001
    // - slug = 'news-001'
    // 
    // ============================================================================
    const slug = event.context.params?.slug || getRouterParam(event, 'slug')

    // ============================================================================
    // 验证 slug 参数 (Validate Slug Parameter)
    // ============================================================================
    // 
    // 为什么需要验证？
    // - 防止无效请求
    // - 提供友好的错误提示
    // - 避免不必要的数据库查询
    // 
    // 如果 slug 不存在：
    // 1. 输出调试日志
    // 2. 抛出 400 Bad Request 错误
    // 
    // createError：
    // - Nitro 提供的错误创建函数
    // - 返回标准化的 HTTP 错误响应
    // 
    // ============================================================================
    if (!slug) {
        // 输出调试日志：打印所有路由参数
        console.log('[News API] Params:', event.context.params)
        
        // 抛出 400 错误：slug 参数缺失
        throw createError({
            statusCode: 400,  // 400 Bad Request
            message: 'Slug is required',
        })
    }

    // 输出调试日志：记录正在查询的文章 slug
    console.log('[News API] Fetching post with slug:', slug)

    // ============================================================================
    // 创建 Supabase 客户端 (Create Supabase Client)
    // ============================================================================
    // 
    // 为什么使用 Service Role Key？
    // - Service Role Key（SUPABASE_SECRET_KEY）具有完全访问权限
    // - 可以绕过 RLS（行级安全策略）
    // - 适合服务器端 API，不受用户权限限制
    //
    // 注意事项：
    // - Service Role Key 是敏感信息，绝不能泄露到客户端
    // - 只能在服务器环境（Server API）中使用
    // - 不能在浏览器中直接使用
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
    // 为什么需要验证？
    // - 确保环境变量已正确配置
    // - 提供清晰的错误提示
    // - 避免运行时错误
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
    // createClient(Url, Key, Options)：创建客户端
    const client = createClient(
        supabaseUrl,     // Supabase 项目 URL
        supabaseKey,     // Service Role Key
        {
            auth: {        // 认证配置
                autoRefreshToken: false,  // 禁用自动刷新令牌
                persistSession: false     // 不持久化会话
            }
        }
    )

    // ============================================================================
    // 查询当前文章 (Fetch Current Post)
    // ============================================================================
    // 
    // Supabase 查询链式调用：
    // 1. .from('posts')：指定查询的表名
    // 2. .select('*')：选择所有列（也可以指定具体列）
    // 3. .eq('slug', slug)：添加过滤条件，slug = 传入的参数
    // 4. .not('published_at', 'is', null)：过滤掉未发布的文章（published_at 不为 null）
    // 5. .lte('published_at', new Date().toISOString())：只返回已到发布时间的文章（小于等于当前时间）
    // 6. .single()：确保只返回一条记录（如果有多条或没有，会返回错误）
    //
    // 为什么要过滤 published_at？
    // - 避免返回草稿或未发布的文章
    // - 确保用户只能看到正式发布的文章
    // - 支持定时发布功能
    //
    // 返回值：
    // - data: post：查询到的文章数据（Post 类型）
    // - error: postError：查询错误（如果有）
    // 
    // ============================================================================
    const { data: post, error: postError } = await client
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .single()

    // ============================================================================
    // 验证文章是否存在 (Validate Post Exists)
    // ============================================================================
    // 
    // 如果文章不存在或查询失败：
    // - postError：Supabase 返回的错误
    // - !post：文章数据为空
    //
    // 返回 404 Not Found 错误：
    // - 文章不存在（slug 不匹配）
    // - 文章未发布（published_at 为 null 或未来时间）
    // - 文章已被删除
    // 
    // ============================================================================
    if (postError || !post) {
        throw createError({
            statusCode: 404,  // 404 Not Found
            message: 'Post not found',
        })
    }

    // ============================================================================
    // 获取所有已发布文章（用于查找上一篇和下一篇）
    // ============================================================================
    // 
    // 为什么需要查询所有文章？
    // - 计算当前文章在已发布文章列表中的位置
    // - 根据位置确定上一篇和下一篇文章
    //
    // 查询链式调用：
    // 1. .from('posts')：指定查询的表名
    // 2. .select('id, slug, title, published_at')：只选择必要的字段（减少数据传输）
    // 3. .not('published_at', 'is', null)：过滤掉未发布的文章
    // 4. .lte('published_at', new Date().toISOString())：只返回已到发布时间的文章
    // 5. .order('published_at', { ascending: false })：按发布时间降序排列（最新的在前）
    //
    // 为什么只选择部分字段？
    // - prev/next 文章只需要 id, slug, title, published_at
    // - 不需要查询完整的内容（content、images 等）
    // - 减少数据库查询时间和数据传输量
    //
    // 返回值：
    // - data: allPosts：所有已发布文章的数组（按时间降序）
    // 
    // ============================================================================
    const { data: allPosts } = await client
        .from('posts')
        .select('id, slug, title, published_at')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })

    // 初始化上一篇和下一篇文章变量
    let prevPost: Post | undefined
    let nextPost: Post | undefined

    // ============================================================================
    // 计算上一篇和下一篇文章 (Calculate Previous and Next Posts)
    // ============================================================================
    // 
    // 算法：
    // 1. 确保 allPosts 存在（数据库查询成功）
    // 2. 查找当前文章在数组中的索引
    // 3. 根据索引确定上一篇和下一篇：
    //    - 上一篇：索引 - 1（如果索引 > 0）
    //    - 下一篇：索引 + 1（如果索引 < 数组长度 - 1）
    //
    // 举例说明：
    // - allPosts = [A(最新), B, C(当前), D, E(最旧)]
    // - 当前文章 C 的索引 = 2
    // - 上一篇：索引 2 - 1 = 1 → B
    // - 下一篇：索引 2 + 1 = 3 → D
    //
    // 为什么按 published_at 降序排列？
    // - 最新的文章在数组前面
    // - 当前文章的"上一篇"是发布时间更晚的文章（索引 - 1）
    // - 当前文章的"下一篇"是发布时间更早的文章（索引 + 1）
    // 
    // ============================================================================
    if (allPosts) {
        // 查找当前文章在数组中的索引
        // findIndex：返回第一个满足条件的元素索引
        // 条件：文章 id 等于当前文章 id
        const currentIndex = allPosts.findIndex(p => p.id === post.id)

        // 计算上一篇文章
        // 条件：当前索引 > 0（不是第一篇文章）
        if (currentIndex > 0) {
            // 上一篇是当前索引的前一个元素
            prevPost = allPosts[currentIndex - 1] as Post
        }

        // 计算下一篇文章
        // 条件：当前索引 < 数组长度 - 1（不是最后一篇文章）
        if (currentIndex < allPosts.length - 1) {
            // 下一篇是当前索引的后一个元素
            nextPost = allPosts[currentIndex + 1] as Post
        }
    }

    // ============================================================================
    // 返回文章数据 (Return Post Data)
    // ============================================================================
    // 
    // 返回对象包含三个字段：
    // 1. post：当前文章（完整数据）
    // 2. prevPost：上一篇文章（简化数据），可能为 undefined
    // 3. nextPost：下一篇文章（简化数据），可能为 undefined
    //
    // 使用场景：
    // - 前端页面显示文章详情
    // - 显示"上一篇"和"下一篇"导航链接
    // 
    // ============================================================================
    return {
        post: post as Post,      // 当前文章
        prevPost,               // 上一篇文章（可选）
        nextPost                // 下一篇文章（可选）
    }
})
