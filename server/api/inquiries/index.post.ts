/**
 * ============================================================================
 * 创建询盘 API 端点（POST /api/inquiries）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 的服务器 API 端点，用于处理用户提交的询盘表单。
 * 用户在联系页面填写表单后，前端会调用此 API 创建询盘记录。
 *
 * 访问路径：
 * - 完整路径：/api/inquiries
 * - 方法：POST
 * - 认证：不需要身份认证（公开访问）
 *
 * 实现手段：
 * 1. 使用 defineEventHandler 定义 Nitro 服务器事件处理器
 * 2. 使用 serverSupabaseServiceRole 获取 Supabase Service Role 客户端
 * 3. 使用 validateCreateInquiry 验证表单数据
 * 4. 使用 Supabase insert 方法插入询盘记录
 * 5. 自动设置状态为 'new' 和创建时间
 *
 * 核心功能：
 * 1. 解析请求体：读取 POST 请求的 JSON 数据
 * 2. 验证输入数据：使用验证函数检查数据格式和必填字段
 * 3. 插入询盘记录：将询盘数据插入 inquiries 表
 * 4. 返回创建的询盘：包含数据库生成的 ID 和创建时间
 *
 * 请求格式：
 * {
 *   email: "user@example.com",        // 必填：邮箱地址
 *   name: "张三",                    // 必填：联系人姓名
 *   company: "公司名称",              // 可选：公司名称
 *   phone: "+852 1234 5678",         // 可选：电话号码
 *   message: "我想咨询产品...",       // 必填：询盘内容
 * }
 *
 * 返回格式：
 * {
 *   success: true,
 *   data: {
 *     id: 1,                          // 询盘 ID（数据库生成）
 *     email: "user@example.com",
 *     name: "张三",
 *     company: "公司名称",
 *     phone: "+852 1234 5678",
 *     message: "我想咨询产品...",
 *     status: "new",                   // 状态：new（新建）
 *     created_at: "2024-01-01T00:00:00.000Z"  // 创建时间
 *   }
 * }
 *
 * 错误处理：
 * - 400：请求数据格式错误（验证失败）
 * - 500：服务器错误（数据库插入失败）
 *
 * 数据验证：
 * 1. email：必须为有效的邮箱格式
 * 2. name：必须为非空字符串
 * 3. message：必须为非空字符串
 * 4. company：可选字符串
 * 5. phone：可选字符串
 *
 * 数据库表：
 * inquiries 表结构：
 * - id：主键（自动生成）
 * - email：邮箱地址
 * - name：联系人姓名
 * - company：公司名称
 * - phone：电话号码
 * - message：询盘内容
 * - status：状态（new, pending, completed）
 * - created_at：创建时间
 * - updated_at：更新时间
 *
 * 安全措施：
 * 1. 输入验证：使用验证函数检查数据格式
 * 2. SQL 注入防护：Supabase 自动防止 SQL 注入
 * 3. XSS 防护：数据库存储时自动转义
 * 4. Rate Limiting：可以添加速率限制，防止滥用
 *
 * 性能优化：
 * 1. 异步插入：使用 await 等待数据库操作
 * 2. 只返回创建的记录，不返回整个表
 * 3. 使用 insert().select().single() 确保返回插入的数据
 *
 * 日志记录：
 * - 可以添加日志记录功能，记录每次询盘提交
 * - 可以记录请求来源（IP、User Agent 等）
 *
 * 依赖项：
 * - #supabase/server：Supabase 服务端客户端
 * - ~/server/utils/validation/inquiry：询盘验证函数
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// serverSupabaseServiceRole：Supabase 服务端客户端
// 用于服务端访问 Supabase 数据库，使用 Service Role Key（最高权限）
import { serverSupabaseServiceRole } from '#supabase/server'

// validateCreateInquiry：验证询盘表单数据
// 检查数据格式和必填字段，确保数据有效
import { validateCreateInquiry } from '~/server/utils/validation/inquiry'

// ============================================================================
// 定义 API 端点处理器
// ============================================================================
// defineEventHandler()：Nuxt 3/Nitro 提供的函数，用于定义服务器 API 端点
// - event：Nuxt 事件对象，包含请求信息（请求体、请求头等）
export default defineEventHandler(async (event) => {
  // ============================================================================
  // 1. 解析请求体
  // ============================================================================
  // readBody()：Nuxt 提供的函数，读取请求体的 JSON 数据
  // 返回 Promise，需要 await 等待
  // body：包含表单提交的数据（email, name, company, phone, message）
  const body = await readBody(event)

  // ============================================================================
  // 2. 验证输入数据
  // ============================================================================
  // validateCreateInquiry()：验证询盘表单数据
  // 检查数据格式和必填字段：
  // - email：必须为有效的邮箱格式
  // - name：必须为非空字符串
  // - message：必须为非空字符串
  // - company：可选字符串
  // - phone：可选字符串
  //
  // 如果验证失败，会抛出错误，包含错误信息
  const inquiryData = validateCreateInquiry(body)

  // ============================================================================
  // 3. 插入新询盘
  // ============================================================================
  // serverSupabaseServiceRole()：获取 Supabase Service Role 客户端
  // 使用 Service Role Key（最高权限），可以绕过 RLS（行级安全）策略
  // 用于服务端数据库操作
  const client = serverSupabaseServiceRole(event)

  // client.from('inquiries')：从 inquiries 表插入数据
  // .insert({...})：插入新记录
  // .select()：选择插入的记录（返回插入的数据）
  // .single()：只返回一条记录（单条插入）
  const { data: newInquiry, error: insertError } = await client
    .from('inquiries')
    .insert({
      // 展开询盘数据
      ...inquiryData,

      // 自动设置状态为 'new'（新建）
      status: 'new',

      // 自动设置创建时间为当前时间
      // new Date().toISOString()：ISO 8601 格式的时间字符串
      // 例如：2024-01-01T00:00:00.000Z
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  // ============================================================================
  // 4. 错误处理
  // ============================================================================
  // 如果插入失败，则抛出错误
  if (insertError) {
    // createError()：创建错误对象
    // statusCode：HTTP 状态码（500 = 服务器内部错误）
    // message：错误消息（包含数据库错误消息）
    throw createError({
      statusCode: 500,
      message: `提交詢盤失敗：${insertError.message}`,
    })
  }

  // ============================================================================
  // 5. 返回创建的询盘
  // ============================================================================
  // 返回成功响应
  // success：表示操作成功
  // data：包含创建的询盘数据
  return {
    success: true,
    data: newInquiry,
  }
})
