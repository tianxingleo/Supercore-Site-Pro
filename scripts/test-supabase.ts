/**
 * 测试 Supabase 连接
 */
import { createClient } from '@supabase/supabase-js'

async function testSupabaseConnection() {
  console.log('========================================')
  console.log('Supabase 连接测试')
  console.log('========================================\n')

  // 检查环境变量
  console.log('环境变量检查:')
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ 已配置' : '❌ 未配置')
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ 已配置' : '❌ 未配置')
  console.log('SUPABASE_SECRET_KEY:', process.env.SUPABASE_SECRET_KEY ? '✅ 已配置' : '❌ 未配置')
  console.log()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 配置缺失，无法测试连接')
    process.exit(1)
  }

  console.log('创建 Supabase 客户端...')
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('✅ 客户端创建成功\n')

  // 测试查询
  console.log('测试查询 products 表...')
  try {
    const { data, error, count } = await client
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'published')

    if (error) {
      console.error('❌ 查询失败:', error)
      process.exit(1)
    }

    console.log('✅ 查询成功!')
    console.log(`   总记录数: ${count}`)
    console.log(`   返回记录数: ${data?.length || 0}`)
    console.log()

    if (data && data.length > 0) {
      console.log('示例产品:')
      const sample = data[0]
      console.log(`   - ID: ${sample.id}`)
      console.log(`   - Slug: ${sample.slug}`)
      console.log(`   - Name: ${JSON.stringify(sample.name)}`)
      console.log(`   - Status: ${sample.status}`)
      console.log()
    } else {
      console.log('⚠️  数据库中没有产品数据')
      console.log('   请先插入一些产品数据到 products 表')
    }
  } catch (error) {
    console.error('❌ 查询异常:', error)
    process.exit(1)
  }

  console.log('========================================')
  console.log('测试完成')
  console.log('========================================')
}

testSupabaseConnection()
