<!--
# 产品详情页面 (Product Detail Page)

## 文件作用
这是超核技術有限公司网站的产品详情页面，用于展示单个产品的详细信息。

## 路由模式
- **路由路径**: `/products/[slug]` (动态路由，slug 为产品 URL 标识符）
- **示例**: `/products/supercore-g2-server`

## 核心功能
1. 返回产品集合链接
2. 加载产品详情数据（异步）
3. 显示产品图片画廊（支持多图切换）
4. 图片导航控制（上一张、下一张、直接跳转）
5. 键盘导航支持（左右箭头键）
6. 显示产品信息（名称、描述、型号、类别）
7. 显示产品规格表格
8. 获取报价按钮（跳转到联系页面）
9. SEO 结构化数据（Product、BreadcrumbList）
10. 错误处理（产品未找到）

## 技术栈
- Nuxt 3 (Vue 3)
- Tailwind CSS
- i18n 国际化
- NuxtImg (图片优化)
- Composables (useRoute, useLocalePath, useI18n)

## 依赖组件
- GridContainer: 瑞士网格容器
- TypographyHeader: 瑞士风格标题
- SwissButton: 瑞士风格按钮
- SwissTextReveal: 瑞士风格文字揭示动画
- ProductDetailSkeleton: 产品详情骨架屏
- SpecTable: 规格表格
- NuxtImg: Nuxt 3 图片优化组件

## 性能优化
- useLazyFetch: 延迟加载产品数据
- 图片预加载: 首张图片使用 preload
- 图片优化: WebP 格式、懒加载、CDN 优化
- 骨架屏: 提前显示 UI 结构
- 响应式图片: 根据设备尺寸生成不同尺寸

## SEO 最佳实践
- 唯一的页面标题
- Canonical URL
- JSON-LD 结构化数据 (Product, BreadcrumbList)
- 语义化 HTML
- Alt 文本支持
- 多语言支持

## 可访问性
- aria-label: 为按钮提供描述性标签
- aria-hidden: 隐藏装饰性元素
- 键盘导航: 支持左右箭头键
- 焦点管理: 按钮可聚焦
- 屏幕阅读器友好
- 对比度符合 WCAG 标准
-->
<template>
  <!-- 网站最小高度设置为全屏高度，背景色为白色 -->
  <div class="min-h-screen bg-white">
    <!-- 返回导航区域：包含"返回集合"链接 -->
    <!-- pt-24：顶部留出空间给导航栏 -->
    <!-- border-b border-gray-100：底部添加浅灰色的瑞士风格分割线 -->
    <div class="pt-24 border-b border-gray-100">
      <!-- 使用瑞士网格系统容器 -->
      <GridContainer>
        <!-- 全宽内容区域 -->
        <div class="col-span-12 py-4">
          <!-- NuxtLink: Nuxt 3 的路由链接组件，自动支持国际化 -->
          <!-- :to="localePath('/products')"：使用 localePath 生成带语言前缀的路径 -->
          <!-- class：瑞士风格链接样式 -->
          <!--   - inline-flex items-center：内联弹性布局，垂直居中 -->
          <!--   - text-[10px]：极小字体（10px） -->
          <!--   - font-bold：字重加粗 -->
          <!--   - tracking-[0.3em]：字母间距加宽（瑞士设计特征） -->
          <!--   - uppercase：全大写 -->
          <!--   - text-swiss-text/40：半透明文本颜色（40% 不透明度） -->
          <!--   - hover:text-swiss-text：悬停时完全不透明 -->
          <!--   - transition-colors：平滑颜色过渡 -->
          <!-- aria-label：无障碍标签，屏幕阅读器使用 -->
          <NuxtLink
            :to="localePath('/products')"
            class="inline-flex items-center text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text/40 hover:text-swiss-text transition-colors"
            aria-label="Back to products collection"
          >
            <!-- 左箭头图标，aria-hidden="true"：屏幕阅读器忽略纯装饰元素 -->
            <span class="mr-4" aria-hidden="true">←</span>
            Back to Collection
          </NuxtLink>
        </div>
      </GridContainer>
    </div>

    <!-- 主内容区域：使用瑞士网格系统 -->
    <!-- :grid="true"：启用网格布局 -->
    <!-- gap="none"：不使用内边距，由子元素自己控制间距 -->
    <!-- border-l border-gray-100：添加左侧的瑞士风格网格线 -->
    <GridContainer :grid="true" gap="none" class="border-l border-gray-100">
      <!-- 加载状态：显示产品详情骨架屏 -->
      <!-- v-if="pending"：当数据正在加载时显示 -->
      <!-- class="col-span-12"：占据 12 列（全宽） -->
      <div v-if="pending" class="col-span-12 border-r border-b border-gray-100">
        <!-- ProductDetailSkeleton：产品详情骨架屏组件 -->
        <!-- 占位符，提供加载时的视觉反馈 -->
        <ProductDetailSkeleton />
      </div>

      <!-- 产品未找到：显示 404 错误信息 -->
      <!-- v-else-if="!product"：当产品数据不存在时显示 -->
      <div
        v-else-if="!product"
        class="col-span-12 text-center py-48 border-r border-b border-gray-100"
      >
        <!-- 错误标题：显示 404_NOT_FOUND -->
        <TypographyHeader :level="2" size="h2" class="mb-8"> 404_NOT_FOUND </TypographyHeader>
        <!-- 返回按钮：点击跳转到产品列表页 -->
        <!-- variant="primary"：使用主要按钮样式 -->
        <!-- @click="navigateTo(localePath('/products'))"：点击时导航到产品列表 -->
        <SwissButton variant="primary" @click="navigateTo(localePath('/products'))">
          RETURN_TO_COLLECTION
        </SwissButton>
      </div>

      <!-- 产品详情内容：当产品数据加载成功时显示 -->
      <template v-else>
        <!-- 产品图片区域（左侧） -->
        <!-- class 布局说明： -->
        <!--   - col-span-12：移动端全宽 -->
        <!--   - lg:col-span-7：桌面端占据 7 列（左侧 58.3%） -->
        <!--   - border-r border-b border-gray-100：右侧和底部添加网格线 -->
        <!--   - bg-swiss-bg-soft：瑞士风格浅色背景 -->
        <!--   - relative：相对定位（用于绝对定位子元素） -->
        <!--   - flex flex-col items-stretch：弹性列布局，子元素拉伸 -->
        <!--   - overflow-visible：允许内容溢出（用于图片） -->
        <div
          class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 bg-swiss-bg-soft relative flex flex-col items-stretch overflow-visible"
        >
          <!-- 技术网格背景装饰 -->
          <!-- absolute inset-0：绝对定位，占据整个父容器 -->
          <!-- opacity-[0.03]：极低不透明度（3%） -->
          <!-- pointer-events-none：禁用鼠标事件，不影响交互 -->
          <!-- style：内联样式，使用 CSS 渐变创建点状网格背景 -->
          <!--   - radial-gradient：径向渐变 -->
          <!--   - circle, #000 1px, transparent 1px：黑色圆点 1px，其余透明 -->
          <!--   - background-size: 32px 32px：网格大小 32x32 像素 -->
          <div
            class="absolute inset-0 opacity-[0.03] pointer-events-none"
            style="
              background-image: radial-gradient(circle, #000 1px, transparent 1px);
              background-size: 32px 32px;
            "
          ></div>

          <!-- 技术水印 / 填充空白区域 -->
          <!-- absolute：绝对定位 -->
          <!-- bottom-16 left-16：距离底部和左侧各 16 单位 -->
          <!-- select-none：禁用文本选择 -->
          <!-- pointer-events-none：禁用鼠标事件 -->
          <!-- opacity-[0.02]：极低不透明度（2%） -->
          <div class="absolute bottom-16 left-16 select-none pointer-events-none opacity-[0.02]">
            <!-- 水印文本 -->
            <!-- text-[8vw]：视口单位字体大小（响应式） -->
            <!-- font-black：最粗字重 -->
            <!-- tracking-tighter：紧凑字母间距 -->
            <!-- uppercase：全大写 -->
            <!-- leading-none：行高 1 -->
            <span
              class="text-[8vw] font-black tracking-tighter uppercase leading-none text-swiss-text"
            >
              Blueprint / {{ product.slug }}
            </span>
          </div>

          <!-- 图片容器 -->
          <!-- relative：相对定位 -->
          <!-- flex-1：占据剩余空间 -->
          <!-- min-h-[400px] lg:min-h-[600px]：最小高度（移动端 400px，桌面端 600px） -->
          <!-- p-8 md:p-16 lg:p-20：内边距（响应式） -->
          <!-- flex items-center justify-center：内容居中对齐 -->
          <div
            class="relative flex-1 min-h-[400px] lg:min-h-[600px] p-8 md:p-16 lg:p-20 flex items-center justify-center"
          >
            <!-- 产品图片区域 -->
            <!-- v-if：条件渲染，当产品有图片时显示 -->
            <!-- relative：相对定位 -->
            <div v-if="product && product.images && product.images.length > 0" class="relative">
              <!-- NuxtImg: Nuxt 3 的优化图片组件 -->
              <!-- 优势：自动 WebP 转换、懒加载、响应式图片、CDN 优化 -->
              <!-- v-if="currentImage"：有当前图片时渲染 -->
              <!-- ref="mainImageRef"：引用 DOM 元素，用于检测加载状态 -->
              <!-- :src="currentImage"：图片源 URL -->
              <!-- :alt：替代文本（用于 SEO 和无障碍），支持多语言回退 -->
              <!--   - product.name[locale]：当前语言 -->
              <!--   - product.name['zh-HK']：繁体中文回退 -->
              <!--   - product.name.en：英文回退 -->
              <!-- width="1600" height="900"：原始尺寸（用于生成响应式图片） -->
              <!-- format="webp"：输出 WebP 格式（更小文件） -->
              <!-- quality="90"：图片质量（90% 高质量） -->
              <!-- loading="eager"：立即加载（非懒加载，因为是首屏内容） -->
              <!-- :key="currentImageIndex"：key 变化时重新渲染图片 -->
              <!-- :preload="currentImageIndex === 0"：首张图片预加载 -->
              <!-- sizes：响应式图片尺寸断点 -->
              <!--   - xs:100vw sm:100vw：小屏设备全宽 -->
              <!--   - md:70vw lg:70vw：中到大屏设备占 70% -->
              <!-- @load="handleImageLoad"：加载完成回调 -->
              <!-- @error="handleImageLoad"：加载失败回调 -->
              <!-- class：样式类 -->
              <!--   - max-w-full max-h-full：最大宽度和高度为容器大小 -->
              <!--   - object-contain：保持宽高比 -->
              <!--   - transition-all duration-700 ease-in-out：平滑过渡 -->
              <!-- :class="imageLoaded ? 'opacity-100' : 'opacity-0'"：加载完成后渐变显示 -->
              <NuxtImg
                v-if="currentImage"
                ref="mainImageRef"
                :src="currentImage"
                :alt="product.name[locale] || product.name['zh-HK'] || product.name.en"
                width="1600"
                height="900"
                format="webp"
                quality="90"
                loading="eager"
                :key="currentImageIndex"
                :preload="currentImageIndex === 0"
                sizes="xs:100vw sm:100vw md:70vw lg:70vw"
                @load="handleImageLoad"
                @error="handleImageLoad"
                class="max-w-full max-h-full object-contain transition-all duration-700 ease-in-out"
                :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
              />
            </div>

            <!-- 无图片占位符：当产品没有图片时显示 -->
            <!-- absolute inset-0：绝对定位，占据整个容器 -->
            <!-- flex items-center justify-center：内容居中 -->
            <!-- opacity-10：10% 不透明度 -->
            <div v-else class="absolute inset-0 flex items-center justify-center opacity-10">
              <!-- SVG 图标：占位图形 -->
              <!-- viewBox="0 0 24 24"：SVG 视口 -->
              <!-- class="w-24 h-24"：24 单位宽高 -->
              <!-- fill="none"：无填充 -->
              <!-- stroke="currentColor"：使用当前文本颜色作为描边 -->
              <!-- stroke-width="0.5"：描边宽度 0.5 -->
              <svg
                viewBox="0 0 24 24"
                class="w-24 h-24"
                fill="none"
                stroke="currentColor"
                stroke-width="0.5"
              >
                <!-- 矩形：代表图片框 -->
                <rect x="2" y="2" width="20" height="20" />
                <!-- 两条对角线：代表缺失的图片 -->
                <path d="M2 2l20 20M22 2L2 22" />
              </svg>
            </div>

            <!-- 图片导航控制按钮（上一张/下一张） -->
            <!-- template：Vue 模板包裹标签，不渲染 DOM -->
            <!-- v-if：只有当产品有多张图片时才显示 -->
            <template v-if="product && product.images && product.images.length > 1">
              <!-- 上一张图片按钮 -->
              <!-- @click="previousImage"：点击调用上一张函数 -->
              <!-- class：样式 -->
              <!--   - absolute left-0 top-0 bottom-0：左侧，垂直拉伸 -->
              <!--   - w-16 md:w-20 lg:w-24：宽度响应式 -->
              <!--   - flex items-center justify-center：内容居中 -->
              <!--   - bg-transparent：透明背景 -->
              <!--   - group/btn：按钮组，用于 hover 效果 -->
              <!--   - z-10：高层级 -->
              <!-- aria-label="Previous image"：无障碍标签 -->
              <button
                @click="previousImage"
                class="absolute left-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 flex items-center justify-center bg-transparent group/btn z-10"
                aria-label="Previous image"
              >
                <!-- 按钮图标容器 -->
                <!-- w-11 h-11：11 单位宽高 -->
                <!-- flex items-center justify-center：内容居中 -->
                <!-- bg-white/80：白色背景，80% 不透明度 -->
                <!-- backdrop-blur-sm：背景模糊效果 -->
                <!-- border border-swiss-text/5：极淡边框（5% 不透明度） -->
                <!-- group-hover/btn:border-swiss-text：悬停时边框完全不透明 -->
                <!-- transition-all duration-300：平滑过渡 -->
                <!-- shadow-sm：轻微阴影 -->
                <div
                  class="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-swiss-text/5 group-hover/btn:border-swiss-text transition-all duration-300 shadow-sm"
                >
                  <!-- 左箭头 SVG 图标 -->
                  <!-- viewBox="0 0 24 24"：24x24 坐标系 -->
                  <!-- w-5 h-5：5 单位宽高 -->
                  <!-- text-swiss-text/40：40% 不透明度 -->
                  <!-- group-hover/btn:text-swiss-text：悬停时完全不透明 -->
                  <!-- transition-colors：平滑颜色过渡 -->
                  <!-- fill="none"：无填充 -->
                  <!-- stroke="currentColor"：描边使用当前颜色 -->
                  <!-- stroke-width="1.5"：描边宽度 1.5 -->
                  <svg
                    viewBox="0 0 24 24"
                    class="w-5 h-5 text-swiss-text/40 group-hover/btn:text-swiss-text transition-colors"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <!-- 路径：左箭头形状 -->
                    <!-- d="M15 18l-6-6 6-6"：从 (15,18) 到 (9,12) 到 (15,6) -->
                    <!-- stroke-linecap="round"：圆角线端 -->
                    <!-- stroke-linejoin="round"：圆角连接 -->
                    <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </button>
              <!-- 下一张图片按钮 -->
              <!-- @click="nextImage"：点击调用下一张函数 -->
              <!-- absolute right-0：右侧定位 -->
              <button
                @click="nextImage"
                class="absolute right-0 top-0 bottom-0 w-16 md:w-20 lg:w-24 flex items-center justify-center bg-transparent group/btn z-10"
                aria-label="Next image"
              >
                <!-- 按钮图标容器 -->
                <div
                  class="w-11 h-11 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-swiss-text/5 group-hover/btn:border-swiss-text transition-all duration-300 shadow-sm"
                >
                  <!-- 右箭头 SVG 图标 -->
                  <!-- d="M9 18l6-6-6-6"：从 (9,18) 到 (15,12) 到 (9,6) -->
                  <svg
                    viewBox="0 0 24 24"
                    class="w-5 h-5 text-swiss-text/40 group-hover/btn:text-swiss-text transition-colors"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </button>
            </template>
          </div>

          <!-- 底部画廊信息栏：显示图片进度指示器 -->
          <!-- v-if：只有当产品有多张图片时才显示 -->
          <!-- border-t border-swiss-text/5：顶部添加极淡边框 -->
          <!-- p-6：内边距 6 单位 -->
          <!-- flex items-center justify-between：两端对齐 -->
          <div
            v-if="product.images && product.images.length > 1"
            class="border-t border-swiss-text/5 p-6 flex items-center justify-between"
          >
            <!-- 图片进度指示器（左侧） -->
            <div class="flex items-center gap-1.5">
              <!-- 循环渲染每个图片的指示点 -->
              <!-- v-for：遍历 product.images 数组 -->
              <!-- :key="index"：使用索引作为 key -->
              <!-- @click="setCurrentImage(index)"：点击切换到对应图片 -->
              <!-- class：样式 -->
              <!--   - h-1：高度 1 单位 -->
              <!--   - transition-all duration-500 ease-out：平滑过渡 -->
              <!-- :class：动态类名 -->
              <!--   - currentImageIndex === index ? 'w-12 bg-swiss-text'：当前图片宽度 12 单位，实色 -->
              <!--   - 'w-4 bg-swiss-text/10 hover:bg-swiss-text/30'：非当前图片宽度 4 单位，淡色，悬停变深 -->
              <button
                v-for="(img, index) in product.images"
                :key="index"
                @click="setCurrentImage(index)"
                class="h-1 transition-all duration-500 ease-out"
                :class="
                  currentImageIndex === index
                    ? 'w-12 bg-swiss-text'
                    : 'w-4 bg-swiss-text/10 hover:bg-swiss-text/30'
                "
                :aria-label="`View image ${index + 1}`"
              />
            </div>
            <!-- 图片编号显示（右侧） -->
            <!-- font-mono：等宽字体 -->
            <!-- text-[10px]：极小字体 -->
            <!-- uppercase：全大写 -->
            <!-- tracking-widest：最大字母间距 -->
            <!-- text-swiss-text/40：40% 不透明度 -->
            <div class="font-mono text-[10px] uppercase tracking-widest text-swiss-text/40">
              <!-- FRAME_：前缀 -->
              <!-- String(...).padStart(2, '0')：数字补零，例如 1 → 01，12 → 12 -->
              FRAME_{{ String(currentImageIndex + 1).padStart(2, '0') }} /
              {{ String(product.images.length).padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- 产品信息区域（右侧） -->
        <!-- col-span-12 lg:col-span-5：移动端全宽，桌面端占 5 列 -->
        <!-- border-r border-b border-gray-100：右侧和底部网格线 -->
        <!-- p-8 md:p-12 lg:p-16：内边距响应式 -->
        <!-- flex flex-col justify-between：弹性列布局，内容两端对齐 -->
        <!-- h-full：高度 100% -->
        <!-- bg-white：白色背景 -->
        <div
          class="col-span-12 lg:col-span-5 border-r border-b border-gray-100 p-8 md:p-12 lg:p-16 flex flex-col justify-between h-full bg-white"
        >
          <!-- 产品信息内容区域 -->
          <!-- space-y-8：子元素之间间距 8 单位 -->
          <div class="space-y-8">
            <!-- 技术规范标签 -->
            <!-- SwissTextReveal：瑞士风格文字揭示动画组件 -->
            <!-- tag="div"：渲染为 div 元素 -->
            <!-- :delay="100"：延迟 100ms 执行动画 -->
            <SwissTextReveal tag="div" :delay="100">
              <div
                class="inline-block text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/30 font-mono"
              >
                <!-- 技术规范标签文本 -->
                <!-- inline-block：内联块元素 -->
                <!-- text-[10px]：极小字体 -->
                <!-- font-bold：字重加粗 -->
                <!-- tracking-[0.4em]：字母间距加宽（瑞士设计特征） -->
                <!-- uppercase：全大写 -->
                <!-- text-swiss-text/30：30% 不透明度 -->
                <!-- font-mono：等宽字体 -->
                TECHNICAL_SPEC // 01
              </div>
            </SwissTextReveal>

            <!-- 产品名称 -->
            <!-- SwissTextReveal：文字揭示动画 -->
            <!-- :delay="200"：延迟 200ms 执行动画 -->
            <SwissTextReveal tag="div" :delay="200">
              <!-- TypographyHeader：瑞士风格标题组件 -->
              <!-- level="1"：语义化级别，对应 h1 -->
              <!-- size="h1"：视觉尺寸为 h1 -->
              <!-- class="!mb-4 !tracking-tighter"：底部边距 4，紧凑字母间距（! 优先级提升） -->
              <TypographyHeader :level="1" size="h1" class="!mb-4 !tracking-tighter">
                <!-- 多语言名称显示 -->
                <!-- 优先级：当前语言 > 繁体中文 > 英文 -->
                {{ product.name[locale] || product.name['zh-HK'] || product.name.en }}
              </TypographyHeader>
            </SwissTextReveal>

            <!-- 产品描述 -->
            <!-- SwissTextReveal：文字揭示动画 -->
            <!-- :delay="300"：延迟 300ms 执行动画 -->
            <SwissTextReveal tag="div" :delay="300">
              <!-- 描述文本 -->
              <!-- text-swiss-text-muted：次级文本颜色 -->
              <!-- text-lg：大号字体 -->
              <!-- leading-relaxed：宽松行高 -->
              <!-- font-medium：中等字重 -->
              <p class="text-swiss-text-muted text-lg leading-relaxed font-medium">
                <!-- 多语言描述显示 -->
                <!-- 优先级：当前语言 > 繁体中文 > 英文 -->
                {{
                  product.description[locale] ||
                  product.description['zh-HK'] ||
                  product.description.en
                }}
              </p>
            </SwissTextReveal>

            <!-- 产品元数据列表 -->
            <!-- border-t border-swiss-text/5：顶部极淡边框 -->
            <!-- pt-10 space-y-8：内边距 10，子元素间距 8 -->
            <div class="border-t border-swiss-text/5 pt-10 space-y-8">
              <!-- 产品型号（Model_Ref） -->
              <!-- SwissTextReveal：文字揭示动画 -->
              <!-- :delay="400"：延迟 400ms 执行动画 -->
              <SwissTextReveal tag="div" :delay="400">
                <!-- flex flex-col gap-1：弹性列布局，间距 1 -->
                <div class="flex flex-col gap-1">
                  <!-- 标签 -->
                  <!-- text-[10px]：极小字体 -->
                  <!-- font-bold：字重加粗 -->
                  <!-- tracking-[0.4em]：字母间距加宽 -->
                  <!-- uppercase：全大写 -->
                  <!-- text-swiss-text/20：20% 不透明度 -->
                  <!-- font-mono：等宽字体 -->
                  <span
                    class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/20 font-mono"
                    >Model_Ref</span
                  >
                  >
                  <!-- 值 -->
                  <!-- text-2xl md:text-3xl：响应式字体大小（2xl 到 3xl） -->
                  <!-- font-black：最粗字重 -->
                  <!-- tracking-tighter：紧凑字母间距 -->
                  <!-- text-swiss-text：主文本颜色 -->
                  <!-- uppercase：全大写 -->
                  <!-- leading-none：行高 1 -->
                  <span
                    class="text-2xl md:text-3xl font-black tracking-tighter text-swiss-text uppercase leading-none"
                    >{{ product.slug }}</span
                  >
                  >
                </div>
              </SwissTextReveal>

              <!-- 产品类别（Category_Id） -->
              <!-- SwissTextReveal：文字揭示动画 -->
              <!-- :delay="500"：延迟 500ms 执行动画 -->
              <SwissTextReveal tag="div" :delay="500">
                <!-- flex flex-col gap-1：弹性列布局，间距 1 -->
                <div class="flex flex-col gap-1">
                  <!-- 标签 -->
                  <span
                    class="text-[10px] font-bold tracking-[0.4em] uppercase text-swiss-text/20 font-mono"
                    >Category_Id</span
                  >
                  <!-- 值 -->
                  <!-- getCategoryLabel(product.category)：获取类别的中文标签 -->
                  <span
                    class="text-2xl md:text-3xl font-black tracking-tighter text-swiss-text uppercase leading-none"
                    >{{ getCategoryLabel(product.category) }}</span
                  >
                </div>
              </SwissTextReveal>
            </div>
          </div>

          <!-- 底部操作区域 -->
          <!-- pt-12 border-t border-gray-100：内边距 12，顶部边框 -->
          <!-- flex justify-between items-end：两端对齐，底部对齐 -->
          <div class="pt-12 border-t border-gray-100 flex justify-between items-end">
            <!-- 构建状态信息（左侧） -->
            <!-- flex flex-col gap-2：弹性列布局，间距 2 -->
            <div class="flex flex-col gap-2">
              <!-- 状态文本 -->
              <!-- text-[10px]：极小字体 -->
              <!-- font-bold：字重加粗 -->
              <!-- tracking-widest：最大字母间距 -->
              <!-- uppercase：全大写 -->
              <!-- text-swiss-text/40：40% 不透明度 -->
              <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text/40"
                >Build_Status: Online</span
              >
              >
              <!-- UUID 标识符 -->
              <!-- text-[10px]：极小字体 -->
              <!-- font-mono：等宽字体 -->
              <!-- opacity-20：20% 不透明度 -->
              <!-- uppercase tracking-tighter：全大写，紧凑字母间距 -->
              <!-- px-2 py-0.5：内边距 -->
              <!-- bg-gray-50 border border-gray-200：浅灰背景和边框 -->
              <span
                class="text-[10px] font-mono opacity-20 uppercase tracking-tighter px-2 py-0.5 bg-gray-50 border border-gray-200"
                >UUID: {{ product.id }}</span
              >
              >
            </div>
            <!-- 获取报价按钮（右侧） -->
            <!-- SwissButton：瑞士风格按钮组件 -->
            <!-- variant="primary"：主要按钮样式 -->
            <!-- size="lg"：大尺寸按钮 -->
            <!-- @click="navigateTo(localePath('/contact'))"：点击跳转到联系页面 -->
            <SwissButton variant="primary" size="lg" @click="navigateTo(localePath('/contact'))">
              GET_QUOTE
            </SwissButton>
          </div>

          <!-- 底部摘要信息 -->
          <!-- mt-20：顶部边距 20 单位 -->
          <!-- pt-10 border-t border-gray-100：内边距 10，顶部边框 -->
          <!-- flex justify-between items-center：两端对齐，垂直居中 -->
          <div class="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
            <!-- 状态文本（左侧） -->
            <span class="text-[10px] font-bold tracking-widest uppercase text-swiss-text/40"
              >Status: Available</span
            >
            <!-- UUID 标识符（右侧） -->
            <!-- text-[10px]：极小字体 -->
            <!-- font-mono：等宽字体 -->
            <!-- opacity-20：20% 不透明度 -->
            <span class="text-[10px] font-mono opacity-20">BUILD_UUID: {{ product.id }}</span>
          </div>
        </div>

        <!-- 详细规格表格区域（底部） -->
        <!-- col-span-12：占据 12 列（全宽） -->
        <!-- border-r border-b border-gray-100：右侧和底部网格线 -->
        <!-- p-12 md:p-20：内边距响应式 -->
        <!-- bg-white：白色背景 -->
        <div class="col-span-12 border-r border-b border-gray-100 p-12 md:p-20 bg-white">
          <!-- 内容容器 -->
          <!-- max-w-4xl：最大宽度 4xl（限制内容宽度，提升可读性） -->
          <div class="max-w-4xl">
            <!-- 规格表格标题 -->
            <!-- TypographyHeader：瑞士风格标题组件 -->
            <!-- level="2"：语义化级别，对应 h2 -->
            <!-- size="h3"：视觉尺寸为 h3 -->
            <!-- class="mb-12 !tracking-tighter uppercase"：底部边距 12，紧凑字母间距，全大写 -->
            <TypographyHeader :level="2" size="h3" class="mb-12 !tracking-tighter uppercase">
              <!-- 使用 i18n 国际化翻译键 -->
              {{ $t('products.specifications') }}
            </TypographyHeader>
            <!-- 规格表格组件 -->
            <!-- :specs="product.specs"：传递规格数据 -->
            <!-- class="!rounded-none border-t border-gray-100"：移除圆角，添加顶部边框 -->
            <SpecTable :specs="product.specs" class="!rounded-none border-t border-gray-100" />
          </div>
        </div>
      </template>
    </GridContainer>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：产品详情页面 (Product Detail Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的产品详情页面，用于展示单个产品的详细信息。
 *
 * 页面路由：/products/[slug]（动态路由，slug 为产品 URL 标识符）
 *
 * 实现手段：
 * 1. 动态路由 (Dynamic Routing)：使用 Nuxt 3 的动态路由 [slug] 匹配产品
 * 2. 懒加载 (Lazy Loading)：使用 useLazyFetch 异步加载产品数据，避免阻塞渲染
 * 3. 图片画廊 (Image Gallery)：支持多图片切换、导航、键盘控制
 * 4. 响应式图片 (Responsive Images)：使用 NuxtImg 组件自动生成响应式图片
 * 5. SEO 优化 (SEO Optimization)：
 *    - 使用 useHead 设置页面标题和元数据
 *    - 使用 canonical URL 防止重复内容
 *    - 使用 JSON-LD 结构化数据（Product 和 BreadcrumbList）
 * 6. 无障碍支持 (Accessibility)：aria 标签、键盘导航、屏幕阅读器友好
 * 7. 国际化 (i18n)：支持多语言（中文、英文）
 * 8. 瑞士设计风格 (Swiss Design)：网格布局、极简主义、功能主义
 * 9. 动画效果 (Animation)：SwissTextReveal 文字揭示动画
 * 10. 加载状态 (Loading State)：骨架屏、图片加载状态、错误处理
 *
 * 核心功能：
 * 1. 返回产品集合链接
 * 2. 加载产品详情数据（异步）
 * 3. 显示产品图片画廊（支持多图切换）
 * 4. 图片导航控制（上一张、下一张、直接跳转）
 * 5. 键盘导航支持（左右箭头键）
 * 6. 显示产品信息（名称、描述、型号、类别）
 * 7. 显示产品规格表格
 * 8. 获取报价按钮（跳转到联系页面）
 * 9. SEO 结构化数据（Product、BreadcrumbList）
 * 10. 错误处理（产品未找到）
 *
 * 瑞士设计特点：
 * - 网格系统 (Grid System)：12 列网格，响应式布局
 * - 大标题 (Display Typography)：font-black, tracking-tighter, uppercase
 * - 极简主义 (Minimalism)：简洁的 UI，突出产品内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 等宽字体 (Monospace)：用于技术标签和 UUID
 * - 分割线 (Grid Lines)：border-gray-100 形成瑞士风格网格
 * - 大量留白 (Whitespace)：充足的呼吸空间
 *
 * 性能优化：
 * - useLazyFetch：延迟加载产品数据，不阻塞初始渲染
 * - NuxtImg：自动图片优化（WebP、懒加载、CDN、响应式）
 * - 骨架屏：提前显示 UI 结构，减少感知加载时间
 * - 图片预加载：首张图片使用 preload，提升首屏性能
 * - 键盘导航：无需鼠标，提升可访问性
 *
 * 图片画廊功能：
 * 1. 多图片支持：自动检测产品图片数量
 * 2. 左右导航按钮：点击切换上一张/下一张
 * 3. 底部进度指示器：显示当前图片位置和总数
 * 4. 键盘控制：左右箭头键切换图片
 * 5. 图片加载状态：淡入效果，避免闪烁
 * 6. 图片尺寸自适应：object-contain 保持宽高比
 *
 * SEO 最佳实践：
 * 1. 唯一的页面标题（包含产品名称）
 * 2. Canonical URL：防止重复内容问题
 * 3. JSON-LD 结构化数据：
 *    - Product：产品信息（名称、描述、图片、品牌）
 *    - BreadcrumbList：面包屑导航（Home → Products → 产品名称）
 * 4. 语义化 HTML：使用正确的 HTML 标签
 * 5. Alt 文本：图片的替代文本，支持 SEO 和无障碍
 *
 * 可访问性 (Accessibility)：
 * - aria-label：为按钮提供描述性标签
 * - aria-hidden：隐藏装饰性元素（图标）
 * - 键盘导航：支持左右箭头键
 * - 焦点管理：按钮可聚焦
 * - 对比度：文本和背景对比度符合 WCAG 标准
 * - 屏幕阅读器：语义化 HTML 和 aria 标签
 *
 * 依赖组件：
 * - GridContainer：瑞士网格容器组件
 * - TypographyHeader：瑞士风格标题组件
 * - SwissButton：瑞士风格按钮组件
 * - SwissTextReveal：瑞士风格文字揭示动画组件
 * - ProductDetailSkeleton：产品详情骨架屏组件
 * - SpecTable：规格表格组件
 * - NuxtImg：Nuxt 3 图片优化组件
 *
 * 依赖 API：
 * - /api/products/[slug]：根据 slug 获取单个产品详情
 *
 * 依赖 Composables：
 * - useProductStructuredData：生成产品结构化数据
 * - useBreadcrumbStructuredData：生成面包屑结构化数据
 *
 * 依赖类型：
 * - Product：产品类型定义
 *
 * ============================================================================
 */

// 导入 Product 类型定义，用于类型检查和 TypeScript 智能提示
import type { Product } from '~/types'

// ============================================================================
// Nuxt 3 组合式 API 导入 (Nuxt 3 Composables)
// ============================================================================

// useRoute：获取当前路由信息
// 用于访问路由参数（如 slug）、查询参数、路径等
// route.params.slug：获取动态路由参数 slug
const route = useRoute()

// useLocalePath：生成本地化路径的工具函数
// 自动为路径添加当前语言前缀（如 /en/products、/zh-HK/products）
// 用途：导航到其他页面时保持语言一致性
const localePath = useLocalePath()

// useI18n：获取国际化配置和工具函数
// 解构获取 locale：当前语言代码（如 'en'、'zh-HK'）
// 用于多语言内容显示
const { locale } = useI18n()

// ============================================================================
// 响应式状态定义 (Reactive State)
// ============================================================================

// 图片加载状态：false = 未加载，true = 已加载
// 用于控制图片淡入动画效果
const imageLoaded = ref(false)

// 当前语言代码的响应式计算属性
// computed：自动追踪依赖（locale），当 locale 改变时重新计算
// 用途：在模板中获取当前语言，避免直接访问 locale.value
const currentLocale = computed(() => locale.value)

// 当前显示的图片索引（从 0 开始）
// 用于跟踪当前显示哪张图片
const currentImageIndex = ref(0)

// ============================================================================
// 懒加载产品数据 (Lazy Fetch Product Data)
// ============================================================================

//
// 使用 useLazyFetch 而非 useFetch 的原因：
// 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
// 2. 用户体验：可以先显示页面框架（骨架屏），再异步加载数据
// 3. 路由切换：从其他页面切换过来时，避免等待数据加载
//
// useLazyFetch 参数说明：
// - `/api/products/${route.params.slug}`：API 端点路径，动态拼接 slug
//   - route.params.slug：获取 URL 中的动态参数（如 /products/server-001 → 'server-001'）
// - default: () => null as any：默认值，数据加载完成前返回 null
// - <Product>：泛型类型，表示返回的是 Product 对象
// - 解构赋值：{ data: apiProduct, pending, error }
//   - data：响应式数据，重命名为 apiProduct
//   - pending：布尔值，表示数据是否正在加载
//   - error：错误对象，表示加载是否失败
//
// 工作原理：
// 1. 页面立即渲染，不等待数据
// 2. pending = true，显示骨架屏（ProductDetailSkeleton）
// 3. 后台异步请求数据：GET /api/products/[slug]
// 4. 数据加载完成后：
//    - pending = false
//    - apiProduct = 产品对象（或 null，如果未找到）
//    - 触发 watch 回调，更新显示内容
//
// ============================================================================
const {
  data: apiProduct,
  pending,
  error,
} = useLazyFetch<Product>(`/api/products/${route.params.slug}`, {
  default: () => null as any,
})

// ============================================================================
// 产品数据计算属性 (Product Data Computed)
// ============================================================================
//
// 使用 computed 创建产品数据的响应式计算属性
//
// 作用：
// 1. 封装数据访问：统一访问产品数据
// 2. 错误处理：在数据变化时输出错误日志
// 3. 响应式追踪：自动追踪 apiProduct 和 error 的变化
//
// 返回值：
// - apiProduct.value：API 返回的产品对象
// - 如果有错误，输出日志到控制台
//
// 使用场景：
// - 模板中直接使用 product，无需访问 .value
// - 自动处理错误情况
//
// ============================================================================
const product = computed(() => {
  // 检查是否有错误
  if (error.value) {
    // 输出错误日志
    console.error('[Product Detail] API Error:', error.value)
  }
  // 返回 API 返回的产品数据
  return apiProduct.value
})

// ============================================================================
// 当前图片 URL 计算属性 (Current Image URL Computed)
// ============================================================================
//
// 使用 computed 创建当前显示图片的 URL
//
// 作用：
// 1. 计算当前应该显示哪张图片
// 2. 响应式更新：当 product 或 currentImageIndex 改变时重新计算
// 3. 安全检查：避免访问不存在的数据
//
// 返回值：
// - product.value.images[currentImageIndex.value]：当前索引对应的图片 URL
// - 如果产品或图片数组不存在，返回空字符串
//
// 安全检查：
// - !product.value：产品不存在
// - !product.value.images：图片数组不存在
// - product.value.images.length === 0：图片数组为空
//
// ============================================================================
const currentImage = computed(() => {
  // 安全检查：确保产品、图片数组、图片数量都有效
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    // 如果无效，返回空字符串
    return ''
  }
  // 返回当前索引对应的图片 URL
  return product.value.images[currentImageIndex.value]
})

// ============================================================================
// 图片加载处理 (Image Load Handling)
// ============================================================================
//
// 图片加载状态管理的目的是实现平滑的淡入效果，避免图片加载时的闪烁。
//
// 工作流程：
// 1. 切换图片时，imageLoaded = false（图片不透明度 0%）
// 2. 新图片开始加载
// 3. 图片加载完成（@load 或 @error 事件触发）
// 4. imageLoaded = true（图片不透明度 100%，淡入效果）
//
// 特殊情况处理：
// 1. 缓存图片：浏览器缓存了图片，@load 事件可能不会触发
// 2. 解决方案：checkImageComplete 函数检测 img.complete 状态
//
// ============================================================================

// 图片 DOM 元素引用
// 用于访问原始 img 元素，检测加载状态
const mainImageRef = ref()

// 图片加载事件处理器
// 当图片加载成功或失败时调用
const handleImageLoad = () => {
  // 输出日志：图片加载事件触发
  console.log('[Product Detail] Image load event triggered')
  // 设置图片加载状态为已完成
  imageLoaded.value = true
}

// 检查图片是否已经加载完成（处理缓存情况）
//
// 为什么要检查图片是否已加载？
// - 浏览器缓存：如果图片已被缓存，@load 事件可能不会触发
// - 快速切换：快速切换图片时，新图片可能已在 DOM 中完成加载
// - 首屏显示：页面首次加载时，第一张图片可能已在 DOM 中完成加载
//
// 检查方法：
// - img.complete：HTMLImageElement 的原生属性，表示图片是否已完成加载
//   - true：加载完成（成功或失败）
//   - false：加载中
//
// nextTick 的作用：
// - Vue 的 DOM 更新是异步的
// - nextTick 确保在 DOM 更新完成后执行检查
// - 确保 img 元素已插入 DOM
//
// 访问 img 元素：
// - NuxtImg 是一个 Vue 组件
// - 组件的 $el 属性指向其根 DOM 元素
// - 或者直接使用 ref.value（如果组件本身就是 img 元素）
//
const checkImageComplete = () => {
  // nextTick：等待 Vue 的下一次 DOM 更新
  nextTick(() => {
    // 获取原始 img 元素
    // mainImageRef.value?.$el：访问组件的根 DOM 元素（NuxtImg 组件）
    // mainImageRef.value：如果组件本身就是 img 元素
    const imgElement = mainImageRef.value?.$el || mainImageRef.value

    // 检查 img 元素是否存在，且是 HTMLImageElement，且已完成加载
    if (imgElement && imgElement instanceof HTMLImageElement && imgElement.complete) {
      // 如果已完成加载，调用加载处理器
      handleImageLoad()
    }
  })
}

// ============================================================================
// 图片导航功能 (Image Navigation Functions)
// ============================================================================

// 切换到下一张图片
//
// 方法：
// 1. 安全检查：确保产品存在且有图片
// 2. 重置加载状态：imageLoaded = false（准备淡入新图片）
// 3. 更新索引：(当前索引 + 1) % 图片总数
//    - 使用取模运算（%）实现循环
//    - 例如：5 张图片，当前索引 4 → (4 + 1) % 5 = 0（回到第一张）
// 4. 检查图片是否已加载完成（处理缓存）
//
function nextImage() {
  // 安全检查：确保产品存在且有图片
  if (!product.value?.images) return

  // 重置图片加载状态
  imageLoaded.value = false

  // 更新当前索引（循环到下一张）
  currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length

  // 检查新图片是否已加载完成（处理缓存）
  checkImageComplete()
}

// 切换到上一张图片
//
// 方法：
// 1. 安全检查：确保产品存在且有图片
// 2. 重置加载状态：imageLoaded = false（准备淡入新图片）
// 3. 更新索引：
//    - 如果当前索引是 0，跳到最后一张（图片总数 - 1）
//    - 否则，索引 - 1
//
// 为什么不用取模运算？
// - JavaScript 的 % 运算符对于负数的结果可能是负数
// - 例如：-1 % 5 = -1（不是 4）
// - 所以需要手动处理索引边界
//
function previousImage() {
  // 安全检查：确保产品存在且有图片
  if (!product.value?.images) return

  // 重置图片加载状态
  imageLoaded.value = false

  // 更新当前索引（循环到上一张）
  // 如果是第一张（索引 0），跳到最后一张
  currentImageIndex.value =
    currentImageIndex.value === 0 ? product.value.images.length - 1 : currentImageIndex.value - 1

  // 检查新图片是否已加载完成（处理缓存）
  checkImageComplete()
}

// 设置当前图片（直接跳转到指定图片）
//
// 参数：
// - index：目标图片索引
//
// 方法：
// 1. 安全检查：
//    - 确保产品存在且有图片
//    - 确保索引在有效范围内（0 <= index < 图片总数）
//    - 确保不是当前图片（避免不必要的重新加载）
// 2. 重置加载状态：imageLoaded = false
// 3. 更新索引：设置为目标索引
// 4. 检查图片是否已加载完成（处理缓存）
//
// 使用场景：
// - 点击底部进度指示器
// - 键盘导航（虽然本例只实现了左右箭头）
// - 编程式控制（未来扩展）
//
function setCurrentImage(index: number) {
  // 安全检查：确保产品存在且有图片，索引有效，且不是当前图片
  if (!product.value?.images || index < 0 || index >= product.value.images.length) return
  if (currentImageIndex.value === index) return

  // 重置图片加载状态
  imageLoaded.value = false

  // 更新当前索引
  currentImageIndex.value = index

  // 检查新图片是否已加载完成（处理缓存）
  checkImageComplete()
}

// ============================================================================
// 键盘导航支持 (Keyboard Navigation)
// ============================================================================
//
// 功能：支持使用键盘左右箭头键切换图片
//
// 无障碍性（Accessibility）：
// - 键盘用户可以不使用鼠标即可浏览产品图片
// - 符合 WCAG 无障碍标准
//
// 实现方式：
// 1. onMounted 生命周期钩子：组件挂载后添加事件监听器
// 2. window.addEventListener('keydown', handleKeydown)：监听键盘按键事件
// 3. handleKeydown 函数：处理按键逻辑
// 4. onUnmounted 生命周期钩子：组件卸载前移除事件监听器（避免内存泄漏）
//
// 注意事项：
// - 只在产品有多张图片时启用键盘导航
// - 只处理左右箭头键（ArrowLeft、ArrowRight）
// - 使用 passive: false（可选），如果需要阻止默认行为
//
// ============================================================================

onMounted(() => {
  // 键盘事件处理器
  const handleKeydown = (e: KeyboardEvent) => {
    // 安全检查：确保产品存在且有多张图片
    if (!product.value?.images || product.value.images.length <= 1) return

    // 根据按键执行相应操作
    if (e.key === 'ArrowLeft') {
      // 左箭头键：切换到上一张图片
      previousImage()
    } else if (e.key === 'ArrowRight') {
      // 右箭头键：切换到下一张图片
      nextImage()
    }
  }

  // 添加键盘事件监听器
  // window：全局监听键盘事件
  // 'keydown'：监听按键按下事件
  // handleKeydown：事件处理器
  window.addEventListener('keydown', handleKeydown)

  // 初始挂载后检查第一张图片是否已加载完成（处理缓存）
  checkImageComplete()

  // 清理：组件卸载前移除事件监听器
  // 避免内存泄漏和重复触发事件
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

// ============================================================================
// 监听产品数据变化 (Watch Product Data Changes)
// ============================================================================
//
// 使用 watch 监听 product 数据的变化
//
// 触发时机：
// - 产品数据加载完成（apiProduct.value 从 null 变为 Product 对象）
// - 产品数据更新（如果有动态更新）
//
// 作用：
// 1. 重置图片索引到第一张
// 2. 重置图片加载状态
// 3. 检查第一张图片是否已加载完成（处理缓存）
//
// immediate: true 的作用：
// - 立即执行一次回调，即使 product 初始值为 null
// - 确保组件挂载时正确初始化状态
//
// ============================================================================
watch(
  product,
  (newProduct) => {
    // 检查产品数据是否存在
    if (newProduct) {
      // 重置当前图片索引到第一张
      currentImageIndex.value = 0

      // 重置图片加载状态
      imageLoaded.value = false

      // 检查第一张图片是否已加载完成（处理缓存）
      checkImageComplete()
    }
  },
  { immediate: true }
)

// ============================================================================
// 错误处理 (Error Handling)
// ============================================================================
//
// 使用 watchEffect 监听错误状态
// watchEffect 会自动追踪依赖，当 error.value 改变时自动执行
//
// 工作流程：
// 1. watchEffect 立即执行一次，收集依赖（error.value）
// 2. 当 error.value 改变时，重新执行回调
// 3. 如果有错误，输出到控制台
//
// 错误处理最佳实践：
// 1. 日志记录：记录错误详情，便于调试
// 2. 用户反馈：已在模板中实现 404 错误页面
// 3. 错误边界：Vue 3 使用 ErrorBoundary 捕获组件错误
// 4. 重试机制：可以提供重新加载按钮（本例未实现）
//
// 注意事项：
// - watchEffect 是立即执行的，不同于 watch（惰性执行）
// - watchEffect 会自动追踪响应式依赖
// - 适用于有副作用且需要自动追踪的场景
//
// ============================================================================
watchEffect(() => {
  // 检查是否有错误
  if (error.value) {
    // 输出错误日志
    console.error('Failed to fetch product:', error.value)
    // TODO: 可以在此处添加用户友好的错误提示
    // 例如：showErrorNotification('加载产品失败，请稍后重试')
  }
})

// ============================================================================
// 产品类别标签映射 (Category Label Mapping)
// ============================================================================
//
// 产品类别英文到中文的映射表
//
// 为什么需要映射？
// - 数据库中存储的是英文类别代码（如 'server'、'storage'）
// - 用户界面需要显示中文标签（如 '伺服器'、'存儲'）
//
// Record<string, string> 类型说明：
// - Record<string, string>：一个键值对对象，键和值都是字符串
// - TypeScript 的工具类型，简化对象类型定义
//
// 映射关系：
// - server → 伺服器
// - storage → 存儲
// - network → 網絡
// - software → 軟體
//
// ============================================================================
const categoryLabels: Record<string, string> = {
  server: '伺服器',
  storage: '存儲',
  network: '網絡',
  software: '軟件',
}

// 获取类别标签的函数
//
// 参数：
// - category：英文类别代码（如 'server'）
//
// 返回值：
// - 中文标签（如 '伺服器'）
// - 如果类别不存在，返回原始类别代码
//
// 使用示例：
// getCategoryLabel('server') → '伺服器'
// getCategoryLabel('unknown') → 'unknown'
//
// ============================================================================
const getCategoryLabel = (category: string): string => {
  // 返回映射的中文标签，如果不存在则返回原始类别代码
  return categoryLabels[category] || category
}

// ============================================================================
// SEO 元数据和结构化数据设置 (SEO Metadata and Structured Data)
// ============================================================================
//
// 使用 watchEffect 监听产品数据变化，动态设置页面头部信息
//
// 设置内容：
// 1. 页面标题（包含产品名称）
// 2. Canonical URL（防止重复内容）
// 3. JSON-LD 结构化数据：
//    - Product：产品信息（名称、描述、图片、品牌）
//    - BreadcrumbList：面包屑导航（Home → Products → 产品名称）
//
// 结构化数据（Structured Data）：
// - JSON-LD 格式：JavaScript 对象表示法
// - Schema.org 词汇表：标准的语义标记
// - 优势：富媒体搜索结果、知识图谱、语音搜索
//
// useProductStructuredData：
// - 生成 Product 类型的 JSON-LD 结构化数据
// - 包含产品名称、描述、图片、品牌等信息
//
// useBreadcrumbStructuredData：
// - 生成 BreadcrumbList 类型的 JSON-LD 结构化数据
// - 包含面包屑导航的层级结构
//
// useHead：
// - Nuxt 3 提供的组合式 API，用于管理页面 SEO
// - title：页面标题
// - link：链接标签数组（用于 canonical URL）
// - script：脚本标签数组（用于 JSON-LD）
//
// ============================================================================
watchEffect(() => {
  // 检查产品数据是否存在
  if (product.value) {
    // 获取当前语言代码
    const langKey = locale.value

    // 基础 URL
    const baseUrl = 'https://www.supercore.hk'

    // 当前页面路径
    const currentPath = route.path

    // 生成 Canonical URL
    // Canonical URL 的作用：
    // 1. 防止重复内容：告诉搜索引擎这是页面的首选版本
    // 2. 集中权重：将多个相似 URL 的 SEO 权重集中到首选版本
    // 3. 避免惩罚：防止搜索引擎认为内容重复
    //
    // 生成规则：
    // - 英文（en）：https://www.supercore.hk/en/products/slug
    // - 中文（zh-HK）：https://www.supercore.hk/zh-HK/products/slug
    //
    const canonicalUrl =
      locale.value === 'en'
        ? `${baseUrl}${currentPath}`
        : `${baseUrl}/${locale.value}${currentPath}`

    // 生成产品结构化数据
    // Product Schema 包含：
    // - @type：类型为 Product
    // - name：产品名称
    // - description：产品描述
    // - image：产品图片数组
    // - brand：品牌信息
    // - category：产品类别
    const structuredData = useProductStructuredData(product.value, locale.value)

    // 生成面包屑结构化数据
    // BreadcrumbList Schema 包含：
    // - @type：类型为 BreadcrumbList
    // - itemListElement：面包屑项列表
    //   - @type：ListItem
    //   - position：位置（1、2、3...）
    //   - name：名称
    //   - item：URL
    const breadcrumbStructuredData = useBreadcrumbStructuredData([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
      { name: product.value.name[langKey] || product.value.name['zh-HK'], url: currentPath },
    ])

    // 使用 useHead 设置页面头部信息
    // useHead 是 Nuxt 3 提供的组合式 API，用于管理页面 SEO
    //
    // title：页面标题
    // 格式：[产品名称] - 超核技術有限公司
    //
    // link：链接标签数组
    // - rel="canonical"：Canonical URL
    //
    // script：脚本标签数组
    // - type="application/ld+json"：JSON-LD 结构化数据
    // - innerHTML：JSON 字符串
    //
    useHead({
      title: `${product.value.name[langKey as keyof typeof product.value.name] || product.value.name['zh-HK']} - 超核技術有限公司`,
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(breadcrumbStructuredData),
        },
      ],
    })
  }
})
</script>
