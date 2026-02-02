// supabase/functions/embed-product/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { OpenAI } from "https://esm.sh/openai@4.28.0"

const openai = new OpenAI({
  apiKey: Deno.env.get('DASHSCOPE_API_KEY'),
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record, type } = payload

    // 1. 只有 INSERT 或 UPDATE 且有数据时才处理
    if (type === 'DELETE' || !record) {
      return new Response('Skipped', { status: 200 })
    }

    // 2. 智能提取多语言 JSON 字段
    // 你的数据库结构中 name 和 description 都是 JSONB
    const extractText = (field: any) => {
      if (!field) return ''
      if (typeof field === 'string') return field
      // 优先取中文，其次香港繁体，最后英文
      return field.cn || field.hk || field.en || JSON.stringify(field)
    }

    const name = extractText(record.name)
    const description = extractText(record.description)
    const specs = record.specs ? JSON.stringify(record.specs) : ''

    // 3. 组合成 AI 可读的文本
    const contentToEmbed = `
      产品名称: ${name}
      类别: ${record.category}
      描述: ${description}
      规格参数: ${specs}
    `.trim()

    console.log(`正在处理: ${name}`)

    // 4. 生成向量 (使用阿里 text-embedding-v3, 1024维)
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-v3',
      input: contentToEmbed.replaceAll('\n', ' '),
      dimensions: 1024
    })
    const embedding = embeddingResponse.data[0].embedding

    // 5. 存入 product_embeddings 表
    await supabase.from('product_embeddings').delete().eq('product_id', record.id)

    const { error } = await supabase.from('product_embeddings').insert({
      product_id: record.id,
      content: contentToEmbed,
      embedding: embedding
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })

  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
