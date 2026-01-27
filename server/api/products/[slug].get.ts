/**
 * Product Detail API Endpoint
 * 返回單個產品詳情（公開）
 */

import { createClient } from '@supabase/supabase-js'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'slug 参数缺失'
    })
  }

  // 使用 service_role 客户端绕过 RLS（公开 API）
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase configuration is missing'
    })
  }

  const client = createClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')  // 只返回已发布的产品
    .single()

  if (error) {
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      statusMessage: error.code === 'PGRST116' ? '产品不存在' : error.message
    })
  }

  return data as Product
})
