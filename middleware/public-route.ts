/**
 * Public Route Middleware
 * 确保公开路由（产品、解决方案等）不会被重定向到管理界面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 公开路由列表 - 不需要认证即可访问
  const publicRoutes = [
    '/',
    '/products',
    '/solutions',
    '/about',
    '/contact',
    '/support',
    '/supercore',
    '/news',
  ]

  // 检查当前路径是否是公开路由
  const isPublicRoute = publicRoutes.some(route => {
    // 支持多语言前缀
    const pathSegments = to.path.split('/').filter(Boolean)
    if (pathSegments.length === 0) return route === '/'

    // 移除语言前缀（zh-HK, zh-CN, en）
    const localeCodes = ['zh-HK', 'zh-CN', 'en']
    const firstSegment = pathSegments[0]

    if (localeCodes.includes(firstSegment)) {
      // 如果第一个路径段是语言代码，检查第二个路径段
      const remainingPath = '/' + (pathSegments.slice(1).join('/') || '')
      return remainingPath.startsWith(route) || remainingPath === route
    }

    // 没有语言前缀，直接检查路径
    return to.path.startsWith(route) || to.path === route
  })

  // 如果是公开路由，不进行任何重定向
  if (isPublicRoute) {
    return
  }

  // 管理界面路由 - 允许 Supabase 中间件处理
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route))

  if (isAdminRoute) {
    // 让 Supabase 中间件处理管理界面的认证
    return
  }
})
