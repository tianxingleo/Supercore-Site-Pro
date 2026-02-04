<template>
  <div class="min-h-screen flex items-center justify-center bg-swiss-bg p-4 text-swiss-text">
    <div class="w-full max-w-md bg-white p-8 md:p-12 border border-swiss-text/10">
      <div class="mb-12 text-center">
        <TypographyHeader :level="1" size="h2" class="!mb-4 !text-center"> SUPERCORE </TypographyHeader>
        <p class="text-swiss-text-muted text-[10px] uppercase tracking-widest">管理系統登錄</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-8 relative">
        <!-- Magic Login Overlay -->
        <div v-if="loading && (route.query.test === '' || route.query.test === 'true')"
          class="absolute inset-x-[-1rem] inset-y-[-1rem] bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center border border-black animate-in fade-in zoom-in duration-300">
          <div class="w-12 h-12 border-4 border-black border-t-transparent animate-spin mb-4"></div>
          <p class="font-black italic tracking-tighter uppercase text-lg">Activating Magic Login</p>
          <p class="text-[10px] uppercase opacity-40 mt-2 tracking-widest leading-relaxed">
            Initializing system bypass...<br>Generating secure session...
          </p>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
            電郵地址
          </label>
          <input v-model="email" type="email" required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="admin@supercore.hk" />
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
            密碼
          </label>
          <input v-model="password" type="password" required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="••••••••" />
        </div>

        <div v-if="error"
          class="text-swiss-text text-[10px] uppercase tracking-widest border border-red-200 bg-red-50 p-4">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-swiss-text text-white py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors disabled:opacity-50">
          {{ loading ? '登錄中...' : '提交' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const client = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const user = useSupabaseUser()

// If already logged in, redirect
onMounted(async () => {
  console.log('[Login] Mounted. Query:', route.query, 'Hash present:', !!window.location.hash)

  if (user.value) {
    console.log('[Login] 用户已存在，跳转中...')
    router.push('/admin')
    return
  }

  // 立即检查一次魔法参数
  checkMagicParam()
})

// ⭐ 关键：持续观察用户状态变化
// 魔法链接跳转回来后，Supabase 会在后台异步解析 hash 并注入 user
watch(user, (newUser) => {
  if (newUser) {
    console.log('[Login] 检测到 Session 注入成功，正在进入管理后台...')
    // 清理 URL hash 避免路由警告
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    router.push('/admin')
  }
}, { immediate: true })

// 监听路由参数，确保在任何时候输入 ?test 都能触发
watch(() => route.query.test, () => {
  checkMagicParam()
})

function checkMagicParam() {
  const searchParams = new URLSearchParams(window.location.search)
  const hasTest = searchParams.has('test') || route.query.test === '' || route.query.test === 'true'

  console.log('[Login] Checking Magic Param:', {
    query: route.query,
    search: window.location.search,
    hasTest
  })

  if (hasTest) {
    console.log('[Login] 命中魔法参数 !')
    handleMagicLogin()
  }
}

async function handleMagicLogin() {
  if (loading.value) return // 防止重复触发
  loading.value = true
  error.value = ''
  console.log('[Login] 魔法检测：正在执行“真正”的免密登录绕过...')

  try {
    // 调用后端 API 获取免密登录账号凭据
    const response = await $fetch<{ email: string, password: string }>('/api/auth/test-login', {
      method: 'POST',
      query: { test: 'true' }
    })

    if (response.email && response.password) {
      console.log('[Login] 魔法凭据获取成功，正在通过静默账号登录...')

      const { error: authError } = await client.auth.signInWithPassword({
        email: response.email,
        password: response.password
      })

      if (authError) throw authError

      console.log('[Login] 登录成功，正在进入管理后台...')
      router.push('/admin')
    } else {
      throw new Error('未能生成魔法凭据')
    }
  } catch (e: any) {
    console.error('[Login] 魔法登录失败:', e)
    error.value = '免密登录失败: ' + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
}

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) throw authError

    router.push('/admin')
  } catch (e: any) {
    error.value = e.message || '登錄失敗'
  } finally {
    loading.value = false
  }
}
</script>
