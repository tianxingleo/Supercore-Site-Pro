import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = 'sb_publishable_xfhjuY2GGaHAvM1k8dMGyA_uIoWntqZ'

const client = createClient(supabaseUrl, supabaseKey)

console.log('检查 posts 表中的所有数据...\n')

// 获取所有 posts
const { data: allPosts, error: allError } = await client
  .from('posts')
  .select('*')

if (allError) {
  console.error('获取所有 posts 失败:', allError)
} else {
  console.log('所有 posts 数量:', allPosts.length)
  console.log('所有 posts:', JSON.stringify(allPosts, null, 2))
}

console.log('\n' + '='.repeat(60) + '\n')

// 模拟 API 调用 - 检查已发布的文章
const { data: publishedPosts, error: publishedError } = await client
  .from('posts')
  .select('*')
  .not('published_at', 'is', null)
  .lte('published_at', new Date().toISOString())
  .order('published_at', { ascending: false })

if (publishedError) {
  console.error('获取已发布 posts 失败:', publishedError)
} else {
  console.log('已发布 posts 数量:', publishedPosts.length)
  console.log('已发布 posts:', JSON.stringify(publishedPosts, null, 2))
}
