/**
 * 创建文章的数据结构
 */
export interface CreatePostData {
  slug: string
  title: Record<string, string>
  summary: Record<string, string>
  content: Record<string, string>
  cover_image?: string
  tags?: string[]
  published_at?: string | null
}

/**
 * 更新文章的数据结构
 */
export interface UpdatePostData extends Partial<CreatePostData> {}

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
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.push('slug 只能包含小写字母、数字和连字符')
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
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push('tags 必须是数组')
  }

  // 验证 cover_image（可选）
  if (data.cover_image !== undefined && typeof data.cover_image !== 'string') {
    errors.push('cover_image 必须是字符串')
  }

  // 如果有错误，抛出异常
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `验证错误：${errors.join('；')}`
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
      statusMessage: '验证错误：没有提供要更新的数据'
    })
  }

  const errors: string[] = []

  // 如果提供了 slug，验证其格式
  if (data.slug !== undefined) {
    if (typeof data.slug !== 'string') {
      errors.push('slug 必须是字符串')
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      errors.push('slug 只能包含小写字母、数字和连字符')
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
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push('tags 必须是数组')
  }

  // 验证 cover_image
  if (data.cover_image !== undefined && typeof data.cover_image !== 'string') {
    errors.push('cover_image 必须是字符串')
  }

  // 如果有错误，抛出异常
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `验证错误：${errors.join('；')}`
    })
  }

  return data as UpdatePostData
}
