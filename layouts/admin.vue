<template>
  <div class="min-h-screen bg-swiss-bg text-swiss-text font-sans">
    <!-- Admin Sidebar / Header -->
    <header
      class="bg-white border-b border-swiss-text/10 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold tracking-tight">
          NEXUS <span class="text-swiss-text">Admin</span>
        </h1>
      </div>
      <div class="flex items-center gap-4 flex-1 max-w-md mx-4">
        <!-- Global Search -->
        <GlobalSearch class="flex-1" />
      </div>
      <div class="flex items-center space-x-4">
        <button @click="handleLogout"
          class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted hover:text-swiss-text transition-colors">
          Logout
        </button>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-swiss-text/10 min-h-[calc(100vh-65px)] p-6 hidden md:block">
        <nav class="space-y-0">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
            class="flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
            :class="[
              route.path === item.path
                ? 'bg-swiss-text text-white'
                : 'text-swiss-text-muted hover:bg-swiss-text/5 hover:text-swiss-text',
            ]">
            {{ item.name }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-8 lg:p-12">
        <slot />
      </main>
    </div>

    <!-- 开发工具 (仅在管理后台显示) -->
    <PerformancePanel v-if="isDev" :metrics="performanceMetrics" :is-dev="isDev" />
    <ErrorLogViewer v-if="isDev" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerformanceMonitor } from '~/composables/usePerformanceMonitor'

const route = useRoute()
const router = useRouter()
const client = useSupabaseClient()

const navItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Products', path: '/admin/products' },
  { name: 'News', path: '/admin/news' },
  { name: 'Inquiries', path: '/admin/inquiries' },
  { name: 'Logs', path: '/admin/logs' },
  // { name: 'Settings', path: '/admin/settings' }, // TODO: Create settings page
]

async function handleLogout() {
  await client.auth.signOut()
  router.push('/admin/login')
}

// 开发模式检测
const isDev = import.meta.env.DEV

// 性能监控
const { metrics: performanceMetrics } = usePerformanceMonitor()

// Protection - 简化的认证检查
const user = useSupabaseUser()

// 只在用户已登录或已确认未登录时才进行检查
// 避免 Supabase 初始化期间的误判
watch(
  () => user.value,
  (newValue) => {
    // 当 user 值确定后（不再是 undefined）才检查
    if (newValue !== undefined && !newValue && route.path !== '/admin/login') {
      navigateTo('/admin/login')
    }
  }
)
</script>

<style scoped>
.font-sans {
  font-family: 'Inter', 'Noto Sans HK', sans-serif;
}
</style>
