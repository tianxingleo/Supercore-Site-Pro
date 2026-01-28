import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 仅在开发环境或通过特定参数触发
  const query = getQuery(event)
  if (process.env.NODE_ENV === 'production' && !query.force) {
    throw createError({
      statusCode: 403,
      message: '此操作仅允许在开发环境中执行',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing',
    })
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // 更新所有产品的状态为 published
  const { data: updateData, error: updateError } = await client
    .from('products')
    .update({ status: 'published' })
    .not('id', 'is', null)

  if (updateError) {
    throw createError({
      statusCode: 500,
      message: `更新产品状态失败：${updateError.message}`,
    })
  }

  // 检查产品数量
  const { data: products, error: fetchError } = await client
    .from('products')
    .select('id, slug, status')

  if (fetchError) {
    throw createError({
      statusCode: 500,
      message: `获取产品列表失败：${fetchError.message}`,
    })
  }

  return {
    success: true,
    message: '产品状态已更新',
    data: {
      updatedCount: products?.length || 0,
      products: products,
    },
  }
})
