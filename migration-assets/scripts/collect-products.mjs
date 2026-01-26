/**
 * boer.cn 产品数据自动收集脚本
 * 使用 Playwright 自动访问所有产品页面并收集数据
 */

import { chromium } from 'playwright'
import fs from 'fs/promises'
import path from 'path'

const OUTPUT_DIR = path.resolve('../collected-data')
const IMAGES_DIR = path.resolve('../downloaded-images/temp')

// 确保目录存在
await fs.mkdir(OUTPUT_DIR, { recursive: true })
await fs.mkdir(IMAGES_DIR, { recursive: true })

// 产品列表（从 boer.cn 产品页面手动收集）
const productUrls = [
  // 通用计算
  { url: 'https://boer.cn/productinfo/2750677.html', category: 'server', id: 'bc120g3' },
  { url: 'https://boer.cn/productinfo/2750682.html', category: 'server', id: 'bc120g3-h' },
  { url: 'https://boer.cn/productinfo/2750709.html', category: 'server', id: 'bc220g3' },
  { url: 'https://boer.cn/productinfo/2750712.html', category: 'server', id: 'bc220g3-h' },
  { url: 'https://boer.cn/productinfo/2750710.html', category: 'server', id: 'bc220g3-s' },
]

async function collectProductData(page, productInfo) {
  console.log(`\n收集产品: ${productInfo.id}`)
  console.log(`URL: ${productInfo.url}`)

  await page.goto(productInfo.url, { waitUntil: 'networkidle' })

  // 提取产品信息
  const data = await page.evaluate(() => {
    // 提取产品名称
    const name = document.querySelector('h1')?.textContent?.trim() || ''

    // 提取产品描述
    const descElement = document.querySelector('div.generic p:nth-child(2)')
    const description = descElement?.textContent?.trim() || ''

    // 提取规格表格
    const specs = {}
    const specRows = document.querySelectorAll('table tr')

    specRows.forEach(row => {
      const cells = row.querySelectorAll('td')
      if (cells.length >= 2) {
        const key = cells[0].textContent?.trim()
        const value = cells[1].textContent?.trim()
        if (key && value && key !== '详细规格') {
          specs[key] = value
        }
      }
    })

    // 提取图片URL
    const images = []
    const imgElements = document.querySelectorAll('img[src*="sitefiles"]')
    imgElements.forEach((img, index) => {
      const src = img.getAttribute('src')
      if (src) {
        images.push({
          url: src.startsWith('http') ? src : `https://boer.cn${src}`,
          index
        })
      }
    })

    return { name, description, specs, images }
  })

  return {
    product_id: productInfo.id,
    source_url: productInfo.url,
    category: productInfo.category,
    name_zhCN: data.name,
    description_zhCN: data.description,
    specs: data.specs,
    images: data.images,
    image_filename: `${productInfo.id}.png`,
    featured: false
  }
}

async function downloadImage(page, imageUrl, filename) {
  try {
    const response = await page.context().request.get(imageUrl)
    const buffer = await response.body()
    const filepath = path.join(IMAGES_DIR, filename)
    await fs.writeFile(filepath, buffer)
    console.log(`  ✓ 已下载图片: ${filename}`)
    return true
  } catch (error) {
    console.log(`  ✗ 下载图片失败: ${filename}`)
    return false
  }
}

async function main() {
  console.log('🚀 开始收集 boer.cn 产品数据...\n')

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  })
  const page = await context.newPage()

  const allProducts = []

  for (const product of productUrls) {
    try {
      const productData = await collectProductData(page, product)

      // 下载第一张产品图片
      if (productData.images.length > 0) {
        await downloadImage(page, productData.images[0].url, productData.image_filename)
      }

      // 移除 images 字段（仅用于下载）
      delete productData.images

      allProducts.push(productData)

      console.log(`  ✓ 已收集: ${productData.name_zhCN}`)

      // 延迟避免请求过快
      await page.waitForTimeout(2000)

    } catch (error) {
      console.error(`  ✗ 收集失败: ${product.id}`, error.message)
    }
  }

  await browser.close()

  // 保存为 JSON 文件
  const outputPath = path.join(OUTPUT_DIR, 'collected-products.json')
  await fs.writeFile(outputPath, JSON.stringify(allProducts, null, 2), 'utf-8')

  console.log(`\n✅ 收集完成！`)
  console.log(`📊 总产品数: ${allProducts.length}`)
  console.log(`💾 数据已保存到: ${outputPath}`)
  console.log(`🖼️  图片已保存到: ${IMAGES_DIR}`)
}

main().catch(console.error)
