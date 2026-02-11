// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 3,
  },

  // Runtime Config
  runtimeConfig: {
    // 服务端私有配置
    dashscopeApiKey: process.env.DASHSCOPE_API_KEY,
    supabaseService: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_SECRET_KEY,
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  // Experimental features
  experimental: {
    appManifest: false,
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
    typeCheck: false,
  },

  sourcemap: {
    server: false,
    client: false,
  },

  // Nitro engine optimization
  nitro: {
    // 1. 之前做过的优化保持不变
    sourceMap: false,
    minify: true,
    prerender: {
      concurrency: 1,
      interval: 250
    },

    // 2. 👇👇👇 核心修复代码：强制内联 tslib 👇👇👇
    // 这行代码会把 tslib 直接写入 index.mjs，不再去外部寻找文件
    externals: {
      inline: ['tslib']
    }
  },

  // Pinia Configuration
  pinia: {
    storesDirs: ['./stores/**'],
  },

  // 1. 模块配置：顺序至关重要！
  modules: [
    '@pinia/nuxt',                        // 👈 移至首位，确保 Pinia 最先加载
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
  ],

  // 圖片優化配置
  image: {
    // 格式優化 - 按優先級排序
    format: ['webp', 'avif', 'jpg'],
    // 質量設置
    quality: 80,
    // 預設圖片尺寸
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // 預設 densities
    densities: [1, 2],
  },

  // Supabase Configuration
  supabase: {
    redirect: true,
    // Cookie 配置 - 确保本地开发环境正常工作
    cookieOptions: {
      path: '/',
      sameSite: 'lax',
      secure: false, // 改为 false，因为你目前使用的是 HTTP (IP 直接访问)，设为 true 会导致 Cookie 无法发送给服务器
      httpOnly: false, // 允许客户端访问
      maxAge: 60 * 60 * 24 * 7, // 7 天
    },
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      // 排除所有公开路由 - 支持多语言前缀
      exclude: [
        '/',
        '/products',
        '/products/**',
        '/solutions',
        '/solutions/**',
        '/about',
        '/contact',
        '/support',
        '/support/**',
        '/supercore',
        '/news',
        '/news/**',
        '/404', // 排除 404 页面
        // 多语言版本 - 使用通配符排除所有语言前缀的公开路由
        '/zh-HK',
        '/zh-HK/**',
        '/zh-CN',
        '/zh-CN/**',
        '/en',
        '/en/**',
        '/_nuxt/**',
        '/api/products/public',
        '/api/news/public',
        '/api/solutions/public',
        '/api/inquiries', // 公共询盘提交表单
        '/api/errors', // 错误监控端点
        '/api/system', // 系统状态检查
        '/api/news',
        '/api/solutions',
        '/api/ai-chat', // AI Chat API (Renamed)
        '/api/auth/test-login', // 魔法登录 API
      ],
    },
  },

  // Tailwind CSS
  tailwindcss: {
    configPath: 'tailwind.config.js',
    viewer: true,
  },

  // i18n Configuration
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'zh-HK', iso: 'zh-HK', name: '繁體中文（香港）', file: 'zh-HK.json' },
      { code: 'zh-CN', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: false,
    langDir: 'locales',
    lazy: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
    vueI18n: 'i18n.config.ts',
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // App Config
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'XX - Computing the Future',
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'preconnect', href: 'https://lf3-static.bytednsdoc.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/h7ovhziv/harmonyos-sans/harmonyos-sans.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+HK:wght@300;400;500;700&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Route Rules
  routeRules: {
    '/**': {
      headers: {
        'X-Powered-By': "tianxingleo's Engine",
        'X-Maintainer': 'tianxingleo',
        'X-Created-By': 'tianxingleo',
      },
    },
  },

  // Vite
  vite: {
    optimizeDeps: {
      include: ['gsap', 'lenis'],
      exclude: ['@supabase/postgrest-js', '@supabase/supabase-js', '@supabase/functions-js'],
    },
    build: {
      rollupOptions: {
        output: {
          // ⚠️ 删掉你之前复杂的 manualChunks 函数！
          // 使用最安全的拆分策略：只把巨大的库拆出来，其他的让 Vite 自己算
          manualChunks: {
            'three-vendor': ['three', '@tresjs/core'],
            'echarts-vendor': ['echarts'],
            // 其他的不要手动拆了，很容易崩
          }
        }
      },
      chunkSizeWarningLimit: 1000, // 进一步调高阈值，核心库 large 是预期的
    },
  },
  // Build
  build: {
    // 强制转译这些库，防止生产环境找不到对象
    transpile: [
      '@supabase/postgrest-js',
      '@supabase/supabase-js',
      '@supabase/functions-js',
      'tslib'
    ],
  },
})
