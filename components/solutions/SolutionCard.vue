<template>
  <!-- NuxtLink：Nuxt 3 的路由链接组件，自动支持国际化 -->
  <!-- :to="localePath(...)"：生成带语言前缀的路径 -->
  <!-- class：卡片基础样式 + 悬停效果 -->
  <!--   - group：父组件组，用于子元素的 group-hover 效果 -->
  <!--   - block：块级元素，占据整行 -->
  <!--   - bg-white：白色背景 -->
  <!--   - border border-gray-100：浅灰色边框 -->
  <!--   - p-10：内边距 10 单位（2.5rem，40px） -->
  <!--   - hover:border-swiss-text：悬停时边框变为主文本颜色 -->
  <!--   - hover:-translate-y-2：悬停时向上移动 8px（浮起效果） -->
  <!--   - hover:shadow-2xl：悬停时添加大阴影 -->
  <!--   - transition-all duration-500：平滑过渡动画，持续时间 500ms -->
  <!--   - min-h-full：最小高度为父容器高度 -->
  <!-- :aria-label：无障碍标签，屏幕阅读器使用 -->
  <NuxtLink
    :to="localePath(`/solutions/${solution.slug}`)"
    class="group block bg-white border border-gray-100 p-10 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 min-h-full"
    :aria-label="`Learn more about our ${solution.title[currentLocale]} solution`"
  >
    <!-- 图标容器 -->
    <!-- mb-12：底部边距 12 单位 -->
    <!-- aria-hidden="true"：屏幕阅读器隐藏此元素（纯装饰性） -->
    <div class="mb-12" aria-hidden="true">
      <!-- 图标框 -->
      <!-- w-12 h-12：12 单位宽高 -->
      <!-- flex items-center justify-center：内容居中对齐 -->
      <!-- border border-gray-200：浅灰色边框 -->
      <!-- group-hover:bg-swiss-text：悬停时背景变为主文本颜色 -->
      <!-- group-hover:border-swiss-text：悬停时边框变为主文本颜色 -->
      <!-- group-hover:scale-110：悬停时放大到 110% -->
      <!-- transition-all duration-500：平滑过渡动画，持续时间 500ms -->
      <div
        class="w-12 h-12 flex items-center justify-center border border-gray-200 group-hover:bg-swiss-text group-hover:border-swiss-text group-hover:scale-110 transition-all duration-500"
      >
        <!-- 动态图标组件 -->
        <!-- component：Vue 3 的动态组件 -->
        <!-- :is="getIcon(solution.icon)"：根据图标名称动态渲染图标 -->
        <!-- class：样式 -->
        <!--   - w-6 h-6：6 单位宽高 -->
        <!--   - text-swiss-text：主文本颜色 -->
        <!--   - group-hover:text-white：悬停时变为白色 -->
        <!--   - transition-colors duration-500：平滑颜色过渡，持续时间 500ms -->
        <component
          :is="getIcon(solution.icon)"
          class="w-6 h-6 text-swiss-text group-hover:text-white transition-colors duration-500"
        />
      </div>
    </div>

    <!-- 标题 -->
    <!-- TypographyHeader：瑞士风格标题组件 -->
    <!-- :level="3"：语义化级别，对应 h3 -->
    <!-- size="h3"：视觉尺寸为 h3 -->
    <!-- class="mb-6 !tracking-tighter"：底部边距 6 单位，紧凑字母间距（! 优先级提升） -->
    <TypographyHeader :level="3" size="h3" class="mb-6 !tracking-tighter">
      <!-- 多语言标题：使用 currentLocale 计算属性获取当前语言的标题 -->
      {{ solution.title[currentLocale] }}
    </TypographyHeader>

    <!-- 描述 -->
    <!-- text-swiss-text-muted：次要文本颜色 -->
    <!-- text-base：基准字体大小（16px） -->
    <!-- leading-relaxed：宽松行高 -->
    <!-- mb-10：底部边距 10 单位 -->
    <!-- max-w-sm：最大宽度 small（14rem，224px） -->
    <p class="text-swiss-text-muted text-base leading-relaxed mb-10 max-w-sm">
      <!-- 多语言描述：使用 currentLocale 计算属性获取当前语言的描述 -->
      {{ solution.description[currentLocale] }}
    </p>

    <!-- "了解更多"链接 -->
    <!-- mt-auto：margin-top: auto，将此元素推到底部 -->
    <!-- pt-4：顶部边距 4 单位 -->
    <!-- flex items-center：弹性布局，垂直居中 -->
    <!-- text-xs：极小字体（12px） -->
    <!-- font-bold：字重加粗 -->
    <!-- tracking-widest：最大字母间距 -->
    <!-- uppercase：全大写 -->
    <!-- text-swiss-text：主文本颜色 -->
    <!-- group-hover:translate-x-2：悬停时向右移动 8px -->
    <!-- transition-transform duration-500：平滑过渡动画，持续时间 500ms -->
    <!-- aria-hidden="true"：屏幕阅读器隐藏此元素（纯装饰性） -->
    <div
      class="mt-auto pt-4 flex items-center text-xs font-bold tracking-widest uppercase text-swiss-text group-hover:translate-x-2 transition-transform duration-500"
      aria-hidden="true"
    >
      <!-- 使用 i18n 国际化翻译键 'common.learnMore'，或回退到 'Explore' -->
      {{ $t('common.learnMore') || 'Explore' }}
      <!-- 箭头图标 -->
      <!-- ml-2：左边距 2 单位 -->
      <span class="ml-2">→</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：解决方案卡片组件 (Solution Card Component)
 * ============================================================================
 *
 * 此组件是一个解决方案卡片，用于在解决方案列表中显示单个解决方案。
 *
 * 功能说明：
 * 1. 图标显示：根据解决方案类型显示对应图标（Server、Network、Settings、Code、Shield、Cloud）
 * 2. 标题：多语言标题
 * 3. 描述：多语言描述
 * 4. "了解更多"链接：引导用户点击查看解决方案详情
 * 5. 国际化支持：支持多语言（中文、英文）
 * 6. 悬停效果：悬停时卡片浮起、图标放大、箭头移动
 * 7. 动态图标：使用 Vue 的 h 函数动态渲染 SVG 图标
 *
 * 瑞士设计特点：
 * - 网格布局 (Grid)：在解决方案列表中使用网格布局
 * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
 * - 极简主义 (Minimalism)：简洁的 UI，突出解决方案
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 交互效果 (Interaction)：悬停时的浮起和放大效果
 *
 * 图标系统：
 * - 使用 Vue 的渲染函数（h 函数）动态渲染 SVG 图标
 * - 不使用外部图标库，减少依赖
 * - 图标完全内联，易于自定义
 * - 支持主题色切换（text-swiss-text → text-white）
 *
 * Vue 渲染函数（h 函数）：
 * - h('tag', props, children)：创建虚拟 DOM 节点
 * - 优势：
 *   - 更灵活的组件创建
 *   - 更好的性能（避免模板编译）
 *   - 可以动态创建元素
 * - 适合复杂的图标渲染
 *
 * 使用场景：
 * - 解决方案列表页
 * - 解决方案推荐
 * - 解决方案分类展示
 *
 * 性能优化：
 * - 使用渲染函数：避免模板编译开销
 * - 动态图标：按需加载图标
 * - 悬停效果：使用 CSS transform（GPU 加速）
 *
 * 可访问性 (Accessibility)：
 * - aria-label：提供描述性标签
 * - aria-hidden：隐藏装饰性元素
 * - 键盘导航：NuxtLink 组件支持键盘导航
 * - 对比度：文本和背景对比度符合 WCAG 标准
 *
 * 依赖组件：
 * - TypographyHeader：瑞士风格标题组件
 * - NuxtLink：Nuxt 3 路由链接组件
 *
 * 依赖类型：
 * - Solution：解决方案类型定义
 *
 * ============================================================================
 */

// 导入 h 函数：Vue 3 的渲染函数
// 用于动态创建虚拟 DOM 节点
// h 函数是 Vue 3 Composition API 的核心函数之一
import { h } from 'vue'

// 导入 Solution 类型定义，用于类型检查和 TypeScript 智能提示
import type { Solution } from '~/types'

// ============================================================================
// Props 定义 (Props Definition)
// ============================================================================
//
// 定义组件的 Props，使用 TypeScript 接口指定类型
//
// Props 说明：
// - solution：Solution 类型的解决方案对象
*   - 包含 id、slug、title、description、icon、category 等字段
*
// ============================================================================
interface Props {
  solution: Solution
}

// 使用 defineProps 定义 props，并指定类型为 Props
const props = defineProps<Props>()

// ============================================================================
// Nuxt 3 组合式 API 导入 (Nuxt 3 Composables)
// ============================================================================

// useLocalePath：生成本地化路径的工具函数
// 自动为路径添加当前语言前缀（如 /en/solutions/slug、/zh-HK/solutions/slug）
// 用途：导航到解决方案详情页时保持语言一致性
const localePath = useLocalePath()

// useI18n：获取国际化配置和工具函数
// 解构获取 locale：当前语言代码（如 'en'、'zh-HK'）
// 用于多语言内容显示
const { locale } = useI18n()

// 当前语言代码的响应式计算属性
// computed：自动追踪依赖（locale），当 locale 改变时重新计算
// 用途：在函数中获取当前语言，避免直接访问 locale.value
// 类型断言：as 'zh-HK' | 'zh-CN' | 'en'，确保类型安全
const currentLocale = computed(() => locale.value as 'zh-HK' | 'zh-CN' | 'en')

// ============================================================================
// 图标组件定义 (Icon Components Definition)
// ============================================================================
//
// 使用 Vue 的 h 函数定义 SVG 图标组件
*
// 为什么使用 h 函数？
* - 更灵活的组件创建
* - 更好的性能（避免模板编译）
* - 可以动态创建元素
* - 适合复杂的图标渲染
* - 不需要额外的图标库
*
// h 函数语法：
* - h('tag', props, children)：创建虚拟 DOM 节点
* - tag：HTML 标签名（如 'svg'、'path'）
* - props：属性对象（如 viewBox、fill、d）
* - children：子节点（可以是字符串、数组或其他节点）
*
// SVG 图标说明：
* - viewBox：SVG 视口，定义图标坐标系
* - fill：填充颜色（'none' = 无填充）
* - stroke：描边颜色（'currentColor' = 使用当前文本颜色）
* - stroke-width：描边宽度（'2' = 2px）
* - stroke-linecap：线端样式（'round' = 圆角）
* - stroke-linejoin：连接样式（'round' = 圆角）
* - d：路径数据（SVG 路径命令）
*
// 图标列表：
// 1. Server：服务器图标（机架式服务器）
// 2. Network：网络图标（网络连接）
// 3. Settings：设置图标（齿轮）
// 4. Code：代码图标（编程）
// 5. Shield：安全图标（盾牌）
// 6. Cloud：云服务图标（云朵）
*
// ============================================================================
const icons = {
  // Server 服务器图标
  // 描述：机架式服务器，用于 IDC 解决方案
  Server: {
    // render 函数：使用 h 函数渲染图标
    render: () =>
      h(
        // 创建 svg 元素
        'svg',
        // SVG 属性
        {
          fill: 'none',              // 无填充
          stroke: 'currentColor',     // 描边颜色使用当前文本颜色
          viewBox: '0 0 24 24'        // SVG 视口 24x24
        },
        // 创建 path 元素（子节点）
        h('path', {
          // Path 属性
          'stroke-linecap': 'round',   // 圆角线端
          'stroke-linejoin': 'round',  // 圆角连接
          'stroke-width': '2',          // 描边宽度 2px
          // 路径数据：绘制服务器图标
          // M5 12h14：水平线（从 (5,12) 到 (19,12)）
          // M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2：左侧面板
          // M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2：右侧面板
          // m-2-4h.01：顶部连接
          // M17 16h.01：底部连接
          d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
        })
      ),
  },
  // Network 网络图标
  // 描述：网络连接，用于网络解决方案
  Network: {
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          // 路径数据：绘制网络连接图标（云 + 箭头）
          d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
        })
      ),
  },
  // Settings 设置图标
  // 描述：齿轮，用于运维解决方案
  Settings: {
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        [
          // 齿轮外圈（Path 1）
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
          }),
          // 齿轮内圈（Path 2）
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
          }),
        ]
      ),
  },
  // Code 代码图标
  // 描述：代码符号，用于开发解决方案
  Code: {
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          // 路径数据：绘制代码符号（< > /）
          d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
        })
      ),
  },
  // Shield 安全图标
  // 描述：盾牌，用于安全解决方案
  Shield: {
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          // 路径数据：绘制盾牌图标
          d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        })
      ),
  },
  // Cloud 云服务图标
  // 描述：云朵，用于云服务解决方案
  Cloud: {
    render: () =>
      h(
        'svg',
        {
          fill: 'none',
          stroke: 'currentColor',
          viewBox: '0 0 24 24'
        },
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          // 路径数据：绘制云朵图标
          d: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
        })
      ),
  },
}

// ============================================================================
// 获取图标组件 (Get Icon Component)
// ============================================================================
//
// 函数作用：
* - 根据图标名称返回对应的图标组件
* - 如果图标不存在，返回默认的 Server 图标
*
// 参数说明：
* - iconName：图标名称（字符串）
*   - 可选值：'Server', 'Network', 'Settings', 'Code', 'Shield', 'Cloud'
*
// 返回值：
* - 图标组件（render 函数）
* - 如果图标不存在，返回 icons.Server（默认图标）
*
// 类型说明：
* - icons[iconName as keyof typeof icons]：类型安全的图标访问
* - keyof typeof icons：获取 icons 对象的所有键名
* - 确保 iconName 是有效的图标名称
*
// 使用场景：
* - 根据解决方案的 icon 字段动态显示图标
* - 提供默认图标（Server）作为回退
*
// 示例说明：
* - getIcon('Server') → icons.Server（服务器图标）
* - getIcon('Network') → icons.Network（网络图标）
* - getIcon('Unknown') → icons.Server（默认图标）
*
// ============================================================================
const getIcon = (iconName: string) => {
  // 返回对应的图标组件，如果不存在则返回 Server 图标（默认）
  return icons[iconName as keyof typeof icons] || icons.Server
}
</script>
