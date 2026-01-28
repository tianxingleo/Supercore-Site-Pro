/**
 * 日志系统
 * 用于记录 API 错误、性能指标和用户操作
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export enum LogCategory {
  API = 'API',
  DATABASE = 'DATABASE',
  AUTH = 'AUTH',
  PERFORMANCE = 'PERFORMANCE',
  USER_ACTION = 'USER_ACTION',
  SYSTEM = 'SYSTEM',
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
  ip?: string
  userAgent?: string
  route?: string
  duration?: number
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * 格式化日志输出
   */
  private formatLog(entry: LogEntry): string {
    const {
      timestamp,
      level,
      category,
      message,
      context,
      userId,
      requestId,
      ip,
      route,
      duration,
      stack,
    } = entry

    let log = `[${timestamp}] [${level}] [${category}]`

    if (userId) log += ` [User:${userId}]`
    if (requestId) log += ` [Request:${requestId}]`
    if (route) log += ` [Route:${route}]`
    if (ip) log += ` [IP:${ip}]`
    if (duration) log += ` [${duration}ms]`

    log += ` ${message}`

    if (context && Object.keys(context).length > 0) {
      log += `\n  Context: ${JSON.stringify(context, null, 2)}`
    }

    if (stack) {
      log += `\n  Stack: ${stack}`
    }

    return log
  }

  /**
   * 输出日志到控制台
   */
  private outputToConsole(entry: LogEntry) {
    const formattedLog = this.formatLog(entry)
    const logMethod = this.getConsoleMethod(entry.level)

    if (entry.level === LogLevel.ERROR || entry.level === LogLevel.FATAL) {
      logMethod(formattedLog)
    } else if (this.isDevelopment) {
      logMethod(formattedLog)
    }

    // 將錄到 localStorage（僅客戶端錯誤和警告）
    if (import.meta.client && (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN || entry.level === LogLevel.FATAL)) {
      this.saveToLocalStorage(entry)
    }
  }

  /**
   * 保存日誌到 localStorage
   */
  private saveToLocalStorage(entry: LogEntry) {
    if (typeof window === 'undefined') return

    try {
      const maxLogs = 100 // 最多保存 100 條日誌
      const storageKey = 'error_logs'

      // 讀取現有日誌
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const logs = Array.isArray(existingLogs) ? existingLogs : []

      // 添加新日誌
      logs.unshift(entry)

      // 限制日誌數量
      const limitedLogs = logs.slice(0, maxLogs)

      // 保存回 localStorage
      localStorage.setItem(storageKey, JSON.stringify(limitedLogs))
    } catch (error) {
      console.error('[Logger] Failed to save log to localStorage:', error)
    }
  }

  /**
   * 获取控制台方法
   */
  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.log
      case LogLevel.INFO:
        return console.info
      case LogLevel.WARN:
        return console.warn
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error
      default:
        return console.log
    }
  }

  /**
   * 异步写入日志到数据库（可选）
   */
  private async writeToDatabase(entry: LogEntry) {
    // 在生产环境中，可以將日志寫入數據庫或外部日誌服務
    if (this.isDevelopment) return

    try {
      // 這裡可以集成日誌服務，如：
      // - Supabase 數據庫日志表
      // - Sentry, DataDog 等外部服務
      // - 文件系統日志
      console.log('[Logger] Writing to database:', entry.message)
    } catch (error) {
      console.error('[Logger] Failed to write log to database:', error)
    }
  }

  /**
   * 記錄日誌
   */
  private async log(entry: LogEntry) {
    this.outputToConsole(entry)
    await this.writeToDatabase(entry)
  }

  /**
   * Debug 级别日志
   */
  async debug(message: string, context?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      category: LogCategory.SYSTEM,
      message,
      context,
    })
  }

  /**
   * Info 级别日志
   */
  async info(message: string, category: LogCategory = LogCategory.SYSTEM, context?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      category,
      message,
      context,
    })
  }

  /**
   * Warning 级别日志
   */
  async warn(message: string, category: LogCategory = LogCategory.SYSTEM, context?: Record<string, any>) {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      category,
      message,
      context,
    })
  }

  /**
   * Error 级别日志
   */
  async error(
    message: string,
    error: Error | null = null,
    category: LogCategory = LogCategory.SYSTEM,
    context?: Record<string, any>
  ) {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      category,
      message,
      context,
      stack: error?.stack,
    })
  }

  /**
   * Fatal 级别日志
   */
  async fatal(
    message: string,
    error: Error | null = null,
    category: LogCategory = LogCategory.SYSTEM,
    context?: Record<string, any>
  ) {
    await this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.FATAL,
      category,
      message,
      context,
      stack: error?.stack,
    })
  }

  /**
   * API 请求日志
   */
  async logApiRequest(
    route: string,
    method: string,
    context?: Record<string, any>
  ) {
    await this.info(`${method} ${route}`, LogCategory.API, context)
  }

  /**
   * API 错误日志
   */
  async logApiError(
    route: string,
    method: string,
    error: Error,
    context?: Record<string, any>
  ) {
    await this.error(
      `API Error: ${method} ${route}`,
      error,
      LogCategory.API,
      {
        ...context,
        route,
        method,
      }
    )
  }

  /**
   * 数据库错误日志
   */
  async logDatabaseError(
    operation: string,
    error: Error,
    context?: Record<string, any>
  ) {
    await this.error(
      `Database Error: ${operation}`,
      error,
      LogCategory.DATABASE,
      {
        ...context,
        operation,
      }
    )
  }

  /**
   * 性能日志
   */
  async logPerformance(
    operation: string,
    duration: number,
    context?: Record<string, any>
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: duration > 1000 ? LogLevel.WARN : LogLevel.INFO,
      category: LogCategory.PERFORMANCE,
      message: `Performance: ${operation} completed in ${duration}ms`,
      context,
      duration,
    }

    await this.log(entry)
  }

  /**
   * 用户操作日志
   */
  async logUserAction(
    action: string,
    userId?: string,
    context?: Record<string, any>
  ) {
    await this.info(`User Action: ${action}`, LogCategory.USER_ACTION, {
      userId,
      ...context,
    })
  }
}

// 创建全局 logger 实例
export const logger = new Logger()

/**
 * 性能測量輔助函數
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> {
  const start = Date.now()

  try {
    const result = await fn()
    const duration = Date.now() - start
    await logger.logPerformance(operation, duration, context)
    return result
  } catch (error) {
    const duration = Date.now() - start
    await logger.logPerformance(operation, duration, {
      ...context,
      error: 'Operation failed',
    })
    throw error
  }
}

/**
 * 创建请求上下文
 */
export function createRequestContext(event: any) {
  const headers = event.node.req.headers
  return {
    ip: headers['x-forwarded-for'] || headers['x-real-ip'] || event.node.req.socket?.remoteAddress,
    userAgent: headers['user-agent'],
    requestId: headers['x-request-id'] || crypto.randomUUID(),
    method: event.node.req.method,
    url: event.node.req.url,
  }
}
