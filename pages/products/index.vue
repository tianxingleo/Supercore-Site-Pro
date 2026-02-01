<!--
================================================================================
产品列表页（Products List Page）
================================================================================

文件作用：
此文件是产品列表页面，展示公司的所有产品。
用户可以在此页面浏览所有产品，点击产品卡片查看详细信息。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 瑞士国际主义设计风格（GridContainer、TypographyHeader、ProductCard）
3. useLazyFetch 懒加载产品数据
4. GSAP ScrollTrigger 实现产品卡片进场动画
5. 响应式设计：适配桌面、平板、手机
6. 三种状态展示：加载中、数据加载完成、无数据

核心功能：
- 页面标题：展示产品页面的标题和副标题
- 产品网格：展示所有产品卡片（3 列布局）
- 加载状态：显示骨架屏（ProductSkeleton）
- 空状态：显示"暂无产品数据"提示
- 进场动画：产品卡片从下方滑入并淡入显示

数据获取：
- API 端点：/api/products/public
- 使用 useLazyFetch 懒加载，不阻塞导航
- 返回产品数组（Product[] 类型）
- 默认值：空数组 []

页面状态：
1. 加载中（pending = true）：
   - 显示 6 个骨架屏
   - 每个骨架屏占 4 列（桌面端）

2. 数据加载完成（products.length > 0）：
   - 显示产品卡片
   - 产品卡片从下方滑入并淡入显示（GSAP 动画）
   - 每行显示 3 个产品（桌面端）

3. 无数据（products.length = 0）：
   - 显示"暂无产品数据"提示
   - 居中对齐

动画系统：
- GSAP ScrollTrigger：滚动触发动画
- 触发条件：产品卡片顶部到达视口 90% 位置
- 动画效果：opacity: 1, y: 0（从下方滑入并显示）
- 交错延迟：每个卡片延迟 0.1 秒（stagger: 0.1）
- 只触发一次（once: true）

关键组件：
- ProductCard：产品卡片组件
- ProductSkeleton：产品骨架屏组件
- GridContainer：瑞士设计网格布局
- TypographyHeader：排版标题组件

访问路径：
- 英文：/products
- 繁体中文：/zh-HK/products
- 简体中文：/zh-CN/products

SEO 优化：
- 页面标题：产品 - 超核技術有限公司
- 可以在 useHead 中添加 meta 标签、description 等

性能优化：
- useLazyFetch 懒加载，提升首次加载速度
- GSAP 批量处理动画，减少重绘
- 只在客户端执行动画（process.client）

调试日志：
- [Products] Page mounting...
- [Products] Page mounted, data: [...], pending: true/false
- [Products] onMounted triggered
- [Products] After nextTick in onMounted
- [Products] Checking GSAP and DOM...
- [Products] Found cards: X
- [Products] Starting GSAP animation...
- [Products] GSAP onEnter fired for batch: X
- [Products] Animation triggered successfully!

技术栈：
- 框架：Nuxt 3（Vue 3）
- 动画：GSAP（ScrollTrigger）
- 样式：Tailwind CSS
- 国际化：@nuxtjs/i18n
- API：useLazyFetch 数据获取

================================================================================
-->

<template>
  <!-- 主容器：最小高度为屏幕高度，白色背景 -->
  <div class="min-h-screen bg-white">
    <!-- ====================================================================================
         页面标题区域（Page Header）
         ====================================================================================
         - pt-48 pb-24：上下内边距（12rem / 6rem）
         - border-b border-gray-100：下边框，颜色为灰色
         - mb-12：下边距（3rem）
    -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <!-- 左侧标题区域 -->
        <!-- col-span-12：移动端占满整行 -->
        <!-- lg:col-span-8：桌面端占 8/12 宽度 -->
        <div class="col-span-12 lg:col-span-8">
          <!-- 主标题 -->
          <!-- level="1"：标题级别 1（H1） -->
          <!-- size="display"：显示级别字体（超大字体） -->
          <TypographyHeader :level="1" size="display" class="mb-8">
            <!-- $t()：i18n 翻译函数 -->
            <!-- products.title：翻译键路径 -->
            {{ $t('products.title') }}
          </TypographyHeader>

          <!-- 副标题 -->
          <!-- level="2"：标题级别 2（H2） -->
          <!-- size="h3"：字体大小 H3 -->
          <!-- color="secondary"：次要文本颜色 -->
          <!-- weight="normal"：正常字重 -->
          <!-- max-w-2xl：最大宽度为 tailwind 的 2xl（672px） -->
          <!-- opacity-80：80% 透明度 -->
          <TypographyHeader
            :level="2"
            size="h3"
            color="secondary"
            weight="normal"
            class="max-w-2xl opacity-80"
          >
            {{ $t('products.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         产品网格区域（Products Grid）
         ====================================================================================
         - pb-32：下内边距（8rem）
    -->
    <section class="pb-32">
      <!-- 网格容器 -->
      <!-- :grid="true"：启用网格布局 -->
      <!-- gap="none"：无间距（通过边框实现网格线） -->
      <!-- border-t border-l border-gray-100：上边框和左边框（网格线） -->
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <!-- ====================================================================================
             加载状态（Loading State）
             ====================================================================================
             v-if="pending"：如果数据正在加载，则显示骨架屏
        -->
        <template v-if="pending">
          <!-- 循环渲染 6 个骨架屏 -->
          <!-- v-for="i in 6"：渲染 6 次 -->
          <!-- col-span-12：移动端占满整行 -->
          <!-- md:col-span-6：平板占 1/2 宽度（2 列） -->
          <!-- lg:col-span-4：桌面占 1/3 宽度（3 列） -->
          <!-- border-r border-b border-gray-100：右边框和下边框（网格线） -->
          <div
            v-for="i in 6"
            :key="i"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
          >
            <!-- ProductSkeleton：产品骨架屏组件 -->
            <!-- !border-none：强制无边框（因为父容器已经有边框） -->
            <ProductSkeleton class="!border-none" />
          </div>
        </template>

        <!-- ====================================================================================
             数据加载完成状态（Data Loaded State）
             ====================================================================================
             v-else-if="products && products.length"：如果有产品数据，则显示产品卡片
        -->
        <template v-else-if="products && products.length">
          <!-- 循环渲染产品卡片 -->
          <!-- v-for="(product, index) in products"：遍历产品数组 -->
          <!-- :key="product.id"：使用产品 ID 作为唯一键 -->
          <!-- product-card-item：添加类名，用于 GSAP 选择器 -->
          <!-- opacity-0 translate-y-8：初始状态透明且向下偏移，用于 GSAP 动画 -->
          <div
            v-for="(product, index) in products"
            :key="product.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 product-card-item opacity-0 translate-y-8"
          >
            <!-- ProductCard：产品卡片组件 -->
            <!-- :product="product"：传递产品数据 -->
            <!-- class="!border-none"：强制无边框 -->
            <ProductCard :product="product" class="!border-none" />
          </div>
        </template>

        <!-- ====================================================================================
             空状态（No Data State）
             ====================================================================================
             v-else：如果没有产品数据，则显示提示信息
        -->
        <template v-else>
          <!-- col-span-12：占满整行 -->
          <!-- border-r border-b border-gray-100：右边框和下边框（网格线） -->
          <!-- py-32：上下内边距（8rem） -->
          <!-- text-center：文本居中 -->
          <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
            <!-- text-swiss-secondary：次要文本颜色 -->
            <!-- uppercase：全大写 -->
            <!-- tracking-widest：超宽字间距 -->
            <!-- text-sm：小字体 -->
            <p class="text-swiss-secondary uppercase tracking-widest text-sm">暂無產品數據</p>
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
// ====================================================================================
// Script 部分：使用 Vue 3 Composition API
// ====================================================================================
// lang="ts"：使用 TypeScript

// 导入类型定义
import type { Product } from '~/types'

// 调试日志：页面挂载开始
console.log('[Products] Page mounting...')

// ====================================================================================
// 数据获取：产品列表
// ====================================================================================
// useLazyFetch()：Nuxt 提供的懒加载 fetch 函数
// 与 useFetch 的区别：
// - useFetch：阻塞导航，等待数据加载完成后再显示页面
// - useLazyFetch：不阻塞导航，先显示页面，数据在后台加载
//
// 为什么使用 useLazyFetch？
// - 提升用户体验：页面立即显示，不需要等待产品数据加载
// - 展示加载动画：可以显示骨架屏（ProductSkeleton）
// - 提升首次加载速度：减少关键资源加载时间
//
// <Product[]>：TypeScript 泛型，指定返回数据的类型
const { data: products, pending } = useLazyFetch<Product[]>('/api/products/public', {
  // default：默认值
  // 如果数据未加载，则使用空数组
  default: () => [],
})

// 调试日志：页面挂载完成
console.log('[Products] Page mounted, data:', products.value, 'pending:', pending.value)

// ====================================================================================
// SEO：页面标题
// ====================================================================================
// useHead()：动态设置 HTML head 标签
// 用于 SEO 优化（meta 标签、title 等）
useHead({
  // title：页面标题
  title: '产品 - 超核技術有限公司',
})

// ====================================================================================
// 动画系统
// ====================================================================================
// 获取 Nuxt 应用实例
const nuxtApp = useNuxtApp()

// 从 Nuxt 应用实例中获取 GSAP 和 ScrollTrigger
// (nuxtApp as any)：TypeScript 类型断言，因为 GSAP 不在默认类型中
const { $gsap, $ScrollTrigger } = nuxtApp as any

// ====================================================================================
// 组件挂载生命周期
// ====================================================================================
// onMounted()：Vue 生命周期钩子，组件挂载到 DOM 后执行
// 这在客户端和服务端渲染（SSR）时都会执行
onMounted(() => {
  // 调试日志：onMounted 触发
  console.log('[Products] onMounted triggered')

  // 使用 nextTick 等待 DOM 更新完成
  // nextTick()：Vue 提供的函数，等待 DOM 更新
  // 为什么需要 nextTick？
  // - 数据变化后，Vue 需要时间更新 DOM
  // - GSAP 动画需要操作 DOM 元素，必须等待 DOM 更新完成
  nextTick(() => {
    // 调试日志：nextTick 完成
    console.log('[Products] After nextTick in onMounted')

    // 再等待一下，确保子组件也渲染完成
    // setTimeout：延迟执行
    // 为什么需要 setTimeout？
    // - ProductCard 组件也需要时间渲染
    // - 需要确保产品卡片已经渲染到 DOM 中
    setTimeout(() => {
      // 调试日志：检查 GSAP 和 DOM
      console.log('[Products] Checking GSAP and DOM...')

      // 检查 GSAP 和 ScrollTrigger 是否可用，且在客户端
      // process.client：Nuxt 提供的环境变量，判断是否在客户端
      if ($gsap && $ScrollTrigger && process.client) {
        // 选择所有产品卡片元素
        const cards = document.querySelectorAll('.product-card-item')

        // 调试日志：找到的产品卡片数量
        console.log('[Products] Found cards:', cards.length)

        // 如果有产品卡片，则初始化动画
        if (cards.length > 0) {
          // 调试日志：开始 GSAP 动画
          console.log('[Products] Starting GSAP animation...')

          // ScrollTrigger.batch()：批量处理多个元素的滚动触发
          // 优势：
          // - 性能更好：一次性为多个元素创建 ScrollTrigger
          // - 交错动画：使用 stagger 实现依次显示的效果
          $ScrollTrigger.batch('.product-card-item', {
            // onEnter：元素进入视口时触发
            // batch：进入视口的元素集合
            onEnter: (batch: any) => {
              // 调试日志：onEnter 触发
              console.log('[Products] GSAP onEnter fired for batch:', batch.length)

              // GSAP.to()：创建补间动画
              // batch：目标元素
              $gsap.to(batch, {
                opacity: 1, // 透明度从 0 变为 1（显示）
                y: 0, // Y 轴位置从 translate-y-8 变为 0（向上移动）
                stagger: 0.1, // 交错动画：每个元素延迟 0.1 秒
                duration: 0.8, // 动画持续 0.8 秒
                ease: 'power3.out', // 缓动函数：power3.out（平滑减速）
                overwrite: true, // overwrite: true：立即覆盖冲突动画
              })
            },

            // start：触发位置
            // 'top 90%'：当元素顶部到达视口 90% 位置时触发
            start: 'top 90%',

            // once：true 表示只触发一次
            once: true,
          })

          // 重新刷新 ScrollTrigger
          // 为什么要刷新？
          // - 新增元素后，ScrollTrigger 需要重新计算位置
          // - 确保其他动画的触发位置正确
          $ScrollTrigger.refresh()

          // 调试日志：动画触发成功
          console.log('[Products] Animation triggered successfully!')
        } else {
          // 警告日志：未找到产品卡片
          console.warn('[Products] No cards found in DOM')
        }
      } else {
        // 警告日志：GSAP 或 ScrollTrigger 不可用
        console.warn('[Products] GSAP or ScrollTrigger not available', {
          hasGsap: !!$gsap, // 是否有 GSAP
          hasScrollTrigger: !!$ScrollTrigger, // 是否有 ScrollTrigger
          isClient: process.client, // 是否在客户端
        })
      }
    }, 100) // 延迟 100ms
  })
})
</script>
