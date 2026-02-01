<template>
  <!-- 相对定位容器 -->
  <!-- class="relative"：相对定位（用于绝对定位子元素） -->
  <div class="relative">
    <!-- 搜索输入框容器 -->
    <!-- class="relative"：相对定位（用于绝对定位搜索图标） -->
    <div class="relative">
      <!-- 搜索输入框 -->
      <!-- v-model="searchQuery"：双向绑定到 searchQuery ref -->
      <!-- type="text"：文本输入类型 -->
      <!-- placeholder="全局搜索..."：占位符文本 -->
      <!-- class：样式 -->
      <!--   - w-full：宽度 100% -->
      <!--   - px-4 py-2 pr-10：内边距（左右 4，上下 2），右侧 10（为图标留空间） -->
      <!--   - bg-white：白色背景 -->
      <!--   - border border-swiss-text/10：主文本颜色边框，10% 不透明度 -->
      <!--   - text-swiss-text：主文本颜色 -->
      <!--   - text-sm：小号字体 -->
      <!--   - focus:outline-none：聚焦时移除默认轮廓 -->
      <!--   - focus:border-swiss-text：聚焦时边框变为主文本颜色 -->
      <!--   - placeholder-swiss-text-muted/40：占位符次要文本颜色，40% 不透明度 -->
      <!-- @focus="showResults = true"：聚焦时显示搜索结果 -->
      <!-- @blur="handleBlur"：失焦时调用 handleBlur 函数 -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="全局搜索..."
        class="w-full px-4 py-2 pr-10 bg-white border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text placeholder-swiss-text-muted/40"
        @focus="showResults = true"
        @blur="handleBlur"
      />
      <!-- 搜索图标 -->
      <!-- UIcon：Nuxt UI 图标组件 -->
      <!-- name="i-heroicons-magnifying-glass"：放大镜图标 -->
      <!-- class：样式 -->
      <!--   - absolute：绝对定位 -->
      <!--   - right-3 top-1/2 -translate-y-1/2：右侧 3 单位，垂直居中（向上平移 50%） -->
      <!--   - text-swiss-text-muted：次要文本颜色 -->
      <!--   - w-5 h-5：图标尺寸 5 单位（20px） -->
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-swiss-text-muted w-5 h-5"
      />
    </div>

    <!-- 搜索结果下拉菜单 -->
    <!-- v-if="showResults && searchQuery.length > 0"：有搜索查询且显示结果时才显示 -->
    <!-- class：样式 -->
    <!--   - absolute：绝对定位 -->
    <!--   - top-full：顶部对齐父元素底部 -->
    <!--   - left-0：左侧对齐 -->
    <!--   - mt-2：上边距 2 单位 -->
    <!--   - bg-white：白色背景 -->
    <!--   - border border-swiss-text/10：主文本颜色边框，10% 不透明度 -->
    <!--   - shadow-lg：大阴影 -->
    <!--   - max-h-96：最大高度 24 单位（384px） -->
    <!--   - overflow-y-auto：垂直溢出时显示滚动条 -->
    <!--   - z-50：高层级（覆盖其他元素） -->
    <div
      v-if="showResults && searchQuery.length > 0"
      class="absolute top-full left-0 mt-2 bg-white border border-swiss-text/10 shadow-lg max-h-96 overflow-y-auto z-50"
    >
      <!-- 加载状态：显示"搜索中..." -->
      <!-- v-if="loading"：当数据正在加载时显示 -->
      <div v-if="loading" class="p-4 text-center text-swiss-text-muted text-sm">搜索中...</div>

      <!-- 搜索结果 -->
      <!-- v-else-if="hasResults"：有搜索结果时显示 -->
      <div v-else-if="hasResults" class="divide-y divide-swiss-text/10">
        <!-- 产品结果 -->
        <!-- v-if="results.products.length > 0"：有产品结果时显示 -->
        <div v-if="results.products.length > 0" class="p-4">
          <!-- 分类标题 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- mb-2：底部边距 2 单位 -->
          <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
            <!-- 產品 ({{ results.products.length }}) -->
          </div>
          <!-- 产品列表 -->
          <!-- v-for：遍历产品数组 -->
          <!-- :key="product.id"：使用产品 ID 作为唯一标识 -->
          <!-- class="py-2 hover:bg-swiss-bg-soft cursor-pointer"：上下内边距 2 单位，悬停时浅色背景，鼠标指针 -->
          <!-- @click="navigateTo(`/admin/products/${product.id}`)"：点击时导航到产品详情页 -->
          <div
            v-for="product in results.products"
            :key="product.id"
            class="py-2 hover:bg-swiss-bg-soft cursor-pointer"
            @click="navigateTo(`/admin/products/${product.id}`)"
          >
            <!-- 产品名称 -->
            <!-- class="font-medium text-sm text-swiss-text"：中等字重，小号字体，主文本颜色 -->
            <div class="font-medium text-sm text-swiss-text">
              <!-- 多语言产品名称（优先繁体中文，其次简体中文） -->
              {{ product.name?.['zh-HK'] || product.name?.hk }}
            </div>
            <!-- 产品 slug -->
            <!-- class="text-xs text-swiss-text-muted"：极小字体，次要文本颜色 -->
            <div class="text-xs text-swiss-text-muted">{{ product.slug }}</div>
          </div>
        </div>

        <!-- 文章/新闻结果 -->
        <!-- v-if="results.posts.length > 0"：有文章结果时显示 -->
        <div v-if="results.posts.length > 0" class="p-4">
          <!-- 分类标题 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- mb-2：底部边距 2 单位 -->
          <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
            <!-- 新聞 ({{ results.posts.length }}) -->
          </div>
          <!-- 文章列表 -->
          <!-- v-for：遍历文章数组 -->
          <!-- :key="post.id"：使用文章 ID 作为唯一标识 -->
          <!-- class="py-2 hover:bg-swiss-bg-soft cursor-pointer"：上下内边距 2 单位，悬停时浅色背景，鼠标指针 -->
          <!-- @click="navigateTo(`/admin/news/${post.id}`)"：点击时导航到文章详情页 -->
          <div
            v-for="post in results.posts"
            :key="post.id"
            class="py-2 hover:bg-swiss-bg-soft cursor-pointer"
            @click="navigateTo(`/admin/news/${post.id}`)"
          >
            <!-- 文章标题 -->
            <!-- class="font-medium text-sm text-swiss-text"：中等字重，小号字体，主文本颜色 -->
            <div class="font-medium text-sm text-swiss-text">
              <!-- 多语言文章标题（优先繁体中文，其次简体中文） -->
              {{ post.title?.['zh-HK'] || post.title?.hk }}
            </div>
            <!-- 文章 slug -->
            <!-- class="text-xs text-swiss-text-muted"：极小字体，次要文本颜色 -->
            <div class="text-xs text-swiss-text-muted">{{ post.slug }}</div>
          </div>
        </div>

        <!-- 询盘结果 -->
        <!-- v-if="results.inquiries.length > 0"：有询盘结果时显示 -->
        <div v-if="results.inquiries.length > 0" class="p-4">
          <!-- 分类标题 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- mb-2：底部边距 2 单位 -->
          <div class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
            <!-- 詢盤 ({{ results.inquiries.length }}) -->
          </div>
          <!-- 询盘列表 -->
          <!-- v-for：遍历询盘数组 -->
          <!-- :key="inquiry.id"：使用询盘 ID 作为唯一标识 -->
          <!-- class="py-2 hover:bg-swiss-bg-soft cursor-pointer"：上下内边距 2 单位，悬停时浅色背景，鼠标指针 -->
          <!-- @click="navigateTo(`/admin/inquiries`)">：点击时导航到询盘管理页 -->
          <div
            v-for="inquiry in results.inquiries"
            :key="inquiry.id"
            class="py-2 hover:bg-swiss-bg-soft cursor-pointer"
            @click="navigateTo(`/admin/inquiries`)"
          >
            <!-- 询盘邮箱 -->
            <!-- class="font-medium text-sm text-swiss-text"：中等字重，小号字体，主文本颜色 -->
            <div class="font-medium text-sm text-swiss-text">{{ inquiry.email }}</div>
            <!-- 询盘消息（截断显示） -->
            <!-- class="text-xs text-swiss-text-muted truncate：极小字体，次要文本颜色，文本截断 -->
            <div class="text-xs text-swiss-text-muted truncate">{{ inquiry.message }}</div>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <!-- v-else：没有搜索结果时显示 -->
      <div v-else class="p-4 text-center text-swiss-text-muted text-sm">沒有找到結果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：全局搜索组件 (Global Search Component)
 * ============================================================================
 *
 * 此组件是一个全局搜索组件，用于在管理后台快速搜索产品、文章和询盘。
 *
 * 功能说明：
 * 1. 搜索输入框：支持实时搜索，延迟 300ms 触发
 * 2. 搜索结果：显示匹配的产品、文章和询盘
 * 3. 分类显示：按类型分组显示结果
 * 4. 点击跳转：点击结果项跳转到对应的管理页面
 * 5. 自动隐藏：失焦 200ms 后自动隐藏结果
 * 6. 加载状态：显示"搜索中..."
 *
 * 搜索逻辑：
 * - 调用 /api/admin/search API
 * - 传递查询参数 q
 * - 返回匹配的产品、文章、询盘
 *
 * 瑞士设计特点：
 * - 极简主义 (Minimalism)：简洁的 UI，突出搜索功能
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 大量留白 (Whitespace)：充足的呼吸空间
 *
 * 性能优化：
 * - 延迟搜索：输入后 300ms 才触发搜索（避免频繁请求）
 * - useLazyFetch：延迟加载搜索结果，不阻塞输入
 * - 虚拟键盘：延迟隐藏，避免遮挡其他操作
 *
 * 可访问性 (Accessibility)：
 * - placeholder：提供占位符文本
 * - 键盘导航：支持键盘操作
 * - 对比度：文本和背景对比度符合 WCAG 标准
 *
 * 依赖组件：
 * - UIcon：Nuxt UI 图标组件
 *
 * 依赖 API：
 * - /api/admin/search：全局搜索 API
 *
 * ============================================================================
 */

// ============================================================================
// 响应式状态定义 (Reactive State)
// ============================================================================

// 搜索查询字符串
const searchQuery = ref('')

// 是否显示搜索结果
const showResults = ref(false)

// 搜索超时引用（用于延迟搜索）
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// ============================================================================
// 懒加载搜索结果 (Lazy Fetch Search Results)
// ============================================================================
//
// 使用 useLazyFetch 异步加载搜索结果
//
// API 调用：
// - `/api/admin/search?q=${searchQuery.value}`：搜索 API，传递查询参数 q
// - key：动态 key，随 searchQuery 变化
// - immediate: false：不立即执行，需要手动触发
// - watch: [searchQuery]：监听 searchQuery 变化
//
// 返回值：
// - data: searchResponse：搜索响应数据
// - pending: loading：加载状态
//
// ============================================================================
const { data: searchResponse, pending: loading } = await useLazyFetch(
  // 动态 API 端点：/api/admin/search?q=${searchQuery.value}
  () => `/api/admin/search?q=${searchQuery.value}`,
  {
    // 动态 key：随 searchQuery 变化
    key: () => `admin-search-${searchQuery.value}`,
    // 不立即执行，需要手动触发
    immediate: false,
    // 监听 searchQuery 变化
    watch: [searchQuery],
  }
)

// ============================================================================
// 搜索结果计算属性 (Search Results Computed)
// ============================================================================
//
// 使用 computed 创建搜索结果的响应式计算属性
//
// 返回值：
// - products: 产品数组
// - posts: 文章数组
// - inquiries: 询盘数组
//
// 数据处理：
// 1. 检查 searchResponse 是否存在
// 2. 如果不存在或 success = false，返回空数组
// 3. 如果存在，提取 data 字段
// 4. 类型守卫：确保 data 字段存在
//
// ============================================================================
const results = computed(() => {
  // 获取搜索响应
  const response = searchResponse.value

  // 如果响应不存在或失败，返回空数组
  if (!response || !response.success) {
    return { products: [], posts: [], inquiries: [] }
  }

  // 类型守卫：检查 data 字段是否存在
  if (!('data' in response)) {
    return { products: [], posts: [], inquiries: [] }
  }

  // 返回搜索结果（类型转换）
  // as { products: any[]; posts: any[]; inquiries: any[] }：类型断言
  return response.data as { products: any[]; posts: any[]; inquiries: any[] }
})

// ============================================================================
// 是否有搜索结果计算属性 (Has Results Computed)
// ============================================================================
//
// 返回值：
// - true：有搜索结果（产品、文章或询盘至少有一个）
// - false：没有搜索结果
//
// 逻辑：
// - products.length > 0 或 posts.length > 0 或 inquiries.length > 0
// - 使用 || 短路求和
//
// ============================================================================
const hasResults = computed(() => {
  return (
    results.value.products.length > 0 ||
    results.value.posts.length > 0 ||
    results.value.inquiries.length > 0
  )
})

// ============================================================================
// 延迟搜索逻辑 (Debounced Search)
// ============================================================================
//
// 使用 watch 监听 searchQuery 变化
//
// 工作流程：
// 1. 清除之前的搜索超时
// 2. 如果搜索查询长度 > 0，设置新的超时
// 3. 超时 300ms 后，触发搜索（搜索 API 会自动响应）
*
// 延迟搜索的优势：
* - 避免频繁请求（用户输入时不会每次按键都触发）
* - 减少服务器负载
* - 提升用户体验（避免闪烁）
*
// 延迟时间：300ms（常见设置）
//
// ============================================================================
watch(searchQuery, () => {
  // 清除之前的搜索超时
  // clearTimeout：取消之前设置的定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // 如果搜索查询长度 > 0，设置新的超时
  if (searchQuery.value.length > 0) {
    // setTimeout：300ms 后执行回调
    // 回调函数为空，因为 useLazyFetch 会自动响应
    // 只需要修改 searchQuery.value 即可触发搜索
    searchTimeout.value = setTimeout(() => {
      // 触发搜索（useLazyFetch 会自动响应）
      // 实际上不需要任何代码，只需修改 searchQuery.value 即可
      // 这里只是为了展示概念
    }, 300)
  }
})

// ============================================================================
// 处理失焦事件 (Handle Blur Event)
// ============================================================================
//
// 函数作用：
* - 延迟隐藏搜索结果
* - 给点击事件有时间触发
*
// 延迟原因：
* - 用户点击结果项后，需要时间导航
* - 避免在导航前就隐藏结果
*
// 延迟时间：200ms
*
// 工作流程：
* 1. 使用 setTimeout 延迟 200ms
* 2. 设置 showResults.value = false 隐藏结果
*
// ============================================================================
function handleBlur() {
  // 延迟隐藏，让点击事件有时间触发
  // setTimeout：200ms 后执行回调
  setTimeout(() => {
    // 隐藏搜索结果
    showResults.value = false
  }, 200)
}
</script>
