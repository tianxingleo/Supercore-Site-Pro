import { createClient } from '@supabase/supabase-js'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit ? parseInt(query.limit as string) : undefined

  // 使用 service_role 客户端绕过 RLS（公开 API）
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase configuration is missing',
    })
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  let queryBuilder = client
    .from('products')
    .select('*')
    .eq('status', 'published') // 只获取已发布的产品
    .order('created_at', { ascending: false })

  if (limit) {
    queryBuilder = queryBuilder.limit(limit)
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  // 数据库字段映射到 Product 类型
  const mappedProducts: Product[] = (data || []).map((item) => ({
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    description: item.description,
    specs: item.specs || {},
    images: item.images || [],
    category: item.category,
    featured: item.is_featured || false,
    createdAt: item.created_at,
  }))

  return mappedProducts
})
