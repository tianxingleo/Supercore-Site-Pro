/**
 * Storage Proxy Route
 *
 * 将 /storage/bucket/file.jpg 代理到内网 Supabase Storage
 * 解决 Mixed Content 问题：网站通过 HTTPS 服务，但 Supabase 存储使用 HTTP 内网地址
 *
 * 请求路径：/storage/{bucket}/{filename}
 * 代理目标：http://43.132.185.199:8000/storage/v1/object/public/{bucket}/{filename}
 */
export default defineEventHandler(async (event) => {
  const path = event.context.params?.path

  if (!path) {
    throw createError({ statusCode: 400, message: 'Storage path is required' })
  }

  // 从环境变量或默认值获取内部 Supabase URL
  const config = useRuntimeConfig(event)
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    config.supabaseService?.url ||
    config.public?.supabaseUrl ||
    'http://43.132.185.199:8000'

  // 提取 host，去掉路径部分（防止 SUPABASE_URL 含路径后缀）
  const supabaseBase = supabaseUrl.replace(/\/+$/, '')
  const internalUrl = `${supabaseBase}/storage/v1/object/public/${path}`

  try {
    const response = await $fetch.raw(internalUrl, {
      method: 'GET',
      responseType: 'arrayBuffer',
    })

    // 透传 Content-Type
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setResponseHeader(event, 'Content-Type', contentType)
    }

    // 缓存 24 小时，提升性能
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
    setResponseHeader(event, 'X-Proxied-From', 'supabase-storage')

    return response._data
  } catch (err: any) {
    // 上游 404 → 返回 404
    const status = err?.response?.status || err?.status || 502
    throw createError({
      statusCode: status === 404 ? 404 : 502,
      message: `Storage proxy error: ${err?.message || 'upstream failed'}`,
    })
  }
})
