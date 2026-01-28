/**
 * 客户端错误报告 API
 * 接收并记录前端错误
 */

import { logger, LogCategory } from '~/utils/logger'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method Not Allowed',
    })
  }

  try {
    const body = await readBody(event)

    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body',
      })
    }

    const { message, stack, name, context } = body as {
      message: string
      stack?: string
      name?: string
      context?: Record<string, any>
    }

    // 記錄客戶端錯誤
    await logger.error(
      `Client Error: ${message}`,
      stack ? new Error(message) : null,
      LogCategory.SYSTEM,
      {
        ...context,
        errorName: name,
        source: 'client',
      }
    )

    // 在生產環境中，這裡可以：
    // 1. 寫入數據庫錯誤日志表
    // 2. 發送到 Sentry, DataDog 等外部服務
    // 3. 發送警報郵件

    return {
      success: true,
      message: 'Error reported successfully',
    }
  } catch (error: any) {
    await logger.error('Failed to process client error report', error, LogCategory.SYSTEM)

    throw createError({
      statusCode: 500,
      message: 'Failed to process error report',
    })
  }
})
