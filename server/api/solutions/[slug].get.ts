/**
 * Solution detail API Endpoint
 * 返回特定解決方案的詳細信息
 */

import { mockSolutions } from '~/utils/mockData'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  const solution = mockSolutions.find(s => s.slug === slug)

  if (!solution) {
    throw createError({
      statusCode: 404,
      message: 'Solution not found'
    })
  }

  return {
    success: true,
    data: solution
  }
})
