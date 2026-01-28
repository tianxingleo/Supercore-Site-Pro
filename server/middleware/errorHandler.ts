/**
 * API 错误处理中间件
 * 统一处理 API 错误并记录日志
 */

import { logger, createRequestContext } from '~/utils/logger'

export default defineEventHandler(async (event) => {
  // 只處理 API 請求
  if (!event.node.req.url?.startsWith('/api/')) {
    return
  }

  try {
    // 執行原始處理程序
    const response = await handleRequest(event)

    // 檢查是否有錯誤
    if (response && typeof response === 'object' && 'error' in response) {
      const error = (response as any).error
      const context = createRequestContext(event)

      await logger.logApiError(
        event.node.req.url || 'unknown',
        event.node.req.method || 'GET',
        new Error(error),
        {
          ...context,
          response,
        }
      )

      // 返回格式化的錯誤響應
      return createErrorResponse(error, context)
    }

    return response
  } catch (error: any) {
    const context = createRequestContext(event)

    await logger.logApiError(
      event.node.req.url || 'unknown',
      event.node.req.method || 'GET',
      error,
      context
    )

    return createErrorResponse(error.message || 'Internal Server Error', context)
  }
})

/**
 * 處理請求並捕獲錯誤
 */
async function handleRequest(event: any) {
  try {
    // 這裡不需要做任何事，因為 Nuxt 會自動執行對應的路由處理程序
    // 我們只是為了捕獲錯誤
    return undefined
  } catch (error) {
    throw error
  }
}

/**
 * 創建錯誤響應
 */
function createErrorResponse(message: string, context: Record<string, any>) {
  return {
    success: false,
    error: message,
    requestId: context.requestId,
    timestamp: new Date().toISOString(),
  }
}
