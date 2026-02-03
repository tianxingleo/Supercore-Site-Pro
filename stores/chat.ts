// stores/chat.ts
import { defineStore } from 'pinia'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt?: Date
}

export interface ChatSession {
  id: number
  sessionId: string
  title: string
  language: string
  status: 'active' | 'archived' | 'deleted'
  createdAt: Date
  updatedAt: Date
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    currentSession: null as ChatSession | null,
    sessions: [] as ChatSession[],
    messages: new Map<number, ChatMessage[]>(),
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    // 获取当前会话的消息
    currentMessages: (state) => {
      if (!state.currentSession) return []
      return state.messages.get(state.currentSession.id) || []
    },

    // 获取活跃的会话列表
    activeSessions: (state) => {
      return state.sessions.filter(s => s.status === 'active')
    },

    // 检查是否有当前会话
    hasCurrentSession: (state) => {
      return state.currentSession !== null
    }
  },

  actions: {
    /**
     * 加载会话列表
     */
    async loadSessions(status: 'active' | 'archived' | 'all' = 'active', anonymousUserId?: string) {
      try {
        this.isLoading = true
        this.error = null

        console.log('[ChatStore] 正在加载会话列表...', { anonymousUserId })

        const response = await $fetch<any>('/api/chat/sessions', {
          method: 'GET',
          params: { status, anonymousUserId }
        })

        console.log('[ChatStore] 会话列表响应:', response)
        console.log('[ChatStore] response.data.sessions:', response.data?.sessions)

        if (response.success) {
          this.sessions = response.data.sessions
          console.log('[ChatStore] 已加载会话列表，共', this.sessions.length, '个会话')
          console.log('[ChatStore] 会话详情:', this.sessions)
          console.log('[ChatStore] activeSessions:', this.activeSessions)
        }
      } catch (error: any) {
        console.error('Failed to load sessions:', error)
        this.error = error.message || 'Failed to load sessions'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 创建新会话
     */
    async createSession(title?: string, language = 'zh-HK') {
      try {
        this.isLoading = true
        this.error = null

        const response = await $fetch<any>('/api/chat/sessions', {
          method: 'POST',
          body: { title, language }
        })

        if (response.success) {
          const newSession: ChatSession = {
            id: response.data.id,
            sessionId: response.data.sessionId,
            title: response.data.title,
            language: response.data.language,
            status: response.data.status,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt)
          }

          // 添加到会话列表
          this.sessions.unshift(newSession)

          // 设置为当前会话
          this.currentSession = newSession

          // 初始化消息列表
          this.messages.set(newSession.id, [])

          return newSession
        }
      } catch (error: any) {
        console.error('Failed to create session:', error)
        this.error = error.message || 'Failed to create session'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 切换到指定会话
     */
    async switchSession(sessionId: number) {
      try {
        this.isLoading = true
        this.error = null

        const response = await $fetch<any>(`/api/chat/sessions/${sessionId}`)

        if (response.success) {
          const session: ChatSession = {
            id: response.data.session.id,
            sessionId: response.data.session.sessionId,
            title: response.data.session.title,
            language: response.data.session.language,
            status: response.data.session.status,
            createdAt: response.data.session.createdAt, // API 已经转换为 Date
            updatedAt: response.data.session.updatedAt
          }

          this.currentSession = session

          // 加载消息（API 已经转换了日期）
          const messages: ChatMessage[] = response.data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt
          }))

          this.messages.set(sessionId, messages)
        }
      } catch (error: any) {
        console.error('Failed to switch session:', error)
        this.error = error.message || 'Failed to switch session'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 更新当前会话的消息列表（用于流式响应）
     */
    updateCurrentMessages(messages: ChatMessage[]) {
      if (!this.currentSession) return

      this.messages.set(this.currentSession.id, messages)
    },

    /**
     * 添加单条消息到当前会话
     */
    addMessageToCurrent(message: ChatMessage) {
      if (!this.currentSession) return

      const currentMessages = this.messages.get(this.currentSession.id) || []
      this.messages.set(this.currentSession.id, [...currentMessages, message])
    },

    /**
     * 删除会话
     */
    async deleteSession(sessionId: number, hard = false) {
      try {
        this.isLoading = true
        this.error = null

        await $fetch(`/api/chat/sessions/${sessionId}`, {
          method: 'DELETE',
          body: { hard }
        })

        // 从列表中移除
        this.sessions = this.sessions.filter(s => s.id !== sessionId)

        // 清除消息
        this.messages.delete(sessionId)

        // 如果删除的是当前会话，清空当前会话
        if (this.currentSession?.id === sessionId) {
          this.currentSession = null
        }
      } catch (error: any) {
        console.error('Failed to delete session:', error)
        this.error = error.message || 'Failed to delete session'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 更新会话标题
     */
    async updateSessionTitle(sessionId: number, title: string) {
      try {
        this.isLoading = true
        this.error = null

        await $fetch(`/api/chat/sessions/${sessionId}`, {
          method: 'PUT',
          body: { title }
        })

        // 更新本地状态
        const session = this.sessions.find(s => s.id === sessionId)
        if (session) {
          session.title = title
        }
      } catch (error: any) {
        console.error('Failed to update session:', error)
        this.error = error.message || 'Failed to update session'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 清空当前会话（不删除）
     */
    clearCurrentSession() {
      console.log('[ChatStore] 清空当前会话，之前:', this.currentSession)
      this.currentSession = null
      console.log('[ChatStore] 清空当前会话，之后:', this.currentSession)
    }
  }
})
