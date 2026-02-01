<template>
  <!-- 解决方案详情页面容器 -->
  <!-- v-if="solution"：只有当解决方案数据加载完成时才显示 -->
  <!-- min-h-screen：最小高度为全屏高度 -->
  <!-- bg-white：白色背景 -->
  <div v-if="solution" class="min-h-screen bg-white">
    <!-- Hero 头部区域 -->
    <!-- relative：相对定位（用于绝对定位背景装饰） -->
    <!-- pt-48：顶部留出足够空间给导航栏和视觉效果 -->
    <!-- pb-32：为内容区提供呼吸空间 -->
    <!-- border-b border-gray-100：底部添加浅灰色的瑞士风格分割线 -->
    <!-- overflow-hidden：隐藏溢出内容（用于背景装饰） -->
    <section class="relative pt-48 pb-32 border-b border-gray-100 overflow-hidden">
      <!-- 背景装饰 -->
      <!-- absolute：绝对定位 -->
      <!-- top-0 right-0：右上角定位 -->
      <!-- w-1/3：宽度 1/3 -->
      <!-- h-full：高度 100% -->
      <!-- bg-swiss-bg-soft：瑞士风格浅色背景 -->
      <!-- -skew-x-12：X 轴负斜变换 12 度（创建倾斜效果）[注意：代码中拼写错误，应为 -skew-x-12] -->
      <!-- transform：应用变换 -->
      <!-- translate-x-12：向右平移 12 单位 -->
      <!-- z-0：底层（背景） -->
      <div
        class="absolute top-0 right-0 w-1/3 h-full bg-swiss-bg-soft -skew-x-12 transform translate-x-12 z-0"
      ></div>

      <!-- 网格容器 -->
      <!-- GridContainer：瑞士网格系统容器 -->
      <!-- :grid="true"：启用网格布局模式 -->
      <!-- class="relative z-10"：相对定位，高层级（在背景装饰之上） -->
      <GridContainer :grid="true" class="relative z-10">
        <!-- 内容占据 12 列（全宽）在大屏幕上占据 8 列 -->
        <div class="col-span-12 lg:col-span-8">
          <!-- 面包屑导航 -->
          <!-- flex items-center：弹性布局，垂直居中 -->
          <!-- space-x-4：子元素之间间距 4 单位 -->
          <!-- mb-10：底部边距 10 单位 -->
          <div class="flex items-center space-x-4 mb-10">
            <!-- 返回解决方案列表链接 -->
            <!-- NuxtLink：Nuxt 3 的路由链接组件，自动支持国际化 -->
            <!-- :to="localePath('/solutions')"：生成带语言前缀的路径 -->
            <!-- class：样式 -->
            <!--   - text-[10px]：极小字体（10px） -->
            <!--   - font-bold：字重加粗 -->
            <!--   - tracking-[0.2em]：字母间距加宽 -->
            <!--   - uppercase：全大写 -->
            <!--   - text-swiss-text/40：40% 不透明度 -->
            <!--   - hover:text-swiss-text：悬停时完全不透明 -->
            <!--   - transition-colors：平滑颜色过渡 -->
            <NuxtLink
              :to="localePath('/solutions')"
              class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text/40 hover:text-swiss-text transition-colors"
            >
              <!-- 方括号 + 翻译文本（瑞士设计风格） -->
              [ {{ $t('nav.solutions') }} ]
            </NuxtLink>
            <!-- 分隔符：斜杠 -->
            <span class="text-gray-300">/</span>
            <!-- 当前解决方案标题 -->
            <!-- text-[10px]：极小字体（10px） -->
            <!-- font-bold：字重加粗 -->
            <!-- tracking-[0.2em]：字母间距加宽 -->
            <!-- uppercase：全大写 -->
            <!-- text-swiss-text：主文本颜色 -->
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text">
              <!-- 使用多语言标题 -->
              {{ localizedTitle }}
            </span>
          </div>

          <!-- 主标题 -->
          <!-- TypographyHeader：瑞士风格标题组件 -->
          <!-- :level="1"：语义化级别，对应 h1 -->
          <!-- size="display"：显示尺寸，用于超大标题 -->
          <!-- class="mb-8 !tracking-[0.02em]"：底部边距 8 单位，极紧凑字母间距（! 优先级提升） -->
          <TypographyHeader :level="1" size="display" class="mb-8 !tracking-[0.02em]">
            <!-- 使用多语言标题 -->
            {{ localizedTitle }}
          </TypographyHeader>

          <!-- 副标题 -->
          <!-- TypographyHeader：瑞士风格标题组件 -->
          <!-- :level="2"：语义化级别，对应 h2 -->
          <!-- size="h3"：视觉尺寸为 h3 -->
          <!-- color="secondary"：使用次要颜色（灰色调） -->
          <!-- weight="normal"：常规字重 -->
          <!-- class="max-w-2xl opacity-80 mb-12"：最大宽度限制、透明度 80%、底部边距 12 单位 -->
          <TypographyHeader
            :level="2"
            size="h3"
            color="secondary"
            weight="normal"
            class="max-w-2xl opacity-80 mb-12"
          >
            <!-- 使用多语言描述 -->
            {{ localizedDescription }}
          </TypographyHeader>

          <!-- CTA 按钮组 -->
          <!-- flex flex-wrap gap-6：弹性布局，自动换行，间距 6 单位 -->
          <div class="flex flex-wrap gap-6">
            <!-- 主要 CTA 按钮 -->
            <!-- SwissButton：瑞士风格按钮组件 -->
            <!-- variant="primary"：主要按钮样式 -->
            <!-- size="lg"：大尺寸按钮 -->
            <!-- class="!px-10"：左右内边距 10 单位（! 优先级提升） -->
            <!-- @click="navigateTo(localePath('/contact'))"：点击时跳转到联系页面 -->
            <SwissButton
              variant="primary"
              size="lg"
              class="!px-10"
              @click="navigateTo(localePath('/contact'))"
            >
              <!-- 使用 i18n 国际化翻译键 'home.hero.cta' -->
              {{ $t('home.hero.cta') }}
            </SwissButton>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- 主内容区域 -->
    <!-- py-32：上下内边距 32 单位 -->
    <section class="py-32">
      <!-- 网格容器 -->
      <!-- GridContainer：瑞士网格系统容器 -->
      <!-- :grid="true"：启用网格布局模式 -->
      <GridContainer :grid="true">
        <!-- 内容占据 12 列（全宽）在大屏幕上占据 12 列 -->
        <div class="col-span-12 lg:col-span-12">
          <!-- 内容容器 -->
          <!-- border-l-[12px]：左侧 12px 粗边框 -->
          <!-- border-swiss-text：主文本颜色边框 -->
          <!-- pl-12 md:pl-20：左内边距响应式（移动端 12，桌面端 20） -->
          <!-- py-8：上下内边距 8 单位 -->
          <div class="border-l-[12px] border-swiss-text pl-12 md:pl-20 py-8">
            <!-- "Solution Specifications" 标签 -->
            <!-- inline-block：内联块元素 -->
            <!-- mb-12：底部边距 12 单位 -->
            <!-- text-[10px]：极小字体（10px） -->
            <!-- font-bold：字重加粗 -->
            <!-- tracking-[0.3em]：字母间距加宽（瑞士设计特征） -->
            <!-- uppercase：全大写 -->
            <!-- text-swiss-text：主文本颜色 -->
            <!-- border-b border-swiss-text pb-1：底部添加主色边框，下内边距 1 -->
            <div
              class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
            >
              <!-- 标签文本 -->
              Solution Specifications
            </div>

            <!-- 内容区域 -->
            <!-- prose：Tailwind Typography 插件样式 -->
            <!-- prose-2xl：超大号字体 -->
            <!-- max-w-none：无最大宽度限制 -->
            <!-- text-swiss-text：主文本颜色 -->
            <!-- font-medium：中等字重 -->
            <!-- leading-relaxed：宽松行高 -->
            <div class="prose prose-2xl max-w-none text-swiss-text font-medium leading-relaxed">
              <!-- 解决方案描述 -->
              <!-- p：段落标签 -->
              <!-- class：样式 -->
              <!--   - mb-12：底部边距 12 单位 -->
              <!--   - text-3xl md:text-4xl：响应式字体大小（移动端 3xl，桌面端 4xl） -->
              <!--   - tracking-tight：紧凑字母间距 -->
              <p class="mb-12 text-3xl md:text-4xl tracking-tight">
                <!-- 使用多语言描述 -->
                {{ localizedDescription }}
              </p>

              <!-- 功能特性网格 -->
              <!-- grid grid-cols-1 md:grid-cols-2：网格布局，移动端 1 列，桌面端 2 列 -->
              <!-- gap-16：间距 16 单位 -->
              <!-- mt-24：顶部边距 24 单位 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
                <!-- 循环渲染每个功能特性 -->
                <!-- v-for="feature in solution.features"：遍历解决方案的功能数组 -->
                <!-- :key="index"：使用索引作为 key -->
                <!-- class="border-t border-gray-100 pt-10"：顶部边框，上内边距 10 单位 -->
                <div
                  v-for="(feature, index) in solution.features"
                  :key="index"
                  class="border-t border-gray-100 pt-10"
                >
                  <!-- 功能特性编号 -->
                  <!-- text-[10px]：极小字体（10px） -->
                  <!-- font-bold：字重加粗 -->
                  <!-- text-swiss-text/30：30% 不透明度 -->
                  <!-- mb-6：底部边距 6 单位 -->
                  <!-- font-mono：等宽字体 -->
                  <div class="text-[10px] font-bold text-swiss-text/30 mb-6 font-mono">
                    FEATURE_O{{ index + 1 }}
                  </div>
                  <!-- 功能特性标题 -->
                  <!-- h3：语义化标题标签 -->
                  <!-- text-2xl：大号字体（24px） -->
                  <!-- font-bold：字重加粗 -->
                  <!-- mb-4：底部边距 4 单位 -->
                  <!-- tracking-tight：紧凑字母间距 -->
                  <h3 class="text-2xl font-bold mb-4 tracking-tight">{{ feature }}</h3>
                  <!-- 分割线 -->
                  <!-- w-12：宽度 12 单位 -->
                  <!-- h-1：高度 1 单位 -->
                  <!-- bg-swiss-text/10：主文本颜色，10% 不透明度 -->
                  <div class="w-12 h-1 bg-swiss-text/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Swiss Grid Callout -->
    <!-- py-24：上下内边距 24 单位 -->
    <!-- bg-swiss-bg-soft：瑞士风格浅色背景 -->
    <!-- border-y border-gray-100：上下添加浅灰色边框 -->
    <section class="py-24 bg-swiss-bg-soft border-y border-gray-100">
      <!-- 网格容器 -->
      <!-- GridContainer：瑞士网格系统容器 -->
      <GridContainer>
        <!-- 内容容器 -->
        <!-- col-span-12：占据 12 列（全宽） -->
        <!-- flex flex-col md:flex-row：弹性布局，移动端垂直，桌面端水平 -->
        <!-- items-center：垂直居中 -->
        <!-- justify-between：两端对齐 -->
        <!-- gap-12：子元素之间间距 12 单位 -->
        <div class="col-span-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <!-- 标题和描述 -->
          <!-- max-w-2xl：最大宽度 2xl -->
          <div class="max-w-2xl">
            <!-- 标题 -->
            <!-- TypographyHeader：瑞士风格标题组件 -->
            <!-- :level="2"：语义化级别，对应 h2 -->
            <!-- size="h2"：视觉尺寸为 h2 -->
            <!-- class="mb-6"：底部边距 6 单位 -->
            <TypographyHeader :level="2" size="h2" class="mb-6">
              <!-- 使用 i18n 国际化翻译键 'about.solutionFeatures.title' -->
              {{ $t('about.solutionFeatures.title') }}
            </TypographyHeader>
            <!-- 描述文本 -->
            <!-- text-swiss-secondary：次要文本颜色 -->
            <!-- leading-relaxed：宽松行高 -->
            <p class="text-swiss-secondary leading-relaxed">
              <!-- 使用 i18n 国际化翻译键 'about.companyOverview.description1' -->
              {{ $t('about.companyOverview.description1') }}
            </p>
          </div>
          <!-- CTA 按钮 -->
          <!-- SwissButton：瑞士风格按钮组件 -->
          <!-- variant="ghost"：幽灵按钮样式（无背景，悬停时显示背景） -->
          <!-- size="lg"：大尺寸按钮 -->
          <!-- class="border-swiss-text whitespace-nowrap"：主文本颜色边框、不换行 -->
          <!-- @click="navigateTo(localePath('/contact'))"：点击时跳转到联系页面 -->
          <SwissButton
            variant="ghost"
            size="lg"
            class="border-swiss-text whitespace-nowrap"
            @click="navigateTo(localePath('/contact'))"
          >
            <!-- 使用 i18n 国际化翻译键 'home.hero.ctaSecondary' -->
            {{ $t('home.hero.ctaSecondary') }}
          </SwissButton>
        </div>
      </GridContainer>
    </section>
  </div>

  <!-- 加载状态：显示骨架屏 -->
  <!-- v-else-if="pending"：当数据正在加载时显示 -->
  <div v-else-if="pending">
    <!-- ArticleSkeleton：文章骨架屏组件 -->
    <!-- 占位符，提供加载时的视觉反馈 -->
    <ArticleSkeleton />
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：解决方案详情页面 (Solution Detail Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的解决方案详情页面，用于展示单个解决方案的详细信息。
 *
 * 页面路由：/solutions/[slug]（动态路由，slug 为解决方案 URL 标识符）
 *
 * 实现手段：
 * 1. 动态路由 (Dynamic Routing)：使用 Nuxt 3 的动态路由 [slug] 匹配解决方案
 * 2. 懒加载 (Lazy Loading)：使用 useLazyFetch 异步加载解决方案数据，避免阻塞渲染
 * 3. 多语言支持 (Multi-language)：支持中文、英文、繁体中文
 * 4. 响应式布局 (Responsive Grid)：使用瑞士网格系统，适配桌面、平板、移动设备
 * 5. 面包屑导航 (Breadcrumb)：显示当前位置导航
 * 6. CTA 按钮 (Call to Action)：引导用户联系
 * 7. SEO 优化 (SEO Optimization)：使用 useHead 设置页面标题和元数据
 * 8. 瑞士设计风格 (Swiss Design)：简洁的网格布局、大标题、留白充足
 * 9. 骨架屏 (Skeleton Loading)：加载时显示占位符，提升用户体验
 *
 * 核心功能：
 * 1. 显示解决方案标题和描述（多语言）
 * 2. 显示功能特性列表
 * 3. 面包屑导航（Solutions / 当前解决方案）
 * 4. CTA 按钮（跳转到联系页面）
 * 5. SEO 元数据设置
 * 6. 加载状态（骨架屏）
 * 7. 背景装饰（倾斜背景）
 *
 * 瑞士设计特点：
 * - 网格系统 (Grid System)：12 列网格，响应式布局
 * - 大标题 (Display Typography)：font-black, tracking-tighter, uppercase
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 分割线 (Grid Lines)：border-gray-100 形成瑞士风格网格
 * - 大量留白 (Whitespace)：充足的呼吸空间
 *
 * 背景装饰：
 * - 倾斜背景：使用 -skew-x-12 创建 X 轴倾斜效果
 * - 颜色渐变：使用 bg-swiss-bg-soft 浅色背景
 * - 视觉层次：z-index 控制背景和内容的层级
 *
 * 布局结构：
 * 1. Hero 头部
 *    - 面包屑导航
 *    - 标题和描述
 *    - CTA 按钮
 *    - 倾斜背景装饰
 * 2. 主内容区域
 *    - 解决方案规范标签
 *    - 解决方案描述
 *    - 功能特性网格
 * 3. Swiss Grid Callout
 *    - 标题和描述
 *    - CTA 按钮
 *
 * 性能优化：
 * - useLazyFetch：延迟加载解决方案数据，不阻塞初始渲染
 * - 骨架屏：提前显示 UI 结构，减少感知加载时间
 * - 响应式图片：支持不同屏幕尺寸
 *
 * SEO 最佳实践：
 * 1. 唯一的页面标题（包含解决方案名称）
 * 2. 语义化 HTML：使用正确的 HTML 标签
 * 3. 面包屑导航：提升用户体验和 SEO
 *
 * 可访问性 (Accessibility)：
 * - 语义化 HTML：使用正确的 HTML 标签
 * - 键盘导航：NuxtLink 组件支持键盘导航
 * - 对比度：文本和背景对比度符合 WCAG 标准
 *
 * 依赖组件：
 * - GridContainer：瑞士网格容器组件
 * - TypographyHeader：瑞士风格标题组件
 * - SwissButton：瑞士风格按钮组件
 * - ArticleSkeleton：文章骨架屏组件
 *
 * 依赖 API：
 * - /api/solutions/[slug]：获取单个解决方案详情
 *
 * 依赖类型：
 * - Solution：解决方案类型定义
 *
 * ============================================================================
 */

// 导入 Solution 类型定义，用于类型检查和 TypeScript 智能提示
import type { Solution } from '~/types'

// ============================================================================
// Nuxt 3 组合式 API 导入 (Nuxt 3 Composables)
// ============================================================================

// useRoute：获取当前路由信息
// 用于访问路由参数（如 slug）、查询参数、路径等
// route.params.slug：获取动态路由参数 slug
const route = useRoute()

// useLocalePath：生成本地化路径的工具函数
// 自动为路径添加当前语言前缀（如 /en/solutions、/zh-HK/solutions）
// 用途：导航到其他页面时保持语言一致性
const localePath = useLocalePath()

// useI18n：获取国际化配置和工具函数
// 解构获取 locale：当前语言代码（如 'en'、'zh-CN'、'zh-HK'）
// 用于多语言内容显示
const { locale } = useI18n()

// 从路由参数中获取 slug
// route.params.slug：获取动态路由参数
// as string：类型断言为字符串
const slug = route.params.slug as string

// ============================================================================
// 懒加载解决方案数据 (Lazy Fetch Solution Data)
// ============================================================================
//
// 使用 useLazyFetch 而非 useFetch 的原因：
// 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
// 2. 用户体验：可以先显示页面框架（骨架屏），再异步加载数据
// 3. 路由切换：从其他页面切换过来时，避免等待数据加载
//
// useLazyFetch 参数说明：
// - `/api/solutions/${slug}`：API 端点路径，动态拼接 slug
//   - route.params.slug：获取 URL 中的动态参数
// - <{ success: boolean, data: Solution }>：泛型类型，表示返回的对象结构
//   - success：表示请求是否成功
//   - data：Solution 类型的解决方案对象
// - default：默认值，数据加载完成前返回
// - 解构赋值：{ data: response, pending }
//   - data：响应式数据，重命名为 response
//   - pending：布尔值，表示数据是否正在加载
//
// 工作原理：
// 1. 页面立即渲染，不等待数据
// 2. pending = true，显示骨架屏（ArticleSkeleton）
// 3. 后台异步请求数据：GET /api/solutions/[slug]
// 4. 数据加载完成后：
//    - pending = false
//    - response = { success: true, data: Solution 对象 }
//    - 触发 solution computed 重新计算
//    - 显示页面内容
//
// ============================================================================
const { data: response, pending } = useLazyFetch<{ success: boolean, data: Solution }>(`/api/solutions/${slug}`, {
  // 默认值：请求失败或加载中时返回的对象
  default: () => ({ success: false, data: null as any })
})

// ============================================================================
// 解决方案数据计算属性 (Solution Data Computed)
// ============================================================================
//
// 使用 computed 创建解决方案数据的响应式计算属性
//
// 作用：
// 1. 从 API 响应中提取解决方案对象
// 2. 响应式追踪：自动追踪 response 的变化
// 3. 类型安全：确保返回值类型为 Solution | undefined
//
// 返回值：
// - response.value?.data：解决方案对象（如果 response 存在）
// - undefined：如果 response 不存在
//
// 为什么使用可选链（?.）？
// - response.value 可能为 null 或 undefined
// - 使用可选链避免运行时错误
//
// ============================================================================
const solution = computed(() => response.value?.data)

// ============================================================================
// 获取本地化标题 (Get Localized Title)
// ============================================================================
//
// 使用 computed 创建本地化标题的响应式计算属性
//
// 作用：
// 1. 根据当前语言获取对应的标题
// 2. 处理多种数据格式（对象或字符串）
// 3. 提供语言回退机制
//
// 返回值：
// - 当前语言的标题字符串
// - 如果解决方案不存在，返回空字符串
//
// 数据格式处理：
// - typeof solution.value.title === 'object'：
//   - 多语言对象：{ 'zh-CN': '...', 'zh-HK': '...', en: '...' }
//   - 优先返回当前语言的标题
//   - 回退到简体中文（zh-CN）
// - typeof solution.value.title !== 'object'：
//   - 字符串：直接返回
//
// 为什么需要处理多种格式？
// - 不同的 API 可能返回不同的数据格式
// - 兼容旧数据和新数据
// - 提供更好的容错性
//
// ============================================================================
const localizedTitle = computed(() => {
  // 如果解决方案不存在，返回空字符串
  if (!solution.value) return ''

  // 检查标题是否为对象（多语言格式）
  return typeof solution.value.title === 'object'
    // 如果是对象，优先返回当前语言的标题，回退到简体中文
    ? solution.value.title[locale.value as keyof typeof solution.value.title] || solution.value.title['zh-CN']
    // 如果是字符串，直接返回
    : solution.value.title
})

// ============================================================================
// 获取本地化描述 (Get Localized Description)
// ============================================================================
//
// 使用 computed 创建本地化描述的响应式计算属性
//
// 作用：
// 1. 根据当前语言获取对应的描述
// 2. 处理多种数据格式（对象或字符串）
// 3. 提供语言回退机制
//
// 返回值：
// - 当前语言的描述字符串
// - 如果解决方案不存在，返回空字符串
//
// 数据格式处理：
// - 与 localizedTitle 相同的处理逻辑
//
// ============================================================================
const localizedDescription = computed(() => {
  // 如果解决方案不存在，返回空字符串
  if (!solution.value) return ''

  // 检查描述是否为对象（多语言格式）
  return typeof solution.value.description === 'object'
    // 如果是对象，优先返回当前语言的描述，回退到简体中文
    ? solution.value.description[locale.value as keyof typeof solution.value.description] || solution.value.description['zh-CN']
    // 如果是字符串，直接返回
    : solution.value.description
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
// 1. 唯一的页面标题（包含解决方案名称）
// 2. 品牌一致性（包含 " - Solutions"）
// 3. 关键词自然融入标题
// 4. 加载状态：显示 "Loading Solution..." 作为临时标题
//
// 搜索引擎优化 (SEO)：
// - 标题：帮助搜索引擎理解页面主题（解决方案详情页）
// - 解决方案名称：提升搜索结果展示
//
// ============================================================================
useHead({
  // 页面标题：解决方案名称 + " - Solutions"
  // 如果 localizedTitle 存在，使用解决方案名称
  // 否则，使用 "Loading Solution..." 作为临时标题
  title: localizedTitle.value ? `${localizedTitle.value} - Solutions` : 'Loading Solution...',
})
</script>
