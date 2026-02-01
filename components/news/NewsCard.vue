<template>
  <!-- NuxtLink：Nuxt 3 的路由链接组件，自动支持国际化 -->
  <!-- :to="localePath(...)"：生成带语言前缀的路径 -->
  <!-- class：卡片基础样式 + 悬停效果 -->
  <!--   - group：父组件组，用于子元素的 group-hover 效果 -->
  <!--   - block：块级元素，占据整行 -->
  <!--   - bg-white：白色背景 -->
  <!--   - border border-gray-100：浅灰色边框 -->
  <!--   - hover:border-swiss-text：悬停时边框变为主文本颜色 -->
  <!--   - hover:-translate-y-2：悬停时向上移动 8px（浮起效果） -->
  <!--   - hover:shadow-2xl：悬停时添加大阴影 -->
  <!--   - transition-all duration-500：平滑过渡动画，持续时间 500ms -->
  <!--   - overflow-hidden：溢出内容隐藏（用于图片缩放效果） -->
  <NuxtLink
    :to="localePath(`/news/${post.slug || post.id}`)"
    class="group block bg-white border border-gray-100 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 overflow-hidden"
  >
    <!-- 封面图片区域 -->
    <!-- aspect-video：16:9 宽高比（视频比例） -->
    <!-- bg-gray-50：浅灰色背景（图片加载前的占位色） -->
    <!-- relative：相对定位（用于绝对定位子元素） -->
    <!-- overflow-hidden：溢出内容隐藏（用于图片缩放效果） -->
    <div class="aspect-video bg-gray-50 relative overflow-hidden">
      <!-- Shimmer 占位符：图片加载前显示的闪烁效果 -->
      <!-- v-if：条件渲染，当有封面图且图片未加载时显示 -->
      <!-- absolute inset-0：绝对定位，占据整个容器 -->
      <!-- z-10：高层级，覆盖在图片上方 -->
      <div v-if="post.cover_image && !imageLoaded" class="shimmer absolute inset-0 z-10"></div>

      <!-- NuxtImg：Nuxt 3 的优化图片组件 -->
      <!-- 优势：自动 WebP 转换、懒加载、响应式图片、CDN 优化 -->
      <!-- v-if="post.cover_image"：有封面图时才渲染 -->
      <!-- :src="post.cover_image"：图片源 URL -->
      <!-- :alt="post.title[lang]"：替代文本（用于 SEO 和无障碍），支持多语言 -->
      <!-- width="800" height="450"：原始尺寸（用于生成响应式图片） -->
      <!-- format="webp"：输出 WebP 格式（更小文件） -->
      <!-- quality="80"：图片质量（80% 高质量） -->
      <!-- loading="lazy"：懒加载，不在视口时不加载 -->
      <!-- sizes：响应式图片尺寸断点 -->
      <!--   - xs:100vw：小屏设备全宽 -->
      <!--   - sm:50vw：平板占 50% -->
      <!--   - md:33vw lg:33vw：中到大屏占 33%（3 列布局） -->
      <!-- @load="imageLoaded = true"：加载完成回调，隐藏 shimmer -->
      <!-- class：样式 -->
      <!--   - w-full h-full：宽高 100% -->
      <!--   - object-cover：保持宽高比，裁剪溢出部分 -->
      <!--   - group-hover:scale-105：悬停时放大到 105% -->
      <!--   - transition-all duration-700 ease-in-out：平滑过渡动画 -->
      <!-- :class="imageLoaded ? 'opacity-100' : 'opacity-0'"：加载完成后渐变显示 -->
      <!-- placeholder：启用占位符效果 -->
      <NuxtImg
        v-if="post.cover_image"
        :src="post.cover_image"
        :alt="post.title[lang]"
        width="800"
        height="450"
        format="webp"
        quality="80"
        loading="lazy"
        sizes="xs:100vw sm:50vw md:33vw lg:33vw"
        @load="imageLoaded = true"
        class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
        :class="[imageLoaded ? 'opacity-100' : 'opacity-0']"
        placeholder
      />

      <!-- 无封面图占位符：当文章没有封面图时显示 -->
      <!-- v-else：如果没有封面图，显示此占位符 -->
      <!-- absolute inset-0：绝对定位，占据整个容器 -->
      <!-- flex items-center justify-center：内容居中 -->
      <!-- bg-gray-50：浅灰色背景 -->
      <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-50">
        <!-- SVG 图标容器 -->
        <!-- w-12 h-12：12 单位宽高 -->
        <!-- text-gray-200：浅灰色 -->
        <div class="w-12 h-12 text-gray-200">
          <!-- SVG 图标：图片占位符 -->
          <!-- xmlns：XML 命名空间 -->
          <!-- viewBox="0 0 24 24"：SVG 视口 24x24 -->
          <!-- fill="none"：无填充 -->
          <!-- stroke="currentColor"：描边使用当前文本颜色 -->
          <!-- stroke-width="1"：描边宽度 1 -->
          <!-- stroke-linecap="round"：圆角线端 -->
          <!-- stroke-linejoin="round"：圆角连接 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <!-- 图片边框 -->
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <!-- 加号图标 -->
            <line x1="16" y1="5" x2="22" y2="5" />
            <line x1="19" y1="2" x2="19" y2="8" />
            <!-- 太阳图标 -->
            <circle cx="9" cy="9" r="2" />
            <!-- 山脉图标 -->
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </div>

      <!-- 日期标签 -->
      <!-- absolute bottom-4 left-4：绝对定位，距离底部和左侧各 4 单位 -->
      <!-- z-20：高层级（高于图片） -->
      <div class="absolute bottom-4 left-4 z-20">
        <!-- 日期标签文本 -->
        <!-- px-3 py-1：内边距（水平 3，垂直 1） -->
        <!-- bg-white/90：白色背景，90% 不透明度 -->
        <!-- backdrop-blur-sm：背景模糊效果 -->
        <!-- text-[10px]：极小字体（10px） -->
        <!-- font-bold：字重加粗 -->
        <!-- tracking-widest：最大字母间距 -->
        <!-- text-swiss-text：主文本颜色 -->
        <!-- uppercase：全大写 -->
        <span
          class="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold tracking-widest text-swiss-text uppercase"
        >
          <!-- 格式化日期：使用 formatDate 函数 -->
          <!-- post.published_at || post.created_at：优先使用发布时间，否则使用创建时间 -->
          {{ formatDate(post.published_at || post.created_at) }}
        </span>
      </div>
    </div>

    <!-- 内容区域 -->
    <!-- p-6：内边距 6 单位（1.5rem，24px） -->
    <div class="p-6">
      <!-- 标签列表 -->
      <!-- flex flex-wrap gap-2 mb-3：弹性布局，自动换行，间距 2，底部边距 3 -->
      <!-- v-if="post.tags && post.tags.length"：当有标签时才显示 -->
      <div class="flex flex-wrap gap-2 mb-3" v-if="post.tags && post.tags.length">
        <!-- 循环渲染每个标签 -->
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="text-[9px] font-bold uppercase tracking-tighter text-swiss-secondary border border-gray-100 px-2 py-0.5 rounded-full"
        >
          <!-- 标签文本 -->
          <!-- text-[9px]：极小字体（9px） -->
          <!-- font-bold：字重加粗 -->
          <!-- uppercase：全大写 -->
          <!-- tracking-tighter：紧凑字母间距 -->
          <!-- text-swiss-secondary：次要文本颜色 -->
          <!-- border border-gray-100：浅灰色边框 -->
          <!-- px-2 py-0.5：内边距（水平 2，垂直 0.5） -->
          <!-- rounded-full：圆角边框（胶囊形状） -->
          {{ tag }}
        </span>
      </div>

      <!-- 标题 -->
      <!-- TypographyHeader：瑞士风格标题组件 -->
      <!-- :level="3"：语义化级别，对应 h3 -->
      <!-- size="h5"：视觉尺寸为 h5 -->
      <!-- class：样式 -->
      <!--   - mb-3：底部边距 3 单位 -->
      <!--   - group-hover:text-swiss-accent：悬停时变为强调色 -->
      <!--   - transition-colors：平滑颜色过渡 -->
      <!--   - line-clamp-2：限制为 2 行，超出省略 -->
      <!--   - min-h-[3rem]：最小高度 3rem（确保卡片高度一致） -->
      <TypographyHeader
        :level="3"
        size="h5"
        class="mb-3 group-hover:text-swiss-accent transition-colors line-clamp-2 min-h-[3rem]"
      >
        <!-- 多语言标题：使用 lang 计算属性获取当前语言的标题 -->
        {{ post.title[lang] }}
      </TypographyHeader>

      <!-- 摘要/预览文本 -->
      <!-- text-swiss-secondary：次要文本颜色 -->
      <!-- text-sm：小号字体 -->
      <!-- line-clamp-3：限制为 3 行，超出省略 -->
      <!-- mb-6：底部边距 6 单位 -->
      <!-- opacity-70：70% 不透明度 -->
      <p class="text-swiss-secondary text-sm line-clamp-3 mb-6 opacity-70">
        <!-- 优先使用摘要，否则从内容中提取预览文本 -->
        <!-- post.summary?.[lang]：当前语言的摘要 -->
        <!-- extractTextPreview(post.content?.[lang] || '')：从内容中提取预览 -->
        {{ post.summary?.[lang] || extractTextPreview(post.content?.[lang] || '') }}
      </p>

      <!-- "阅读更多"链接 -->
      <!-- flex items-center：弹性布局，垂直居中 -->
      <!-- text-[10px]：极小字体（10px） -->
      <!-- font-bold：字重加粗 -->
      <!-- tracking-widest：最大字母间距 -->
      <!-- uppercase：全大写 -->
      <!-- text-swiss-text：主文本颜色 -->
      <!-- group-hover:text-swiss-accent：悬停时变为强调色 -->
      <!-- transition-colors：平滑颜色过渡 -->
      <div
        class="flex items-center text-[10px] font-bold tracking-widest uppercase text-swiss-text group-hover:text-swiss-accent transition-colors"
      >
        <!-- 使用 i18n 国际化翻译键 'common.readMore' -->
        {{ $t('common.readMore') }}
        <!-- 箭头图标 -->
        <!-- ml-2：左边距 2 单位 -->
        <!-- group-hover:translate-x-1：悬停时向右移动 4px -->
        <!-- transition-transform：平滑过渡动画 -->
        <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：新闻卡片组件 (News Card Component)
 * ============================================================================
 *
 * 此组件是一个新闻卡片，用于在新闻列表中显示单个新闻文章。
 *
 * 功能说明：
 * 1. 封面图片：显示文章封面图，支持懒加载和加载动画
 * 2. 日期标签：显示文章发布日期
 * 3. 标签列表：显示文章标签（可选）
 * 4. 标题链接：显示文章标题，点击跳转到详情页
 * 5. 摘要/预览：显示文章摘要或从内容中提取预览
 * 6. "阅读更多"按钮：引导用户点击阅读全文
 * 7. 国际化支持：支持多语言（中文、英文）
 * 8. 响应式设计：适配不同屏幕尺寸
 * 9. 悬停效果：悬停时卡片浮起、边框变色、图片放大
 * 10. 加载状态：图片加载前显示 shimmer 占位符
 *
 * 瑞士设计特点：
 * - 网格布局 (Grid)：在新闻列表中使用网格布局
 * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 交互效果 (Interaction)：悬停时的浮起和放大效果
 *
 * 性能优化：
 * - NuxtImg：自动图片优化（WebP、懒加载、CDN）
 * - 懒加载：loading="lazy"，不在视口时不加载
 * - 响应式图片：sizes 属性，生成不同尺寸的图片
 * - Shimmer 占位符：提前显示 UI 结构，减少感知加载时间
 *
 * 可访问性 (Accessibility)：
 * - alt 文本：图片的替代文本，支持 SEO 和无障碍
 * - 语义化 HTML：使用正确的 HTML 标签
 * - 键盘导航：NuxtLink 组件支持键盘导航
 * - 对比度：文本和背景对比度符合 WCAG 标准
 *
 * 依赖组件：
 * - TypographyHeader：瑞士风格标题组件
 * - NuxtLink：Nuxt 3 路由链接组件
 * - NuxtImg：Nuxt 3 图片优化组件
 *
 * 依赖类型：
 * - Post：文章类型定义
 *
 * ============================================================================
 */

// 导入 Post 类型定义，用于类型检查和 TypeScript 智能提示
import type { Post } from '~/types'

// ============================================================================
// Props 定义 (Props Definition)
// ============================================================================
//
// 定义组件的 Props，使用 TypeScript 泛型指定类型
//
// Props 说明：
// - post：Post 类型的文章对象
*   - 包含 id、slug、title、content、summary、cover_image、tags、published_at 等字段
*
// ============================================================================
const props = defineProps<{
  post: Post
}>()

// ============================================================================
// Nuxt 3 组合式 API 导入 (Nuxt 3 Composables)
// ============================================================================

// useLocalePath：生成本地化路径的工具函数
// 自动为路径添加当前语言前缀（如 /en/news/slug、/zh-HK/news/slug）
// 用途：导航到文章详情页时保持语言一致性
const localePath = useLocalePath()

// useI18n：获取国际化配置和工具函数
// 解构获取 locale：当前语言代码（如 'en'、'zh-HK'）
// 用于多语言内容显示
const { locale } = useI18n()

// 图片加载状态：false = 未加载，true = 已加载
// 用于控制图片淡入动画和 shimmer 占位符显示
const imageLoaded = ref(false)

// ============================================================================
// 当前语言代码计算属性 (Current Language Code Computed)
// ============================================================================
//
// 数据库中的语言键名格式：
* - cn：简体中文
* - hk：繁体中文（香港）
* - en：英文
*
// Nuxt i18n 的语言代码：
* - zh-CN：简体中文
* - zh-HK：繁体中文（香港）
* - en：英文
*
// 需要映射关系：
* - zh-CN / zh-cn → cn
* - zh-HK / zh-hk → hk
* - en → en
*
// ============================================================================
const lang = computed(() => {
  // 获取当前语言代码
  const l = locale.value as string

  // 检查是否包含 'HK' 或 'hk'，返回 'hk'
  if (l.includes('HK') || l.includes('hk')) return 'hk'

  // 检查是否包含 'CN' 或 'cn'，返回 'cn'
  if (l.includes('CN') || l.includes('cn')) return 'cn'

  // 默认返回 'en'
  return 'en'
})

// ============================================================================
// 从 HTML 或 Markdown 内容中提取纯文本预览
// ============================================================================
//
// 函数作用：
* - 从 HTML 富文本或 Markdown 内容中提取纯文本
* - 用于生成文章预览摘要
*
// 参数：
* - content：HTML 或 Markdown 字符串
*
// 返回值：
* - 纯文本预览，最多 150 字符
* - 如果内容为空，返回空字符串
*
// 工作流程：
* 1. 检查内容是否为空
* 2. 去除首尾空格
* 3. 检查是否为 HTML（以 < 开头，以 > 结尾）
* 4. 如果是 HTML：
*    - 创建临时 div 元素
*    - 设置 innerHTML
*    - 提取 textContent 或 innerText
*    - 去除多余空格和换行
*    - 限制长度为 150 字符
* 5. 如果不是 HTML（Markdown）：
*    - 直接截取前 150 字符
*
// 示例：
* - 输入：'<p>这是一段 HTML 内容...</p>'
* - 输出：'这是一段 HTML 内容...'
*
// 为什么需要提取文本？
* - 数据库存储的是 HTML 或 Markdown 格式的内容
* - 卡片预览需要纯文本
* - 避免 HTML 标签显示在预览中
*
// ============================================================================
function extractTextPreview(content: string): string {
  // 检查内容是否为空
  if (!content) return ''

  // 去除首尾空格
  const trimmedContent = content.trim()

  // 检查是否为 HTML 富文本
  // 判断标准：以 < 开头，以 > 结尾
  const isHtml = trimmedContent.startsWith('<') && trimmedContent.endsWith('>')

  if (isHtml) {
    // 提取 HTML 中的纯文本
    // 创建临时 div 元素
    const tempDiv = document.createElement('div')

    // 设置 innerHTML，让浏览器解析 HTML
    tempDiv.innerHTML = trimmedContent

    // 提取纯文本
    // textContent：标准属性，大多数浏览器支持
    // innerText：非标准属性，但兼容性更好
    const textContent = tempDiv.textContent || tempDiv.innerText || ''

    // 去除多余空格和换行
    // \s+：匹配一个或多个空白字符（空格、制表符、换行等）
    // ' '：替换为单个空格
    const cleanText = textContent.replace(/\s+/g, ' ').trim()

    // 限制长度为 150 字符，超出则添加省略号
    return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText
  } else {
    // Markdown 内容，直接截取前 150 字符
    return trimmedContent.length > 150 ? trimmedContent.substring(0, 150) + '...' : trimmedContent
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
* - dateStr：ISO 8601 日期字符串（如 '2024-01-15T10:30:00Z'）
*
// 返回值：
* - 格式化后的日期字符串
* - 英文：'Jan 15, 2024'
* - 中文：'2024年1月15日'
*
// 工作流程：
* 1. 检查日期字符串是否为空
* 2. 创建 Date 对象
* 3. 使用 toLocaleDateString 格式化日期
* 4. 根据当前语言选择格式：
*    - 英文：'en-US' → 'Jan 15, 2024'
*    - 中文：'zh-HK' → '2024年1月15日'
*
// toLocaleDateString 参数：
* - locale：区域设置（如 'en-US'、'zh-HK'）
* - options：格式化选项
*   - year: 'numeric'：显示完整年份（如 2024）
*   - month: 'short'：显示简短月份（如 Jan、1月）
*   - day: 'numeric'：显示日期数字（如 15）
*
// ============================================================================
function formatDate(dateStr: string) {
  // 检查日期字符串是否为空
  if (!dateStr) return ''

  // 创建 Date 对象
  const date = new Date(dateStr)

  // 格式化日期
  // locale.value === 'en' ? 'en-US' : 'zh-HK'：根据当前语言选择区域设置
  // options：格式化选项
  return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-HK', {
    year: 'numeric',   // 年份：2024
    month: 'short',   // 月份：Jan / 1月
    day: 'numeric',   // 日期：15
  })
}
</script>

<!-- 样式定义 (Scoped Styles) -->
<!-- scoped：样式只作用于当前组件，不影响其他组件 -->
<style scoped>
<!--
  Shimmer 占位符样式
  作用：图片加载前显示的闪烁效果，提升用户体验
-->
.shimmer {
  <!-- 线性渐变背景：创建闪烁效果 -->
  background: linear-gradient(
    90deg,                    <!-- 90度方向（从左到右） -->
    rgba(255, 255, 255, 0) 0%,        <!-- 0% 位置：透明 -->
    rgba(255, 255, 255, 0.4) 45%,    <!-- 45% 位置：40% 不透明度 -->
    rgba(255, 255, 255, 0.5) 50%,    <!-- 50% 位置：50% 不透明度（最亮） -->
    rgba(255, 255, 255, 0.4) 55%,    <!-- 55% 位置：40% 不透明度 -->
    rgba(255, 255, 255, 0) 100%      <!-- 100% 位置：透明 -->
  );

  <!-- 背景尺寸：200% 宽度，100% 高度 -->
  background-size: 200% 100%;

  <!-- 动画：名称，持续时间，缓动函数，循环次数 -->
  animation: shimmer 1.5s infinite linear;
}

<!-- Shimmer 动画关键帧 -->
@keyframes shimmer {
  <!-- 0%：背景位置在最左侧（-200%） -->
  0% {
    background-position: -200% 0;
  }

  <!-- 100%：背景位置在最右侧（200%） -->
  100% {
    background-position: 200% 0;
  }
}

<!--
  限制文本为 2 行，超出省略
  作用：确保标题不超过 2 行，保持卡片高度一致
-->
.line-clamp-2 {
  <!-- 使用 WebKit 盒模型（Chrome、Safari、Edge） -->
  display: -webkit-box;

  <!-- 限制显示的行数为 2 -->
  -webkit-line-clamp: 2;

  <!-- 设置盒模型方向为垂直 -->
  -webkit-box-orient: vertical;

  <!-- 标准属性（Firefox） -->
  line-clamp: 2;

  <!-- 隐藏溢出内容 -->
  overflow: hidden;
}

<!--
  限制文本为 3 行，超出省略
  作用：确保摘要/预览不超过 3 行
-->
.line-clamp-3 {
  <!-- 使用 WebKit 盒模型 -->
  display: -webkit-box;

  <!-- 限制显示的行数为 3 -->
  -webkit-line-clamp: 3;

  <!-- 设置盒模型方向为垂直 -->
  -webkit-box-orient: vertical;

  <!-- 标准属性 -->
  line-clamp: 3;

  <!-- 隐藏溢出内容 -->
  overflow: hidden;
}
</style>
