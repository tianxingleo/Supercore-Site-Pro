// 测试 API 调用
async function testAPI() {
  try {
    console.log('Testing /api/products/public...')
    const response = await fetch('http://localhost:3000/api/products/public')
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data length:', data.length)
    console.log('First product:', data[0])
  } catch (error) {
    console.error('Error:', error)
  }
}
testAPI()
