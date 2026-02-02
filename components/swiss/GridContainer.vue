<!--
================================================================================
瑞士设计网格容器组件（Grid Container Component）
================================================================================

文件作用：
此文件是瑞士国际主义设计的网格容器组件，用于创建响应式布局。
它是一个灵活的布局组件，支持不同的尺寸、网格系统、间距和对齐方式。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 响应式设计：支持移动端、平板、桌面、超大屏
3. Tailwind CSS：使用 Tailwind 的网格系统
4. 动态类名：使用 computed 动态计算 CSS 类名
5. 默认值：withDefaults() 设置默认属性

核心功能：
1. 尺寸控制：支持 5 种尺寸
   - sm：小屏幕（max-w-3xl）
   - md：中屏幕（max-w-5xl）
   - lg：大屏幕（max-w-7xl）
   - xl：超大屏幕（max-w-1400px）
   - full：全宽（max-w-full）
2. 网格系统：启用/禁用 Tailwind 网格
3. 间距控制：5 种间距选项
   - none：无间距（用于创建网格线）
   - sm：小间距（gap-4，1rem）
   - md：中等间距（gap-6，1.5rem）
   - lg：大间距（gap-8，2rem）
   - xl：超大间距（gap-12，3rem）
4. 对齐方式：居中或左对齐
5. 内边距：启用/禁用内边距

使用示例：
- 基础用法：使用默认配置的 GridContainer
- 小尺寸容器：使用 size="sm" 指定小屏幕尺寸
- 全宽容器：使用 size="full" 并禁用内边距
- 网格布局：启用网格系统和无间距创建网格线效果
- 左对齐：使用 centered="false" 禁用居中对齐

================================================================================ -->

<template>
  <!-- ====================================================================================
       容器 div
       ====================================================================================
       - :class="containerClasses"：动态类名绑定
       - 所有的 Tailwind CSS 类名由 containerClasses 计算得出
  -->
  <div :class="containerClasses">
    <!-- ====================================================================================
         插槽（Slot）
         ====================================================================================
         - <slot />：插槽，用于插入子组件或内容
         - 父母组件的内容会渲染在这里
    -->
    <slot />
  </div>
</template>
<script setup lang="ts">
/**
 * GridContainer - 瑞士设计网格容器组件
 *
 * @description 灵活的响应式布局容器，支持多种尺寸、网格系统、间距和对齐方式
 *
 * 使用示例：
 *
 * ```vue
 * <!-- 基础用法：默认配置 -->
 * <GridContainer>
 *   <div class="col-span-12">内容</div>
 * </GridContainer>
 *
 * <!-- 小尺寸容器 -->
 * <GridContainer size="sm">
 *   <div class="col-span-12">内容</div>
 * </GridContainer>
 *
 * <!-- 全宽容器 -->
 * <GridContainer size="full" :padding="false">
 *   <div class="col-span-12">内容</div>
 * </GridContainer>
 *
 * <!-- 网格布局 + 无间距（创建网格线） -->
 * <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
 *   <div class="col-span-12 border-r border-b border-gray-100">内容 1</div>
 *   <div class="col-span-12 border-b border-gray-100">内容 2</div>
 * </GridContainer>
 *
 * <!-- 左对齐 -->
 * <GridContainer :centered="false">
 *   <div class="col-span-12">内容</div>
 * </GridContainer>
 * ```
 *
 * 瑞士设计网格系统：
 * - col-span-12：占满整行（移动端）
 * - col-span-6：占半行（2 列布局）
 * - col-span-4：占 1/3 行（3 列布局）
 * - col-span-3：占 1/4 行（4 列布局）
 * - col-span-2：占 1/6 行（6 列布局）
 * - col-span-1：占 1/12 行（12 列布局）
 *
 * GridContainer vs GridColumn：
 * - GridContainer：容器组件，控制整体布局
 * - GridColumn：列组件，控制单个单元格
 * - 配合使用实现瑞士设计网格系统
 *
 * Props 属性：
 * 1. size：容器尺寸（可选，默认 'lg'）
 *    - sm：小屏幕（max-w-3xl，42rem）
 *    - md：中屏幕（max-w-5xl，70rem）
 *    - lg：大屏幕（max-w-7xl，98rem）
 *    - xl：超大屏幕（max-w-1400px）
 *    - full：全宽（max-w-full）
 *
 * 2. grid：是否启用网格（可选，默认 false）
 *    - true：启用 Tailwind 网格系统（grid grid-cols-12）
 *    - false：不启用（普通 div）
 *
 * 3. cols：网格列数（可选，默认 12）
 *    - Tailwind 的 grid-cols-* 类名
 *    - 例如：1、2、3、4、6、12
 *
 * 4. gap：间距（可选，默认 'md'）
 *    - none：无间距
 *    - sm：小间距（gap-4）
 *    - md：中等间距（gap-6）
 *    - lg：大间距（gap-8）
 *    - xl：超大间距（gap-12）
 *
 * 5. centered：是否居中（可选，默认 true）
 *    - true：水平居中（mx-auto）
 *    - false：左对齐（默认行为）
 *
 * 6. padding：是否有内边距（可选，默认 true）
 *    - true：添加内边距（px-6 sm:px-8 lg:px-12）
 *    - false：无内边距
 *
 * 设计特点：
 * - 瑞士国际主义风格：简洁、网格系统
 * - 响应式设计：支持所有设备尺寸
 * - 灵活的间距控制：支持 5 种间距
 * - 居中对齐：默认居中，可配置
 * - 内边距控制：可启用/禁用
 *
 * 技术栈：
 * - 框架：Nuxt 3（Vue 3）
 * - 样式：Tailwind CSS
 * - 响应式：Tailwind 断点（sm、md、lg、xl）
 *
 * 性能优化：
 * - computed 缓存：类名计算结果缓存
 * - 避免不必要的类名更新
 * - 最小化重渲染
 */

// ====================================================================================
// Props 属性定义
// ====================================================================================
// 定义 GridContainer 组件接收的属性

/**
 * Props 接口：GridContainer 组件的属性定义
 *
 * 属性说明：
 * - size：容器最大宽度（响应式）
 * - grid：是否启用网格系统
 * - cols：网格列数
 * - gap：间距大小
 * - centered：是否居中对齐
 * - padding：是否有内边距
 */
interface Props {
  // 容器最大宽度（可选）
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  // 是否启用网格系统（可选，默认 false）
  grid?: boolean

  // 网格列数（可选，默认 12）
  cols?: 1 | 2 | 3 | 4 | 6 | 12

  // 间距大小（可选，默认 md）
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'

  // 是否居中对齐（可选，默认 true）
  centered?: boolean

  // 是否有内边距（可选，默认 true）
  padding?: boolean
}

// ====================================================================================
// Props 默认值
// ====================================================================================
// withDefaults()：设置组件属性的默认值
// 参数：
// 1. defineProps<Props>()：定义 Props 类型
// 2. 默认值对象
const props = withDefaults(defineProps<Props>(), {
  size: 'lg', // 默认：大屏幕（max-w-7xl）
  grid: false, // 默认：不启用网格
  cols: 12, // 默认：12 列
  gap: 'md', // 默认：中等间距
  centered: true, // 默认：居中对齐
  padding: true, // 默认：有内边距
})

// ====================================================================================
// 动态计算容器类名
// ====================================================================================
// containerClasses：计算属性，根据 props 返回 Tailwind CSS 类名
const containerClasses = computed(() => {
  // 类名数组，用于存储所有需要的 CSS 类
  const classes: string[] = []

  // ====================================================================================
  // 1. 最大宽度（Max width sizing）
  // ====================================================================================
  // sizes 对象：定义不同尺寸对应的 max-w 类名
  // sm: max-w-3xl（42rem，672px）
  // md: max-w-5xl（70rem，1120px）
  // lg: max-w-7xl（98rem，1568px）
  // xl: max-w-[1400px]（1400px）
  // full: max-w-full（100% 宽度）
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  // 根据 props.size 选择对应的类名，并添加到数组
  classes.push(sizes[props.size])

  // ====================================================================================
  // 2. 居中对齐（Center alignment）
  // ====================================================================================
  // 如果 centered 为 true，则添加 mx-auto 类
  // mx-auto：水平居中（左右 margin: auto）
  if (props.centered) {
    classes.push('mx-auto')
  }

  // ====================================================================================
  // 3. 网格系统（Grid system）
  // ====================================================================================
  // 如果 grid 为 true，则启用 Tailwind 网格系统
  if (props.grid) {
    // grid：启用 CSS Grid 布局
    // grid-cols-12：12 列网格（Tailwind 的网格系统）
    classes.push('grid', 'grid-cols-12')
  }

  // ====================================================================================
  // 4. 间距（Gap spacing）
  // ====================================================================================
  // gaps 对象：定义不同间距对应的 gap 类名
  // none：无间距（gap-0，默认）
  // sm：小间距（gap-4，1rem）
  // md：中等间距（gap-6，1.5rem）
  // lg：大间距（gap-8，2rem）
  // xl：超大间距（gap-12，3rem）
  const gaps = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  // 如果 gap 不为 none，则添加对应的间距类名
  // 为什么检查 !== 'none'？
  // - 避免添加空字符串作为类名
  // - 'none' 时不需要间距类名
  if (props.gap !== 'none') {
    classes.push(gaps[props.gap])
  }

  // ====================================================================================
  // 5. 内边距（Padding）
  // ====================================================================================
  // 如果 padding 为 true，则添加内边距类名
  // px-6：移动端水平内边距（1.5rem）
  // sm:px-8：平板以上水平内边距（2rem）
  // lg:px-12：桌面端水平内边距（3rem）
  if (props.padding) {
    classes.push('px-6', 'sm:px-8', 'lg:px-12')
  }

  // ====================================================================================
  // 返回类名数组
  // ====================================================================================
  // classes.join(' ')：将数组转换为字符串，用空格分隔
  // 例如：['max-w-7xl', 'mx-auto', 'gap-8', 'px-6', 'sm:px-8', 'lg:px-12']
  //       → 'max-w-7xl mx-auto gap-8 px-6 sm:px-8 lg:px-12'
  return classes
})
</script>
