/**
 * ============================================================================
 * Nuxt 3 核心配置文件
 * ============================================================================
 *
 * 文件作用：
 * 此文件是 Nuxt 3 应用程序的根配置文件，负责定义整个应用的全局设置。
 * 它控制着应用的核心行为，包括国际化、数据库连接、样式框架、图片优化、
 * 路由缓存策略等关键功能。
 *
 * 实现手段：
 * 1. 使用 defineNuxtConfig() 函数导出配置对象，这是 Nuxt 3 的标准配置方式
 * 2. 配置项分为多个模块化部分（Supabase、i18n、Tailwind CSS 等）
 * 3. 通过 runtimeConfig 管理环境变量，区分公共配置和服务端私有配置
 * 4. 使用 Vite 优化依赖，提高构建性能
 * 5. 通过 routeRules 实现增量静态再生（ISR），优化页面加载性能
 *
 * 关键技术点：
 * - Supabase：用于身份认证和数据库连接
 * - i18n：实现多语言支持（繁体中文、简体中文、英文）
 * - Tailwind CSS：提供瑞士设计风格的样式系统
 * - @nuxt/image：优化图片加载，支持 WebP/AVIF 格式
 * - ISR（增量静态再生）：缓存策略提升性能
 *
 * 环境变量需求：
 * - SUPABASE_URL：Supabase 项目 URL
 * - SUPABASE_KEY：客户端公开密钥（anon key）
 * - SUPABASE_SECRET_KEY：服务端私有密钥（service role key）
 *
 * 安全注意：
 * - runtimeConfig.public：这些变量会暴露给客户端，只能存放不敏感的信息
 * - runtimeConfig.supabaseService：这些变量只在服务端可用，包含敏感信息
 * - cookieOptions 配置确保了安全的会话管理
 *
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 * ============================================================================
 */

// 导入 Nuxt 配置定义函数
// defineNuxtConfig() 是 Nuxt 3 提供的类型安全配置函数
export default defineNuxtConfig({
  // ============================================================================
  // 兼容性日期配置
  // ============================================================================
  // 指定 Nuxt 3 的兼容性基准日期，确保项目使用该日期之后的稳定 API
  // 这样可以避免 Nuxt 升级时引入的破坏性变更
  // 2024-04-03 是一个稳定的基准版本
  compatibilityDate: '2024-04-03',

  // ============================================================================
  // 开发工具配置
  // ============================================================================
  // 启用 Nuxt DevTools，提供可视化的开发体验
  // DevTools 可以查看组件树、路由信息、模块配置等
  // 生产环境自动禁用
  devtools: { enabled: true },

  // ============================================================================
  // 未来版本兼容性配置
  // ============================================================================
  // 提前启用 Nuxt 4 的兼容性模式
  // 这有助于在 Nuxt 3 项目中使用即将发布的 Nuxt 4 特性
  // 值为 4 表示启用 Nuxt 4 的行为和 API
  future: {
    compatibilityVersion: 4,
  },

  // ============================================================================
  // 运行时配置（Runtime Config）
  // ============================================================================
  // 运行时配置允许在运行时访问环境变量
  // 这是在构建后仍然可以修改的配置，主要用于管理密钥和 API 地址
  //
  // 为什么分为 public 和私有配置？
  // - public：这些变量会暴露给浏览器（客户端），可以安全地访问
  // - 私有：这些变量只在服务端（服务器端渲染或 API 路由）可用，不会暴露给客户端
  runtimeConfig: {
    // 公共配置：可暴露给客户端
    public: {
      // Supabase 项目 URL，用于客户端连接
      // process.env 访问系统环境变量
      supabaseUrl: process.env.SUPABASE_URL,

      // Supabase 客户端密钥（anon key）
      // 这个密钥是公开的，允许任何人读取数据库
      // 配合 Supabase 的行级安全策略（RLS）来限制访问权限
      supabaseKey: process.env.SUPABASE_KEY,
    },

    // 私有配置：仅在服务端可用
    // 这些配置不会暴露给客户端，安全级别更高
    supabaseService: {
      // Supabase 服务端 URL，与客户端相同
      url: process.env.SUPABASE_URL,

      // Supabase 服务端密钥（service role key）
      // 这个密钥具有完全权限，可以绕过所有安全策略
      // ⚠️ 严禁在客户端代码中使用，否则会带来严重的安全风险
      // 只能在服务端 API 或服务器组件中使用
      key: process.env.SUPABASE_SECRET_KEY,
    },
  },

  // ============================================================================
  // 实验性功能
  // ============================================================================
  // 已移除实验性功能，以避免 #app-manifest 错误
  // 这些实验性功能可能存在稳定性问题，因此在生产环境中不建议使用

  // ============================================================================
  // 组件自动导入配置
  // ============================================================================
  // Nuxt 3 支持自动导入组件，无需手动 import
  // 配置组件扫描路径和导入规则
  components: [
    {
      // 扫描 ~/components 目录下的所有组件
      // ~/ 表示项目根目录，实际路径是 components 文件夹
      path: '~/components',

      // 不添加路径前缀
      // pathPrefix: false 表示直接使用组件文件名
      // 例如：components/navigation/AppNavbar.vue
      // 导入时：<AppNavbar /> 而不是 <NavigationAppNavbar />
      pathPrefix: false,
    },
  ],

  // ============================================================================
  // TypeScript 配置
  // ============================================================================
  typescript: {
    // 启用严格模式，强制执行更严格的类型检查
    // 这样可以提前发现类型错误，提高代码质量
    strict: true,

    // 禁用开发模式下的类型检查
    // vue-tsc 在开发模式下可能会出现性能问题或误报
    // 因此在开发环境中禁用，但在生产构建时仍然会检查
    // 如果需要类型检查，可以运行 npm run typecheck 或 npm run build
    typeCheck: false,
  },

  // ============================================================================
  // Nuxt 模块配置
  // ============================================================================
  // 模块是 Nuxt 的扩展，提供额外的功能
  // 这里注册了所有需要使用的官方模块
  modules: [
    '@nuxt/image', // 图片优化模块，自动优化图片格式和尺寸
    '@nuxtjs/i18n', // 国际化模块，实现多语言支持
    '@nuxtjs/supabase', // Supabase 集成模块，提供数据库和身份认证
    '@nuxt/ui', // UI 组件库，提供预构建的组件
  ],

  // ============================================================================
  // 图片优化配置（@nuxt/image）
  // ============================================================================
  image: {
    // 格式优化：按优先级顺序尝试转换图片格式
    // 列表顺序表示优先级：WebP 优先，如果浏览器不支持则尝试 AVIF，最后回退到 JPG
    // WebP：Google 开发的现代图片格式，体积更小，质量更好
    // AVIF：最新的图片格式，比 WebP 更优，但浏览器支持度较低
    format: ['webp', 'avif', 'jpg'],

    // 图片质量：设置为 80
    // 范围是 0-100，80 是质量和文件大小的良好平衡点
    // 质量越高，文件越大，加载速度越慢
    quality: 80,

    // 响应式图片尺寸（screens）
    // 这些尺寸对应 Tailwind CSS 的断点系统
    // 当使用 <NuxtImage> 时，会根据设备宽度自动选择合适的尺寸
    // xs: 超小屏幕（手机竖屏）
    screens: {
      xs: 320, // 320px - 最小手机屏幕
      sm: 640, // 640px - 小型平板或大手机
      md: 768, // 768px - 平板设备
      lg: 1024, // 1024px - 小型笔记本
      xl: 1280, // 1280px - 桌面显示器
      xxl: 1536, // 1536px - 大屏幕显示器
    },

    // 像素密度（densities）
    // 支持高 DPI（视网膜）屏幕的图片优化
    // 1: 标准屏幕（1x）
    // 2: 高 DPI 屏幕（2x，如 MacBook Retina）
    densities: [1, 2],
  },

  // ============================================================================
  // Supabase 配置
  // ============================================================================
  supabase: {
    // 启用自动重定向
    // 当用户未登录时，自动重定向到登录页面
    // 当用户已登录时，自动重定向到受保护页面
    redirect: true,

    // Cookie 配置 - 确保本地开发环境正常工作
    // Supabase 使用 cookie 存储用户会话信息
    // 这些配置确保 cookie 在不同环境下正确工作
    cookieOptions: {
      // Cookie 路径设置为根路径
      // 这意味着 cookie 在整个网站的所有页面都可用
      path: '/',

      // SameSite 属性设置为 'lax'
      // 'lax' 允许跨站点的 GET 请求携带 cookie
      // 这是平衡安全性和功能性的最佳选择
      // 'strict': 最安全，但会阻止某些合法的跨站请求
      // 'none': 最宽松，但需要配合 secure: true 使用
      sameSite: 'lax',

      // Secure 属性
      // 在生产环境中设置为 true，确保 cookie 只通过 HTTPS 传输
      // 在开发环境中设置为 false，因为 HTTP 无法使用 secure cookie
      // process.env.NODE_ENV === 'production' 判断当前是否为生产环境
      secure: process.env.NODE_ENV === 'production',

      // HttpOnly 属性
      // 设置为 false 允许客户端 JavaScript 访问 cookie
      // 设置为 true 会阻止 JavaScript 访问，提高安全性
      // 这里设置为 false，因为客户端需要访问用户会话信息
      httpOnly: false,

      // Max-Age：cookie 的有效期
      // 60 * 60 * 24 * 7 = 7 天（以秒为单位）
      // 7 天后 cookie 自动过期，用户需要重新登录
      maxAge: 60 * 60 * 24 * 7,
    },

    // 重定向选项配置
    redirectOptions: {
      // 未登录用户访问受保护页面时重定向的登录页面
      login: '/admin/login',

      // 登录成功后重定向的页面
      callback: '/admin',

      // 排除列表：这些路由不需要身份认证
      // 支持多语言前缀，确保所有语言的公开页面都可以访问
      // 使用通配符（**）匹配所有子路径
      exclude: [
        '/', // 首页
        '/products', // 产品列表页
        '/products/**', // 产品详情页及所有子页面
        '/solutions', // 解决方案列表页
        '/solutions/**', // 解决方案详情页及所有子页面
        '/about', // 关于我们页面
        '/contact', // 联系我们页面
        '/support', // 支持页面
        '/support/**', // 支持文档及所有子页面
        '/supercore', // 超核产品页面
        '/news', // 新闻列表页
        '/news/**', // 新闻详情页及所有子页面
        '/404', // 404 错误页面

        // 多语言版本 - 使用通配符排除所有语言前缀的公开路由
        // 繁体中文（香港）
        '/zh-HK', // 繁体中文首页
        '/zh-HK/**', // 繁体中文所有页面

        // 简体中文
        '/zh-CN', // 简体中文首页
        '/zh-CN/**', // 简体中文所有页面

        // 英文
        '/en', // 英文首页
        '/en/**', // 英文所有页面

        // Nuxt 内部资源（静态文件、JS/CSS）
        '/_nuxt/**', // Nuxt 构建的静态资源

        // 公共 API 端点（不需要身份认证）
        '/api/products/public', // 公共产品 API
        '/api/news/public', // 公共新闻 API
        '/api/solutions/public', // 公共解决方案 API
        '/api/inquiries', // 询盘提交表单（公开）
        '/api/errors', // 错误监控端点
        '/api/system', // 系统状态检查

        // 其他需要公开的 API 端点
        '/api/news', // 新闻 API
        '/api/solutions', // 解决方案 API
      ],
    },
  },

  // ============================================================================
  // Tailwind CSS 配置
  // ============================================================================
  tailwindcss: {
    // 指定 Tailwind CSS 配置文件的路径
    // 使用单独的配置文件便于管理自定义主题和插件
    configPath: 'tailwind.config.js',

    // 启用 Tailwind CSS 查看器
    // 在开发模式下可以访问 http://localhost:3000/_tailwind
    // 可以查看所有可用的 Tailwind 类和自定义主题
    viewer: true,
  },

  // ============================================================================
  // 国际化配置（i18n）
  // ============================================================================
  i18n: {
    // 默认语言设置为英文
    // 当用户首次访问时，如果浏览器语言不在支持的语言列表中，将使用英文
    defaultLocale: 'en',

    // URL 路由策略：prefix_except_default
    // 默认语言（英文）不使用 URL 前缀
    // 其他语言使用语言代码作为 URL 前缀
    // 例如：
    // - 英文：/products
    // - 繁体中文：/zh-HK/products
    // - 简体中文：/zh-CN/products
    strategy: 'prefix_except_default',

    // 支持的语言列表
    // 每个语言配置包含：
    // - code: 语言代码，用于内部标识和 URL 前缀
    // - iso: ISO 639-1 语言代码，用于 HTML lang 属性和 SEO
    // - name: 语言显示名称，用于语言切换器
    // - file: 翻译文件名，对应 locales 目录下的 JSON 文件
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

    // 浏览器语言检测配置
    detectBrowserLanguage: {
      // 使用 cookie 存储用户选择的语言
      // 这样用户刷新页面或下次访问时，会记住之前的语言选择
      useCookie: true,

      // Cookie 键名
      // i18n_redirected 是 i18n 模块默认的 cookie 名称
      cookieKey: 'i18n_redirected',

      // 回退语言：如果检测到的语言不在支持列表中，使用英文
      fallbackLocale: 'en',

      // 在根路径时进行重定向
      // 只在访问根路径（/）时根据浏览器语言自动跳转
      // 其他路径不会强制重定向，避免用户体验问题
      redirectOn: 'root',

      // 不总是重定向
      // 设置为 false 表示只在首次访问时重定向
      // 设置为 true 会每次访问都检查并重定向，可能影响性能
      alwaysRedirect: false,
    },

    // 语言文件目录
    // 指定翻译文件的存储位置
    langDir: 'locales',

    // 懒加载设置为 false
    // 懒加载会在需要时才加载语言文件，减少初始加载体积
    // 这里设置为 false，表示在应用启动时加载所有语言文件
    lazy: false,

    // Bundle 配置
    bundle: {
      // 禁用翻译指令优化
      // i18n 模块提供的 t: 指令可以优化性能
      // 但在某些情况下可能导致问题，因此禁用
      optimizeTranslationDirective: false,
    },

    // Vue I18n 配置文件
    // 指定 Vue I18n 的自定义配置文件路径
    // 这个文件可以定义全局翻译函数、格式化器等
    vueI18n: 'i18n.config.ts',
  },

  // ============================================================================
  // CSS 配置
  // ============================================================================
  // 全局 CSS 文件
  // 这些 CSS 会在所有页面中加载
  css: ['~/assets/css/main.css'],

  // ============================================================================
  // 应用配置
  // ============================================================================
  app: {
    // HTML head 配置
    // 定义所有页面的默认 head 标签
    head: {
      // 字符集设置为 UTF-8
      // UTF-8 支持所有语言的字符，包括中文、英文等
      charset: 'utf-8',

      // 视口设置
      // 确保在移动设备上正确缩放
      // initial-scale=1: 初始缩放比例为 1（不缩放）
      // width=device-width: 使用设备的实际宽度
      viewport: 'width=device-width, initial-scale=1',

      // 默认页面标题
      // 可以在各个页面中覆盖这个标题
      title: '超核技術有限公司',

      // Meta 标签：用于 SEO 和社交媒体分享
      meta: [
        // Description：页面描述，用于搜索引擎结果展示
        {
          name: 'description',
          content:
            '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',
        },
        // Keywords：页面关键词，帮助搜索引擎理解页面内容
        {
          name: 'keywords',
          content: 'AI服務器,GPU計算集群,算力基礎設施,HPC,人工智能,超級計算,IDC服務',
        },
        // Author：页面作者
        { name: 'author', content: '超核技術有限公司' },

        // Open Graph 标签：用于社交媒体分享（Facebook、LinkedIn 等）
        // og:type：页面类型，website 表示这是一个网站
        { property: 'og:type', content: 'website' },
        // og:site_name：网站名称
        { property: 'og:site_name', content: '超核技術有限公司' },
        // og:locale：页面语言
        { property: 'og:locale', content: 'zh_HK' },
        // og:title：分享时显示的标题
        { property: 'og:title', content: '超核技術有限公司 - AI算力基礎設施服務商' },
        // og:description：分享时显示的描述
        {
          property: 'og:description',
          content:
            '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',
        },
        // og:image：分享时显示的图片
        { property: 'og:image', content: '/og-image.png' },

        // Twitter Card 标签：用于 Twitter 分享
        // twitter:card：卡片类型，summary_large_image 显示大图片
        { name: 'twitter:card', content: 'summary_large_image' },
        // twitter:title：Twitter 分享时的标题
        { name: 'twitter:title', content: '超核技術有限公司 - AI算力基礎設施服務商' },
        // twitter:description：Twitter 分享时的描述
        {
          name: 'twitter:description',
          content:
            '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',
        },
        // twitter:image：Twitter 分享时的图片
        { name: 'twitter:image', content: '/og-image.png' },
      ],

      // HTML 属性
      htmlAttrs: {
        // 设置 HTML 标签的 lang 属性
        // 默认设置为繁体中文（香港）
        // 这个值会在多语言切换时动态更新
        lang: 'zh-HK',
      },

      // Link 标签：用于引用外部资源
      link: [
        // 网站 Logo（Favicon）
        { rel: 'icon', type: 'image/png', href: '/icon.png' },

        // Apple Touch Icon：iOS 设备添加到主屏幕时显示的图标
        { rel: 'apple-touch-icon', href: '/icon.png' },

        // 预连接（Preconnect）：提前建立与第三方域名的连接
        // 减少加载外部资源时的延迟
        { rel: 'preconnect', href: 'https://lf3-static.bytednsdoc.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

        // 字体样式表：鸿蒙字体（HarmonyOS Sans）
        // 由字节跳动提供的 CDN 加速
        {
          rel: 'stylesheet',
          href: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/h7ovhziv/harmonyos-sans/harmonyos-sans.css',
        },

        // 字体样式表：Google Fonts
        // 引入多款字体用于不同场景
        // Inter：英文无衬线字体，瑞士设计风格
        // Outfit：现代几何字体，用于标题
        // Noto Sans HK：繁体中文字体
        // &family=：连接多个字体，weight 参数指定字重
        // 300: Light, 400: Regular, 500: Medium, 600: Semibold, 700: Bold, 800: Extra Bold
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+HK:wght@300;400;500;700&display=swap',
        },
      ],
    },

    // 页面过渡效果
    // 定义页面切换时的动画
    // name: 'page': 使用名为 'page' 的过渡效果（需要在 CSS 中定义）
    // mode: 'out-in': 先退出当前页面，再进入新页面（避免同时显示两个页面）
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // ============================================================================
  // 路由规则配置（Route Rules）
  // ============================================================================
  // 路由规则用于控制每个页面的缓存、重定向、头部等行为
  // 这里使用 ISR（增量静态再生）策略优化性能
  //
  // ISR 工作原理：
  // 1. 页面首次访问时，服务器渲染并缓存页面
  // 2. 后续访问时，直接从缓存返回，快速响应
  // 3. 缓存过期后，下次访问时重新渲染并更新缓存
  //
  // 优势：
  // - 比静态页面更灵活：内容可以更新
  // - 比 SSR 更快：使用缓存减少服务器负载
  // - 比 CSR 更利于 SEO：服务器渲染有利于搜索引擎抓取
  //
  // isr 参数含义：
  // - 数字：缓存时间（秒），例如 3600 表示 1 小时
  // - false：禁用缓存，每次都重新渲染
  // - true：使用默认缓存时间
  routeRules: {
    // 首页：缓存 1 小时
    // 首页内容更新频繁，使用较短缓存时间
    '/': { isr: 3600 },

    // 产品列表页：缓存 1 天（86400 秒）
    // 产品信息相对稳定，使用较长缓存时间
    '/products': { isr: 86400 },

    // 产品详情页：缓存 1 天
    // 使用通配符匹配所有产品详情页面
    '/products/**': { isr: 86400 },

    // 解决方案列表页：缓存 1 天
    '/solutions': { isr: 86400 },

    // 解决方案详情页：缓存 1 天
    '/solutions/**': { isr: 86400 },

    // 关于我们页面：缓存 1 周（604800 秒）
    // 公司信息很少变化，使用最长缓存时间
    '/about': { isr: 604800 },

    // 联系我们页面：缓存 1 周
    '/contact': { isr: 604800 },

    // 静态资源：禁用缓存
    // 这些文件不会改变，但也不需要 ISR 缓存
    // 直接从 public/ 目录提供即可
    '/icon.png': { isr: false },
    '/supercore.png': { isr: false },
  },

  // ============================================================================
  // Vite 配置
  // ============================================================================
  // Vite 是 Nuxt 3 的构建工具，提供快速的模块热更新（HMR）
  vite: {
    // 依赖预构建优化
    // Vite 会将依赖预先打包，提高启动和构建速度
    optimizeDeps: {
      // 包含：强制预构建的依赖
      // 这些依赖可能包含 ESM 模块转换问题，需要预先处理
      include: [
        'gsap', // GSAP 动画库
        'lenis', // 平滑滚动库
      ],

      // 排除：不预构建的依赖
      // 这些依赖已经优化过，或者与 Vite 预构建不兼容
      exclude: [
        '@supabase/postgrest-js', // Supabase 数据库客户端
        '@supabase/supabase-js', // Supabase 核心 SDK
        '@supabase/functions-js', // Supabase 函数客户端
      ],
    },
  },

  // ============================================================================
  // 构建配置
  // ============================================================================
  build: {
    // 转译列表：指定需要转译的 npm 包
    // 这些包可能包含非标准的 JavaScript 语法
    // 需要转译为兼容所有浏览器的 JavaScript
    transpile: ['@supabase/postgrest-js', '@supabase/supabase-js', '@supabase/functions-js'],
  },
})
