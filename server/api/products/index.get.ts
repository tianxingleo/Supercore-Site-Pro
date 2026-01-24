/**
 * Products API Endpoint
 * 返回所有產品列表
 */

import { mockProducts } from '~/utils/mockData'

export default defineEventHandler((event) => {
  // 返回所有產品
  return {
    success: true,
    data: mockProducts,
  }
})
