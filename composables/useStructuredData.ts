/**
 * ============================================================================
 * 结构化数据组合式函数（Structured Data Composable）
 * ============================================================================
 *
 * 文件作用：
 * 此文件是一个 Vue 3 组合式函数（Composable），用于生成 JSON-LD（JavaScript Object Notation for Linked Data）
 * 结构化数据。JSON-LD 是 Google 和其他搜索引擎推荐的结构化数据格式，
 * 用于帮助搜索引擎更好地理解网页内容，提高搜索结果展示效果。
 *
 * 什么是结构化数据？
 * 结构化数据是一种标准化的数据格式，用于描述网页内容的类型和属性。
 * 搜索引擎使用这些数据来生成富媒体搜索结果，如：
 * - 产品搜索结果（价格、库存状态、评分等）
 * - 文章搜索结果（作者、发布日期、摘要等）
 * - 面包屑导航（层级结构）
 * - 组织信息（Logo、地址、联系方式等）
 *
 * 为什么需要结构化数据？
 * 1. 提高搜索排名：Google 优先展示带有结构化数据的网页
 * 2. 增强搜索结果：显示更多有用信息（价格、评分、图片等）
 * 3. 提高点击率：富媒体结果更吸引用户
 * 4. 改善用户体验：提供更准确的搜索结果
 *
 * Schema.org 标准：
 * 结构化数据基于 Schema.org 词汇表，这是 Google、Microsoft、Yahoo 等公司共同制定的标准。
 * 常见的 Schema 类型：
 * - Product：产品（用于产品页面）
 * - NewsArticle：新闻文章（用于新闻页面）
 * - Organization：组织（用于公司信息）
 * - BreadcrumbList：面包屑导航
 * - WebSite：网站（用于网站信息）
 *
 * 实现手段：
 * 1. 使用函数式编程，每个函数生成特定类型的结构化数据
 * 2. 支持多语言（中文、英文）
 * 3. 自动处理数据缺失情况（提供默认值）
 * 4. 提取 HTML/Markdown 内容的纯文本
 * 5. 遵循 Schema.org 标准
 *
 * 核心功能：
 * 1. useProductStructuredData()：生成产品的 JSON-LD
 * 2. useArticleStructuredData()：生成新闻文章的 JSON-LD
 * 3. useOrganizationStructuredData()：生成组织的 JSON-LD
 * 4. useWebsiteStructuredData()：生成网站的 JSON-LD
 * 5. useBreadcrumbStructuredData()：生成面包屑的 JSON-LD
 * 6. extractTextFromContent()：从 HTML/Markdown 提取纯文本
 *
 * 使用示例：
 * ```vue
 * <script setup>
 * const { useHead } = useNuxtApp()
 * const product = { ... }
 * const locale = 'zh-HK'
 *
 * const structuredData = useProductStructuredData(product, locale)
 *
 * useHead({
 *   script: [
 *     {
 *       type: 'application/ld+json',
 *       innerHTML: JSON.stringify(structuredData)
 *     }
 *   ]
 * })
 * </script>
 * ```
 *
 * JSON-LD 输出示例：
 * ```json
 * {
 *   "@context": "https://schema.org",
 *   "@type": "Product",
 *   "name": "A100 GPU 服务器",
 *   "description": "...",
 *   "image": ["..."],
 *   "brand": {
 *     "@type": "Brand",
 *     "name": "超核技術有限公司"
 *   },
 *   "offers": {
 *     "@type": "Offer",
 *     "availability": "https://schema.org/InStock",
 *     "priceCurrency": "HKD",
 *     "price": "0"
 *   }
 * }
 * ```
 *
 * Google 结构化数据测试工具：
 * https://search.google.com/test/rich-results
 * 用于验证结构化数据是否正确，以及 Google 是否能正确解析。
 *
 * 依赖项：
 * - ~/types：TypeScript 类型定义
 *
 * TypeScript 类型：
 * - Product：产品类型
 * - Post：文章类型
 *
 * ============================================================================
 */

// ============================================================================
// 导入依赖项
// ============================================================================
// Product：产品类型定义
// Post：文章类型定义
import type { Product, Post } from '~/types'

/**
 * ============================================================================
 * 生成产品的 JSON-LD 结构化数据
 * ============================================================================
 *
 * 功能：
 * 根据 Schema.org 的 Product 类型生成结构化数据。
 * 帮助搜索引擎理解产品信息，如名称、描述、价格、库存等。
 *
 * Schema.org Product 类型文档：
 * https://schema.org/Product
 *
 * Google 产品搜索结果展示：
 * - 产品图片
 * - 产品名称
 * - 价格
 * - 库存状态
 * - 评分（如果有）
 * - 品牌
 *
 * @param product - 产品对象（Product 类型）
 * @param locale - 语言代码（'zh-HK'、'zh-CN'、'en'）
 *
 * @returns JSON-LD 结构化数据对象
 *
 * 返回的数据结构：
 * {
 *   "@context": "https://schema.org",    // Schema.org 上下文
 *   "@type": "Product",                   // 类型：产品
 *   "name": "产品名称",                    // 产品名称
 *   "description": "产品描述",             // 产品描述
 *   "image": ["图片URL1", "图片URL2"],   // 产品图片数组
 *   "brand": {                            // 品牌信息
 *     "@type": "Brand",
 *     "name": "品牌名称"
 *   },
 *   "manufacturer": {                      // 制造商信息
 *     "@type": "Organization",
 *     "name": "公司名称",
 *     "url": "公司URL"
 *   },
 *   "offers": {                           // 供应信息（价格、库存）
 *     "@type": "Offer",
 *     "availability": "库存状态URL",
 *     "priceCurrency": "货币代码",
 *     "price": "价格",
 *     "url": "产品URL"
 *   },
 *   "aggregateRating": {                  // 综合评分（可选）
 *     "@type": "AggregateRating",
 *     "ratingValue": "评分值",
 *     "reviewCount": "评论数量"
 *   }
 * }
 *
 * 技术实现：
 * 1. 根据语言代码获取对应的产品名称和描述
 * 2. 提供回退机制（如果当前语言没有内容，则使用其他语言）
 * 3. 移除 undefined 值，确保 JSON-LD 数据完整
 * 4. 遵循 Schema.org Product 规范
 *
 * 注意事项：
 * - price 目前设置为 '0'，需要根据实际产品价格动态设置
 * - 如果产品没有评分，aggregateRating 字段会被移除
 * - 图片应为公开可访问的 URL
 *
 * 示例：
 * const product = {
 *   name: { 'zh-HK': 'GPU 服務器', 'en': 'GPU Server' },
 *   description: { 'zh-HK': '...', 'en': '...' },
 *   images: ['https://.../image.jpg'],
 *   slug: 'gpu-server',
 *   rating: 4.5,
 *   reviewCount: 10
 * }
 *
 * const data = useProductStructuredData(product, 'zh-HK')
 * useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }] })
 */
export function useProductStructuredData(product: Product, locale: string) {
  // ============================================================================
  // 基础配置
  // ============================================================================
  // baseUrl：网站基础 URL
  const baseUrl = 'https://www.supercore.hk'

  // langKey：语言键映射
  // 将 Nuxt 的 locale 代码转换为数据库使用的键名
  // 'zh-HK' → 'hk'（繁体中文）
  // 'zh-CN' → 'cn'（简体中文）
  // 'en' → 'en'（英文）
  const langKey = locale === 'zh-HK' ? 'hk' : locale === 'zh-CN' ? 'cn' : 'en'

  // ============================================================================
  // 构建 JSON-LD 结构化数据
  // ============================================================================
  const structuredData = {
    // '@context'：Schema.org 上下文
    // 告诉搜索引擎使用 Schema.org 词汇表
    '@context': 'https://schema.org',

    // '@type'：类型
    // Product 表示这是一个产品页面
    '@type': 'Product',

    // name：产品名称
    // 根据当前语言获取产品名称
    // 使用 || 运算符提供回退机制：
    // 1. 优先使用当前语言（locale）
    // 2. 如果当前语言没有，则使用繁体中文（zh-HK）
    // 3. 如果都没有，则使用英文（en）
    name:
      product.name[locale as keyof typeof product.name] || product.name['zh-HK'] || product.name.en,

    // description：产品描述
    // 逻辑与 name 相同
    description:
      product.description[locale as keyof typeof product.description] ||
      product.description['zh-HK'] ||
      product.description.en,

    // image：产品图片数组
    // Schema.org 要求图片数组格式
    image: product.images,

    // brand：品牌信息
    // 使用 @type: Brand 表示品牌对象
    brand: {
      '@type': 'Brand',
      name: '超核技術有限公司', // 公司品牌名称
    },

    // manufacturer：制造商信息
    // 使用 @type: Organization 表示组织对象
    manufacturer: {
      '@type': 'Organization',
      name: '超核技術有限公司', // 制造商名称
      url: baseUrl, // 制造商网站 URL
    },

    // offers：供应信息（价格、库存）
    // 使用 @type: Offer 表示供应对象
    offers: {
      '@type': 'Offer',

      // availability：库存状态
      // 使用 Schema.org 的标准 URL：
      // https://schema.org/InStock（有库存）
      // https://schema.org/OutOfStock（无库存）
      // https://schema.org/PreOrder（预订）
      availability: 'https://schema.org/InStock',

      // priceCurrency：货币代码
      // HKD：港币
      priceCurrency: 'HKD',

      // price：价格
      // 目前设置为 '0'，需要根据实际产品价格动态设置
      // 例如：price: '9999' 表示 HKD 9,999
      price: '0',

      // url：产品页面 URL
      // 用于链接到产品页面
      url: `${baseUrl}/products/${product.slug}`,
    },

    // aggregateRating：综合评分（可选）
    // 如果产品有评分，则添加此字段
    // 如果没有评分，则设置为 undefined（后续会被移除）
    aggregateRating: product.rating
      ? {
          // @type: AggregateRating 表示综合评分
          '@type': 'AggregateRating',

          // ratingValue：评分值（通常是 1-5 分）
          // 例如：4.5 表示 4.5 分
          ratingValue: product.rating,

          // reviewCount：评论数量
          // 例如：10 表示有 10 条评论
          reviewCount: product.reviewCount || 1,
        }
      : undefined,
  }

  // ============================================================================
  // 移除 undefined 值
  // ============================================================================
  // 将 structuredData 转换为 any 类型（避免 TypeScript 类型错误）
  // 这样可以动态删除对象的属性
  const finalData = structuredData as any

  // 遍历对象的所有键
  Object.keys(finalData).forEach((key) => {
    // 如果值为 undefined，则删除该属性
    if (finalData[key] === undefined) {
      delete finalData[key]
    }
  })

  // 返回清理后的数据
  return finalData
}

/**
 * ============================================================================
 * 生成新闻文章的 JSON-LD 结构化数据
 * ============================================================================
 *
 * 功能：
 * 根据 Schema.org 的 NewsArticle 类型生成结构化数据。
 * 帮助搜索引擎理解文章信息，如标题、作者、发布日期、摘要等。
 *
 * Schema.org NewsArticle 类型文档：
 * https://schema.org/NewsArticle
 *
 * Google 文章搜索结果展示：
 * - 文章标题
 * - 发布日期
 * - 作者
 * - 摘要
 * - 图片
 * - 面包屑导航
 *
 * @param post - 文章对象（Post 类型）
 * @param locale - 语言代码（'zh-HK'、'zh-CN'、'en'）
 *
 * @returns JSON-LD 结构化数据对象
 *
 * 返回的数据结构：
 * {
 *   "@context": "https://schema.org",
 *   "@type": "NewsArticle",              // 类型：新闻文章
 *   "headline": "文章标题",               // 文章标题
 *   "image": ["图片URL"],                // 文章封面图片
 *   "datePublished": "发布日期",         // 发布日期（ISO 8601 格式）
 *   "dateModified": "修改日期",           // 最后修改日期
 *   "author": {                          // 作者信息
 *     "@type": "Organization",           // 作者是组织（公司）
 *     "name": "公司名称",
 *     "logo": { "logo对象" }
 *   },
 *   "publisher": {                       // 发布者信息
 *     "@type": "Organization",
 *     "name": "公司名称",
 *     "logo": { "logo对象" }
 *   },
 *   "description": "文章摘要",          // 文章摘要
 *   "mainEntityOfPage": {                 // 主要页面实体
 *     "@type": "WebPage",
 *     "@id": "文章URL"
 *   },
 *   "keywords": "关键词",                // 关键词（逗号分隔）
 *   "inLanguage": "语言代码"             // 文章语言
 * }
 *
 * 技术实现：
 * 1. 根据语言代码获取对应的文章标题和内容
 * 2. 如果有封面图片，则使用封面图片；否则使用空数组
 * 3. 作者和发布者都设置为组织（公司）
 * 4. 摘要优先使用 summary 字段，如果没有则从 content 字段提取纯文本
 * 5. 关键词从 tags 数组转换为逗号分隔的字符串
 *
 * 注意事项：
 * - datePublished 和 dateModified 应为 ISO 8601 格式（例如：2024-01-01T00:00:00.000Z）
 * - 图片应为公开可访问的 URL
 * - 作者和发布者可以不同（例如：个人作者，公司发布）
 *
 * 示例：
 * const post = {
 *   title: { 'zh-HK': 'AI 服務器新聞', 'en': 'AI Server News' },
 *   summary: { 'zh-HK': '摘要...', 'en': 'Summary...' },
 *   content: { 'zh-HK': '內容...', 'en': 'Content...' },
 *   cover_image: 'https://.../cover.jpg',
 *   created_at: '2024-01-01T00:00:00.000Z',
 *   updated_at: '2024-01-02T00:00:00.000Z',
 *   tags: ['AI', 'GPU', 'Server'],
 *   slug: 'ai-server-news'
 * }
 *
 * const data = useArticleStructuredData(post, 'zh-HK')
 * useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }] })
 */
export function useArticleStructuredData(post: Post, locale: string) {
  // ============================================================================
  // 基础配置
  // ============================================================================
  const baseUrl = 'https://www.supercore.hk'
  const langKey = locale === 'zh-HK' ? 'hk' : locale === 'zh-CN' ? 'cn' : 'en'

  // ============================================================================
  // 构建 JSON-LD 结构化数据
  // ============================================================================
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle', // 类型：新闻文章

    // headline：文章标题
    // 根据当前语言获取标题
    headline: post.title[langKey] || post.title['hk'],

    // image：文章封面图片
    // 如果有封面图片，则使用数组格式（Schema.org 要求数组）
    image: post.cover_image ? [post.cover_image] : [],

    // datePublished：发布日期
    // ISO 8601 格式（例如：2024-01-01T00:00:00.000Z）
    datePublished: post.created_at,

    // dateModified：最后修改日期
    // 如果没有 updated_at，则使用 created_at
    dateModified: post.updated_at || post.created_at,

    // author：作者信息
    // 作者设置为组织（公司），而非个人
    author: {
      '@type': 'Organization',
      name: '超核技術有限公司',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`, // 公司 Logo URL
      },
    },

    // publisher：发布者信息
    // 发布者也设置为组织（公司）
    publisher: {
      '@type': 'Organization',
      name: '超核技術有限公司',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },

    // description：文章摘要
    // 优先使用 summary 字段
    // 如果没有 summary，则从 content 字段提取纯文本（去除 HTML 标签）
    description: post.summary?.[langKey] || extractTextFromContent(post.content?.[langKey] || ''),

    // mainEntityOfPage：主要页面实体
    // 表示这个文章属于哪个页面
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/news/${post.slug}`, // 文章页面 URL
    },

    // keywords：关键词
    // 从 tags 数组转换为逗号分隔的字符串
    // 例如：['AI', 'GPU', 'Server'] → 'AI, GPU, Server'
    keywords: post.tags?.join(', '),

    // inLanguage：文章语言
    // 使用 ISO 639-1 语言代码
    // 'zh-HK'：繁体中文（香港）
    // 'zh-CN'：简体中文
    // 'en'：英文
    inLanguage: locale === 'zh-HK' ? 'zh-HK' : locale === 'zh-CN' ? 'zh-CN' : 'en',
  }

  return structuredData
}

/**
 * ============================================================================
 * 生成组织的 JSON-LD 结构化数据
 * ============================================================================
 *
 * 功能：
 * 根据 Schema.org 的 Organization 类型生成结构化数据。
 * 帮助搜索引擎理解组织信息，如名称、Logo、地址、联系方式等。
 *
 * Schema.org Organization 类型文档：
 * https://schema.org/Organization
 *
 * Google 搜索结果展示：
 * - 知识面板（Knowledge Panel）
 * - 公司信息卡片
 * - 联系方式
 *
 * @returns JSON-LD 结构化数据对象
 *
 * 返回的数据结构：
 * {
 *   "@context": "https://schema.org",
 *   "@type": "Organization",              // 类型：组织
 *   "name": "组织名称",                   // 组织名称
 *   "url": "组织URL",                     // 组织网站
 *   "logo": "Logo URL",                   // 组织 Logo
 *   "description": "组织描述",            // 组织描述
 *   "address": {                          // 地址信息
 *     "@type": "PostalAddress",
 *     "addressCountry": "国家",
 *     "addressLocality": "城市"
 *   },
 *   "contactPoint": {                     // 联系方式
 *     "@type": "ContactPoint",
 *     "contactType": "联系方式类型",
 *     "email": "邮箱地址"
 *   },
 *   "sameAs": ["社交媒体URL"]            // 社交媒体链接
 * }
 *
 * 技术实现：
 * 1. 固定组织名称和描述（超核技術有限公司）
 * 2. 使用 icon.png 作为 Logo
 * 3. 地址设置为香港
 * 4. 联系方式为客服邮箱
 * 5. sameAs 数组预留社交媒体链接（如 LinkedIn、Facebook 等）
 *
 * 注意事项：
 * - sameAs 应包含主要的社交媒体账号
 * - 地址信息应准确
 * - 联系方式应有效
 * - Logo 应为公开可访问的 URL
 *
 * 示例：
 * const data = useOrganizationStructuredData()
 * useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }] })
 *
 * 知识面板：
 * Google 会根据 Organization 结构化数据生成知识面板，
 * 显示在搜索结果右侧，展示公司的详细信息。
 *
 * 验证工具：
 * https://search.google.com/test/rich-results
 *
 * 优化建议：
 * - 添加公司社交媒体链接（sameAs）
 * - 添加公司电话号码
 * - 添加公司营业时间
 * - 添加公司员工信息
 */
export function useOrganizationStructuredData() {
  // ============================================================================
  // 基础配置
  // ============================================================================
  const baseUrl = 'https://www.supercore.hk'

  // ============================================================================
  // 构建 JSON-LD 结构化数据
  // ============================================================================
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization', // 类型：组织

    // name：组织名称
    name: '超核技術有限公司',

    // url：组织网站
    url: baseUrl,

    // logo：组织 Logo
    logo: `${baseUrl}/icon.png`,

    // description：组织描述
    description:
      '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',

    // address：地址信息
    address: {
      '@type': 'PostalAddress', // 类型：邮政地址
      addressCountry: 'HK', // 国家代码（HK = 香港）
      addressLocality: 'Hong Kong', // 城市
    },

    // contactPoint：联系方式
    contactPoint: {
      '@type': 'ContactPoint', // 类型：联系方式
      contactType: 'customer service', // 联系方式类型（客服）
      email: 'info@supercore.hk', // 邮箱地址
    },

    // sameAs：社交媒体链接
    // 数组包含组织的其他在线平台链接
    // 例如：LinkedIn、Facebook、Twitter 等
    sameAs: [
      // 社交媒體鏈接（如有）
      // 例如：
      // 'https://www.linkedin.com/company/supercore',
      // 'https://www.facebook.com/supercore',
      // 'https://twitter.com/supercore'
    ] as string[],
  }

  return structuredData
}

/**
 * ============================================================================
 * 生成网站的 JSON-LD 结构化数据
 * ============================================================================
 *
 * 功能：
 * 根据 Schema.org 的 Organization 类型生成网站的结构化数据。
 * 与 useOrganizationStructuredData 类似，但专门用于网站信息。
 *
 * 注意：
 * 此函数与 useOrganizationStructuredData 的实现完全相同。
 * 未来可以分离网站和组织的信息，使其更加准确。
 *
 * @returns JSON-LD 结构化数据对象
 *
 * 返回的数据结构：
 * 与 useOrganizationStructuredData 相同
 *
 * 使用场景：
 * - 网站首页
 * - 公司信息页面
 * - 关于我们页面
 *
 * 示例：
 * const data = useWebsiteStructuredData()
 * useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }] })
 */
export function useWebsiteStructuredData() {
  // ============================================================================
  // 基础配置
  // ============================================================================
  const baseUrl = 'https://www.supercore.hk'

  // ============================================================================
  // 构建 JSON-LD 结构化数据
  // ============================================================================
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization', // 类型：组织（也可以用 WebSite）
    name: '超核技術有限公司',
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    description:
      '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'HK',
      addressLocality: 'Hong Kong',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@supercore.hk',
    },
    sameAs: [
      // 社交媒體鏈接（如有）
    ] as string[],
  }

  return structuredData
}

/**
 * ============================================================================
 * 生成面包屑的 JSON-LD 结构化数据
 * ============================================================================
 *
 * 功能：
 * 根据 Schema.org 的 BreadcrumbList 类型生成结构化数据。
 * 帮助搜索引擎理解页面的层级结构。
 *
 * Schema.org BreadcrumbList 类型文档：
 * https://schema.org/BreadcrumbList
 *
 * Google 搜索结果展示：
 * - 面包屑导航（Breadcrumb Navigation）
 * - 显示页面的层级路径
 * - 例如：首页 > 产品 > GPU 服务器
 *
 * 面包屑示例：
 * 首页 > 产品 > GPU 服务器
 *
 * 对应的 JSON-LD 数据：
 * {
 *   "@type": "BreadcrumbList",
 *   "itemListElement": [
 *     { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://..." },
 *     { "@type": "ListItem", "position": 2, "name": "产品", "item": "https://.../products" },
 *     { "@type": "ListItem", "position": 3, "name": "GPU 服务器", "item": "https://.../products/gpu-server" }
 *   ]
 * }
 *
 * @param items - 面包屑项数组
 *                例如：[{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }]
 *
 * @returns JSON-LD 结构化数据对象
 *
 * 返回的数据结构：
 * {
 *   "@context": "https://schema.org",
 *   "@type": "BreadcrumbList",    // 类型：面包屑列表
 *   "itemListElement": [           // 面包屑项数组
 *     {
 *       "@type": "ListItem",       // 类型：列表项
 *       "position": 1,              // 位置（从 1 开始）
 *       "name": "页面名称",          // 页面名称
 *       "item": "页面URL"            // 页面 URL
 *     },
 *     ...
 *   ]
 * }
 *
 * 技术实现：
 * 1. 接受面包屑项数组作为参数
 * 2. 使用 map 方法转换为 Schema.org 格式
 * 3. 自动生成位置编号（position 从 1 开始）
 * 4. 处理 URL 格式（确保以 / 开头）
 *
 * 注意事项：
 * - position 从 1 开始（不是 0）
 * - URL 应为绝对路径或完整 URL
 * - 面包屑应反映页面的实际层级结构
 * - 最后一个面包屑项应为当前页面
 *
 * 示例：
 * const items = [
 *   { name: 'Home', url: '/' },
 *   { name: 'Products', url: '/products' },
 *   { name: 'GPU Server', url: '/products/gpu-server' }
 * ]
 *
 * const data = useBreadcrumbStructuredData(items)
 * useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }] })
 *
 * 面包屑的最佳实践：
 * 1. 从首页开始
 * 2. 按层级顺序排列
 * 3. 当前页面放在最后
 * 4. URL 应可点击
 * 5. 名称应简洁明了
 *
 * 面包屑的 SEO 价值：
 * 1. 帮助搜索引擎理解网站结构
 * 2. 提高用户导航体验
 * 3. 显示在搜索结果中，提高点击率
 * 4. 增强内部链接结构
 */
export function useBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  // ============================================================================
  // 基础配置
  // ============================================================================
  const baseUrl = 'https://www.supercore.hk'

  // ============================================================================
  // 构建 JSON-LD 结构化数据
  // ============================================================================
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList', // 类型：面包屑列表

    // itemListElement：面包屑项数组
    // 使用 map 方法将输入数组转换为 Schema.org 格式
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', // 类型：列表项

      // position：位置（从 1 开始）
      // index + 1：因为 index 从 0 开始，所以加 1
      position: index + 1,

      // name：页面名称
      name: item.name,

      // item：页面 URL
      // 拼接 baseUrl 和相对路径
      // item.url.startsWith('/') ? '' : '/'：如果 URL 不是以 / 开头，则添加 /
      // 例如：'products' → '/products'，'/products' → '/products'
      item: `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  }

  return structuredData
}

/**
 * ============================================================================
 * 从 HTML/Markdown 内容提取纯文本
 * ============================================================================
 *
 * 功能：
 * 从 HTML 或 Markdown 内容中提取纯文本，用于生成文章摘要。
 *
 * 为什么需要这个函数？
 * - 文章的 content 字段可能包含 HTML 标签
 * - 结构化数据的 description 字段需要纯文本
 * - 搜索引擎不能解析 HTML 标签
 *
 * 提取规则：
 * 1. 判断内容是 HTML 还是纯文本
 * 2. 如果是 HTML，使用 DOM API 提取 textContent
 * 3. 合并多个空白字符为单个空格
 * 4. 截断为 160 个字符（搜索结果的摘要长度限制）
 * 5. 添加省略号（...）表示截断
 *
 * @param content - HTML 或 Markdown 内容
 *
 * @returns 提取的纯文本（最多 160 个字符）
 *
 * 技术实现：
 * 1. 检查内容是否为空，如果为空则返回空字符串
 * 2. 去除首尾空白字符（trim）
 * 3. 判断是否为 HTML（以 < 开头，以 > 结尾）
 * 4. 如果是 HTML，创建临时 div 元素，设置 innerHTML，提取 textContent
 * 5. 合并多个空白字符为单个空格（/\s+/g, ' '）
 * 6. 截断为 160 个字符
 *
 * 注意事项：
 * - 只能在浏览器环境中使用（需要 document 对象）
 * - 在服务端渲染时，document 不存在，会返回原内容
 * - 160 个字符是 Google 搜索结果的摘要长度限制
 * - Markdown 不会被转换为 HTML，直接返回原内容
 *
 * 示例：
 * const html = '<p>This is <strong>HTML</strong> content.</p>'
 * const text = extractTextFromContent(html)
 * // 结果：'This is HTML content.'
 *
 * const markdown = '# This is Markdown'
 * const text = extractTextFromContent(markdown)
 * // 结果：'# This is Markdown'（不会被转换）
 *
 * 性能优化：
 * - 使用正则表达式替换空白字符，性能良好
 * - 避免不必要的 DOM 操作
 *
 * 未来改进：
 * - 支持 Markdown 转换为 HTML（使用 marked.js 等库）
 * - 在服务端渲染时使用 jsdom 等库模拟 DOM
 * - 支持自定义截断长度
 */
function extractTextFromContent(content: string): string {
  // 检查内容是否为空
  if (!content) return ''

  // 去除首尾空白字符
  const trimmedContent = content.trim()

  // 判断是否为 HTML
  // 以 < 开头，以 > 结尾，通常是 HTML
  const isHtml = trimmedContent.startsWith('<') && trimmedContent.endsWith('>')

  // 如果是 HTML，提取纯文本
  if (isHtml) {
    // 检查 document 对象是否存在（浏览器环境）
    // typeof document !== 'undefined'：判断是否在浏览器中运行
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null

    // 如果 document 存在，则提取纯文本
    if (tempDiv) {
      // 设置 innerHTML
      tempDiv.innerHTML = trimmedContent

      // 提取 textContent 或 innerText
      // textContent：标准属性，返回所有文本节点
      // innerText：非标准属性（IE），会考虑样式（如 display: none）
      const textContent = tempDiv.textContent || tempDiv.innerText || ''

      // 合并多个空白字符为单个空格
      // \s+：匹配一个或多个空白字符（空格、制表符、换行符等）
      // g：全局匹配（替换所有匹配）
      // ' '：替换为单个空格
      const cleanText = textContent.replace(/\s+/g, ' ').trim()

      // 截断为 160 个字符，并添加省略号
      return cleanText.length > 160 ? cleanText.substring(0, 160) + '...' : cleanText
    }
  }

  // 如果不是 HTML 或 document 不存在，则返回原内容（截断为 160 个字符）
  return trimmedContent.length > 160 ? trimmedContent.substring(0, 160) + '...' : trimmedContent
}
