/**
 * Product Detail API Endpoint
 * 返回單個產品詳情
 */

import { mockProducts } from '~/utils/mockData'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    })
  }

  const product = mockProducts.find(p => p.slug === slug)

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return {
    success: true,
    data: product,
  }
})
