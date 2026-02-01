<!--
================================================================================
网站首页（Home Page）
================================================================================

文件作用：
此文件是网站的首页，展示公司品牌形象、核心产品、技术特性和最新动态。
首页是用户访问网站时的第一个页面，需要给用户留下深刻的第一印象。

实现手段：
1. Vue 3 Composition API（<script setup>）：使用现代 Vue 3 语法，代码更简洁
2. 瑞士国际主义设计风格：使用 GridContainer、SwissTextReveal、TypographyHeader 等组件
3. GSAP 动画系统：实现流畅的滚动动画和过渡效果
4. Three.js 3D 场景：在 Hero Section 展示交互式 3D 服务器模型
5. 响应式设计：适配桌面、平板、手机等多种设备
6. 国际化（i18n）：支持多语言内容显示

核心功能：
- Hero Section：品牌标语和 3D 服务器展示，支持滚动动画
- Product Categories：展示四大产品类别
- Features：展示三大技术特性
- Latest News：显示最新的三篇新闻文章
- About Section：公司简介和使命宣言
- 设备检测：根据设备性能自动启用/禁用 3D 效果

动画系统：
1. SwissTextReveal：文本渐入动画
2. GSAP ScrollTrigger：滚动触发的动画（特征项、新闻卡片）
3. Three.js 滚动动画：4 个阶段的 3D 场景变化（淡入、机柜打开、组件爆炸、重新组装）

性能优化：
- 使用 useLazyFetch 懒加载新闻数据，不阻塞导航
- ClientOnly 组件避免服务端渲染（SSR）时的 hydration mismatch
- 根据设备性能自动降级 3D 效果
- ScrollTrigger 批量处理动画，减少重绘

关键组件：
- ServerScene：3D 服务器场景组件（桌面端）
- MobileFallback：移动端降级组件
- NewsCard：新闻卡片组件
- GridContainer：瑞士设计网格布局
- SwissTextReveal：文本渐入动画组件
- TypographyHeader：排版标题组件
- SwissButton：瑞士设计按钮组件

技术栈：
- 框架：Nuxt 3（Vue 3）
- 动画：GSAP（ScrollTrigger）
- 3D：Three.js
- 样式：Tailwind CSS
- 国际化：@nuxtjs/i18n
- API：useLazyFetch 数据获取

SEO 优化：
- Canonical URL：指定 canonical 链接，避免重复内容
- 结构化数据：面包屑导航（BreadcrumbList）
- Meta 标签：通过 useHead 动态设置页面标题和链接
- 多语言支持：根据 locale 生成对应的 URL

访问路径：
- 英文：/
- 繁体中文：/zh-HK
- 简体中文：/zh-CN

================================================================================
-->

<template>
  <!-- 主容器：最小高度为屏幕高度，使用瑞士设计背景色 -->
  <div class="min-h-screen bg-swiss-bg">
    <!-- ====================================================================================
         Hero Section（英雄区域）- 包含品牌标语和 3D 场景
         ====================================================================================
         这是首页的第一个可见区域，占据整个屏幕高度。
         使用相对定位（relative）和溢出隐藏（overflow-hidden）来创建特殊的视觉效果。
         id="hero-section" 用于 GSAP ScrollTrigger 滚动动画触发。
    -->
    <section
      class="min-h-screen flex items-center relative overflow-hidden bg-white"
      id="hero-section"
    >
      <GridContainer :grid="true">
        <!-- ====================================================================================
             左侧内容区域：品牌标语、按钮等
             ====================================================================================
             使用 CSS Grid 响应式布局：
             - 移动端：col-span-12（占满整行）
             - 平板：lg:col-span-12
             - 桌面：xl:col-span-8（占 8/12 的宽度）
             - flex flex-col：垂直方向布局
             - justify-center：垂直居中
             - py-24 lg:py-0：移动端有上下内边距，桌面端去除
             - relative z-10：确保内容在 3D 场景之上
        -->
        <div
          class="col-span-12 lg:col-span-12 xl:col-span-8 flex flex-col justify-center py-24 lg:py-0 relative z-10"
        >
          <!-- ====================================================================================
               Eyebrow Text（眉毛文本）- 品牌/技术标签
               ====================================================================================
               SwissTextReveal：文本渐入动画组件
               - tag="div"：使用 div 标签包裹
               - :delay="100"：延迟 100ms 开始动画
               - immediate：立即触发动画（不等待滚动）
          -->
          <SwissTextReveal tag="div" :delay="100" class="mb-4 lg:mb-6" immediate>
            <div class="flex items-center gap-4">
              <!-- 品牌成立年份和技术领域标识 -->
              <!-- text-[10px]：极小字体，瑞士设计风格 -->
              <!-- font-black：极粗字体 -->
              <!-- tracking-[0.4em]：字间距 0.4em，瑞士设计特征 -->
              <!-- uppercase：全大写 -->
              <!-- text-swiss-text/40：文本颜色为瑞士设计文本色的 40% 透明度 -->
              <!-- font-mono：等宽字体，科技感 -->
              <span
                class="text-[10px] font-black tracking-[0.4em] uppercase text-swiss-text/40 font-mono"
              >
                Est. 2024 // Network Infrastructure
              </span>
              <!-- 分隔线装饰 -->
              <div class="h-px w-12 bg-swiss-text/10"></div>
            </div>
          </SwissTextReveal>

          <!-- ====================================================================================
               主标题（Hero Title）
               ====================================================================================
               TypographyHeader：排版标题组件
               - level="1"：标题级别为 1（H1，最重要的标题）
               - size="display"：显示级别字体（超大字体）
               - :delay="250"：延迟 250ms 开始动画
               - :duration="1.2"：动画持续 1.2 秒
          -->
          <SwissTextReveal tag="div" :delay="250" :duration="1.2" immediate>
            <TypographyHeader :level="1" size="display" class="mb-4 lg:mb-6">
              <!-- $t()：i18n 翻译函数 -->
              <!-- home.hero.title：翻译键路径（locales/xx.json 中的路径） -->
              {{ $t('home.hero.title') }}
            </TypographyHeader>
          </SwissTextReveal>

          <!-- ====================================================================================
               副标题和系统状态
               ====================================================================================
               - :delay="450"：延迟 450ms 开始动画
               - max-w-2xl：最大宽度为 tailwind 的 2xl（672px）
               - border-l-2 border-swiss-text/5：左侧 2px 边框，颜色为文本色的 5%
               - pl-8 lg:pl-12：左侧内边距（移动端 2rem，桌面端 3rem）
          -->
          <SwissTextReveal tag="div" :delay="450" :duration="1" immediate>
            <div
              class="max-w-2xl border-l-2 border-swiss-text/5 pl-8 lg:pl-12 mt-6 lg:mt-8 mb-4 lg:mb-6"
            >
              <!-- 副标题 -->
              <!-- level="2"：标题级别为 2（H2） -->
              <!-- size="h3"：字体大小为 H3 -->
              <!-- color="secondary"：次要文本颜色 -->
              <!-- weight="normal"：正常字重 -->
              <!-- !mb-0：强制无下边距（覆盖默认样式） -->
              <TypographyHeader
                :level="2"
                size="h3"
                color="secondary"
                weight="normal"
                class="!mb-0 opacity-90 leading-tight"
              >
                {{ $t('home.hero.subtitle') }}
              </TypographyHeader>

              <!-- 系统状态指示器 -->
              <div class="mt-4 flex items-center gap-3">
                <!-- 脉冲动画的小圆点 -->
                <!-- rounded-full：完全圆形 -->
                <!-- animate-pulse：脉冲动画 -->
                <span class="w-1.5 h-1.5 rounded-full bg-swiss-accent animate-pulse"></span>
                <!-- 系统版本号 -->
                <!-- text-[9px]：极小字体 -->
                <!-- tracking-widest：超宽字间距 -->
                <span
                  class="text-[9px] font-bold tracking-widest uppercase text-swiss-text/30 font-mono"
                  >Systems_Online: Hypercore_v4.0</span
                >
              </div>
            </div>
          </SwissTextReveal>

          <!-- ====================================================================================
               按钮组
               ====================================================================================
               - flex-row：水平排列
               - flex-wrap：允许换行（小屏幕）
               - items-center：垂直居中
               - gap-6 lg:gap-10：按钮间距（移动端 1.5rem，桌面端 2.5rem）
               - overflow-visible：允许内容溢出（避免按钮 hover 效果被裁剪）
          -->
          <div class="flex flex-row flex-wrap items-center gap-6 lg:gap-10 mt-2 overflow-visible">
            <!-- 主按钮（Primary Button）- 查看解决方案 -->
            <SwissTextReveal tag="div" :delay="600" :duration="0.8" immediate width-class="w-auto">
              <!-- SwissButton：瑞士设计按钮组件 -->
              <!-- variant="primary"：主要按钮样式 -->
              <!-- size="lg"：大尺寸 -->
              <!-- !px-12 !py-5：强制设置内边距（水平 3rem，垂直 1.25rem） -->
              <!-- hover-lift：hover 时向上浮动效果 -->
              <!-- text-[11px]：小字体 -->
              <!-- font-black：极粗字体 -->
              <!-- tracking-[0.2em]：字间距 0.2em -->
              <!-- whitespace-nowrap：不换行 -->
              <!-- @click="navigateTo(localePath('/solutions'))"：点击时导航到解决方案页面 -->
              <!-- aria-label：无障碍标签（屏幕阅读器使用） -->
              <SwissButton
                variant="primary"
                size="lg"
                class="!px-12 !py-5 hover-lift text-[11px] font-black tracking-[0.2em] whitespace-nowrap"
                @click="navigateTo(localePath('/solutions'))"
                aria-label="Explore our infrastructure solutions"
              >
                {{ $t('home.hero.cta') }}
              </SwissButton>
            </SwissTextReveal>

            <!-- 次要按钮（Ghost Button）- 联系我们 -->
            <SwissTextReveal tag="div" :delay="750" :duration="0.8" immediate width-class="w-auto">
              <!-- variant="ghost"：幽灵按钮样式（透明背景，有边框） -->
              <!-- border-swiss-text：边框颜色为瑞士设计文本色 -->
              <!-- hover:bg-swiss-text hover:text-white：hover 时背景变为文本色，文字变为白色 -->
              <!-- transition-colors duration-300：颜色过渡动画持续 300ms -->
              <SwissButton
                variant="ghost"
                size="lg"
                class="!px-12 !py-5 border-swiss-text hover:bg-swiss-text hover:text-white transition-colors duration-300 text-[11px] font-black tracking-[0.2em] whitespace-nowrap"
                @click="navigateTo(localePath('/contact'))"
                aria-label="Contact us for project consultation"
              >
                {{ $t('home.hero.ctaSecondary') }}
              </SwissButton>
            </SwissTextReveal>

            <!-- 装饰性代码元素（仅桌面端显示） -->
            <!-- hidden lg:block：移动端隐藏，桌面端显示 -->
            <SwissTextReveal
              tag="div"
              :delay="900"
              :duration="0.8"
              immediate
              width-class="w-auto"
              class="hidden lg:block"
            >
              <!-- opacity-10 group cursor-help：低透明度，鼠标悬停时显示帮助光标 -->
              <!-- transition-opacity hover:opacity-40：hover 时透明度增加到 40% -->
              <div
                class="flex items-center gap-6 ml-4 opacity-10 group cursor-help transition-opacity hover:opacity-40"
              >
                <!-- 垂直分隔线 -->
                <div class="h-10 w-px bg-swiss-text"></div>
                <!-- 模拟代码或坐标信息 -->
                <!-- tracking-tighter：超窄字间距 -->
                <!-- leading-none：无行高（紧凑排列） -->
                <!-- translate-y-1：向下平移 1 单位（微调位置） -->
                <span
                  class="text-[9px] font-mono uppercase tracking-tighter leading-none translate-y-1"
                >
                  Ref_Code: HK_712<br />Axis_X: 114.167
                </span>
              </div>
            </SwissTextReveal>
          </div>
        </div>

        <!-- ====================================================================================
             右侧 3D 场景区域
             ====================================================================================
             - col-span-12：移动端占满整行
             - lg:col-span-12 xl:col-span-4：桌面端占 4/12 的宽度
             - min-h-[400px] lg:min-h-[500px]：最小高度（移动端 400px，桌面端 500px）
             - relative：相对定位
             - mt-12 lg:mt-0：移动端有上边距，桌面端去除
             - flex items-center justify-center：水平和垂直居中
        -->
        <div
          class="col-span-12 lg:col-span-12 xl:col-span-4 min-h-[400px] lg:min-h-[500px] relative mt-12 lg:mt-0 flex items-center justify-center"
        >
          <!-- ====================================================================================
               桌面端：3D 场景
               ====================================================================================
               ClientOnly：仅在客户端渲染，避免 SSR（服务端渲染）时的 hydration mismatch
               这是因为 Three.js 依赖浏览器 API，无法在服务端渲染
          -->
          <ClientOnly>
            <!-- 条件渲染：如果设备支持 3D，则显示 ServerScene 组件 -->
            <!-- canUseAdvanced3D()：设备检测函数，判断设备性能是否足够运行 3D -->
            <!-- ref="serverSceneRef"：获取组件引用，用于调用组件方法 -->
            <!-- background-color="#FFFFFF"：3D 场景背景色为白色 -->
            <!-- :auto-rotate="false"：不自动旋转 -->
            <!-- :mouse-parallax="true"：启用鼠标视差效果（跟随鼠标移动） -->
            <!-- :initial-rotation="{ x: 0, y: (70 * Math.PI) / 180, z: 0 }"：初始旋转角度 -->
            <!-- y: (70 * Math.PI) / 180：70 度转换为弧度 -->
            <ServerScene
              v-if="canUseAdvanced3D()"
              ref="serverSceneRef"
              background-color="#FFFFFF"
              :auto-rotate="false"
              :mouse-parallax="true"
              :initial-rotation="{ x: 0, y: (70 * Math.PI) / 180, z: 0 }"
            />

            <!-- 移动端或低性能设备：降级版本 -->
            <!-- v-else：如果设备不支持 3D，则显示 MobileFallback 组件 -->
            <!-- :show-scroll-indicator="true"：显示滚动提示 -->
            <MobileFallback v-else :show-scroll-indicator="true" />

            <!-- 加载中的占位符 -->
            <!-- #fallback：ClientOnly 组件的插槽，在客户端组件加载前显示 -->
            <!-- PlaceholderCanvas：占位画布组件 -->
            <template #fallback>
              <PlaceholderCanvas />
            </template>
          </ClientOnly>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         产品类别区域（Product Categories Section）
         ====================================================================================
         - py-24：上下内边距（6rem）
         - bg-white：白色背景
         - border-y border-gray-100：上下边框，颜色为灰色
    -->
    <section class="py-24 bg-white border-y border-gray-100">
      <GridContainer>
        <!-- 区域标题 -->
        <div class="col-span-12 mb-16">
          <SwissTextReveal tag="div" :delay="100">
            <!-- inline-block：内联块级元素 -->
            <!-- mb-6：下边距 -->
            <!-- text-[10px]：极小字体 -->
            <!-- font-bold：粗体 -->
            <!-- tracking-[0.3em]：字间距 0.3em -->
            <!-- uppercase：全大写 -->
            <!-- border-b border-swiss-text pb-1：下边框，底部内边距 0.25rem -->
            <div
              class="inline-block mb-6 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
            >
              {{ $t('products.title') }}
            </div>
          </SwissTextReveal>
        </div>

        <!-- 产品类别网格 -->
        <!-- grid-cols-1：移动端 1 列 -->
        <!-- md:grid-cols-2：平板 2 列 -->
        <!-- lg:grid-cols-4：桌面 4 列 -->
        <!-- gap-12：间距 3rem -->
        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <!-- 循环渲染 4 个产品类别 -->
          <!-- v-for：Vue 的列表渲染指令 -->
          <!-- 数组：['generalCompute', 'hpc', 'highPerformanceStorage', 'generalStorage'] -->
          <!-- cat：当前类别的标识符 -->
          <!-- index：当前索引（0, 1, 2, 3） -->
          <!-- :key="cat"：必须提供唯一的 key 值以提高性能 -->
          <div
            v-for="(cat, index) in [
              'generalCompute',
              'hpc',
              'highPerformanceStorage',
              'generalStorage',
            ]"
            :key="cat"
            class="group"
          >
            <!-- 每个类别的容器，带有动画 -->
            <!-- :delay="index * 150"：延迟计算，第一个 0ms，第二个 150ms，第三个 300ms，第四个 450ms -->
            <!-- :duration="1"：动画持续 1 秒 -->
            <SwissTextReveal tag="div" :delay="index * 150" :duration="1">
              <!-- 类别卡片 -->
              <!-- border-t border-gray-100 pt-8：上边框和上内边距 -->
              <!-- transition-all duration-500：所有属性的过渡动画持续 500ms -->
              <!-- group-hover:border-swiss-text：hover 时边框颜色变为瑞士设计文本色 -->
              <!-- h-full：高度填满父容器 -->
              <!-- hover-scale-subtle：hover 时轻微缩放效果 -->
              <!-- cursor-pointer：鼠标悬停时显示手型光标 -->
              <div
                class="border-t border-gray-100 pt-8 transition-all duration-500 group-hover:border-swiss-text h-full hover-scale-subtle cursor-pointer"
              >
                <!-- 类别编号 -->
                <!-- CAT_0{{ index + 1 }}：生成 CAT_01, CAT_02, CAT_03, CAT_04 -->
                <div class="text-[8px] font-mono text-swiss-text/30 mb-4 uppercase">
                  CAT_0{{ index + 1 }}
                </div>

                <!-- 类别标题 -->
                <!-- level="3"：标题级别 3（H3） -->
                <!-- size="h5"：字体大小 H5 -->
                <!-- !mb-2：强制设置下边距为 0.5rem -->
                <!-- !tracking-tight：紧凑字间距 -->
                <TypographyHeader :level="3" size="h5" class="!mb-2 !tracking-tight">
                  {{ $t(`products.categories.${cat}.title`) }}
                </TypographyHeader>

                <!-- 类别副标题 -->
                <!-- text-[9px]：极小字体 -->
                <!-- text-swiss-text/40：文本颜色 40% 透明度 -->
                <!-- font-bold uppercase tracking-widest：粗体、全大写、超宽字间距 -->
                <div class="text-[9px] text-swiss-text/40 font-bold uppercase tracking-widest mb-6">
                  {{ $t(`products.categories.${cat}.subtitle`) }}
                </div>

                <!-- 类别描述（条件渲染） -->
                <!-- v-if="cat !== 'serverProducts'"：如果类别不是 'serverProducts' 则显示 -->
                <!-- line-clamp-4：最多显示 4 行，超出部分显示省略号 -->
                <!-- group-hover:text-swiss-text：hover 时文本颜色变为瑞士设计文本色 -->
                <p
                  v-if="cat !== 'serverProducts'"
                  class="text-[11px] text-swiss-text-muted leading-relaxed line-clamp-4 group-hover:text-swiss-text transition-colors duration-500"
                >
                  {{ $t(`products.categories.${cat}.description`) }}
                </p>
              </div>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         特性区域（Features Section）
         ====================================================================================
         - py-24：上下内边距
         - bg-white：白色背景
    -->
    <section class="py-24 bg-white">
      <!-- :grid="true"：启用网格布局 -->
      <GridContainer :grid="true">
        <!-- 区域标题 -->
        <div class="col-span-12 text-center mb-16">
          <SwissTextReveal tag="div">
            <!-- align="center"：文本居中 -->
            <TypographyHeader :level="2" size="h2" align="center" class="mb-4">
              {{ $t('home.features.title') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>

        <!-- 特性 1 -->
        <!-- col-span-12：移动端占满整行 -->
        <!-- md:col-span-4：平板占 1/3 宽度 -->
        <!-- mb-8 md:mb-0：移动端有下边距，平板去除 -->
        <!-- group cursor-default：鼠标悬停时显示默认光标（不是手型） -->
        <!-- relative feature-item：相对定位，添加 feature-item 类名用于 GSAP 选择器 -->
        <div
          class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item"
        >
          <!-- 特性编号 -->
          <div class="swiss-feature-number">01</div>
          <!-- 分隔线 -->
          <div class="swiss-separator mb-8"></div>
          <!-- 内容区域 -->
          <div class="px-4">
            <!-- 标题 -->
            <!-- group-hover:text-swiss-accent：hover 时文本颜色变为强调色 -->
            <SwissTextReveal tag="div" :delay="100">
              <TypographyHeader
                :level="3"
                size="h4"
                class="group-hover:text-swiss-accent transition-colors mb-4"
              >
                {{ $t('home.features.feature1.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <!-- 描述 -->
            <SwissTextReveal tag="div" :delay="200">
              <!-- text-swiss-secondary：次要文本颜色 -->
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature1.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>

        <!-- 特性 2 -->
        <!-- 与特性 1 结构相同，只是内容不同 -->
        <div
          class="col-span-12 md:col-span-4 mb-8 md:mb-0 group cursor-default relative feature-item"
        >
          <div class="swiss-feature-number">02</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <!-- 延迟 300ms -->
            <SwissTextReveal tag="div" :delay="300">
              <TypographyHeader
                :level="3"
                size="h4"
                class="group-hover:text-swiss-accent transition-colors mb-4"
              >
                {{ $t('home.features.feature2.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <!-- 延迟 400ms -->
            <SwissTextReveal tag="div" :delay="400">
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature2.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>

        <!-- 特性 3 -->
        <!-- 与特性 1 结构相同，只是内容不同 -->
        <div class="col-span-12 md:col-span-4 group cursor-default relative feature-item">
          <div class="swiss-feature-number">03</div>
          <div class="swiss-separator mb-8"></div>
          <div class="px-4">
            <!-- 延迟 500ms -->
            <SwissTextReveal tag="div" :delay="500">
              <TypographyHeader
                :level="3"
                size="h4"
                class="group-hover:text-swiss-accent transition-colors mb-4"
              >
                {{ $t('home.features.feature3.title') }}
              </TypographyHeader>
            </SwissTextReveal>
            <!-- 延迟 600ms -->
            <SwissTextReveal tag="div" :delay="600">
              <p class="text-swiss-secondary text-sm leading-relaxed">
                {{ $t('home.features.feature3.description') }}
              </p>
            </SwissTextReveal>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         最新新闻区域（Latest News Section）
         ====================================================================================
         - py-24：上下内边距
         - bg-white：白色背景
         - border-b border-gray-100：下边框
    -->
    <section class="py-24 bg-white border-b border-gray-100">
      <GridContainer>
        <!-- 标题和"查看更多"按钮 -->
        <!-- flex-row：水平排列 -->
        <!-- justify-between：两端对齐（标题在左，按钮在右） -->
        <!-- items-end：底部对齐 -->
        <div class="col-span-12 flex flex-row justify-between items-end mb-16 gap-6">
          <!-- 标题组 -->
          <div class="flex flex-row items-baseline gap-4 lg:gap-8">
            <SwissTextReveal tag="div" width-class="w-auto">
              <!-- !tracking-tighter：紧凑字间距 -->
              <!-- !mb-0：强制无下边距 -->
              <!-- uppercase：全大写 -->
              <TypographyHeader :level="2" size="h2" class="!tracking-tighter !mb-0 uppercase">
                {{ $t('news.latest') }}
              </TypographyHeader>
            </SwissTextReveal>
            <SwissTextReveal tag="div" :delay="150" width-class="w-auto">
              <!-- hidden md:inline-block：移动端隐藏，平板以上显示 -->
              <!-- border-swiss-text/10：边框颜色 10% 透明度 -->
              <!-- whitespace-nowrap：不换行 -->
              <div
                class="hidden md:inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text/30 border-b border-swiss-text/10 pb-1 whitespace-nowrap"
              >
                / {{ $t('news.title') }}
              </div>
            </SwissTextReveal>
          </div>

          <!-- "查看更多"链接按钮 -->
          <!-- NuxtLink：Nuxt 提供的链接组件，支持客户端路由 -->
          <!-- :to="localePath('/news')"：根据当前语言生成对应路径 -->
          <SwissTextReveal tag="div" :delay="300" width-class="w-auto">
            <NuxtLink
              :to="localePath('/news')"
              class="text-xs font-bold uppercase tracking-widest text-swiss-secondary hover:text-swiss-text transition-colors flex items-center mb-1 hover-arrow-slide link-underline whitespace-nowrap"
            >
              {{ $t('news.viewMore') }} <span class="ml-2 arrow-icon">→</span>
            </NuxtLink>
          </SwissTextReveal>
        </div>

        <!-- 新闻卡片网格 -->
        <!-- grid-cols-1：移动端 1 列 -->
        <!-- md:grid-cols-3：平板以上 3 列 -->
        <!-- border-t border-l border-gray-100：上边框和左边框（网格线） -->
        <div
          class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-gray-100"
        >
          <!-- ====================================================================================
               使用 ClientOnly 避免 hydration mismatch
               ====================================================================================
               原因：新闻数据只在客户端加载（server: false），如果服务端渲染时会和数据不一致
               ClientOnly 确保这部分只在客户端渲染，避免警告
          -->
          <ClientOnly>
            <!-- 加载状态：显示骨架屏 -->
            <!-- v-if="pendingNews"：如果新闻正在加载，则显示 3 个骨架屏 -->
            <template v-if="pendingNews">
              <div v-for="i in 3" :key="i" class="border-r border-b border-gray-100">
                <!-- NewsSkeleton：新闻卡片骨架屏组件 -->
                <!-- !border-none：强制无边框（因为父容器已经有边框） -->
                <NewsSkeleton class="!border-none" />
              </div>
            </template>

            <!-- 数据加载完成状态：显示新闻卡片 -->
            <!-- v-else-if="latestPosts && latestPosts.length > 0"：如果有新闻数据则显示 -->
            <template v-else-if="latestPosts && latestPosts.length > 0">
              <div
                v-for="post in latestPosts"
                :key="post.id"
                class="border-r border-b border-gray-100 bg-white news-card-item opacity-0 translate-y-8"
              >
                <!-- opacity-0 translate-y-8：初始状态透明且向下偏移，用于 GSAP 动画 -->
                <!-- NewsCard：新闻卡片组件 -->
                <NewsCard :post="post" class="!border-none" />
              </div>
            </template>

            <!-- 空状态：没有新闻数据 -->
            <!-- v-else：如果没有新闻数据，则显示提示信息 -->
            <div v-else class="col-span-3 py-24 text-center border-r border-b border-gray-100">
              <p class="text-swiss-secondary uppercase tracking-widest text-sm opacity-50">
                {{ $t('news.noNews') }}
              </p>
            </div>

            <!-- 服务端回退：服务端渲染时显示骨架屏 -->
            <!-- #fallback：ClientOnly 的回退插槽 -->
            <template #fallback>
              <div v-for="i in 3" :key="i" class="border-r border-b border-gray-100">
                <NewsSkeleton class="!border-none" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         关于我们区域（About Section）
         ====================================================================================
         - py-32：上下内边距（8rem）
         - bg-white：白色背景
         - relative overflow-hidden：相对定位，溢出隐藏
         - reveal-section：添加 reveal-section 类名，用于 GSAP ScrollTrigger 选择器
    -->
    <section class="py-32 bg-white relative overflow-hidden reveal-section">
      <!-- 顶部渐变线装饰 -->
      <!-- absolute top-0 left-0：绝对定位到顶部左侧 -->
      <!-- w-full：宽度 100% -->
      <!-- h-px：高度 1px -->
      <!-- bg-gradient-to-r from-transparent via-swiss-secondary/20 to-transparent：渐变背景 -->
      <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-swiss-secondary/20 to-transparent"
      ></div>

      <GridContainer :grid="true">
        <!-- 左侧内容 -->
        <!-- col-span-12：移动端占满整行 -->
        <!-- lg:col-span-5：桌面端占 5/12 宽度 -->
        <div class="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
          <SwissTextReveal tag="div">
            <TypographyHeader :level="2" size="h2" class="mb-6">
              {{ $t('about.pageTitle') }}
            </TypographyHeader>
          </SwissTextReveal>
          <SwissTextReveal tag="div" :delay="200">
            <TypographyHeader
              :level="2"
              size="h4"
              color="secondary"
              weight="normal"
              class="mb-8 leading-relaxed"
            >
              {{ $t('company.slogan') }}
            </TypographyHeader>
          </SwissTextReveal>
          <SwissTextReveal tag="div" :delay="400">
            <!-- variant="secondary"：次要按钮样式 -->
            <SwissButton variant="secondary" @click="navigateTo(localePath('/about'))">
              {{ $t('products.viewDetails') }}
            </SwissButton>
          </SwissTextReveal>
        </div>

        <!-- 右侧内容 -->
        <!-- lg:col-span-6：桌面端占 6/12 宽度 -->
        <!-- lg:col-start-7：从第 7 列开始（前面留空 1 列） -->
        <div class="col-span-12 lg:col-span-6 lg:col-start-7 flex items-center">
          <SwissTextReveal tag="div" :delay="600">
            <!-- text-xl sm:text-2xl：移动端 1.25rem，小屏幕 1.5rem -->
            <!-- leading-relaxed：宽松行高 -->
            <!-- font-light italic：细体，斜体 -->
            <p class="text-swiss-text text-xl sm:text-2xl leading-relaxed font-light italic">
              "{{ $t('company.mission') }}"
            </p>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- ====================================================================================
         组件演示区域（Component Demo Section）
         ====================================================================================
         v-if="false"：始终不显示（已隐藏，根据用户要求）
         这部分代码保留但不渲染，用于展示瑞士设计组件库
    -->
    <section v-if="false" class="py-24 bg-swiss-bg">
      <GridContainer :grid="true">
        <div class="col-span-12 mb-12">
          <TypographyHeader :level="2" size="h2"> Swiss Design Components </TypographyHeader>
          <p class="text-swiss-secondary mt-4">
            Swiss International Style - 瑞士国际主义风格组件库
          </p>
        </div>

        <!-- 按钮变体展示 -->
        <div class="col-span-12 mb-8">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Button Variants </TypographyHeader>
          <div class="flex flex-wrap gap-4">
            <SwissButton variant="primary">Primary</SwissButton>
            <SwissButton variant="secondary">Secondary</SwissButton>
            <SwissButton variant="ghost">Ghost</SwissButton>
            <SwissButton variant="primary" disabled>Disabled</SwissButton>
          </div>
        </div>

        <!-- 按钮尺寸展示 -->
        <div class="col-span-12 mb-8">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Button Sizes </TypographyHeader>
          <div class="flex flex-wrap gap-4 items-center">
            <SwissButton variant="primary" size="sm">Small</SwissButton>
            <SwissButton variant="primary" size="md">Medium</SwissButton>
            <SwissButton variant="primary" size="lg">Large</SwissButton>
          </div>
        </div>

        <!-- 字体展示 -->
        <div class="col-span-12">
          <TypographyHeader :level="3" size="h4" class="mb-4"> Typography Scale </TypographyHeader>
          <div class="space-y-4">
            <TypographyHeader :level="1" size="h1">
              Display Heading (H1) - 专业基礎設施解決方案
            </TypographyHeader>
            <TypographyHeader :level="2" size="h2">
              Heading 2 (H2) - 瑞士國際主義風格
            </TypographyHeader>
            <TypographyHeader :level="3" size="h3">
              Heading 3 (H3) - Swiss International Style
            </TypographyHeader>
            <TypographyHeader :level="4" size="h4" color="secondary">
              Secondary Text - 次要文字顏色
            </TypographyHeader>
          </div>
        </div>
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
import type { Post } from '~/types'

// ====================================================================================
// Nuxt Composable（组合式函数）
// ====================================================================================
// useI18n()：i18n 国际化组合式函数
// - t：翻译函数，用于获取翻译文本
// - locale：当前语言
const { t, locale } = useI18n()

// useLocalePath()：根据当前语言生成路径的组合式函数
// 例如：localePath('/products') 会根据当前语言生成 /products（英文）或 /zh-HK/products（繁体）
const localePath = useLocalePath()

// useRoute()：获取当前路由信息的组合式函数
const route = useRoute()

// useNuxtApp()：获取 Nuxt 应用实例的组合式函数
// 用于访问 Nuxt 提供的全局工具和插件
const nuxtApp = useNuxtApp()

// 从 Nuxt 应用实例中获取 GSAP 和 ScrollTrigger
// (nuxtApp as any)：TypeScript 类型断言，因为 GSAP 不在默认类型中
// $gsap：全局 GSAP 实例
// $ScrollTrigger：ScrollTrigger 插件实例
const { $gsap, $ScrollTrigger } = nuxtApp as any

// ====================================================================================
// 数据获取：最新新闻
// ====================================================================================
// useLazyFetch()：Nuxt 提供的懒加载 fetch 函数
// 与 useFetch 的区别：
// - useFetch：阻塞导航，等待数据加载完成后再显示页面
// - useLazyFetch：不阻塞导航，先显示页面，数据在后台加载
//
// 为什么使用 useLazyFetch？
// - 提升用户体验：页面立即显示，不需要等待新闻数据加载
// - 展示加载动画：可以显示骨架屏（NewsSkeleton）
// - 提升首次加载速度：减少关键资源加载时间
//
// <Post[]>：TypeScript 泛型，指定返回数据的类型
const { data: latestPosts, pending: pendingNews } = useLazyFetch<Post[]>('/api/news/public', {
  // 查询参数：限制返回 3 篇文章
  query: { limit: 3 },

  // 默认值：空数组
  default: () => [],

  // server: false：仅在客户端获取数据
  // 为什么设置为 false？
  // 1. 首页的新闻不是关键内容，可以客户端加载
  // 2. 避免服务端渲染时的 hydration mismatch
  // 3. 展示加载动画，提升用户体验
  server: false,
})

// ====================================================================================
// 监听新闻数据加载并播放进场动画
// ====================================================================================
// watch()：Vue 的响应式监听函数
// 第一个参数：[latestPosts, pendingNews] - 监听多个响应式数据
// 第二个参数：回调函数 - 当监听的数据变化时执行
//
// 回调函数参数：
// - newPosts：最新的新闻数据（latestPosts 的值）
// - isPending：是否正在加载（pendingNews 的值）
watch([latestPosts, pendingNews], ([newPosts, isPending]) => {
  // 数据加载完成且有文章数据时触发动画
  // !isPending：不再加载中
  // newPosts && newPosts.length > 0：有数据且数据不为空
  // process.client：仅在客户端执行（GSAP 只能在浏览器运行）
  if (!isPending && newPosts && newPosts.length > 0 && process.client) {
    // nextTick()：等待 DOM 更新后再执行
    // 为什么需要 nextTick？
    // - 数据变化后，Vue 需要时间更新 DOM
    // - GSAP 动画需要操作 DOM 元素，必须等待 DOM 更新完成
    nextTick(() => {
      // 检查 GSAP 和 ScrollTrigger 是否可用
      if (!$gsap || !$ScrollTrigger) return

      // 选择所有新闻卡片元素
      const cards = document.querySelectorAll('.news-card-item')
      if (cards.length > 0) {
        // ScrollTrigger.batch()：批量处理多个元素的滚动触发
        // 优势：
        // - 性能更好：一次性为多个元素创建 ScrollTrigger
        // - 交错动画：使用 stagger 实现依次显示的效果
        $ScrollTrigger.batch(cards, {
          // onEnter：元素进入视口时触发
          // batch：进入视口的元素集合
          onEnter: (batch: any) => {
            // GSAP.to()：创建补间动画
            // batch：目标元素
            $gsap.to(batch, {
              opacity: 1, // 透明度从 0 变为 1（显示）
              y: 0, // Y 轴位置从 translate-y-8 变为 0（向上移动）
              stagger: 0.15, // 交错动画：每个元素延迟 0.15 秒
              duration: 0.8, // 动画持续 0.8 秒
              ease: 'power3.out', // 缓动函数：power3.out（平滑减速）
              overwrite: 'auto', // 自动覆盖：如果有冲突，自动处理
            })
          },

          // start：触发位置
          // 'top 85%'：当元素顶部到达视口 85% 位置时触发
          start: 'top 85%',

          // once：true 表示只触发一次
          once: true,
        })

        // 重新刷新 ScrollTrigger
        // 为什么要刷新？
        // - 新增元素后，ScrollTrigger 需要重新计算位置
        // - 确保其他动画的触发位置正确
        $ScrollTrigger.refresh()
      }
    })
  }
})

// ====================================================================================
// SEO：Canonical URL
// ====================================================================================
// baseUrl：网站基础 URL
const baseUrl = 'https://www.supercore.hk'

// canonicalUrl：Canonical 链接（规范链接）
// computed()：计算属性，自动响应数据变化
const canonicalUrl = computed(() => {
  // locale.value === 'en'：如果是英文
  return locale.value === 'en'
    ? `${baseUrl}${route.path}` // 英文：https://www.supercore.hk/
    : `${baseUrl}/${locale.value}${route.path}` // 其他语言：https://www.supercore.hk/zh-HK/
})

// ====================================================================================
// SEO：结构化数据（JSON-LD）
// ====================================================================================
// 生成首页面包屑导航的结构化数据
// useBreadcrumbStructuredData()：自定义组合式函数，生成面包屑数据
const breadcrumbStructuredData = useBreadcrumbStructuredData([{ name: 'Home', url: '/' }])

// useHead()：动态设置 HTML head 标签
// 用于 SEO 优化（meta 标签、title、canonical link、结构化数据等）
useHead({
  // title：页面标题
  title: '首页 - 超核技術有限公司',

  // link：外部链接
  link: [
    {
      // rel：关系类型
      rel: 'canonical',
      // href：链接地址
      href: canonicalUrl,
    },
  ],

  // script：脚本标签
  script: [
    {
      // type：MIME 类型
      type: 'application/ld+json',
      // innerHTML：脚本内容（JSON-LD 结构化数据）
      innerHTML: JSON.stringify(breadcrumbStructuredData),
    },
  ],
})

// ====================================================================================
// 设备检测
// ====================================================================================
// useDeviceDetection()：自定义组合式函数，检测设备性能
// - deviceInfo：设备信息（操作系统、浏览器、性能等级等）
// - canUseAdvanced3D：函数，判断设备是否可以运行高级 3D 效果
const { deviceInfo, canUseAdvanced3D } = useDeviceDetection()

// canUse3D：响应式变量，存储是否启用 3D
const canUse3D = ref(false)

// ====================================================================================
// 动画系统
// ====================================================================================
// serverSceneRef：3D 场景组件的引用
// 用于调用组件方法（如 setAnimationPhase）
const serverSceneRef = ref()

// animationPhase：当前动画阶段
// 0: 淡入, 1: 机柜打开, 2: 组件爆炸, 3: 重新组装
const animationPhase = ref(0)

// ====================================================================================
// 组件挂载生命周期
// ====================================================================================
// onMounted()：Vue 生命周期钩子，组件挂载到 DOM 后执行
// 这在客户端和服务端渲染（SSR）时都会执行
onMounted(() => {
  // 检测设备并决定是否启用 3D
  canUse3D.value = canUseAdvanced3D()

  // 确保在客户端执行且可以使用 3D
  // process.client：Nuxt 提供的环境变量，判断是否在客户端
  if (process.client) {
    // 如果设备支持 3D
    if (canUse3D.value) {
      // 等待下一个 tick，确保组件已挂载
      // nextTick：Vue 提供的函数，等待 DOM 更新
      // 为什么需要嵌套 nextTick？
      // - ClientOnly 组件也需要时间渲染
      // - 需要确保 ServerScene 组件已经挂载
      nextTick(() => {
        // 再等待一个 tick 以确保 ClientOnly 内的组件已经渲染
        nextTick(() => {
          // 初始化滚动动画
          initScrollAnimation()
        })
      })
    }

    // 初始化其他 GSAP 动画（不需要 3D 也可以运行）
    nextTick(() => {
      initGsapAnimations()
    })
  }
})

// ====================================================================================
// GSAP 动画初始化
// ====================================================================================
// initGsapAnimations()：初始化不需要 3D 的 GSAP 动画
// 这些动画在所有设备上都可以运行
const initGsapAnimations = () => {
  // 检查 GSAP 和 ScrollTrigger 是否可用
  if (!$gsap || !$ScrollTrigger) return

  // 1. 特性项（Features）交错显示动画
  // 选择所有特性项元素
  const featureItems = document.querySelectorAll('.feature-item')
  if (featureItems.length) {
    // 遍历每个特性项
    featureItems.forEach((item, index) => {
      // 创建时间轴（Timeline）
      // gsap.timeline()：用于创建可以按顺序播放的动画序列
      const tl = $gsap.timeline({
        // scrollTrigger：滚动触发器
        scrollTrigger: {
          trigger: item, // 触发元素：当前特性项
          start: 'top 85%', // 触发位置：元素顶部到达视口 85% 处
        },
      })

      // 分隔线展开动画
      // item.querySelectorAll('.swiss-separator')：选择当前项的分隔线
      tl.to(item.querySelectorAll('.swiss-separator'), {
        duration: 0.8, // 动画持续 0.8 秒
        scaleX: 1, // X 轴缩放从 0 变为 1（展开效果）
        ease: 'power3.out', // 缓动函数：power3.out（平滑减速）
      })

      // 编号淡入动画
      // item.querySelector('.swiss-feature-number')：选择当前项的编号
      $gsap.from(item.querySelector('.swiss-feature-number'), {
        scrollTrigger: {
          trigger: item, // 触发元素：当前特性项
          start: 'top 90%', // 触发位置：元素顶部到达视口 90% 处
        },
        opacity: 0, // 透明度从 0 开始
        x: -20, // X 轴位置从 -20 开始（从左侧进入）
        duration: 1, // 动画持续 1 秒
        ease: 'power2.out', // 缓动函数：power2.out（较平滑减速）
      })
    })
  }

  // 3. 通用显示动画
  // ScrollTrigger.batch()：批量处理所有带有 .reveal-section 类的元素
  $ScrollTrigger.batch('.reveal-section', {
    // onEnter：元素进入视口时触发
    onEnter: (batch: any) => {
      // GSAP.from()：从指定状态开始动画
      $gsap.from(batch, {
        opacity: 0, // 透明度从 0 开始
        y: 30, // Y 轴位置从 30 开始（从下方进入）
        duration: 1, // 动画持续 1 秒
        ease: 'power2.out', // 缓动函数：power2.out（较平滑减速）
      })
    },
    // start：触发位置：元素顶部到达视口 85% 处
    start: 'top 85%',
  })
}

// ====================================================================================
// 3D 滚动动画初始化
// ====================================================================================
// initScrollAnimation()：初始化 3D 场景的滚动动画
// 仅在桌面端运行（canUse3D.value 为 true）
const initScrollAnimation = () => {
  // 检查 GSAP 和 ScrollTrigger 是否可用
  if (!$gsap || !$ScrollTrigger) {
    console.warn('GSAP or ScrollTrigger not available')
    return
  }

  // 仅在桌面端启用滚动动画
  if (!canUse3D.value) {
    return
  }

  try {
    // 创建滚动时间轴
    // 使用 gsap.timeline() 而不是 ScrollTrigger.timeline()
    // 区别：
    // - gsap.timeline()：普通时间轴，可以包含多个动画
    // - ScrollTrigger.timeline()：专门用于滚动触发的时间轴（已废弃）
    const timeline = $gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-section', // 触发元素：Hero Section
        start: 'top top', // 开始位置：Hero Section 顶部到达视口顶部
        end: 'bottom top', // 结束位置：Hero Section 底部到达视口顶部
        scrub: 1, // scrub: 1 表示动画跟随滚动，平滑延迟 1 秒
        // scrub: true 表示立即跟随滚动
        // onUpdate：动画更新时的回调
        onUpdate: (self: any) => {
          // self.progress：滚动进度（0 到 1）
          const progress = self.progress
          // 更新动画阶段
          updateAnimationPhase(progress)
        },
      },
    })

    // 阶段 1: 淡入（0-20%）
    // timeline.to({}, { duration: 20 })：创建一个占位动画，用于标记阶段
    // 这里的动画不实际执行任何效果，只是用来分段
    timeline.to({}, { duration: 20 })

    // 阶段 2: 机柜打开（20-50%）
    timeline.to({}, { duration: 30 })

    // 阶段 3: 组件爆炸（50-80%）
    timeline.to({}, { duration: 30 })

    // 阶段 4: 重新组装（80-100%）
    timeline.to({}, { duration: 20 })
  } catch (error) {
    console.error('Failed to initialize scroll animation:', error)
  }
}

// ====================================================================================
// 更新动画阶段
// ====================================================================================
// updateAnimationPhase()：根据滚动进度更新 3D 场景动画阶段
// progress：滚动进度（0 到 1）
const updateAnimationPhase = (progress: number) => {
  // 如果 3D 场景未初始化，则返回
  if (!serverSceneRef.value) return

  let phase = 0 // 当前阶段
  let phaseProgress = 0 // 当前阶段内的进度（0 到 1）

  // 根据总进度计算当前阶段和阶段内进度
  if (progress < 0.2) {
    // 阶段 1: 淡入（0% - 20%）
    phase = 0
    phaseProgress = progress / 0.2
  } else if (progress < 0.5) {
    // 阶段 2: 机柜打开（20% - 50%）
    phase = 1
    // (progress - 0.2) / 0.3：减去前面阶段，除以当前阶段长度
    phaseProgress = (progress - 0.2) / 0.3
  } else if (progress < 0.8) {
    // 阶段 3: 组件爆炸（50% - 80%）
    phase = 2
    phaseProgress = (progress - 0.5) / 0.3
  } else {
    // 阶段 4: 重新组装（80% - 100%）
    phase = 3
    phaseProgress = (progress - 0.8) / 0.2
  }

  // 更新当前阶段
  animationPhase.value = phase

  // 更新 3D 场景
  // serverSceneRef.value.setAnimationPhase()：调用 ServerScene 组件的方法
  // phase：当前阶段（0, 1, 2, 3）
  // phaseProgress：当前阶段内的进度（0 到 1）
  serverSceneRef.value.setAnimationPhase(phase, phaseProgress)
}

// ====================================================================================
// 组件卸载生命周期
// ====================================================================================
// onUnmounted()：Vue 生命周期钩子，组件卸载前执行
// 用于清理资源，避免内存泄漏
onUnmounted(() => {
  // 清理 ScrollTrigger
  // 仅在客户端执行
  if (process.client) {
    // 检查 ScrollTrigger 是否存在
    if ($ScrollTrigger) {
      // 获取所有 ScrollTrigger 实例并销毁
      // trigger.kill()：停止并删除 ScrollTrigger
      $ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }
})
</script>
