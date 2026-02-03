<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSafeMarkdown } from '~/composables/useSafeMarkdown'

const { renderMarkdown } = useSafeMarkdown()

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  metadata?: any
}

interface ChatSession {
  id: number
  sessionId: string
  title: string
  language: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref<string | null>(null)
const session = ref<ChatSession | null>(null)
const messages = ref<ChatMessage[]>([])

// 格式化日期
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 加载会话详情
const loadSession = async () => {
  try {
    isLoading.value = true
    error.value = null

    const sessionId = Number(route.params.id)
    if (isNaN(sessionId)) {
      throw new Error('Invalid session ID')
    }

    const response = await $fetch<any>(`/api/chat/sessions/${sessionId}`)

    if (response.success) {
      session.value = response.data.session
      messages.value = response.data.messages
    }
  } catch (err: any) {
    console.error('Failed to load session:', err)
    error.value = err.message || 'Failed to load session'
  } finally {
    isLoading.value = false
  }
}

// 导出对话
const exportConversation = (format: 'json' | 'txt') => {
  if (!session.value) return

  const data = {
    session: session.value,
    messages: messages.value
  }

  if (format === 'json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-session-${session.value.id}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === 'txt') {
    let text = `会话: ${session.value.title}\n`
    text += `会话 ID: ${session.value.sessionId}\n`
    text += `创建时间: ${formatDate(session.value.createdAt)}\n`
    text += `语言: ${session.value.language}\n`
    text += `\n${'='.repeat(50)}\n\n`

    messages.value.forEach(msg => {
      text += `[${msg.role.toUpperCase()}] - ${formatDate(msg.createdAt)}\n`
      text += `${msg.content}\n\n`
    })

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-session-${session.value.id}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 返回列表
const goBack = () => {
  router.push('/admin/chat/sessions')
}

// 生命周期
onMounted(() => {
  loadSession()
})

// 监听路由参数变化
watch(() => route.params.id, () => {
  loadSession()
})

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <div class="space-y-12">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="goBack"
          class="p-2 hover:bg-swiss-text/5 transition-colors"
          title="返回列表"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <TypographyHeader :level="2" size="h2" class="mb-4"> Session Details </TypographyHeader>
          <p v-if="session" class="text-swiss-text-muted">
            {{ session.title }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- 导出按钮 -->
        <button
          v-if="session"
          @click="exportConversation('json')"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all"
        >
          Export JSON
        </button>
        <button
          v-if="session"
          @click="exportConversation('txt')"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all"
        >
          Export TXT
        </button>
        <!-- 刷新按钮 -->
        <button
          @click="loadSession"
          :disabled="isLoading"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-swiss-text text-white hover:opacity-80 transition-all disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm"
    >
      {{ error }}
    </div>

    <!-- 会话信息 -->
    <div v-if="!isLoading && !error && session" class="bg-white border border-swiss-text/10 p-6">
      <h2 class="text-lg font-bold tracking-tight mb-4">会话信息</h2>
      <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Session ID
          </dt>
          <dd class="font-mono mt-1">{{ session.sessionId }}</dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Title
          </dt>
          <dd class="mt-1">{{ session.title }}</dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Language
          </dt>
          <dd class="mt-1">{{ session.language }}</dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Status
          </dt>
          <dd class="mt-1">
            <span
              class="px-2 py-1 text-[9px] font-bold uppercase rounded-sm"
              :class="{
                'bg-green-100 text-green-800': session.status === 'active',
                'bg-zinc-100 text-zinc-800': session.status === 'archived',
                'bg-red-100 text-red-800': session.status === 'deleted'
              }"
            >
              {{ session.status }}
            </span>
          </dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Created At
          </dt>
          <dd class="mt-1">{{ formatDate(session.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Updated At
          </dt>
          <dd class="mt-1">{{ formatDate(session.updatedAt) }}</dd>
        </div>
        <div>
          <dt class="text-[9px] font-bold uppercase tracking-widest text-swiss-text-muted">
            Total Messages
          </dt>
          <dd class="mt-1">{{ messages.length }}</dd>
        </div>
      </dl>
    </div>

    <!-- 对话历史 -->
    <div v-if="!isLoading && !error && session" class="bg-white border border-swiss-text/10 overflow-hidden">
      <div class="p-4 border-b border-swiss-text/10">
        <h2 class="text-lg font-bold tracking-tight">对话历史</h2>
      </div>

      <div v-if="messages.length === 0" class="p-12 text-center text-swiss-text-muted">
        <p class="text-sm">暂无消息</p>
      </div>

      <div v-else class="divide-y divide-swiss-text/10">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="p-6"
          :class="{
            'bg-swiss-text/5': msg.role === 'user',
            'bg-white': msg.role === 'assistant'
          }"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-1 text-[9px] font-bold uppercase rounded-sm"
                :class="{
                  'bg-blue-100 text-blue-800': msg.role === 'user',
                  'bg-green-100 text-green-800': msg.role === 'assistant',
                  'bg-zinc-100 text-zinc-800': msg.role === 'system'
                }"
              >
                {{ msg.role }}
              </span>
              <span class="text-xs text-swiss-text-muted font-mono">
                {{ formatDate(msg.createdAt) }}
              </span>
            </div>
            <span class="text-xs text-swiss-text-muted font-mono">
              ID: {{ msg.id }}
            </span>
          </div>

          <!-- 消息内容 -->
          <div class="mt-4">
            <div
              v-if="msg.role === 'user'"
              class="whitespace-pre-wrap text-sm"
            >
              {{ msg.content }}
            </div>
            <div
              v-else
              class="prose prose-sm max-w-none"
              v-html="renderMarkdown(msg.content)"
            />
          </div>

          <!-- 元数据 -->
          <div v-if="msg.metadata && Object.keys(msg.metadata).length > 0" class="mt-4 pt-4 border-t border-swiss-text/10">
            <details class="text-xs">
              <summary class="cursor-pointer text-swiss-text-muted hover:text-swiss-text transition-colors">
                Metadata
              </summary>
              <pre class="mt-2 p-2 bg-swiss-text/5 rounded text-xs overflow-x-auto">{{ JSON.stringify(msg.metadata, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-swiss-text border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
          Loading session...
        </p>
      </div>
    </div>
  </div>
</template>
