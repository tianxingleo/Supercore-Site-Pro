<template>
  <div class="min-h-screen flex items-center justify-center bg-swiss-bg p-4 text-swiss-text">
    <div class="w-full max-w-md bg-white p-8 md:p-12 border border-swiss-text/10">
      <div class="mb-12 text-center">
        <TypographyHeader :level="1" size="h2" class="!mb-4 !text-center"> SUPERCORE </TypographyHeader>
        <p class="text-swiss-text-muted text-[10px] uppercase tracking-widest">管理系統登錄</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-8">
        <div>
          <label
            class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2"
          >
            電郵地址
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="admin@supercore.hk"
          />
        </div>

        <div>
          <label
            class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2"
          >
            密碼
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div
          v-if="error"
          class="text-swiss-text text-[10px] uppercase tracking-widest border border-red-200 bg-red-50 p-4"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-swiss-text text-white py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors disabled:opacity-50"
        >
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
const user = useSupabaseUser()

// If already logged in, redirect
onMounted(() => {
  if (user.value) {
    router.push('/admin')
  }
})

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
