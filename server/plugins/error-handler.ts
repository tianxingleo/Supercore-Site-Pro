import type { H3Error, H3Event } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    // 忽略 _nuxt 和 _payload.json 目录的 404 错误（Vite 开发时请求）
    const path = event?.path || ''
    if ((path.startsWith('/_nuxt/') || path.includes('_payload.json')) && (error as H3Error).statusCode === 404) {
      return
    }
    
    // 如果是开发环境且是已知的控制台报错，可以选择性过滤
    if (process.dev) {
      if (error.message?.includes('PostgrestError') || error.message?.includes('FunctionRegion')) {
        return
      }
    }
  })

  // 原有的 onError 处理逻辑也可以保留或改进
  const h3OnError = nitroApp.h3App.options.onError
  nitroApp.h3App.options.onError = (error: Error, event: H3Event) => {
    const h3Error = error as H3Error
    if (h3Error?.statusCode === 404 && event.path?.startsWith('/_nuxt/')) {
      return
    }
    if (h3OnError) {
      return h3OnError(error, event)
    }
  }
})
