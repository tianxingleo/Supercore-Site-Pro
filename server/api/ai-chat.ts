// server/api/ai-chat.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. 获取运行时配置
  const config = useRuntimeConfig()
  const { url, key } = config.supabaseService
  const apiKey = config.dashscopeApiKey

  if (!url || !key || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing AI Configuration' })
  }

  // 2. 初始化客户端
  const supabaseAdmin = createClient(url, key)
  
  // 初始化 OpenAI 客户端 (阿里云兼容)
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  })

  // 3. 解析用户输入
  const { messages } = await readBody(event)

  if (!messages || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid messages format' })
  }

  const lastMessage = messages[messages.length - 1].content

  try {
    // 4. 生成问题向量 (阿里 v3, 1024维)
    // 阿里云兼容接口可能需要特殊的 Embedding 处理，这里假设它兼容 OpenAI 格式
    const embeddingResp = await openai.embeddings.create({
      model: 'text-embedding-v3', // 确保这个模型在阿里云可用，或者换成 text-embedding-v1 / v2
      input: lastMessage.replaceAll('\n', ' '),
      dimensions: 1024
    })

    // 5. 数据库检索 (调用 RPC)
    const { data: products } = await supabaseAdmin.rpc('match_products', {
      query_embedding: embeddingResp.data[0].embedding,
      match_threshold: 0.5,
      match_count: 5
    })

    // 6. 构建上下文
    const contextBlock = products?.map((item: any) => {
      const raw = item.product_details
      const name = raw.name?.cn || raw.name?.hk || raw.name?.en || '未命名产品'
      return `[产品]: ${name}\n[AI摘要]: ${item.content}\n---`
    }).join('\n') || '未找到相关产品'

    const systemPrompt = `你是一个服务器硬件专家 (Supercore AI)，你的回答必须准确基于提供的[产品库数据]。
    
规则：
1. 请用繁体中文(香港)回答用户。
2. 如果用户询问具体配置，请引用产品的详细参数。
3. 如果库里没有相关产品，请直接告知"目前数据库中没有关于此问题的详细资料，请联系客服查询。"
4. 回答要专业、热情。

【产品库数据】:
${contextBlock}`

    // 7. 流式生成回答 (使用 OpenAIStream)
    const response = await openai.chat.completions.create({
      model: 'qwen-plus', // 阿里云模型
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.3,
    })

    // 将 OpenAI 的流转换为 Vercel AI 的流
    const stream = OpenAIStream(response)
    // 返回流式响应
    return new StreamingTextResponse(stream)
  } catch (e: any) {
    console.error('AI Chat Error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
