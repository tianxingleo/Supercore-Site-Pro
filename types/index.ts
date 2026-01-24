/**
 * Product Type Definitions
 */
export interface Product {
  id: string
  slug: string
  name: {
    zhHK: string
    zhCN: string
    en: string
  }
  description: {
    zhHK: string
    zhCN: string
    en: string
  }
  specs: Record<string, string | number | boolean>
  images: string[]
  category: 'server' | 'storage' | 'network' | 'software'
  featured: boolean
  createdAt: string
}

/**
 * News/Article Type Definitions
 */
export interface News {
  id: string
  slug: string
  title: {
    zhHK: string
    zhCN: string
    en: string
  }
  content: {
    zhHK: string
    zhCN: string
    en: string
  }
  excerpt: {
    zhHK: string
    zhCN: string
    en: string
  }
  locale: 'zh-HK' | 'zh-CN' | 'en'
  publishDate: string
  author?: string
  imageUrl?: string
  featured: boolean
  createdAt: string
}

/**
 * Solution Type Definitions
 */
export interface Solution {
  id: string
  slug: string
  title: {
    zhHK: string
    zhCN: string
    en: string
  }
  description: {
    zhHK: string
    zhCN: string
    en: string
  }
  icon: string
  category: 'idc' | 'operations' | 'development'
  features: string[]
  locale?: 'zh-HK' | 'zh-CN' | 'en'
  order: number
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data: T[]
  success: boolean
  message?: string
}

/**
 * Form Data Types
 */
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}
