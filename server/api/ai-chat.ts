// server/api/ai-chat.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. 获取运行时配置
  const config = useRuntimeConfig(event)
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

  // --- 每日 Token 限制检查 ---
  const DAILY_TOKEN_LIMIT = 10 // 10万 token

  // 计算单个消息 Token 的函数 (与统计 API 保持一致)
  const estimateTokens = (text: string) => {
    if (!text) return 0
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const otherChars = text.length - chineseChars
    // 约略估算：中文 1.5 tokens，其他 (英文/符号) 0.3 tokens
    return Math.ceil(chineseChars * 1.5 + otherChars * 0.3)
  }

  // 1. 获取今日已使用的 Token 数
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: todayMessages } = await supabaseAdmin
    .from('chat_messages')
    .select('content')
    .gte('created_at', today.toISOString())

  let todayTokensUsed = 0
  todayMessages?.forEach(msg => {
    todayTokensUsed += estimateTokens(msg.content || '')
  })

  // 2. 检查是否超出限制
  const remainingTokens = Math.max(0, DAILY_TOKEN_LIMIT - todayTokensUsed)
  console.log(`[AI Chat] 今日 Token 使用情况: 已用 ${todayTokensUsed}, 剩余 ${remainingTokens}, 限制 ${DAILY_TOKEN_LIMIT}`)

  if (todayTokensUsed >= DAILY_TOKEN_LIMIT) {
    throw createError({ 
      statusCode: 429, 
      statusMessage: '今日 AI 使用額度已達上限 (100,000 Tokens)，請明天再試。' 
    })
  }
  // --- 结束 每日 Token 限制检查 ---

  const lastMessage = messages?.[messages.length - 1]?.content || ''

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
      query_embedding: embeddingResp.data?.[0]?.embedding,
      match_threshold: 0.5,
      match_count: 5
    })

    // 6. 构建上下文
    const contextBlock = products?.map((item: any) => {
      const raw = item.product_details
      const name = raw.name?.cn || raw.name?.hk || raw.name?.en || '未命名产品'
      return `[产品]: ${name}\n[AI摘要]: ${item.content}\n---`
    }).join('\n') || '未找到相关产品'

    const systemPrompt = `你是一個專業的服務器硬件專家 (XX AI)。你的回答必須精確、簡潔，並始終基於提供的 [產品庫數據]。

行為規則：
1. 始終使用【繁體中文(香港)】回答用戶，無論用戶使用何種語言提問。
2. 保持專業、冷靜且理性的語氣（瑞士工業設計風格）。
3. 優先引用產品的型號名稱、技術細節和參數。
4. 如果數據庫中沒有相關產品，請直接告知："目前數據庫中沒有關於此問題的詳細資料，請聯繫我們的技術團隊查詢。"

【產品庫數據】:
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
