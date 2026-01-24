// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false, // Disabled due to vue-tsc issues in dev mode
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    // Supabase will be added on Day 3
  ],

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
      { code: 'zh-HK', iso: 'zh-HK', name: '繁體中文（香港）' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ],
    vueI18n: './i18n.config.ts'
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // App Config
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Project NEXUS (HK)',
      meta: [
        { name: 'description', content: '香港及海外市场的高端基础设施解决方案' },
        { name: 'keywords', content: '伺服器,基礎設施,IDC,數據中心,香港,雲端運維' },
        { name: 'author', content: 'Project NEXUS (HK)' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Project NEXUS (HK)' },
        { property: 'og:locale', content: 'zh_HK' },
        { property: 'og:title', content: 'Project NEXUS (HK) - 專業基礎設施解決方案' },
        { property: 'og:description', content: '為香港及海外市場提供企業級伺服器、存儲、網絡及運維解決方案' },
        { property: 'og:image', content: '/og-image.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Project NEXUS (HK) - 專業基礎設施解決方案' },
        { name: 'twitter:description', content: '為香港及海外市場提供企業級伺服器、存儲、網絡及運維解決方案' },
        { name: 'twitter:image', content: '/og-image.jpg' },
      ],
      htmlAttrs: {
        lang: 'zh-HK',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
