<!--
# 表格骨架屏组件 (Table Skeleton Component)

## 文件作用
这是一个表格的骨架屏组件，用于在表格数据加载时显示占位符。它模拟了表格的布局结构，包括：
- 表格标题栏（4 个单元格）
- 表格内容行（5 行，每行 4 个单元格）
- 空白填充（使用 flex-grow 拉伸）

## 实现手段

### 1. 骨架屏布局结构
使用 Flexbox 布局创建骨架屏表格：

```vue
<div class="h-full bg-white border border-swiss-text/10 overflow-hidden flex flex-col min-h-[400px]">
  <div class="p-8 flex flex-col h-full">
    <!-- 表格标题栏 -->
    <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
      <div v-for="i in 4" :key="i" class="flex-1 px-4">
        <!-- 标题单元格占位符 -->
      </div>
    </div>

    <!-- 表格内容行 -->
    <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4 last:border-0">
      <div v-for="i in 4" :key="i" class="flex-1 px-4">
        <!-- 内容单元格占位符 -->
      </div>
    </div>

    <!-- 空白填充 -->
    <div class="flex-grow"></div>
  </div>
</div>
```

**布局特点**：
- `h-full`：高度 100%（占满父容器）
- `bg-white`：白色背景
- `border border-swiss-text/10`：浅灰色边框（瑞士文本颜色的 10% 不透明度）
- `overflow-hidden`：隐藏溢出内容
- `flex flex-col`：垂直方向的 Flexbox 布局
- `min-h-[400px]`：最小高度 400px
- `p-8`：内边距 32px

### 2. 闪烁动画效果
使用 CSS 渐变和动画创建闪烁效果：

```css
.shimmer {
  background: linear-gradient(90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 45%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0.4) 55%,
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

### 3. 占位符元素设计
使用不同的尺寸模拟实际表格内容：

```vue
<!-- 表格标题单元格（高度 12px，宽度 16 像素内边距） -->
<div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>

<!-- 表格内容单元格（高度 12px，宽度随机，16 像素内边距） -->
<div class="h-4 bg-gray-50 relative overflow-hidden" :style="{ width: (Math.random() * 40 + 40) + '%' }">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**尺寸说明**：
- `h-3`：高度 12px（标题行）
- `h-4`：高度 16px（内容行）
- `w-16`：宽度 64px（固定宽度）
- 随机宽度：`Math.random() * 40 + 40 + '%'`（40% 到 80%）

**颜色说明**：
- `bg-gray-50`：浅灰色（#f9fafb）

**边框说明**：
- `border-swiss-text/10`：瑞士文本颜色的 10% 不透明度（浅灰色）
- `last:border-0`：最后一行移除底部边框

### 4. 随机宽度内容行
使用 `Math.random()` 为内容行生成随机宽度：

```vue
<div :style="{ width: (Math.random() * 40 + 40) + '%' }">
```

**随机宽度计算**：
- `Math.random()`：生成 0 到 1 之间的随机数
- `Math.random() * 40`：生成 0 到 40 之间的随机数
- `Math.random() * 40 + 40`：生成 40 到 80 之间的随机数
- `+ '%'`：添加百分号
- 结果：`'40%'` 到 `'80%'` 之间的随机宽度

**为什么使用随机宽度？**
- 模拟真实表格的行长变化
- 避免重复的视觉效果
- 提供更自然的骨架屏

### 5. 空白填充
使用 `flex-grow` 拉伸表格到底部：

```vue
<div class="flex-grow"></div>
```

**作用**：
- 确保表格占满容器高度
- 模拟真实表格的布局

## 核心功能

### 功能 1：表格标题骨架
- 4 个标题单元格
- 固定宽度（64px）
- 高度 12px

### 功能 2：表格内容骨架
- 5 行内容行
- 每行 4 个单元格
- 随机宽度（40% 到 80%）
- 高度 16px

### 功能 3：边框和间距
- 表格标题栏底部边框
- 每行底部边框（最后一行除外）
- 16 像素内边距

## 使用场景

### 场景 1：管理后台表格加载
```vue
<div v-if="pending">
  <TableSkeleton />
</div>
<UTable v-else :rows="data" :columns="columns" />
```

**使用时机**：
- 页面初始加载时
- 数据从 API 获取时
- 骨架屏在 `pending` 状态时显示
- 数据加载完成后隐藏，显示实际表格

### 场景 2：与实际表格切换
```vue
<div v-if="pending">
  <TableSkeleton />
</div>
<div v-else>
  <UTable :rows="data" :columns="columns" />
</div>
```

**切换流程**：
1. 页面加载，`pending = true`
2. 显示骨架屏（TableSkeleton）
3. 数据加载完成，`pending = false`
4. 隐藏骨架屏，显示实际表格

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
<div class="h-4 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**改进建议**：
```vue
<div class="h-4 bg-gray-50 skeleton-item"></div>

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

## Tailwind CSS 类名说明

### 布局类
- `flex`：使用 Flexbox 布局
- `flex-col`：垂直方向排列
- `flex-grow`：弹性元素占据所有可用空间
- `flex-1`：弹性元素等分分配空间

### 间距类
- `px-4`：左右内边距 16px
- `py-4`：上下内边距 16px
- `pb-4`：下外边距 16px
- `mb-4`：下外边距 16px

### 尺寸类
- `h-3`：高度 12px
- `h-4`：高度 16px
- `h-full`：高度 100%
- `w-16`：宽度 64px
- `min-h-[400px]`：最小高度 400px

### 边框和背景类
- `border`：添加边框
- `border-b`：底部边框
- `border-swiss-text/10`：边框颜色为瑞士文本颜色的 10% 不透明度
- `border-swiss-text/5`：边框颜色为瑞士文本颜色的 5% 不透明度
- `bg-white`：背景颜色为白色
- `bg-gray-50`：背景颜色为浅灰色

### 定位类
- `relative`：相对定位（建立定位上下文）
- `absolute`：绝对定位（相对于最近的定位祖先）
- `inset-0`：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0）
- `overflow-hidden`：隐藏溢出内容

### 其他类
- `last:border-0`：最后一个元素移除边框

## Vue 3 特性说明

### v-for
用于循环渲染占位符元素：

```vue
<!-- 表格标题：4 个单元格 -->
<div v-for="i in 4" :key="i" class="flex-1 px-4">
  <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
    <div class="shimmer absolute inset-0"></div>
  </div>
</div>

<!-- 表格内容行：5 行，每行 4 个单元格 -->
<div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4 last:border-0">
  <div v-for="i in 4" :key="i" class="flex-1 px-4">
    <div class="h-4 bg-gray-50 relative overflow-hidden">
      <div class="shimmer absolute inset-0"></div>
    </div>
  </div>
</div>
```

**好处**：
- 减少重复代码
- 容易调整数量
- 保持代码简洁

### :style 绑定
用于动态设置样式：

```vue
<div :style="{ width: (Math.random() * 40 + 40 + '%' }">
</div>
```

**说明**：
- `Math.random() * 40 + 40`：生成 40 到 80 之间的随机数
- `+ '%'`：添加百分号
- 结果：`'40%'` 到 `'80%'` 之间的随机宽度

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
        rgba(255, 255, 255, 0.5) 50%,
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
<div class="h-4 bg-gray-50 skeleton-item"></div>

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
  return Array.from({ length: 20 }, () => {
    return Math.floor(Math.random() * 40 + 40) + '%'
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
<div aria-label="正在加载表格内容..." role="status">
  <TableSkeleton />
</div>
```

好处：
- 帮助屏幕阅读器理解加载状态
- 提供更好的可访问性

## 测试建议

### 测试 1：渲染测试
```typescript
test('should render skeleton correctly', () => {
  const wrapper = mount(TableSkeleton)

  // 检查表格标题（4 个单元格）
  expect(wrapper.findAll('.h-3').length).toBe(4)

  // 检查表格内容（5 行 × 4 列 = 20 个单元格）
  expect(wrapper.findAll('.h-4').length).toBe(20)

  // 检查边框（标题栏有底部边框，最后一行没有）
  const rows = wrapper.findAll('.flex.border-b')
  expect(rows.length).toBe(6)  // 1 个标题栏 + 5 行内容
})
```

### 测试 2：随机宽度测试
```typescript
test('should have random widths for content cells', () => {
  const wrapper = mount(TableSkeleton)

  // 获取所有内容单元格
  const cells = wrapper.findAll('.h-4.bg-gray-50')

  // 检查是否有不同的宽度
  const widths = cells.map(cell => {
    return cell.element.style.width
  })

  const uniqueWidths = new Set(widths)
  expect(uniqueWidths.size).toBeGreaterThan(1)
})
```

### 测试 3：动画测试
```typescript
test('should have shimmer animation', () => {
  const wrapper = mount(TableSkeleton)

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
  const wrapper = mount(TableSkeleton, {
    attrs: {
      'aria-busy': 'true',
      'aria-label': '正在加载表格内容...',
      'role': 'status'
    }
  })

  expect(wrapper.attributes('aria-busy')).toBe('true')
  expect(wrapper.attributes('aria-label')).toBe('正在加载表格内容...')
  expect(wrapper.attributes('role')).toBe('status')
})
```

## 总结

这个表格骨架屏组件实现了：
- ✅ 完整的表格布局结构
- ✅ 闪烁动画效果
- ✅ 模拟表格标题栏和内容行
- ✅ 随机宽度内容单元格
- ✅ 使用 scoped 避免样式污染

待改进：
- ⏳ 使用 transform 优化性能
- ⏳ 使用伪元素减少 DOM 节点
- ⏳ 缓存随机宽度
- ⏳ 添加可访问性属性

这是一个功能完整、视觉效果好的骨架屏组件，遵循了瑞士设计原则和 Vue 3 最佳实践。
-->
<template>
  <!-- 外层表格容器 -->
  <!-- h-full：高度 100%（占满父容器） -->
  <!-- bg-white：背景颜色为白色 -->
  <!-- border：添加边框 -->
  <!-- border-swiss-text/10：边框颜色为瑞士文本颜色的 10% 不透明度（浅灰色） -->
  <!-- overflow-hidden：隐藏溢出内容 -->
  <!-- flex：使用 Flexbox 布局 -->
  <!-- flex-col：垂直方向排列 -->
  <!-- min-h-[400px]：最小高度 400px -->
  <div class="h-full bg-white border border-swiss-text/10 overflow-hidden flex flex-col min-h-[400px]">
    <!-- 表格内容容器 -->
    <!-- p-8：所有方向内边距 32px -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- flex-col：垂直方向排列 -->
    <!-- h-full：高度 100% -->
    <div class="p-8 flex flex-col h-full">
      <!-- 表格标题栏 -->
      <!-- flex：使用 Flexbox 布局 -->
      <!-- border-b：底部边框 -->
      <!-- border-swiss-text/10：底部边框颜色为瑞士文本颜色的 10% 不透明度 -->
      <!-- pb-4：下内边距 16px -->
      <!-- mb-4：下外边距 16px -->
      <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
        <!-- 循环渲染 4 个标题单元格 -->
        <!-- v-for="i in 4"：循环 4 次 -->
        <!-- :key="i"：使用索引作为唯一标识（0, 1, 2, 3） -->
        <!-- flex-1：弹性元素等分分配空间 -->
        <!-- px-4：左右内边距 16px -->
        <div v-for="i in 4" :key="i" class="flex-1 px-4">
          <!-- 表格标题单元格占位符 -->
          <!-- h-3：高度 12px -->
          <!-- w-16：宽度 64px -->
          <!-- bg-gray-50：背景颜色为浅灰色 -->
          <!-- relative：相对定位（建立定位上下文） -->
          <!-- overflow-hidden：隐藏溢出内容 -->
          <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
            <!-- 闪烁动画层 -->
            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
            <!-- absolute：绝对定位（相对于父元素） -->
            <!-- inset-0：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0） -->
            <div class="shimmer absolute inset-0"></div>
          </div>
        </div>
      </div>

      <!-- 表格内容行 -->
      <!-- v-for="j in 5"：循环 5 次 -->
      <!-- :key="j"：使用索引作为唯一标识（0, 1, 2, 3, 4） -->
      <!-- flex：使用 Flexbox 布局 -->
      <!-- border-b：底部边框 -->
      <!-- border-swiss-text/5：底部边框颜色为瑞士文本颜色的 5% 不透明度（比标题栏淡） -->
      <!-- py-4：上下内边距 16px -->
      <!-- last:border-0：最后一个元素移除底部边框 -->
      <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4 last:border-0">
        <!-- 循环渲染 4 个内容单元格 -->
        <!-- v-for="i in 4"：循环 4 次 -->
        <!-- :key="i"：使用索引作为唯一标识（0, 1, 2, 3） -->
        <!-- flex-1：弹性元素等分分配空间 -->
        <!-- px-4：左右内边距 16px -->
        <div v-for="i in 4" :key="i" class="flex-1 px-4">
          <!-- 表格内容单元格占位符 -->
          <!-- h-4：高度 16px -->
          <!-- bg-gray-50：背景颜色为浅灰色 -->
          <!-- relative：相对定位（建立定位上下文） -->
          <!-- overflow-hidden：隐藏溢出内容 -->
          <!-- :style="{ width: (Math.random() * 40 + 40) + '%' }"：随机宽度（40% 到 80%） -->
          <!--   Math.random()：生成 0 到 1 之间的随机数 -->
          <!--   * 40：乘以 40，得到 0 到 40 之间的随机数 -->
          <!--   + 40：加 40，得到 40 到 80 之间的随机数 -->
          <!--   + '%'：添加百分号 -->
          <div class="h-4 bg-gray-50 relative overflow-hidden"
            :style="{ width: (Math.random() * 40 + 40) + '%' }">
            <!-- 闪烁动画层 -->
            <!-- shimmer：自定义类名，用于应用闪烁动画 -->
            <!-- absolute：绝对定位（相对于父元素） -->
            <!-- inset-0：覆盖整个父元素（top: 0, right: 0, bottom: 0, left: 0） -->
            <div class="shimmer absolute inset-0"></div>
          </div>
        </div>
      </div>

      <!-- 空白填充 -->
      <!-- flex-grow：弹性元素占据所有可用空间 -->
      <!-- 作用：确保表格占满容器高度，模拟真实表格的布局 -->
      <div class="flex-grow"></div>
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
  /* rgba(255, 255, 255, 0.4) 45%：45% 位置，40% 不透明度 */
  /* rgba(255, 255, 255, 0.5) 50%：50% 位置，50% 不透明度（最亮） */
  /* rgba(255, 255, 255, 0.4) 55%：55% 位置，40% 不透明度 */
  /* rgba(255, 255, 255, 0.4) 55%：55% 位置，40% 不透明度 */
  /* rgba(255, 255, 255, 0) 100%：100% 位置，完全透明 */
  background: linear-gradient(90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 45%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0.4) 55%,
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
