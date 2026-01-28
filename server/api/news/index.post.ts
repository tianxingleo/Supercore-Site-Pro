import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import { validateCreatePost } from '~/server/utils/validation'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 解析请求体
  const body = await readBody(event)

  // 3. 验证输入数据
  const postData = validateCreatePost(body)

  // 4. 检查 slug 是否已存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('posts')
    .select('id')
    .eq('slug', postData.slug)
    .maybeSingle()

  if (checkError) {
    throw createError({
      statusCode: 500,
      message: `数据库查询失败：${checkError.message}`
    })
  }

  if (existing) {
    throw createError({
      statusCode: 409,
      message: `slug "${postData.slug}" 已存在，请使用其他 slug`
    })
  }

  // 5. 插入新文章
  const { data: newPost, error: insertError } = await client
    .from('posts')
    .insert({
      ...postData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (insertError) {
    throw createError({
      statusCode: 500,
      message: `创建文章失败：${insertError.message}`
    })
  }

  // 6. 返回创建的文章
  return {
    success: true,
    data: newPost as Post
  }
})
