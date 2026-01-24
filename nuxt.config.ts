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
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['gsap', 'lenis'],
    },
  },
})
