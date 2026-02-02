/**
 * 客户端错误监控插件
 * 捕获并上报前端错误
 */

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * 上报错误到服务器
   */
  async function reportError(error: any, context?: Record<string, any>) {
    try {
      // 过滤Supabase相关错误
      if (
        error?.message?.includes('supabase') ||
        error?.message?.includes('jwks.json') ||
        error?.message?.includes('setup') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('network')
      ) {
        console.warn('[ErrorMonitor] Skipping error report:', error.message)
        return
      }

      await $fetch('/api/errors/client', {
        method: 'POST',
        body: {
          message: error?.message || 'Unknown error',
          stack: error?.stack,
          name: error?.name,
          context: {
            ...context,
            userAgent: process.client ? navigator.userAgent : 'Server',
            url: process.client ? window.location.href : 'Server',
            timestamp: new Date().toISOString(),
          },
        },
      })
    } catch (reportError) {
      console.error('[ErrorMonitor] Failed to report error:', reportError)
    }
  }

  /**
   * 全局错误处理器
   */
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('[ErrorMonitor] Vue error:', error, info)

    reportError(error, {
      component: instance?.$options?.name || 'Unknown',
      info,
      type: 'Vue Error',
    })
  }

  /**
   * 捕获未处理的 Promise rejection
   */
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[ErrorMonitor] Unhandled promise rejection:', event.reason)

      reportError(event.reason, {
        type: 'Unhandled Promise Rejection',
      })
    })

    /**
     * 捕获全局错误
     */
    window.addEventListener('error', (event) => {
      console.error('[ErrorMonitor] Global error:', event.error)

      reportError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'Global Error',
      })
    })

    /**
     * 捕获资源加载错误
     */
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement
        console.error('[ErrorMonitor] Resource load error:', target)

        reportError(new Error(`Resource failed to load: ${target.tagName}`), {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href,
          type: 'Resource Load Error',
        })
      }
    }, true)
  }

  /**
   * 提供全局使用的错误監控方法
   */
  return {
    provide: {
      errorMonitor: {
        reportError,
        logError: (message: string, error?: Error) => {
          console.error('[ErrorMonitor]', message, error)
          reportError(error || new Error(message), {
            message,
            type: 'Manual Log',
          })
        },
      },
    },
  }
})
