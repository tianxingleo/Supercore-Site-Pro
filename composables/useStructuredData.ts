/**
 * 結構化數據組合式函數
 * 用於生成 JSON-LD 結構化數據
 */

import type { Product, Post } from '~/types'

/**
 * 生成產品的 JSON-LD 結構化數據
 */
export function useProductStructuredData(product: Product, locale: string) {
  const baseUrl = 'https://www.example.com'
  const langKey = locale === 'zh-HK' ? 'hk' : locale === 'zh-CN' ? 'cn' : 'en'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale as keyof typeof product.name] || product.name['zh-HK'] || product.name.en,
    description: product.description[locale as keyof typeof product.description] || product.description['zh-HK'] || product.description.en,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'XX科技有限公司',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'XX科技有限公司',
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'HKD',
      price: '0', // 如有價格可動態設置
      url: `${baseUrl}/products/${product.slug}`,
    },
    aggregateRating: product.rating
      ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
      }
      : undefined,
  }

  // 移除 undefined 值
  const finalData = structuredData as any
  Object.keys(finalData).forEach((key) => {
    if (finalData[key] === undefined) {
      delete finalData[key]
    }
  })

  return finalData
}

/**
 * 生成新聞文章的 JSON-LD 結構化數據
 */
export function useArticleStructuredData(post: Post, locale: string) {
  const baseUrl = 'https://www.example.com'
  const langKey = locale === 'zh-HK' ? 'hk' : locale === 'zh-CN' ? 'cn' : 'en'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title[langKey] || post.title['hk'],
    image: post.cover_image ? [post.cover_image] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Organization',
      name: 'XX科技有限公司',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'XX科技有限公司',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.png`,
      },
    },
    description: post.summary?.[langKey] || extractTextFromContent(post.content?.[langKey] || ''),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/news/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    inLanguage: locale === 'zh-HK' ? 'zh-HK' : locale === 'zh-CN' ? 'zh-CN' : 'en',
  }

  return structuredData
}

/**
 * 生成組織的 JSON-LD 結構化數據
 */
export function useOrganizationStructuredData() {
  const baseUrl = 'https://www.example.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XX科技有限公司',
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
      email: 'contact@example.com',
    },
    sameAs: [
      // 社交媒體鏈接（如有）
    ] as string[],
  }

  return structuredData
}

/**
 * 生成網站的 JSON-LD 結構化數據
 */
export function useWebsiteStructuredData() {
  const baseUrl = 'https://www.example.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'XX科技有限公司',
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
      email: 'contact@example.com',
    },
    sameAs: [
      // 社交媒體鏈接（如有）
    ] as string[],
  }

  return structuredData
}

/**
 * 生成麵包屑的 JSON-LD 結構化數據
 */
export function useBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const baseUrl = 'https://www.example.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  }

  return structuredData
}

/**
 * 從 HTML/Markdown 內容提取純文本
 */
function extractTextFromContent(content: string): string {
  if (!content) return ''

  const trimmedContent = content.trim()
  const isHtml = trimmedContent.startsWith('<') && trimmedContent.endsWith('>')

  if (isHtml) {
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null
    if (tempDiv) {
      tempDiv.innerHTML = trimmedContent
      const textContent = tempDiv.textContent || tempDiv.innerText || ''
      const cleanText = textContent.replace(/\s+/g, ' ').trim()
      return cleanText.length > 160 ? cleanText.substring(0, 160) + '...' : cleanText
    }
  }

  return trimmedContent.length > 160 ? trimmedContent.substring(0, 160) + '...' : trimmedContent
}
