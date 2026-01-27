/**
 * Product Type Definitions
 */
export interface Product {
  id: string
  slug: string
  name: {
    'zh-HK': string
    'zh-CN': string
    en: string
  }
  description: {
    'zh-HK': string
    'zh-CN': string
    en: string
  }
  specs: Record<string, string | number | boolean>
  images: string[]
  category: 'server' | 'storage' | 'network' | 'software' | 'hpc' | 'storage-hp'
  featured: boolean
  createdAt: string
}

export interface Post {
  id: number
  slug: string
  title: Record<string, string>
  summary?: Record<string, string>
  content: Record<string, string>
  cover_image?: string
  tags?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

/**
 * News/Article Type Definitions (Legacy or UI Specific)
 */
export interface News {
  id: string
  slug: string
  title: {
    'zh-HK': string
    'zh-CN': string
    en: string
  }
  content: {
    'zh-HK': string
    'zh-CN': string
    en: string
  }
  excerpt: {
    'zh-HK': string
    'zh-CN': string
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
    'zh-HK': string
    'zh-CN': string
    en: string
  }
  description: {
    'zh-HK': string
    'zh-CN': string
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
