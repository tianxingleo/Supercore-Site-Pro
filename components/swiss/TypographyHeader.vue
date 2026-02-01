<template>
  <!-- 动态渲染标题标签 -->
  <!-- component：Vue 3 的动态组件，根据 is 属性渲染不同的 HTML 元素 -->
  <!-- :is="tag"：动态标签名，根据 props.level 计算（h1-h6） -->
  <!-- :class="headerClasses"：动态应用样式类名 -->
  <component :is="tag" :class="headerClasses">
    <!-- 插槽：允许父组件传入自定义内容 -->
    <!-- 例如：<TypographyHeader>标题内容</TypographyHeader> -->
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：瑞士风格标题组件 (Swiss Design Typography Header Component)
 * ============================================================================
 *
 * 此组件是一个高度可定制的瑞士风格标题组件，用于渲染语义化的标题标签。
 *
 * 瑞士设计特点：
 * - 大标题 (Display Typography)：超大字体，强烈的视觉冲击
 * - 紧凑字母间距 (Tight Tracking)：tracking-tighter, tracking-tight
 * - 清晰的字重体系：从 light 到 black 的多种字重
 * - 响应式字体：不同屏幕尺寸使用不同字体大小
 * - 极简主义：简洁的 UI，突出内容
 *
 * 核心功能：
 * 1. 动态标签渲染：根据 level 属性渲染 h1-h6
 * 2. 多种尺寸变体：display, h1-h6（超大到大号）
 * 3. 多种字重：light, normal, medium, semibold, bold, black
 * 4. 多种颜色：text, secondary, accent, white
 * 5. 多种对齐：left, center, right
 * 6. 多种字母间距：tighter, tight, normal, wide, wider
 * 7. 多种行高：none, tight, snug, normal, relaxed, loose
 * 8. 可选边距：margin = true/false
 *
 * 使用场景：
 * - 页面标题（h1）：使用 level=1, size=display 或 h1
 * - 章节标题（h2）：使用 level=2, size=h2
 * - 卡片标题（h3）：使用 level=3, size=h3
 * - 副标题（h4-h6）：使用 level=4-6
 *
 * 设计原则：
 * 1. 语义化：使用正确的 HTML 标签（h1-h6）
 * 2. 可访问性：符合 WCAG 标准
 * 3. 响应式：适配移动端、平板、桌面端
 * 4. 一致性：全局统一的设计系统
 * 5. 灵活性：支持多种样式组合
 *
 * 性能优化：
 * - 使用 computed 缓存类名计算结果
 * - 使用 const 断言优化类型推断
 * - 使用展开运算符减少数组操作
 *
 * ============================================================================
 */

// ============================================================================
// Props 类型定义 (Props Type Definition)
// ============================================================================
//
// 使用 TypeScript 接口定义 Props 的类型
// 提供类型检查和智能提示
//
// Props 说明：
// 1. level：语义化级别（h1-h6），用于 SEO 和可访问性
// 2. size：视觉尺寸（display, h1-h6），独立于语义级别
// 3. weight：字重（light-black）
// 4. color：颜色（text, secondary, accent, white）
// 5. align：对齐方式（left, center, right）
// 6. tracking：字母间距（tighter-wider）
// 7. leading：行高（none-loose）
// 8. margin：是否添加底部边距
//
// ============================================================================
interface Props {
  // 语义化级别：对应 HTML 的 h1-h6 标签
  // 用途：
  // - SEO：搜索引擎理解页面结构
  // - 可访问性：屏幕阅读器导航
  // - 语义化：正确的 HTML 结构
  level?: 1 | 2 | 3 | 4 | 5 | 6

  // 视觉尺寸：字体大小
  // 用途：控制标题的视觉大小
  // - display：超大标题（用于页面主标题）
  // - h1-h6：标准标题尺寸
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  // 字重：字体粗细
  // 用途：控制标题的视觉重量
  // - light：轻（300）
  // - normal：常规（400）
  // - medium：中等（500）
  // - semibold：半粗（600）
  // - bold：粗（700）
  // - black：特粗（900）
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black'

  // 颜色：文本颜色
  // 用途：控制标题的颜色
  // - text：主文本颜色
  // - secondary：次要文本颜色（灰色）
  // - accent：强调色
  // - white：白色
  color?: 'text' | 'secondary' | 'accent' | 'white'

  // 对齐方式：文本对齐
  // 用途：控制标题的文本对齐
  // - left：左对齐
  // - center：居中对齐
  // - right：右对齐
  align?: 'left' | 'center' | 'right'

  // 字母间距：字符之间的间距
  // 用途：控制字母之间的距离（瑞士设计关键特征）
  // - tighter：最紧凑
  // - tight：紧凑
  // - normal：正常
  // - wide：宽
  // - wider：最宽
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider'

  // 行高：行与行之间的距离
  // 用途：控制多行文本的行高
  // - none：行高 1
  // - tight：行高 1.25
  // - snug：行高 1.375
  // - normal：行高 1.5
  // - relaxed：行高 1.625
  // - loose：行高 2
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

  // 边距：是否添加底部边距
  // 用途：控制标题的下边距
  // - true：添加底部边距（mb-4, last:mb-0）
  // - false：不添加边距
  margin?: boolean
}

// ============================================================================
// Props 定义和默认值 (Props Definition and Default Values)
// ============================================================================
//
// defineProps<Props>()：定义 props，并指定类型为 Props
// withDefaults()：设置 props 的默认值
//
// 默认值说明：
// - level: 1：默认为 h1（最重要的标题）
// - size: 'h1'：默认为大号标题
// - weight: 'bold'：默认为粗体
// - color: 'text'：默认为主文本颜色
// - align: 'left'：默认左对齐
// - tracking: 'tight'：默认紧凑字母间距（瑞士设计特征）
// - leading: 'tight'：默认紧凑行高
// - margin: true：默认添加底部边距
*
// ============================================================================
const props = withDefaults(defineProps<Props>(), {
  level: 1,
  size: 'h1',
  weight: 'bold',
  color: 'text',
  align: 'left',
  tracking: 'tight',
  leading: 'tight',
  margin: true,
})

// ============================================================================
// 计算动态标签名 (Compute Dynamic Tag Name)
// ============================================================================
//
// 使用 computed 创建响应式计算属性
// 根据 props.level 计算 HTML 标签名
*
// 返回值：
* - h1, h2, h3, h4, h5, h6
*
// 使用 const 断言：
* - `h${props.level}` 会被推断为字符串类型
* - `as const` 告诉 TypeScript 这是一个字面量类型
* - 优化类型推断，提供更好的智能提示
*
// 示例：
* - level=1 → tag = 'h1'
* - level=2 → tag = 'h2'
* - level=6 → tag = 'h6'
*
// ============================================================================
const tag = computed(() => `h${props.level}` as const)

// ============================================================================
// 计算样式类名 (Compute CSS Classes)
// ============================================================================
//
// 使用 computed 创建响应式计算属性
* 根据 props 的不同值动态生成 Tailwind CSS 类名
*
// 工作流程：
* 1. 创建空数组 classes
* 2. 根据 props.size 添加尺寸类名
* 3. 根据 props.weight 添加字重类名
* 4. 根据 props.color 添加颜色类名
* 5. 根据 props.align 添加对齐类名
* 6. 根据 props.tracking 添加字母间距类名
* 7. 根据 props.leading 添加行高类名
* 8. 根据 props.margin 添加边距类名
* 9. 返回类名数组（Vue 会自动合并为字符串）
*
// ============================================================================
const headerClasses = computed(() => {
  // 初始化类名数组
  const classes: string[] = []

  // ============================================================================
  // 1. 尺寸变体 (Size Variants)
  // ============================================================================
  //
  // Swiss 设计特征：大标题，强烈的视觉冲击
  *
  // 尺寸说明：
  * - display：超大标题（用于页面主标题）
  *   - 移动端：text-7xl（4.5rem，72px）
  *   - 平板：sm:text-8xl（6rem，96px）
  *   - 桌面：lg:text-9xl（8rem，128px）
  *   - 字重：font-black（900）
  *   - 字母间距：tracking-tighter（最紧凑）
  *   - 行高：leading-[0.9]（0.9，非常紧凑）
  *
  // - h1：大号标题
  *   - 移动端：text-5xl（3rem，48px）
  *   - 平板：sm:text-6xl（3.75rem，60px）
  *   - 桌面：lg:text-7xl（4.5rem，72px）
  *   - 字重：font-black（900）
  *   - 字母间距：tracking-tight（紧凑）
  *
  // - h2：中号标题
  *   - 移动端：text-4xl（2.25rem，36px）
  *   - 平板：sm:text-5xl（3rem，48px）
  *   - 桌面：lg:text-6xl（3.75rem，60px）
  *   - 字重：font-bold（700）
  *   - 字母间距：tracking-tight（紧凑）
  *
  // - h3：标准标题
  *   - 移动端：text-3xl（1.875rem，30px）
  *   - 平板：sm:text-4xl（2.25rem，36px）
  *   - 桌面：lg:text-4xl（2.25rem，36px）
  *   - 字重：font-bold（700）
  *   - 字母间距：tracking-tight（紧凑）
  *
  // - h4：小号标题
  *   - 移动端：text-2xl（1.5rem，24px）
  *   - 平板：sm:text-3xl（1.875rem，30px）
  *   - 桌面：lg:text-3xl（1.875rem，30px）
  *   - 字重：font-semibold（600）
  *
  // - h5：更小标题
  *   - 移动端：text-xl（1.25rem，20px）
  *   - 平板：sm:text-2xl（1.5rem，24px）
  *   - 桌面：lg:text-2xl（1.5rem，24px）
  *   - 字重：font-semibold（600）
  *
  // - h6：最小标题
  *   - 移动端：text-lg（1.125rem，18px）
  *   - 平板：sm:text-xl（1.25rem，20px）
  *   - 桌面：lg:text-xl（1.25rem，20px）
  *   - 字重：font-semibold（600）
  *
  // 响应式断点：
  * - 无前缀：移动端（默认）
  * - sm：平板（640px+）
  * - lg：桌面（1024px+）
  *
  // ============================================================================
  const sizes = {
    display: ['text-7xl', 'sm:text-8xl', 'lg:text-9xl', 'font-black', 'tracking-tighter', 'leading-[0.9]'],
    h1: ['text-5xl', 'sm:text-6xl', 'lg:text-7xl', 'font-black', 'tracking-tight'],
    h2: ['text-4xl', 'sm:text-5xl', 'lg:text-6xl', 'font-bold', 'tracking-tight'],
    h3: ['text-3xl', 'sm:text-4xl', 'lg:text-4xl', 'font-bold', 'tracking-tight'],
    h4: ['text-2xl', 'sm:text-3xl', 'lg:text-3xl', 'font-semibold'],
    h5: ['text-xl', 'sm:text-2xl', 'lg:text-2xl', 'font-semibold'],
    h6: ['text-lg', 'sm:text-xl', 'lg:text-xl', 'font-semibold'],
  }

  // 将选中的尺寸类名添加到数组
  classes.push(...sizes[props.size])

  // ============================================================================
  // 2. 字重 (Font Weight)
  // ============================================================================
  //
  // 字重说明：
  * - light：300，轻
  * - normal：400，常规
  * - medium：500，中等
  * - semibold：600，半粗
  * - bold：700，粗
  * - black：900，特粗
  *
  // Tailwind CSS 字重类名：
  * - font-light：对应 font-weight: 300
  * - font-normal：对应 font-weight: 400
  * - font-medium：对应 font-weight: 500
  * - font-semibold：对应 font-weight: 600
  * - font-bold：对应 font-weight: 700
  * - font-black：对应 font-weight: 900
  *
  // ============================================================================
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    black: 'font-black',
  }
  classes.push(weights[props.weight])

  // ============================================================================
  // 3. 颜色 (Color)
  // ============================================================================
  //
  // 颜色说明：
  * - text：主文本颜色（通常是黑色或深灰色）
  * - secondary：次要文本颜色（通常是浅灰色）
  * - accent：强调色（通常是品牌色）
  * - white：白色
  *
  // Tailwind CSS 自定义颜色类名：
  * - text-swiss-text：主文本颜色（在 tailwind.config.js 中定义）
  * - text-swiss-text-muted：次要文本颜色
  * - text-swiss-accent：强调色
  * - text-white：白色（Tailwind 内置）
  *
  // ============================================================================
  const colors = {
    text: 'text-swiss-text',
    secondary: 'text-swiss-text-muted',
    accent: 'text-swiss-accent',
    white: 'text-white',
  }
  classes.push(colors[props.color])

  // ============================================================================
  // 4. 对齐方式 (Text Alignment)
  // ============================================================================
  //
  // 对齐说明：
  * - left：左对齐（默认）
  * - center：居中对齐
  * - right：右对齐
  *
  // Tailwind CSS 对齐类名：
  * - text-left：text-align: left
  * - text-center：text-align: center
  * - text-right：text-align: right
  *
  // ============================================================================
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  classes.push(alignments[props.align])

  // ============================================================================
  // 5. 字母间距 (Letter Spacing / Tracking)
  // ============================================================================
  //
  // 瑞士设计特征：紧凑的字母间距
  *
  // 字母间距说明：
  * - tighter：-0.05em（最紧凑）
  * - tight：-0.025em（紧凑）
  * - normal：0（正常）
  * - wide：0.025em（宽）
  * - wider：0.05em（最宽）
  *
  // Tailwind CSS 字母间距类名：
  * - tracking-tighter：letter-spacing: -0.05em
  * - tracking-tight：letter-spacing: -0.025em
  * - tracking-normal：letter-spacing: 0
  * - tracking-wide：letter-spacing: 0.025em
  * - tracking-wider：letter-spacing: 0.05em
  *
  // 为什么使用紧凑字母间距？
  * - Swiss 设计风格特征
  * - 大标题看起来更现代、更有冲击力
  * - 节省水平空间
  *
  // ============================================================================
  const trackings = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
  }
  classes.push(trackings[props.tracking])

  // ============================================================================
  // 6. 行高 (Line Height)
  // ============================================================================
  //
  // 行高说明：
  * - none：1（无额外行高）
  * - tight：1.25（紧凑）
  * - snug：1.375（舒适）
  * - normal：1.5（正常）
  * - relaxed：1.625（宽松）
  * - loose：2（最宽松）
  *
  // Tailwind CSS 行高类名：
  * - leading-none：line-height: 1
  * - leading-tight：line-height: 1.25
  * - leading-snug：line-height: 1.375
  * - leading-normal：line-height: 1.5
  * - leading-relaxed：line-height: 1.625
  * - leading-loose：line-height: 2
  *
  // ============================================================================
  const lineHeights = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }
  classes.push(lineHeights[props.leading])

  // ============================================================================
  // 7. 边距 (Margin)
  // ============================================================================
  //
  // 边距说明：
  * - margin = true：添加底部边距
  *   - mb-4：底部边距 1rem（16px）
  *   - last:mb-0：最后一个子元素不添加边距
  *
  // 为什么要添加 last:mb-0？
  * - 避免最后一个元素有多余的底部边距
  * - 符合设计规范
  * - 减少不必要的空白
  *
  // Tailwind CSS 边距类名：
  * - mb-4：margin-bottom: 1rem
  * - last:mb-4：最后一个子元素的 margin-bottom: 1rem
  * - last:mb-0：最后一个子元素的 margin-bottom: 0
  *
  // ============================================================================
  if (props.margin) {
    classes.push('mb-4', 'last:mb-0')
  }

  // 返回类名数组
  // Vue 会自动将数组转换为字符串，并用空格连接
  // 例如：['text-5xl', 'font-bold', 'text-swiss-text'] → 'text-5xl font-bold text-swiss-text'
  return classes
})
</script>
