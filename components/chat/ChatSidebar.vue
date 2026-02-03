<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface ChatSession {
  id: number
  sessionId: string
  title: string
  language: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'switchSession', sessionId: number): void
  (e: 'createNew'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 延迟初始化 store
const chatStore = ref<any>(null)
const searchQuery = ref('')

// 计算属性：过滤后的会话列表
const filteredSessions = computed(() => {
  if (!chatStore.value) return []
  if (!searchQuery.value) {
    return chatStore.value.activeSessions || []
  }
  const query = searchQuery.value.toLowerCase()
  return (chatStore.value.activeSessions || []).filter((session: ChatSession) =>
    session.title.toLowerCase().includes(query)
  )
})

// 创建新会话
const handleCreateSession = async () => {
  try {
    if (chatStore.value) {
      // 清空当前会话，不立即创建新会话
      chatStore.value.clearCurrentSession()
      emit('createNew')
      emit('close')
    }
  } catch (error) {
    console.error('Failed to create session:', error)
  }
}

// 切换会话
const handleSelectSession = async (sessionId: number) => {
  try {
    if (chatStore.value) {
      await chatStore.value.switchSession(sessionId)
      emit('switchSession', sessionId)
      emit('close')
    }
  } catch (error) {
    console.error('Failed to switch session:', error)
  }
}

// 删除会话
const handleDeleteSession = async (sessionId: number, event: Event) => {
  event.stopPropagation() // 防止触发切换会话

  if (!confirm('確定要刪除此對話嗎？')) return

  try {
    if (chatStore.value) {
      await chatStore.value.deleteSession(sessionId, true)
    }
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}

// 格式化日期（支持字符串和 Date 对象）
const formatDate = (date: Date | string) => {
  // 确保传入的是 Date 对象
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - dateObj.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return dateObj.toLocaleDateString('zh-HK')
}

// 组件挂载时初始化 store 并加载会话列表
onMounted(async () => {
  // 动态导入 Pinia store (Nuxt 3 方式)
  const { useChatStore } = await import('~/stores/chat')
  chatStore.value = useChatStore()

  console.log('[ChatSidebar] store 已初始化:', chatStore.value)

  // 加载会话列表
  await chatStore.value.loadSessions()

  console.log('[ChatSidebar] filteredSessions 长度:', filteredSessions.value.length)
})
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-y-0 left-0 w-80 bg-white dark:bg-zinc-950 border-r border-black dark:border-white shadow-2xl z-50 flex flex-col"
  >
    <!-- Header -->
    <div class="p-4 border-b border-black/10 dark:border-white/10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold tracking-tighter uppercase text-sm">History</h2>
        <button
          @click="emit('close')"
          aria-label="关闭侧边栏"
          class="hover:bg-black/5 dark:hover:bg-white/5 p-1 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 新建会话按钮 -->
      <button
        @click="handleCreateSession"
        class="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Chat
      </button>

      <!-- 搜索框 -->
      <div class="mt-3 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索会话..."
          aria-label="搜索会话"
          class="w-full px-3 py-2 pl-9 text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-black dark:focus:border-white outline-none transition-all placeholder:text-zinc-400"
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <!-- Session List -->
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="chatStore.isLoading && filteredSessions.length === 0" class="flex items-center justify-center py-8">
        <div class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loading...</div>
      </div>

      <div v-else-if="filteredSessions.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">No conversations yet</p>
        <button
          @click="handleCreateSession"
          class="text-[9px] font-bold uppercase text-black dark:text-white underline"
        >
          Start a new chat
        </button>
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          @click="handleSelectSession(session.id)"
          class="group relative p-3 rounded-lg cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900"
          :class="{
            'bg-zinc-100 dark:bg-zinc-900': chatStore.currentSession?.id === session.id
          }"
        >
          <!-- 会话标题 -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium truncate">
                {{ session.title }}
              </h3>
              <p class="text-[9px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                {{ formatDate(session.createdAt) }}
              </p>
            </div>

            <!-- 删除按钮（hover 显示） -->
            <button
              @click="handleDeleteSession(session.id, $event)"
              aria-label="删除会话"
              class="opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white text-zinc-400 dark:text-zinc-500 p-1 rounded transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-black/10 dark:border-white/10">
      <div class="flex items-center justify-between text-[8px] font-mono opacity-30">
        <span>{{ chatStore.activeSessions.length }} sessions</span>
        <span>Supercore AI v2.1</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 2px;
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #fff;
}
</style>
