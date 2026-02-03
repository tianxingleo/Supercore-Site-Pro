<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'
import { useSafeMarkdown } from '~/composables/useSafeMarkdown'
import { useAnonymousUser } from '~/composables/useAnonymousUser'
import ChatSidebar from '~/components/chat/ChatSidebar.vue'

const { renderMarkdown } = useSafeMarkdown()
const { getAnonymousUserId } = useAnonymousUser()

// 延迟初始化 store
const chatStore = ref<any>(null)
const currentSessionId = ref<number | null>(null)
const anonymousUserId = ref<string>('')

// 初始化匿名用户 ID
onMounted(() => {
  anonymousUserId.value = getAnonymousUserId()
  console.log('[AiChat] 匿名用户 ID:', anonymousUserId.value)
})

const isOpen = ref(false)
const sidebarOpen = ref(false)
const scrollContainer = ref<HTMLDivElement | null>(null)
const copyFeedback = ref<{ messageId: string; show: boolean }>({ messageId: '', show: false })

// 聊天状态（手动管理，替代 useChat）
const chatMessages = ref<any[]>([])
const input = ref('')
const isLoading = ref(false)
const error = ref<Error | null>(null)
const isCreatingNewChat = ref(false) // 标志：是否正在创建新对话

// 存储每条消息的反馈状态
const messageFeedback = ref<Map<string, 'thumbs_up' | 'thumbs_down' | null>>(new Map())

// 监听 currentSessionId 变化，用于调试
watch(currentSessionId, (newId) => {
  console.log('[AiChat] currentSessionId 变化:', newId)
})

// 手动实现消息发送和流式响应处理
const handleSubmit = async (event: Event) => {
  event.preventDefault()

  const messageContent = input.value.trim()
  if (!messageContent || isLoading.value) return

  console.log('[AiChat] 发送消息:', messageContent)
  console.log('[AiChat] 当前 sessionId:', currentSessionId.value)

  try {
    isLoading.value = true
    error.value = null

    // 添加用户消息到列表
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      createdAt: new Date()
    }
    chatMessages.value.push(userMessage)

    // 清空输入框
    input.value = ''

    // 发送请求到 API
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: messageContent }],
        sessionId: currentSessionId.value,
        anonymousUserId: anonymousUserId.value, // 添加匿名用户 ID
        language: 'zh-HK'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 创建 AI 消息（用于流式更新）
    const assistantMessageIndex = chatMessages.value.length
    chatMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: '',
      createdAt: new Date()
    })

    // 读取流式响应
    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''
    let accumulatedContent = ''
    let chunkCount = 0

    console.log('[AiChat] 开始读取流式响应...')

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log('[AiChat] 流式响应完成，共接收', chunkCount, '个chunk')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      chunkCount++
      console.log('[AiChat] 接收 chunk #' + chunkCount + ', 长度:', chunk.length, '内容:', chunk.substring(0, 100))

      buffer += chunk
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.trim() === '') continue

        console.log('[AiChat] 解析行:', line.substring(0, 100))

        // 尝试多种格式
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data === '[DONE]') {
            console.log('[AiChat] 接收到 [DONE] 标记')
            continue
          }

          try {
            const parsed = JSON.parse(data)
            console.log('[AiChat] 解析后的数据(data:):', JSON.stringify(parsed).substring(0, 200))

            if (parsed.content) {
              accumulatedContent += parsed.content
              console.log('[AiChat] 累积内容长度:', accumulatedContent.length, '最新片段:', parsed.content.substring(0, 50))

              // 创建新数组，触发 Vue 响应式更新
              chatMessages.value = [
                ...chatMessages.value.slice(0, assistantMessageIndex),
                {
                  ...chatMessages.value[assistantMessageIndex],
                  content: accumulatedContent
                },
                ...chatMessages.value.slice(assistantMessageIndex + 1)
              ]
            } else {
              console.log('[AiChat] 解析的数据没有 content 字段:', Object.keys(parsed))
            }
          } catch (e) {
            console.log('[AiChat] JSON 解析失败(data:):', e)
          }
        } else if (line.match(/^\d+:/)) {
          // 处理 Vercel AI SDK 的 RSC 流格式: {index}:{json_string}
          // 例如: 0:"你好" 或 1:"，"
          console.log('[AiChat] 检测到 RSC 流格式')

          try {
            // 分割索引和内容
            const colonIndex = line.indexOf(':')
            if (colonIndex === -1) {
              console.log('[AiChat] 无效的 RSC 格式，缺少冒号')
              continue
            }

            const index = line.substring(0, colonIndex)
            const valueStr = line.substring(colonIndex + 1)
            console.log('[AiChat] RSC 索引:', index, '值字符串:', valueStr.substring(0, 50))

            // 值字符串本身就是一个 JSON 字符串，需要 parse
            const parsed = JSON.parse(valueStr)
            console.log('[AiChat] 解析后的值:', JSON.stringify(parsed).substring(0, 200), '类型:', typeof parsed)

            // 处理多种可能的格式
            let contentToAdd = ''

            // 1. 如果是数组，遍历所有字符串元素
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                if (typeof item === 'string') {
                  contentToAdd += item
                } else if (item?.text) {
                  contentToAdd += item.text
                } else if (item?.content) {
                  contentToAdd += item.content
                }
              }
            }
            // 2. 如果直接是字符串，使用它
            else if (typeof parsed === 'string') {
              contentToAdd = parsed
            }
            // 3. 如果是对象且有 content 字段
            else if (parsed?.content) {
              contentToAdd = parsed.content
            }
            // 4. 如果是对象且有 text 字段
            else if (parsed?.text) {
              contentToAdd = parsed.text
            }

            if (contentToAdd) {
              accumulatedContent += contentToAdd
              console.log('[AiChat] 累积内容长度:', accumulatedContent.length, '新增片段:', contentToAdd.substring(0, 50))

              // 创建新数组，触发 Vue 响应式更新
              chatMessages.value = [
                ...chatMessages.value.slice(0, assistantMessageIndex),
                {
                  ...chatMessages.value[assistantMessageIndex],
                  content: accumulatedContent
                },
                ...chatMessages.value.slice(assistantMessageIndex + 1)
              ]
            } else {
              console.log('[AiChat] 无法从解析结果中提取内容，parsed:', parsed)
            }
          } catch (e) {
            console.log('[AiChat] RSC 格式解析失败:', e, '原始行:', line)
          }
        } else {
          console.log('[AiChat] 未识别的格式，尝试直接添加到内容')
          // 如果都不是，可能就是纯文本，直接添加
          accumulatedContent += line
          chatMessages.value = [
            ...chatMessages.value.slice(0, assistantMessageIndex),
            {
              ...chatMessages.value[assistantMessageIndex],
              content: accumulatedContent
            },
            ...chatMessages.value.slice(assistantMessageIndex + 1)
          ]
        }
      }
    }

    console.log('[AiChat] 流式响应处理完成，最终内容长度:', accumulatedContent.length)

    console.log('[AiChat] 消息发送完成')
    // 重新加载会话列表
    if (chatStore.value) {
      // ⭐ 传入匿名用户 ID，确保只加载当前用户的会话
      await chatStore.value.loadSessions('active', anonymousUserId.value)

      // 检查是否创建了新会话（从响应头获取）
      const newSessionId = response.headers.get('X-Session-ID')
      if (newSessionId) {
        const sessionIdNum = parseInt(newSessionId)
        console.log('[AiChat] 新会话创建成功:', sessionIdNum)

        // 将当前消息同步到 store 的 messages Map
        chatStore.value.messages.set(sessionIdNum, [...chatMessages.value])

        // 更新 store 的 currentSession，确保指向新会话
        if (chatStore.value.sessions.length > 0) {
          const newSession = chatStore.value.sessions.find((s: any) => s.id === sessionIdNum)
          if (newSession) {
            chatStore.value.currentSession = newSession
            console.log('[AiChat] 更新 currentSession 到新会话:', sessionIdNum)
          }
        }
      }
    }
  } catch (err: any) {
    console.error('[AiChat] 发送消息失败:', err)
    error.value = err
  } finally {
    isLoading.value = false
  }
}

// setMessages 函数（用于清空消息）
const setMessages = (msgs: any[]) => {
  chatMessages.value = msgs
}

// 监听 chatMessages 的变化
watch(chatMessages, (msgs) => {
  console.log('[AiChat] chatMessages 变化:', msgs.length, msgs)
  console.log('[AiChat] 消息详情:', msgs.map((m: any) => ({
    id: m.id,
    role: m.role,
    contentLength: m.content?.length || 0,
    contentPreview: m.content?.substring(0, 50) || '(empty)'
  })))
}, { deep: true })

// 监听 isLoading 的变化
watch(isLoading, (loading) => {
  console.log('[AiChat] isLoading 变化:', loading)
})

// 使用 computed 来获取消息，支持从 store 更新
const messages = computed(() => {
  // 始终返回 chatMessages，避免切换会话时显示空列表
  return chatMessages.value
})

// 复制到剪贴板
const copyToClipboard = async (content: string, messageId: string) => {
  try {
    await navigator.clipboard.writeText(content)
    copyFeedback.value = { messageId, show: true }
    setTimeout(() => {
      copyFeedback.value = { messageId: '', show: false }
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// 提交反馈
const submitFeedback = async (messageId: string, rating: 'thumbs_up' | 'thumbs_down') => {
  // 切换反馈状态（如果已经选择了相同的评分，则取消）
  const currentRating = messageFeedback.value.get(messageId)
  if (currentRating === rating) {
    messageFeedback.value.set(messageId, null)
  } else {
    messageFeedback.value.set(messageId, rating)
  }

  // TODO: 发送到后端 API
  // await $fetch('/api/chat/feedback', {
  //   method: 'POST',
  //   body: { messageId, rating }
  // })
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K: 打开/关闭聊天
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
  // Cmd/Ctrl + H: 打开/关闭侧边栏
  else if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
    e.preventDefault()
    if (isOpen.value) {
      sidebarOpen.value = !sidebarOpen.value
    }
  }
  // Escape: 关闭聊天和侧边栏
  else if (e.key === 'Escape') {
    if (sidebarOpen.value) {
      sidebarOpen.value = false
    } else if (isOpen.value) {
      isOpen.value = false
    }
  }
}

// 监听消息变化，自动滚动到底部
watch(messages, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}, { deep: true })

// 监听打开状态，打开时也滚动到底部
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
    // 打开时加载会话列表（如果还没有加载）
    if (chatStore.value && chatStore.value.sessions.length === 0) {
      // ⭐ 传入匿名用户 ID，确保只加载当前用户的会话
      chatStore.value.loadSessions('active', anonymousUserId.value)
    }
  } else {
    // 关闭时同时关闭侧边栏
    sidebarOpen.value = false
  }
})

// 创建新会话（清空当前会话，不立即创建新会话）
const handleNewChat = async () => {
  try {
    if (chatStore.value) {
      // 设置标志，阻止自动切换会话
      isCreatingNewChat.value = true

      // 清空当前会话，不立即创建新会话
      // 等到用户发送第一条消息时，API 会自动创建新会话并生成标题
      chatStore.value.clearCurrentSession()

      // 重置 currentSessionId
      currentSessionId.value = null

      // 清空 useChat 的消息
      setMessages([])

      // 清空输入
      input.value = ''

      console.log('[AiChat] 新对话已创建')

      // 延迟重置标志，确保所有异步操作完成
      setTimeout(() => {
        isCreatingNewChat.value = false
      }, 500)
    }
  } catch (error) {
    console.error('Failed to create new chat:', error)
    isCreatingNewChat.value = false
  }
}

// 切换会话
const handleSwitchSession = async (sessionId: number) => {
  try {
    if (chatStore.value) {
      // 如果正在创建新对话，阻止切换
      if (isCreatingNewChat.value) {
        console.log('[AiChat] 正在创建新对话，忽略会话切换')
        return
      }

      // 如果要切换的会话就是当前会话，跳过
      if (currentSessionId.value === sessionId) {
        console.log('[AiChat] 已经在当前会话，跳过切换')
        return
      }

      console.log('[AiChat] 切换会话到:', sessionId)

      // 清空输入
      input.value = ''

      // 切换 store 中的会话（这会触发 watch 自动同步消息）
      await chatStore.value.switchSession(sessionId)

      console.log('[AiChat] 会话切换完成')

      // 强制更新视图
      await nextTick()
    }
  } catch (error) {
    console.error('Failed to switch session:', error)
  }
}

// 生命周期钩子
onMounted(async () => {
  // 动态导入 Pinia store (Nuxt 3 方式)
  const { useChatStore } = await import('~/stores/chat')
  chatStore.value = useChatStore()

  // 监听 store 的 currentSession 变化
  watch(() => chatStore.value.currentSession, (session) => {
    const oldId = currentSessionId.value
    const newId = session?.id || null

    currentSessionId.value = newId

    console.log('[AiChat] currentSession 变化:', {
      oldId,
      newId,
      session
    })

    // 如果正在加载或发送消息，不要自动同步（避免覆盖当前消息）
    if (isLoading.value) {
      console.log('[AiChat] 正在发送消息，跳过自动同步')
      return
    }

    // 如果会话 ID 变化了，同步消息到 chatMessages
    if (newId !== oldId && newId !== null) {
      const sessionMessages = chatStore.value.messages.get(newId)
      if (sessionMessages && sessionMessages.length > 0) {
        console.log('[AiChat] 自动同步会话消息:', sessionMessages.length, '条')
        setMessages([...sessionMessages])
      }
    }
  }, { immediate: true })

  // 键盘事件监听
  window.addEventListener('keydown', handleKeydown)

  // 全局错误捕获
  window.addEventListener('error', (event) => {
    console.error('[AiChat] 全局错误:', event.error)
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[AiChat] 未处理的 Promise 错误:', event.reason)
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
    <!-- Chat Window -->
    <div
      v-if="isOpen"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      class="mb-4 w-[420px] max-w-[90vw] h-[650px] max-h-[85vh] bg-white dark:bg-zinc-950 border border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right"
    >
      <!-- Header with Swiss Grid Info -->
      <div class="p-4 bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-between items-center select-none border-b border-black dark:border-white relative overflow-hidden text-nowrap">
        <!-- Background Scanning Line (Header) -->
        <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 dark:via-white/5 to-transparent h-full w-full -translate-y-full animate-[scan_2s_linear_infinite]"></div>

        <div class="flex items-center gap-4">
          <!-- 侧边栏切换按钮 -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            aria-label="切换会话历史"
            :aria-expanded="sidebarOpen"
            class="hover:bg-black/5 dark:hover:bg-white/5 p-1.5 rounded transition-colors mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>

          <div class="flex flex-col">
            <span class="text-[9px] leading-none opacity-40 font-mono tracking-widest uppercase mb-1">Terminal v2.1.0</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-black dark:bg-white animate-pulse"></div>
              <span id="chat-title" class="font-bold tracking-tighter uppercase text-base italic">Supercore AI</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="hidden sm:flex flex-col items-end mr-4 font-mono text-[9px] opacity-40 uppercase">
            <span>Lat: 22.2988° N</span>
            <span>Lng: 114.1741° E</span>
          </div>
          <button
            @click="isOpen = false"
            aria-label="关闭聊天窗口"
            class="group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all p-2 border border-black dark:border-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" class="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Messages Area with Grid Pattern -->
      <div
        ref="scrollContainer"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="聊天消息"
        class="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-10 relative scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent bg-[#F5F5F7] dark:bg-black"
        style="overscroll-behavior: contain; background-image: radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 24px 24px;"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="mt-8 space-y-6 select-none relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-nowrap">
          <div class="w-12 h-0.5 bg-black dark:bg-white"></div>
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-4xl tracking-tighter text-black dark:text-white uppercase leading-[0.85]">
              Modular<br/>Intelligence.
            </h2>
            <!-- 新建会话按钮 -->
            <button
              v-if="chatStore.value?.hasCurrentSession"
              @click="handleNewChat"
              class="text-[9px] font-bold uppercase border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 px-3 py-2 hover:border-black dark:hover:border-white transition-all flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Chat
            </button>
          </div>
          <div class="space-y-4 max-w-[300px]">
            <p class="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed whitespace-normal text-wrap uppercase tracking-tight">
              System is operational. Provide parameters or specific queries regarding infrastructure solutions.
            </p>
            <div class="flex flex-wrap gap-2 pt-2">
              <button @click="input = '查看服務器產品規格'; handleSubmit($event as any)" class="text-[9px] font-bold uppercase border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 px-3 py-2 text-center hover:border-black dark:hover:border-white transition-all">Specs.</button>
              <button @click="input = '聯繫技術支持'; handleSubmit($event as any)" class="text-[9px] font-bold uppercase border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 px-3 py-2 text-center hover:border-black dark:hover:border-white transition-all">Support.</button>
            </div>
            <div class="pt-4 border-t border-black/10 dark:border-white/10">
              <p class="text-[9px] font-mono opacity-30 uppercase tracking-widest">
                Shortcuts: Cmd+K toggle, Cmd+H history
              </p>
            </div>
          </div>
        </div>

        <div v-for="m in messages" :key="m.id" class="flex flex-col animate-in fade-in duration-300">
          <div
            :class="[
              'p-5 text-sm max-w-[95%] relative group',
              m.role === 'user'
                ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white ml-auto border border-black/10 dark:border-white/10'
                : 'bg-white dark:bg-zinc-900 text-black dark:text-white border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] mr-auto'
            ]"
          >
            <!-- Message Header Identifier -->
            <div class="absolute -top-6 left-0 font-mono text-[8px] uppercase tracking-widest opacity-30 whitespace-nowrap">
              {{ m.role === 'user' ? 'USR_BLOCK' : 'SYS_OUTPUT' }} // {{ new Date().toLocaleTimeString() }}
            </div>

            <!-- 用户消息 -->
            <div v-if="m.role === 'user'" class="whitespace-pre-wrap font-medium tracking-tight text-zinc-700 dark:text-zinc-300">{{ m.content }}</div>
            <!-- AI 消息 -->
            <div
              v-else
              class="prose prose-sm dark:prose-invert max-w-none
                     prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-black dark:prose-headings:text-white
                     prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200
                     prose-pre:rounded-none prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-950 prose-pre:text-black dark:prose-pre:text-white prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10
                     prose-code:bg-zinc-100 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-none prose-code:before:content-none prose-code:after:content-none
                     prose-strong:font-black prose-strong:text-black dark:prose-strong:text-white
                     prose-table:border prose-table:border-black/20 dark:prose-table:border-white/20
                     prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-th:text-black dark:prose-th:text-white prose-th:p-2 prose-th:uppercase prose-th:text-[10px]"
              v-html="renderMarkdown(m.content)"
            />

            <!-- 操作栏（仅 AI 消息显示） -->
            <div
              v-if="m.role === 'assistant'"
              class="flex items-center gap-2 mt-3 pt-3 border-t border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <!-- 复制按钮 -->
              <button
                @click="copyToClipboard(m.content, m.id)"
                :aria-label="copyFeedback.messageId === m.id && copyFeedback.show ? '已复制' : '复制消息'"
                class="text-[9px] font-bold uppercase tracking-widest px-2 py-1 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-all flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                {{ copyFeedback.messageId === m.id && copyFeedback.show ? 'Copied' : 'Copy' }}
              </button>

              <!-- 反馈按钮 -->
              <div class="flex gap-1 ml-auto">
                <button
                  @click="submitFeedback(m.id, 'thumbs_up')"
                  :aria-label="messageFeedback.get(m.id) === 'thumbs_up' ? '已点赞' : '点赞'"
                  :class="messageFeedback.get(m.id) === 'thumbs_up' ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white'"
                  class="text-[9px] font-bold uppercase px-2 py-1 transition-all flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </button>
                <button
                  @click="submitFeedback(m.id, 'thumbs_down')"
                  :aria-label="messageFeedback.get(m.id) === 'thumbs_down' ? '已点踩' : '点踩'"
                  :class="messageFeedback.get(m.id) === 'thumbs_down' ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white'"
                  class="text-[9px] font-bold uppercase px-2 py-1 transition-all flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex flex-col gap-2 pt-4">
          <div class="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            <span class="inline-block w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 animate-ping"></span>
            <span>Fetching Data...</span>
          </div>
          <div class="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div class="h-full bg-black dark:bg-white w-1/4 animate-[loading_2s_infinite_linear]"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <form @submit.prevent="handleSubmit" class="p-6 bg-white dark:bg-zinc-950 border-t border-black dark:border-white relative z-10">
        <div class="relative flex flex-col gap-3">
          <div class="flex items-center justify-between px-1 text-[8px] font-bold uppercase tracking-widest opacity-30">
            <span>Terminal Input Ready</span>
            <span class="font-mono">{{ input.length }}/500</span>
          </div>
          <div class="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1">
            <div class="text-zinc-300 dark:text-zinc-700 font-mono text-sm leading-none">_</div>
            <input
              v-model="input"
              name="prompt"
              :aria-busy="isLoading"
              placeholder="Query system..."
              aria-label="输入您的消息"
              maxlength="500"
              class="flex-1 bg-transparent text-sm outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium tracking-tight"
            />
            <button
              type="submit"
              @click="() => console.log('[AiChat] 按钮被点击')"
              :disabled="isLoading || !input.trim()"
              :aria-label="isLoading ? '正在发送' : '发送消息'"
              class="group px-4 py-2 bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white transition-all disabled:opacity-5 disabled:grayscale flex items-center justify-center p-0"
            >
              <span class="text-[10px] font-bold uppercase mr-2 group-disabled:hidden">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Chat Sidebar -->
    <ChatSidebar
      :is-open="sidebarOpen"
      @close="sidebarOpen = false"
      @switch-session="handleSwitchSession"
      @create-new="handleNewChat"
    />

    <!-- Toggle Button -->
    <button
      @click="isOpen = !isOpen"
      :aria-label="isOpen ? '关闭 AI 助手' : '打开 AI 助手 (快捷键: Cmd/Ctrl+K)'"
      :aria-expanded="isOpen"
      aria-controls="chat-window"
      class="group relative w-16 h-16 bg-white dark:bg-zinc-950 text-black dark:text-white border-2 border-black dark:border-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-y-[2px] transition-all duration-300 flex items-center justify-center z-50 overflow-hidden"
    >
      <div class="relative w-full h-full flex flex-col items-center justify-center">
        <span
          class="transition-all duration-300 font-black tracking-tighter leading-none"
          :class="isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'"
        >
          <span class="text-xl block italic">AI</span>
          <span class="text-[8px] uppercase tracking-[0.2em] font-mono opacity-40">Active</span>
        </span>
        <span
          class="absolute transition-all duration-300 transform"
          :class="isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </span>
      </div>
    </button>
  </div>
</template>

<style scoped>
@keyframes scan {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* Custom scrollbar to match Swiss style */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #000;
}
.dark ::-webkit-scrollbar-thumb {
  background: #fff;
}
</style>
