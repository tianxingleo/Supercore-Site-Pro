/**
 * Solutions API Endpoint
 * 返回所有解決方案列表
 */

import { mockSolutions } from '~/utils/mockData'

export default defineEventHandler((event) => {
  // 返回所有解決方案，按順序排序
  const sortedSolutions = mockSolutions.sort((a, b) => a.order - b.order)

  return {
    success: true,
    data: sortedSolutions,
  }
})
