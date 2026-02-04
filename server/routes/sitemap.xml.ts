/**
 * Sitemap Route
 * 動態生成站點地圖 - 從數據庫獲取真實數據
 */

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://www.example.com' // 替換為實際域名

  const routes: Array<{
    url: string
    changefreq: string
    priority: number
    lastmod?: string
  }> = [
    { url: '', changefreq: 'weekly', priority: 1.0 },
    { url: 'products', changefreq: 'weekly', priority: 0.9 },
    { url: 'solutions', changefreq: 'weekly', priority: 0.9 },
    { url: 'news', changefreq: 'daily', priority: 0.8 },
    { url: 'about', changefreq: 'monthly', priority: 0.8 },
    { url: 'contact', changefreq: 'monthly', priority: 0.7 },
  ]

  try {
    // 使用 service_role 客戶端繞過 RLS
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SECRET_KEY

    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      // 獲取已發布的產品
      const { data: products } = await client
        .from('products')
        .select('slug, updated_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (products && products.length > 0) {
        products.forEach((product) => {
          routes.push({
            url: `products/${product.slug}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: product.updated_at || new Date().toISOString(),
          })
        })
      }

      // 獲取已發布的新聞
      const { data: news } = await client
        .from('news')
        .select('slug, updated_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (news && news.length > 0) {
        news.forEach((article) => {
          routes.push({
            url: `news/${article.slug}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: article.updated_at || new Date().toISOString(),
          })
        })
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 如果數據庫查詢失敗，仍然返回基本路由
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(route => `  <url>
    <loc>${baseUrl}/${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <!-- 多語言替代頁面 -->
    <xhtml:link rel="alternate" hreflang="zh-HK" href="${baseUrl}/zh-HK/${route.url}" />
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${baseUrl}/zh-CN/${route.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/${route.url}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/${route.url}" />
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
