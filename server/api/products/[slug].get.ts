/**
 * Product Detail API Endpoint
 * 返回單個產品詳情（公開）
 */

import { createClient } from '@supabase/supabase-js'
import type { Product } from '~/types'

export default defineEventHandler(async (event) => {
  // 从 event.path 中提取 slug
  const path = event.path || ''
  const slugMatch = path.match(/\/products\/([^\/]+)$/)
  const slug = slugMatch ? slugMatch[1] : null

  console.log('[Product API] Path:', path)
  console.log('[Product API] Extracted slug:', slug)

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'slug 参数缺失',
    })
  }

  console.log('[Product API] Fetching product with slug:', slug)

  // 使用 service_role 客户端绕过 RLS（公开 API）
  const config = useRuntimeConfig(event)
  const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
  const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      message: 'Supabase configuration is missing (URL or Service Key)',
    })
  }

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // 首先尝试获取已发布的产品
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  // 如果找不到已发布的产品，尝试获取任何状态的产品（用于开发调试）
  if (error && error.code === 'PGRST116') {
    console.log('[Product API] Published product not found, trying any status')
    const { data: anyProduct, error: anyError } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (anyError) {
      console.log('[Product API] Any product not found:', anyError)
      throw createError({
        statusCode: 404,
        message: '产品不存在',
      })
    }

    // 数据库字段映射到 Product 类型
    const mappedProduct: Product = {
      id: String(anyProduct.id),
      slug: anyProduct.slug,
      name: {
        'zh-CN': anyProduct.name.cn || anyProduct.name['zh-CN'] || '',
        'zh-HK': anyProduct.name.hk || anyProduct.name['zh-HK'] || '',
        en: anyProduct.name.en || '',
      },
      description: {
        'zh-CN': anyProduct.description.cn || anyProduct.description['zh-CN'] || '',
        'zh-HK': anyProduct.description.hk || anyProduct.description['zh-HK'] || '',
        en: anyProduct.description.en || '',
      },
      specs: anyProduct.specs || {},
      images: anyProduct.images || [],
      category: anyProduct.category,
      featured: anyProduct.is_featured || false,
      createdAt: anyProduct.created_at,
    }

    return mappedProduct
  }

  if (error) {
    console.log('[Product API] Database error:', error)
    throw createError({
      statusCode: error.code === 'PGRST116' ? 404 : 500,
      message: error.code === 'PGRST116' ? '产品不存在' : error.message,
    })
  }

  // 数据库字段映射到 Product 类型
  const mappedProduct: Product = {
    id: String(data.id),
    slug: data.slug,
    name: {
      'zh-CN': data.name.cn || data.name['zh-CN'] || '',
      'zh-HK': data.name.hk || data.name['zh-HK'] || '',
      en: data.name.en || '',
    },
    description: {
      'zh-CN': data.description.cn || data.description['zh-CN'] || '',
      'zh-HK': data.description.hk || data.description['zh-HK'] || '',
      en: data.description.en || '',
    },
    specs: data.specs || {},
    images: data.images || [],
    category: data.category,
    featured: data.is_featured || false,
    createdAt: data.created_at,
  }

  return mappedProduct
})
