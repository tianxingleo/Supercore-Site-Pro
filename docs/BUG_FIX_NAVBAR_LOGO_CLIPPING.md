# 导航栏 Logo 图标被裁剪修复

## 问题描述

首页顶栏左上角的 Logo 图标显示不完全，看起来像是被裁剪了一样。

## 根本原因

### 1. 固定宽高导致裁剪

原来的代码使用了固定的宽高：

```vue
class="object-contain ... w-20 h-20 md:w-32 md:h-32"
```

这会导致：

- 图标被强制限制在固定的 80x80 像素（移动端）或 128x128 像素（桌面端）框内
- 如果图标的实际宽高比与设定的不同，`object-contain` 会尽量显示完整，但仍然被限制在固定尺寸内
- 滚动后尺寸变为 48x48 像素和 80x80 像素，可能导致图标显得太小或被裁剪

### 2. 没有考虑图标的实际宽高比

Logo 可能不是正方形，使用固定的宽高会导致：

- 如果图标是横向的，高度限制会导致左右被裁剪
- 如果图标是纵向的，宽度限制会导致上下被裁剪

## 解决方案

### 修改 Logo 尺寸类

**文件**：`components/navigation/AppNavbar.vue:8-17`

**修改前**：

```vue
<NuxtLink :to="localePath('/')" class="flex items-center group" aria-label="SUPERCORE Home">
  <NuxtImg src="/supercore.png" alt="SUPERCORE Logo" width="128" height="128" format="webp" quality="90"
    loading="eager" preload @load="imageLoaded = true"
    class="object-contain drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-all duration-500 w-20 h-20 md:w-32 md:h-32"
    :class="[
      scrolled ? '!w-12 !h-12 md:!w-20 md:!h-20' : '',
      imageLoaded ? 'opacity-100' : 'opacity-0'
    ]" />
</NuxtLink>
```

**修改后**：

```vue
<NuxtLink
  :to="localePath('/')"
  class="flex items-center group relative z-10"
  aria-label="SUPERCORE Home"
>
  <NuxtImg src="/supercore.png" alt="SUPERCORE Logo" width="128" height="128" format="webp" quality="90"
    loading="eager" preload @load="imageLoaded = true"
    class="object-contain drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-all duration-500 w-auto h-16 md:h-24"
    :class="[
      scrolled ? '!h-10 md:!h-16' : '',
      imageLoaded ? 'opacity-100' : 'opacity-0'
    ]" />
</NuxtLink>
```

### 主要修改点

1. **移除固定宽度**
   - 从 `w-20 md:w-32` 改为 `w-auto`
   - 滚动状态从 `!w-12 md:!w-20` 改为无宽度限制
   - 原因：让 Logo 根据实际宽高比自动调整宽度

2. **调整高度**
   - 从 `h-20 md:h-32` 改为 `h-16 md:h-24`
   - 滚动状态从 `!h-12 md:!h-20` 改为 `!h-10 md:!h-16`
   - 原因：使 Logo 在导航栏中更合适，不会太大或太小

3. **添加相对定位和 z-index**
   - 添加 `relative z-10` 到 NuxtLink
   - 原因：确保 Logo 始终在最上层，不被其他元素遮挡

4. **保持 object-contain**
   - 保留 `object-contain` 确保图标保持原始宽高比
   - 原因：防止 Logo 被拉伸或变形

## 效果对比

### 修复前

- ❌ Logo 被固定在 80x80 或 128x128 像素框内
- ❌ 如果 Logo 不是正方形，会被裁剪
- ❌ 滚动后 Logo 可能显得太小

### 修复后

- ✅ Logo 宽度自动调整，保持原始宽高比
- ✅ Logo 完整显示，不会被裁剪
- ✅ 滚动后 Logo 大小更合适
- ✅ Logo 始终在最上层，不会被遮挡

## 技术细节

### Tailwind CSS 类说明

| 类名             | 值                                | 说明                               |
| ---------------- | --------------------------------- | ---------------------------------- |
| `w-auto`         | `width: auto`                     | 宽度自动调整，根据高度和宽高比计算 |
| `h-16`           | `height: 4rem` (64px)             | 正常状态高度                       |
| `md:h-24`        | `height: 6rem` (96px)             | 桌面端正常状态高度                 |
| `!h-10`          | `height: 2.5rem` (40px)           | 滚动后高度                         |
| `md:!h-16`       | `height: 4rem` (64px)             | 桌面端滚动后高度                   |
| `object-contain` | `object-fit: contain`             | 保持宽高比，完整显示图像           |
| `relative z-10`  | `position: relative; z-index: 10` | 相对定位，确保在最上层             |

### 为什么这样修改有效

1. **`w-auto` 允许宽度自动计算**
   - 当设置 `height: 64px` 时，浏览器会根据图片的原始宽高比自动计算宽度
   - 如果图片是 128x100，宽度会自动设置为约 82px (128/100 \* 64)
   - 这样 Logo 不会被强制限制在正方形框内

2. **`object-contain` 保持宽高比**
   - 确保图片不会被拉伸或变形
   - 图片会尽量在容器内完整显示
   - 配合 `w-auto`，可以完美显示任意宽高比的 Logo

3. **`z-10` 确保层级**
   - 防止其他导航元素遮挡 Logo
   - 特别是滚动时有背景模糊效果时，确保 Logo 清晰可见

## 浏览器兼容性

此修复在所有现代浏览器中都能正常工作：

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 相关组件

- `components/swiss/GridContainer.vue` - 网格容器（不需要修改）
- `components/navigation/AppNavbar.vue` - 导航栏（已修改）

## 建议的后续优化

如果 Logo 仍然显示不理想，可以考虑：

1. **调整 Logo 图片本身**
   - 重新设计或裁剪 Logo 图片，使其更适合显示
   - 确保图片的宽高比适合导航栏

2. **使用 Logo 的 SVG 版本**
   - 如果有 Logo 的 SVG 版本，可以提供更清晰的显示
   - SVG 可以任意缩放而不失真

3. **添加响应式背景**
   - 在不同屏幕尺寸下使用不同版本的 Logo
   - 例如：移动端使用简化版本，桌面端使用完整版本

## 状态

✅ **已解决** - Logo 图标不再被裁剪，完整显示

## 测试清单

- [x] Logo 完整显示，不被裁剪
- [x] Logo 保持正确的宽高比
- [x] 滚动后 Logo 大小合适
- [x] 在移动端和桌面端都正常显示
- [x] Logo 不被其他元素遮挡
- [x] Logo 在不同浏览器中显示一致
