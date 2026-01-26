/**
 * 简体中文转繁体中文工具
 * Simplified Chinese to Traditional Chinese Converter
 *
 * 使用 opencc-js 库进行简繁转换
 * Uses opencc-js for conversion
 */

// 动态导入 opencc-js 以兼容 ESM
import { createConverter } from 'opencc-js'

/**
 * 初始化转换器 (简体 → 繁体香港)
 * Initialize converter (Simplified → Traditional Hong Kong)
 */
const converter = createConverter({ from: 'cn', to: 'hk' })

/**
 * 将简体中文转换为繁体中文（香港）
 * Convert Simplified Chinese to Traditional Chinese (Hong Kong)
 *
 * @param text - 简体中文文本
 * @returns 繁体中文（香港）文本
 */
export function toTraditionalChinese(text: string): string {
  if (!text) return ''
  return converter(text)
}

/**
 * 转换产品对象中的所有文本字段
 * Convert all text fields in a product object
 *
 * @param product - 包含简体中文的产品对象
 * @returns 包含繁体中文的产品对象
 */
export function convertProductTexts(product: {
  name?: { 'zh-CN': string }
  description?: { 'zh-CN': string }
  [key: string]: any
}): { 'zh-HK': string; 'zh-CN': string } {
  const result: any = {}

  // 转换 name
  if (product.name && product.name['zh-CN']) {
    result['zh-CN'] = product.name['zh-CN']
    result['zh-HK'] = toTraditionalChinese(product.name['zh-CN'])
  }

  // 转换 description
  if (product.description && product.description['zh-CN']) {
    result['zh-CN'] = product.description['zh-CN']
    result['zh-HK'] = toTraditionalChinese(product.description['zh-CN'])
  }

  return result
}

/**
 * 批量转换产品数组
 * Batch convert an array of products
 *
 * @param products - 产品数组
 * @returns 转换后的产品数组
 */
export function convertProducts(products: any[]): any[] {
  return products.map(product => {
    const converted = { ...product }

    // 转换 name
    if (converted.name && converted.name['zh-CN']) {
      converted.name = {
        'zh-CN': converted.name['zh-CN'],
        'zh-HK': toTraditionalChinese(converted.name['zh-CN']),
        en: converted.name.en || `[TRANSLATE] ${converted.name['zh-CN']}`
      }
    }

    // 转换 description
    if (converted.description && converted.description['zh-CN']) {
      converted.description = {
        'zh-CN': converted.description['zh-CN'],
        'zh-HK': toTraditionalChinese(converted.description['zh-CN']),
        en: converted.description.en || `[TRANSLATE] ${converted.description['zh-CN']}`
      }
    }

    return converted
  })
}

// 示例使用 / Usage Example
if (import.meta.url === `file://${process.argv[1]}`) {
  const example = {
    name: { 'zh-CN': 'BC440G3-P 高性能计算服务器' },
    description: { 'zh-CN': '2U高性能计算服务器，适用于科学计算、深度学习、人工智能等需要大规模并行计算的领域。' }
  }

  console.log('=== 简繁转换示例 / Conversion Example ===\n')
  console.log('原文 (Simplified):')
  console.log('Name:', example.name['zh-CN'])
  console.log('Description:', example.description['zh-CN'])

  const converted = convertProducts([example])[0]

  console.log('\n繁体 (Traditional):')
  console.log('Name:', converted.name['zh-HK'])
  console.log('Description:', converted.description['zh-HK'])
}

export default { toTraditionalChinese, convertProductTexts, convertProducts }
