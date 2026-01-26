/**
 * 更新 mockData.ts 脚本
 * Update mockData.ts Script
 *
 * 将新生成的产品数据追加到 utils/mockData.ts 文件中
 * Appends newly generated product data to utils/mockData.ts file
 */

import fs from 'fs/promises'
import path from 'path'
import { generateProduct, type RawProduct } from './generate-products'

// 路径配置 / Path Configuration
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const MOCKDATA_PATH = path.join(PROJECT_ROOT, 'utils/mockData.ts')
const BACKUP_PATH = path.join(PROJECT_ROOT, 'utils/mockData.ts.backup')

/**
 * 生成产品对象的 TypeScript 代码
 * Generate TypeScript code for a product object
 *
 * @param product - 产品对象
 * @returns TypeScript 代码字符串
 */
function generateProductCode(product: ReturnType<typeof generateProduct>): string {
  const specsString = JSON.stringify(product.specs, null, 6)
  const imagesString = JSON.stringify(product.images)

  return `  // ${product.name['zh-CN']}
  {
    id: '${product.id}',
    slug: '${product.slug}',
    name: {
      'zh-HK': '${escapeForTS(product.name['zh-HK'])}',
      'zh-CN': '${escapeForTS(product.name['zh-CN'])}',
      en: '${escapeForTS(product.name.en)}'
    },
    description: {
      'zh-HK': '${escapeForTS(product.description['zh-HK'])}',
      'zh-CN': '${escapeForTS(product.description['zh-CN'])}',
      en: '${escapeForTS(product.description.en)}'
    },
    specs: ${specsString.replace(/\n/g, '\n    ')},
    images: ${imagesString},
    category: '${product.category}',
    featured: ${product.featured},
    createdAt: '${product.createdAt}'
  }`
}

/**
 * 转义字符串中的特殊字符以用于 TypeScript
 * Escape special characters in strings for TypeScript
 *
 * @param str - 原始字符串
 * @returns 转义后的字符串
 */
function escapeForTS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // 反斜杠 / Backslash
    .replace(/'/g, "\\'")    // 单引号 / Single quote
    .replace(/"/g, '\\"')    // 双引号 / Double quote
    .replace(/\n/g, '\\n')   // 换行 / Newline
    .replace(/\r/g, '\\r')   // 回车 / Carriage return
    .replace(/\t/g, '\\t')   // 制表符 / Tab
}

/**
 * 将新产品追加到 mockData.ts
 * Append new products to mockData.ts
 *
 * @param rawProducts - 原始产品数组
 */
export async function appendToMockData(rawProducts: RawProduct[]): Promise<void> {
  try {
    // 读取现有文件 / Read existing file
    const content = await fs.readFile(MOCKDATA_PATH, 'utf-8')

    // 生成新产品代码 / Generate new product code
    const newProductsCode = rawProducts.map(raw => {
      const product = generateProduct(raw)
      return generateProductCode(product)
    }).join(',\n\n')

    // 找到 mockProducts 数组的结束位置 / Find end of mockProducts array
    const arrayEndMatch = content.match(/\]\n\n\/\*\*\n \* Mock News Data/)
    if (!arrayEndMatch) {
      throw new Error('无法找到 mockProducts 数组的结束位置 / Cannot find end of mockProducts array')
    }

    const arrayEnd = arrayEndMatch.index!

    // 插入新数据 / Insert new data
    const updatedContent =
      content.slice(0, arrayEnd) +
      ',\n\n' + newProductsCode +
      content.slice(arrayEnd)

    // 备份原文件 / Backup original file
    await fs.copyFile(MOCKDATA_PATH, BACKUP_PATH)
    console.log(`✅ 已备份原文件到 / Backup created: ${path.relative(PROJECT_ROOT, BACKUP_PATH)}`)

    // 写入更新后的文件 / Write updated file
    await fs.writeFile(MOCKDATA_PATH, updatedContent, 'utf-8')
    console.log(`✅ 已更新 / Updated: ${path.relative(PROJECT_ROOT, MOCKDATA_PATH)}`)
    console.log(`✅ 追加了 ${rawProducts.length} 个产品 / Appended ${rawProducts.length} product(s)`)

  } catch (error) {
    console.error('❌ 更新失败 / Update failed:', error)
    throw error
  }
}

/**
 * 从 JSON 文件读取并更新
 * Read from JSON file and update
 *
 * @param jsonPath - JSON 文件路径
 */
export async function updateFromJson(jsonPath: string): Promise<void> {
  const content = await fs.readFile(jsonPath, 'utf-8')
  const rawProducts: RawProduct[] = JSON.parse(content)

  await appendToMockData(rawProducts)
}

/**
 * 直接使用产品数据更新
 * Update directly with product data
 *
 * @param products - 产品数据数组
 */
export async function updateWithProducts(products: RawProduct[]): Promise<void> {
  await appendToMockData(products)
}

// 示例使用 / Usage Example
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleProducts: RawProduct[] = [
    {
      product_id: 'example-product',
      source_url: 'https://boer.cn/products/example',
      category: 'server',
      name_zhCN: '示例产品',
      description_zhCN: '这是一个示例产品描述。',
      specs_model: 'EXAMPLE-001',
      specs_cpu: 'Intel Xeon',
      image_filename: 'example.png',
      featured: false
    }
  ]

  console.log('=== 模拟更新 / Simulated Update ===')
  console.log('将在 mockData.ts 中添加以下产品 / Will add the following product to mockData.ts:')
  console.log(JSON.stringify(exampleProducts, null, 2))
  console.log('\n注意：这只是示例，不会真正修改文件 / Note: This is just an example, will not actually modify the file')
}

export default { appendToMockData, updateFromJson, updateWithProducts }
