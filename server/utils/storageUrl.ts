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

export function sanitizeStorageUrl(url: string | null | undefined): string | null | undefined {
  if (!url) return url
  if (!STORAGE_PUBLIC_PREFIX_RE.test(url)) return url
  
  const baseUrl = process.env.SUPABASE_URL || 'https://api.supercore.hk'
  const prefix = baseUrl.replace(/\/+$/, '') + '/storage/v1/object/public/'
  
  return url.replace(STORAGE_PUBLIC_PREFIX_RE, prefix)
}

/**
 * 批量处理 URL 数组。
 */
export function sanitizeStorageUrls(urls: string[] | null | undefined): string[] {
  if (!urls) return []
  return urls.map((url) => (sanitizeStorageUrl(url) as string) || url)
}

/**
 * 清理单条 Post / Product 记录中的所有图片 URL 字段。
 * 支持 cover_image、images（数组）字段。
 */
export function sanitizeRecord<T extends Record<string, any>>(record: T): T {
  if (!record) return record
  const result: any = { ...record }

  // 单一图片字段
  const singleFields = ['cover_image', 'image', 'thumbnail', 'avatar', 'cover']
  for (const field of singleFields) {
    if (typeof result[field] === 'string') {
      result[field] = sanitizeStorageUrl(result[field]) ?? result[field]
    }
  }

  // 数组图片字段
  const arrayFields = ['images', 'thumbnails', 'gallery']
  for (const field of arrayFields) {
    if (Array.isArray(result[field])) {
      result[field] = sanitizeStorageUrls(result[field])
    }
  }

  return result
}

/**
 * 批量清理记录数组。
 */
export function sanitizeRecords<T extends Record<string, any>>(records: T[] | null | undefined): T[] {
  if (!records) return []
  return records.map(sanitizeRecord)
}
