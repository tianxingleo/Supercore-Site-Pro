/**
 * API 路由包装器
 * 为 API 路由提供统一的日志记录和错误处理
 */

import { logger, measurePerformance, createRequestContext, LogLevel, LogCategory } from '~/utils/logger'

interface ApiHandlerOptions {
  logRequest?: boolean
  logResponse?: boolean
  measurePerformance?: boolean
  requireAuth?: boolean
}

/**
 * 包裝 API 處理程序，添加日誌和錯誤處理
 */
export function withApiHandler(
  handler: (event: any, context: any) => Promise<any>,
  options: ApiHandlerOptions = {}
) {
  const {
    logRequest = true,
    logResponse = true,
    measurePerformance: measurePerf = true,
    requireAuth = false,
  } = options

  return defineEventHandler(async (event) => {
    const startTime = Date.now()
    const requestContext = createRequestContext(event)

    try {
      // 記錄請求開始
      if (logRequest) {
        await logger.logApiRequest(
          event.node.req.url || 'unknown',
          event.node.req.method || 'GET',
          {
            ...requestContext,
            body: event.node.req.method !== 'GET' ? '[BODY_REDACTED]' : undefined,
          }
        )
      }

      // 檢查認證（如果需要）
      if (requireAuth) {
        const user = await getAuthenticatedUser(event)
        if (!user) {
          await logger.warn('Unauthorized access attempt', LogCategory.AUTH, {
            ...requestContext,
          })

          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
          })
        }

        // 將用戶信息附加到 event.context
        event.context.user = user
        requestContext.userId = user.id
      }

      // 執行處理程序
      let response: any

      if (measurePerf) {
        response = await measurePerformance(
          `${event.node.req.method} ${event.node.req.url}`,
          () => handler(event, event.context),
          { ...requestContext }
        )
      } else {
        response = await handler(event, event.context)
      }

      // 記錄響應
      if (logResponse) {
        const duration = Date.now() - startTime

        await logger.info(
          `API Response: ${event.node.req.method} ${event.node.req.url} (${duration}ms)`,
          LogCategory.API,
          {
            ...requestContext,
            statusCode: response?.statusCode || 200,
            duration,
            hasData: !!response?.data,
          }
        )
      }

      return response
    } catch (error: any) {
      const duration = Date.now() - startTime

      // 記錄錯誤
      await logger.logApiError(
        event.node.req.url || 'unknown',
        event.node.req.method || 'GET',
        error,
        {
          ...requestContext,
          duration,
          statusCode: error.statusCode,
        }
      )

      // 返回錯誤響應
      return {
        success: false,
        error: error.message || 'Internal Server Error',
        statusCode: error.statusCode || 500,
        requestId: requestContext.requestId,
        timestamp: new Date().toISOString(),
      }
    }
  })
}

/**
 * 獲取認證用戶（示例實現）
 */
async function getAuthenticatedUser(event: any) {
  try {
    // 從請求中獲取認證信息
    // 這裡應該根據你的認證系統實現
    const authHeader = event.node.req.headers['authorization']

    if (!authHeader) {
      return null
    }

    // 例如：驗證 JWT token
    // const token = authHeader.replace('Bearer ', '')
    // const user = await verifyToken(token)
    // return user

    return null
  } catch (error) {
    return null
  }
}

/**
 * 創建標準化的 API 成功響應
 */
export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 創建標準化的 API 錯誤響應
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  code?: string
) {
  return {
    success: false,
    error: message,
    statusCode,
    code,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 包裝數據庫查詢，自動添加錯誤處理和日誌
 */
export async function withDatabaseLogging<T>(
  operation: string,
  query: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await measurePerformance(
      `Database: ${operation}`,
      () => query(),
      { operation, ...context }
    )
  } catch (error: any) {
    await logger.logDatabaseError(operation, error, context)
    throw error
  }
}
