// server/api/chat/messages/index.post.ts
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

  try {
    // 3. 解析用户输入
    const { messages, sessionId, language = 'zh-HK' } = await readBody(event)

    console.log('[API] 收到消息请求:', { sessionId, language, messageCount: messages?.length })

    if (!messages || !Array.isArray(messages)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid messages format' })
    }

    // 4. 处理会话
    let currentSessionId = sessionId

    console.log('[API] currentSessionId:', currentSessionId, '类型:', typeof currentSessionId)

    // 如果没有提供 sessionId，创建新会话
    if (!currentSessionId) {
      const lastMessage = messages[messages.length - 1]
      // 使用第一条消息的前 30 个字符作为标题
      const title = lastMessage.content.slice(0, 30) + (lastMessage.content.length > 30 ? '...' : '')

      console.log('[API] 创建新会话，标题:', title)

      const { data: newSession, error: insertError } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          session_title: title,
          language,
          status: 'active'
        })
        .select()
        .single()

      if (insertError || !newSession) {
        console.error('[API] 创建会话失败:', insertError)
        throw createError({ statusCode: 500, statusMessage: 'Failed to create session' })
      }

      console.log('[API] 新会话创建成功:', newSession)

      currentSessionId = newSession.id
    }

    // 5. 保存用户消息到数据库
    const userMessage = messages[messages.length - 1]
    await supabaseAdmin
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        role: 'user',
        content: userMessage.content,
        metadata: { language }
      })

    // 6. 生成 AI 回复
    const lastMessage = messages[messages.length - 1].content

    // 生成问题向量 (阿里 v3, 1024维)
    const embeddingResp = await openai.embeddings.create({
      model: 'text-embedding-v3',
      input: lastMessage.replaceAll('\n', ' '),
      dimensions: 1024
    })

    // 7. 数据库检索 (调用 RPC)
    const { data: products } = await supabaseAdmin.rpc('match_products', {
      query_embedding: embeddingResp.data[0].embedding,
      match_threshold: 0.5,
      match_count: 5
    })

    // 8. 构建上下文
    const contextBlock = products?.map((item: any) => {
      const raw = item.product_details
      const name = raw.name?.cn || raw.name?.hk || raw.name?.en || '未命名产品'
      return `[产品]: ${name}\n[AI摘要]: ${item.content}\n---`
    }).join('\n') || '未找到相关产品'

    const systemPrompt = `你是一個專業的服務器硬件專家 (Supercore AI)。你的回答必須精確、簡潔，並始終基於提供的 [產品庫數據]。

行為規則：
1. 始終使用【繁體中文(香港)】回答用戶，無論用戶使用何種語言提問。
2. 保持專業、冷靜且理性的語氣（瑞士工業設計風格）。
3. 優先引用產品的型號名稱、技術細節和參數。
4. 如果數據庫中沒有相關產品，請直接告知："目前數據庫中沒有關於此問題的詳細資料，請聯繫我們的技術團隊查詢。"

【產品庫數據】:
${contextBlock}`

    // 9. 流式生成回答 (使用 OpenAIStream)
    const response = await openai.chat.completions.create({
      model: 'qwen-plus',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.3,
    })

    // 10. 创建转换流来捕获完整响应
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        // 流传输完成后，保存助手消息到数据库
        console.log('[API] 流式响应完成，完整内容长度:', completion?.length || 0)
        if (completion && completion.trim()) {
          await supabaseAdmin
            .from('chat_messages')
            .insert({
              session_id: currentSessionId!,
              role: 'assistant',
              content: completion,
              metadata: {
                language,
                model: 'qwen-plus',
                productsFound: products?.length || 0
              }
            })
        }
      },
      // 添加 onStart 回调来调试
      async onStart() {
        console.log('[API] 流式响应开始')
      }
    })

    // 11. 返回流式响应
    return new StreamingTextResponse(stream, {
      headers: {
        'X-Session-ID': currentSessionId.toString()
      }
    })
  } catch (e: any) {
    console.error('AI Chat Error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage || 'Internal Server Error'
    })
  }
})
