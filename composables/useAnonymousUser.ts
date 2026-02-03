// composables/useAnonymousUser.ts
/**
 * 匿名用户 ID 管理
 * 用于在没有登录系统的情况下，隔离不同用户的数据
 */

const ANONYMOUS_USER_ID_KEY = 'anonymous_user_id'
const ANONYMOUS_USER_ID_LENGTH = 16

export function useAnonymousUser() {
  // 获取或生成匿名用户 ID
  const getAnonymousUserId = (): string => {
    if (import.meta.client) {
      let userId = localStorage.getItem(ANONYMOUS_USER_ID_KEY)

      if (!userId) {
        // 生成新的匿名 ID
        userId = generateAnonymousId()
        localStorage.setItem(ANONYMOUS_USER_ID_KEY, userId)
        console.log('[AnonymousUser] 生成新的匿名用户 ID:', userId)
      } else {
        console.log('[AnonymousUser] 使用已存在的匿名用户 ID:', userId)
      }

      return userId
    }

    // 服务端生成临时 ID
    return generateAnonymousId()
  }

  // 生成随机匿名 ID
  const generateAnonymousId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < ANONYMOUS_USER_ID_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return 'anon_' + result
  }

  // 重置匿名 ID（用于测试或清除数据）
  const resetAnonymousUserId = () => {
    if (import.meta.client) {
      localStorage.removeItem(ANONYMOUS_USER_ID_KEY)
      console.log('[AnonymousUser] 已重置匿名用户 ID')
    }
  }

  return {
    getAnonymousUserId,
    resetAnonymousUserId
  }
}
