<!--
================================================================================
管理仪表盘页面（Admin Dashboard）
================================================================================

文件作用：
此文件是网站的管理后台仪表盘页面，展示系统概览信息。
管理员可以在此页面查看统计数据、服务器状态和近期询盘。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 独立加载状态：每个部分独立加载，显示 Shimmer 骨架屏
3. 并发加载：使用 Promise.all 并发加载所有数据
4. 定期刷新：每 30 秒自动刷新服务器状态
5. 错误处理：提供友好的错误信息和重试按钮
6. 瑞士设计风格：TypographyHeader、表格样式、Shimmer 动画

核心功能：
1. 统计数据（Stats Grid）：
   - 总产品数
   - 待处理询盘
   - 本月新闻
   - 系统状态
   - 每个统计项独立加载

2. 服务器状态（Server Status）：
   - Frontend Server 状态
   - Backend Server（Supabase）状态
   - 响应时间
   - 最后更新时间
   - 独立加载状态

3. 近期询盘（Recent Inquiries）：
   - 表格展示最新的 5 条询盘
   - 显示客户/公司、信息摘要、时间、状态
   - 支持跳转到询盘管理页面

页面状态：
1. 加载中：显示 Shimmer 骨架屏
2. 数据加载完成：显示实际数据
3. 错误状态：显示错误信息和重试按钮
4. 空状态：显示"暂无记录"

加载策略：
- 独立加载：每个部分独立加载，不互相阻塞
- 并发加载：使用 Promise.all 并发加载所有部分
- 静态标签立即显示：不等待数据加载
- Shimmer 骨架屏：加载过程中显示占位符

数据来源：
- API 端点：/api/admin/dashboard
- 返回数据结构：
  {
    success: true,
    data: {
      stats: { products, inquiries, posts },
      serverStatus: { frontend, backend },
      recentInquiries: [...]
    }
  }

错误处理：
- 捕获所有 API 错误
- 显示友好的错误信息
- 提供重试按钮
- 单独设置错误，不影响其他部分

动画系统：
- Shimmer 骨架屏：linear-gradient + animation
- shimmer：从左到右扫动的光效
- 1.5 秒无限循环（infinite linear）

关键组件：
- TypographyHeader：排版标题组件
- NuxtLink：Nuxt 路由链接组件

访问路径：
- /admin（需要登录）

布局：
- layout: 'admin'：使用管理后台布局
- 包含侧边栏和头部导航

性能优化：
- 独立加载：减少阻塞时间
- 并发加载：提高加载速度
- 定期刷新：只刷新必要的数据
- Shimmer 骨架屏：提供流畅的加载体验

定时任务：
- 每 30 秒自动刷新服务器状态
- onBeforeUnmount 时清除定时器
- 避免内存泄漏

技术栈：
- 框架：Nuxt 3（Vue 3）
- 样式：Tailwind CSS
- API：$fetch 数据获取
- 定时器：setInterval

调试日志：
- [Admin Dashboard] Stats load error: ...
- [Admin Dashboard] Server status load error: ...
- [Admin Dashboard] Inquiries load error: ...
- [Admin Dashboard] Load error: ...
- [Admin Dashboard] Retrying...
- Refresh status failed: ...

================================================================================
-->

<template>
  <!-- 主容器 -->
  <div class="admin-dashboard-wrapper">
    <!-- ====================================================================================
         错误状态（Error State）
         ====================================================================================
         v-if="error"：如果发生错误，则显示错误提示
         可能的错误原因：
         - Supabase 数据库连接失败
         - 网络连接问题
         - 环境变量配置错误
    -->
    <div v-if="error" class="min-h-screen bg-white p-8">
      <div class="max-w-2xl mx-auto">
        <!-- 错误提示框 -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-8">
          <!-- 错误标题 -->
          <h2 class="text-xl font-bold text-red-800 mb-4">加载数据失败</h2>

          <!-- 错误消息 -->
          <p class="text-red-700 mb-4">{{ error }}</p>

          <!-- 可能的原因列表 -->
          <div class="space-y-2">
            <p class="text-sm text-red-600">可能的原因：</p>
            <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
              <li>Supabase 数据库连接失败</li>
              <li>网络连接问题</li>
              <li>环境变量配置错误</li>
            </ul>
          </div>

          <!-- 重试按钮 -->
          <!-- @click="retryLoad"：点击时重新加载数据 -->
          <button
            @click="retryLoad"
            class="mt-6 text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-text text-white hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all rounded-none"
          >
            重新加载
          </button>
        </div>
      </div>
    </div>

    <!-- ====================================================================================
         主要仪表盘内容（Main Dashboard Content）
         ====================================================================================
         v-else：如果没有错误，则显示仪表盘内容
    -->
    <div v-else class="space-y-12">
      <!-- 页面标题 -->
      <div>
        <TypographyHeader :level="2" size="h2" class="mb-4"> 儀錶盤 Dashboard </TypographyHeader>
        <p class="text-swiss-text-muted mt-4">歡迎回來，系統概覽如下。</p>
      </div>

      <!-- ====================================================================================
           统计数据网格（Stats Grid）
           ====================================================================================
           - grid：CSS Grid 布局
           - grid-cols-1：移动端 1 列
           - md:grid-cols-2：平板 2 列
           - lg:grid-cols-4：桌面 4 列
           - gap-0：无间距（通过边框实现分隔）
           - border-t border-l border-swiss-text/10：上边框和左边框（网格线）
      -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-swiss-text/10"
      >
        <!-- 循环渲染每个统计项 -->
        <!-- v-for="stat in stats"：遍历 stats 数组 -->
        <!-- :key="stat.name"：使用名称作为唯一键 -->
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="bg-white p-8 border-r border-b border-swiss-text/10"
        >
          <!-- 统计项名称 -->
          <!-- text-[10px]：极小字体 -->
          <!-- font-bold uppercase tracking-widest：粗体、全大写、超宽字间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-4">
            {{ stat.name }}
          </p>

          <!-- 统计数值的 Shimmer 骨架屏 -->
          <!-- v-if="stat.loading"：如果正在加载，则显示骨架屏 -->
          <!-- h-12 w-32：高度 3rem，宽度 8rem -->
          <!-- bg-gray-50：灰色背景 -->
          <!-- relative overflow-hidden：相对定位，溢出隐藏 -->
          <div v-if="stat.loading" class="h-12 w-32 bg-gray-50 relative overflow-hidden mb-4">
            <!-- shimmer：扫动光效 -->
            <div class="shimmer absolute inset-0"></div>
          </div>

          <!-- 统计数值 -->
          <!-- v-else：如果加载完成，则显示实际数值 -->
          <!-- text-4xl font-black tracking-tight text-swiss-text：超大字体、极粗、紧凑字间距 -->
          <p v-else class="text-4xl font-black tracking-tight text-swiss-text">{{ stat.value }}</p>

          <!-- 趋势的 Shimmer 骨架屏 -->
          <div v-if="stat.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden mt-4">
            <div class="shimmer absolute inset-0"></div>
          </div>

          <!-- 趋势文本 -->
          <!-- v-if="stat.trend && !stat.loading"：如果有趋势且加载完成，则显示 -->
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-swiss-text mt-4 flex items-center"
            v-if="stat.trend && !stat.loading"
          >
            {{ stat.trend }}
          </p>
        </div>
      </div>

      <!-- ====================================================================================
           服务器状态（Server Status）
           ====================================================================================
           - bg-white：白色背景
           - border border-swiss-text/10：边框
      -->
      <div class="bg-white border border-swiss-text/10">
        <!-- 标题 -->
        <div class="p-6 md:p-8 border-b border-swiss-text/10">
          <TypographyHeader :level="3" size="h4" class="!mb-0">
            服务器状态 Server Status
          </TypographyHeader>
        </div>

        <!-- 内容区域 -->
        <div class="p-6 md:p-8 space-y-4">
          <!-- ====================================================================================
               Frontend Server 状态
               ====================================================================================
               - flex items-center justify-between：弹性布局，两端对齐，垂直居中
          -->
          <div class="flex items-center justify-between p-4 border border-swiss-text/10">
            <!-- 服务器信息 -->
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-1">
                Frontend Server
              </p>

              <!-- URL 的 Shimmer 骨架屏 -->
              <div
                v-if="serverStatus.frontend.loading"
                class="h-4 w-48 bg-gray-50 relative overflow-hidden"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <!-- URL -->
              <p v-else class="text-sm text-swiss-text/60">{{ serverStatus.frontend.url }}</p>
            </div>

            <!-- 状态指示器 -->
            <div class="text-right">
              <!-- 状态指示灯的 Shimmer 骨架屏 -->
              <!-- w-3 h-3：圆形，直径 0.75rem -->
              <div
                v-if="serverStatus.frontend.loading"
                class="w-3 h-3 rounded-full bg-gray-100 relative overflow-hidden mb-1"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <!-- 实际状态指示灯 -->
              <!-- :class：动态类名绑定，根据状态显示不同颜色 -->
              <!-- bg-green-500：在线（绿色） -->
              <!-- bg-red-500：离线（红色） -->
              <!-- bg-yellow-500：错误或未知（黄色） -->
              <span
                v-else
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-green-500': serverStatus.frontend.status === 'online',
                  'bg-red-500': serverStatus.frontend.status === 'offline',
                  'bg-yellow-500':
                    serverStatus.frontend.status === 'error' ||
                    serverStatus.frontend.status === 'unknown',
                }"
              ></span>

              <!-- 状态文本 -->
              <div class="flex flex-col items-end">
                <!-- 状态文本的 Shimmer 骨架屏 -->
                <div
                  v-if="serverStatus.frontend.loading"
                  class="h-3 w-16 bg-gray-100 relative overflow-hidden"
                >
                  <div class="shimmer absolute inset-0"></div>
                </div>

                <!-- 实际状态文本 -->
                <span
                  v-else
                  class="text-xs font-bold uppercase tracking-wider"
                  :class="{
                    'text-green-600': serverStatus.frontend.status === 'online',
                    'text-red-600': serverStatus.frontend.status === 'offline',
                    'text-yellow-600':
                      serverStatus.frontend.status === 'error' ||
                      serverStatus.frontend.status === 'unknown',
                  }"
                >
                  {{ serverStatus.frontend.status }}
                </span>
              </div>

              <!-- 响应时间的 Shimmer 骨架屏 -->
              <div
                v-if="serverStatus.frontend.loading"
                class="h-3 w-12 bg-gray-50 relative overflow-hidden"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <!-- 响应时间 -->
              <p
                v-else-if="serverStatus.frontend.responseTime"
                class="text-[10px] font-mono text-swiss-text-muted"
              >
                {{ serverStatus.frontend.responseTime }}ms
              </p>
              <!-- 无响应时间时显示 -- -->
              <p v-else class="text-[10px] font-mono text-swiss-text-muted">--</p>
            </div>
          </div>

          <!-- ====================================================================================
               Backend Server 状态
               ====================================================================================
               结构与 Frontend Server 相同
          -->
          <div class="flex items-center justify-between p-4 border border-swiss-text/10">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-1">
                Backend Server (Supabase)
              </p>

              <!-- URL 的 Shimmer 骨架屏 -->
              <div
                v-if="serverStatus.backend.loading"
                class="h-4 w-48 bg-gray-50 relative overflow-hidden"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <p v-else class="text-sm text-swiss-text/60">{{ serverStatus.backend.url }}</p>
            </div>

            <div class="text-right">
              <!-- 状态指示灯的 Shimmer 骨架屏 -->
              <div
                v-if="serverStatus.backend.loading"
                class="w-3 h-3 rounded-full bg-gray-100 relative overflow-hidden mb-1"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <!-- 实际状态指示灯 -->
              <span
                v-else
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-green-500': serverStatus.backend.status === 'online',
                  'bg-red-500': serverStatus.backend.status === 'offline',
                  'bg-yellow-500':
                    serverStatus.backend.status === 'error' ||
                    serverStatus.backend.status === 'unknown',
                }"
              ></span>

              <!-- 状态文本 -->
              <div class="flex flex-col items-end">
                <!-- 状态文本的 Shimmer 骨架屏 -->
                <div
                  v-if="serverStatus.backend.loading"
                  class="h-3 w-16 bg-gray-100 relative overflow-hidden"
                >
                  <div class="shimmer absolute inset-0"></div>
                </div>

                <!-- 实际状态文本 -->
                <span
                  v-else
                  class="text-xs font-bold uppercase tracking-wider"
                  :class="{
                    'text-green-600': serverStatus.backend.status === 'online',
                    'text-red-600': serverStatus.backend.status === 'offline',
                    'text-yellow-600':
                      serverStatus.backend.status === 'error' ||
                      serverStatus.backend.status === 'unknown',
                  }"
                >
                  {{ serverStatus.backend.status }}
                </span>
              </div>

              <!-- 响应时间的 Shimmer 骨架屏 -->
              <div
                v-if="serverStatus.backend.loading"
                class="h-3 w-12 bg-gray-50 relative overflow-hidden"
              >
                <div class="shimmer absolute inset-0"></div>
              </div>

              <!-- 响应时间 -->
              <p
                v-else-if="serverStatus.backend.responseTime"
                class="text-[10px] font-mono text-swiss-text-muted"
              >
                {{ serverStatus.backend.responseTime }}ms
              </p>
              <!-- 无响应时间时显示 -- -->
              <p v-else class="text-[10px] font-mono text-swiss-text-muted">--</p>
            </div>
          </div>

          <!-- ====================================================================================
               最后更新时间
               ====================================================================================
          -->
          <div
            class="flex items-center justify-between text-[10px] text-swiss-text-muted uppercase tracking-widest pt-2"
          >
            <span>Last Updated</span>
            <!-- 加载中显示"更新中..." -->
            <span v-if="serverStatus.loading" class="animate-pulse">更新中...</span>
            <!-- 加载完成显示实际时间 -->
            <span v-else>{{ lastUpdated }}</span>
          </div>
        </div>
      </div>

      <!-- ====================================================================================
           近期询盘（Recent Inquiries）
           ====================================================================================
      -->
      <div class="bg-white border border-swiss-text/10">
        <!-- 标题和"查看全部"链接 -->
        <div class="p-6 md:p-8 border-b border-swiss-text/10 flex justify-between items-center">
          <TypographyHeader :level="3" size="h4" class="!mb-0"> 近期詢盤 </TypographyHeader>

          <!-- 跳转到询盘管理页面 -->
          <!-- NuxtLink：Nuxt 路由链接组件 -->
          <NuxtLink
            to="/admin/inquiries"
            class="text-[10px] font-bold uppercase tracking-widest text-swiss-text hover:text-swiss-text-muted transition-colors"
          >
            查看全部 <span class="ml-2">→</span>
          </NuxtLink>
        </div>

        <!-- 表格容器 -->
        <div class="overflow-x-auto">
          <!-- ====================================================================================
               表格的 Shimmer 骨架屏
               ====================================================================================
          -->
          <div v-if="inquiriesLoading" class="space-y-4 p-6 md:p-8">
            <!-- 表头骨架屏 -->
            <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
              <!-- 4 个列标题 -->
              <div v-for="i in 4" :key="i" class="flex-1 px-4">
                <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
                  <div class="shimmer absolute inset-0"></div>
                </div>
              </div>
            </div>

            <!-- 表格行骨架屏（5 行） -->
            <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4">
              <!-- 4 个列单元格 -->
              <div v-for="i in 4" :key="i" class="flex-1 px-4">
                <!-- 随机宽度（40% - 80%） -->
                <div
                  class="h-4 bg-gray-50 relative overflow-hidden"
                  :style="{ width: Math.random() * 40 + 40 + '%' }"
                >
                  <div class="shimmer absolute inset-0"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- ====================================================================================
               空状态（No Inquiries）
               ====================================================================================
          -->
          <div
            v-else-if="inquiries.length === 0"
            class="p-12 text-center text-swiss-text-muted uppercase tracking-widest text-[10px]"
          >
            暂無記錄
          </div>

          <!-- ====================================================================================
               询盘表格
               ====================================================================================
          -->
          <table v-else class="w-full text-left text-sm">
            <!-- 表头 -->
            <thead
              class="bg-swiss-bg-soft text-swiss-text-muted uppercase text-[10px] tracking-widest font-bold"
            >
              <tr>
                <th class="px-6 md:px-8 py-4">客戶 / 公司</th>
                <th class="px-6 md:px-8 py-4">信息摘要</th>
                <th class="px-6 md:px-8 py-4">時間</th>
                <th class="px-6 md:px-8 py-4">狀態</th>
              </tr>
            </thead>

            <!-- 表格内容 -->
            <tbody class="divide-y divide-swiss-text/10">
              <tr
                v-for="inquiry in inquiries"
                :key="inquiry.id"
                class="hover:bg-swiss-bg-soft transition-colors"
              >
                <!-- 客户/公司 -->
                <td class="px-6 md:px-8 py-4">
                  <div class="font-medium text-swiss-text">{{ inquiry.email }}</div>
                  <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
                    {{ inquiry.company || '個人' }}
                  </div>
                </td>

                <!-- 信息摘要 -->
                <!-- truncate：超出部分显示省略号 -->
                <!-- max-w-xs：最大宽度 -->
                <td class="px-6 md:px-8 py-4 text-swiss-text-muted truncate max-w-xs">
                  {{ inquiry.message }}
                </td>

                <!-- 时间 -->
                <td
                  class="px-6 md:px-8 py-4 text-swiss-text-muted text-[10px] uppercase tracking-wider"
                >
                  {{ formatDate(inquiry.created_at) }}
                </td>

                <!-- 状态 -->
                <td class="px-6 md:px-8 py-4">
                  <!-- 状态标签 -->
                  <!-- 动态类名绑定 -->
                  <span
                    class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    :class="[
                      inquiry.status === 'new'
                        ? 'bg-swiss-text text-white' // 新询盘：黑色背景，白色文字
                        : 'bg-swiss-bg-soft text-swiss-text', // 其他状态：浅灰色背景，深色文字
                    ]"
                  >
                    {{ inquiry.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ====================================================================================
// 页面元数据
// ====================================================================================
// definePageMeta()：Nuxt 3 提供的函数，用于定义页面元数据
// layout: 'admin'：使用管理后台布局
definePageMeta({
  layout: 'admin',
})

// ====================================================================================
// 统计数据
// ====================================================================================
// stats：统计项数组
// 每个 stat 包含：
// - name：统计项名称
// - value：统计值
// - loading：是否正在加载
// - trend：趋势（可选）
const stats = ref([
  { name: '總產品數', value: '0', loading: true, trend: '' },
  { name: '待處理詢盤', value: '0', loading: true, trend: '' },
  { name: '本月新聞', value: '0', loading: true, trend: '' },
  { name: '系統狀態', value: '穩定', loading: false, trend: '' },
])

// ====================================================================================
// 询盘数据
// ====================================================================================
// inquiries：询盘数组
const inquiries = ref<any[]>([])

// inquiriesLoading：询盘是否正在加载
const inquiriesLoading = ref(true)

// ====================================================================================
// 服务器状态
// ====================================================================================
// serverStatus：服务器状态对象
// - loading：是否正在加载
// - frontend：前端服务器状态
//   - url：服务器 URL
//   - status：状态（online, offline, error, unknown）
//   - responseTime：响应时间（毫秒）
// - backend：后端服务器状态（Supabase）
const serverStatus = ref({
  loading: true,
  frontend: { url: '', status: 'unknown', responseTime: null } as any,
  backend: { url: '', status: 'unknown', responseTime: null } as any,
})

// lastUpdated：最后更新时间
const lastUpdated = ref('加载中...')

// statusInterval：定时器 ID（用于清除定时器）
let statusInterval: any = null

// ====================================================================================
// 独立的加载状态
// ====================================================================================
// error：错误信息
const error = ref<any>(null)

// initialLoadComplete：初始加载是否完成
const initialLoadComplete = ref(false)

// ====================================================================================
// 加载统计数据
// ====================================================================================
/**
 * loadStats() - 加载统计数据
 *
 * 功能：
 * 从 API 获取统计数据（产品数、询盘数、新闻数）
 * 更新 stats 数组的值和加载状态
 *
 * 错误处理：
 * - 捕获 API 错误
 * - 单独设置错误，不影响其他部分
 * - 加载状态设置为 false
 */
async function loadStats() {
  try {
    // $fetch()：Nuxt 提供的数据获取函数
    // 返回 Promise，需要 await 等待
    const response = (await $fetch('/api/admin/dashboard')) as any

    // 检查 API 返回是否成功
    if (response.success) {
      // 提取数据
      const data = response.data

      // 更新统计数据
      if (data.stats) {
        // 总产品数
        stats.value[0].value = String(data.stats.products || 0)
        stats.value[0].loading = false

        // 待处理询盘
        stats.value[1].value = String(data.stats.inquiries || 0)
        stats.value[1].loading = false

        // 本月新闻
        stats.value[2].value = String(data.stats.posts || 0)
        stats.value[2].loading = false
      }
    }
  } catch (e) {
    // 错误处理
    console.error('[Admin Dashboard] Stats load error:', e)

    // 单独设置错误，不影响其他部分
    stats.value[0].loading = false
    stats.value[1].loading = false
    stats.value[2].loading = false
  }
}

// ====================================================================================
// 加载服务器状态
// ====================================================================================
/**
 * loadServerStatus() - 加载服务器状态
 *
 * 功能：
 * 从 API 获取服务器状态（前端和后端）
 * 更新 serverStatus 对象的值和加载状态
 * 更新最后更新时间
 *
 * 错误处理：
 * - 捕获 API 错误
 * - 设置默认值（unknown, --）
 */
async function loadServerStatus() {
  try {
    const response = (await $fetch('/api/admin/dashboard')) as any

    if (response.success) {
      const data = response.data

      if (data.serverStatus) {
        // 加载完成
        serverStatus.value.loading = false

        // 更新前端状态
        serverStatus.value.frontend = data.serverStatus.frontend

        // 更新后端状态
        serverStatus.value.backend = data.serverStatus.backend

        // 更新最后更新时间
        // toLocaleString('zh-HK')：转换为香港本地时间格式
        lastUpdated.value = new Date().toLocaleString('zh-HK')
      }
    }
  } catch (e) {
    // 错误处理
    console.error('[Admin Dashboard] Server status load error:', e)

    // 设置默认值
    serverStatus.value.serverStatus = false
    serverStatus.value.frontend = { url: '-', status: 'unknown', responseTime: null }
    serverStatus.value.backend = { url: '-', status: 'unknown', responseTime: null }
    lastUpdated.value = '加载失败'
  }
}

// ====================================================================================
// 加载询盘数据
// ====================================================================================
/**
 * loadInquiries() - 加载询盘数据
 *
 * 功能：
 * 从 API 获取近期询盘
 * 更新 inquiries 数组和加载状态
 *
 * 错误处理：
 * - 捕获 API 错误
 * - 设置空数组
 */
async function loadInquiries() {
  try {
    const response = (await $fetch('/api/admin/dashboard')) as any

    if (response.success) {
      const data = response.data

      if (data.recentInquiries) {
        // 更新询盘数组
        inquiries.value = data.recentInquiries

        // 加载完成
        inquiriesLoading.value = false
      }
    }
  } catch (e) {
    // 错误处理
    console.error('[Admin Dashboard] Inquiries load error:', e)

    // 设置空数组
    inquiriesLoading.value = false
    inquiries.value = []
  }
}

// ====================================================================================
// 并发加载所有数据
// ====================================================================================
/**
 * loadAllData() - 并发加载所有数据
 *
 * 功能：
 * 并发加载统计数据、服务器状态、询盘数据
 * 使用 Promise.all 等待所有请求完成
 *
 * 优势：
 * - 提升加载速度（并发 vs 串行）
 * - 静态标签立即显示（不等待数据）
 * - 独立加载状态（每个部分独立加载）
 *
 * 错误处理：
 * - 捕获所有错误
 * - 设置全局错误状态
 */
async function loadAllData() {
  // 清除错误状态
  error.value = null

  // 初始加载未完成
  initialLoadComplete.value = false

  try {
    // 并发加载所有部分
    // Promise.all()：等待所有 Promise 完成
    // 如果任一 Promise 失败，则整体失败
    await Promise.all([loadStats(), loadServerStatus(), loadInquiries()])

    // 初始加载完成
    initialLoadComplete.value = true
  } catch (e) {
    // 错误处理
    console.error('[Admin Dashboard] Load error:', e)

    // 设置错误信息
    error.value = e.message || '加载失败'
  }
}

// ====================================================================================
// 重试加载
// ====================================================================================
/**
 * retryLoad() - 重试加载数据
 *
 * 功能：
 * 重新调用 loadAllData()，重新加载所有数据
 * 用于用户点击"重新加载"按钮
 */
function retryLoad() {
  console.log('[Admin Dashboard] Retrying...')
  loadAllData()
}

// ====================================================================================
// 页面加载时获取数据
// ====================================================================================
// onMounted()：Vue 生命周期钩子，组件挂载到 DOM 后执行
onMounted(() => {
  // 并发加载所有数据
  loadAllData()
})

// ====================================================================================
// 定期刷新服务器状态
// ====================================================================================
/**
 * 定时刷新服务器状态
 *
 * 功能：
 * 每 30 秒自动刷新服务器状态
 * 避免用户手动刷新页面
 *
 * 注意：
 * - 只刷新服务器状态，不刷新统计数据和询盘
 * - onBeforeUnmount 时清除定时器，避免内存泄漏
 */
onMounted(() => {
  // setInterval()：设置定时器
  // 参数 1：回调函数
  // 参数 2：间隔时间（毫秒）
  // 30000ms = 30s
  statusInterval = setInterval(async () => {
    try {
      // 请求服务器状态
      const resp = (await $fetch('/api/admin/dashboard')) as any

      if (resp.success) {
        const data = resp.data

        if (data.serverStatus) {
          // 更新服务器状态
          serverStatus.value.frontend = data.serverStatus.frontend
          serverStatus.value.backend = data.serverStatus.backend

          // 更新最后更新时间
          lastUpdated.value = new Date().toLocaleString('zh-HK')
        }
      }
    } catch (e) {
      // 错误处理（静默失败，不显示错误）
      console.error('Refresh status failed:', e)
    }
  }, 30000) // 30 秒间隔
})

// ====================================================================================
// 清理定时器
// ====================================================================================
// onBeforeUnmount()：Vue 生命周期钩子，组件卸载前执行
onBeforeUnmount(() => {
  // 如果定时器存在，则清除
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})

// ====================================================================================
// 格式化日期
// ====================================================================================
/**
 * formatDate() - 格式化日期
 *
 * @param dateStr - 日期字符串（ISO 8601 格式）
 * @returns 格式化后的日期字符串（香港本地格式）
 *
 * 示例：
 * '2024-01-01T00:00:00.000Z' → '2024/1/1'
 */
function formatDate(dateStr: string) {
  // 如果日期为空，则返回 '-'
  if (!dateStr) return '-'

  // 转换为 Date 对象，并格式化为香港本地日期
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
</script>

<style scoped>
/* ====================================================================================
 * Shimmer 骨架屏动画
 * ====================================================================================
 * 
 * 功能：
 * 创建从左到右扫动的光效，模拟数据加载中的状态
 * 
 * 技术实现：
 * 1. linear-gradient：线性渐变背景
 * 2. animation：CSS 动画
 * 3. background-position：移动背景位置
 * 
 * 渐变说明：
 * - 0%：完全透明（rgba(255, 255, 255, 0)）
 * - 45%：轻微不透明（rgba(255, 255, 255, 0.4)）
 * - 50%：最大不透明（rgba(255, 255, 255, 0.5)）
 * - 55%：轻微不透明（rgba(255, 255, 255, 0.4)）
 * - 100%：完全透明（rgba(255, 255, 255, 0)）
 * 
 * 动画说明：
 * - shimmer：动画名称
 * - 1.5s：动画持续时间（1.5 秒）
 * - infinite：无限循环
 * - linear：线性动画（无缓动）
 */
.shimmer {
  /* 线性渐变背景 */
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    /* 0%：透明 */ rgba(255, 255, 255, 0.4) 45%,
    /* 45%：40% 不透明 */ rgba(255, 255, 255, 0.5) 50%,
    /* 50%：50% 不透明 */ rgba(255, 255, 255, 0.4) 55%,
    /* 55%：40% 不透明 */ rgba(255, 255, 255, 0) 100%
  ); /* 100%：透明 */

  /* 背景大小：200% 宽度 */
  background-size: 200% 100%;

  /* 动画：1.5 秒无限循环线性 */
  animation: shimmer 1.5s infinite linear;
}

/* ====================================================================================
 * Shimmer 关键帧动画
 * ====================================================================================
 * 
 * 功能：
 * 定义 shimmer 动画的关键帧
 * 控制背景位置从 -200% 移动到 200%
 * 
 * 0%：背景位置在左侧（-200%）
 * 100%：背景位置在右侧（200%）
 */
@keyframes shimmer {
  0% {
    /* 背景位置：左侧 200% */
    background-position: -200% 0;
  }

  100% {
    /* 背景位置：右侧 200% */
    background-position: 200% 0;
  }
}
</style>
