<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4 text-[#1D1D1F]">
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div class="mb-10 text-center">
                <h1 class="text-3xl font-bold tracking-tight mb-2">NEXUS</h1>
                <p class="text-gray-500 text-sm">管理系統登錄</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">電郵地址</label>
                    <input v-model="email" type="email" required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                        placeholder="admin@nexus.hk">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">密碼</label>
                    <input v-model="password" type="password" required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                        placeholder="••••••••">
                </div>

                <div v-if="error" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {{ error }}
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-[#1D1D1F] text-white py-3 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50">
                    {{ loading ? '登錄中...' : '提交' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
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
            password: password.value
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
