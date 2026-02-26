/**
 * Storage URL Sanitizer
 *
 * 将数据库中存储的内网 Supabase HTTP URL 转换为服务端代理路径，
 * 避免浏览器 Mixed Content 拦截（HTTPS 页面加载 HTTP 资源）。
 *
 * 转换示例:
 *   http://43.132.185.199:8000/storage/v1/object/public/news-covers/foo.jpg
 *   → /storage/news-covers/foo.jpg
 *
 * 该代理路由由 server/routes/storage/[...path].ts 提供。
 */

const STORAGE_PUBLIC_PREFIX_RE = /^https?:\/\/[^/]+\/storage\/v1\/object\/public\//

/**
 * 将单个存储 URL 转换为代理路径。
 * 非存储 URL 原样返回。
 */
export function sanitizeStorageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url
  if (!STORAGE_PUBLIC_PREFIX_RE.test(url)) return url
  return url.replace(STORAGE_PUBLIC_PREFIX_RE, '/storage/')
}

/**
 * 批量处理 URL 数组。
 */
export function sanitizeStorageUrls(urls: string[] | null | undefined): string[] {
  if (!urls) return []
  return urls.map((url) => (sanitizeStorageUrl(url) as string) || url)
}
