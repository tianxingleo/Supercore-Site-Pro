/**
 * 创建文章的数据结构
 */
export interface CreatePostData {
  slug: string
  title: Record<string, string>
  summary: Record<string, string>
  content: Record<string, string>
  cover_image?: string | null
  tags?: string[] | null
  published_at?: string | null
}

/**
 * 更新文章的数据结构
 */
export interface UpdatePostData extends Partial<CreatePostData> { }

/**
 * 必需的语言代码
 */
const REQUIRED_LANGUAGES = ['hk', 'cn', 'en']

/**
 * 验证创建文章的数据
 * 确保所有必需字段都存在且格式正确
 */
export function validateCreatePost(data: any): CreatePostData {
  const errors: string[] = []

  // 验证 slug
  if (!data.slug || typeof data.slug !== 'string') {
    errors.push('slug 是必需的且必须是字符串')
  } else if (!/^[a-zA-Z0-9_\-\.]+$/.test(data.slug)) {
    errors.push('slug 格式不正确：只能包含英文字母、数字、连字符(-)、下划线(_)或点(.)')
  }

  // 验证 title
  if (!data.title || typeof data.title !== 'object') {
    errors.push('title 是必需的且必须是对象')
  } else {
    // 检查所有必需语言是否存在
    for (const lang of REQUIRED_LANGUAGES) {
      if (!data.title[lang] || data.title[lang].trim() === '') {
        errors.push(`title 必须包含 ${lang.toUpperCase()} 语言版本`)
      }
    }
  }

  // 验证 summary
  if (!data.summary || typeof data.summary !== 'object') {
    errors.push('summary 是必需的且必须是对象')
  } else {
    // 检查所有必需语言是否存在
    for (const lang of REQUIRED_LANGUAGES) {
      if (!data.summary[lang] || data.summary[lang].trim() === '') {
        errors.push(`summary 必须包含 ${lang.toUpperCase()} 语言版本`)
      }
    }
  }

  // 验证 content
  if (!data.content || typeof data.content !== 'object') {
    errors.push('content 是必需的且必须是对象')
  } else {
    // 检查所有必需语言是否存在
    for (const lang of REQUIRED_LANGUAGES) {
      if (!data.content[lang] || data.content[lang].trim() === '') {
        errors.push(`content 必须包含 ${lang.toUpperCase()} 语言版本`)
      }
    }
  }

  // 验证 tags（可选）
  if (data.tags !== undefined && data.tags !== null && !Array.isArray(data.tags)) {
    errors.push('tags 必须是数组')
  }

  // 验证 cover_image（可选）
  if (data.cover_image !== undefined && data.cover_image !== null && typeof data.cover_image !== 'string') {
    errors.push('cover_image 必须是字符串')
  }

  // 如果有错误，抛出异常
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      message: `验证错误：${errors.join('；')}`
    })
  }

  return data as CreatePostData
}

/**
 * 验证更新文章的数据
 * 允许部分更新，但验证提供的字段
 */
export function validateUpdatePost(data: any): UpdatePostData {
  // 检查是否提供了任何数据
  if (!data || Object.keys(data).length === 0) {
    throw createError({
      statusCode: 400,
      message: '验证错误：没有提供要更新的数据'
    })
  }

  const errors: string[] = []

  // 如果提供了 slug，验证其格式
  if (data.slug !== undefined) {
    if (typeof data.slug !== 'string') {
      errors.push('slug 必须是字符串')
    } else if (!/^[a-zA-Z0-9_\-\.]+$/.test(data.slug)) {
      errors.push('slug 格式不正确：只能包含英文字母、数字、连字符(-)、下划线(_)或点(.)')
    }
  }

  // 如果提供了 title，验证所有语言都存在
  if (data.title !== undefined) {
    if (typeof data.title !== 'object') {
      errors.push('title 必须是对象')
    } else {
      for (const lang of REQUIRED_LANGUAGES) {
        if (data.title[lang] !== undefined && data.title[lang].trim() === '') {
          errors.push(`title.${lang} 不能为空`)
        }
      }
    }
  }

  // 如果提供了 summary，验证所有语言都存在
  if (data.summary !== undefined) {
    if (typeof data.summary !== 'object') {
      errors.push('summary 必须是对象')
    } else {
      for (const lang of REQUIRED_LANGUAGES) {
        if (data.summary[lang] !== undefined && data.summary[lang].trim() === '') {
          errors.push(`summary.${lang} 不能为空`)
        }
      }
    }
  }

  // 如果提供了 content，验证所有语言都存在
  if (data.content !== undefined) {
    if (typeof data.content !== 'object') {
      errors.push('content 必须是对象')
    } else {
      for (const lang of REQUIRED_LANGUAGES) {
        if (data.content[lang] !== undefined && data.content[lang].trim() === '') {
          errors.push(`content.${lang} 不能为空`)
        }
      }
    }
  }

  // 验证 tags
  if (data.tags !== undefined && data.tags !== null && !Array.isArray(data.tags)) {
    errors.push('tags 必须是数组')
  }

  // 验证 cover_image
  if (data.cover_image !== undefined && data.cover_image !== null && typeof data.cover_image !== 'string') {
    errors.push('cover_image 必须是字符串')
  }

  // 如果有错误，抛出异常
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      message: `验证错误：${errors.join('；')}`
    })
  }

  return data as UpdatePostData
}

/**
 * 创建产品的数据结构
 */
export interface CreateProductData {
  slug: string
  name: Record<string, string>
  description: Record<string, string>
  category: 'server' | 'storage' | 'network' | 'software' | 'hpc' | 'storage-hp'
  specs?: Record<string, string | number | boolean> | null
  images?: string[] | null
  model_3d_url?: string | null
  is_featured?: boolean
  status?: 'draft' | 'published' | 'archived'
}

/**
 * 更新产品的数据结构
 */
export interface UpdateProductData extends Partial<CreateProductData> { }

/**
 * 验证创建产品的数据
 */
export function validateCreateProduct(data: any): CreateProductData {
  const errors: string[] = []

  // 验证 slug
  if (!data.slug || typeof data.slug !== 'string') {
    errors.push('slug 是必需的且必须是字符串')
  } else if (!/^[a-zA-Z0-9_\-\.]+$/.test(data.slug)) {
    errors.push('slug 格式不正确：只能包含英文字母、数字、连字符(-)、下划线(_)或点(.)')
  }

  // 验证 name（多语言）
  if (!data.name || typeof data.name !== 'object') {
    errors.push('name 是必需的且必须是对象')
  } else {
    for (const lang of REQUIRED_LANGUAGES) {
      if (!data.name[lang] || data.name[lang].trim() === '') {
        errors.push(`name 必须包含 ${lang.toUpperCase()} 语言版本`)
      }
    }
  }

  // 验证 description（多语言）
  if (!data.description || typeof data.description !== 'object') {
    errors.push('description 是必需的且必须是对象')
  } else {
    for (const lang of REQUIRED_LANGUAGES) {
      if (!data.description[lang] || data.description[lang].trim() === '') {
        errors.push(`description 必须包含 ${lang.toUpperCase()} 语言版本`)
      }
    }
  }

  // 验证 category
  if (!data.category || typeof data.category !== 'string') {
    errors.push('category 是必需的')
  } else if (!['server', 'storage', 'network', 'software', 'hpc', 'storage-hp'].includes(data.category)) {
    errors.push('category 必须是有效值: server, storage, network, software, hpc, storage-hp')
  }

  // 验证 specs（可选）
  if (data.specs !== undefined && data.specs !== null && typeof data.specs !== 'object') {
    errors.push('specs 必须是对象')
  }

  // 验证 images（可选）
  if (data.images !== undefined && data.images !== null && !Array.isArray(data.images)) {
    errors.push('images 必须是数组')
  }

  // 验证 model_3d_url（可选）
  if (data.model_3d_url !== undefined && data.model_3d_url !== null && typeof data.model_3d_url !== 'string') {
    errors.push('model_3d_url 必须是字符串')
  }

  // 验证 is_featured（可选）
  if (data.is_featured !== undefined && typeof data.is_featured !== 'boolean') {
    errors.push('is_featured 必须是布尔值')
  }

  // 验证 status（可选）
  if (data.status !== undefined && typeof data.status !== 'string') {
    errors.push('status 必须是字符串')
  } else if (data.status && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.push('status 必须是有效值: draft, published, archived')
  }

  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      message: `验证错误：${errors.join('；')}`
    })
  }

  return data as CreateProductData
}

/**
 * 验证更新产品的数据
 */
export function validateUpdateProduct(data: any): UpdateProductData {
  if (!data || Object.keys(data).length === 0) {
    throw createError({
      statusCode: 400,
      message: '验证错误：没有提供要更新的数据'
    })
  }

  const errors: string[] = []

  // 如果提供 slug，验证其格式
  if (data.slug !== undefined) {
    if (typeof data.slug !== 'string') {
      errors.push('slug 必须是字符串')
    } else if (!/^[a-zA-Z0-9_\-\.]+$/.test(data.slug)) {
      errors.push('slug 格式不正确：只能包含英文字母、数字、连字符(-)、下划线(_)或点(.)')
    }
  }

  // 如果提供 name，验证所有语言
  if (data.name !== undefined) {
    if (typeof data.name !== 'object') {
      errors.push('name 必须是对象')
    } else {
      for (const lang of REQUIRED_LANGUAGES) {
        if (data.name[lang] !== undefined && data.name[lang].trim() === '') {
          errors.push(`name.${lang} 不能为空`)
        }
      }
    }
  }

  // 如果提供 description，验证所有语言
  if (data.description !== undefined) {
    if (typeof data.description !== 'object') {
      errors.push('description 必须是对象')
    } else {
      for (const lang of REQUIRED_LANGUAGES) {
        if (data.description[lang] !== undefined && data.description[lang].trim() === '') {
          errors.push(`description.${lang} 不能为空`)
        }
      }
    }
  }

  // 验证 category
  if (data.category !== undefined) {
    if (typeof data.category !== 'string') {
      errors.push('category 必须是字符串')
    } else if (!['server', 'storage', 'network', 'software', 'hpc', 'storage-hp'].includes(data.category)) {
      errors.push('category 必须是有效值: server, storage, network, software, hpc, storage-hp')
    }
  }

  // 验证其他字段
  if (data.specs !== undefined && data.specs !== null && typeof data.specs !== 'object') {
    errors.push('specs 必须是对象')
  }
  if (data.images !== undefined && data.images !== null && !Array.isArray(data.images)) {
    errors.push('images 必须是数组')
  }
  if (data.model_3d_url !== undefined && data.model_3d_url !== null && typeof data.model_3d_url !== 'string') {
    errors.push('model_3d_url 必须是字符串')
  }
  if (data.is_featured !== undefined && typeof data.is_featured !== 'boolean') {
    errors.push('is_featured 必须是布尔值')
  }
  if (data.status !== undefined && !['draft', 'published', 'archived'].includes(data.status)) {
    errors.push('status 必须是有效值: draft, published, archived')
  }

  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      message: `验证错误：${errors.join('；')}`
    })
  }

  return data as UpdateProductData
}
