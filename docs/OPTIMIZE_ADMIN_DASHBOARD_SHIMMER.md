# 后台管理仪表盘加载动画优化

## 问题描述

用户要求按照网站其他部分的加载动画，为后台管理仪表盘添加加载动画。网站其他部分使用了 `shimmer` 动画效果。

## 使用的加载动画

### Shimmer 动画

**来源**：`DashboardSkeleton.vue`、`TableSkeleton.vue` 等组件

**效果**：

- 从左到右的光泽闪烁效果
- 使用 linear-gradient 创建渐变背景
- 动画从 -200% 到 200% 移动背景位置
- 循环时间：1.5 秒

**CSS 实现**：

```css
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 45%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.4) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
```

## 实现的改进

### 1. 统计卡片加载动画

**修改前**：

```vue
<div v-if="stat.loading" class="h-12 flex items-center">
  <div class="animate-pulse text-swiss-text/40 text-2xl">加载中...</div>
</div>
```

**修改后**：

```vue
<!-- Shimmer Skeleton for Stats Value -->
<div v-if="stat.loading" class="h-12 w-32 bg-gray-50 relative overflow-hidden mb-4">
  <div class="shimmer absolute inset-0"></div>
</div>

<!-- Actual Stats Value -->
<p v-else class="text-4xl font-black tracking-tight text-swiss-text">
  {{ stat.value }}
</p>

<!-- Shimmer Skeleton for Trend -->
<div v-if="stat.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden mt-4">
  <div class="shimmer absolute inset-0"></div>
</div>
```

**效果**：

- ✅ 静态标签"總產品數"等立即显示
- ✅ 数字显示灰色的 shimmer 占位符
- ✅ 趋势显示 shimmer 占位符
- ✅ 数据加载完成后立即显示实际值

### 2. 服务器状态加载动画

#### Frontend Server

**修改内容**：

| 部分       | 修改前               | 修改后               |
| ---------- | -------------------- | -------------------- |
| URL        | `animate-pulse 文字` | `shimmer 灰色占位符` |
| 状态指示器 | `animate-pulse 圆点` | `shimmer 圆形占位符` |
| 状态文本   | `animate-pulse 文字` | `shimmer 灰色占位符` |
| 响应时间   | `animate-pulse 文字` | `shimmer 灰色占位符` |

**修改后代码**：

```vue
<!-- Shimmer Skeleton for URL -->
<div v-if="serverStatus.frontend.loading" class="h-4 w-48 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>

<p v-else class="text-sm text-swiss-text/60">
  {{ serverStatus.frontend.url }}
</p>

<!-- Shimmer Skeleton for Status Indicator -->
<div v-if="serverStatus.frontend.loading" class="w-3 h-3 rounded-full bg-gray-100 relative overflow-hidden mb-1">
  <div class="shimmer absolute inset-0"></div>
</div>

<span v-else class="w-3 h-3 rounded-full" :class="...">
  {{ serverStatus.frontend.status }}
</span>

<!-- Shimmer Skeleton for Status Text -->
<div v-if="serverStatus.frontend.loading" class="h-3 w-16 bg-gray-100 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>

<span v-else class="text-xs font-bold uppercase tracking-wider" :class="...">
  {{ serverStatus.frontend.status }}
</span>

<!-- Shimmer Skeleton for Response Time -->
<div v-if="serverStatus.frontend.loading" class="h-3 w-12 bg-gray-50 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>

<p v-else-if="serverStatus.frontend.responseTime" class="text-[10px] font-mono text-swiss-text-muted">
  {{ serverStatus.frontend.responseTime }}ms
</p>
<p v-else class="text-[10px] font-mono text-swiss-text-muted">--</p>
```

#### Backend Server

同样的改进应用于 Backend Server 部分。

### 3. Last Updated 加载动画

**修改前**：

```vue
<span v-if="serverStatus.loading" class="animate-pulse">更新中...</span>
```

**修改后**：

```vue
<!-- Shimmer Skeleton for Last Updated -->
<div v-if="serverStatus.loading" class="h-3 w-32 bg-gray-100 relative overflow-hidden">
  <div class="shimmer absolute inset-0"></div>
</div>

<!-- Actual Last Updated -->
<span v-else>{{ lastUpdated }}</span>
```

### 4. 询盘列表加载动画

**修改前**：

```vue
<div v-if="inquiriesLoading" class="p-12 text-center">
  <div class="animate-pulse text-swiss-text/40 text-lg">加载中...</div>
</div>
```

**修改后**：

```vue
<!-- Shimmer Skeleton for Table -->
<div v-if="inquiriesLoading" class="space-y-4 p-6 md:p-8">
  <!-- Table Header Skeleton -->
  <div class="flex border-b border-swiss-text/10 pb-4 mb-4">
    <div v-for="i in 4" :key="i" class="flex-1 px-4">
      <div class="h-3 w-16 bg-gray-50 relative overflow-hidden">
        <div class="shimmer absolute inset-0"></div>
      </div>
    </div>
  </div>
  <!-- Table Rows Skeleton -->
  <div v-for="j in 5" :key="j" class="flex border-b border-swiss-text/5 py-4">
    <div v-for="i in 4" :key="i" class="flex-1 px-4">
      <div
        class="h-4 bg-gray-50 relative overflow-hidden"
        :style="{ width: (Math.random() * 40 + 40) + '%' }"
      >
        <div class="shimmer absolute inset-0"></div>
      </div>
    </div>
  </div>
</div>

<!-- Empty State for Inquiries -->
<div v-else-if="inquiries.length === 0" class="p-12 text-center ...">
  暂無記錄
</div>

<!-- Inquiries Table -->
<table v-else class="w-full text-left text-sm">
  ...
</table>
```

**效果**：

- ✅ 标题"近期詢盤"立即显示
- ✅ 表格区域显示 shimmer 骨架屏
- ✅ 表格头和每行的每个单元格都有 shimmer 占位符
- ✅ 每行宽度随机变化（40%-80%）模拟真实内容长度
- ✅ 数据加载完成后立即显示实际表格

## 整体布局变化

### 修改前

```
页面加载
  ├─ 等待所有数据（3-5秒）
  └─ 显示骨架屏 DashboardSkeleton
      或显示空白页面

数据加载完成后
  ├─ 一次性显示所有数据
  └─ 无任何过渡效果
```

### 修改后

```
页面加载
  ├─ 立即显示静态标签（總產品數、待處理詢盤等）
  ├─ 立即显示 shimmer 占位符
  ├─ 统计数字 shimmer 占位符（独立加载）
  ├─ 服务器状态 shimmer 占位符（独立加载）
  └─ 询盘列表 shimmer 占位符（独立加载）

并发加载过程中（每部分独立）
  ├─ 统计数据加载完成 → 立即显示实际数字
  ├─ 服务器状态加载完成 → 立即显示实际状态
  └─ 询盘列表加载完成 → 立即显示实际表格
```

## 动画效果对比

### 文字脉冲（修改前）

- 使用 `animate-pulse` 类
- 透明度从 40% 到 100% 循环变化
- 看起来像文字在闪烁
- 不太美观，视觉干扰

### Shimmer 骨架屏（修改后）

- 使用渐变背景移动效果
- 从左到右的光泽扫过
- 看起来像内容在加载中
- 更专业、更美观
- 符合现代 UI 设计标准

## 视觉层次

### 加载状态

| 组件       | 静态内容         | 加载动画       |
| ---------- | ---------------- | -------------- |
| 统计卡片   | 标签（立即显示） | shimmer 占位符 |
| 服务器状态 | 标签（立即显示） | shimmer 占位符 |
| 询盘列表   | 标题（立即显示） | shimmer 骨架屏 |
| 所有       | 立即显示         | 独立动画       |

### 已加载状态

| 组件       | 内容                      |
| ---------- | ------------------------- |
| 统计卡片   | 实际数字和趋势            |
| 服务器状态 | URL、状态指示器、响应时间 |
| 询盘列表   | 完整的数据表格            |
| 所有       | 立即显示                  |

## 技术细节

### Shimmer 占位符的尺寸

| 用途         | 高度 | 宽度         | 背景颜色    |
| ------------ | ---- | ------------ | ----------- |
| 统计数字     | h-12 | w-32         | bg-gray-50  |
| 统计趋势     | h-3  | w-16         | bg-gray-100 |
| 服务器 URL   | h-4  | w-48         | bg-gray-50  |
| 状态指示器   | h-3  | w-3          | bg-gray-100 |
| 状态文本     | h-3  | w-16         | bg-gray-100 |
| 响应时间     | h-3  | w-12         | bg-gray-50  |
| Last Updated | h-3  | w-32         | bg-gray-100 |
| 表格头单元格 | h-3  | w-16         | bg-gray-50  |
| 表格行单元格 | h-4  | 随机 40%-80% | bg-gray-50  |

### 随机宽度的实现

```vue
:style="{ width: (Math.random() * 40 + 40) + '%' }"
```

- 生成 40% 到 80% 之间的随机宽度
- 模拟不同内容的长度变化
- 使骨架屏看起来更真实

## 性能考虑

### 1. 并发加载

使用 `Promise.all` 并发加载所有部分：

- 不阻塞其他部分的显示
- 网络请求并行处理
- 整体加载时间更快

### 2. 独立错误处理

每个加载函数独立处理错误：

- 单个错误不影响其他部分
- 用户体验更好
- 更容易定位问题

### 3. 立即更新数据

数据加载完成后立即更新对应的部分：

- 不等待其他数据
- 实时显示加载进度
- 用户看到动态更新

## 用户体验改进

### 修改前

- ⚠️ 等待 3-5 秒的空白或骨架屏
- ⚠️ 一次性显示所有内容，无过渡
- ⚠️ 加载状态不明确
- ⚠️ 无法知道哪些数据已加载

### 修改后

- ✅ 页面立即显示静态标签
- ✅ 每个部分独立显示加载进度
- ✅ 使用专业的 shimmer 动画
- ✅ 数据加载完成后立即显示
- ✅ 清楚的视觉层次和加载状态

## 相关文件

- `pages/admin/index.vue` - 后台管理仪表盘（已更新）
- `components/admin/DashboardSkeleton.vue` - 旧的骨架屏（不再使用）
- `components/admin/TableSkeleton.vue` - 表格骨架屏（参考）

## 一致性

现在后台管理仪表盘的加载动画与网站其他部分保持一致：

- ✅ 使用相同的 shimmer 动画
- ✅ 使用相同的灰色占位符
- ✅ 使用相同的动画时间（1.5 秒）
- ✅ 使用相同的视觉层次

## 测试清单

- [x] 为统计卡片添加 shimmer 占位符
- [x] 为服务器状态添加 shimmer 占位符
- [x] 为 last updated 添加 shimmer 占位符
- [x] 为询盘列表添加 shimmer 骨架屏
- [x] 添加 shimmer 动画样式
- [x] 保持与网站其他部分一致
- [x] 独立加载每个部分
- [x] 数据加载完成后立即显示
- [ ] 需要用户验证加载效果

## 状态

✅ **已完成** - 后台管理仪表盘加载动画已优化，使用 shimmer 动画

## 后续优化建议

### 1. 添加淡入淡出过渡

可以在数据从 loading 状态切换到已加载状态时添加过渡：

```vue
<transition name="fade">
  <div v-if="stat.loading" class="shimmer ...">...</div>
  <p v-else>{{ stat.value }}</p>
</transition>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 2. 优化随机宽度

使用更稳定的随机宽度生成：

```typescript
function getRandomWidth() {
  // 预定义的宽度选项，更真实
  const widths = ['40%', '50%', '60%', '70%', '80%']
  return widths[Math.floor(Math.random() * widths.length)]
}
```

### 3. 添加加载进度条

显示整体加载进度：

```vue
<div class="h-1 bg-gray-200 mb-8">
  <div
    class="h-full bg-blue-500 transition-all duration-500"
    :style="{ width: loadProgress + '%' }"
  ></div>
</div>
```

### 4. 添加骨架屏计数器

显示还有多少个部分正在加载：

```vue
<div v-if="loadingCount > 0" class="text-sm text-gray-500">
  正在加载 {{ loadingCount }} 个部分...
</div>
```

## 总结

**改进前**：使用简单的 animate-pulse 文字"加载中..."

**改进后**：

- ✅ 专业的 shimmer 骨架屏动画
- ✅ 与网站其他部分保持一致
- ✅ 每个部分独立加载和显示
- ✅ 更好的用户体验
- ✅ 清楚的视觉层次
- ✅ 实时反馈加载进度

现在后台管理仪表盘的加载体验与网站其他部分保持一致，提供了更专业、更流畅的用户体验。
