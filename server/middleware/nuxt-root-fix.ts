import { defineEventHandler, createError } from 'h3'

/**
 * 修复 /_nuxt/ 根目录请求导致的 [unhandled] 错误
 * 当某些调试工具或浏览器插件尝试访问 /_nuxt/ 且 Vite 未处理时，
 * 此中间件确保返回一个正常的 404 而不是触发 unhandled 错误。
 */
export default defineEventHandler((event) => {
  const path = event.path
  if (path === '/_nuxt' || path === '/_nuxt/') {
    // 捕获并返回 404，不抛出异常以避免被错误日志记录器捕获
    event.node.res.statusCode = 404
    return '404 Not Found'
  }
})
