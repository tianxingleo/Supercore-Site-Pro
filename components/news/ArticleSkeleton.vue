<!--
# 文章骨架屏组件 (Article Skeleton Component)

## 文件作用
这是一个文章详情页的骨架屏组件，用于在文章内容加载时显示占位符。它模拟了文章详情页的布局结构，包括：
- 页面头部（大标题、日期标签、摘要）
- 文章内容（封面图片、多行正文）

## 实现手段

### 1. 骨架屏布局结构
使用 CSS Grid 12 列布局创建骨架屏：

```vue
<div class="bg-white">
  <!-- 页面头部 -->
  <section class="pt-48 pb-24 ...">
    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 lg:col-span-10 lg:offset-1">
        <!-- 标题、日期、摘要 -->
      </div>
    </div>
  </section>

  <!-- 文章内容 -->
  <section class="mt-20 ...">
    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 lg:col-span-8 lg:offset-2">
        <!-- 封面图片、正文 -->
      </div>
    </div>
  </section>
</div>
```

**布局特点**：
- `grid-cols-12`：12 列网格布局
- `col-span-12`：占满 12 列（移动端）
- `lg:col-span-10`：占 10 列（大屏幕）
- `lg:offset-1`：偏移 1 列（大屏幕）
- `lg:col-span-8`：占 8 列（大屏幕）
- `lg:offset-2`：偏移 2 列（大屏幕）

### 2. 闪烁动画效果
使用 CSS 渐变和动画创建闪烁效果：

```css
.shimmer {
  background: linear-gradient(90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 45%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0.4) 55%,
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
   - `45%`：40% 不透明度
   - `50%`：50% 不透明度（最亮）
   - `55%`：40% 不透明度
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

### 3. 随机宽度占位符
使用 `Math.random()` 为正文占位符生成随机宽度：

```vue
<div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }"
  class="h-4 bg-gray-50 ...">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**随机宽度计算**：
- `Math.random()`：生成 0 到 1 之间的随机数
- `Math.random() * 20`：生成 0 到 20 之间的随机数
- `Math.random() * 20 + 80`：生成 80 到 100 之间的随机数
- `+ '%'`：添加百分号
- 结果：`'80%'` 到 `'100%'` 之间的随机宽度

**为什么使用随机宽度？**
- 模拟真实文章的行长变化
- 避免重复的视觉效果
- 提供更自然的骨架屏

### 4. 占位符元素设计
使用不同的尺寸和颜色模拟实际内容：

```vue
<!-- 标题占位符（中等长条） -->
<div class="h-4 w-32 bg-gray-50 ..."></div>

<!-- 日期标签占位符（小矩形） -->
<div class="h-6 w-20 bg-gray-50 rounded-full ..."></div>

<!-- 摘要占位符（粗长条） -->
<div class="h-12 w-full bg-gray-100 ..."></div>

<!-- 封面图片占位符（视频比例） -->
<div class="aspect-video bg-gray-50 ..."></div>

<!-- 正文占位符（细长条，随机宽度） -->
<div :style="{ width: Math.random() * 20 + 80 + '%' }" class="h-4 bg-gray-50 ..."></div>
```

**尺寸说明**：
- `h-4`：高度 16px（模拟小文字、标签）
- `h-6`：高度 24px（模拟日期标签）
- `h-12`：高度 48px（模拟标题）
- `w-20`：宽度 80px（小标签）
- `w-32`：宽度 128px（标签）
- `w-full`：宽度 100%（完整行）
- `aspect-video`：16:9 的宽高比（视频比例）

**颜色说明**：
- `bg-gray-50`：浅灰色（#f9fafb）
- `bg-gray-100`：稍深的灰色（#f3f4f6）

**圆角说明**：
- `rounded-full`：完全圆角（用于日期标签）
- 无圆角：用于标题和正文（瑞士设计的锐利边缘）

### 5. 循环渲染占位符
使用 `v-for` 渲染多个占位符元素：

```vue
<!-- 正文占位符：10 行，随机宽度 -->
<div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }"
  class="h-4 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**为什么使用循环？**
- 减少重复代码
- 使用随机宽度
- 保持代码简洁

### 6. 相对定位与绝对定位
使用 `relative` 和 `absolute` 定位闪烁动画层：

```vue
<!-- 父元素：相对定位 -->
<div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
  <!-- 子元素：绝对定位（覆盖父元素） -->
  <div class="shimmer absolute inset-0"></div>
</div>
```

**为什么这样设计？**
- `relative`：建立定位上下文
- `absolute`：相对于父元素定位
- `inset-0`：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0）
- `overflow-hidden`：确保闪烁效果不溢出父元素

## 核心功能

### 功能 1：页面头部骨架
- 大标题占位符（128x16px）
- 日期标签占位符（80x24px，完全圆角）
- 摘要占位符（2 行，粗长条）
- 元数据占位符（2 个小标签）

### 功能 2：封面图片骨架
- 16:9 的宽高比（`aspect-video`）
- 浅灰色背景（`bg-gray-50`）
- 闪烁动画效果

### 功能 3：正文骨架
- 10 行正文占位符
- 每行都是随机宽度（80% 到 100%）
- 细长条（高度 16px）

## 使用场景

### 场景 1：文章详情页加载
```vue
<div v-if="pending" class="bg-white">
  <ArticleSkeleton />
</div>
<div v-else>
  <article>
    <!-- 实际文章内容 -->
  </article>
</div>
```

**使用时机**：
- 页面初始加载时
- 数据从 API 获取时
- 骨架屏在 `pending` 状态时显示
- 数据加载完成后隐藏，显示实际文章

### 场景 2：与实际文章切换
```vue
<div v-if="pending">
  <ArticleSkeleton />
</div>
<div v-else>
  <!-- 文章头部 -->
  <header>
    <h1>{{ article.title }}</h1>
    <div>{{ article.date }}</div>
  </header>
  
  <!-- 文章内容 -->
  <article>
    <img :src="article.coverImage" />
    <p>{{ article.content }}</p>
  </article>
</div>
```

**切换流程**：
1. 页面加载，`pending = true`
2. 显示骨架屏（ArticleSkeleton）
3. 数据加载完成，`pending = false`
4. 隐藏骨架屏，显示实际文章

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
@keyframes shimmer {
  0% { transform: translateX(-200%); }
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
<div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**改进建议**：
```vue
<div class="h-4 w-32 bg-gray-50 skeleton-item"></div>

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

### 优化 3：缓存随机宽度
使用 `computed` 缓存随机宽度数组：

**当前实现**：
```vue
<div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }">
</div>
```

**问题**：
- 每次渲染都会重新计算随机宽度
- 导致样式不断变化

**改进建议**：
```vue
<script setup lang="ts">
const widths = computed(() => {
  return Array.from({ length: 10 }, () => {
    return Math.floor(Math.random() * 20 + 80) + '%'
  })
})
</script>

<template>
  <div v-for="(width, i) in widths" :key="i" :style="{ width }">
    <!-- ... -->
  </div>
</template>
```

**好处**：
- 随机宽度只计算一次
- 避免样式不断变化
- 更好的性能

## 可访问性 (Accessibility)

### 可访问性 1：aria-label
骨架屏是视觉占位符，不需要 `aria-label`，但可以添加以帮助屏幕阅读器：

```vue
<div aria-label="正在加载文章内容..." role="status">
  <ArticleSkeleton />
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
  <ArticleSkeleton v-if="pending" />
  <article v-else>
    <!-- 实际文章内容 -->
  </article>
</div>
```

**作用**：
- 告知屏幕阅读器内容正在加载
- 屏幕阅读器会提示用户"正在加载..."

## Tailwind CSS 类名说明

### 布局类
- `grid`：使用 CSS Grid 布局
- `grid-cols-12`：12 列网格布局
- `col-span-12`：占满 12 列（移动端）
- `lg:col-span-10`：大屏幕占 10 列
- `lg:col-span-8`：大屏幕占 8 列
- `lg:offset-1`：大屏幕偏移 1 列
- `lg:offset-2`：大屏幕偏移 2 列
- `gap-8`：网格间距 32px
- `flex`：使用 Flexbox 布局
- `space-x-6`：水平方向元素间距 24px
- `space-y-4`：垂直方向元素间距 16px
- `space-y-6`：垂直方向元素间距 24px

### 间距类
- `pt-48`：顶部内边距 192px
- `pb-24`：底部内边距 96px
- `mb-8`：下外边距 32px
- `mb-6`：下外边距 24px
- `mb-16`：下外边距 64px
- `mt-20`：上外边距 80px
- `px-6`：左右内边距 24px
- `md:px-12`：中屏幕及以上左右内边距 48px

### 尺寸类
- `h-4`：高度 16px
- `h-6`：高度 24px
- `h-12`：高度 48px
- `w-20`：宽度 80px
- `w-32`：宽度 128px
- `w-full`：宽度 100%
- `w-2/3`：宽度 66.67%（2/3 行）
- `aspect-video`：16:9 的宽高比（视频比例）

### 边框和背景类
- `border`：添加边框
- `border-b`：底部边框
- `border-gray-100`：边框颜色为浅灰色
- `bg-white`：背景颜色为白色
- `bg-gray-50`：背景颜色为浅灰色
- `bg-gray-100`：背景颜色为稍深的灰色

### 定位类
- `relative`：相对定位（建立定位上下文）
- `absolute`：绝对定位（相对于最近的定位祖先）
- `inset-0`：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0）
- `overflow-hidden`：隐藏溢出内容

### 其他类
- `rounded-full`：完全圆角
- `max-w-screen-xl`：最大宽度为超宽屏（1280px）
- `mx-auto`：水平居中

## Vue 3 特性说明

### v-for
用于循环渲染占位符元素：

```vue
<!-- 正文占位符：10 行，随机宽度 -->
<div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }"
  class="h-4 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**好处**：
- 减少重复代码
- 使用随机宽度
- 保持代码简洁

### :style 绑定
用于动态设置样式：

```vue
<div :style="{ width: Math.random() * 20 + 80 + '%' }">
</div>
```

**说明**：
- `Math.random() * 20 + 80`：生成 80 到 100 之间的随机数
- `+ '%'`：添加百分号
- 结果：`'80%'` 到 `'100%'` 之间的随机宽度

**注意**：
- 在模板中直接计算会导致每次渲染都重新计算
- 应该使用 `computed` 缓存计算结果

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
        rgba(255, 255, 255, 0.4) 45%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0.4) 55%,
        rgba(255, 255, 255, 0) 100%);
```

**参数说明**：
- `90deg`：渐变方向（从左到右）
- `rgba(255, 255, 255, 0) 0%`：0% 位置，完全透明
- `rgba(255, 255, 255, 0.5) 50%`：50% 位置，50% 不透明度（最亮）
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
<div class="h-4 w-32 bg-gray-50 skeleton-item"></div>

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

### 改进 3：缓存随机宽度
当前问题：每次渲染都重新计算随机宽度

建议实现：
```vue
<script setup lang="ts">
const widths = computed(() => {
  return Array.from({ length: 10 }, () => {
    return Math.floor(Math.random() * 20 + 80) + '%'
  })
})
</script>

<template>
  <div v-for="(width, i) in widths" :key="i" :style="{ width }">
    <div class="h-4 bg-gray-50 relative overflow-hidden">
      <div class="shimmer absolute inset-0"></div>
    </div>
  </div>
</template>
```

好处：
- 随机宽度只计算一次
- 避免样式不断变化
- 更好的性能

### 改进 4：添加可访问性属性
当前问题：没有 `aria-label` 或 `aria-busy`

建议实现：
```vue
<div :aria-busy="true" aria-label="正在加载文章内容..." role="status">
  <ArticleSkeleton />
</div>
```

好处：
- 帮助屏幕阅读器理解加载状态
- 提供更好的可访问性

## 测试建议

### 测试 1：渲染测试
```typescript
test('should render skeleton correctly', () => {
  const wrapper = mount(ArticleSkeleton)
  
  // 检查页面头部
  expect(wrapper.find('.pt-48').exists()).toBe(true)
  
  // 检查封面图片骨架
  expect(wrapper.find('.aspect-video').exists()).toBe(true)
  
  // 检查正文占位符（10 行）
  expect(wrapper.findAll('.h-4.bg-gray-50').length).toBe(12)
})
```

### 测试 2：随机宽度测试
```typescript
test('should have random widths for content lines', () => {
  const wrapper = mount(ArticleSkeleton)
  
  // 获取所有正文占位符
  const lines = wrapper.findAll('.space-y-6 > div')
  
  // 检查是否有不同的宽度
  const widths = lines.map(line => {
    return line.element.style.width
  })
  
  const uniqueWidths = new Set(widths)
  expect(uniqueWidths.size).toBeGreaterThan(1)
})
```

### 测试 3：动画测试
```typescript
test('should have shimmer animation', () => {
  const wrapper = mount(ArticleSkeleton)
  
  // 检查闪烁元素是否存在
  const shimmerElements = wrapper.findAll('.shimmer')
  expect(shimmerElements.length).toBeGreaterThan(0)
  
  // 检查动画属性（通过 computed style）
  const shimmerStyle = window.getComputedStyle(shimmerElements[0].element)
  expect(shimmerStyle.animation).toContain('shimmer')
})
```

### 测试 4：可访问性测试
```typescript
test('should have accessibility attributes', () => {
  const wrapper = mount(ArticleSkeleton, {
    attrs: {
      'aria-busy': 'true',
      'aria-label': '正在加载文章内容...',
      role: 'status'
    }
  })
  
  expect(wrapper.attributes('aria-busy')).toBe('true')
  expect(wrapper.attributes('aria-label')).toBe('正在加载文章内容...')
  expect(wrapper.attributes('role')).toBe('status')
})
```

## 总结

这个文章骨架屏组件实现了：
- ✅ 完整的文章详情页布局
- ✅ 闪烁动画效果
- ✅ 模拟页面头部（标题、日期、摘要、元数据）
- ✅ 模拟文章内容（封面图片、多行正文）
- ✅ 随机宽度正文占位符
- ✅ 响应式设计（12 列网格布局）
- ✅ 使用 scoped 避免样式污染

待改进：
- ⏳ 使用 transform 优化性能
- ⏳ 使用伪元素减少 DOM 节点
- ⏳ 缓存随机宽度
- ⏳ 添加可访问性属性

这是一个功能完整、视觉效果好的骨架屏组件，遵循了瑞士设计原则和 Vue 3 最佳实践。
-->
<template>
    <!-- 外层容器 -->
    <!-- bg-white：背景颜色为白色 -->
    <div class="bg-white">
        
        <!-- 页面头部 -->
        <!-- section：语义化标签，表示页面的一个独立部分 -->
        <!-- pt-48：顶部内边距 192px -->
        <!-- pb-24：底部内边距 96px -->
        <!-- border-b：底部边框 -->
        <!-- border-gray-100：底部边框颜色为浅灰色 -->
        <section class="pt-48 pb-24 border-b border-gray-100">
            
            <!-- 内层容器 -->
            <!-- px-6：左右内边距 24px -->
            <!-- md:px-12：中屏幕及以上左右内边距 48px（响应式设计） -->
            <div class="px-6 md:px-12">
                
                <!-- 12 列网格布局 -->
                <!-- max-w-screen-xl：最大宽度为超宽屏（1280px） -->
                <!-- mx-auto：水平居中 -->
                <!-- grid：使用 CSS Grid 布局 -->
                <!-- grid-cols-12：12 列网格布局 -->
                <!-- gap-8：网格间距 32px -->
                <div class="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">
                    
                    <!-- 内容区域 -->
                    <!-- col-span-12：占满 12 列（移动端） -->
                    <!-- lg:col-span-10：大屏幕占 10 列 -->
                    <!-- lg:offset-1：大屏幕偏移 1 列（居中） -->
                    <div class="col-span-12 lg:col-span-10 lg:offset-1">
                        
                        <!-- 标题占位符 -->
                        <!-- h-4：高度 16px -->
                        <!-- w-32：宽度 128px -->
                        <!-- bg-gray-50：背景颜色为浅灰色 -->
                        <!-- mb-8：下外边距 32px -->
                        <!-- relative：相对定位（建立定位上下文） -->
                        <!-- overflow-hidden：隐藏溢出内容 -->
                        <div class="h-4 w-32 bg-gray-50 mb-8 relative overflow-hidden">
                            
                            <!-- 闪烁动画层 -->
                            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                            <!-- absolute：绝对定位（相对于父元素） -->
                            <!-- inset-0：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0） -->
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                        
                        <!-- 日期标签占位符 -->
                        <!-- h-6：高度 24px -->
                        <!-- w-20：宽度 80px -->
                        <!-- bg-gray-50：背景颜色为浅灰色 -->
                        <!-- rounded-full：完全圆角 -->
                        <!-- mb-6：下外边距 24px -->
                        <!-- relative：相对定位（建立定位上下文） -->
                        <!-- overflow-hidden：隐藏溢出内容 -->
                        <div class="h-6 w-20 bg-gray-50 rounded-full mb-6 relative overflow-hidden">
                            
                            <!-- 闪烁动画层 -->
                            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                            <!-- absolute：绝对定位（相对于父元素） -->
                            <!-- inset-0：覆盖整个父元素 -->
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                        
                        <!-- 摘要占位符 -->
                        <!-- space-y-4：垂直方向元素间距 16px -->
                        <!-- mb-8：下外边距 32px -->
                        <div class="space-y-4 mb-8">
                            
                            <!-- 摘要第 1 行占位符 -->
                            <!-- h-12：高度 48px -->
                            <!-- w-full：宽度 100%（完整行） -->
                            <!-- bg-gray-100：背景颜色为稍深的灰色 -->
                            <!-- relative：相对定位（建立定位上下文） -->
                            <!-- overflow-hidden：隐藏溢出内容 -->
                            <div class="h-12 w-full bg-gray-100 relative overflow-hidden">
                                
                                <!-- 闪烁动画层 -->
                                <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                                <!-- absolute：绝对定位（相对于父元素） -->
                                <!-- inset-0：覆盖整个父元素 -->
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                            
                            <!-- 摘要第 2 行占位符 -->
                            <!-- h-12：高度 48px -->
                            <!-- w-2/3：宽度 66.67%（2/3 行） -->
                            <!-- bg-gray-100：背景颜色为稍深的灰色 -->
                            <!-- relative：相对定位（建立定位上下文） -->
                            <!-- overflow-hidden：隐藏溢出内容 -->
                            <div class="h-12 w-2/3 bg-gray-100 relative overflow-hidden">
                                
                                <!-- 闪烁动画层 -->
                                <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                                <!-- absolute：绝对定位（相对于父元素） -->
                                <!-- inset-0：覆盖整个父元素 -->
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                        </div>
                        
                        <!-- 元数据占位符 -->
                        <!-- flex：使用 Flexbox 布局 -->
                        <!-- space-x-6：水平方向元素间距 24px -->
                        <div class="flex space-x-6">
                            
                            <!-- 元数据标签 1 占位符 -->
                            <!-- h-4：高度 16px -->
                            <!-- w-32：宽度 128px -->
                            <!-- bg-gray-50：背景颜色为浅灰色 -->
                            <!-- relative：相对定位（建立定位上下文） -->
                            <!-- overflow-hidden：隐藏溢出内容 -->
                            <div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
                                
                                <!-- 闪烁动画层 -->
                                <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                                <!-- absolute：绝对定位（相对于父元素） -->
                                <!-- inset-0：覆盖整个父元素 -->
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                            
                            <!-- 元数据标签 2 占位符 -->
                            <!-- h-4：高度 16px -->
                            <!-- w-32：宽度 128px -->
                            <!-- bg-gray-50：背景颜色为浅灰色 -->
                            <!-- relative：相对定位（建立定位上下文） -->
                            <!-- overflow-hidden：隐藏溢出内容 -->
                            <div class="h-4 w-32 bg-gray-50 relative overflow-hidden">
                                
                                <!-- 闪烁动画层 -->
                                <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                                <!-- absolute：绝对定位（相对于父元素） -->
                                <!-- inset-0：覆盖整个父元素 -->
                                <div class="shimmer absolute inset-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 文章内容 -->
        <!-- section：语义化标签，表示页面的一个独立部分 -->
        <!-- mt-20：上外边距 80px -->
        <!-- px-6：左右内边距 24px -->
        <!-- md:px-12：中屏幕及以上左右内边距 48px（响应式设计） -->
        <section class="mt-20 px-6 md:px-12">
            
            <!-- 12 列网格布局 -->
            <!-- max-w-screen-xl：最大宽度为超宽屏（1280px） -->
            <!-- mx-auto：水平居中 -->
            <!-- grid：使用 CSS Grid 布局 -->
            <!-- grid-cols-12：12 列网格布局 -->
            <!-- gap-8：网格间距 32px -->
            <div class="max-w-screen-xl mx-auto grid grid-cols-12 gap-8">
                
                <!-- 内容区域 -->
                <!-- col-span-12：占满 12 列（移动端） -->
                <!-- lg:col-span-8：大屏幕占 8 列 -->
                <!-- lg:offset-2：大屏幕偏移 2 列（居中） -->
                <div class="col-span-12 lg:col-span-8 lg:offset-2">
                    
                    <!-- 封面图片占位符 -->
                    <!-- aspect-video：16:9 的宽高比（视频比例） -->
                    <!-- bg-gray-50：背景颜色为浅灰色 -->
                    <!-- mb-16：下外边距 64px -->
                    <!-- relative：相对定位（建立定位上下文） -->
                    <!-- overflow-hidden：隐藏溢出内容 -->
                    <div class="aspect-video bg-gray-50 mb-16 relative overflow-hidden">
                        
                        <!-- 闪烁动画层 -->
                        <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                        <!-- absolute：绝对定位（相对于父元素） -->
                        <!-- inset-0：覆盖整个父元素 -->
                        <div class="shimmer absolute inset-0"></div>
                    </div>
                    
                    <!-- 正文占位符 -->
                    <!-- space-y-6：垂直方向元素间距 24px -->
                    <div class="space-y-6">
                        
                        <!-- 循环渲染 10 行正文占位符 -->
                        <!-- v-for="i in 10"：循环 10 次 -->
                        <!-- :key="i"：使用索引作为唯一标识 -->
                        <!-- :style="{ width: Math.random() * 20 + 80 + '%' }"：随机宽度（80% 到 100%） -->
                        <!--   Math.random()：生成 0 到 1 之间的随机数 -->
                        <!--   * 20：乘以 20，得到 0 到 20 之间的随机数 -->
                        <!--   + 80：加 80，得到 80 到 100 之间的随机数 -->
                        <!--   + '%'：添加百分号 -->
                        <div v-for="i in 10" :key="i" :style="{ width: Math.random() * 20 + 80 + '%' }"
                            class="h-4 bg-gray-50 relative overflow-hidden">
                            
                            <!-- 闪烁动画层 -->
                            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
                            <!-- absolute：绝对定位（相对于父元素） -->
                            <!-- inset-0：覆盖整个父元素 -->
                            <div class="shimmer absolute inset-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
    /* rgba(255, 255, 255, 0.4) 45%：45% 位置，40% 不透明度 */
    /* rgba(255, 255, 255, 0.5) 50%：50% 位置，50% 不透明度（最亮） */
    /* rgba(255, 255, 255, 0.4) 55%：55% 位置，40% 不透明度 */
    /* rgba(255, 255, 255, 0) 100%：100% 位置，完全透明 */
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.4) 55%,
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
