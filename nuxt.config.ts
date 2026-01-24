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
    typeCheck: true,
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
  ],

  // Tailwind CSS
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
  },

  // i18n Configuration
  i18n: {
    locales: [
      {
        code: 'zh-HK',
        iso: 'zh-HK',
        name: '繁體中文（香港）',
        file: 'zh-HK.json',
      },
      {
        code: 'zh-CN',
        iso: 'zh-CN',
        name: '简体中文',
        file: 'zh-CN.json',
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
      },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'zh-HK',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
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

  // Runtime Config
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['gsap', 'lenis'],
    },
  },
})
