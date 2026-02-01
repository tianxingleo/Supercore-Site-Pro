<!--
================================================================================
瑞士设计按钮组件（Swiss Button Component）
================================================================================

文件作用：
此文件是瑞士国际主义风格的按钮组件，提供多种样式和尺寸选项。
它是整个网站的主要交互元素，用于导航、表单提交、操作按钮等。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 瑞士国际主义设计风格：简洁、网格系统、无装饰
3. 响应式设计：3 种尺寸（small、medium、large）
4. 多种样式：primary（主要）、secondary（次要）、ghost（幽灵）
5. 支持两种标签：button 和 a（NuxtLink）
6. 支持禁用状态和全宽模式

核心功能：
1. 3 种样式：
   - primary：黑色背景，白色文字（主要操作）
   - secondary：浅色背景，深色文字（次要操作）
   - ghost：透明背景，深色文字，hover 时填充
2. 3 种尺寸：
   - sm：小尺寸（px-4 py-2，text-sm）
   - md：中等尺寸（px-6 py-3，text-base）
   - lg：大尺寸（px-8 py-4，text-lg）
3. 2 种标签：
   - button：普通按钮（用于表单提交）
   - a：链接按钮（用于导航）
4. 状态支持：
   - disabled：禁用状态（降低透明度，禁用点击）
   - fullWidth：全宽模式（占满父容器）
5. 交互效果：
   - hover：轻微上移（translate-y-0.5）
   - hover：阴影效果（shadow-lg 或 shadow-md）
   - active：缩小效果（scale-[0.98]）
   - focus：焦点轮廓（outline-2）

样式特点：
- 瑞士国际主义：简洁、无装饰、强调内容
- 网格系统：tracking-widest（超宽字间距）
- 大字体：10px 小字体，但全大写
- 圆角：rounded-none（直角）
- 内边距：根据尺寸变化
- 过渡动画：duration-300，ease-out

使用示例：
```vue
<!-- 主要按钮：提交表单 -->
<SwissButton variant="primary" size="lg" @click="submit">
  {{ $t('common.submit') }}
</SwissButton>

<!-- 次要按钮：取消 -->
<SwissButton variant="secondary" size="lg" @click="cancel">
  {{ $t('common.cancel') }}
</SwissButton>

<!-- 链接按钮：导航 -->
<SwissButton variant="ghost" size="lg" tag="a" :to="'/products'">
  {{ $t('nav.products') }}
</SwissButton>

<!-- 禁用按钮 -->
<SwissButton variant="primary" size="lg" :disabled="true">
  {{ $t('common.submit') }}
</SwissButton>

<!-- 全宽按钮 -->
<SwissButton variant="primary" size="lg" :fullWidth="true">
  {{ $t('common.submit') }}
</SwissButton>
``` Props 属性： 1. variant：按钮样式（可选） - primary：主要样式（黑色背景，白色文字） -
secondary：次要样式（浅色背景，深色文字） - ghost：幽灵样式（透明背景，hover 填充） 2.
size：按钮尺寸（可选，默认 md） - sm：小尺寸 - md：中等尺寸（默认） - lg：大尺寸 3.
tag：标签类型（可选，默认 button） - button：button 标签（用于表单提交） - a：a 标签（用于导航） 4.
type：button 类型（可选，默认 button） - button：普通按钮（不指定类型） - submit：提交按钮 -
reset：重置按钮 5. to：链接地址（可选） - 如果 tag="a"，则 to 会被传递给 NuxtLink - 如果
tag="button"，则 to 会被传递给 a 标签的 href 6. disabled：是否禁用（可选，默认 false） - 如果为
true，按钮会降低透明度并禁用点击 7. fullWidth：是否全宽（可选，默认 false） - 如果为
true，按钮宽度为 100% 样式详解： 1. 基础样式（所有按钮通用）： - inline-flex：内联弹性布局 -
items-center：垂直居中 - justify-center：水平居中 - font-semibold：中等字重（600） -
transition-all：所有属性都有过渡动画 - duration-300：过渡动画持续 300ms -
ease-out：缓动函数（快速开始，慢速结束） - rounded-none：无圆角（直角设计） -
tracking-widest：超宽字间距（瑞士设计特征） - uppercase：全大写（瑞士设计特征） - text-[10px]：10px
字体（瑞士设计小字体） - font-bold：粗体 - focus-visible:outline-2：焦点轮廓 2px -
focus-visible:outline-offset-2：焦点轮廓偏移 2px -
focus-visible:outline-swiss-text：焦点轮廓颜色（瑞士设计文本色） 2. 尺寸样式（sizes 对象）： - sm：
- px-4：水平内边距 1rem - py-2：垂直内边距 0.5rem - text-sm：小字体（14px） - md： -
px-6：水平内边距 1.5rem - py-3：垂直内边距 0.75rem - text-base：基础字体（16px） - lg： -
px-8：水平内边距 2rem - py-4：垂直内边距 1rem - text-lg：大字体（18px） 3. 样式样式（variants
对象）： - primary： - bg-swiss-text：瑞士设计文本色背景（黑色） - text-white：白色文字 -
hover:bg-swiss-text/90：hover 时 90% 透明度 - hover:-translate-y-0.5：hover 时向上移动 0.5rem -
hover:shadow-lg：hover 时大阴影 - active:scale-[0.98]：激活时缩小到 98% -
disabled:opacity-50：禁用时 50% 透明度 - disabled:cursor-not-allowed：禁用时禁用手型光标 -
secondary： - bg-swiss-bg-soft：浅灰色背景 - text-swiss-text：瑞士设计文本色文字 -
hover:bg-gray-200：hover 时更深的灰色 - hover:-translate-y-0.5：hover 时向上移动 0.5rem -
hover:shadow-md：hover 时中阴影 - active:scale-[0.98]：激活时缩小到 98% -
disabled:opacity-50：禁用时 50% 透明度 - disabled:cursor-not-allowed：禁用时禁用手型光标 - ghost： -
bg-transparent：透明背景 - text-swiss-text：瑞士设计文本色文字 - border：边框 -
border-swiss-text/20：20% 透明度的瑞士设计文本色边框 - hover:border-swiss-text：hover 时边框变为
100% 瑞士设计文本色 - hover:bg-swiss-text：hover 时背景填充瑞士设计文本色 - hover:text-white：hover
时文字变为白色 - hover:-translate-y-0.5：hover 时向上移动 0.5rem - active:scale-[0.98]：激活时缩小到
98% - disabled:opacity-50：禁用时 50% 透明度 - disabled:cursor-not-allowed：禁用时禁用手型光标 4.
宽度样式（width）： - fullWidth：w-full（100% 宽度） - 默认：w-auto（自动宽度） 无障碍支持： -
aria-label：由父组件或用户提供 - disabled 属性：禁用状态（传递给 button 标签） - keyboard 交互： -
Enter 键：点击按钮（@keydown.enter.prevent） - Space 键：点击按钮（@keydown.space.prevent）
设计原则： 1. 简洁：无装饰，强调内容 2. 一致：所有按钮都有相同的交互反馈 3.
可访问：支持键盘和屏幕阅读器 4. 响应式：3 种尺寸适应不同设备 5. 状态反馈：disabled、hover、active
状态清晰 技术栈： - 框架：Nuxt 3（Vue 3） - 样式：Tailwind CSS - 路由：NuxtLink（用于链接按钮）
注意： - tag="a" 时，to 会被传递给 NuxtLink（支持路由） - tag="button" 时，to 会被传递给 a 标签的
href（外部链接） - disabled 状态下，点击事件不会触发 - 使用 defineOptions({ inheritAttrs: false })
禁止属性继承 ================================================================================ -->

<template>
  <!-- ====================================================================================
       链接按钮（tag = 'a'）- 使用 NuxtLink
       ====================================================================================
       - v-if="tag === 'a'"：如果 tag 为 'a'，则使用 NuxtLink
       - :to="to"：传递 to 属性给 NuxtLink
       - custom：自定义插槽模式
       - v-slot="{ navigate }"：NuxtLink 提供的导航函数
  -->
  <NuxtLink v-if="tag === 'a' && to" :to="to" custom v-slot="{ navigate }">
    <!-- a 标签：NuxtLink 渲染的目标元素 -->
    <!-- v-bind="$attrs"：绑定所有未定义的属性 -->
    <!-- :class="buttonClasses"：动态类名绑定 -->
    <!-- :href="to"：设置 href 属性 -->
    <!-- @click="handleClick($event, navigate)"：点击时调用 handleClick -->
    <!-- @keydown.enter.prevent="handleClick($event, navigate)"：Enter 键时调用 handleClick -->
    <!-- @keydown.space.prevent="handleClick($event, navigate)"：Space 键时调用 handleClick -->
    <a
      v-bind="$attrs"
      :class="buttonClasses"
      :href="to"
      @click="handleClick($event, navigate)"
      @keydown.enter.prevent="handleClick($event, navigate)"
      @keydown.space.prevent="handleClick($event, navigate)"
    >
      <!-- 插槽：按钮内容（文本、图标等） -->
      <slot />
    </a>
  </NuxtLink>

  <!-- ====================================================================================
       普通链接（tag = 'a'）- 使用普通 a 标签
       ====================================================================================
  <a v-else-if="tag === 'a'" v-bind="$attrs" :href="to" :class="buttonClasses" @click="handleClick"
     @keydown.enter.prevent="handleClick" @keydown.space.prevent="handleClick">
    <slot />
  </a>

  <!-- ====================================================================================
       按钮（默认）- 使用 button 标签
       ====================================================================================
  <!-- v-else：默认情况，使用 button 标签 -->
  <!-- v-bind="$attrs"：绑定所有未定义的属性 -->
  <!-- :type="type"：设置 button 类型（button、submit、reset） -->
  <!-- :class="buttonClasses"：动态类名绑定 -->
  <!-- :disabled="disabled"：设置禁用状态 -->
  <!-- @click="handleClick"：点击时调用 handleClick -->
  <button
    v-else
    v-bind="$attrs"
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
// ====================================================================================
// 组件配置
// ====================================================================================
// defineOptions：定义组件选项
// inheritAttrs: false：禁用属性继承
// 为什么要禁用？
// - 我们需要手动控制哪些属性被绑定到根元素
// - 例如：to 属性会传递给 NuxtLink 或 a 标签，但不会传递给 button 标签
defineOptions({
  inheritAttrs: false
})

// ====================================================================================
// Props 属性定义
// ====================================================================================
/**
 * Props 接口：SwissButton 组件的属性定义
 *
 * 属性说明：
 * - variant：按钮样式（主要、次要、幽灵）
 * - size：按钮尺寸（小、中、大）
 * - tag：标签类型（button、a）
 * - type：button 类型（普通、提交、重置）
 * - to：链接地址（用于 a 标签）
 * - disabled：是否禁用
 * - fullWidth：是否全宽
 */
interface Props {
  // variant：按钮样式（可选）
  // 'primary'：主要按钮（黑色背景，白色文字）
  // 'secondary'：次要按钮（浅色背景，深色文字）
  // 'ghost'：幽灵按钮（透明背景，hover 时填充）
  variant?: 'primary' | 'secondary' | 'ghost'

  // size：按钮尺寸（可选，默认 'md'）
  // 'sm'：小尺寸
  // 'md'：中等尺寸（默认）
  // 'lg'：大尺寸
  size?: 'sm' | 'md' | 'lg'

  // tag：标签类型（可选，默认 'button'）
  // 'button'：普通按钮（用于表单提交）
  // 'a'：链接按钮（用于导航）
  tag?: 'button' | 'a'

  // type：button 类型（可选，默认 'button'）
  // 'button'：普通按钮（不指定类型）
  // 'submit'：提交按钮（提交表单）
  // 'reset'：重置按钮（重置表单）
  type?: 'button' | 'submit' | 'reset'

  // to：链接地址（可选）
  // 如果 tag="a"，则 to 会被传递给 NuxtLink（路由导航）
  // 如果 tag="button"，则 to 会被传递给 a 标签的 href（外部链接）
  to?: string

  // disabled：是否禁用（可选，默认 false）
  // 如果为 true，按钮会降低透明度并禁用点击
  disabled?: boolean

  // fullWidth：是否全宽（可选，默认 false）
  // 如果为 true，按钮宽度为 100%
  fullWidth?: boolean
}

// ====================================================================================
// Props 默认值
// ====================================================================================
// withDefaults()：设置组件属性的默认值
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',    // 默认：主要按钮
  size: 'md',         // 默认：中等尺寸
  tag: 'button',        // 默认：button 标签
  type: 'button',        // 默认：普通按钮
  disabled: false,      // 默认：不禁用
  fullWidth: false,     // 默认：非全宽
})

// ====================================================================================
// 事件定义
// ====================================================================================
// defineEmits()：定义组件可以触发的事件
const emit = defineEmits<{
  // click：点击事件
  // - [event: Event]：事件对象
  click: [event: Event]
}>())

// ====================================================================================
// 动态计算按钮类名
// ====================================================================================
/**
 * buttonClasses - 计算按钮的所有 CSS 类名
 *
 * 功能：
 * 根据组件属性动态计算所有需要的 Tailwind CSS 类名。
 * 包括基础样式、尺寸样式、样式样式和宽度样式。
 *
 * 计算逻辑：
 * 1. 添加基础样式（内边距、字体、对齐等）
 * 2. 根据尺寸添加尺寸样式
 * 3. 根据样式变体添加样式样式
 * 4. 如果全宽，添加宽度样式
 * 5. 使用展开运算符合并所有类名
 *
 * 使用示例：
 * <button class="inline-flex items-center justify-center ...">
 *   按钮内容
 * </button>
 */
const buttonClasses = computed(() => {
  // base：基础样式数组
  // 包含所有按钮的通用样式
  const base = [
    'inline-flex',        // 内联弹性布局
    'items-center',     // 垂直居中
    'justify-center',   // �平居中
    'font-semibold',    // 中等字重（600）
    'transition-all',      // 所有属性的过渡动画
    'duration-300',      // 过渡动画持续 300ms
    'ease-out',         // 缓动函数：快速开始，慢速结束
    'rounded-none',      // 无圆角（直角设计）
    'tracking-widest',   // 超宽字间距（瑞士设计特征）
    'uppercase',        // 全大写（瑞士设计特征）
    'text-[10px]',      // 10px 字体（瑞士设计小字体）
    'font-bold',        // 粗体
    'focus-visible:outline-2',        // 焦点轮廓 2px
    'focus-visible:outline-offset-2',    // 焦点轮廓偏移 2px
    'focus-visible:outline-swiss-text', // 焦点轮廓颜色（瑞士设计文本色）
  ]

  // ====================================================================================
  // 尺寸样式
  // ====================================================================================
  // sizes 对象：定义不同尺寸对应的类名
  // - sm：小尺寸（移动端）
  // - md：中等尺寸（平板、桌面默认）
  // - lg：大尺寸（桌面）
  const sizes = {
    sm: ['px-4', 'py-2', 'text-sm'],     // px-4: 水平内边距 1rem, py-2: 垂直内边距 0.5rem, text-sm: 小字体 14px
    md: ['px-6', 'py-3', 'text-base'],   // px-6: 水平内边距 1.5rem, py-3: 垂直内边距 0.75rem, text-base: 基础字体 16px
    lg: ['px-8', 'py-4', 'text-lg'],     // px-8: 水平内边距 2rem, py-4: 垂直内边距 1rem, text-lg: 大字体 18px
  }

  // ====================================================================================
  // 样式变体
  // ====================================================================================
  // variants 对象：定义不同样式对应的类名
  // - primary：主要按钮（黑色背景，白色文字）
  // - secondary：次要按钮（浅色背景，深色文字）
  // - ghost：幽灵按钮（透明背景，hover 时填充）
  const variants = {

    // primary：主要按钮
    // 黑色背景，白色文字，hover 时稍微变暗
    primary: [
      'bg-swiss-text',              // 瑞士设计文本色背景（黑色）
      'text-white',                 // 白色文字
      'hover:bg-swiss-text/90',     // hover 时 90% 透明度
      'hover:-translate-y-0.5',      // hover 时向上移动 0.5rem
      'hover:shadow-lg',             // hover 时大阴影
      'active:scale-[0.98]',         // 激活时缩小到 98%
      'disabled:opacity-50',           // 禁用时 50% 透明度
      'disabled:cursor-not-allowed',  // 禁用时禁用手型光标
    ],

    // secondary：次要按钮
    // 浅灰色背景，深色文字，hover 时稍微变深
    secondary: [
      'bg-swiss-bg-soft',           // 浅灰色背景
      'text-swiss-text',              // 瑞士设计文本色文字
      'hover:bg-gray-200',           // hover 时更深的灰色
      'hover:-translate-y-0.5',      // hover 时向上移动 0.5rem
      'hover:shadow-md',             // hover 时中阴影
      'active:scale-[0.98]',         // 激活时缩小到 98%
      'disabled:opacity-50',           // 禁用时 50% 透明度
      'disabled:cursor-not-allowed',  // 禁用时禁用手型光标
    ],

    // ghost：幽灵按钮
    // 透明背景，hover 时填充瑞士设计文本色
    ghost: [
      'bg-transparent',             // 透明背景
      'text-swiss-text',              // 瑞士设计文本色文字
      'border',                       // 边框
      'border-swiss-text/20',          // 20% 透明度的瑞士设计文本色边框
      'hover:border-swiss-text',      // hover 时边框变为 100% 瑞士设计文本色
      'hover:bg-swiss-text',          // hover 时背景填充瑞士设计文本色
      'hover:text-white',            // hover 时文字变为白色
      'hover:-translate-y-0.5',      // hover 时向上移动 0.5rem
      'active:scale-[0.98]',         // 激活时缩小到 98%
      'disabled:opacity-50',           // 禁用时 50% 透明度
      'disabled:cursor-not-allowed',  // 禁用时禁用手型光标
    ],
  }

  // ====================================================================================
  // 宽度样式
  // ====================================================================================
  // width：宽度数组
  // - fullWidth：w-full（100% 宽度）
  // 默认：空数组（w-auto，自动宽度）
  const width = props.fullWidth ? ['w-full'] : []

  // ====================================================================================
  // 返回所有类名的数组
  // ====================================================================================
  // ...base：基础样式
  // ...sizes[props.size]：尺寸样式
  // ...variants[props.variant]：样式样式
  // ...width：宽度样式
  // 展开运算符合并所有数组
  return [...base, ...sizes[props.size], ...variants[props.variant], ...width]
})

// ====================================================================================
// 处理点击事件
// ====================================================================================
/**
 * handleClick - 处理按钮点击事件
 *
 * 功能：
 * 处理按钮的点击事件，根据标签类型和状态执行相应操作。
 *
 * 参数：
 * @param event - Event：事件对象
 * @param navigate - 导航函数（可选）
 *
 * 逻辑：
 * 1. 如果禁用，则不执行任何操作
 * 2. 如果标签为 'a' 且存在导航函数：
 *    - 阻止默认行为（event.preventDefault()）
 *    - 调用导航函数
 * 3. 触发 click 事件（通知父组件）
 *
 * 使用场景：
 * - tag="button"：表单提交按钮
 * - tag="a"：导航按钮（使用 NuxtLink）
 *
 * 为什么需要阻止默认行为？
 * - tag="a" 时，如果使用 to 属性，NuxtLink 会处理导航
 * - 但如果需要额外的逻辑（例如：表单验证），可以在这里拦截
 *
 * 注意事项：
 * - disabled 状态下，不会触发任何事件
 * - 事件冒泡：可以在这里调用 event.stopPropagation() 阻止冒泡
 * - 键盘事件：Enter 和 Space 键也会触发此函数
 */
const handleClick = (event: Event, navigate?: () => void) => {

  // 如果禁用，则不执行任何操作
  // !props.disabled：不禁用
  if (!props.disabled) {

    // 如果存在导航函数，则阻止默认行为并调用导航
    if (navigate) {
      // preventDefault()：阻止链接的默认导航行为
      event.preventDefault()

      // navigate()：调用导航函数（NuxtLink 提供的导航函数）
      navigate()
    }

    // 触发 click 事件，通知父组件
    // emit('click', event)：将事件对象传递给父组件
    emit('click', event)
  }
}
</script>
