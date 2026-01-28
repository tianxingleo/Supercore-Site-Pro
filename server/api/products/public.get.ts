import { createClient } from '@supabase/supabase-js'
import type { Product } from '~/types'
import {
  withApiHandler,
  createSuccessResponse,
  createErrorResponse,
  withDatabaseLogging,
} from '~/utils/apiHandler'
import { logger, createRequestContext } from '~/utils/logger'

export default withApiHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit ? parseInt(query.limit as string) : undefined
  const requestContext = createRequestContext(event)

  // 验证配置
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    await logger.error('Supabase configuration is missing', null, 'API' as any, {
      ...requestContext,
    })

    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase configuration is missing',
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
  const { data, error } = await withDatabaseLogging(
    'Fetch public products',
    async () => {
      let queryBuilder = client
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (limit) {
        queryBuilder = queryBuilder.limit(limit)
      }

      return await queryBuilder
    },
    { ...requestContext, limit }
  )

  if (error) {
    await logger.error('Failed to fetch products', error, 'API' as any, {
      ...requestContext,
      limit,
    })

    throw createError({
      statusCode: 500,
      statusMessage: error.message,
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

  await logger.info(`Successfully fetched ${mappedProducts.length} products`, 'API' as any, {
    ...requestContext,
    count: mappedProducts.length,
  })

  return createSuccessResponse(mappedProducts)
})
