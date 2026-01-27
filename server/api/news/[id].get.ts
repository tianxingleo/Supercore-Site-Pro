import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import type { Post } from '~/types'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  await requireAdminAuth(event)

  // 2. 从 URL 获取文章 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: '无效的文章 ID'
    })
  }

  // 3. 获取文章详情
  const client = serverSupabaseServiceRole(event)
  const { data: post, error } = await client
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在'
    })
  }

  // 4. 返回文章详情
  return {
    success: true,
    data: post as Post
  }
})
