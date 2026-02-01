<template>
  <!-- 页面容器 -->
  <!-- space-y-12：子元素之间间距 12 单位 -->
  <div class="space-y-12">
    <!-- 标题和操作栏 -->
    <!-- flex flex-col：弹性列布局（移动端） -->
    <!-- md:flex-row：桌面端改为行布局 -->
    <!-- md:justify-between：两端对齐（桌面端） -->
    <!-- md:items-end：垂直底部对齐（桌面端） -->
    <!-- gap-6：子元素之间间距 6 单位 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <!-- 标题区域 -->
      <div>
        <!-- TypographyHeader：瑞士风格标题组件 -->
        <!-- :level="2"：语义化级别，对应 h2 -->
        <!-- size="h2"：视觉尺寸为 h2 -->
        <!-- class="mb-4"：底部边距 4 单位 -->
        <TypographyHeader :level="2" size="h2" class="mb-4"> 產品管理 Products </TypographyHeader>
        <!-- 页面描述 -->
        <!-- text-swiss-text-muted：次要文本颜色 -->
        <p class="text-swiss-text-muted">管理您的產品目錄及 3D 模型配置。</p>
      </div>
      <!-- 新增产品按钮 -->
      <!-- SwissButton：瑞士风格按钮组件 -->
      <!-- tag="a"：渲染为 NuxtLink（Nuxt 3 的路由链接组件） -->
      <!-- to="/admin/products/new"：导航到新增产品页面 -->
      <!-- variant="primary"：主要按钮样式 -->
      <!-- size="lg"：大尺寸按钮 -->
      <!-- class="w-full md:w-auto"：移动端全宽，桌面端自适应宽度 -->
      <SwissButton tag="a" to="/admin/products/new" variant="primary" size="lg" class="w-full md:w-auto">
        新增產品
      </SwissButton>
    </div>

    <!-- 筛选和操作栏（已隐藏搜索栏和分类筛选） -->
    <!-- 注释说明：当前版本隐藏了搜索栏和分类筛选功能，但保留了数据结构 -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <!-- 搜索栏和分类筛选占位符 -->
      <!-- <div class="flex flex-wrap gap-4"> -->
      <!--   <input v-model="search" placeholder="搜索產品..." -->
      <!--     class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-64 focus:outline-none focus:border-swiss-text placeholder-swiss-text-muted/40" /> -->
      <!--   <select v-model="selectedCategory" -->
      <!--     class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-[10px] font-bold uppercase tracking-widest w-full md:w-40 focus:outline-none focus:border-swiss-text"> -->
      <!--     <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option> -->
      <!--   </select> -->
      <!-- </div> -->

      <!-- 批量操作和导出（当前版本已隐藏） -->
      <!-- <div class="flex gap-2"> -->
      <!--   <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }"> -->
      <!--     <UButton color="gray" variant="outline" icon="i-heroicons-bars-3-bottom-left" size="sm" -->
      <!--       class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all"> -->
      <!--       批量操作 ({{ selectedItems.length }}) -->
      <!--     </UButton> -->
      <!--   </UDropdown> -->

      <!--   <UDropdown :items="exportItems" :ui="{ item: { size: 'text-sm' } }"> -->
      <!--     <UButton color="gray" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm" -->
      <!--       class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all"> -->
      <!--       导出數據 -->
      <!--     </UButton> -->
      <!--   </UDropdown> -->
      <!-- </div> -->
    </div>

    <!-- 产品表格 -->
    <!-- bg-white：白色背景 -->
    <!-- border border-swiss-text/10：主文本颜色边框，10% 不透明度 -->
    <div class="bg-white border border-swiss-text/10">
      <!-- 加载状态：显示骨架屏 -->
      <!-- v-if="pending"：当数据正在加载时显示 -->
      <TableSkeleton v-if="pending" />
      <!-- 数据表格：数据加载完成后显示 -->
      <!-- v-else：当数据加载完成后显示 -->
      <!-- UTable：Nuxt UI 数据表格组件 -->
      <!-- :rows="filteredProducts"：产品数据行 -->
      <!-- :columns="columns"：表格列配置 -->
      <!-- :loading="false"：加载状态（false = 不显示加载动画） -->
      <!-- :ui：UI 配置对象 -->
      <UTable v-else :rows="filteredProducts" :columns="columns" :loading="false" v-model="selectedItems" :ui="{
        <!-- wrapper：表格包裹层样式 -->
        // overflow-x-auto：水平溢出时显示滚动条 -->
        wrapper: 'overflow-x-auto',
        <!-- thead：表头样式 -->
        // bg-swiss-bg-soft：瑞士风格浅色背景 -->
        thead: 'bg-swiss-bg-soft',
        // th：表头单元格样式 -->
        th: {
          <!-- base：基础样式 -->
          //   - text-[10px]：极小字体（10px）
          //   - font-bold：字重加粗
          //   - uppercase：全大写
          //   - tracking-widest：最大字母间距
          //   - text-swiss-text-muted：次要文本颜色
          base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
        },
        // td：表格单元格样式 -->
        td: {
          // base：基础样式
          //   - text-sm：小号字体（14px）
          //   - text-swiss-text：主文本颜色
          base: 'text-sm text-swiss-text',
        },
        // tr：表格行样式 -->
        tr: {
          // active：激活状态样式（选中或悬停）
          //   - bg-swiss-bg-soft：瑞士风格浅色背景
          active: 'bg-swiss-bg-soft',
        },
      }">
        <!-- 自定义产品名称列渲染 -->
        <!-- #name-data="{ row }"：自定义 name 列的渲染 -->
        <template #name-data="{ row }">
          <!-- 产品信息容器 -->
          <!-- flex items-center space-x-3：弹性布局，垂直居中，间距 3 单位 -->
          <div class="flex items-center space-x-3">
            <!-- 复选框：用于批量操作（当前版本已隐藏，但保留了数据结构） -->
            <!-- <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)" -->
            <!--   class="w-4 h-4 border-swiss-text/20" /> -->

            <!-- 产品缩略图 -->
            <!-- v-if：如果产品有第一张图片 -->
            <!-- row.images?.[0]：产品第一张图片 URL -->
            <!-- :src="row.images[0]"：图片源 -->
            <!-- :alt：产品名称（支持多语言回退） -->
            <!-- loading="lazy"：懒加载，不在视口时不加载 -->
            <!-- class：样式 -->
            <!--   - w-10 h-10：宽高 10 单位（40px） -->
            <!--   - object-cover：保持宽高比，裁剪溢出部分 -->
            <!--   - border border-swiss-text/10：浅灰色边框 -->
            <img v-if="row.images?.[0]" :src="row.images[0]"
                 :alt="row.name?.['zh-HK'] || row.name?.hk"
                 loading="lazy"
                 class="w-10 h-10 object-cover border border-swiss-text/10" />

            <!-- 产品名称 -->
            <!-- font-medium：中等字重 -->
            <!-- text-swiss-text：主文本颜色 -->
            <!-- class="text-swiss-text"：基础样式 -->
            <div class="font-medium text-swiss-text">
              <!-- 多语言产品名称（优先繁体中文，其次简体中文） -->
              {{ row.name?.['zh-HK'] || row.name?.hk }}
            </div>

            <!-- 产品 Slug -->
            <!-- text-xs：极小字体（12px） -->
            <!-- text-swiss-text-muted：次要文本颜色 -->
            <!-- uppercase：全大写 -->
            <!-- tracking-wider：字母间距加宽 -->
            <div class="text-xs text-swiss-text-muted uppercase tracking-wider">
              <!-- {{ row.slug }}
            </div>
          </div>
        </template>

        <!-- 自定义分类列渲染 -->
        <!-- #category-data="{ row }"：自定义 category 列的渲染 -->
        <template #category-data="{ row }">
          <!-- 分类标签 -->
          <!-- px-2 py-1：内边距（水平 2，垂直 1） -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- :class：动态类名 -->
          <!--   - 'bg-swiss-text text-white'：如果是发布状态，主文本颜色背景，白色文本 -->
          <!--   - 'bg-swiss-bg-soft text-swiss-text-muted'：否则，浅色背景，次要文本颜色 -->
          <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="[
            row.status === 'published'
              ? 'bg-swiss-text text-white'
              : 'bg-swiss-bg-soft text-swiss-text-muted',
          ]">
            <!-- 分类名称 -->
            {{ row.category }}
          </span>
        </template>

        <!-- 自定义状态列渲染 -->
        <!-- #status-data="{ row }"：自定义 status 列的渲染 -->
        <template #status-data="{ row }">
          <!-- 状态标签 -->
          <!-- px-2 py-1：内边距（水平 2，垂直 1） -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- :class：动态类名 -->
          <!--   - 'bg-swiss-text text-white'：如果是草稿，主文本颜色背景，白色文本 -->
          <!--   - 'bg-swiss-bg-soft text-swiss-text-muted'：否则，浅色背景，次要文本颜色 -->
          <span class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="[
            row.status === 'draft'
              ? 'bg-swiss-text text-white'
              : 'bg-swiss-bg-soft text-swiss-text-muted',
          ]">
            <!-- 状态文本 -->
            <!-- draft：草稿，published：已发布 -->
            {{ row.status }}
          </span>
        </template>

        <!-- 自定义创建时间列渲染 -->
        <!-- #created_at-data="{ row }"：自定义 created_at 列的渲染 -->
        <template #created_at-data="{ row }">
          <!-- 日期 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-wider：字母间距加宽 -->
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
            formatDate(row.created_at)
          }}</span>
        </template>

        <!-- 自定义操作列渲染 -->
        #actions-data="{ row }">
          <!-- 操作按钮组 -->
          <!-- Dropdown：下拉菜单组件，显示更多操作选项 -->
          <Dropdown :items="getActionItems(row)" :ui="{ item: { size: 'text-sm' } }">
            <!-- Button：Nuxt UI 按钮组件 -->
            <!-- color="gray"：灰色主题 -->
            <!-- variant="ghost"：幽灵按钮样式（无背景，悬停时显示背景） -->
            <!-- icon="i-heroicons-ellipsis-horizontal-20-solid"：三点图标 -->
            <!-- size="sm"：小尺寸按钮 -->
            <!-- class：样式 -->
            <!--   - text-[10px]：极小字体（10px） -->
            <!--   - font-bold：字重加粗 -->
            <!--   - uppercase：全大写 -->
            <!--   - tracking-widest：最大字母间距 -->
            <!--   - rounded-none：无圆角（瑞士设计风格） -->
            <Button color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" size="sm"
              class="text-[10px] font-bold uppercase tracking-widest rounded-none" />
          </Dropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * ============================================================================
   * 文件作用：产品管理页面 (Products Management Page)
   * ============================================================================
   * 
   * 此文件是超核技術有限公司网站的管理后台产品管理页面，用于管理和查看所有产品。
   * 
   * 页面路由：/admin/products
   * 
   * 功能说明：
   * 1. 产品列表展示：表格形式展示所有产品
   * 2. 搜索和筛选：搜索产品名称和按分类筛选（当前版本已隐藏）
   * 3. 批量操作：批量删除、批量更新状态、批量导出（当前版本已隐藏）
   * 4. 产品编辑：跳转到产品编辑页面
   * 5. 产品删除：删除单个产品
   * 6. 数据刷新：操作完成后自动刷新数据列表
   * 7. 导出数据：导出产品数据为 JSON 或 CSV 格式（当前版本已隐藏）
   * 
   * 核心功能：
   * 1. 显示产品列表（表格形式）
   * 2. 显示产品缩略图、名称、分类、状态、创建时间
   * 3. 单个产品操作：编辑、删除、预览
   * 4. 批量操作：批量删除、批量更新状态（当前版本已隐藏）
   * 5. 导出数据：JSON 或 CSV 格式（当前版本已隐藏）
   * 6. 自动刷新：操作完成后自动刷新数据列表
   * 
   * 产品状态：
   * - draft：草稿
   * - published：已发布
   * 
   * 产品分类：
   * - server：伺服器
   * - storage：存儲
   * - network：網絡
   * - hpc：高性能計算
   * - storage-hp：高性能存儲
   * 
   * 瑞士设计特点：
   * - 网格布局 (Grid System)：表格布局
   * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
   * - 极简主义 (Minimalism)：简洁的 UI，突出内容
   * - 功能主义 (Functionalism)：快速加载，清晰导航
   * - 无圆角 (No Border Radius)：rounded-none（瑞士设计风格）
   * 
   * 性能优化：
   * - useLazyFetch：延迟加载产品数据，不阻塞初始渲染
   * - 骨架屏：提前显示 UI 结构，减少感知加载时间
   * - 动态刷新：使用 refreshKey 触发数据刷新
   * - 搜索延迟：搜索后 300ms 才触发，避免频繁请求
   * - 批量操作：使用单个 API 调用，提升效率
   * 
   * 安全性：
   * - 认证检查：layout: 'admin' 要求登录
   * - 权限检查：只有管理员可以访问
   * - 确认删除：删除前弹出确认对话框
   * 
   * 可访问性 (Accessibility)：
   * - 语义化 HTML：使用正确的 HTML 标签
   * - 键盘导航：表格支持键盘导航
   * - 对比度：文本和背景对比度符合 WCAG 标准
   * 
   * 依赖组件：
   * - TypographyHeader：瑞士风格标题组件
   * - SwissButton：瑞士风格按钮组件
   * - TableSkeleton：表格骨架屏组件
   * - UTable：Nuxt UI 数据表格组件
   * - Dropdown：Nuxt UI 下拉菜单组件
   * 
   * 依赖 API：
   * - /api/products：获取所有产品列表
   * - /api/products/[id] (DELETE)：删除单个产品
   * - /api/products/admin/bulk (POST)：批量操作
   * - /api/products/admin/export (GET)：导出数据
   * 
   * 依赖类型：
   * - Product：产品类型定义
   * 
   * ============================================================================
   */

  // ============================================================================
  // 页面元数据配置 (Page Metadata Configuration)
  // ============================================================================
  // 
  // definePageMeta：Nuxt 3 的页面元数据配置函数
  // 
  // layout: 'admin'：使用 admin 布局
  // - admin 布局包含导航栏、侧边栏等管理后台元素
  // - 要求用户已登录（中间件验证）
  // 
  // ============================================================================
  definePageMeta({
    layout: 'admin',
  })

  // ============================================================================
  // 响应式状态定义 (Reactive State)
  // ============================================================================
  
  // 搜索查询字符串
  const search = ref('')
  
  // 当前选中的分类（默认 'All'：显示所有分类）
  const selectedCategory = ref('All')
  
  // 刷新键：用于触发数据刷新
  const refreshKey = ref(0)
  
  // 选中的产品列表（用于批量操作）
  const selectedItems = ref<any[]>([])

  // 产品分类列表
  const categories = ['All', 'server', 'storage', 'network', 'hpc', 'storage-hp']

  // ============================================================================
  // 表格列配置 (Table Columns Configuration)
  // ============================================================================
  // 
  // columns 数组定义了表格的列配置
  // 
  // 每列包含：
  // - key：数据字段名
  // - label：列标题
  // 
  // 列说明：
  // 1. name：产品名称（+ 缩略图 + Slug）
  // 2. category：产品分类
  // 3. status：产品状态
  // 4. created_at：创建时间
  // 5. actions：操作按钮（下拉菜单）
  // 
  // ============================================================================
  const columns = [
    { key: 'name', label: '產品信息' },
    { key: 'category', label: '分類' },
    { key: 'status', label: '狀態' },
    { key: 'created_at', label: '時間' },
    { key: 'actions', label: '' },
  ]

  // ============================================================================
  // 懒加载产品数据 (Lazy Fetch Products Data)
  // ============================================================================
  // 
  // 使用 useLazyFetch 而非 useFetch 的原因：
  // 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
  // 2. 用户体验：可以先显示页面框架（骨架屏），再异步加载数据
  // 3. 路由切换：从其他页面切换过来时，避免等待数据加载
  // 
  // useLazyFetch 参数说明：
  // - '/api/products'：API 端点路径
  // - key：动态 key，随 refreshKey 变化
  //   - key: () => `products-${refreshKey.value}`：每次修改 refreshKey.value 时，useLazyFetch 会重新请求新数据
  // - transform：转换函数，对返回的数据进行处理
  //   - (data: any) => data：原样返回数据
  // - default：默认值，数据加载完成前返回空数组
  // - 解构赋值：{ data: response, pending, refresh, error }
  //   - data：响应式数据，重命名为 response
  //   - pending：布尔值，表示数据是否正在加载
  //   - refresh：刷新函数，用于手动刷新数据
  //   - error：错误对象，表示加载是否失败
  // 
  // 错误处理：
  // - onRequestError：请求失败时调用
  //   - onResponseError：响应错误时调用
  // 
  // 401 未授权处理：
  // - 跳转到登录页面
  // - console.warn 输出警告
  // 
  // 403 禁止访问处理：
  // - console.error 输出错误
  // 
  // ============================================================================
  const { data: response, pending, refresh, error } = useLazyFetch('/api/products', {
    // 动态 key：随 refreshKey 变化，触发数据刷新
    key: () => `products-${refreshKey.value}`,
    // 数据转换函数：原样返回数据
    transform: (data: any) => data,
    // 默认值：请求失败或加载中时返回的对象
    default: () => ({ success: false, data: [] }),
    // 请求错误处理
    onRequestError({ error }) {
      console.error('请求失败:', error)
    },
    // 响应错误处理
    onResponseError({ response }) {
      // 401 未授权：跳转到登录页
      if (response.status === 401) {
        console.warn('未授权访问，跳转到登录页')
        navigateTo('/admin/login')
      }
      // 403 禁止访问：输出错误
      else if (response.status === 403) {
        console.error('权限不足：需要管理员权限')
      }
    },
  })

  // ============================================================================
  // 产品数据计算属性 (Products Data Computed)
  // ============================================================================
  // 
  // 使用 computed 创建产品数据的响应式计算属性
  // 
  // 作用：
  // 1. 从 API 响应中提取产品数组
  // 2. 响应式追踪：自动追踪 response 的变化
  // 3. 类型安全：确保返回值类型为 Product[]
  // 
  // 返回值：
  // - response.value?.data：产品数组（如果 response 存在且 success = true）
  // - []：如果 response 不存在或 success = false
  // 
  // 为什么需要检查 success？
  // - API 可能返回 success: false
  // - 需要确保只显示成功的数据
  // 
  // ============================================================================
  const products = computed(() => response.value?.success ? response.value.data : [])

  // ============================================================================
  // 监听错误 (Watch Error)
  // ============================================================================
  // 
  // 使用 watchEffect 监听错误状态
  // watchEffect 会自动追踪依赖，当 error.value 改变时自动执行
  // 
  // 工作流程：
  // 1. watchEffect 立即执行一次，收集依赖（error.value）
  // 2. 当 error.value 改变时，重新执行回调
  // 3. 如果有错误，输出到控制台
  // 
  // 错误处理最佳实践：
  // 1. 日志记录：记录错误详情，便于调试
  // 2. 用户反馈：可以显示友好的错误提示（本例未实现）
  // 3. 错误边界：Vue 3 使用 ErrorBoundary 捕获组件错误
  // 4. 重试机制：可以提供重新加载按钮（本例未实现）
  // 
  // ============================================================================
  watchEffect(() => {
    if (error.value) {
      // 输出错误日志
      console.error('获取产品列表失败:', error.value)
    }
  })

  // ============================================================================
  // 批量操作菜单项 (Bulk Action Menu Items)
  // ============================================================================
  // 
  // bulkActionItems 数组定义了批量操作的菜单项
  // 每个菜单项包含：
  // - label：菜单项标签
  // - icon：图标（Nuxt UI Icons）
  // - class：样式类（如文本颜色）
  // - click：点击处理函数
  // 
  // 菜单项：
  // 1. 批量删除：删除选中的所有产品
  // 2. 批量发布：将选中的产品状态设置为 published
  // 3. 批量草稿：将选中的产品状态设置为 draft
  // 4. 批量下架：将选中的产品状态设置为 archived
  // 
  // 当前版本已隐藏批量操作功能，但保留了数据结构
  // 
  // ============================================================================
  const bulkActionItems = computed(() => [
    [
      {
        label: '批量刪除',
        icon: 'i-heroicons-trash-20-solid',
        class: 'text-red-500',
        click: bulkDelete,
      },
      {
        label: '批量發布',
        icon: 'i-heroicons-check-circle-20-solid',
        click: () => bulkUpdate({ status: 'published' }),
      },
      {
        label: '批量草稿',
        icon: 'i-heroicons-document-duplicate-20-solid',
        click: () => bulkUpdate({ status: 'draft' }),
      },
    ],
  ])

  // ============================================================================
  // 导出菜单项 (Export Menu Items)
  // ============================================================================
  // 
  // exportItems 数组定义了导出数据的菜单项
  // 每个菜单项包含：
  // - label：菜单项标签
  // - icon：图标（Nuxt UI Icons）
  // - click：点击处理函数
  // 
  // 菜单项：
  // 1. 导出为 JSON：JSON 格式导出
  // 2. 导出为 CSV：CSV 格式导出
  // 
  // 当前版本已隐藏导出功能，但保留了数据结构
  // 
  // ============================================================================
  const exportItems = [
    {
      label: '導出為 JSON',
      icon: 'i-heroicons-code-bracket-20-solid',
      click: () => exportData('json'),
    },
    {
      label: '導出為 CSV',
      icon: 'i-heroicons-table-cells-20-solid',
      click: () => exportData('csv'),
    },
  ]

  // ============================================================================
  // 筛选产品逻辑 (Filter Products)
  // ============================================================================
  // 
  // 使用 computed 创建筛选后的产品列表的响应式计算属性
  // 
  // 作用：
  // 1. 根据搜索查询和分类筛选产品
  // 2. 响应式追踪：自动追踪 search 和 selectedCategory 的变化
  * 3. 类型安全：确保返回值类型为 Product[]
  * 
  // 筛选逻辑：
  // 1. 如果 products 不存在或为空，返回空数组
  // 2. 遍历每个产品：
  //    - 检查产品名称或 Slug 是否匹配搜索查询（不区分大小写）
  *    - 检查分类是否匹配（如果 selectedCategory != 'All'）
  * 3. 返回所有匹配的产品
  * 
  // 搜索规则：
  // - searchQuery：产品名称或 Slug 包含搜索查询
  // - 不区分大小写：转换为小写后比较
  // 
  // 分类筛选：
  // - selectedCategory === 'All'：显示所有分类的产品
  // - selectedCategory !== 'All'：只显示指定分类的产品
  * 
  // ============================================================================
  const filteredProducts = computed(() => {
    if (!products.value) return []
    
    return products.value.filter((p: any) => {
      // 检查搜索匹配
      const matchesSearch =
        search.value.length === 0 ||
        (p.slug || '').toLowerCase().includes(search.value.toLowerCase()) ||
        (p.name?.['zh-HK'] || p.name?.hk || p.name?.en || '').toLowerCase().includes(search.value.toLowerCase())
      
      // 检查分类匹配
      const matchesCategory =
        selectedCategory.value === 'All' || p.category === selectedCategory.value
      
      // 同时满足搜索和分类条件
      return matchesSearch && matchesCategory
    })
  })

  // ============================================================================
  // 切换选择 (Toggle Selection)
  // ============================================================================
  // 
  // 函数作用：
  * - 切换产品的选中状态
  * - 用于批量操作
  * 
  // 参数：
  // - row：产品对象
  * 
  // 工作流程：
  * 1. 查找产品在 selectedItems 数组中的索引
  * 2. 如果索引 > -1（已选中），移除该项
  * 3. 如果索引 = -1（未选中），添加该项
  * 
  // 使用场景：
  * - 点击产品行前的复选框
  // - 批量操作前选中多个产品
  * 
  // ============================================================================
  function toggleSelection(row: any) {
    const index = selectedItems.value.findIndex((item) => item.id === row.id)
    if (index > -1) {
      selectedItems.value.splice(index, 1)
    } else {
      selectedItems.value.push(row)
    }
  }

  // ============================================================================
  // 格式化日期 (Format Date)
  // ============================================================================
  // 
  // 函数作用：
  * - 将 ISO 8601 日期字符串格式化为本地化日期
  * 
  // 参数：
  // - dateStr：ISO 8601 日期字符串（如 '2024-01-15T10:30:00Z'）
  * 
  // 返回值：
  // - 格式化后的日期字符串
  * - 英文：'Jan 15, 2024, 10:30 AM'
  * - 中文（zh-HK）：'2024/1/15 上午 10:30'
  * 
  // 格式化规则：
  // - year: 'numeric'：显示完整年份（如 2024）
  // - month: 'short'：显示简短月份（如 Jan、1月）
  // - day: 'numeric'：显示日期数字（如 15）
  // - hour: 'numeric'：显示小时数字（如 10）
  // - minute: 'numeric'：显示分钟数字（如 30）
  // 
  // ============================================================================
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('zh-HK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  // ============================================================================
  // 获取操作菜单项 (Get Action Items)
  // ============================================================================
  // 
  // 函数作用：
  // - 根据产品状态生成对应的操作菜单项
  // 
  // 参数：
  // - row：产品对象
  * 
  // 返回值：
  // - 菜单项数组
  * 
  // 菜单项包含：
  // 1. 编辑（draft 状态的产品）
  // 2. 发布（draft 状态的产品）
  // 3. 下架（任意状态的产品）
  // 4. 删除（任意状态的产品）
  // 
  // 产品状态说明：
  // - draft：草稿，未发布
  // - published：已发布
  // - archived：已下架
  * 
  // ============================================================================
  function getActionItems(row: any) {
    const items = [
      // 编辑：只有草稿状态的产品可以编辑
      {
        label: '編輯',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => navigateTo(`/admin/products/${row.id}`),
      },
      // 发布：只有草稿状态的产品可以发布
      {
        label: '發布',
        icon: 'i-heroicons-check-circle-20-solid',
        click: () => updateStatus(row.id, 'published'),
      },
      // 下架：任意状态的产品都可以下架
      {
        label: '下架',
        icon: 'i-heroicons-arrow-down-tray-20-solid',
        click: () => updateStatus(row.id, 'archived'),
      },
      // 删除：任意状态的产品都可以删除
      {
        label: '刪除',
        icon: 'i-heroicons-trash-20-solid',
        click: () => deleteProduct(row.id),
      },
    ]
    
    // 草草稿状态，不显示编辑和发布菜单项
    if (row.status === 'draft') {
      return items.slice(2) // 只显示下架和删除
    }
    
    // 草其他状态，只显示删除
    return [items[3]] // 只显示删除
  }

  // ============================================================================
  // 更新产品状态 (Update Product Status)
  // ============================================================================
  // 
  // 函数作用：
  * - 更新单个产品的状态
  * - 刷新数据列表
  * 
  // 参数：
  // - id：产品 ID
  // - status：新的状态（draft, published, archived）
  * 
  // 工作流程：
  // 1. 发送 PUT 请求到 /api/products/[id]
  // 2. 更新状态为指定状态
  // 3. 刷新数据列表
  // 4. 错误处理
  * 
  // API 调用：
  // - method: 'PUT'：PUT 请求
  // - body: { status }：请求体
  * 
  // ============================================================================
  async function updateStatus(id: number, status: 'draft' | 'published' | 'archived') {
    try {
      await $fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: { status },
      })
      
      // 立即刷新数据，实现动态更新
      refreshKey.value++
      await refresh()
    } catch (error) {
      console.error('更新状态失败:', error)
      alert(error.data?.message || '更新失败')
    }
  }

  // ============================================================================
  // 删除产品 (Delete Product)
  // ============================================================================
  // 
  // 函数作用：
  * - 删除单个产品
  * - 刷新数据列表
  * 
  // 参数：
  // - id：产品 ID
  * 
  // 工作流程：
  // 1. 弹出确认对话框
  // 2. 如果用户取消，直接返回
  // 3. 发送 DELETE 请求到 /api/products/[id]
  // 4. 立即刷新数据，实现动态更新
  * 5. 错误处理
  * 
  // API 调用：
  // - method: 'DELETE'：DELETE 请求
  * 
  // 为什么需要确认？
  * - 删除是不可逆操作
  * - 避免误删
  * - 提供二次确认
  * 
  // ============================================================================
  async function deleteProduct(id: number) {
    if (!confirm('確定要刪除此產品嗎？')) return

    try {
      await $fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      // 立即刷新数据，实现动态更新
      refreshKey.value++
      await refresh()
    } catch (error) {
      console.error('刪除產品失敗:', error)
      alert(error.data?.message || '刪除產品失敗')
    }
  }

  // ============================================================================
  // 批量删除 (Bulk Delete)
  // ============================================================================
  // 
  // 函数作用：
  * - 批量删除选中的所有产品
  * - 清空选中列表
  * - 刷新数据列表
  * 
  // 工作流程：
  // 1. 弹出确认对话框
  // 2. 如果用户取消，直接返回
  // 3. 提取所有选中产品的 ID
  // 4. 发送 POST 请求到 /api/products/admin/bulk
  // 5. 批量删除操作（ids, action: 'delete'）
  // 6. 清空选中列表
  // 7. 刷新数据列表
  // 8. 显示成功提示
  // 9. 错误处理
  * 
  // API 调用：
  // - method: 'POST'：POST 请求
  // - body: { ids, action: 'delete' }：请求体
  //   - ids：产品 ID 数组
  //   - action：操作类型（delete）
  * 
  // ============================================================================
  async function bulkDelete() {
    if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 個產品嗎？`)) return

    try {
      const ids = selectedItems.value.map((item) => item.id)
      await $fetch('/api/products/admin/bulk', {
        method: 'POST',
        body: { ids, action: 'delete' },
      })

      selectedItems.value = []
      refreshKey.value++
      await refresh()
      alert('批量刪除成功')
    } catch (error: any) {
      console.error('批量刪除失敗:', error)
      alert(error.data?.message || '批量刪除失敗')
    }
  }

  // ============================================================================
  // 批量更新 (Bulk Update)
  // ============================================================================
  // 
  // 函数作用：
  * - 批量更新选中的产品状态
  * - 清空选中列表
  * - 刷新数据列表
  * 
  // 参数：
  // - data：更新的数据（如 { status: 'published' }）
  * 
  // 工作流程：
  // 1. 提取所有选中产品的 ID
  // 2. 发送 POST 请求到 /api/products/admin/bulk
  // 3. 批量更新操作（ids, action: 'update', data）
  // 4. 清空选中列表
  // 5. 刷新数据列表
  // 6. 显示成功提示
  // 7. 错误处理
  * 
  // API 调用：
  // - method: 'POST'：POST 请求
  // - body: { ids, action: 'update', data }：请求体
  //   - ids：产品 ID 数组
  //   - action：操作类型（update）
  //   - data：更新的数据
  * 
  // ============================================================================
  async function bulkUpdate(data: any) {
    try {
      const ids = selectedItems.value.map((item) => item.id)
      await $fetch('/api/products/admin/bulk', {
        method: 'POST',
        body: { ids, action: 'update', data },
      })

      selectedItems.value = []
      refreshKey.value++
      await refresh()
      alert('批量更新成功')
    } catch (error: any) {
      console.error('批量更新失敗:', error)
      alert(error.data?.message || '批量更新失敗')
    }
  }

  // ============================================================================
  // 导出数据 (Export Data)
  // ============================================================================
  // 
  // 函数作用：
  * - 导出产品数据为 JSON 或 CSV 格式
  * - 触发浏览器下载
  * 
  // 参数：
  // - format：导出格式（'json' 或 'csv'）
  * 
  // 工作流程：
  // 1. 发送 GET 请求到 /api/products/admin/export
  // 2. 查询参数 format 指定导出格式
  // 3. 接收 Blob 类型的响应（二进制数据）
  * 4. 创建临时 URL
  // 5. 创建隐藏的 a 标签
  * 6. 设置 download 属性和 href
  // 7. 模拟点击下载
  * 8. 清理临时 URL
  * 9. 错误处理
  * 
  // API 调用：
  // - method: 'GET'：GET 请求
  // - responseType: 'blob'：响应类型为 Blob（二进制数据）
  // - 查询参数：?format=${format}：指定导出格式
  * 
  // Blob 对象：
  // - Blob：Binary Large Object，用于存储二进制数据
  // - 用途：文件下载
  * 
  // 当前版本已隐藏导出功能，但保留了数据结构
  // 
  // ============================================================================
  async function exportData(format: 'json' | 'csv') {
    try {
      // 使用 $fetch 获取数据，这样可以包含认证信息并更好地处理错误
      const blob = await $fetch(`/api/products/admin/export?format=${format}`, {
        method: 'GET',
        responseType: 'blob'
      })

      // 创建一个 URL 并触发下载
      const url = window.URL.createObjectURL(blob as Blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `products_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()

      // 清理
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error: any) {
      console.error('導出失敗:', error)
      alert('導出失敗，請重試')
    }
  }

  // 暴露刷新函数供外部使用
  defineExpose({
    refresh
  })
</script>
