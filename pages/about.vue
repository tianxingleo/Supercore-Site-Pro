<!--
================================================================================
关于我们页面（About Page）
================================================================================

文件作用：
此文件是公司的关于我们页面，展示公司概述、核心优势、服务特色和联系信息。
用户可以在此页面了解公司的历史、使命、价值观和服务能力。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 瑞士国际主义设计风格（GridContainer、TypographyHeader、SwissButton）
3. SwissTextReveal 文本渐入动画
4. 响应式设计：适配桌面、平板、手机
5. 动态 SVG 图标：使用 defineComponent 动态创建图标组件

核心功能：
1. Hero Section：页面标题和副标题
2. Company Overview：公司简介和企业理念
3. Core Advantages：核心优势统计数据（24/7 支持、可用性、响应准确率）
4. Solution Features：服务特色（6 个特点）
5. Call to Action：行动号召（联系我们、查看产品）

页面结构：
1. Hero Section（顶部区域）
   - 页面标题（公司名称）
   - 副标题（公司标语）

2. Company Overview（公司概述）
   - 左侧：公司简介和理念
   - 右侧：核心优势数据卡片

3. Solution Features（服务特色）
   - 6 个服务特点
   - 每个特点包含图标、标题、描述

4. Call to Action（行动号召）
   - 大标题："Ready to optimize your infrastructure?"
   - 两个按钮：联系我们、查看产品

数据来源：
- i18n 翻译文件（$t() 函数）
- solutionFeatures：硬编码的服务特点对象
- 图标：使用 defineComponent 动态创建 SVG 图标

动画系统：
- SwissTextReveal：文本渐入动画
- 延迟计算：:delay="index * 100"
- 持续时间：:duration="1.2" 或 1

访问路径：
- 英文：/about
- 繁体中文：/zh-HK/about
- 简体中文：/zh-CN/about

SEO 优化：
- 页面标题：關於超核 - 超核技術有限公司
- 可以在 useHead 中添加 meta 标签、description 等

技术栈：
- 框架：Nuxt 3（Vue 3）
- 样式：Tailwind CSS
- 国际化：@nuxtjs/i18n
- 图标：SVG（defineComponent）

组件使用：
- GridContainer：瑞士设计网格布局
- TypographyHeader：排版标题组件
- SwissTextReveal：文本渐入动画组件
- SwissButton：瑞士设计按钮组件

================================================================================
-->

<template>
  <!-- 主容器：最小高度为屏幕高度，白色背景 -->
  <div class="min-h-screen bg-white">
    <!-- ====================================================================================
         Hero Section（英雄区域）
         ====================================================================================
         - relative：相对定位
         - pt-48 pb-32：上下内边距（12rem / 8rem）
         - border-b border-gray-100：下边框，颜色为灰色
    -->
    <section class="relative pt-48 pb-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <!-- 内容区域：居中对齐 -->
        <!-- col-span-12：占满整行 -->
        <!-- text-center：文本居中 -->
        <!-- relative z-10：确保在其他元素之上 -->
        <div class="col-span-12 text-center relative z-10">
          <!-- 页面标题 -->
          <!-- :duration="1.2"：动画持续 1.2 秒 -->
          <SwissTextReveal tag="div" :duration="1.2">
            <TypographyHeader :level="1" size="display" class="mb-8">
              {{ $t('about.pageTitle') }}
            </TypographyHeader>
          </SwissTextReveal>

          <!-- 副标题 -->
          <!-- :delay="200"：延迟 200ms 开始 -->
          <!-- :duration="1"：动画持续 1 秒 -->
          <!-- size="h3"：字体大小 H3 -->
          <!-- color="secondary"：次要文本颜色 -->
          <!-- weight="normal"：正常字重 -->
          <!-- max-w-3xl mx-auto：最大宽度并水平居中 -->
          <!-- opacity-80：80% 透明度 -->
          <SwissTextReveal tag="div" :delay="200" :duration="1">
            <TypographyHeader
              :level="2"
              size="h3"
              color="secondary"
              weight="normal"
              class="max-w-3xl mx-auto opacity-80"
            >
              {{ $t('about.pageSubtitle') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         Company Overview（公司概述）
         ====================================================================================
         - py-32：上下内边距（8rem）
         - border-b border-gray-100：下边框
    -->
    <section class="py-32 border-b border-gray-100">
      <GridContainer :grid="true">
        <!-- 左侧：公司简介和理念 -->
        <!-- col-span-12：移动端占满整行 -->
        <!-- lg:col-span-6：桌面端占 6/12 宽度 -->
        <!-- mb-16 lg:mb-0：移动端有下边距，桌面端去除 -->
        <!-- pr-0 lg:pr-24：桌面端有右侧内边距（6rem） -->
        <div class="col-span-12 lg:col-span-6 mb-16 lg:mb-0 pr-0 lg:pr-24">
          <!-- 小标题标签 -->
          <SwissTextReveal tag="div">
            <div
              class="inline-block mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
            >
              Company Overview
            </div>
          </SwissTextReveal>

          <!-- 主标题 -->
          <SwissTextReveal tag="div" :delay="100">
            <TypographyHeader :level="2" size="h1" class="mb-12">
              {{ $t('about.companyOverview.title') }}
            </TypographyHeader>
          </SwissTextReveal>

          <!-- 公司简介描述 -->
          <!-- space-y-8：每个元素之间有 2rem 间距 -->
          <!-- text-swiss-text-muted：次要文本颜色 -->
          <!-- text-lg：大字体 -->
          <!-- leading-relaxed：宽松行高 -->
          <!-- font-medium：中等字重 -->
          <div class="space-y-8 text-swiss-text-muted text-lg leading-relaxed font-medium">
            <SwissTextReveal tag="p" :delay="200">{{
              $t('about.companyOverview.description1')
            }}</SwissTextReveal>
            <SwissTextReveal tag="p" :delay="300">{{
              $t('about.companyOverview.description2')
            }}</SwissTextReveal>
          </div>

          <!-- 企业理念 -->
          <!-- p-12：内边距（3rem） -->
          <!-- border border-gray-100：边框 -->
          <!-- relative overflow-hidden：相对定位，溢出隐藏 -->
          <!-- bg-swiss-bg-soft：瑞士设计浅色背景 -->
          <div class="mt-20 p-12 border border-gray-100 relative overflow-hidden bg-swiss-bg-soft">
            <!-- 理念标题 -->
            <SwissTextReveal tag="div">
              <TypographyHeader :level="3" size="h4" class="mb-10 font-black tracking-tighter">
                {{ $t('about.companyOverview.philosophy.title') }}
              </TypographyHeader>
            </SwissTextReveal>

            <!-- 理念列表 -->
            <!-- grid grid-cols-1：移动端 1 列 -->
            <!-- sm:grid-cols-2：平板以上 2 列 -->
            <!-- gap-8：间距 2rem -->
            <!-- text-swiss-text-muted：次要文本颜色 -->
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-8 text-swiss-text-muted">
              <!-- 循环渲染 4 个理念点 -->
              <li v-for="i in 4" :key="i" class="flex flex-col space-y-2">
                <!-- :delay="i * 100"：延迟计算（100ms、200ms、300ms、400ms） -->
                <SwissTextReveal tag="div" :delay="i * 100">
                  <!-- 序号 -->
                  <!-- text-[10px]：极小字体 -->
                  <!-- font-bold：粗体 -->
                  <!-- text-swiss-text：瑞士设计文本色 -->
                  <!-- opacity-30：30% 透明度 -->
                  <!-- block：块级元素 -->
                  <span class="text-[10px] font-bold text-swiss-text opacity-30 block"
                    >0{{ i }}</span
                  >

                  <!-- 理念内容 -->
                  <!-- font-bold：粗体 -->
                  <!-- text-swiss-text：瑞士设计文本色 -->
                  <!-- tracking-tight：紧凑字间距 -->
                  <span class="font-bold text-swiss-text tracking-tight">{{
                    $t(`about.companyOverview.philosophy.point${i}`)
                  }}</span>
                </SwissTextReveal>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧：核心优势数据卡片 -->
        <div class="col-span-12 lg:col-span-6">
          <!-- 网格布局 -->
          <!-- grid grid-cols-1：移动端 1 列 -->
          <!-- sm:grid-cols-2：平板以上 2 列 -->
          <!-- gap-px：1px 间距（创建网格线） -->
          <!-- bg-gray-100：背景色（网格线颜色） -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
            <!-- Stats Card 1：24/7 支持 -->
            <!-- bg-swiss-text：黑色背景 -->
            <!-- p-12：内边距（3rem） -->
            <!-- flex flex-col justify-between：垂直布局，两端对齐 -->
            <!-- min-h-[300px]：最小高度 300px -->
            <SwissTextReveal
              tag="div"
              :delay="100"
              class="bg-swiss-text p-12 flex flex-col justify-between min-h-[300px]"
            >
              <!-- 标签 -->
              <!-- text-white/40：白色，40% 透明度 -->
              <div class="text-white/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Performance
              </div>

              <!-- 数值和标签 -->
              <div>
                <!-- text-6xl：超大字体 -->
                <!-- font-black：极粗字体 -->
                <!-- text-white：白色文字 -->
                <!-- mb-2：下边距 0.5rem -->
                <!-- tracking-tighter：超紧凑字间距 -->
                <div class="text-6xl font-black text-white mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.support24.value') }}
                </div>
                <div class="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.support24.label') }}
                </div>
              </div>
            </SwissTextReveal>

            <!-- Stats Card 2：可用性 -->
            <!-- bg-white：白色背景 -->
            <SwissTextReveal
              tag="div"
              :delay="250"
              class="bg-white p-12 flex flex-col justify-between min-h-[300px]"
            >
              <div class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Availability
              </div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.availability.value') }}
                </div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.availability.label') }}
                </div>
              </div>
            </SwissTextReveal>

            <!-- Stats Card 3：响应准确率 -->
            <!-- 占据 2 列（全宽） -->
            <!-- sm:col-span-2：平板以上 2 列 -->
            <SwissTextReveal
              tag="div"
              :delay="400"
              class="bg-white p-12 flex flex-col justify-between min-h-[300px] sm:col-span-2"
            >
              <div class="text-swiss-text/40 font-bold tracking-[0.2em] uppercase text-[10px]">
                Response Accuracy
              </div>
              <div>
                <div class="text-6xl font-black text-swiss-text mb-2 tracking-tighter">
                  {{ $t('about.coreAdvantages.response.value') }}
                </div>
                <div class="text-swiss-text/60 text-xs font-bold uppercase tracking-widest">
                  {{ $t('about.coreAdvantages.response.label') }}
                </div>
              </div>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         Why Choose Us / Features（服务特色）
         ====================================================================================
         - py-32：上下内边距（8rem）
         - bg-white：白色背景
    -->
    <section class="py-32 bg-white">
      <GridContainer :grid="true">
        <!-- 区域标题 -->
        <div class="col-span-12 mb-20">
          <SwissTextReveal tag="div">
            <div
              class="inline-block mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
            >
              Our Edge
            </div>
          </SwissTextReveal>

          <SwissTextReveal tag="div" :delay="100">
            <TypographyHeader :level="2" size="h1" class="mb-4">
              {{ $t('about.solutionFeatures.title') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>

        <!-- 服务特点卡片 -->
        <!-- v-for="(feature, key, index) in solutionFeatures"：遍历 solutionFeatures 对象 -->
        <!-- key：对象键 -->
        <!-- index：索引（0, 1, 2, ...） -->
        <!-- col-span-12：移动端占满整行 -->
        <!-- md:col-span-4：平板以上占 1/3 宽度 -->
        <!-- border-t border-gray-100 pt-12 mt-12：上边框和上内边距 -->
        <!-- first:mt-0：第一个元素无上边距 -->
        <!-- md:first:mt-12：平板以上第一个元素有上边距 -->
        <!-- md:mt-12：平板以上所有元素有上边距 -->
        <div
          v-for="(feature, key, index) in solutionFeatures"
          :key="key"
          class="col-span-12 md:col-span-4 border-t border-gray-100 pt-12 mt-12 first:mt-0 md:first:mt-12 md:mt-12"
        >
          <!-- :delay="index * 100"：延迟计算 -->
          <SwissTextReveal tag="div" :delay="index * 100">
            <div class="h-full group">
              <!-- 图标容器 -->
              <!-- w-12 h-12：48px x 48px -->
              <!-- border border-gray-200：边框 -->
              <!-- flex items-center justify-center：居中对齐 -->
              <!-- mb-10：下边距 2.5rem -->
              <!-- group-hover:bg-swiss-text：hover 时背景变为黑色 -->
              <!-- group-hover:border-swiss-text：hover 时边框变为黑色 -->
              <!-- transition-all duration-500：过渡动画持续 500ms -->
              <div
                class="w-12 h-12 border border-gray-200 flex items-center justify-center mb-10 group-hover:bg-swiss-text group-hover:border-swiss-text transition-all duration-500"
              >
                <!-- 动态图标组件 -->
                <!-- :is="feature.icon"：动态组件，根据 feature.icon 值渲染 -->
                <!-- class="w-6 h-6"：24px x 24px -->
                <!-- text-swiss-text：瑞士设计文本色 -->
                <!-- group-hover:text-white：hover 时文字变为白色 -->
                <!-- transition-colors：颜色过渡动画 -->
                <component
                  :is="feature.icon"
                  class="w-6 h-6 text-swiss-text group-hover:text-white transition-colors"
                />
              </div>

              <!-- 标题 -->
              <TypographyHeader :level="3" size="h3" class="mb-6 !tracking-tighter">
                {{ $t(`about.solutionFeatures.${key}.title`) }}
              </TypographyHeader>

              <!-- 描述 -->
              <!-- text-swiss-text-muted：次要文本颜色 -->
              <!-- leading-relaxed：宽松行高 -->
              <!-- font-medium：中等字重 -->
              <p class="text-swiss-text-muted leading-relaxed font-medium">
                {{ $t(`about.solutionFeatures.${key}.description`) }}
              </p>
            </div>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         Call to Action（行动号召）
         ====================================================================================
         - py-32：上下内边距（8rem）
         - border-t border-gray-100：上边框
    -->
    <section class="py-32 border-t border-gray-100">
      <GridContainer>
        <!-- 容器 -->
        <div class="col-span-12">
          <!-- 黑色背景 -->
          <!-- bg-swiss-text：黑色背景 -->
          <!-- p-16 md:p-32：内边距（4rem / 8rem） -->
          <!-- text-center：文本居中 -->
          <!-- relative overflow-hidden：相对定位，溢出隐藏 -->
          <div class="bg-swiss-text p-16 md:p-32 text-center relative overflow-hidden">
            <!-- 内容区域 -->
            <!-- relative z-10：确保在其他元素之上 -->
            <div class="relative z-10">
              <!-- 大标题 -->
              <TypographyHeader :level="2" size="display" color="white" class="mb-16">
                Ready to optimize<br />your infrastructure?
              </TypographyHeader>

              <!-- 按钮组 -->
              <!-- flex flex-col：移动端垂直排列 -->
              <!-- sm:flex-row：平板以上水平排列 -->
              <!-- justify-center：居中对齐 -->
              <!-- gap-8：间距 2rem -->
              <div class="flex flex-col sm:flex-row justify-center gap-8">
                <!-- 主按钮：联系我们 -->
                <!-- tag="a"：使用 a 标签 -->
                <!-- :to="localePath('/contact')"：根据当前语言生成路径 -->
                <!-- variant="primary"：主要按钮样式 -->
                <!-- size="lg"：大尺寸 -->
                <!-- class="!bg-white !text-swiss-text"：强制白色背景，黑色文字 -->
                <!-- hover:!bg-gray-100：hover 时浅灰色背景 -->
                <!-- !px-12：强制水平内边距 3rem -->
                <!-- w-full：移动端宽度 100% -->
                <!-- aria-label：无障碍标签 -->
                <SwissButton
                  tag="a"
                  :to="localePath('/contact')"
                  variant="primary"
                  size="lg"
                  class="!bg-white !text-swiss-text hover:!bg-gray-100 !px-12 w-full"
                  aria-label="Contact us to optimize your infrastructure"
                >
                  {{ $t('home.hero.ctaSecondary') }}
                </SwissButton>

                <!-- 次要按钮：查看产品 -->
                <!-- variant="ghost"：幽灵按钮样式 -->
                <!-- !text-white：强制白色文字 -->
                <!-- !border-white/20：强制 20% 透明度的白色边框 -->
                <!-- hover:!bg-white/10：hover 时 10% 透明度的白色背景 -->
                <SwissButton
                  tag="a"
                  :to="localePath('/products')"
                  variant="ghost"
                  size="lg"
                  class="!text-white !border-white/20 hover:!bg-white/10 !px-12 w-full"
                >
                  {{ $t('nav.products') }}
                </SwissButton>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
// ====================================================================================
// SEO：页面标题
// ====================================================================================
useHead({
  // title：页面标题
  title: '關於超核 - 超核技術有限公司',
})

// ====================================================================================
// 国际化：路径生成
// ====================================================================================
// useLocalePath()：根据当前语言生成路径
const localePath = useLocalePath()

// ====================================================================================
// 服务特点数据
// ====================================================================================
// solutionFeatures：服务特点对象
// 每个特点包含：
// - icon：SVG 图标组件
const solutionFeatures = {
  // 稳定性
  stable: {
    // 定义组件：动态创建 SVG 图标
    icon: defineComponent({
      // render：渲染函数
      render: () =>
        // h()：Vue 的渲染函数，创建虚拟 DOM
        h(
          'svg', // 标签名：svg
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' }, // 属性对象
          [
            // 子元素数组
            h('path', {
              // 子元素：path
              'stroke-linecap': 'round', // 属性：线条末端圆角
              'stroke-linejoin': 'round', // 属性：线条连接处圆角
              d: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', // SVG 路径
            }),
          ]
        ),
    }),
  },
  // 成本优势
  cost: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M12 6v12m-3-2.818l.879.659c1.546 1.16 3.743 1.16 5.289 0m-5.289-8l.879.659c1.546 1.16 3.743 1.16 5.289 0m-7.289 4h10',
            }),
          ]
        ),
    }),
  },
  // 技术创新
  technology: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M12 18L20.25 7.5L3.75 7.5L12 18Z',
            }),
          ]
        ),
    }),
  },
  // 安全保障
  security: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
            }),
          ]
        ),
    }),
  },
  // 响应速度
  responseSpeed: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
            }),
          ]
        ),
    }),
  },
  // 一站式服务
  oneStop: {
    icon: defineComponent({
      render: () =>
        h(
          'svg',
          { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '1.5' },
          [
            h('path', {
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              d: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.96 1.24m5.96-5.96a14.926 14.926 0 00-1.24 5.96m-3.388-3.388a4.885 4.885 0 013.667-3.667m-7.334 7.334a4.885 4.885 0 01-3.667 3.667m7.334-7.334L15 6.41',
            }),
          ]
        ),
    }),
  },
}
</script>
