/**
 * Sitemap Route
 * 動態生成站點地圖
 */

export default defineEventHandler((event) => {
  const baseUrl = 'https://projectnexus.hk' // 替換為實際域名

  const routes = [
    { url: '', changefreq: 'weekly', priority: 1.0 },
    { url: 'products', changefreq: 'weekly', priority: 0.9 },
    { url: 'solutions', changefreq: 'weekly', priority: 0.9 },
    { url: 'about', changefreq: 'monthly', priority: 0.8 },
    { url: 'contact', changefreq: 'monthly', priority: 0.7 },
  ]

  // 添加產品頁面
  const productSlugs = ['enterprise-server-rack', 'high-performance-storage', 'managed-switch']
  productSlugs.forEach(slug => {
    routes.push({ url: `products/${slug}`, changefreq: 'monthly', priority: 0.8 })
  })

  // 添加解決方案頁面
  const solutionSlugs = ['data-center-services', 'network-infrastructure', 'managed-operations', 'custom-development', 'security-solutions', 'cloud-services']
  solutionSlugs.forEach(slug => {
    routes.push({ url: `solutions/${slug}`, changefreq: 'monthly', priority: 0.8 })
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}/${route.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})
