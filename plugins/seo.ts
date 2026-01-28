/**
 * SEO 插件
 * 為所有頁面添加 canonical 標籤和結構化數據
 */

export default defineNuxtPlugin((nuxtApp) => {
  const baseUrl = 'https://projectnexus.hk'
  const i18n = nuxtApp.$i18n

  // 生成 canonical URL
  const getCanonicalUrl = (path: string, locale: string) => {
    // 英語是默認語言，不需要前綴
    if (locale === 'en') {
      return `${baseUrl}${path}`
    }
    return `${baseUrl}/${locale}${path}`
  }

  // 生成多語言替代鏈接
  const getAlternateLinks = (path: string) => {
    const locales = ['zh-HK', 'zh-CN', 'en']

    return locales.map((lang) => {
      const href = getCanonicalUrl(path, lang)
      return {
        rel: 'alternate',
        hreflang: lang,
        href,
      }
    })
  }

  // 為所有頁面添加 SEO 標籤
  nuxtApp.hook('page:finish', () => {
    try {
      // 从 nuxtApp 获取需要的实例，避免在非 setup 顶层调用 composables
      const router: any = nuxtApp.$router
      const route = router?.currentRoute?.value

      if (!route) return

      // 使用已经获取的 i18n 实例
      const locale = (i18n as any)?.locale?.value || 'en'

      const canonicalUrl = getCanonicalUrl(route.path, locale)
      const alternateLinks = getAlternateLinks(route.path)

      useHead({
        link: [
          {
            rel: 'canonical',
            href: canonicalUrl,
          },
          ...alternateLinks,
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: getCanonicalUrl(route.path, 'en'),
          },
        ],
      })
    } catch (error) {
      console.warn('[SEO Plugin] Unable to set canonical tags:', error)
    }
  })

  // 提供全局使用的組合式函數
  return {
    provide: {
      seo: {
        getCanonicalUrl,
        getAlternateLinks,
      },
    },
  }
})
