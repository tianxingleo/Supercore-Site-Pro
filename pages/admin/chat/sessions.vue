<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ChatSession {
  id: number
  sessionId: string
  title: string
  language: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: Date
  updatedAt: Date
  messageCount?: number
}

const isLoading = ref(true)
const error = ref<string | null>(null)
const sessions = ref<ChatSession[]>([])
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'archived'>('all')
const currentPage = ref(1)
const pageSize = 20
const totalSessions = ref(0)

// 过滤后的会话
const filteredSessions = computed(() => {
  let filtered = sessions.value

  // 状态过滤
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(s => s.status === statusFilter.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.sessionId.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 分页后的会话
const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredSessions.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / pageSize)
})

// 格式化日期
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载会话列表
const loadSessions = async () => {
  try {
    isLoading.value = true
    error.value = null

    const response = await $fetch<any>('/api/chat/sessions', {
      params: { status: 'all' }
    })

    if (response.success) {
      sessions.value = response.data.sessions
      totalSessions.value = response.data.pagination.total
    }
  } catch (err: any) {
    console.error('Failed to load sessions:', err)
    error.value = err.message || 'Failed to load sessions'
  } finally {
    isLoading.value = false
  }
}

// 删除会话
const deleteSession = async (sessionId: number) => {
  if (!confirm('確定要刪除此會話嗎？此操作無法撤銷。')) return

  try {
    await $fetch(`/api/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      body: { hard: true }
    })

    // 从列表中移除
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
  } catch (err: any) {
    console.error('Failed to delete session:', err)
    alert('刪除失敗: ' + (err.message || 'Unknown error'))
  }
}

// 归档会话
const archiveSession = async (sessionId: number) => {
  try {
    await $fetch(`/api/chat/sessions/${sessionId}`, {
      method: 'PUT',
      body: { status: 'archived' }
    })

    // 更新本地状态
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.status = 'archived'
    }
  } catch (err: any) {
    console.error('Failed to archive session:', err)
    alert('歸檔失敗: ' + (err.message || 'Unknown error'))
  }
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 生命周期
onMounted(() => {
  loadSessions()
})

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <div class="space-y-12">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> Chat Sessions </TypographyHeader>
        <p class="text-swiss-text-muted">管理所有聊天会话</p>
      </div>
      <button
        @click="loadSessions"
        :disabled="isLoading"
        class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-swiss-text text-white hover:opacity-80 transition-all disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- 过滤器和搜索 -->
    <div class="bg-white border border-swiss-text/10 p-4 flex items-center gap-4">
      <!-- 状态过滤 -->
      <select
        v-model="statusFilter"
        class="px-3 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 bg-white outline-none"
      >
        <option value="all">全部状态</option>
        <option value="active">活跃</option>
        <option value="archived">已归档</option>
      </select>

      <!-- 搜索框 -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索会话标题或 ID..."
        class="flex-1 px-3 py-2 text-sm border border-swiss-text/20 bg-white outline-none focus:border-swiss-text"
      />

      <!-- 结果计数 -->
      <div class="text-[9px] font-mono text-swiss-text-muted">
        {{ filteredSessions.length }} / {{ totalSessions }} sessions
      </div>
    </div>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm"
    >
      {{ error }}
    </div>

    <!-- 会话列表 -->
    <div v-if="!isLoading && !error" class="bg-white border border-swiss-text/10 overflow-hidden">
      <table class="w-full">
        <thead class="bg-swiss-bg-soft border-b border-swiss-text/10">
          <tr>
            <th class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              ID
            </th>
            <th class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              Title
            </th>
            <th class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              Language
            </th>
            <th class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              Status
            </th>
            <th class="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              Created At
            </th>
            <th class="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-swiss-text/10">
          <tr
            v-for="session in paginatedSessions"
            :key="session.id"
            class="hover:bg-swiss-bg-soft transition-colors"
          >
            <td class="px-6 py-4 text-sm font-mono text-swiss-text-muted">
              #{{ session.id }}
            </td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/admin/chat/sessions/${session.id}`"
                class="text-sm font-medium hover:underline"
              >
                {{ session.title }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 text-sm text-swiss-text-muted">
              {{ session.language }}
            </td>
            <td class="px-6 py-4">
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
            </td>
            <td class="px-6 py-4 text-sm text-swiss-text-muted">
              {{ formatDate(session.createdAt) }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <!-- 查看详情 -->
                <NuxtLink
                  :to="`/admin/chat/sessions/${session.id}`"
                  class="p-1 text-swiss-text-muted hover:text-swiss-text transition-colors"
                  title="查看详情"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </NuxtLink>

                <!-- 归档 -->
                <button
                  v-if="session.status === 'active'"
                  @click="archiveSession(session.id)"
                  class="p-1 text-swiss-text-muted hover:text-swiss-text transition-colors"
                  title="归档"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>

                <!-- 删除 -->
                <button
                  @click="deleteSession(session.id)"
                  class="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 空状态 -->
      <div
        v-if="paginatedSessions.length === 0"
        class="p-12 text-center text-swiss-text-muted"
      >
        <p class="text-sm">没有找到会话</p>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!isLoading && !error && totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-swiss-text-muted">
        第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-swiss-text/20 hover:border-swiss-text transition-all disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-swiss-text border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted">
          Loading sessions...
        </p>
      </div>
    </div>
  </div>
</template>
