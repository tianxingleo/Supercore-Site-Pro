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
  <NuxtLink
    :to="localePath(`/products/${product.slug}`)"
    class="group block bg-white border border-gray-100 hover:border-swiss-text hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
  >
    <!-- 产品图片区域 -->
    <!-- aspect-square：1:1 宽高比（正方形） -->
    <!-- bg-swiss-bg-soft：瑞士风格浅色背景 -->
    <!-- relative：相对定位（用于绝对定位子元素） -->
    <!-- flex items-center justify-center：内容居中对齐 -->
    <!-- p-8：内边距 8 单位（2rem，32px） -->
    <div class="aspect-square bg-swiss-bg-soft relative flex items-center justify-center p-8">
      <!-- Shimmer 占位符：图片加载前显示的闪烁效果 -->
      <!-- v-if：条件渲染，当有图片且图片未加载时显示 -->
      <!-- absolute inset-0：绝对定位，占据整个容器 -->
      <!-- z-10：高层级，覆盖在图片上方 -->
      <div
        v-if="product.images && product.images.length > 0 && !imageLoaded"
        class="shimmer absolute inset-0 z-10"
      ></div>

      <!-- NuxtImg：Nuxt 3 的优化图片组件 -->
      <!-- 优势：自动 WebP 转换、懒加载、响应式图片、CDN 优化 -->
      <!-- v-if="product.images && product.images.length > 0"：有图片时才渲染 -->
      <!-- :src="product.images[0]"：使用第一张图片作为封面 -->
      <!-- :alt：替代文本（用于 SEO 和无障碍），支持多语言回退 -->
      <!--   - product.name[locale]：当前语言 -->
      <!--   - product.name['zh-HK']：繁体中文回退 -->
      <!--   - product.name.en：英文回退 -->
      <!-- width="800" height="600"：原始尺寸（用于生成响应式图片） -->
      <!-- format="webp"：输出 WebP 格式（更小文件） -->
      <!-- quality="80"：图片质量（80% 高质量） -->
      <!-- loading="lazy"：懒加载，不在视口时不加载 -->
      <!-- sizes：响应式图片尺寸断点 -->
      <!--   - xs:100vw：小屏设备全宽 -->
      <!--   - sm:50vw：平板占 50% -->
      <!--   - md:33vw：中屏占 33%（3 列布局） -->
      <!--   - lg:25vw：大屏占 25%（4 列布局） -->
      <!-- @load="imageLoaded = true"：加载完成回调，隐藏 shimmer -->
      <!-- class：样式 -->
      <!--   - max-w-full max-h-full：最大宽度和高度为容器大小 -->
      <!--   - object-contain：保持宽高比 -->
      <!--   - group-hover:scale-105：悬停时放大到 105% -->
      <!--   - transition-all duration-700 ease-in-out：平滑过渡动画 -->
      <!-- :class="imageLoaded ? 'opacity-100' : 'opacity-0'"：加载完成后渐变显示 -->
      <!-- placeholder：启用占位符效果 -->
      <NuxtImg
        v-if="product.images && product.images.length > 0"
        :src="product.images[0]"
        :alt="
          product.name[locale as keyof typeof product.name] ||
          product.name['zh-HK'] ||
          product.name.en
        "
        width="800"
        height="600"
        format="webp"
        quality="80"
        loading="lazy"
        sizes="xs:100vw sm:50vw md:33vw lg:25vw"
        @load="imageLoaded = true"
        class="max-w-full max-h-full object-contain group-hover:scale-105 transition-all duration-700 ease-in-out"
        :class="[imageLoaded ? 'opacity-100' : 'opacity-0']"
        placeholder
      />
      <!-- 无图片占位符：当产品没有图片时显示 -->
      <!-- v-else：如果没有图片，显示此占位符 -->
      <!-- w-2/3 h-2/3：宽度和高度各占容器的 2/3 -->
      <!-- flex items-center justify-center：内容居中 -->
      <div v-else class="w-2/3 h-2/3 flex items-center justify-center">
        <!-- 后备占位符 -->
        <!-- w-full h-full：占满父容器 -->
        <!-- bg-swiss-text：主文本颜色背景 -->
        <!-- opacity-[0.03]：极低不透明度（3%） -->
        <!-- group-hover:opacity-[0.05]：悬停时变为 5% 不透明度 -->
        <!-- transition-all duration-500：平滑过渡动画 -->
        <div
          class="w-full h-full bg-swiss-text opacity-[0.03] group-hover:opacity-[0.05] transition-all duration-500"
        ></div>
      </div>

      <!-- 类别标签 -->
      <!-- absolute top-4 left-4：绝对定位，距离顶部和左侧各 4 单位 -->
      <!-- z-20：高层级（高于图片） -->
      <div class="absolute top-4 left-4 z-20">
        <!-- 类别标签文本 -->
        <!-- px-3 py-1：内边距（水平 3，垂直 1） -->
        <!-- bg-white/90：白色背景，90% 不透明度 -->
        <!-- backdrop-blur-sm：背景模糊效果 -->
        <!-- rounded-full：圆角边框（胶囊形状） -->
        <!-- text-xs：小号字体（12px） -->
        <!-- font-medium：中等字重 -->
        <!-- text-swiss-text：主文本颜色 -->
        <span
          class="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-swiss-text"
        >
          <!-- 使用 getCategoryLabel 函数获取类别的中文标签 -->
          {{ getCategoryLabel(product.category) }}
        </span>
      </div>

      <!-- 特色标签（Featured Badge） -->
      <!-- v-if="product.featured"：只有当产品为特色产品时才显示 -->
      <!-- absolute top-4 right-4：绝对定位，距离顶部和右侧各 4 单位 -->
      <!-- z-20：高层级（高于图片） -->
      <div v-if="product.featured" class="absolute top-4 right-4 z-20">
        <!-- 特色标签文本 -->
        <!-- px-3 py-1：内边距（水平 3，垂直 1） -->
        <!-- bg-swiss-text：主文本颜色背景 -->
        <!-- text-white：白色文本 -->
        <!-- rounded-full：圆角边框（胶囊形状） -->
        <!-- text-[10px]：极小字体（10px） -->
        <!-- font-bold：字重加粗 -->
        <!-- tracking-widest：最大字母间距 -->
        <!-- uppercase：全大写 -->
        <span
          class="px-3 py-1 bg-swiss-text text-white rounded-full text-[10px] font-bold tracking-widest uppercase"
        >
          <!-- 使用 i18n 国际化翻译键 'products.featured' -->
          {{ $t('products.featured') }}
        </span>
      </div>
    </div>

    <!-- 产品信息区域 -->
    <!-- p-6：内边距 6 单位（1.5rem，24px） -->
    <div class="p-6">
      <!-- 产品名称 -->
      <!-- TypographyHeader：瑞士风格标题组件 -->
      <!-- :level="3"：语义化级别，对应 h3 -->
      <!-- size="h4"：视觉尺寸为 h4 -->
      <!-- class：样式 -->
      <!--   - mb-2：底部边距 2 单位 -->
      <!--   - group-hover:text-swiss-accent：悬停时变为强调色 -->
      <!--   - transition-colors：平滑颜色过渡 -->
      <TypographyHeader
        :level="3"
        size="h4"
        class="mb-2 group-hover:text-swiss-accent transition-colors"
      >
        <!-- 使用 getProductName 函数获取多语言产品名称 -->
        {{ getProductName() }}
      </TypographyHeader>
      <!-- 产品描述 -->
      <!-- text-swiss-secondary：次要文本颜色 -->
      <!-- text-sm：小号字体 -->
      <!-- line-clamp-2：限制为 2 行，超出省略 -->
      <!-- mb-4：底部边距 4 单位 -->
      <p class="text-swiss-secondary text-sm line-clamp-2 mb-4">
        <!-- 使用 getProductDescription 函数获取多语言产品描述 -->
        {{ getProductDescription() }}
      </p>

      <!-- 关键规格预览 -->
      <!-- flex items-center justify-between：两端对齐，垂直居中 -->
      <!-- text-xs：极小字体（12px） -->
      <!-- text-swiss-secondary：次要文本颜色 -->
      <div class="flex items-center justify-between text-xs text-swiss-secondary">
        <!-- CPU 规格：如果存在则显示 -->
        <span v-if="product.specs?.cpu">{{ product.specs.cpu }}</span>
        <!-- 机架单位：如果存在则显示 -->
        <span v-if="product.specs?.rackUnits">{{ product.specs.rackUnits }}</span>
        <!-- "查看详情"按钮 -->
        <!-- SwissButton：瑞士风格按钮组件 -->
        <!-- variant="ghost"：幽灵按钮样式（无背景，悬停时显示背景） -->
        <!-- size="sm"：小尺寸按钮 -->
        <SwissButton variant="ghost" size="sm"> {{ $t('products.viewDetails') }} → </SwissButton>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：产品卡片组件 (Product Card Component)
 * ============================================================================
 *
 * 此组件是一个产品卡片，用于在产品列表中显示单个产品。
 *
 * 功能说明：
 * 1. 产品图片：显示产品封面图，支持懒加载和加载动画
 * 2. 类别标签：显示产品类别（如伺服器、存儲、網絡等）
 * 3. 特色标签：如果产品为特色产品，显示"Featured"标签
 * 4. 产品名称：多语言产品名称
 * 5. 产品描述：多语言产品描述
 * 6. 关键规格预览：显示关键规格（CPU、机架单位等）
 * 7. "查看详情"按钮：引导用户点击查看产品详情
 * 8. 国际化支持：支持多语言（中文、英文）
 * 9. 响应式设计：适配不同屏幕尺寸
 * 10. 悬停效果：悬停时卡片浮起、边框变色、图片放大
 *
 * 瑞士设计特点：
 * - 网格布局 (Grid)：在产品列表中使用网格布局
 * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
 * - 极简主义 (Minimalism)：简洁的 UI，突出产品
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
 * - SwissButton：瑞士风格按钮组件
 * - NuxtLink：Nuxt 3 路由链接组件
 * - NuxtImg：Nuxt 3 图片优化组件
 *
 * 依赖类型：
 * - Product：产品类型定义
 *
 * ============================================================================
 */

// 导入 Product 类型定义，用于类型检查和 TypeScript 智能提示
import type { Product } from '~/types'

// ============================================================================
// Props 定义 (Props Definition)
// ============================================================================
//
// 定义组件的 Props，使用 TypeScript 接口指定类型
//
// Props 说明：
// - product：Product 类型的产品对象
*   - 包含 id、slug、name、description、images、specs、category、featured 等字段
*
// ============================================================================
interface Props {
  product: Product
}

// 使用 defineProps 定义 props，并指定类型为 Props
const props = defineProps<Props>()

// ============================================================================
// Nuxt 3 组合式 API 导入 (Nuxt 3 Composables)
// ============================================================================

// useLocalePath：生成本地化路径的工具函数
// 自动为路径添加当前语言前缀（如 /en/products/slug、/zh-HK/products/slug）
// 用途：导航到产品详情页时保持语言一致性
const localePath = useLocalePath()

// useI18n：获取国际化配置和工具函数
// 解构获取 locale：当前语言代码（如 'en'、'zh-CN'、'zh-HK'）
// 用于多语言内容显示
const { locale } = useI18n()

// 图片加载状态：false = 未加载，true = 已加载
// 用于控制图片淡入动画和 shimmer 占位符显示
const imageLoaded = ref(false)

// 当前语言代码的响应式计算属性
// computed：自动追踪依赖（locale），当 locale 改变时重新计算
// 用途：在函数中获取当前语言，避免直接访问 locale.value
const currentLocale = computed(() => locale.value)

// ============================================================================
// 产品类别标签映射 (Product Category Label Mapping)
// ============================================================================
//
// 产品类别英文到中文的映射表
*
// 为什么需要映射？
* - 数据库中存储的是英文类别代码（如 'server'、'storage'）
* - 用户界面需要显示中文标签（如 '伺服器'、'存儲'）
*
// Record<string, string> 类型说明：
* - Record<string, string>：一个键值对对象，键和值都是字符串
* - TypeScript 的工具类型，简化对象类型定义
*
// 映射关系：
// - server → 伺服器
* - storage → 存儲
* - network → 網絡
* - software → 軟件
* - hpc → 高性能計算（High Performance Computing）
* - storage-hp → 高性能存儲（High Performance Storage）
*
// ============================================================================
const categoryLabels: Record<string, string> = {
  server: '伺服器',
  storage: '存儲',
  network: '網絡',
  software: '軟件',
  hpc: '高性能計算',
  'storage-hp': '高性能存儲',
}

// 获取类别标签的函数
//
// 参数：
// - category：英文类别代码（如 'server'）
*
// 返回值：
* - 中文标签（如 '伺服器'）
* - 如果类别不存在，返回原始类别代码
*
// 使用示例：
// getCategoryLabel('server') → '伺服器'
// getCategoryLabel('unknown') → 'unknown'
*
// ============================================================================
const getCategoryLabel = (category: string): string => {
  // 返回映射的中文标签，如果不存在则返回原始类别代码
  return categoryLabels[category] || category
}

// ============================================================================
// 安全获取产品名称 (Safely Get Product Name)
// ============================================================================
//
// 为什么需要安全获取？
* - 产品名称是多语言对象（{ 'zh-CN': '...', 'zh-HK': '...', en: '...' }）
* - 当前语言的名称可能不存在
* - 需要回退到其他语言
* - 需要处理 null 或 undefined 的情况
*
// 回退策略：
* 1. 当前语言（如 'zh-CN'）
* 2. 简体中文（zh-CN）
* 3. 繁体中文（zh-HK）
* 4. 英文（en）
* 5. 产品 slug
* 6. '未知产品'
*
// 返回值：
* - 产品名称字符串
*
// ============================================================================
const getProductName = () => {
  // 获取产品名称对象
  const name = props.product.name

  // 如果名称不存在，返回 slug 或 '未知产品'
  if (!name) return props.product.slug || '未知产品'

  // 优先使用当前语言的名称
  if (name[currentLocale.value]) {
    return name[currentLocale.value]
  }

  // 回退到简体中文
  if (name['zh-CN']) return name['zh-CN']

  // 回退到繁体中文
  if (name['zh-HK']) return name['zh-HK']

  // 回退到英文
  if (name.en) return name.en

  // 最后回退到 slug 或 '未知产品'
  return props.product.slug || '未知产品'
}

// ============================================================================
// 安全获取产品描述 (Safely Get Product Description)
// ============================================================================
//
// 为什么需要安全获取？
* - 产品描述是多语言对象
* - 当前语言的描述可能不存在
* - 需要回退到其他语言
* - 需要处理 null 或 undefined 的情况
*
// 回退策略：
* 1. 当前语言（如 'zh-CN'）
* 2. 简体中文（zh-CN）
* 3. 繁体中文（zh-HK）
* 4. 英文（en）
* 5. '暂无描述'
*
// 返回值：
* - 产品描述字符串
*
// ============================================================================
const getProductDescription = () => {
  // 获取产品描述对象
  const desc = props.product.description

  // 如果描述不存在，返回 '暂无描述'
  if (!desc) return '暂无描述'

  // 优先使用当前语言的描述
  if (desc[currentLocale.value]) {
    return desc[currentLocale.value]
  }

  // 回退到简体中文
  if (desc['zh-CN']) return desc['zh-CN']

  // 回退到繁体中文
  if (desc['zh-HK']) return desc['zh-HK']

  // 回退到英文
  if (desc.en) return desc.en

  // 最后回退到 '暂无描述'
  return '暂无描述'
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
  作用：确保描述不超过 2 行，保持卡片高度一致
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
</style>
