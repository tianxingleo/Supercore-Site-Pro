<!-- 
===================================================================================
网站根组件（App Root Component）
===================================================================================

文件作用：
此文件是网站的全局根组件（Root Component），是所有页面组件的父组件。它定义了：
1. 页面的全局结构（NuxtLayout）
2. 全局页面转场动画
3. HTML 语言属性（根据 i18n locale 动态设置）
4. 全局样式（页面转场、布局转场）

实现手段：
1. Vue 3 Composition API（<script setup>）
2. Nuxt Layout 组件：包裹页面内容
3. 页面转场动画：使用 Vue Transition
4. 布局转场动画：Layout 组件的转场效果
5. 动态语言属性：根据当前语言动态设置 html lang 属性
6. Tailwind CSS 样式：瑞士设计背景色（bg-swiss-bg）

核心功能：
1. 布局包裹：使用 NuxtLayout 包裹页面内容
2. 全局转场：页面切换时的淡入淡出效果
3. 布局转场：页面切换时的缩放效果
4. 语言切换：根据当前语言动态设置 HTML lang 属性

页面结构：
1. 主容器（min-h-screen）：最小高度为屏幕高度
2. 背景色（bg-swiss-bg）：瑞士设计背景色
3. NuxtLayout：包裹页面内容（导航栏、页脚等）

转场动画说明：
- 页面转场（page-enter-active, page-leave-active）：
  - 持续时间：0.4s
  - 缓动函数：cubic-bezier(0.4, 0, 0.2, 1)（ease-in-out）
  - 进入效果：opacity: 0 → 1, translateY: 20px → 0
  - 离开效果：opacity: 1 → 0, translateY: 0 → 20px

- 布局转场（layout-enter-active, layout-leave-active）：
  - 持续时间：0.3s
  - 缓动函数：ease-in-out
  - 进入效果：opacity: 0, transform: scale(0.98) → opacity: 1, transform: scale(1)
  - 离开效果：opacity: 1, transform: scale(1) → opacity: 0, transform: scale(0.98)

访问路径：
- 所有页面都通过此组件渲染
- 例如：/, /products, /news, /about, /contact 等

国际化支持：
- 根据当前语言动态设置 HTML lang 属性
- 语言代码示例：
  - 英文：'en'
  - 繁体中文（香港）'zh-HK'
  - 简体中文'zh-CN'

性能优化：
- 使用 transition 属性实现硬件加速动画（transform 和 opacity）
- 避免昂贵的属性（如 height、width）
- 缓动函数优化（cubic-bezier）
- 动画持续时间合理（0.3s - 0.4s）

技术栈：
- 框架：Nuxt 3（Vue 3）
- 样式：Tailwind CSS
- 国际化：@nuxtjs/i18n
- 转场：Vue 3 Transition API

设计特点：
- 瑞士设计风格：使用瑞士设计背景色
- 最小高度：min-h-screen（占满屏幕高度）
- 淡动动画：页面切换时的平滑转场
- 语言支持：动态 HTML lang 属性

SEO 优化：
- 动态 lang 属性：搜索引擎能正确识别页面语言
- 结构化数据：通过 useHead 在 NuxtLayout 中设置
- 多语言支持：根据 locale 设置正确的语言代码

注意事项：
- NuxtLayout 是项目自定义的布局组件
- page-enter/page-leave 用于页面切换转场
- layout-enter/layout-leave 用于布局切换转场
- 转场动画由 Vue Transition 处理
===================================================================================
-->

<template>
  <!-- 主容器 -->
  <!-- min-h-screen：最小高度为屏幕高度 -->
  <!-- bg-swiss-bg：瑞士设计背景色 -->
  <div class="min-h-screen bg-swiss-bg">
    <!-- NuxtLayout：全局布局组件 -->
    <!-- 包含导航栏、页脚、全局组件 -->
    <NuxtLayout />
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// 国际化 (Internationalization)
// ============================================================================
// useI18n：Nuxt i18n 国际化组合式函数
// 解构获取 locale：当前语言代码（如 'en', 'zh-HK', 'zh-CN'）
const { locale } = useI18n()

// ============================================================================
// 设置全局 HTML 属性（HTML Attributes）
// ============================================================================
// useHead：Nuxt 提供的组合式函数，用于设置 HTML head 标签
// htmlAttrs：设置 HTML 元素的属性
// - lang：语言代码（动态根据 locale 设置）
// useHead 会将这些属性添加到 <html lang="zh-HK"> 标签中
useHead({
  htmlAttrs: {
    lang: locale,
  },
})

// ============================================================================
// 全局转场样式 (Global Transition Styles)
// ============================================================================
// Page Transition：页面切换转场
// Layout Transition：布局切换转场

/* Page Transition Animation */
.page-enter-active,
.page-leave-active {
  /* transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.page-leave-to {
  /* opacity: 0; */
  opacity: 0;
  /* transform: translateY(20px); */
  transform: translateY(20px);
}

.page-enter-to,
.page-leave-from {
  /* opacity: 1; */
  opacity: 1;
  /* transform: translateY(0); */
  transform: translateY(0);
}

/* Layout Transition Animation */
.layout-enter-active,
.layout-leave-active {
  /* transition: all 0.3s ease-in-out; */
  transition: all 0.3s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
  /* opacity: 0; */
  opacity: 0;
  /* transform: scale(0.98); */
  transform: scale(0.98);
}

.layout-enter-to,
.layout-leave-from {
  /* opacity: 1; */
  opacity: 1;
  /* transform: scale(1); */
  transform: scale(1);
}
</style>

