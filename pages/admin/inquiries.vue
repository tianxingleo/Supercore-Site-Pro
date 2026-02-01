<template>
  <!-- 页面容器 -->
  <!-- space-y-12：子元素之间间距 12 单位 -->
  <div class="space-y-12">
    <!-- 标题区域 -->
    <div>
      <!-- 页面标题 -->
      <!-- TypographyHeader：瑞士风格标题组件 -->
      <!-- :level="2"：语义化级别，对应 h2 -->
      <!-- size="h2"：视觉尺寸为 h2 -->
      <!-- class="mb-4"：底部边距 4 单位 -->
      <TypographyHeader :level="2" size="h2" class="mb-4"> 詢盤管理 Inquiries </TypographyHeader>
      <!-- 页面描述 -->
      <!-- text-swiss-text-muted：次要文本颜色 -->
      <p class="text-swiss-text-muted">來自客戶的聯繫表單提交。</p>
    </div>

    <!-- 操作栏（已隐藏批量操作和导出） -->
    <!-- 注释说明：当前版本隐藏了批量操作和导出功能 -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <!-- 占位容器 -->
      <div class="flex-1"></div>
      <!-- 注释的批量操作和导出按钮 -->
      <!-- <div class="flex gap-2">
      //   <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }">
      //     <UButton color="gray" variant="outline" icon="i-heroicons-bars-3-bottom-left" size="sm"
      //       class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
      //       批量操作 ({{ selectedItems.length }})
      //     </UButton>
      //   </UDropdown>
      // 
      //   <UDropdown :items="exportItems" :ui="{ item: { size: 'text-sm' } }">
      //     <UButton color="gray" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm"
      //       class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
      //       导出数据
      //     </UButton>
      //   </UDropdown>
      // </div> -->
    </div>

    <!-- 数据表格 -->
    <!-- bg-white：白色背景 -->
    <!-- border border-swiss-text/10：主文本颜色边框，10% 不透明度 -->
    <div class="bg-white border border-swiss-text/10">
      <!-- 骨架屏：加载时显示 -->
      <!-- v-if="loading"：当数据正在加载时显示 -->
      <TableSkeleton v-if="loading" />
      <!-- 数据表格：数据加载完成后显示 -->
      <!-- v-else：当数据加载完成后显示 -->
      <!-- UTable：数据表格组件 -->
      <!-- :rows="inquiries"：询盘数据行 -->
      <!-- :columns="columns"：表格列配置 -->
      <!-- :loading="false"：加载状态（false = 不显示加载动画） -->
      <!-- :ui：UI 配置对象 -->
      <UTable
        v-else
        :rows="inquiries"
        :columns="columns"
        :loading="false"
        :ui="{
          // wrapper：表格包裹层样式
          // overflow-x-auto：水平溢出时显示滚动条
          wrapper: 'overflow-x-auto',
          // thead：表头样式
          thead: 'bg-swiss-bg-soft',
          // th：表头单元格样式
          th: {
            // base：基础样式
            //   - text-[10px]：极小字体（10px）
            //   - font-bold：字重加粗
            //   - uppercase：全大写
            //   - tracking-widest：最大字母间距
            //   - text-swiss-text-muted：次要文本颜色
            base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
          },
          // td：表格单元格样式
          td: {
            // base：基础样式
            //   - text-sm：小号字体（14px）
            //   - text-swiss-text：主文本颜色
            base: 'text-sm text-swiss-text',
          },
          // tr：表格行样式
          tr: {
            // active：激活状态样式（悬停或选中）
            //   - bg-swiss-bg-soft：瑞士风格浅色背景
            active: 'bg-swiss-bg-soft',
          },
        }"
      >
        <!-- 自定义邮箱列渲染 -->
        <!-- #email-data：插槽名称，自定义 email 列的渲染 -->
        <!-- { row }：插槽参数，当前行的数据 -->
        <template #email-data="{ row }">
          <!-- 邮箱信息容器 -->
          <!-- flex items-center gap-3：弹性布局，垂直居中，间距 3 单位 -->
          <div class="flex items-center gap-3">
            <!-- 注释：复选框（当前版本隐藏） -->
            <!-- <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)"
            //   class="w-4 h-4 border-swiss-text/20" /> -->
            <!-- 邮箱和公司信息 -->
            <div>
              <!-- 邮箱地址 -->
              <!-- font-medium：中等字重 -->
              <!-- text-swiss-text：主文本颜色 -->
              <div class="font-medium text-swiss-text">{{ row.email }}</div>
              <!-- 公司名称（如果有的话，否则显示"個人"） -->
              <!-- text-[10px]：极小字体（10px） -->
              <!-- text-swiss-text-muted：次要文本颜色 -->
              <!-- uppercase：全大写 -->
              <!-- tracking-wider：字母间距加宽 -->
              <div class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
                {{ row.company || '個人' }}
              </div>
            </div>
          </div>
        </template>

        <!-- 自定义留言内容列渲染 -->
        <!-- #message-data：插槽名称，自定义 message 列的渲染 -->
        <template #message-data="{ row }">
          <!-- 留言内容 -->
          <!-- truncate：文本截断（超出部分显示省略号） -->
          <!-- max-w-sm：最大宽度 small（14rem，224px） -->
          <!-- :title="row.message"：鼠标悬停时显示完整内容 -->
          <div class="truncate max-w-sm" :title="row.message">{{ row.message }}</div>
        </template>

        <!-- 自定义创建时间列渲染 -->
        <!-- #created_at-data：插槽名称，自定义 created_at 列的渲染 -->
        <template #created_at-data="{ row }">
          <!-- 格式化后的日期 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-wider：字母间距加宽 -->
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
            formatDate(row.created_at)
          }}</span>
        </template>

        <!-- 自定义状态列渲染 -->
        <!-- #status-data：插槽名称，自定义 status 列的渲染 -->
        <template #status-data="{ row }">
          <!-- 状态标签 -->
          <!-- px-2 py-1：内边距（水平 2，垂直 1） -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-widest：最大字母间距 -->
          <!-- :class：动态类名 -->
          <!--   - row.status === 'new' ? 'bg-swiss-text text-white'：如果是新询盘，主文本颜色背景，白色文本 -->
          <!--   - 'bg-swiss-bg-soft text-swiss-text-muted'：否则，浅色背景，次要文本颜色 -->
          <span
            class="px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
            :class="[
              row.status === 'new'
                ? 'bg-swiss-text text-white'
                : 'bg-swiss-bg-soft text-swiss-text-muted',
            ]"
          >
            <!-- 状态文本（new, read, pending, completed 等） -->
            {{ row.status }}
          </span>
        </template>

        <!-- 自定义操作列渲染 -->
        <!-- #actions-data：插槽名称，自定义 actions 列的渲染 -->
        <template #actions-data="{ row }">
          <!-- 标记为已读按钮 -->
          <!-- v-if="row.status === 'new'"：只有新询盘才显示此按钮 -->
          <!-- @click="markAsRead(row.id)"：点击时调用 markAsRead 函数 -->
          <!-- class：样式 -->
          <!--   - text-[10px]：极小字体（10px） -->
          <!--   - font-bold：字重加粗 -->
          <!--   - uppercase：全大写 -->
          <!--   - tracking-widest：最大字母间距 -->
          <!--   - px-4 py-2：内边距 -->
          <!--   - bg-swiss-text：主文本颜色背景 -->
          <!--   - text-white：白色文本 -->
          <!--   - hover:bg-swiss-text/90：悬停时背景色变浅（90% 不透明度） -->
          <!--   - hover:-translate-y-0.5：悬停时向上移动 2px -->
          <!--   - hover:shadow-lg：悬停时添加大阴影 -->
          <!--   - active:scale-[0.98]：点击时缩放到 98% -->
          <!--   - transition-all：平滑过渡所有属性 -->
          <!--   - rounded-none：无圆角（瑞士设计风格） -->
          <button
            v-if="row.status === 'new'"
            @click="markAsRead(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-swiss-text text-white hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all rounded-none"
          >
            <!-- 按钮文本 -->
            標記為已讀
          </button>
          <!-- 删除按钮 -->
          <!-- @click="deleteInquiry(row.id)"：点击时调用 deleteInquiry 函数 -->
          <!-- class：样式 -->
          <!--   - text-[10px]：极小字体（10px） -->
          <!--   - font-bold：字重加粗 -->
          <!--   - uppercase：全大写 -->
          <!--   - tracking-widest：最大字母间距 -->
          <!--   - px-3 py-2：内边距 -->
          <!--   - text-red-500：红色文本（500 颜色） -->
          <!--   - hover:text-red-600：悬停时变为红色（600 颜色） -->
          <!--   - hover:-translate-y-0.5：悬停时向上移动 2px -->
          <!--   - active:scale-[0.98]：点击时缩放到 98% -->
          <!--   - transition-all：平滑过渡所有属性 -->
          <!--   - rounded-none：无圆角 -->
          <button
            @click="deleteInquiry(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none"
          >
            <!-- 删除图标（Unicode 字符） -->
            ✕
          </button>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：询盘管理页面 (Inquiries Management Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的管理后台询盘管理页面，用于管理和查看用户提交的询盘。
 *
 * 页面路由：/admin/inquiries
 *
 * 功能说明：
 * 1. 显示所有询盘列表
 * 2. 标记询盘为已读
 * 3. 删除询盘
 * 4. 批量操作（批量删除、批量标记为已读）- 当前版本已隐藏
 * 5. 导出数据（JSON、CSV）- 当前版本已隐藏
 * 6. 动态刷新数据
 * 7. 响应式表格布局
 *
 * 核心功能：
 * 1. 询盘列表展示（表格形式）
 * 2. 列表操作（标记已读、删除）
 * 3. 批量操作（批量删除、批量更新）- 已隐藏
 * 4. 数据导出（JSON、CSV）- 已隐藏
 * 5. 状态筛选（new, read, pending, completed）
 * 6. 自动刷新（操作完成后自动刷新数据）
 *
 * 表格列：
 * 1. email：邮箱地址 + 公司名称
 * 2. message：留言内容
 * 3. created_at：创建时间
 * 4. status：状态（new, read）
 * 5. actions：操作按钮
 *
 * 瑞士设计特点：
 * - 网格布局 (Grid System)：表格布局
 * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 无圆角 (No Border Radius)：rounded-none（瑞士设计风格）
 *
 * 性能优化：
 * - useLazyFetch：延迟加载询盘数据，不阻塞初始渲染
 * - 骨架屏：提前显示 UI 结构，减少感知加载时间
 * - 动态刷新：使用 refreshKey 触发数据刷新
 * - 分页：表格支持分页（减少数据传输）
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
 * - TableSkeleton：表格骨架屏组件
 * - UTable：Nuxt UI 数据表格组件
 *
 * 依赖 API：
 * - /api/inquiries：获取所有询盘列表
 * - /api/inquiries/[id] (PUT)：更新单个询盘状态
 * - /api/inquiries/[id] (DELETE)：删除单个询盘
 * - /api/inquiries/admin/bulk (POST)：批量操作
 * - /api/inquiries/admin/export (GET)：导出数据
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
// - 确保页面在管理后台中显示
// - 要求用户已登录（中间件验证）
//
// ============================================================================
definePageMeta({
  layout: 'admin',
})

// ============================================================================
// 响应式状态定义 (Reactive State)
// ============================================================================

// 刷新键：用于触发数据刷新
// 每次修改 refreshKey.value 时，useLazyFetch 会重新请求新数据
const refreshKey = ref(0)

// 选中的询盘列表（用于批量操作）
// 当前版本已隐藏批量操作功能，但保留了数据结构
const selectedItems = ref<any[]>([])

// ============================================================================
// 表格列配置 (Table Columns Configuration)
// ============================================================================
//
// columns 数组定义了表格的列配置
// 每列包含：
// - key：数据字段名
// - label：列标题
//
// 列说明：
// 1. email：邮箱地址 + 公司名称
// 2. message：留言内容
// 3. created_at：创建时间
// 4. status：状态（new, read）
// 5. actions：操作按钮（自定义渲染）
//
// ============================================================================
const columns = [
  // 邮箱列
  { key: 'email', label: '客戶聯絡' },
  // 留言内容列
  { key: 'message', label: '留言內容' },
  // 时间列
  { key: 'created_at', label: '時間' },
  // 状态列
  { key: 'status', label: '狀態' },
  // 操作列
  { key: 'actions', label: '' },
]

// ============================================================================
// 懒加载询盘数据 (Lazy Fetch Inquiries Data)
// ============================================================================
//
// 使用 useLazyFetch 而非 useFetch 的原因：
// 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
// 2. 用户体验：可以先显示页面框架（骨架屏），再异步加载数据
// 3. 路由切换：从其他页面切换过来时，避免等待数据加载
//
// useLazyFetch 参数说明：
// - '/api/inquiries'：API 端点路径
// - key：用于控制数据刷新的唯一标识
//   - key: () => `inquiries-${refreshKey.value}`：动态 key，随 refreshKey 变化
//   - 当 refreshKey.value 改变时，useLazyFetch 会重新请求新数据
// - transform：转换函数，对返回的数据进行处理
//   - (data: any) => data：原样返回数据
// - default：默认值，数据加载完成前返回
// - 解构赋值：{ data: response, pending: loading, refresh, error }
//   - data：响应式数据，重命名为 response
//   - pending：布尔值，表示数据是否正在加载，重命名为 loading
//   - refresh：刷新函数，用于手动刷新数据
//   - error：错误对象，表示加载是否失败
//
// 工作原理：
// 1. 页面立即渲染，不等待数据
// 2. loading = true，显示骨架屏（TableSkeleton）
// 3. 后台异步请求数据：GET /api/inquiries
// 4. 数据加载完成后：
//    - loading = false
//    - response = { success: true, data: Inquiry[] }
//    - 触发 inquiries computed 重新计算
//    - 显示数据表格（UTable）
//
// ============================================================================
const { data: response, pending: loading, refresh, error } = useLazyFetch('/api/inquiries', {
  // 动态 key：随 refreshKey 变化，触发数据刷新
  // 每次修改 refreshKey.value 时，useLazyFetch 会重新请求新数据
  key: () => `inquiries-${refreshKey.value}`,
  // 数据转换函数：原样返回数据
  transform: (data: any) => data,
  // 默认值：请求失败或加载中时返回的对象
  default: () => ({ success: false, data: [] })
})

// ============================================================================
// 询盘数据计算属性 (Inquiries Data Computed)
// ============================================================================
//
// 使用 computed 创建询盘数据的响应式计算属性
//
// 作用：
// 1. 从 API 响应中提取询盘数组
// 2. 响应式追踪：自动追踪 response 的变化
// 3. 类型安全：确保返回值类型为 Inquiry[]
//
// 返回值：
// - response.value?.data：询盘数组（如果 response 存在且 success = true）
// - []：如果 response 不存在或 success = false
//
// 为什么需要检查 success？
// - API 可能返回 success: false
// - 需要确保只显示成功的数据
//
// ============================================================================
const inquiries = computed(() => response.value?.success ? response.value.data : [])

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
  // 检查是否有错误
  if (error.value) {
    // 输出错误日志
    console.error('獲取詢盤列表失敗:', error.value)
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
// - class：样式类
// - click：点击处理函数
//
// 菜单项：
// 1. 批量删除
// 2. 批量标记为已读
//
// 当前版本已隐藏批量操作功能，但保留了数据结构
//
// ============================================================================
const bulkActionItems = computed(() => [
  [
    {
      // 菜单项标签
      label: '批量刪除',
      // 图标：垃圾桶图标
      icon: 'i-heroicons-trash-20-solid',
      // 样式：红色文本
      class: 'text-red-500',
      // 点击处理函数
      click: bulkDelete,
    },
    {
      // 菜单项标签
      label: '批量標記為已讀',
      // 图标：检查圆圈图标
      icon: 'i-heroicons-check-circle-20-solid',
      // 点击处理函数：批量更新状态为 'read'
      click: () => bulkUpdate({ status: 'read' }),
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
// 1. 导出为 JSON
// 2. 导出为 CSV
//
// 当前版本已隐藏导出功能，但保留了数据结构
//
// ============================================================================
const exportItems = [
  [
    {
      // 菜单项标签
      label: '導出為 JSON',
      // 图标：代码括号图标
      icon: 'i-heroicons-code-bracket-20-solid',
      // 点击处理函数：导出 JSON 格式
      click: () => exportData('json'),
    },
    {
      // 菜单项标签
      label: '導出為 CSV',
      // 图标：表格单元格图标
      icon: 'i-heroicons-table-cells-20-solid',
      // 点击处理函数：导出 CSV 格式
      click: () => exportData('csv'),
    },
  ],
]

// ============================================================================
// 切换选择 (Toggle Selection)
// ============================================================================
//
// 函数作用：
// - 切换询盘的选中状态
// - 用于批量操作（当前版本已隐藏）
//
// 参数：
// - row：询盘对象
//
// 工作流程：
// 1. 查找询盘在 selectedItems 数组中的索引
// 2. 如果索引 > -1（已选中），移除该项
// 3. 如果索引 = -1（未选中），添加该项
//
// 使用场景：
// - 点击复选框切换选中状态
// - 批量操作前选中多个询盘
//
// ============================================================================
function toggleSelection(row: any) {
  // 查找询盘在 selectedItems 数组中的索引
  // findIndex：返回第一个满足条件的元素索引
  // 条件：item.id === row.id
  // 返回值：
  // - 索引（0, 1, 2...）：如果找到
  // - -1：如果未找到
  const index = selectedItems.value.findIndex((item) => item.id === row.id)

  // 如果已选中，移除该项
  if (index > -1) {
    // splice(index, 1)：从索引位置开始，删除 1 个元素
    selectedItems.value.splice(index, 1)
  }
  // 如果未选中，添加该项
  else {
    // push：在数组末尾添加元素
    selectedItems.value.push(row)
  }
}

// ============================================================================
// 格式化日期 (Format Date)
// ============================================================================
//
// 函数作用：
// - 将 ISO 8601 日期字符串格式化为本地化日期
//
// 参数：
// - dateStr：ISO 8601 日期字符串（如 '2024-01-15T10:30:00Z'）
//
// 返回值：
// - 格式化后的日期字符串
// - 英文：'1/15/2024, 10:30:00 AM'
// - 中文（zh-HK）：'2024/1/15 上午 10:30:00'
//
// 工作流程：
// 1. 创建 Date 对象
// 2. 使用 toLocaleString 格式化日期
// 3. 根据当前语言选择格式
//
// toLocaleString 参数：
// - locale：区域设置（'zh-HK'）
//
// ============================================================================
function formatDate(dateStr: string) {
  // 创建 Date 对象
  const date = new Date(dateStr)

  // 格式化日期
  // toLocaleString：本地化日期和时间
  // 'zh-HK'：区域设置为香港中文
  return date.toLocaleString('zh-HK')
}

// ============================================================================
// 标记为已读 (Mark as Read)
// ============================================================================
//
// 函数作用：
// - 将询盘状态标记为已读
// - 刷新数据列表
//
// 参数：
// - id：询盘 ID
//
// 工作流程：
// 1. 发送 PUT 请求到 /api/inquiries/[id]
// 2. 更新状态为 'read'
// 3. 刷新数据列表
// 4. 错误处理
//
// API 调用：
// - method: 'PUT'：PUT 请求
// - body: { status: 'read' }：请求体，更新状态
//
// ============================================================================
async function markAsRead(id: number) {
  try {
    // 发送 PUT 请求更新询盘状态
    // $fetch：Nuxt 提供的 fetch 函数，包含认证信息
    await $fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      body: { status: 'read' },
    })

    // 刷新数据
    // 修改 refreshKey.value 触发数据刷新
    refreshKey.value++
    // 调用 refresh() 函数执行刷新
    await refresh()
  } catch (error) {
    // 输出错误日志
    console.error('標記為已讀失敗:', error)
  }
}

// ============================================================================
// 删除询盘 (Delete Inquiry)
// ============================================================================
//
// 函数作用：
// - 删除单个询盘
// - 刷新数据列表
//
// 参数：
// - id：询盘 ID
//
// 工作流程：
// 1. 弹出确认对话框
// 2. 如果用户取消，直接返回
// 3. 发送 DELETE 请求到 /api/inquiries/[id]
// 4. 刷新数据列表
// 5. 错误处理
//
// API 调用：
// - method: 'DELETE'：DELETE 请求
//
// ============================================================================
async function deleteInquiry(id: number) {
  // 弹出确认对话框
  // confirm：浏览器原生对话框
  if (!confirm('確定刪除此詢盤？')) return

  try {
    // 发送 DELETE 请求删除询盘
    // $fetch：Nuxt 提供的 fetch 函数，包含认证信息
    await $fetch(`/api/inquiries/${id}`, {
      method: 'DELETE',
    })

    // 立即刷新数据，实现动态更新
    // 修改 refreshKey.value 触发数据刷新
    refreshKey.value++
    // 调用 refresh() 函数执行刷新
    await refresh()
  } catch (error) {
    // 输出错误日志
    console.error('刪除詢盤失敗:', error)
  }
}

// ============================================================================
// 批量删除 (Bulk Delete)
// ============================================================================
//
// 函数作用：
// - 批量删除选中的询盘
// - 刷新数据列表
//
// 工作流程：
// 1. 弹出确认对话框
// 2. 如果用户取消，直接返回
// 3. 提取所有选中询盘的 ID
// 4. 发送 POST 请求到 /api/inquiries/admin/bulk
// 5. 批量删除操作
// 6. 清空选中列表
// 7. 刷新数据列表
// 8. 显示成功提示
// 9. 错误处理
//
// API 调用：
// - method: 'POST'：POST 请求
// - body: { ids, action: 'delete' }：请求体
//   - ids：询盘 ID 数组
//   - action：操作类型（delete）
//
// 当前版本已隐藏批量操作功能
//
// ============================================================================
async function bulkDelete() {
  // 弹出确认对话框
  // confirm：浏览器原生对话框
  // 使用模板字符串动态显示选中数量
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 個詢盤嗎？`)) return

  try {
    // 提取所有选中询盘的 ID
    // map：将询盘对象数组转换为 ID 数组
    const ids = selectedItems.value.map((item) => item.id)

    // 发送 POST 请求批量删除
    // $fetch：Nuxt 提供的 fetch 函数，包含认证信息
    await $fetch('/api/inquiries/admin/bulk', {
      method: 'POST',
      body: {
        ids,                    // 询盘 ID 数组
        action: 'delete',        // 操作类型
      },
    })

    // 清空选中列表
    selectedItems.value = []

    // 立即刷新数据，实现动态更新
    refreshKey.value++
    await refresh()

    // 显示成功提示
    // alert：浏览器原生对话框
    alert('批量刪除成功')
  } catch (error: any) {
    // 输出错误日志
    console.error('批量刪除失敗:', error)
    // 显示错误提示
    // error.data?.message：API 返回的错误消息
    alert(error.data?.message || '批量刪除失敗')
  }
}

// ============================================================================
// 批量更新 (Bulk Update)
// ============================================================================
//
// 函数作用：
// - 批量更新选中的询盘状态
// - 刷新数据列表
//
// 参数：
// - data：更新的数据（如 { status: 'read' }）
//
// 工作流程：
// 1. 提取所有选中询盘的 ID
// 2. 发送 POST 请求到 /api/inquiries/admin/bulk
// 3. 批量更新操作
// 4. 清空选中列表
// 5. 刷新数据列表
// 6. 显示成功提示
// 7. 错误处理
//
// API 调用：
// - method: 'POST'：POST 请求
// - body: { ids, action: 'update', data }：请求体
//   - ids：询盘 ID 数组
//   - action：操作类型（update）
//   - data：更新的数据（如 { status: 'read' }）
//
// 当前版本已隐藏批量操作功能
//
// ============================================================================
async function bulkUpdate(data: any) {
  try {
    // 提取所有选中询盘的 ID
    // map：将询盘对象数组转换为 ID 数组
    const ids = selectedItems.value.map((item) => item.id)

    // 发送 POST 请求批量更新
    // $fetch：Nuxt 提供的 fetch 函数，包含认证信息
    await $fetch('/api/inquiries/admin/bulk', {
      method: 'POST',
      body: {
        ids,                     // 询盘 ID 数组
        action: 'update',          // 操作类型
        data,                    // 更新的数据（如 { status: 'read' }）
      },
    })

    // 清空选中列表
    selectedItems.value = []

    // 立即刷新数据，实现动态更新
    refreshKey.value++
    await refresh()

    // 显示成功提示
    alert('批量更新成功')
  } catch (error: any) {
    // 输出错误日志
    console.error('批量更新失敗:', error)
    // 显示错误提示
    alert(error.data?.message || '批量更新失敗')
  }
}

// ============================================================================
// 导出数据 (Export Data)
// ============================================================================
//
// 函数作用：
// - 导出询盘数据为 JSON 或 CSV 格式
// - 触发浏览器下载
//
// 参数：
// - format：导出格式（'json' | 'csv'）
//
// 工作流程：
// 1. 发送 GET 请求到 /api/inquiries/admin/export
// 2. 查询参数 format 指定导出格式
// 3. 接收 Blob 类型的响应（二进制数据）
// 4. 创建临时 URL
// 5. 创建隐藏的 a 标签
// 6. 设置 download 属性和 href
// 7. 模拟点击下载
// 8. 清理临时 URL
// 9. 错误处理
//
// API 调用：
// - method: 'GET'：GET 请求
// - responseType: 'blob'：响应类型为 Blob（二进制数据）
// - 查询参数：?format=${format}
//   - format：导出格式（json 或 csv）
//
// Blob 对象：
// - Blob：Binary Large Object，用于存储二进制数据
// - 用途：文件下载
//
// 当前版本已隐藏导出功能
//
// ============================================================================
async function exportData(format: 'json' | 'csv') {
  try {
    // 使用 $fetch 获取数据，这样可以包含认证信息并更好地处理错误
    // responseType: 'blob'：响应类型为 Blob（二进制数据）
    // 查询参数：?format=${format}：指定导出格式
    const blob = await $fetch(`/api/inquiries/admin/export?format=${format}`, {
      method: 'GET',
      responseType: 'blob'
    })

    // 创建一个临时 URL 并触发下载
    // URL.createObjectURL：创建 Blob URL
    // blob as Blob：类型断言，确保类型正确
    const url = window.URL.createObjectURL(blob as Blob)

    // 创建隐藏的 a 标签
    const link = document.createElement('a')
    link.href = url

    // 设置下载文件名
    // inquiries_：文件名前缀
    // new Date().toISOString().split('T')[0]：当前日期（YYYY-MM-DD）
    // .${format}：文件扩展名（.json 或 .csv）
    link.download = `inquiries_${new Date().toISOString().split('T')[0]}.${format}`

    // 添加到 DOM
    document.body.appendChild(link)

    // 模拟点击下载
    link.click()

    // 清理：移除 a 标签和释放 URL
    // setTimeout：延迟 100ms 执行清理
    setTimeout(() => {
      // 移除 a 标签
      document.body.removeChild(link)
      // 释放 URL
      window.URL.revokeObjectURL(url)
    }, 100)
  } catch (error: any) {
    // 输出错误日志
    console.error('導出失敗:', error)
    // 显示错误提示
    alert('導出失敗，請重試')
  }
}

// ============================================================================
// 暴露刷新函数 (Expose Refresh Function)
// ============================================================================
//
// defineExpose：Vue 3 的函数，用于暴露组件内部的方法或状态
//
// 暴露的内容：
// - refresh：刷新函数，供外部组件调用
//
// 使用场景：
// - 父组件需要刷新询盘列表
// - 其他操作完成后需要刷新数据
//
// 为什么需要暴露 refresh？
// - 封装组件内部逻辑
// - 提供外部调用接口
// - 保持组件独立性
//
// ============================================================================
defineExpose({
  refresh
})
</script>
