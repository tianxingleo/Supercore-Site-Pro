import { createClient } from '@supabase/supabase-js'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit ? parseInt(query.limit as string) : undefined

  // 验证配置
  const config = useRuntimeConfig(event)
  const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
  const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing',
    })
  }

  // 创建客户端
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // 查询产品
  let queryBuilder = client
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (limit) {
    queryBuilder = queryBuilder.limit(limit)
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  // 数据映射
  const mappedProducts: Product[] = (data || []).map((item) => ({
    id: String(item.id),
    slug: item.slug,
    name: {
      'zh-CN': item.name.cn || item.name['zh-CN'] || '',
      'zh-HK': item.name.hk || item.name['zh-HK'] || '',
      en: item.name.en || '',
    },
    description: {
      'zh-CN': item.description.cn || item.description['zh-CN'] || '',
      'zh-HK': item.description.hk || item.description['zh-HK'] || '',
      en: item.description.en || '',
    },
    specs: item.specs || {},
    images: item.images || [],
    category: item.category,
    featured: item.is_featured || false,
    createdAt: item.created_at,
  }))

  // 直接返回产品数组，与news API保持一致
  return mappedProducts
})
