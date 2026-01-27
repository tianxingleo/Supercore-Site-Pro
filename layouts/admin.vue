<template>
    <div class="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
        <!-- Admin Sidebar / Header -->
        <header class="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
            <div class="flex items-center space-x-4">
                <h1 class="text-xl font-bold tracking-tight">NEXUS <span class="text-[#0071e3]">Admin</span></h1>
            </div>
            <div class="flex items-center space-x-4">
                <button @click="handleLogout" class="text-sm text-gray-500 hover:text-[#0071e3] transition-colors">
                    Logout
                </button>
            </div>
        </header>

        <div class="flex">
            <!-- Sidebar -->
            <aside class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] p-6 hidden md:block">
                <nav class="space-y-1">
                    <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors" :class="[
                            route.path === item.path
                                ? 'bg-[#0071e3]/5 text-[#0071e3]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        ]">
                        {{ item.name }}
                    </NuxtLink>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 p-8">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()

const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'News', path: '/admin/news' },
    { name: 'Inquiries', path: '/admin/inquiries' },
    { name: 'Settings', path: '/admin/settings' },
]

async function handleLogout() {
    await client.auth.signOut()
    router.push('/admin/login')
}

// Protection - 简化的认证检查
const user = useSupabaseUser()

// 只在用户已登录或已确认未登录时才进行检查
// 避免 Supabase 初始化期间的误判
watch(() => user.value, (newValue) => {
    // 当 user 值确定后（不再是 undefined）才检查
    if (newValue !== undefined && !newValue && route.path !== '/admin/login') {
        navigateTo('/admin/login')
    }
})
</script>

<style scoped>
.font-sans {
    font-family: 'Inter', 'Noto Sans HK', sans-serif;
}
</style>
