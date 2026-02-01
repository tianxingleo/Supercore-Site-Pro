<!--
===================================================================================
默认布局组件（Default Layout Component）
===================================================================================

文件作用：
此文件是网站的默认布局组件，用于包裹所有页面内容。它定义了：
1. 固定导航栏：全站导航栏（AppNavbar）
2. 页面内容区：使用 <slot /> 动态渲染页面内容
3. 性能监控：开发工具（PerformancePanel）

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 固定布局：AppNavbar 使用 fixed 定位，布局不随滚动移动
3. 条件渲染：v-if="isDev" 仅在开发环境显示性能监控面板
4. 响应式间距：桌面端内边距大于移动端
5. 隐藏溢出：min-h-screen 确保页面至少占满屏幕高度

核心功能：
1. 固定导航栏：全局导航栏（AppNavbar）
2. 页面内容渲染：<slot /> 动态渲染页面内容
3. 开发工具：开发环境显示性能监控面板（PerformancePanel）

布局结构：
1. 最小高度屏幕：min-h-screen
2. 导航栏：全站导航栏（fixed）
3. 页面内容：页面主要内容
4. 开发工具：性能监控面板（仅开发环境）

使用场景：
- 所有页面都使用此布局
- 导航栏始终固定在顶部
- 页面内容由路由决定

访问路径：
- 所有页面都通过此布局渲染
- 例如：/, /products, /news, /about, /contact 等

样式特点：
- 全局样式：bg-white 白色背景
- 固定导航栏：AppNavbar 使用 fixed 定位
- 响应式间距：pt-24 md:pt-28
- 最小高度：min-h-screen（占满屏幕高度）

性能优化：
- 避免不必要的重渲染
- 条件渲染开发工具（生产环境不加载）
- 使用 Vue 3 条件编译优化

技术栈：
- 框架：Nuxt 3（Vue 3）
- 样式：Tailwind CSS
- 导航栏：AppNavbar 组件
- 开发工具：PerformancePanel 组件

注意事项：
- AppNavbar 必须使用 fixed 定位，确保始终在顶部
- <slot /> 会根据路由自动渲染对应的页面内容
- 开发工具仅在开发环境（isDev = true）显示
- 如果添加了其他全局组件，也应在此布局中
===================================================================================
-->

<template>
  <!-- 主容器 -->
  <!-- min-h-screen：最小高度为屏幕高度 -->
  <!-- bg-white：白色背景 -->
  <div class="min-h-screen bg-white">
    <!-- 全站导航栏 -->
    <!-- AppNavbar：固定导航栏组件，包含 Logo、菜单、语言切换器等 -->
    <AppNavbar />

    <!-- 页面内容区域 -->
    <!-- pt-24 md:pt-28：桌面端上边距（为导航栏预留空间） -->
    <!-- slot：动态渲染页面内容 -->
    <div class="pt-24 md:pt-28">
      <!-- NuxtPage：Nuxt 3 提供的页面组件，自动根据路由渲染对应的页面 -->
      <!-- 例如：/products 渲染 products/index.vue -->
      <slot />
    </div>

    <!-- 开发工具：性能监控面板 -->
    <!-- v-if="isDev"：仅在开发环境显示 -->
    <PerformancePanel v-if="isDev" :metrics="performanceMetrics" :is-dev="isDev" />
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// 导入依赖项 (Import Dependencies)
// ============================================================================
//
// computed：Vue 3 的响应式引用，用于创建计算属性
// 用于定义不需要参数的动态值
import { computed } from 'vue'

// PerformancePanel：性能监控面板组件
// 用于显示帧率、内存使用等性能指标
import { usePerformanceMonitor } from '~/composables/usePerformanceMonitor'

// ============================================================================
// 环境检测 (Environment Detection)
// ============================================================================
// process.env.NODE_ENV：Node.js 环境变量
// - 'development'：开发环境
// - 'production'：生产环境
const isDev = computed(() => process.env.NODE_ENV === 'development')

// ============================================================================
// 性能监控 (Performance Monitoring)
// ============================================================================
// usePerformanceMonitor：性能监控组合式函数
// 监控以下指标：
// - FPS（每秒帧数）
// - 内存使用
// - 页面加载时间
// - API 请求时间
const { metrics: performanceMetrics } = usePerformanceMonitor()
</script>
