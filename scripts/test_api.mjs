// 测试公开 API 端点
const testUrl = 'http://localhost:3003/api/news/public?limit=3'

console.log('🧪 Testing API endpoint:', testUrl)
console.log()

try {
    const response = await fetch(testUrl)
    const data = await response.json()

    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(data, null, 2))

    if (Array.isArray(data)) {
        console.log(`\n✅ API returned ${data.length} posts`)
        data.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.title?.hk} (${post.slug})`)
        })
    } else {
        console.log('\n⚠️  API did not return an array')
    }
} catch (error) {
    console.error('❌ Error:', error.message)
}
