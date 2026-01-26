/**
 * 执行产品数据更新
 * 从 JSON 文件读取产品数据并更新到 mockData.ts
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const MOCKDATA_PATH = path.join(PROJECT_ROOT, 'utils/mockData.ts')
const BACKUP_PATH = path.join(PROJECT_ROOT, 'utils/mockData.ts.backup')

// 从命令行参数获取 JSON 文件路径
const jsonPath = process.argv[2] || path.join(__dirname, '../collected-data/boer-products.json')

/**
 * 转义字符串
 */
function escapeForTS(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/**
 * 生成产品代码
 */
function generateProductCode(product) {
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
 * 简体转繁体
 */
function toTraditional(text) {
  // 简单映射常见词汇
  const mappings = {
    '服务器': '伺服器',
    '服务器': '伺服器',
    '通用计算': '通用計算',
    '通用存储': '通用存儲',
    '高性能': '高性能',
    '处理器': '處理器',
    '芯片组': '芯片組',
    '内存': '內存',
    '插槽': '插槽',
    '硬盘': '硬盤',
    '电源': '電源',
    '网络': '網絡',
    '支持': '支持',
    '最大': '最大',
    '热插拔': '熱插拔',
    '冗余': '冗餘'
  }

  let result = text
  for (const [simple, traditional] of Object.entries(mappings)) {
    result = result.replace(new RegExp(simple, 'g'), traditional)
  }
  return result
}

/**
 * 生成 Product 对象
 */
function generateProduct(raw) {
  const specs = {}
  if (raw.specs_model) specs.model = raw.specs_model
  if (raw.specs_cpu) specs.cpu = raw.specs_cpu
  if (raw.specs_chipset) specs.chipset = raw.specs_chipset
  if (raw.specs_memory) specs.memory = raw.specs_memory
  if (raw.specs_storage) specs.storage = raw.specs_storage
  if (raw.specs_pcie) specs.pcie = raw.specs_pcie
  if (raw.specs_power) specs.power = raw.specs_power
  if (raw.specs_rackUnits) specs.rackUnits = raw.specs_rackUnits

  const nameZhCN = raw.name_zhCN
  const nameZhHK = toTraditional(nameZhCN)

  const descZhCN = raw.description_zhCN
  const descZhHK = toTraditional(descZhCN)

  return {
    id: raw.product_id,
    slug: raw.product_id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: {
      'zh-CN': nameZhCN,
      'zh-HK': nameZhHK,
      en: `[TRANSLATE] ${nameZhCN}`
    },
    description: {
      'zh-CN': descZhCN,
      'zh-HK': descZhHK,
      en: `[TRANSLATE] ${descZhCN}`
    },
    specs,
    images: [`/images/products/${raw.image_filename}`],
    category: raw.category,
    featured: raw.featured,
    createdAt: new Date().toISOString()
  }
}

async function main() {
  try {
    console.log(`📖 读取产品数据: ${jsonPath}`)

    // 读取 JSON 文件
    const content = await fs.readFile(jsonPath, 'utf-8')
    const rawProducts = JSON.parse(content)

    console.log(`✓ 找到 ${rawProducts.length} 个产品`)

    // 读取 mockData.ts
    console.log(`\n📖 读取 mockData.ts...`)
    const mockDataContent = await fs.readFile(MOCKDATA_PATH, 'utf-8')

    // 生成产品代码
    console.log(`\n🔄 生成产品代码...`)
    const products = rawProducts.map(generateProduct)
    const newProductsCode = products.map(generateProductCode).join(',\n\n')

    // 找到 mockProducts 数组结束位置
    const arrayEndMatch = mockDataContent.match(/\]\n\n\/\*\*\n \* Mock News Data/)
    if (!arrayEndMatch) {
      throw new Error('无法找到 mockProducts 数组的结束位置')
    }

    const arrayEnd = arrayEndMatch.index

    // 插入新数据
    const updatedContent =
      mockDataContent.slice(0, arrayEnd) +
      ',\n\n' + newProductsCode +
      mockDataContent.slice(arrayEnd)

    // 备份原文件
    console.log(`\n💾 备份原文件...`)
    await fs.copyFile(MOCKDATA_PATH, BACKUP_PATH)
    console.log(`✓ 备份已创建: ${path.relative(PROJECT_ROOT, BACKUP_PATH)}`)

    // 写入更新后的文件
    console.log(`\n💾 写入更新...`)
    await fs.writeFile(MOCKDATA_PATH, updatedContent, 'utf-8')

    console.log(`\n✅ 更新完成！`)
    console.log(`📊 已添加 ${products.length} 个产品到 mockData.ts`)
    console.log(`\n⚠️  注意：`)
    console.log(`   - 英文内容需要手动翻译（搜索 [TRANSLATE]）`)
    console.log(`   - 繁体中文已自动转换，可能需要人工校对`)
    console.log(`   - 产品图片需要下载到 public/images/products/`)

  } catch (error) {
    console.error(`\n❌ 更新失败:`, error.message)
    process.exit(1)
  }
}

main()
