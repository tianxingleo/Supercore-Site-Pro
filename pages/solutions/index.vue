<template>
  <!-- 页面最小高度设置为全屏高度，背景色为白色 -->
  <div class="min-h-screen bg-white">
    <!-- 页面头部区域：包含大标题和副标题 -->
    <!-- pt-48：顶部留出足够空间给导航栏和视觉效果 -->
    <!-- pb-24：为内容区提供呼吸空间 -->
    <!-- border-b border-gray-100：底部添加浅灰色的瑞士风格分割线 -->
    <!-- mb-12：为解决方案列表区添加底部间距 -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <!-- 使用瑞士网格系统容器，启用网格布局模式 -->
      <GridContainer :grid="true">
        <!-- 内容占据 12 列（全宽）在大屏幕上占据 8 列 -->
        <div class="col-span-12 lg:col-span-8">
          <!-- 主标题组件 -->
          <!-- TypographyHeader：瑞士风格标题组件 -->
          <!-- level="1"：语义化级别，对应 h1 -->
          <!-- size="display"：显示尺寸，用于超大标题 -->
          <!-- class="mb-8"：底部边距 8 单位 -->
          <TypographyHeader :level="1" size="display" class="mb-8">
            <!-- 使用 i18n 国际化翻译键 'solutions.title'，支持中英文切换 -->
            {{ $t('solutions.title') }}
          </TypographyHeader>
          <!-- 副标题组件 -->
          <!-- level="2"：语义化级别，对应 h2 -->
          <!-- size="h3"：视觉尺寸为 h3 -->
          <!-- color="secondary"：使用次要颜色（灰色调） -->
          <!-- weight="normal"：常规字重 -->
          <!-- class="max-w-2xl opacity-80"：最大宽度限制、透明度 80% -->
          <TypographyHeader
            :level="2"
            size="h3"
            color="secondary"
            weight="normal"
            class="max-w-2xl opacity-80"
          >
            <!-- 使用 i18n 国际化翻译键 'solutions.subtitle' -->
            {{ $t('solutions.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- 类别筛选标签区域 -->
    <!-- mb-24：底部边距 24 单位 -->
    <section class="mb-24">
      <!-- 使用瑞士网格系统容器，启用网格布局模式 -->
      <GridContainer :grid="true">
        <!-- 类别筛选容器 -->
        <!-- col-span-12：占据 12 列（全宽） -->
        <!-- flex flex-col md:flex-row：弹性布局，移动端垂直，桌面端水平 -->
        <!-- items-center：垂直居中对齐 -->
        <!-- gap-8：子元素之间间距 8 单位 -->
        <div class="col-span-12 flex flex-col md:flex-row items-center gap-8">
          <!-- "Filter / Category" 标签 -->
          <!-- text-[10px]：极小字体（10px） -->
          <!-- font-bold：字重加粗 -->
          <!-- tracking-[0.4em]：字母间距加宽（瑞士设计特征） -->
          <!-- uppercase：全大写 -->
          <!-- text-swiss-text/30：30% 不透明度 -->
          <!-- font-mono：等宽字体 -->
          <span
            class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono"
            >Filter / Category</span
          >
          <!-- 类别按钮组 -->
          <!-- flex flex-wrap gap-4：弹性布局，自动换行，间距 4 单位 -->
          <div class="flex flex-wrap gap-4">
            <!-- 循环渲染每个类别按钮 -->
            <!-- v-for：遍历 categories 数组 -->
            <!-- :key="category.key"：使用类别 key 作为唯一标识 -->
            <!-- @click="selectedCategory = category.key"：点击时更新选中的类别 -->
            <!-- class：基础样式 -->
            <!--   - px-8 py-3：内边距（水平 8，垂直 3） -->
            <!--   - border border-gray-200：浅灰色边框 -->
            <!--   - text-[10px]：极小字体（10px） -->
            <!--   - font-bold：字重加粗 -->
            <!--   - tracking-[0.2em]：字母间距加宽 -->
            <!--   - uppercase：全大写 -->
            <!--   - transition-all duration-500：平滑过渡动画，持续时间 500ms -->
            <!--   - font-mono：等宽字体 -->
            <!-- :class：动态类名 -->
            <!--   - 选中状态（selectedCategory === category.key）： -->
            <!--     - bg-swiss-text：主文本颜色背景 -->
            <!--     - text-white：白色文本 -->
            <!--     - border-black：黑色边框 -->
            <!--   - 未选中状态： -->
            <!--     - bg-white：白色背景 -->
            <!--     - text-swiss-text：主文本颜色 -->
            <!--     - hover:border-black：悬停时边框变黑 -->
            <button
              v-for="category in categories"
              :key="category.key"
              @click="selectedCategory = category.key"
              class="px-8 py-3 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 font-mono"
              :class="
                selectedCategory === category.key
                  ? 'bg-swiss-text text-white border-black'
                  : 'bg-white text-swiss-text hover:border-black'
              "
            >
              <!-- 类别标签文本：使用方括号括起来（瑞士设计风格） -->
              [{{ category.label }}]
            </button>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- 解决方案网格区域 -->
    <!-- pb-32：底部留出大量空间，确保滚动体验流畅 -->
    <section class="pb-32">
      <!-- 加载状态：显示骨架屏 -->
      <!-- v-if="pending"：当数据正在加载时显示 -->
      <template v-if="pending">
        <!-- 使用瑞士网格系统容器 -->
        <!-- :grid="true"：启用网格布局 -->
        <!-- gap="none"：不使用内边距，由子元素自己控制间距 -->
        <!-- border-t border-l border-gray-100：添加顶部和左侧的瑞士风格网格线 -->
        <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
          <!-- 循环生成 4 个骨架屏占位符 -->
          <!-- v-for="i in 4"：生成 4 个占位卡片 -->
          <!-- key="i"：使用索引作为 key -->
          <!-- class="col-span-12 md:col-span-6"：移动端全宽，平板占 6 列（50%） -->
          <!-- border-r border-b border-gray-100：右侧和底部网格线 -->
          <div
            v-for="i in 4"
            :key="i"
            class="col-span-12 md:col-span-6 border-r border-b border-gray-100"
          >
            <!-- SolutionSkeleton：解决方案骨架屏组件 -->
            <!-- 占位符，提供加载时的视觉反馈 -->
            <SolutionSkeleton />
          </div>
        </GridContainer>
      </template>
      <!-- 数据加载完成：显示解决方案 Bento 网格 -->
      <!-- v-else：当数据加载完成时显示 -->
      <!-- SolutionsBento：Bento 网格布局组件 -->
      <!-- :solutions="filteredSolutions"：传递筛选后的解决方案数据 -->
      <SolutionsBento v-else :solutions="filteredSolutions" />
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：解决方案列表页面 (Solutions List Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的解决方案列表页面，用于展示所有解决方案。
 *
 * 页面路由：/solutions
 *
 * 实现手段：
 * 1. 懒加载 (Lazy Loading)：使用 useLazyFetch 异步加载解决方案数据，避免阻塞渲染
 * 2. 类别筛选 (Category Filter)：Tab 切换不同类别的解决方案
 * 3. 骨架屏 (Skeleton Loading)：加载时显示占位符，提升用户体验
 * 4. 响应式布局 (Responsive Grid)：使用瑞士网格系统，适配桌面、平板、移动设备
 * 5. Bento 网格布局 (Bento Grid)：使用 SolutionsBento 组件展示解决方案
 * 6. SEO 优化 (SEO Optimization)：使用 useHead 设置页面标题和元数据
 * 7. 国际化 (i18n)：支持中英文双语切换
 * 8. 瑞士设计风格 (Swiss Design)：简洁的网格布局、大标题、留白充足
 * 9. Mock 数据 (Mock Data)：使用 mock 数据展示解决方案
 *
 * 核心功能：
 * 1. 显示页面标题和副标题（国际化）
 * 2. 类别筛选标签（Tab 切换）
 * 3. 筛选解决方案（根据类别）
 * 4. 显示解决方案网格（Bento 布局）
 * 5. 加载状态：显示骨架屏（4 个占位符）
 * 6. SEO 元数据设置
 *
 * 类别系统：
 * - all：全部解决方案
 * - idc：互联网数据中心（IDC）
 * - operations：运维服务
 * - development：开发服务
 *
 * 瑞士设计特点：
 * - 网格系统 (Grid System)：12 列网格，响应式布局
 * - 大标题 (Display Typography)：font-black, tracking-tighter, uppercase
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 等宽字体 (Monospace)：用于标签和类别
 * - 分割线 (Grid Lines)：border-gray-100 形成瑞士风格网格
 * - 大量留白 (Whitespace)：充足的呼吸空间
 *
 * 性能优化：
 * - useLazyFetch：延迟加载解决方案数据，不阻塞初始渲染
 * - 骨架屏：提前显示 UI 结构，减少感知加载时间
 * - 筛选逻辑：使用 computed 缓存筛选结果
 * - Mock 数据排序：按 order 字段排序
 *
 * Bento 网格布局：
 * - 不同大小的卡片：大卡片、中卡片、小卡片
 * - 视觉层次：突出重要解决方案
 * - 灵活布局：根据内容自动调整
 *
 * 可访问性 (Accessibility)：
 * - 语义化 HTML：使用 section、div 等语义化标签
 * - 屏幕阅读器友好：清晰的文本内容
 * - 国际化支持：中英文双语
 *
 * 依赖组件：
 * - GridContainer：瑞士网格容器组件
 * - TypographyHeader：瑞士风格标题组件
 * - SolutionSkeleton：解决方案骨架屏组件
 * - SolutionsBento：Bento 网格布局组件
 *
 * 依赖 API：
 * - /api/solutions：获取公开解决方案列表
 *
 * 依赖工具：
 * - ~/utils/mockData：Mock 数据（mockSolutions）
 *
 * 依赖类型：
 * - Solution：解决方案类型定义
 *
 * ============================================================================
 */

// 导入 Solution 类型定义，用于类型检查和 TypeScript 智能提示
import type { Solution } from '~/types'

// ============================================================================
// 国际化配置 (Internationalization)
// ============================================================================

// useI18n：获取国际化配置和工具函数
// 解构获取 t：翻译函数，用于获取翻译文本
const { t } = useI18n()

// ============================================================================
// 懒加载解决方案数据 (Lazy Fetch Solutions Data)
// ============================================================================
//
// 使用 useLazyFetch 而非 useFetch 的原因：
// 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
// 2. 用户体验：可以先显示页面框架（骨架屏），再异步加载数据
// 3. 路由切换：从其他页面切换过来时，避免等待数据加载
//
// useLazyFetch 参数说明：
// - '/api/solutions'：API 端点路径
// - <Solution[]>：泛型类型，表示返回的是 Solution 数组
// - transform：转换函数，对返回的数据进行处理
//   - 对 mock 数据按 order 字段排序
// - default：默认值，数据加载完成前返回空数组
// - 解构赋值：{ data: solutions, pending }
//   - data：响应式数据，重命名为 solutions
//   - pending：布尔值，表示数据是否正在加载
//
// 工作原理：
// 1. 页面立即渲染，不等待数据
// 2. pending = true，显示骨架屏（SolutionSkeleton）
// 3. 后台异步请求数据
// 4. 数据加载完成后：
//    - pending = false
//    - solutions = 解决方案数组
//    - 触发 filteredSolutions computed 重新计算
//    - 显示 SolutionsBento 组件
//
// ============================================================================
const { data: solutions, pending } = useLazyFetch<Solution[]>('/api/solutions', {
  // 数据转换函数：对返回的数据进行处理
  transform: () => {
    // 对 mock 数据按 order 字段排序（升序）
    // a.order - b.order：从小到大排序
    return mockSolutions.sort((a, b) => a.order - b.order)
  },
  // 默认值：空数组
  default: () => []
})

// 导入 mock 数据
// 用于开发和演示
import { mockSolutions } from '~/utils/mockData'

// ============================================================================
// 类别配置 (Categories Configuration)
// ============================================================================
//
// 类别说明：
// - all：全部解决方案（显示所有）
// - idc：互联网数据中心（IDC）
// - operations：运维服务
// - development：开发服务
//
// label 使用 i18n 翻译函数：
// - t('solutions.categories.all')：国际化翻译键
// - 支持中英文双语切换
//
// ============================================================================
const categories = [
  { key: 'all', label: t('solutions.categories.all') },
  { key: 'idc', label: t('solutions.categories.idc') },
  { key: 'operations', label: t('solutions.categories.operations') },
  { key: 'development', label: t('solutions.categories.development') },
]

// 当前选中的类别：默认为 'all'（显示全部）
const selectedCategory = ref('all')

// ============================================================================
// 筛选解决方案 (Filter Solutions)
// ============================================================================
//
// 使用 computed 创建筛选后的解决方案列表
// 自动追踪 selectedCategory 和 solutions 的变化
//
// 筛选逻辑：
// 1. 如果 selectedCategory = 'all'，返回所有解决方案
// 2. 否则，返回 category 字段等于 selectedCategory 的解决方案
//
// 举例说明：
// - selectedCategory = 'all'：返回所有解决方案
// - selectedCategory = 'idc'：返回所有 category = 'idc' 的解决方案
//
// 返回值：
// - 筛选后的解决方案数组
//
// ============================================================================
const filteredSolutions = computed(() => {
  // 如果选中的类别是 'all'，返回所有解决方案
  if (selectedCategory.value === 'all') {
    return solutions.value || []
  }
  // 否则，筛选出 category 字段等于选中类别的解决方案
  return (solutions.value || []).filter((s) => s.category === selectedCategory.value)
})

// ============================================================================
// SEO 元数据设置 (SEO Metadata Configuration)
// ============================================================================
//
// 使用 useHead 动态设置页面头部元数据
// 这是 Nuxt 3 提供的组合式 API，用于管理页面 SEO
//
// 设置内容：
// 1. title：页面标题，显示在浏览器标签页
//
// SEO 最佳实践：
// 1. 唯一的页面标题（包含"解决方案"关键词）
// 2. 品牌一致性（使用公司名称：超核技術有限公司）
// 3. 关键词自然融入标题
//
// 搜索引擎优化 (SEO)：
// - 标题：帮助搜索引擎理解页面主题（解决方案页面）
// - 品牌名称：提升品牌知名度和搜索结果展示
// - 关键词：包含"解决方案"关键词，帮助用户搜索
//
// ============================================================================
useHead({
  title: '解决方案 - 超核技術有限公司',
})
</script>
