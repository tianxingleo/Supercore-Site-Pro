<!--
# 新闻卡片骨架屏组件 (News Card Skeleton Component)

## 文件作用
这是一个新闻卡片的骨架屏组件，用于在新闻数据加载时显示占位符。它模拟了新闻卡片的布局结构，包括：
- 封面图片区域（带有闪烁动画）
- 日期标签
- 标签（Tags）
- 标题（多行）
- 摘要（多行）
- "阅读更多"按钮

## 实现手段

### 1. 骨架屏布局结构
使用 Flexbox 布局创建骨架屏卡片：

```vue
<div class="h-full bg-white border border-gray-100 overflow-hidden flex flex-col">
  <!-- 封面图片骨架 -->
  <div class="aspect-video ...">...</div>
  
  <!-- 内容骨架 -->
  <div class="p-6 flex-grow flex flex-col">
    <!-- 标签骨架 -->
    <!-- 标题骨架 -->
    <!-- 摘要骨架 -->
    <!-- 阅读更多骨架 -->
  </div>
</div>
```

**布局特点**：
- `h-full`：高度占满父容器
- `bg-white`：白色背景
- `border border-gray-100`：浅灰色边框
- `overflow-hidden`：隐藏溢出内容
- `flex flex-col`：垂直方向的 Flexbox 布局
- `aspect-video`：16:9 的宽高比（视频比例）

### 2. 闪烁动画效果
使用 CSS 渐变和动画创建闪烁效果：

```css
.shimmer {
  background: linear-gradient(90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.6) 45%,
          rgba(255, 255, 255, 0.9) 50%,
          rgba(255, 255, 255, 0.6) 55%,
          rgba(255, 255, 255, 0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**动画原理**：
1. **渐变背景**：创建从透明到白色再到透明的渐变
   - `0%`：完全透明
   - `45%`：60% 透明度
   - `50%`：90% 透明度（最亮）
   - `55%`：60% 透明度
   - `100%`：完全透明

2. **背景大小**：`200% 100%`（背景宽度是元素的 2 倍）

3. **动画移动**：从 `-200%` 移动到 `200%`
   - 开始时：渐变的透明部分位于元素左侧
   - 结束时：渐变的透明部分位于元素右侧
   - 效果：一个光亮的光带从左到右扫过

**为什么使用闪烁动画？**
- 模拟数据加载的视觉效果
- 提供更好的用户体验
- 减少感知加载时间
- 告知用户内容正在加载

### 3. 占位符元素设计
使用不同的尺寸和颜色模拟实际内容：

```vue
<!-- 标签骨架（小矩形） -->
<div class="h-4 w-12 bg-gray-50 rounded-full ..."></div>

<!-- 标题骨架（中等长条） -->
<div class="h-5 w-full bg-gray-100 ..."></div>

<!-- 摘要骨架（细长条） -->
<div class="h-3 w-full bg-gray-50 ..."></div>
```

**尺寸说明**：
- `h-3`：高度 12px（模拟小文字）
- `h-4`：高度 16px（模拟标签）
- `h-5`：高度 20px（模拟标题）
- `h-6`：高度 24px（模拟按钮）
- `w-12`：宽度 48px（短标签）
- `w-20`：宽度 80px（中等标签）
- `w-24`：宽度 96px（按钮宽度）
- `w-full`：宽度 100%（完整行）
- `w-2/3`：宽度 66.67%（2/3 行）

**颜色说明**：
- `bg-gray-50`：浅灰色（#f9fafb）
- `bg-gray-100`：稍深的灰色（#f3f4f6）
- `bg-white/50`：50% 透明度的白色

**圆角说明**：
- `rounded-full`：完全圆角（用于标签）
- 无圆角：用于标题和摘要（瑞士设计的锐利边缘）

### 4. 相对定位与绝对定位
使用 `relative` 和 `absolute` 定位闪烁动画层：

```vue
<!-- 父元素：相对定位 -->
<div class="h-4 w-12 bg-gray-50 rounded-full relative overflow-hidden">
  <!-- 子元素：绝对定位（覆盖父元素） -->
  <div class="shimmer absolute inset-0"></div>
</div>
```

**为什么这样设计？**
- `relative`：建立定位上下文
- `absolute`：相对于父元素定位
- `inset-0`：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0）
- `overflow-hidden`：确保闪烁效果不溢出父元素

### 5. 循环渲染占位符
使用 `v-for` 渲染多个占位符元素：

```vue
<!-- 标签骨架：2 个 -->
<div v-for="i in 2" :key="i" class="h-4 w-12 bg-gray-50 ..."></div>

<!-- 摘要骨架：3 行 -->
<div v-for="i in 3" :key="i" class="h-3 w-full bg-gray-50 ..."></div>
```

**为什么使用循环？**
- 减少重复代码
- 容易调整数量
- 保持代码简洁

## 核心功能

### 功能 1：封面图片骨架
- 16:9 的宽高比（`aspect-video`）
- 浅灰色背景（`bg-swiss-bg-soft`）
- 闪烁动画效果
- 日期标签占位符（左下角）

### 功能 2：标签骨架
- 2 个标签占位符
- 小矩形，完全圆角
- 闪烁动画效果

### 功能 3：标题骨架
- 2 行标题占位符
- 第 1 行：完整宽度（`w-full`）
- 第 2 行：2/3 宽度（`w-2/3`）
- 模拟标题换行

### 功能 4：摘要骨架
- 3 行摘要占位符
- 每行都是完整宽度（`w-full`）
- 细长条（高度 12px）
- 使用 `flex-grow` 填充剩余空间

### 功能 5：阅读更多骨架
- 1 个按钮占位符
- 宽度 96px（`w-24`）
- 使用 `mt-auto` 推到底部

## 使用场景

### 场景 1：新闻列表加载
```vue
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <!-- 显示 3 个骨架屏卡片 -->
  <NewsSkeleton v-for="i in 3" :key="i" />
</div>
```

**使用时机**：
- 页面初始加载时
- 数据从 API 获取时
- 骨架屏在 `pending` 状态时显示
- 数据加载完成后隐藏，显示实际卡片

### 场景 2：与实际卡片切换
```vue
<div v-if="pending">
  <NewsSkeleton v-for="i in 3" :key="i" />
</div>
<div v-else>
  <NewsCard v-for="item in items" :key="item.id" />
</div>
```

**切换流程**：
1. 页面加载，`pending = true`
2. 显示骨架屏（NewsSkeleton）
3. 数据加载完成，`pending = false`
4. 隐藏骨架屏，显示实际卡片（NewsCard）

## 性能优化

### 优化 1：CSS 动画性能
使用 `transform` 和 `opacity` 而不是改变 `background-position`：

**当前实现**：
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**性能影响**：
- 改变 `background-position` 会触发重绘（repaint）
- 在现代浏览器中性能尚可

**改进建议**：
```css
.shimmer {
  transform: translateX(-200%);
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  100% { transform: translateX(200%); }
}
```

**好处**：
- 使用 `transform` 触发合成（composite）
- 不触发重绘
- 更好的性能（GPU 加速）

### 优化 2：减少 DOM 节点
使用伪元素而不是额外的 `div`：

**当前实现**：
```vue
<div class="h-4 w-12 bg-gray-50 rounded-full relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**改进建议**：
```vue
<div class="h-4 w-12 bg-gray-50 rounded-full skeleton-item"></div>

<style scoped>
.skeleton-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(...);
  animation: shimmer 1.5s infinite linear;
}
</style>
```

**好处**：
- 减少一个 DOM 节点
- 减少内存占用
- 更快的渲染

### 优化 3：使用 CSS 变量
使用 CSS 变量定义动画参数：

```css
<style scoped>
:root {
  --shimmer-duration: 1.5s;
  --shimmer-color: 255, 255, 255;
}

.shimmer {
  background: linear-gradient(90deg,
          rgba(var(--shimmer-color), 0) 0%,
          rgba(var(--shimmer-color), 0.6) 45%,
          rgba(var(--shimmer-color), 0.9) 50%,
          rgba(var(--shimmer-color), 0.6) 55%,
          rgba(var(--shimmer-color), 0) 100%);
  animation: shimmer var(--shimmer-duration) infinite linear;
}
</style>
```

**好处**：
- 易于调整动画参数
- 易于切换颜色主题
- 更好的可维护性

## 可访问性 (Accessibility)

### 可访问性 1：aria-label
骨架屏是视觉占位符，不需要 `aria-label`，但可以添加以帮助屏幕阅读器：

```vue
<div aria-label="正在加载新闻内容..." role="status">
  <NewsSkeleton />
</div>
```

**改进建议**：
- 添加 `role="status"`：表示加载状态
- 添加 `aria-label`：描述正在加载的内容
- 添加 `aria-live="polite"`：在加载完成后通知用户

### 可访问性 2：aria-busy
使用 `aria-busy` 表示内容正在加载：

```vue
<div :aria-busy="pending">
  <NewsSkeleton v-if="pending" />
  <NewsCard v-for="item in items" v-else />
</div>
```

**作用**：
- 告知屏幕阅读器内容正在加载
- 屏幕阅读器会提示用户"正在加载..."

## Tailwind CSS 类名说明

### 布局类
- `h-full`：高度 100%（占满父容器）
- `aspect-video`：16:9 的宽高比（视频比例）
- `flex`：使用 Flexbox 布局
- `flex-col`：垂直方向排列
- `flex-wrap`：允许换行
- `flex-grow`：弹性元素占据所有可用空间

### 间距类
- `gap-2`：元素间距 8px
- `gap-6`：元素间距 24px
- `p-6`：所有方向内边距 24px
- `bottom-4`：底部偏移 16px
- `left-4`：左侧偏移 16px

### 尺寸类
- `h-3`：高度 12px
- `h-4`：高度 16px
- `h-5`：高度 20px
- `h-6`：高度 24px
- `w-12`：宽度 48px
- `w-20`：宽度 80px
- `w-24`：宽度 96px
- `w-full`：宽度 100%
- `w-2/3`：宽度 66.67%（2/3）

### 边框和背景类
- `border`：添加边框
- `border-gray-100`：边框颜色为浅灰色
- `bg-white`：背景颜色为白色
- `bg-gray-50`：背景颜色为浅灰色
- `bg-gray-100`：背景颜色为稍深的灰色
- `bg-swiss-bg-soft`：背景颜色为瑞士软背景颜色
- `bg-white/50`：背景颜色为白色的 50% 不透明度

### 定位类
- `relative`：相对定位（建立定位上下文）
- `absolute`：绝对定位（相对于最近的定位祖先）
- `inset-0`：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0）
- `overflow-hidden`：隐藏溢出内容

### 其他类
- `rounded-full`：完全圆角
- `backdrop-blur-sm`：背景模糊效果（小强度）
- `mt-auto`：上外边距自动（推到底部）
- `mb-4`：下外边距 16px
- `mb-6`：下外边距 24px
- `space-y-2`：垂直方向元素间距 8px

## Vue 3 特性说明

### v-for
用于循环渲染占位符元素：

```vue
<!-- 标签骨架：2 个 -->
<div v-for="i in 2" :key="i" class="h-4 w-12 bg-gray-50 ...">
  <div class="shimmer absolute inset-0"></div>
</div>

<!-- 摘要骨架：3 行 -->
<div v-for="i in 3" :key="i" class="h-3 w-full bg-gray-50 ...">
  <div class="shimmer absolute inset-0"></div>
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
.shimmer {
  /* 只在当前组件中生效 */
}

@keyframes shimmer {
  /* 全局动画，但只在当前组件中使用 */
}
</style>
```

**好处**：
- 避免样式污染全局
- 确保样式只在当前组件中生效
- 提高代码可维护性

## CSS 动画说明

### 渐变背景 (linear-gradient)
```css
background: linear-gradient(90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 45%,
        rgba(255, 255, 255, 0.9) 50%,
        rgba(255, 255, 255, 0.6) 55%,
        rgba(255, 255, 255, 0) 100%);
```

**参数说明**：
- `90deg`：渐变方向（从左到右）
- `rgba(255, 255, 255, 0) 0%`：0% 位置，完全透明
- `rgba(255, 255, 255, 0.9) 50%`：50% 位置，90% 不透明度（最亮）
- `rgba(255, 255, 255, 0) 100%`：100% 位置，完全透明

**为什么使用白色渐变？**
- 在浅灰色背景上创建高光效果
- 模拟光线扫过
- 提供更好的视觉效果

### 背景大小 (background-size)
```css
background-size: 200% 100%;
```

**作用**：
- 背景宽度是元素的 2 倍
- 背景高度与元素相同
- 确保渐变可以完全扫过元素

### 动画定义 (animation)
```css
animation: shimmer 1.5s infinite linear;
```

**参数说明**：
- `shimmer`：动画名称（定义在 `@keyframes` 中）
- `1.5s`：动画持续时间
- `infinite`：无限循环
- `linear`：线性动画（无缓动）

### 关键帧动画 (@keyframes)
```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
```

**作用**：
- 定义动画的关键帧
- `0%`：动画开始时，背景位置在左侧（-200%）
- `100%`：动画结束时，背景位置在右侧（200%）
- 效果：渐变从左到右扫过元素

## 待改进项目

### 改进 1：使用 transform 优化性能
当前问题：使用 `background-position` 触发重绘

建议实现：
```css
@keyframes shimmer {
  0% { transform: translateX(-200%); }
  100% { transform: translateX(200%); }
}
```

好处：
- 使用 `transform` 触发合成
- 不触发重绘
- 更好的性能（GPU 加速）

### 改进 2：使用伪元素减少 DOM 节点
当前问题：每个占位符都有额外的 `div` 元素

建议实现：
```vue
<div class="h-4 w-12 bg-gray-50 rounded-full skeleton-item"></div>

<style scoped>
.skeleton-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(...);
  animation: shimmer 1.5s infinite linear;
}
</style>
```

好处：
- 减少一个 DOM 节点
- 减少内存占用
- 更快的渲染

### 改进 3：使用 CSS 变量
当前问题：动画参数硬编码

建议实现：
```css
<style scoped>
:root {
  --shimmer-duration: 1.5s;
  --shimmer-color: 255, 255, 255;
}

.shimmer {
  background: linear-gradient(90deg,
          rgba(var(--shimmer-color), 0) 0%,
          rgba(var(--shimmer-color), 0.6) 45%,
          rgba(var(--shimmer-color), 0.9) 50%,
          rgba(var(--shimmer-color), 0.6) 55%,
          rgba(var(--shimmer-color), 0) 100%);
  animation: shimmer var(--shimmer-duration) infinite linear;
}
</style>
```

好处：
- 易于调整动画参数
- 易于切换颜色主题
- 更好的可维护性

### 改进 4：添加可访问性属性
当前问题：没有 `aria-label` 或 `aria-busy`

建议实现：
```vue
<div :aria-busy="true" aria-label="正在加载新闻内容..." role="status">
  <NewsSkeleton />
</div>
```

好处：
- 帮助屏幕阅读器理解加载状态
- 提供更好的可访问性

### 改进 5：支持自定义动画速度
当前问题：动画速度固定为 1.5s

建议实现：
```vue
<template>
  <div class="news-skeleton" :style="{ animationDuration }">
    <!-- ... -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  animationDuration?: string
}>()

const animationDuration = computed(() => props.animationDuration || '1.5s')
</script>

<style scoped>
.shimmer {
  animation: shimmer var(--animation-duration) infinite linear;
}
</style>
```

好处：
- 允许父组件自定义动画速度
- 更灵活的 API

## 测试建议

### 测试 1：渲染测试
```typescript
test('should render skeleton correctly', () => {
  const wrapper = mount(NewsSkeleton)
  
  // 检查封面图片骨架
  expect(wrapper.find('.aspect-video').exists()).toBe(true)
  
  // 检查标签骨架（2 个）
  expect(wrapper.findAll('.rounded-full').length).toBe(2)
  
  // 检查标题骨架（2 行）
  expect(wrapper.findAll('.h-5').length).toBe(2)
  
  // 检查摘要骨架（3 行）
  expect(wrapper.findAll('.h-3').length).toBe(3)
})
```

### 测试 2：动画测试
```typescript
test('should have shimmer animation', () => {
  const wrapper = mount(NewsSkeleton)
  
  // 检查闪烁元素是否存在
  const shimmerElements = wrapper.findAll('.shimmer')
  expect(shimmerElements.length).toBeGreaterThan(0)
  
  // 检查动画属性（通过 computed style）
  const shimmerStyle = window.getComputedStyle(shimmerElements[0].element)
  expect(shimmerStyle.animation).toContain('shimmer')
})
```

### 测试 3：可访问性测试
```typescript
test('should have accessibility attributes', () => {
  const wrapper = mount(NewsSkeleton, {
    attrs: {
      'aria-busy': 'true',
      'aria-label': '正在加载新闻内容...',
      role: 'status'
    }
  })
  
  expect(wrapper.attributes('aria-busy')).toBe('true')
  expect(wrapper.attributes('aria-label')).toBe('正在加载新闻内容...')
  expect(wrapper.attributes('role')).toBe('status')
})
```

## 总结

这个新闻卡片骨架屏组件实现了：
- ✅ 完整的卡片布局结构
- ✅ 闪烁动画效果
- ✅ 模拟封面图片、标签、标题、摘要
- ✅ 响应式设计
- ✅ 使用 scoped 避免样式污染
- ✅ 循环渲染减少重复代码

待改进：
- ⏳ 使用 transform 优化性能
- ⏳ 使用伪元素减少 DOM 节点
- ⏳ 使用 CSS 变量提高可维护性
- ⏳ 添加可访问性属性
- ⏳ 支持自定义动画速度

这是一个功能完整、视觉效果好的骨架屏组件，遵循了瑞士设计原则和 Vue 3 最佳实践。
-->
<template>
    <!-- 外层卡片容器 -->
    <!-- h-full：高度 100%（占满父容器） -->
    <!-- bg-white：背景颜色为白色 -->
    <!-- border：添加边框 -->
    <!-- border-gray-100：边框颜色为浅灰色 -->
    <!-- overflow-hidden：隐藏溢出内容 -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- flex-col：垂直方向排列 -->
    <div class="h-full bg-white border border-gray-100 overflow-hidden flex flex-col">
        
        <!-- 封面图片骨架 -->
        <!-- aspect-video：16:9 的宽高比（视频比例） -->
        <!-- bg-swiss-bg-soft：背景颜色为瑞士软背景颜色 -->
        <!-- relative：相对定位（建立定位上下文） -->
        <!-- overflow-hidden：隐藏溢出内容 -->
        <div class="aspect-video bg-swiss-bg-soft relative overflow-hidden">
            
            <!-- 闪烁动画层 -->
            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
            <!-- absolute：绝对定位（相对于父元素） -->
            <!-- inset-0：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0） -->
            <div class="shimmer absolute inset-0"></div>

            <!-- 日期标签骨架 -->
            <!-- absolute：绝对定位（相对于父元素） -->
            <!-- bottom-4：底部偏移 16px -->
            <!-- left-4：左侧偏移 16px -->
            <div class="absolute bottom-4 left-4">
                
                <!-- 日期标签占位符 -->
                <!-- h-6：高度 24px -->
                <!-- w-20：宽度 80px -->
                <!-- bg-white/50：背景颜色为白色的 50% 不透明度 -->
                <!-- backdrop-blur-sm：背景模糊效果（小强度） -->
                <!-- relative：相对定位（建立定位上下文） -->
                <!-- overflow-hidden：隐藏溢出内容 -->
                <div class="h-6 w-20 bg-white/50 backdrop-blur-sm relative overflow-hidden">
                    
                    <!-- 闪烁动画层 -->
                    <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                    <!-- absolute：绝对定位（相对于父元素） -->
                    <!-- inset-0：覆盖整个父元素 -->
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>
        </div>

        <!-- 内容骨架 -->
        <!-- p-6：所有方向内边距 24px -->
        <!-- flex-grow：弹性元素占据所有可用空间 -->
        <!-- flex：使用 Flexbox 布局 -->
        <!-- flex-col：垂直方向排列 -->
        <div class="p-6 flex-grow flex flex-col">
            
            <!-- 标签骨架 -->
            <!-- flex：使用 Flexbox 布局 -->
            <!-- flex-wrap：允许换行 -->
            <!-- gap-2：元素间距 8px -->
            <!-- mb-4：下外边距 16px -->
            <div class="flex flex-wrap gap-2 mb-4">
                
                <!-- 循环渲染 2 个标签占位符 -->
                <!-- v-for="i in 2"：循环 2 次 -->
                <!-- :key="i"：使用索引作为唯一标识 -->
                <!-- h-4：高度 16px -->
                <!-- w-12：宽度 48px -->
                <!-- bg-gray-50：背景颜色为浅灰色 -->
                <!-- rounded-full：完全圆角 -->
                <!-- relative：相对定位（建立定位上下文） -->
                <!-- overflow-hidden：隐藏溢出内容 -->
                <div v-for="i in 2" :key="i"
                    class="h-4 w-12 bg-gray-50 rounded-full relative overflow-hidden">
                    
                    <!-- 闪烁动画层 -->
                    <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                    <!-- absolute：绝对定位（相对于父元素） -->
                    <!-- inset-0：覆盖整个父元素 -->
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- 标题骨架 -->
            <!-- mb-4：下外边距 16px -->
            <!-- space-y-2：垂直方向元素间距 8px -->
            <div class="mb-4 space-y-2">
                
                <!-- 标题第 1 行占位符 -->
                <!-- h-5：高度 20px -->
                <!-- w-full：宽度 100%（完整行） -->
                <!-- bg-gray-100：背景颜色为稍深的灰色 -->
                <!-- relative：相对定位（建立定位上下文） -->
                <!-- overflow-hidden：隐藏溢出内容 -->
                <div class="h-5 w-full bg-gray-100 relative overflow-hidden">
                    
                    <!-- 闪烁动画层 -->
                    <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                    <!-- absolute：绝对定位（相对于父元素） -->
                    <!-- inset-0：覆盖整个父元素 -->
                    <div class="shimmer absolute inset-0"></div>
                </div>
                
                <!-- 标题第 2 行占位符 -->
                <!-- h-5：高度 20px -->
                <!-- w-2/3：宽度 66.67%（2/3 行） -->
                <!-- bg-gray-100：背景颜色为稍深的灰色 -->
                <!-- relative：相对定位（建立定位上下文） -->
                <!-- overflow-hidden：隐藏溢出内容 -->
                <div class="h-5 w-2/3 bg-gray-100 relative overflow-hidden">
                    
                    <!-- 闪烁动画层 -->
                    <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                    <!-- absolute：绝对定位（相对于父元素） -->
                    <!-- inset-0：覆盖整个父元素 -->
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- 摘要骨架 -->
            <!-- mb-6：下外边距 24px -->
            <!-- space-y-2：垂直方向元素间距 8px -->
            <!-- flex-grow：弹性元素占据所有可用空间 -->
            <div class="mb-6 space-y-2 flex-grow">
                
                <!-- 循环渲染 3 行摘要占位符 -->
                <!-- v-for="i in 3"：循环 3 次 -->
                <!-- :key="i"：使用索引作为唯一标识 -->
                <!-- h-3：高度 12px -->
                <!-- w-full：宽度 100%（完整行） -->
                <!-- bg-gray-50：背景颜色为浅灰色 -->
                <!-- relative：相对定位（建立定位上下文） -->
                <!-- overflow-hidden：隐藏溢出内容 -->
                <div v-for="i in 3" :key="i" class="h-3 w-full bg-gray-50 relative overflow-hidden">
                    
                    <!-- 闪烁动画层 -->
                    <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                    <!-- absolute：绝对定位（相对于父元素） -->
                    <!-- inset-0：覆盖整个父元素 -->
                    <div class="shimmer absolute inset-0"></div>
                </div>
            </div>

            <!-- 阅读更多骨架 -->
            <!-- h-4：高度 16px -->
            <!-- w-24：宽度 96px -->
            <!-- bg-gray-100：背景颜色为稍深的灰色 -->
            <!-- relative：相对定位（建立定位上下文） -->
            <!-- overflow-hidden：隐藏溢出内容 -->
            <!-- mt-auto：上外边距自动（推到底部） -->
            <div class="h-4 w-24 bg-gray-100 relative overflow-hidden mt-auto">
                
                <!-- 闪烁动画层 -->
                <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                <!-- absolute：绝对定位（相对于父元素） -->
                <!-- inset-0：覆盖整个父元素 -->
                <div class="shimmer absolute inset-0"></div>
            </div>
        </div>
    </div>
</template>

<!-- scoped：限制样式作用域，只在当前组件中生效 -->
<style scoped>
/* 闪烁动画效果 */
/* shimmer：自定义类名 */
.shimmer {
    /* 线性渐变：从左到右 */
    /* 90deg：渐变方向（从左到右） */
    /* rgba(255, 255, 255, 0) 0%：0% 位置，完全透明 */
    /* rgba(255, 255, 255, 0.6) 45%：45% 位置，60% 不透明度 */
    /* rgba(255, 255, 255, 0.9) 50%：50% 位置，90% 不透明度（最亮） */
    /* rgba(255, 255, 255, 0.6) 55%：55% 位置，60% 不透明度 */
    /* rgba(255, 255, 255, 0) 100%：100% 位置，完全透明 */
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 45%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.6) 55%,
            rgba(255, 255, 255, 0) 100%);
    
    /* 背景大小：宽度是元素的 2 倍，高度与元素相同 */
    background-size: 200% 100%;
    
    /* 动画：shimmer 1.5s 无限循环 线性动画 */
    /* shimmer：动画名称（定义在 @keyframes 中） */
    /* 1.5s：动画持续时间 */
    /* infinite：无限循环 */
    /* linear：线性动画（无缓动） */
    animation: shimmer 1.5s infinite linear;
}

/* 关键帧动画定义 */
@keyframes shimmer {
    /* 动画开始时 */
    /* background-position: -200% 0：背景位置在左侧（-200%） */
    0% {
        background-position: -200% 0;
    }

    /* 动画结束时 */
    /* background-position: 200% 0：背景位置在右侧（200%） */
    /* 效果：渐变从左到右扫过元素 */
    100% {
        background-position: 200% 0;
    }
}
</style>
