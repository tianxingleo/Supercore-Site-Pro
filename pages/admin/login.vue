<template>
  <!-- 登录页面容器 -->
  <!-- min-h-screen：最小高度为全屏高度 -->
  <!-- flex items-center justify-center：内容居中对齐 -->
  <!-- bg-swiss-bg：瑞士风格背景色 -->
  <!-- p-4：外边距 4 单位（1rem，16px） -->
  <!-- text-swiss-text：主文本颜色 -->
  <div class="min-h-screen flex items-center justify-center bg-swiss-bg p-4 text-swiss-text">
    <!-- 登录卡片 -->
    <!-- w-full max-w-md：宽度 100%，最大宽度中等（md：28rem，448px） -->
    <!-- bg-white：白色背景 -->
    <!-- p-8 md:p-12：内边距（移动端 8，桌面端 12） -->
    <!-- border border-swiss-text/10：浅灰色边框（10% 不透明度） -->
    <div class="w-full max-w-md bg-white p-8 md:p-12 border border-swiss-text/10">
      <!-- 标题区域 -->
      <!-- mb-12：底部边距 12 单位 -->
      <!-- text-center：文本居中对齐 -->
      <div class="mb-12 text-center">
        <!-- 品牌标题 -->
        <!-- TypographyHeader：瑞士风格标题组件 -->
        <!-- :level="1"：语义化级别，对应 h1 -->
        <!-- size="h2"：视觉尺寸为 h2 -->
        <!-- class="!mb-4 !text-center"：底部边距 4，文本居中（! 优先级提升） -->
        <TypographyHeader :level="1" size="h2" class="!mb-4 !text-center">
          SUPERCORE
        </TypographyHeader>
        <!-- 副标题 -->
        <!-- text-swiss-text-muted：次要文本颜色 -->
        <!-- text-[10px]：极小字体（10px） -->
        <!-- uppercase：全大写 -->
        <!-- tracking-widest：最大字母间距 -->
        <p class="text-swiss-text-muted text-[10px] uppercase tracking-widest">管理系統登錄</p>
      </div>

      <!-- 登录表单 -->
      <!-- @submit.prevent="handleLogin"：提交时调用 handleLogin 函数，阻止默认提交行为 -->
      <!-- space-y-8：子元素之间间距 8 单位 -->
      <form @submit.prevent="handleLogin" class="space-y-8">
        <!-- 邮箱输入框 -->
        <div>
          <!-- 标签 -->
          <!-- block：块级元素 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- mb-2：底部边距 2 单位 -->
          <label
            class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2"
          >
            電郵地址
          </label>
          <!-- 邮箱输入框 -->
          <!-- v-model="email"：双向绑定到 email ref -->
          <!-- type="email"：邮箱输入类型（浏览器提供验证和优化输入法） -->
          <!-- required：必填字段 -->
          <!-- class：样式 -->
          <!--   - w-full：宽度 100% -->
          <!--   - px-4 py-3：内边距（水平 4，垂直 3） -->
          <!--   - bg-swiss-bg：瑞士风格背景色 -->
          <!--   - border border-swiss-text/10：浅灰色边框 -->
          <!--   - text-swiss-text：主文本颜色 -->
          <!--   - text-sm：小号字体 -->
          <!--   - focus:outline-none：聚焦时移除默认轮廓 -->
          <!--   - focus:border-swiss-text：聚焦时边框变为主文本颜色 -->
          <!--   - transition-colors：平滑颜色过渡 -->
          <!-- placeholder="admin@supercore.hk"：占位符文本 -->
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="admin@supercore.hk"
          />
        </div>

        <!-- 密码输入框 -->
        <div>
          <!-- 标签 -->
          <!-- 样式同邮箱标签 -->
          <label
            class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2"
          >
            密碼
          </label>
          <!-- 密码输入框 -->
          <!-- v-model="password"：双向绑定到 password ref -->
          <!-- type="password"：密码输入类型（输入内容隐藏为 •••） -->
          <!-- required：必填字段 -->
          <!-- class：样式同邮箱输入框 -->
          <!-- placeholder="•••••••"：占位符文本（点号） -->
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text transition-colors"
            placeholder="•••••••"
          />
        </div>

        <!-- 错误消息 -->
        <!-- v-if="error"：有错误时才显示 -->
        <!-- class：样式 -->
        <!--   - text-swiss-text：主文本颜色 -->
        <!--   - text-[10px]：极小字体 -->
        <!--   - uppercase：全大写 -->
        <!--   - tracking-widest：最大字母间距 -->
        <!--   - border border-red-200：红色边框 -->
        <!--   - bg-red-50：浅红色背景 -->
        <!--   - p-4：内边距 4 单位 -->
        <div
          v-if="error"
          class="text-swiss-text text-[10px] uppercase tracking-widest border border-red-200 bg-red-50 p-4"
        >
          <!-- 错误消息文本 -->
          {{ error }}
        </div>

        <!-- 提交按钮 -->
        <!-- type="submit"：提交按钮 -->
        <!-- :disabled="loading"：加载中时禁用按钮 -->
        <!-- class：样式 -->
        <!--   - w-full：宽度 100% -->
        <!--   - bg-swiss-text：主文本颜色背景 -->
        <!--   - text-white：白色文本 -->
        <!--   - py-4：内边距（垂直 4 单位） -->
        <!--   - font-bold：字重加粗 -->
        <!--   - uppercase：全大写 -->
        <!--   - tracking-widest：最大字母间距 -->
        <!--   - text-[10px]：极小字体 -->
        <!--   - hover:bg-black：悬停时变为黑色背景 -->
        <!--   - transition-colors：平滑颜色过渡 -->
        <!--   - disabled:opacity-50：禁用时 50% 不透明度 -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-swiss-text text-white py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors disabled:opacity-50"
        >
          <!-- 根据加载状态显示不同文本 -->
          {{ loading ? '登錄中...' : '提交' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：管理员登录页面 (Admin Login Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的管理员登录页面，用于管理员登录系统。
 *
 * 页面路由：/admin/login
 *
 * 功能说明：
 * 1. 登录表单：邮箱和密码输入
 * 2. 表单验证：使用 HTML5 原生验证（required、type="email"）
 * 3. 登录处理：使用 Supabase Auth 进行身份验证
 * 4. 错误处理：显示登录错误消息
 * 5. 加载状态：登录过程中显示"登錄中..."
 * 6. 已登录重定向：如果用户已登录，自动跳转到 /admin
 * 7. 无布局：不使用默认布局（definePageMeta({ layout: false })）
 *
 * 瑞士设计特点：
 * - 极简主义 (Minimalism)：简洁的 UI，只包含必要元素
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 网格布局 (Grid System)：表单元素垂直对齐
 * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
 * - 大量留白 (Whitespace)：充足的呼吸空间
 *
 * 安全性：
 * - 使用 Supabase Auth：安全的身份验证服务
 * - 密码隐藏：type="password"，输入内容不显示
 * - 表单验证：HTML5 原生验证（required、type="email"）
 * - 错误消息：显示具体的登录错误信息
 * - 加载状态：防止重复提交
 *
 * Supabase Auth 工作流程：
 * 1. 用户输入邮箱和密码
 * 2. 点击提交按钮
 * 3. 调用 client.auth.signInWithPassword()
 * 4. Supabase 验证凭据
 * 5. 如果成功：
 *    - 设置 JWT token 到 Cookie
 *    - user.value 更新为用户对象
 *    - 跳转到 /admin
 * 6. 如果失败：
 *    - 返回错误对象
 *    - 显示错误消息
 *
 * 用户会话管理：
 * - useSupabaseClient()：获取 Supabase 客户端
 * - useSupabaseUser()：获取当前登录用户
 * - user.value：响应式用户对象（null 或用户数据）
 * - 如果用户已登录，自动重定向到 /admin
 *
 * ============================================================================
 */

// ============================================================================
// 页面元数据配置 (Page Metadata Configuration)
// ============================================================================
//
// definePageMeta：Nuxt 3 的页面元数据配置函数
*
// layout: false：不使用默认布局
* - 默认情况下，Nuxt 3 会使用 layouts/default.vue 作为布局
* - 设置 layout: false 可以禁用默认布局
* - 用于登录页面、错误页面等不需要布局的页面
*
// 为什么登录页面不使用布局？
* - 登录页面需要独立的视觉风格
* - 不需要导航栏、页脚等公共组件
* - 提供更沉浸的登录体验
*
// ============================================================================
definePageMeta({
  layout: false,
})

// ============================================================================
// 响应式状态定义 (Reactive State)
// ============================================================================

// 邮箱输入：绑定到输入框
// 使用 ref 创建响应式引用
const email = ref('')

// 密码输入：绑定到输入框
// 使用 ref 创建响应式引用
const password = ref('')

// 加载状态：false = 未加载，true = 登录中
// 用于禁用提交按钮和显示"登錄中..."
const loading = ref(false)

// 错误消息：空字符串表示无错误
// 用于显示登录错误信息
const error = ref('')

// ============================================================================
// Nuxt 3 和 Supabase 组合式 API (Nuxt 3 and Supabase Composables)
// ============================================================================

// useSupabaseClient：获取 Supabase 客户端
// 用于调用 Supabase API（如身份验证、数据库查询等）
const client = useSupabaseClient()

// useRouter：获取路由实例
// 用于页面导航（如 router.push('/admin')）
const router = useRouter()

// useSupabaseUser：获取当前登录用户
// 返回响应式的用户对象
// - 如果用户已登录，返回用户数据（id、email、role 等）
// - 如果用户未登录，返回 null
const user = useSupabaseUser()

// ============================================================================
// 页面挂载时检查登录状态 (Check Login Status on Mount)
// ============================================================================
//
// onMounted：Vue 3 的生命周期钩子
* - 组件挂载到 DOM 后调用
* - 用于执行初始化逻辑
*
// 检查登录状态：
* 1. 检查 user.value 是否存在
* 2. 如果已登录，重定向到 /admin
* 3. 如果未登录，显示登录表单
*
// 为什么需要检查？
* - 避免已登录用户重复登录
* - 提供更好的用户体验
* - 自动跳转到管理后台
*
// ============================================================================
onMounted(() => {
  // 检查用户是否已登录
  if (user.value) {
    // 如果已登录，跳转到 /admin
    router.push('/admin')
  }
})

// ============================================================================
// 登录处理函数 (Login Handler Function)
// ============================================================================
//
// 函数作用：
* - 处理用户登录逻辑
* - 调用 Supabase Auth API
* - 处理成功和失败情况
*
// 工作流程：
* 1. 设置加载状态为 true（禁用按钮，显示"登錄中..."）
* 2. 清空错误消息
* 3. 调用 client.auth.signInWithPassword()
* 4. 如果登录成功，跳转到 /admin
* 5. 如果登录失败，显示错误消息
* 6. 无论成功或失败，设置加载状态为 false
*
// Supabase Auth.signInWithPassword：
* - 参数：{ email, password }
* - 返回：{ data: { user, session }, error }
*   - data.user：用户对象（id、email、role 等）
*   - data.session：会话对象（access_token、refresh_token 等）
*   - error：错误对象（如果有）
*
// 错误处理：
* - 如果 authError 存在，抛出错误
* - catch 块捕获错误，设置错误消息
* - finally 块重置加载状态
*
// ============================================================================
async function handleLogin() {
  // 设置加载状态为 true
  loading.value = true

  // 清空错误消息
  error.value = ''

  try {
    // 调用 Supabase Auth API 进行登录
    const { error: authError } = await client.auth.signInWithPassword({
      email: email.value,    // 邮箱
      password: password.value,  // 密码
    })

    // 检查是否有认证错误
    if (authError) throw authError

    // 登录成功，跳转到 /admin
    router.push('/admin')
  } catch (e: any) {
    // 捕获错误，设置错误消息
    // e.message：错误消息（如 "Invalid login credentials"）
    // 如果没有错误消息，使用默认消息 "登錄失敗"
    error.value = e.message || '登錄失敗'
  } finally {
    // 无论成功或失败，重置加载状态
    loading.value = false
  }
}
</script>
