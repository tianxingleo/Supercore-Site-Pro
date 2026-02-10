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

  // 移除了直接修改 nitroApp.h3App.options.onError 的逻辑，
  // 因为这可能会干扰 Nuxt 的内部错误处理流程，导致 SSR 上下文丢失。
})
