import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = 'sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI'

const client = createClient(supabaseUrl, supabaseKey)

console.log('检查 products 表中的现有产品...\n')

// 获取所有产品
const { data: products, error } = await client
  .from('products')
  .select('*')
  .order('id', { ascending: true })

if (error) {
  console.error('获取产品失败:', error)
} else {
  console.log(`现有产品数量: ${products.length}\n`)

  if (products.length > 0) {
    console.log('现有产品列表:')
    products.forEach((p, index) => {
      console.log(`\n${index + 1}. ${p.name?.zh || p.name?.en || 'No name'} (ID: ${p.id})`)
      console.log(`   Slug: ${p.slug}`)
      console.log(`   Category: ${p.category}`)
      console.log(`   Status: ${p.status}`)
    })
  } else {
    console.log('数据库中暂无产品数据')
  }
}

// 检查产品分类
console.log('\n\n检查产品分类...')
const { data: categories } = await client
  .from('products')
  .select('category')
  .not('category', 'is', null)

if (categories) {
  const uniqueCategories = [...new Set(categories.map(c => c.category))]
  console.log(`现有产品分类: ${uniqueCategories.join(', ')}`)
}
