import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '../utils/mockData'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = 'sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI'

const client = createClient(supabaseUrl, supabaseKey)

async function uploadProducts() {
  console.log('开始上传产品数据到 Supabase...\n')

  // 清理现有的重复 ID（只保留第一次出现的）
  const uniqueProducts = []
  const seenIds = new Set()

  for (const product of mockProducts) {
    if (!seenIds.has(product.id)) {
      uniqueProducts.push(product)
      seenIds.add(product.id)
    }
  }

  console.log(`准备上传 ${uniqueProducts.length} 个产品（已去除重复）\n`)

  // 逐个上传产品
  for (let i = 0; i < uniqueProducts.length; i++) {
    const product = uniqueProducts[i]

    console.log(`[${i + 1}/${uniqueProducts.length}] 上传产品: ${product.name['zh-CN']} (ID: ${product.id})`)

    const { data, error } = await client
      .from('products')
      .upsert(product, {
        onConflict: 'id'
      })

    if (error) {
      console.error(`❌ 失败: ${error.message}`)
    } else {
      console.log(`✅ 成功: 产品ID = ${data[0].id}`)
    }
  }

  console.log('\n✨ 所有产品上传完成！')

  // 验证上传结果
  console.log('\n验证上传结果...')
  const { data: products } = await client
    .from('products')
    .select('id, slug, name')
    .order('id', { ascending: true })

  if (products) {
    console.log(`\n数据库中现有 ${products.length} 个产品:\n`)
    products.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.name['zh-CN'] || p.name['en']} (ID: ${p.id}, Slug: ${p.slug})`)
    })
  }

  return products
}

// 执行上传
uploadProducts()
  .then(() => {
    console.log('\n✅ 脚本执行完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 脚本执行失败:', error)
    process.exit(1)
  })
