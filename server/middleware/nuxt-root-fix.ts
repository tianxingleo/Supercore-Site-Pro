import { defineEventHandler, createError } from 'h3'

/**
 * 修复 /_nuxt/ 根目录请求导致的 [unhandled] 错误
 * 当某些调试工具或浏览器插件尝试访问 /_nuxt/ 且 Vite 未处理时，
 * 此中间件确保返回一个正常的 404 而不是触发 unhandled 错误。
 */
export default defineEventHandler((event) => {
  const path = event.path
  // 检查是否是 /_nuxt 或 /_nuxt/ (不带文件名)
  if (path === '/_nuxt' || path === '/_nuxt/') {
    // 设置 404 状态并直接结束请求，防止触发 unhandled 错误日志
    setResponseStatus(event, 404)
    return 'Not Found'
  }
})
