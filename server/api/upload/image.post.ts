/**
 * ============================================================================
 * 文件作用：图片上传 API 端点 (Image Upload API Endpoint)
 * ============================================================================
 * 
 * 此文件是一个 Nitro 服务器 API 端点，用于处理图片上传到 Supabase Storage。
 * 
 * 路由：POST /api/upload/image
 * 
 * 功能说明：
 * 1. 身份验证：检查用户是否已登录
 * 2. 权限验证：检查用户是否为管理员（role = 'admin'）
 * 3. 文件解析：解析 multipart/form-data 格式的文件上传
 * 4. 文件验证：验证文件类型是否为图片（image/*）
 * 5. 文件上传：上传到指定的 Supabase Storage Bucket
 * 6. URL 生成：生成公开访问的 URL
 * 7. 错误处理：详细的错误日志和友好的错误消息
 * 
 * 请求参数：
 * - Content-Type: multipart/form-data
 * - file：图片文件（必填）
 * - bucket：目标存储桶名称（可选，默认为 'news-covers'）
 * 
 * 返回值：
 * {
 *   success: true,
 *   data: {
 *     publicUrl: 'https://xxx.supabase.co/storage/v1/object/public/bucketName/fileName.jpg'
 *   }
 * }
 * 
 * 工作流程：
 * 1. 身份验证：检查用户会话
 * 2. 权限验证：检查用户是否为管理员
 * 3. 文件解析：从请求体中提取文件数据
 * 4. 文件验证：验证文件类型
 * 5. 生成文件名：使用时间戳和随机字符串生成唯一文件名
 * 6. 上传到 Storage：上传到指定的 Bucket
 * 7. 生成公开 URL：返回可公开访问的 URL
 * 8. 错误处理：捕获并返回详细错误信息
 * 
 * 安全性：
 * - 身份验证：必须登录才能访问
 * - 权限验证：只有管理员可以上传
 * - 文件类型验证：只允许图片类型
 * - 使用 Service Role Key：绕过 RLS，具有完整权限
 * - 文件名随机化：防止文件名冲突和覆盖
 * - Bucket 验证：检查 Bucket 是否存在
 * 
 * Supabase Storage：
 * - Bucket：存储桶，类似文件夹的概念
 * - 公开访问：通过 getPublicUrl() 生成公开 URL
 * - 文件管理：支持上传、下载、删除等操作
 * 
 * 性能优化：
 * - 使用 multipart/form-data：支持大文件上传
 * - 随机文件名：避免缓存问题
 * - 时间戳：确保文件名唯一性
 * 
 * 注意事项：
 * - 需要预先在 Supabase Dashboard 创建 Bucket
 * - Bucket 需要设置为公开访问（Public）
 * - 文件大小限制受 Nuxt/Nitro 配置限制
 * 
 * ============================================================================
 */

// 导入 Supabase 服务器端工具函数
// #supabase/server：Nuxt Supabase 模块的服务器端入口
// serverSupabaseUser：从请求中获取当前登录用户
// serverSupabaseServiceRole：创建具有完整权限的 Supabase 客户端
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

// 导入 multipart/form-data 解析函数
// h3：Nitro 的底层 HTTP 框架
// readMultipartFormData：解析 multipart/form-data 格式的请求体
import { readMultipartFormData } from 'h3'

// ============================================================================
// Nitro 服务器 API 端点定义
// ============================================================================
export default defineEventHandler(async (event) => {
  // 输出调试日志：记录请求方法和路径
  console.log('[Upload] Request received:', event.method, event.path)

  try {
    // ============================================================================
    // 1. 身份验证 (Authentication)
    // ============================================================================
    //
    // 为什么需要身份验证？
    // - 防止未授权用户上传文件
    // - 保护服务器存储空间
    // - 追踪上传行为
    //
    // serverSupabaseUser：
    // - 从请求的 Cookie 或 Authorization header 中获取 JWT token
    // - 验证 token 有效性
    // - 返回用户信息（包含 id、email、role 等）
    //
    // JWT token 结构：
    // - sub：用户 ID（Subject）
    // - email：用户邮箱
    // - role：用户角色（可选）
    // - exp：过期时间
    //
    // 返回值：
    // - user：用户对象，如果用户已登录
    // - null：如果用户未登录
    //
    // ============================================================================
    const user = await serverSupabaseUser(event)

    // 检查用户是否已登录
    if (!user) {
      console.error('[Upload] No user found in session')
      throw createError({
        statusCode: 401,  // 401 Unauthorized
        message: '未授权：请先登录'
      })
    }

    // 从 JWT token 中提取用户 ID
    // sub：Subject，指代用户 ID（通常是 UUID）
    const userId = user.sub
    console.log('[Upload] User authenticated. ID:', userId, 'Email:', user.email)

    // ============================================================================
    // 创建具有完整权限的 Supabase 客户端 (Create Service Role Client)
    // ============================================================================
    // 
    // 为什么使用 Service Role Client？
    // - Service Role Client 具有 Supabase 项目的完整访问权限
    // - 可以绕过 RLS（行级安全策略）
    // - 可以访问其他用户的 profile 数据
    // - 可以管理 Storage Bucket
    //
    // 使用场景：
    // - 服务器端 API
    // - 管理员操作
    // - 后台任务
    //
    // 安全性：
    // - Service Role Key 是敏感信息，只能在服务器端使用
    // - 不能在浏览器中直接使用
    // - 已在 nuxt.config.ts 中配置为服务器端环境变量
    //
    // ============================================================================
    const client = serverSupabaseServiceRole(event)
    console.log('[Upload] Using service role client:', !!client)

    // ============================================================================
    // 2. 权限验证：检查管理员角色 (Authorization: Check Admin Role)
    // ============================================================================
    // 
    // 为什么需要检查管理员角色？
    // - 只有管理员可以上传图片
    // - 防止普通用户上传恶意文件
    // - 保护服务器资源
    //
    // 查询流程：
    // 1. 从 profiles 表中查询用户信息
    // 2. 检查 role 字段是否为 'admin'
    // 3. 如果不是管理员，拒绝访问
    //
    // Supabase 查询链式调用：
    // 1. .from('profiles')：指定查询的表名
    // 2. .select('role')：只选择 role 字段（减少数据传输）
    // 3. .eq('id', userId)：过滤条件，id = 当前用户 ID
    // 4. .single()：确保只返回一条记录
    //
    // 返回值：
    // - data.profile：用户的 profile 数据（包含 role 字段）
    // - error：查询错误（如果有）
    //
    // ============================================================================
    console.log('[Upload] Checking admin role for user:', userId)
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // 输出调试日志：记录查询结果
    console.log('[Upload] Profile query result:', {
      hasProfile: !!profile,
      role: profile?.role,
      error: profileError?.message
    })

    // 检查用户是否为管理员
    // 条件：
    // 1. 没有查询错误（profileError 为空）
    // 2. profile 存在（不为 null）
    // 3. role 字段为 'admin'
    if (profileError || !profile || profile.role !== 'admin') {
      console.error('[Upload] Admin check failed:', {
        profileError: profileError?.message,
        profile,
        hasProfile: !!profile,
        role: profile?.role,
        isAdmin: profile?.role === 'admin'
      })
      throw createError({
        statusCode: 403,  // 403 Forbidden
        message: '禁止访问：需要管理员权限'
      })
    }

    // 输出调试日志：管理员验证通过
    console.log('[Upload] Admin check passed ✓')

    // ============================================================================
    // 3. 解析上传的文件 (Parse Uploaded File)
    // ============================================================================
    // 
    // multipart/form-data：
    // - HTML 表单提交数据的格式
    // - 支持文件上传
    // - 支持多字段混合提交（文本 + 文件）
    //
    // readMultipartFormData：
    // - Nitro/H3 提供的函数
    // - 解析 multipart/form-data 格式的请求体
    // - 返回 FormDataPart[] 数组
    //
    // FormDataPart 结构：
    // {
    //   name: string,      // 字段名
    //   filename: string,  // 文件名（如果是文件）
    //   type: string,      // MIME 类型（如果是文件）
    //   data: Buffer,      // 文件数据（Buffer 对象）
    // }
    //
    // ============================================================================
    const formData = await readMultipartFormData(event)
    
    // 检查是否有文件数据
    if (!formData || formData.length === 0) {
      console.error('[Upload] No files in form data')
      throw createError({
        statusCode: 400,  // 400 Bad Request
        message: '没有上传文件'
      })
    }

    // 提取文件字段
    // 方式 1：查找 name = 'file' 的字段
    // 方式 2：如果找不到，使用第一个字段
    const file = formData.find(f => f.name === 'file') || formData[0]
    if (!file) {
      throw createError({ statusCode: 400, message: '没有找到文件字段' })
    }

    // 输出调试日志：记录文件信息
    console.log('[Upload] File received:', file.filename, 'field:', file.name, 'type:', file.type, 'size:', file.data.length)

    // ============================================================================
    // 4. 文件验证 (File Validation)
    // ============================================================================
    // 
    // 验证文件类型：
    // - 只允许图片类型（image/*）
    // - 拒绝其他类型（如 application/pdf, text/plain 等）
    //
    // MIME 类型示例：
    // - image/jpeg：JPEG 图片
    // - image/png：PNG 图片
    // - image/gif：GIF 图片
    // - image/webp：WebP 图片
    //
    // 为什么需要验证？
    // - 防止上传恶意文件
    // - 保护服务器安全
    // - 确保 Storage 只存储图片
    //
    // ============================================================================
    if (!file.type?.startsWith('image/')) {
      throw createError({ statusCode: 400, message: '只允许图片' })
    }

    // ============================================================================
    // 5. 上传文件到 Supabase Storage (Upload File to Supabase Storage)
    // ============================================================================
    // 
    // 提取 Bucket 名称：
    // - 从表单数据中查找 name = 'bucket' 的字段
    // - 如果不存在，使用默认值 'news-covers'
    //
    // 为什么需要 Bucket 名称？
    // - Supabase Storage 使用 Bucket 组织文件
    // - 每个 Bucket 类似一个文件夹
    // - 可以设置不同的访问权限（公开/私有）
    //
    // ============================================================================
    const bucketField = formData.find(f => f.name === 'bucket')
    const bucketName = bucketField?.data.toString() || 'news-covers'
    
    // 生成唯一文件名：
    // - 使用时间戳：确保唯一性
    // - 使用随机字符串：防止猜测
    // - 保留文件扩展名：保持文件类型
    //
    // 文件名格式：{timestamp}-{random}.{extension}
    // 示例：1640000000000-a1b2c.jpg
    //
    // 为什么这样生成文件名？
    // - 防止文件名冲突（覆盖）
    // - 防止缓存问题（浏览器缓存）
    // - 提高安全性（防止路径猜测）
    // 
    const timestamp = Date.now()  // 当前时间戳（毫秒）
    const extension = file.filename?.split('.').pop() || 'jpg'  // 提取文件扩展名
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 7)}.${extension}`  // 生成唯一文件名

    // 输出调试日志：记录上传信息
    console.log('[Upload] Uploading to bucket:', bucketName, 'path:', fileName)

    // 上传文件到 Supabase Storage
    // Supabase Storage API：
    // - client.storage：访问 Storage 模块
    // - .from(bucketName)：指定目标 Bucket
    // - .upload(path, data, options)：上传文件
    //
    // upload 参数：
    // - path：文件路径（相对于 Bucket 根目录）
    // - data：文件数据（Buffer 对象）
    // - options：上传选项
    //   - contentType：MIME 类型
    //   - upsert：是否覆盖同名文件（false = 不覆盖）
    //
    // 返回值：
    // - data.uploadData：上传成功的数据（包含 path、fullPath）
    // - error.uploadError：上传错误（如果有）
    //
    const { data: uploadData, error: uploadError } = await client
      .storage
      .from(bucketName)
      .upload(fileName, file.data, {
        contentType: file.type,  // 设置文件 MIME 类型
        upsert: false            // 不覆盖同名文件
      })

    // ============================================================================
    // 错误处理 (Error Handling)
    // ============================================================================
    // 
    // 如果上传失败：
    // - 检查是否为 Bucket 不存在错误
    // - 返回友好的错误消息
    //
    // Bucket 不存在的处理：
    // - 提示用户在 Supabase Dashboard 创建 Bucket
    // - 提示设置为公开访问
    // - 避免用户不知道如何解决问题
    //
    // ============================================================================
    if (uploadError) {
      console.error('[Upload] Supabase storage error:', uploadError)
      
      // 检查是否为 Bucket 不存在错误
      if (uploadError.message.includes('bucket not found')) {
        throw createError({
          statusCode: 500,  // 500 Internal Server Error
          message: `存储桶 "${bucketName}" 不存在，请先在 Supabase 控制台创建它并设置为公开。`
        })
      }
      
      // 其他错误：返回原始错误消息
      throw createError({
        statusCode: 500,
        message: uploadError.message
      })
    }

    // ============================================================================
    // 6. 生成公开访问 URL (Generate Public URL)
    // ============================================================================
    // 
    // getPublicUrl：
    // - 生成文件的公开访问 URL
    // - URL 格式：https://{projectRef}.supabase.co/storage/v1/object/public/{bucketName}/{fileName}
    //
    // 为什么需要公开 URL？
    // - 前端可以直接访问图片（无需身份验证）
    // - 可以在 HTML img 标签中使用
    // - 可以分享给其他用户
    //
    // 注意事项：
    // - Bucket 必须设置为 Public（公开访问）
    // - 如果 Bucket 是 Private，返回的 URL 无法访问
    //
    // 返回值：
    // - data.urlData：包含 publicUrl 的对象
    // 
    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(fileName)

    // 输出调试日志：记录上传成功
    console.log('[Upload] Success:', urlData.publicUrl)

    // ============================================================================
    // 7. 返回成功响应 (Return Success Response)
    // ============================================================================
    // 
    // 返回值：
    // {
    //   success: true,        // 操作成功
    //   data: {
    //     publicUrl: '...'   // 公开访问的 URL
    //   }
    // }
    //
    // ============================================================================
    return {
      success: true,
      data: {
        publicUrl: urlData.publicUrl
      }
    }

  } catch (error: any) {
    // ============================================================================
    // 全局错误处理 (Global Error Handling)
    // ============================================================================
    // 
    // 捕获所有未处理的错误：
    // - 记录错误日志
    // - 返回友好的错误消息
    //
    // 错误类型：
    // 1. 已处理的错误（已有 statusCode）：直接抛出
    // 2. 未处理的错误：返回 500 错误
    //
    // ============================================================================
    console.error('[Upload] Fatal error:', error)
    
    // 如果错误已有 statusCode，直接抛出
    if (error.statusCode) throw error
    
    // 否则，返回 500 错误
    throw createError({
      statusCode: 500,
      message: error.message || '未知错误'
    })
  }
})
