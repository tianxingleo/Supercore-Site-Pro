// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  // Components Configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Disabled due to vue-tsc issues in dev mode
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    // '@nuxt/image' - 可選：安裝後啟用圖片優化
    // 運行: npm install @nuxt/image
  ],

  // 圖片優化配置（需要先安裝 @nuxt/image）
  // image: {
  //   // 格式優化
  //   formats: ['webp', 'avif'],
  //   // 質量設置
  //   quality: 80,
  //   // 使用內部圖片服務
  //   internalUrl: '/_image',
  // },

  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
  },

  // i18n Configuration
  i18n: {
    defaultLocale: 'zh-HK',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'zh-HK', iso: 'zh-HK', name: '繁體中文（香港）', file: 'zh-HK.json' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'zh-HK',
      redirectOn: 'root',
    },
    langDir: 'locales',
    lazy: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
    vueI18n: './i18n/i18n.config.ts',
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // App Config
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '廣東博迩科技有限公司',
      meta: [
        {
          name: 'description',
          content:
            '企業基礎設施一體化解決方案服務提供商，提供服務器、網絡、數據中心等產品和解決方案',
        },
        {
          name: 'keywords',
          content: '服務器,網絡,數據中心,基礎設施整體解決方案,IDC,HPC,存儲,交換機',
        },
        { name: 'author', content: '廣東博迩科技有限公司' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: '廣東博迩科技有限公司' },
        { property: 'og:locale', content: 'zh_HK' },
        { property: 'og:title', content: '廣東博迩科技有限公司 - 專業基礎設施解決方案服務提供商' },
        {
          property: 'og:description',
          content: '提供企業級服務器、存儲、網絡產品和整體解決方案，服務廣州及全國市場',
        },
        { property: 'og:image', content: '/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '廣東博迩科技有限公司 - 專業基礎設施解決方案服務提供商' },
        {
          name: 'twitter:description',
          content: '提供企業級服務器、存儲、網絡產品和整體解決方案，服務廣州及全國市場',
        },
        { name: 'twitter:image', content: '/og-image.jpg' },
      ],
      htmlAttrs: {
        lang: 'zh-HK',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+HK:wght@300;400;500;700&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Route Rules (ISR for performance)
  routeRules: {
    '/': { isr: 3600 }, // 1 hour
    '/products': { isr: 86400 }, // 1 day
    '/products/**': { isr: 86400 },
    '/solutions': { isr: 86400 },
    '/solutions/**': { isr: 86400 },
    '/about': { isr: 604800 }, // 1 week
    '/contact': { isr: 604800 },
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['gsap', 'lenis'],
    },
  },
})
