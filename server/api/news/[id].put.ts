import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import { validateUpdatePost } from '~/server/utils/validation'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  const { user } = await requireAdminAuth(event)

  // 2. 从 URL 获取文章 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的文章 ID'
    })
  }

  // 3. 解析请求体
  const body = await readBody(event)

  // 4. 验证输入数据
  const updateData = validateUpdatePost(body)

  // 5. 检查文章是否存在
  const client = serverSupabaseServiceRole(event)
  const { data: existing, error: checkError } = await client
    .from('posts')
    .select('id, slug')
    .eq('id', id)
    .single()

  if (checkError || !existing) {
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在'
    })
  }

  // 6. 如果更新了 slug，检查新 slug 是否已被其他文章使用
  if (updateData.slug && updateData.slug !== existing.slug) {
    const { data: slugCheck } = await client
      .from('posts')
      .select('id')
      .eq('slug', updateData.slug)
      .neq('id', id)
      .maybeSingle()

    if (slugCheck) {
      throw createError({
        statusCode: 409,
        statusMessage: `slug "${updateData.slug}" 已存在，请使用其他 slug`
      })
    }
  }

  // 7. 更新文章
  const { data: updatedPost, error: updateError } = await client
    .from('posts')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: `更新文章失败：${updateError.message}`
    })
  }

  // 8. 返回更新后的文章
  return {
    success: true,
    data: updatedPost as Post
  }
})
