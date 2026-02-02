import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { OpenAI } from "https://esm.sh/openai@4.28.0"

// ⚠️ 配置修改点 1: 初始化指向阿里云百炼 (DashScope)
const openai = new OpenAI({
  apiKey: Deno.env.get('DASHSCOPE_API_KEY'), // 稍后设置这个环境变量
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1" // 阿里云的兼容接口
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record, type } = payload

    if (type === 'DELETE' || !record) {
      return new Response('Skipped', { status: 200 })
    }

    console.log(`正在处理产品 ID: ${record.id} (${record.slug})`)

    const getName = (n: any) => n?.cn || n?.hk || n?.en || '未命名产品'
    const getDesc = (d: any) => d?.cn || d?.hk || d?.en || ''

    const productName = getName(record.name)
    const productDesc = getDesc(record.description)
    const productSpecs = record.specs ? JSON.stringify(record.specs) : ''

    const contentToEmbed = `
      产品名称: ${productName}
      产品类别: ${record.category}
      产品描述: ${productDesc}
      技术规格: ${productSpecs}
    `.trim()

    // ⚠️ 配置修改点 2: 使用阿里百炼的模型名称
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-v3',
      input: contentToEmbed.replaceAll('\n', ' '),
      dimensions: 1024 // 明确指定维度 (虽然v3默认就是1024，写上也保险)
    })

    const embedding = embeddingResponse.data[0].embedding

    await supabase.from('product_embeddings').delete().eq('product_id', record.id)

    const { error } = await supabase.from('product_embeddings').insert({
      product_id: record.id,
      content: contentToEmbed,
      embedding: embedding
    })

    if (error) {
      console.error('写入数据库失败:', error)
      throw error
    }

    console.log(`产品 ID: ${record.id} 向量化成功 (阿里百炼 v3)！`)

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    console.error('发生错误:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
