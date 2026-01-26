/**
 * 产品数据生成脚本
 * Product Data Generator Script
 *
 * 将手动收集的原始数据转换为符合 Product 接口的格式
 * Converts manually collected raw data to Product interface format
 */

import type { Product } from '../types'
import { toTraditionalChinese } from './convert-traditional'

/**
 * 原始产品数据接口（从 Excel/JSON 收集）
 * Raw product data interface (collected from Excel/JSON)
 */
export interface RawProduct {
  product_id: string          // 产品唯一标识，如 "bc440g3-p"
  source_url: string          // boer.cn 页面 URL
  category: string            // 产品分类: server/storage/hpc/storage-hp/network
  name_zhCN: string          // 产品名称（简体中文）
  description_zhCN: string    // 产品描述（简体中文）
  specs_model?: string        // 型号
  specs_cpu?: string          // 处理器
  specs_chipset?: string      // 芯片组
  specs_memory?: string       // 内存
  specs_storage?: string      // 存储
  specs_pcie?: string         // PCIe 版本
  specs_power?: string        // 电源
  specs_rackUnits?: string    // 机架高度
  specs_expansion?: string    // 扩展槽
  specs_cacheStorage?: string // 缓存存储
  specs_capacity?: string     // 容量
  specs_raid?: string         // RAID
  image_filename: string      // 图片文件名，如 "bc440g3-p.png"
  featured: boolean           // 是否首页展示
}

/**
 * 将原始产品数据转换为 Product 接口格式
 * Convert raw product data to Product interface format
 *
 * @param raw - 原始产品数据
 * @returns 符合 Product 接口的产品对象
 */
export function generateProduct(raw: RawProduct): Product {
  // 构建规格对象 / Build specs object
  const specs: Record<string, string | number | boolean> = {}

  if (raw.specs_model) specs.model = raw.specs_model
  if (raw.specs_cpu) specs.cpu = raw.specs_cpu
  if (raw.specs_chipset) specs.chipset = raw.specs_chipset
  if (raw.specs_memory) specs.memory = raw.specs_memory
  if (raw.specs_storage) specs.storage = raw.specs_storage
  if (raw.specs_pcie) specs.pcie = raw.specs_pcie
  if (raw.specs_power) specs.power = raw.specs_power
  if (raw.specs_rackUnits) specs.rackUnits = raw.specs_rackUnits
  if (raw.specs_expansion) specs.expansion = raw.specs_expansion
  if (raw.specs_cacheStorage) specs.cacheStorage = raw.specs_cacheStorage
  if (raw.specs_capacity) specs.capacity = raw.specs_capacity
  if (raw.specs_raid) specs.raid = raw.specs_raid

  // 生成 slug（URL 友好的 ID）/ Generate slug (URL-friendly ID)
  const slug = raw.product_id.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  // 转换为三语格式 / Convert to trilingual format
  const nameZhCN = raw.name_zhCN
  const nameZhHK = toTraditionalChinese(raw.name_zhCN)

  const descZhCN = raw.description_zhCN
  const descZhHK = toTraditionalChinese(raw.description_zhCN)

  return {
    id: raw.product_id,
    slug,
    name: {
      'zh-CN': nameZhCN,
      'zh-HK': nameZhHK,
      en: `[TRANSLATE] ${nameZhCN}` // 待人工翻译 / To be manually translated
    },
    description: {
      'zh-CN': descZhCN,
      'zh-HK': descZhHK,
      en: `[TRANSLATE] ${descZhCN}` // 待人工翻译 / To be manually translated
    },
    specs,
    images: [`/images/products/${raw.image_filename}`],
    category: raw.category as Product['category'],
    featured: raw.featured,
    createdAt: new Date().toISOString()
  }
}

/**
 * 批量生成产品数据
 * Batch generate product data
 *
 * @param rawProducts - 原始产品数组
 * @returns 生成的产品数组
 */
export function generateProducts(rawProducts: RawProduct[]): Product[] {
  return rawProducts.map(generateProduct)
}

/**
 * 从 JSON 文件生成产品数据
 * Generate product data from JSON file
 *
 * @param jsonPath - JSON 文件路径
 * @returns 生成的产品数组
 */
export async function generateFromJson(jsonPath: string): Promise<Product[]> {
  const fs = await import('fs/promises')
  const content = await fs.readFile(jsonPath, 'utf-8')
  const rawProducts: RawProduct[] = JSON.parse(content)

  return generateProducts(rawProducts)
}

// 示例使用 / Usage Example
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleRawProduct: RawProduct = {
    product_id: 'bc440g3-p',
    source_url: 'https://boer.cn/products/bc440g3-p',
    category: 'hpc',
    name_zhCN: 'BC440G3-P 高性能计算服务器',
    description_zhCN: '2U高性能计算服务器，适用于科学计算、深度学习、人工智能等需要大规模并行计算的领域。支持GPU加速和高速互连。',
    specs_model: 'BC440G3-P',
    specs_cpu: 'AMD EPYC 9004系列处理器',
    specs_memory: '24x DDR5-4800 DIMM插槽，最大1.5TB',
    specs_storage: '热插拔 NVMe SSD',
    specs_pcie: 'PCIe 5.0',
    specs_power: '冗余电源',
    specs_rackUnits: '2U',
    image_filename: 'bc440g3-p.png',
    featured: true
  }

  const generatedProduct = generateProduct(exampleRawProduct)

  console.log('=== 产品数据生成示例 / Product Data Generation Example ===\n')
  console.log(JSON.stringify(generatedProduct, null, 2))
}

export default { generateProduct, generateProducts, generateFromJson }
