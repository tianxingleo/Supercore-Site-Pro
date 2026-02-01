<!--
# 表单骨架屏组件 (Form Skeleton Component)

## 文件作用
这是一个表单的骨架屏组件，用于在表单数据加载时显示占位符。它模拟了表单的布局结构，包括：
- 页面头部（返回按钮 + 标题）
- 主表单卡片（输入字段、文本区域）
- 子表单卡片（大文本区域）
- 固定底部操作栏（取消按钮 + 保存按钮）

## 实现手段

### 1. 骨架屏布局结构
使用垂直方向的间距布局创建骨架屏：

```vue
<div class="space-y-8 animate-pulse">
  <!-- 页面头部 -->
  <!-- 主表单卡片 -->
  <!-- 子表单卡片 -->
  <!-- 固定底部操作栏 -->
</div>
```

**布局特点**：
- `space-y-8`：垂直方向元素间距 32px
- `animate-pulse`：应用脉冲动画（透明度变化）

### 2. 脉冲动画效果
使用 CSS 动画创建透明度变化的脉冲效果：

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;  /* 完全不透明 */
  }
  50% {
    opacity: 0.5;  /* 50% 不透明度 */
  }
}
```

**动画参数**：
- `2s`：动画持续时间（2 秒）
- `cubic-bezier(0.4, 0, 0.6, 1)`：缓动函数（ease-in-out）
- `infinite`：无限循环

**为什么使用脉冲动画而不是闪烁动画？**
- 表单骨架屏通常使用脉冲动画（更柔和）
- 卡片骨架屏通常使用闪烁动画（更明显）
- 脉冲动画对视觉干扰更小
- 提供更好的用户体验

**两种动画对比**：
- **闪烁动画（Shimmer）**：使用渐变和移动，效果明显
- **脉冲动画（Pulse）**：使用透明度变化，效果柔和

### 3. 占位符元素设计
使用不同的尺寸和颜色模拟实际表单元素：

```vue
<!-- 页面头部占位符 -->
<div class="w-8 h-8 bg-gray-200 rounded-none"></div>
<div class="h-8 w-48 bg-gray-200"></div>

<!-- 输入框占位符 -->
<div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>

<!-- 文本区域占位符 -->
<div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
```

**尺寸说明**：
- `h-3`：高度 12px（模拟小标签）
- `h-4`：高度 16px（模拟小标题）
- `h-8`：高度 32px（模拟大标题）
- `h-10`：高度 40px（模拟按钮）
- `h-12`：高度 48px（模拟输入框）
- `h-32`：高度 128px（模拟文本区域）
- `h-48`：高度 192px（模拟大文本区域）
- `w-8`：宽度 32px（返回按钮）
- `w-24`：宽度 96px（小按钮/标题）
- `w-32`：宽度 128px（标签）
- `w-48`：宽度 192px（标题）
- `w-full`：宽度 100%（完整宽度）

**颜色说明**：
- `bg-gray-50`：浅灰色（#f9fafb）
- `bg-gray-100`：稍深的灰色（#f3f4f6）
- `bg-gray-200`：更深的灰色（#e5e7eb）
- `bg-gray-300`：最深的灰色（#d1d5db）
- `bg-swiss-text/5`：瑞士文本颜色的 5% 不透明度（边框）
- `border-swiss-text/5`：瑞士文本颜色的 5% 不透明度（边框）

**边框说明**：
- `border`：添加边框
- `border-swiss-text/5`：边框颜色为瑞士文本颜色的 5% 不透明度（浅灰色）

**圆角说明**：
- `rounded-none`：无圆角（瑞士设计的锐利边缘）

### 4. 网格布局
使用 CSS Grid 布局表单字段：

```vue
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- 单列字段（移动端） -->
  <div v-for="i in 2" :key="'field-'+i">
    <div class="h-3 w-32 bg-gray-100"></div>
    <div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>
  </div>

  <!-- 跨两列字段（桌面端） -->
  <div v-for="i in 2" :key="'area-'+i" class="md:col-span-2">
    <div class="h-3 w-32 bg-gray-100"></div>
    <div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
  </div>
</div>
```

**布局说明**：
- `grid`：使用 CSS Grid 布局
- `grid-cols-1`：移动端单列布局
- `md:grid-cols-2`：桌面端双列布局
- `gap-6`：网格间距 24px
- `md:col-span-2`：桌面端跨越两列

### 5. 循环渲染占位符
使用 `v-for` 渲染多个占位符元素：

```vue
<!-- 单列输入框：2 个 -->
<div v-for="i in 2" :key="'field-'+i" class="space-y-2">
  <div class="h-3 w-32 bg-gray-100"></div>
  <div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>
</div>

<!-- 跨两列文本区域：2 个 -->
<div v-for="i in 2" :key="'area-'+i" class="md:col-span-2 space-y-2">
  <div class="h-3 w-32 bg-gray-100"></div>
  <div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
</div>
```

**为什么使用循环？**
- 减少重复代码
- 容易调整数量
- 保持代码简洁

## 核心功能

### 功能 1：页面头部骨架
- 返回按钮占位符（32x32px，无圆角）
- 标题占位符（192x32px）
- 水平排列（`flex items-center space-x-4`）

### 功能 2：主表单卡片骨架
- 卡片标题占位符（96x16px）
- 单列输入框（2 个）
  - 标签占位符（128x12px）
  - 输入框占位符（48px 高，100% 宽）
- 跨两列文本区域（2 个）
  - 标签占位符（128x12px）
  - 文本区域占位符（128px 高，100% 宽）

### 功能 3：子表单卡片骨架
- 卡片标题占位符（96x16px）
- 大文本区域占位符（192px 高，100% 宽）

### 功能 4：固定底部操作栏骨架
- 取消按钮占位符（96x40px，灰色）
- 保存按钮占位符（128x40px，稍深的灰色）
- 水平排列，右对齐（`flex justify-end space-x-4`）
- 半透明背景（`bg-white/80`）
- 背景模糊效果（`backdrop-blur`）

## 使用场景

### 场景 1：表单加载
```vue
<div v-if="loading">
  <FormSkeleton />
</div>
<div v-else>
  <form>
    <!-- 实际表单内容 -->
  </form>
</div>
```

**使用时机**：
- 页面初始加载时
- 数据从 API 获取时
- 骨架屏在 `loading` 状态时显示
- 数据加载完成后隐藏，显示实际表单

### 场景 2：产品编辑页面
```vue
<div v-if="pending" class="space-y-12">
  <FormSkeleton />
</div>
<form v-else @submit.prevent="saveProduct">
  <!-- 产品表单内容 -->
</form>
```

**切换流程**：
1. 页面加载，`pending = true`
2. 显示骨架屏（FormSkeleton）
3. 数据加载完成，`pending = false`
4. 隐藏骨架屏，显示实际表单

### 场景 3：新闻编辑页面
```vue
<div v-if="loading" class="space-y-12">
  <FormSkeleton />
</div>
<form v-else @submit.prevent="savePost">
  <!-- 新闻表单内容 -->
</form>
```

**切换流程**：
1. 页面加载，`loading = true`
2. 显示骨架屏（FormSkeleton）
3. 数据加载完成，`loading = false`
4. 隐藏骨架屏，显示实际表单

## 性能优化

### 优化 1：使用 CSS 动画代替 JavaScript 动画
使用 `@keyframes` 定义动画，而不是使用 JavaScript 动画：

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**好处**：
- 使用浏览器原生动画引擎
- 更好的性能（GPU 加速）
- 不占用 JavaScript 主线程

### 优化 2：使用 transform 和 opacity
使用 `transform` 和 `opacity` 进行动画：

**当前实现**：
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**好处**：
- 只改变 `opacity`（触发合成）
- 不触发重排（reflow）和重绘（repaint）
- 更好的性能

### 优化 3：减少 DOM 节点
使用单个容器包含所有占位符：

**当前实现**：
```vue
<div class="space-y-8 animate-pulse">
  <!-- 所有占位符都在这里 -->
</div>
```

**好处**：
- 只有一个元素应用动画
- 减少动画更新的开销
- 更好的性能

## 可访问性 (Accessibility)

### 可访问性 1：aria-label
骨架屏是视觉占位符，不需要 `aria-label`，但可以添加以帮助屏幕阅读器：

```vue
<div aria-label="正在加载表单内容..." role="status">
  <FormSkeleton />
</div>
```

**改进建议**：
- 添加 `role="status"`：表示加载状态
- 添加 `aria-label`：描述正在加载的内容
- 添加 `aria-live="polite"`：在加载完成后通知用户

### 可访问性 2：aria-busy
使用 `aria-busy` 表示内容正在加载：

```vue
<div :aria-busy="loading">
  <FormSkeleton v-if="loading" />
  <form v-else>
    <!-- 实际表单内容 -->
  </form>
</div>
```

**作用**：
- 告知屏幕阅读器内容正在加载
- 屏幕阅读器会提示用户"正在加载..."

## Tailwind CSS 类名说明

### 布局类
- `flex`：使用 Flexbox 布局
- `items-center`：垂直居中
- `justify-end`：右对齐
- `space-x-4`：水平方向元素间距 16px
- `space-y-2`：垂直方向元素间距 8px
- `space-y-6`：垂直方向元素间距 24px
- `space-y-8`：垂直方向元素间距 32px
- `grid`：使用 CSS Grid 布局
- `grid-cols-1`：移动端单列布局
- `md:grid-cols-2`：桌面端双列布局
- `gap-6`：网格间距 24px

### 间距类
- `p-4`：所有方向内边距 16px
- `p-6`：所有方向内边距 24px
- `md:p-8`：桌面端所有方向内边距 32px

### 尺寸类
- `h-3`：高度 12px
- `h-4`：高度 16px
- `h-8`：高度 32px
- `h-10`：高度 40px
- `h-12`：高度 48px
- `h-32`：高度 128px
- `h-48`：高度 192px
- `w-8`：宽度 32px
- `w-24`：宽度 96px
- `w-32`：宽度 128px
- `w-48`：宽度 192px
- `w-full`：宽度 100%

### 边框和背景类
- `border`：添加边框
- `border-b`：底部边框
- `border-swiss-text/10`：边框颜色为瑞士文本颜色的 10% 不透明度
- `border-swiss-text/5`：边框颜色为瑞士文本颜色的 5% 不透明度
- `bg-white`：背景颜色为白色
- `bg-gray-50`：背景颜色为浅灰色
- `bg-gray-100`：背景颜色为稍深的灰色
- `bg-gray-200`：背景颜色为更深的灰色
- `bg-gray-300`：背景颜色为最深的灰色
- `bg-white/80`：背景颜色为白色的 80% 不透明度

### 动画类
- `animate-pulse`：应用脉冲动画（透明度变化）

### 其他类
- `rounded-none`：无圆角（瑞士设计的锐利边缘）
- `overflow-hidden`：隐藏溢出内容
- `md:col-span-2`：桌面端跨越两列
- `backdrop-blur`：背景模糊效果

## Vue 3 特性说明

### v-for
用于循环渲染占位符元素：

```vue
<!-- 单列输入框：2 个 -->
<div v-for="i in 2" :key="'field-'+i" class="space-y-2">
  <!-- 标签占位符 -->
  <div class="h-3 w-32 bg-gray-100"></div>
  <!-- 输入框占位符 -->
  <div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>
</div>

<!-- 跨两列文本区域：2 个 -->
<div v-for="i in 2" :key="'area-'+i" class="md:col-span-2 space-y-2">
  <!-- 标签占位符 -->
  <div class="h-3 w-32 bg-gray-100"></div>
  <!-- 文本区域占位符 -->
  <div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
</div>
```

**好处**：
- 减少重复代码
- 容易调整数量
- 保持代码简洁

### scoped style
使用 `scoped` 限制样式作用域：

```vue
<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

**好处**：
- 避免样式污染全局
- 确保样式只在当前组件中生效
- 提高代码可维护性

## CSS 动画说明

### 脉冲动画 (pulse)
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;  /* 完全不透明 */
  }
  50% {
    opacity: 0.5;  /* 50% 不透明度 */
  }
}
```

**动画说明**：
- `0%`：动画开始时，完全不透明（`opacity: 1`）
- `50%`：动画进行一半时，50% 不透明度（`opacity: 0.5`）
- `100%`：动画结束时，完全不透明（`opacity: 1`）

**效果**：
- 透明度从 1 变化到 0.5，再变化回 1
- 产生呼吸灯效果（脉冲）

**为什么使用脉冲动画？**
- 柔和的视觉效果
- 对视觉干扰较小
- 提供更好的用户体验
- 适合表单骨架屏

### 缓动函数 (cubic-bezier)
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

**缓动函数说明**：
- `cubic-bezier(0.4, 0, 0.6, 1)`：三次贝塞尔曲线
  - 第一个点：`(0.4, 0)` - 开始时慢速
  - 第二个点：`(0.6, 1)` - 结束时慢速
- 效果：ease-in-out（开始和结束时慢速，中间快速）

**为什么使用 ease-in-out？**
- 更自然的动画效果
- 避免动画开始和结束时的突然变化
- 提供更好的用户体验

## 待改进项目

### 改进 1：添加可访问性属性
当前问题：没有 `aria-label` 或 `aria-busy`

建议实现：
```vue
<div :aria-busy="true" aria-label="正在加载表单内容..." role="status">
  <FormSkeleton />
</div>
```

好处：
- 帮助屏幕阅读器理解加载状态
- 提供更好的可访问性

### 改进 2：支持自定义动画速度
当前问题：动画速度固定为 2s

建议实现：
```vue
<template>
  <div class="form-skeleton" :style="{ animationDuration }">
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animationDuration?: string
}>()

const animationDuration = computed(() => props.animationDuration || '2s')
</script>

<style scoped>
@keyframes pulse {
  /* ... */
}

.animate-pulse {
  animation: pulse var(--animation-duration) cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
```

好处：
- 允许父组件自定义动画速度
- 更灵活的 API

### 改进 3：支持自定义动画类型
当前问题：动画类型固定为 pulse

建议实现：
```vue
<template>
  <div class="form-skeleton" :class="animationType">
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animationType?: 'pulse' | 'shimmer'
}>()

const animationType = computed(() => props.animationType || 'pulse')
</script>

<style scoped>
@keyframes pulse {
  /* ... */
}

@keyframes shimmer {
  /* ... */
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, ...);
  animation: shimmer 1.5s infinite linear;
}
</style>
```

好处：
- 允许父组件选择动画类型
- 更灵活的 API

## 测试建议

### 测试 1：渲染测试
```typescript
test('should render skeleton correctly', () => {
  const wrapper = mount(FormSkeleton)
  
  // 检查页面头部
  expect(wrapper.findAll('.h-8').length).toBe(2)
  
  // 检查主表单卡片
  expect(wrapper.find('.bg-white.border').exists()).toBe(true)
  
  // 检查输入框占位符（2 个单列 + 2 个跨两列）
  expect(wrapper.findAll('.h-12').length).toBe(2)
  expect(wrapper.findAll('.h-32').length).toBe(3)
  
  // 检查固定底部操作栏
  expect(wrapper.find('.fixed').exists()).toBe(false)  // FormSkeleton 不使用 fixed
})
```

### 测试 2：动画测试
```typescript
test('should have pulse animation', () => {
  const wrapper = mount(FormSkeleton)
  
  // 检查是否有 animate-pulse 类
  expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  
  // 检查动画属性（通过 computed style）
  const skeleton = wrapper.find('.animate-pulse')
  const style = window.getComputedStyle(skeleton.element)
  expect(style.animation).toContain('pulse')
})
```

### 测试 3：可访问性测试
```typescript
test('should have accessibility attributes', () => {
  const wrapper = mount(FormSkeleton, {
    attrs: {
      'aria-busy': 'true',
      'aria-label': '正在加载表单内容...',
      role: 'status'
    }
  })
  
  expect(wrapper.attributes('aria-busy')).toBe('true')
  expect(wrapper.attributes('aria-label')).toBe('正在加载表单内容...')
  expect(wrapper.attributes('role')).toBe('status')
})
```

## 总结

这个表单骨架屏组件实现了：
- ✅ 完整的表单布局结构
- ✅ 脉冲动画效果
- ✅ 模拟页面头部、主表单卡片、子表单卡片、固定底部操作栏
- ✅ 响应式设计（单列/双列布局）
- ✅ 使用 scoped 避免样式污染
- ✅ 循环渲染减少重复代码

待改进：
- ⏳ 添加可访问性属性
- ⏳ 支持自定义动画速度
- ⏳ 支持自定义动画类型

这是一个功能完整、视觉效果好的骨架屏组件，遵循了瑞士设计原则和 Vue 3 最佳实践。
-->
<template>
  <!-- 外层容器 -->
  <!-- space-y-8：垂直方向元素间距 32px -->
  <!-- animate-pulse：应用脉冲动画（透明度变化） -->
  <div class="space-y-8 animate-pulse">
    
    <!-- 页面头部 -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- items-center：垂直居中 -->
    <!-- space-x-4：水平方向元素间距 16px -->
    <div class="flex items-center space-x-4">
      
      <!-- 返回按钮占位符 -->
      <!-- w-8：宽度 32px -->
      <!-- h-8：高度 32px -->
      <!-- bg-gray-200：背景颜色为更深的灰色 -->
      <!-- rounded-none：无圆角（瑞士设计的锐利边缘） -->
      <div class="w-8 h-8 bg-gray-200 rounded-none"></div>
      
      <!-- 标题占位符 -->
      <!-- h-8：高度 32px -->
      <!-- w-48：宽度 192px -->
      <!-- bg-gray-200：背景颜色为更深的灰色 -->
      <div class="h-8 w-48 bg-gray-200"></div>
    </div>

    <!-- 主表单卡片 -->
    <!-- bg-white：背景颜色为白色 -->
    <!-- border：添加边框 -->
    <!-- border-swiss-text/10：边框颜色为瑞士文本颜色的 10% 不透明度 -->
    <!-- overflow-hidden：隐藏溢出内容 -->
    <div class="bg-white border border-swiss-text/10 overflow-hidden">
      
      <!-- 卡片标题 -->
      <!-- p-6：所有方向内边距 24px -->
      <!-- md:p-8：桌面端所有方向内边距 32px（响应式设计） -->
      <!-- border-b：底部边框 -->
      <!-- border-swiss-text/10：底部边框颜色为瑞士文本颜色的 10% 不透明度 -->
      <div class="p-6 md:p-8 border-b border-swiss-text/10">
        <!-- 卡片标题占位符 -->
        <!-- h-4：高度 16px -->
        <!-- w-24：宽度 96px -->
        <!-- bg-gray-200：背景颜色为更深的灰色 -->
        <div class="h-4 w-24 bg-gray-200"></div>
      </div>

      <!-- 卡片内容 -->
      <!-- p-6：所有方向内边距 24px -->
      <!-- md:p-8：桌面端所有方向内边距 32px（响应式设计） -->
      <!-- space-y-8：垂直方向元素间距 32px -->
      <div class="p-6 md:p-8 space-y-8">
        <!-- 网格布局 -->
        <!-- grid：使用 CSS Grid 布局 -->
        <!-- grid-cols-1：移动端单列布局 -->
        <!-- md:grid-cols-2：桌面端双列布局 -->
        <!-- gap-6：网格间距 24px -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- 单列输入框（2 个） -->
          <!-- v-for="i in 2"：循环 2 次 -->
          <!-- :key="'field-'+i"：使用索引作为唯一标识（field-1, field-2） -->
          <!-- space-y-2：垂直方向元素间距 8px -->
          <div v-for="i in 2" :key="'field-'+i" class="space-y-2">
            <!-- 标签占位符 -->
            <!-- h-3：高度 12px -->
            <!-- w-32：宽度 128px -->
            <!-- bg-gray-100：背景颜色为稍深的灰色 -->
            <div class="h-3 w-32 bg-gray-100"></div>
            
            <!-- 输入框占位符 -->
            <!-- h-12：高度 48px -->
            <!-- w-full：宽度 100%（完整行） -->
            <!-- bg-gray-50：背景颜色为浅灰色 -->
            <!-- border：添加边框 -->
            <!-- border-swiss-text/5：边框颜色为瑞士文本颜色的 5% 不透明度 -->
            <div class="h-12 w-full bg-gray-50 border border-swiss-text/5"></div>
          </div>

          <!-- 跨两列文本区域（2 个） -->
          <!-- v-for="i in 2"：循环 2 次 -->
          <!-- :key="'area-'+i"：使用索引作为唯一标识（area-1, area-2） -->
          <!-- md:col-span-2：桌面端跨越两列 -->
          <!-- space-y-2：垂直方向元素间距 8px -->
          <div v-for="i in 2" :key="'area-'+i" class="md:col-span-2 space-y-2">
            <!-- 标签占位符 -->
            <!-- h-3：高度 12px -->
            <!-- w-32：宽度 128px -->
            <!-- bg-gray-100：背景颜色为稍深的灰色 -->
            <div class="h-3 w-32 bg-gray-100"></div>
            
            <!-- 文本区域占位符 -->
            <!-- h-32：高度 128px -->
            <!-- w-full：宽度 100%（完整行） -->
            <!-- bg-gray-50：背景颜色为浅灰色 -->
            <!-- border：添加边框 -->
            <!-- border-swiss-text/5：边框颜色为瑞士文本颜色的 5% 不透明度 -->
            <div class="h-32 w-full bg-gray-50 border border-swiss-text/5"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 子表单卡片 -->
    <!-- bg-white：背景颜色为白色 -->
    <!-- border：添加边框 -->
    <!-- border-swiss-text/10：边框颜色为瑞士文本颜色的 10% 不透明度 -->
    <!-- overflow-hidden：隐藏溢出内容 -->
    <div class="bg-white border border-swiss-text/10 overflow-hidden">
      
      <!-- 卡片标题 -->
      <!-- p-6：所有方向内边距 24px -->
      <!-- md:p-8：桌面端所有方向内边距 32px（响应式设计） -->
      <!-- border-b：底部边框 -->
      <!-- border-swiss-text/10：底部边框颜色为瑞士文本颜色的 10% 不透明度 -->
      <div class="p-6 md:p-8 border-b border-swiss-text/10">
        <!-- 卡片标题占位符 -->
        <!-- h-4：高度 16px -->
        <!-- w-24：宽度 96px -->
        <!-- bg-gray-200：背景颜色为更深的灰色 -->
        <div class="h-4 w-24 bg-gray-200"></div>
      </div>
      
      <!-- 卡片内容 -->
      <!-- p-6：所有方向内边距 24px -->
      <!-- md:p-8：桌面端所有方向内边距 32px（响应式设计） -->
      <!-- space-y-6：垂直方向元素间距 24px -->
      <div class="p-6 md:p-8 space-y-6">
        <!-- 大文本区域占位符 -->
        <!-- h-48：高度 192px -->
        <!-- w-full：宽度 100%（完整行） -->
        <!-- bg-gray-50：背景颜色为浅灰色 -->
        <!-- border：添加边框 -->
        <!-- border-swiss-text/5：边框颜色为瑞士文本颜色的 5% 不透明度 -->
        <div class="h-48 w-full bg-gray-50 border border-swiss-text/5"></div>
      </div>
    </div>

    <!-- 固定底部操作栏 -->
    <!-- bg-white/80：背景颜色为白色的 80% 不透明度（半透明白色） -->
    <!-- backdrop-blur：背景毛玻璃效果 -->
    <!-- border-t：顶部边框 -->
    <!-- border-swiss-text/10：顶部边框颜色为瑞士文本颜色的 10% 不透明度 -->
    <!-- p-4：所有方向内边距 16px -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- justify-end：右对齐 -->
    <!-- space-x-4：水平方向元素间距 16px -->
    <div class="bg-white/80 backdrop-blur border-t border-swiss-text/10 p-4 flex justify-end space-x-4">
      
      <!-- 取消按钮占位符 -->
      <!-- h-10：高度 40px -->
      <!-- w-24：宽度 96px -->
      <!-- bg-gray-200：背景颜色为更深的灰色 -->
      <div class="h-10 w-24 bg-gray-200"></div>
      
      <!-- 保存按钮占位符 -->
      <!-- h-10：高度 40px -->
      <!-- w-32：宽度 128px -->
      <!-- bg-gray-300：背景颜色为最深的灰色 -->
      <div class="h-10 w-32 bg-gray-300"></div>
    </div>
  </div>
</template>

<!-- scoped：限制样式作用域，只在当前组件中生效 -->
<style scoped>
/* 脉冲动画 */
/* animate-pulse：自定义类名（与 Tailwind 的 animate-pulse 不同） */
.animate-pulse {
  /* animation：pulse 2s 缓动函数 无限循环 */
  /* pulse：动画名称（定义在 @keyframes 中） */
  /* 2s：动画持续时间 */
  /* cubic-bezier(0.4, 0, 0.6, 1)：缓动函数（ease-in-out） */
  /* infinite：无限循环 */
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 关键帧动画定义 */
@keyframes pulse {
  /* 动画开始和结束时 */
  /* opacity: 1：完全不透明 */
  0%, 100% {
    opacity: 1;
  }
  
  /* 动画进行一半时 */
  /* opacity: 0.5：50% 不透明度 */
  50% {
    opacity: 0.5;
  }
}
</style>
