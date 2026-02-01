<template>
  <!-- 网站最小高度设置为全屏高度，背景色为白色 -->
  <div class="min-h-screen bg-white">
    <!-- 页面头部区域：包含大标题和副标题 -->
    <!-- pt-48：顶部留出足够空间给导航栏和视觉效果 -->
    <!-- pb-24：为内容区提供呼吸空间 -->
    <!-- border-b border-gray-100：底部添加浅灰色的瑞士风格分割线 -->
    <!-- mb-12：为联系内容区添加底部间距 -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <!-- 使用瑞士网格系统容器，启用网格布局模式 -->
      <GridContainer :grid="true">
        <!-- 内容占据 12 列（全宽）在大屏幕上占据 8 列 -->
        <div class="col-span-12 lg:col-span-8">
          <!-- 主标题组件（带文字揭示动画） -->
          <!-- SwissTextReveal：瑞士风格文字揭示动画组件 -->
          <!-- tag="div"：渲染为 div 元素 -->
          <!-- :duration="1.2"：动画持续时间 1.2 秒 -->
          <!-- :immediate="true"：立即执行动画（不等待滚动） -->
          <SwissTextReveal tag="div" :duration="1.2" :immediate="true">
            <!-- TypographyHeader：瑞士风格标题组件 -->
            <!-- level="1"：语义化级别，对应 h1 -->
            <!-- size="display"：显示尺寸，用于超大标题 -->
            <!-- class="mb-8"：底部边距 8 单位 -->
            <TypographyHeader :level="1" size="display" class="mb-8">
              <!-- 使用 i18n 国际化翻译键 'nav.contact'，支持中英文切换 -->
              {{ $t('nav.contact') }}
            </TypographyHeader>
          </SwissTextReveal>

          <!-- 副标题组件（带文字揭示动画） -->
          <!-- SwissTextReveal：文字揭示动画 -->
          <!-- :delay="200"：延迟 200ms 执行动画 -->
          <!-- :duration="1"：动画持续时间 1 秒 -->
          <!-- :immediate="true"：立即执行动画 -->
          <SwissTextReveal tag="div" :delay="200" :duration="1" :immediate="true">
            <!-- TypographyHeader：瑞士风格标题组件 -->
            <!-- level="2"：语义化级别，对应 h2 -->
            <!-- size="h3"：视觉尺寸为 h3 -->
            <!-- color="secondary"：使用次要颜色（灰色调） -->
            <!-- weight="normal"：常规字重 -->
            <!-- class="max-w-2xl opacity-80"：最大宽度限制、透明度 80% -->
            <TypographyHeader
              :level="2"
              size="h3"
              color="secondary"
              weight="normal"
              class="max-w-2xl opacity-80"
            >
              <!-- 使用 i18n 国际化翻译键 'contact.pageSubtitle' -->
              {{ $t('contact.pageSubtitle') }}
            </TypographyHeader>
          </SwissTextReveal>
        </div>
      </GridContainer>
    </section>

    <!-- 联系内容区域 -->
    <!-- pb-32：底部留出大量空间，确保滚动体验流畅 -->
    <section class="pb-32">
      <!-- 使用瑞士网格系统容器 -->
      <!-- :grid="true"：启用网格布局 -->
      <!-- gap="none"：不使用内边距，由子元素自己控制间距 -->
      <!-- border-t border-l border-gray-100：添加顶部和左侧的瑞士风格网格线 -->
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <!-- 联系表单区域（左侧） -->
        <!-- col-span-12 lg:col-span-7：移动端全宽，桌面端占 7 列 -->
        <!-- border-r border-b border-gray-100：右侧和底部添加网格线 -->
        <!-- p-12 md:p-20：内边距响应式（移动端 12，桌面端 20） -->
        <div class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 p-12 md:p-20">
          <!-- 内容容器 -->
          <!-- max-w-xl：最大宽度 xl（限制表单宽度，提升可读性） -->
          <div class="max-w-xl">
            <!-- 表单标题标签 -->
            <!-- inline-block：内联块元素 -->
            <!-- mb-12：底部边距 12 单位 -->
            <!-- text-[10px]：极小字体（10px） -->
            <!-- font-bold：字重加粗 -->
            <!-- tracking-[0.3em]：字母间距加宽（瑞士设计特征） -->
            <!-- uppercase：全大写 -->
            <!-- text-swiss-text：主文本颜色 -->
            <!-- border-b border-swiss-text pb-1：底部添加主色边框，下内边距 1 -->
            <div
              class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
            >
              <!-- 表单标题文本 -->
              Send Inquiry
            </div>
            <!-- 联系表单组件 -->
            <!-- @submit="handleFormSubmit"：表单提交事件处理器 -->
            <ContactForm @submit="handleFormSubmit" />
          </div>
        </div>

        <!-- 联系信息区域（右侧） -->
        <!-- col-span-12 lg:col-span-5：移动端全宽，桌面端占 5 列 -->
        <!-- space-y-px：子元素之间间距 1px（用于创建分割线效果） -->
        <!-- bg-gray-100：浅灰背景（用于显示分割线） -->
        <div class="col-span-12 lg:col-span-5 space-y-px bg-gray-100">
          <!-- 联系信息容器 -->
          <!-- bg-white：白色背景（覆盖父容器的浅灰背景） -->
          <!-- p-12 md:p-20：内边距响应式 -->
          <!-- h-full：高度 100%（与左侧表单等高） -->
          <!-- border-r border-b border-gray-100：右侧和底部网格线 -->
          <div class="bg-white p-12 md:p-20 h-full border-r border-b border-gray-100">
            <!-- 信息标题（带文字揭示动画） -->
            <!-- SwissTextReveal：文字揭示动画 -->
            <!-- :immediate="true"：立即执行动画 -->
            <SwissTextReveal tag="div" :immediate="true">
              <div
                class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1"
              >
                <!-- 标题文本 -->
                Contact Detail
              </div>
            </SwissTextReveal>

            <!-- 联系信息列表 -->
            <!-- space-y-16：子元素之间间距 16 单位 -->
            <!-- mt-12：顶部边距 12 单位 -->
            <div class="space-y-16 mt-12">
              <!-- 邮箱信息（带文字揭示动画） -->
              <!-- SwissTextReveal：文字揭示动画 -->
              <!-- :delay="100"：延迟 100ms 执行动画 -->
              <!-- :immediate="true"：立即执行动画 -->
              <SwissTextReveal tag="div" :delay="100" :immediate="true">
                <!-- flex flex-col：弹性列布局 -->
                <div class="flex flex-col">
                  <!-- 标签文本 -->
                  <!-- text-[9px]：极小字体（9px） -->
                  <!-- font-bold：字重加粗 -->
                  <!-- text-swiss-text/30：30% 不透明度 -->
                  <!-- uppercase：全大写 -->
                  <!-- tracking-[0.2em]：字母间距加宽 -->
                  <!-- mb-4：底部边距 4 单位 -->
                  <span
                    class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4"
                    >Electronic Mail</span
                  >
                  <!-- 邮箱链接 -->
                  <!-- :href="`mailto:${$t('company.email')}`"：mailto 协议，点击打开邮件客户端 -->
                  <!-- class：样式 -->
                  <!--   - text-2xl：大号字体 -->
                  <!--   - font-bold：字重加粗 -->
                  <!--   - text-swiss-text：主文本颜色 -->
                  <!--   - hover:underline：悬停时添加下划线 -->
                  <!--   - decoration-1：下划线粗细 1px -->
                  <!--   - underline-offset-8：下划线与文本间距 8px -->
                  <a
                    :href="`mailto:${$t('company.email')}`"
                    class="text-2xl font-bold text-swiss-text hover:underline decoration-1 underline-offset-8"
                  >
                    <!-- 使用 i18n 国际化翻译键 'company.email' -->
                    {{ $t('company.email') }}
                  </a>
                </div>
              </SwissTextReveal>

              <!-- 电话信息（带文字揭示动画） -->
              <!-- SwissTextReveal：文字揭示动画 -->
              <!-- :delay="250"：延迟 250ms 执行动画 -->
              <!-- :immediate="true"：立即执行动画 -->
              <SwissTextReveal tag="div" :delay="250" :immediate="true">
                <!-- flex flex-col：弹性列布局 -->
                <div class="flex flex-col">
                  <!-- 标签文本 -->
                  <span
                    class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4"
                    >Direct Line</span
                  >
                  <!-- 电话链接 -->
                  <!-- :href="`tel:${$t('company.phone')}`"：tel 协议，点击拨打电话 -->
                  <!-- class：样式 -->
                  <!--   - text-2xl：大号字体 -->
                  <!--   - font-bold：字重加粗 -->
                  <!--   - text-swiss-text：主文本颜色 -->
                  <!--   - hover:underline：悬停时添加下划线 -->
                  <!--   - decoration-1：下划线粗细 1px -->
                  <!--   - underline-offset-8：下划线与文本间距 8px -->
                  <a
                    :href="`tel:${$t('company.phone')}`"
                    class="text-2xl font-bold text-swiss-text hover:underline decoration-1 underline-offset-8"
                  >
                    <!-- 使用 i18n 国际化翻译键 'company.phone' -->
                    {{ $t('company.phone') }}
                  </a>
                </div>
              </SwissTextReveal>

              <!-- 地址信息（带文字揭示动画） -->
              <!-- SwissTextReveal：文字揭示动画 -->
              <!-- :delay="400"：延迟 400ms 执行动画 -->
              <!-- :immediate="true"：立即执行动画 -->
              <SwissTextReveal tag="div" :delay="400" :immediate="true">
                <!-- flex flex-col：弹性列布局 -->
                <div class="flex flex-col">
                  <!-- 标签文本 -->
                  <span
                    class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4"
                    >Headquarters</span
                  >
                  <!-- 地址文本 -->
                  <!-- text-xl：中号字体 -->
                  <!-- font-medium：中等字重 -->
                  <!-- text-swiss-text：主文本颜色 -->
                  <!-- leading-relaxed：宽松行高 -->
                  <p class="text-xl font-medium text-swiss-text leading-relaxed">
                    <!-- 使用 i18n 国际化翻译键 'company.address' -->
                    {{ $t('company.address') }}
                  </p>
                </div>
              </SwissTextReveal>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：联系页面 (Contact Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的联系页面，用于展示联系表单和公司联系信息。
 *
 * 页面路由：/contact
 *
 * 实现手段：
 * 1. 响应式布局 (Responsive Layout)：使用瑞士网格系统，适配桌面、平板、移动设备
 * 2. 联系表单 (Contact Form)：使用 ContactForm 组件收集用户询盘
 * 3. 联系信息展示 (Contact Info)：显示公司邮箱、电话、地址等信息
 * 4. 动画效果 (Animation)：使用 SwissTextReveal 实现文字揭示动画
 * 5. SEO 优化 (SEO Optimization)：使用 useHead 设置页面标题和元数据
 * 6. 国际化 (i18n)：支持中英文双语切换
 * 7. 瑞士设计风格 (Swiss Design)：简洁的网格布局、大标题、留白充足
 * 8. 交互设计 (Interaction Design)：邮箱和电话链接支持点击直接操作
 *
 * 核心功能：
 * 1. 显示页面标题和副标题（国际化）
 * 2. 显示联系表单（收集用户询盘）
 * 3. 显示联系信息（邮箱、电话、地址）
 * 4. 表单提交事件处理（@submit 事件）
 * 5. 文字揭示动画（SwissTextReveal）
 * 6. SEO 元数据设置
 *
 * 瑞士设计特点：
 * - 网格系统 (Grid System)：12 列网格，响应式布局
 * - 大标题 (Display Typography)：font-black, tracking-tighter, uppercase
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能主义 (Functionalism)：快速加载，清晰导航
 * - 分割线 (Grid Lines)：border-gray-100 形成瑞士风格网格
 * - 大量留白 (Whitespace)：充足的呼吸空间
 * - 等宽字体 (Monospace)：用于技术标签
 *
 * 布局结构：
 * 1. 页面头部（GridContainer）
 *    - 标题（左上，占 8 列）
 *    - 副标题（左下，占 8 列）
 * 2. 联系内容（GridContainer）
 *    - 左侧：联系表单（占 7 列）
 *    - 右侧：联系信息（占 5 列）
 *      - 邮箱
 *      - 电话
 *      - 地址
 *
 * 动画效果：
 * 1. 标题：立即执行动画，持续时间 1.2 秒
 * 2. 副标题：延迟 200ms，持续时间 1 秒
 * 3. 信息标题：立即执行动画
 * 4. 邮箱：延迟 100ms
 * 5. 电话：延迟 250ms
 * 6. 地址：延迟 400ms
 *
 * SEO 最佳实践：
 * 1. 唯一的页面标题（包含"联系"关键词）
 * 2. 语义化 HTML：使用正确的 HTML 标签
 * 3. 可访问的链接：mailto 和 tel 协议
 * 4. 国际化支持：多语言内容
 *
 * 可访问性 (Accessibility)：
 * - 语义化 HTML：使用正确的 HTML 标签
 * - 邮箱链接：使用 mailto 协议，方便用户直接发邮件
 * - 电话链接：使用 tel 协议，方便用户直接拨打电话
 * - 对比度：文本和背景对比度符合 WCAG 标准
 * - 国际化支持：中英文双语
 *
 * 依赖组件：
 * - GridContainer：瑞士网格容器组件
 * - TypographyHeader：瑞士风格标题组件
 * - SwissTextReveal：瑞士风格文字揭示动画组件
 * - ContactForm：联系表单组件
 *
 * 依赖类型：
 * - ContactFormData：联系表单数据类型定义
 *
 * 表单提交流程：
 * 1. 用户填写联系表单（ContactForm 组件）
 * 2. 用户点击提交按钮
 * 3. ContactForm 组件内部处理表单验证
 * 4. ContactForm 组件内部调用 API：POST /api/inquiries
 * 5. API 返回成功或失败响应
 * 6. ContactForm 组件显示成功或错误提示
 * 7. @submit 事件被触发（本页面的 handleFormSubmit 函数）
 * 8. 当前实现：handleFormSubmit 函数为空（预留未来扩展）
 *
 * ============================================================================
 */

// 导入 ContactFormData 类型定义，用于类型检查和 TypeScript 智能提示
import type { ContactFormData } from '~/types'

// ============================================================================
// 表单提交事件处理器 (Form Submit Event Handler)
// ============================================================================
//
// 函数作用：
// - 处理联系表单的提交事件
// - 预留未来扩展的功能
//
// 参数：
// - data：ContactFormData 类型的表单数据
//   - 包含：name、email、phone、company、message 等字段
//
// 当前实现：
// - 函数体为空
// - 表单提交由 ContactForm 组件内部处理
// - @submit 事件保留用于未来扩展
//
// 未来可能的扩展：
// 1. 分析表单数据（例如：记录到 Google Analytics）
// 2. 重定向到感谢页面
// 3. 显示自定义的成功提示
// 4. 发送确认邮件通知
//
// ============================================================================
const handleFormSubmit = (data: ContactFormData) => {
  // 表单由 ContactForm 组件通过 API 内部提交
  // 此事件保留用于未来可能的扩展用途
  // 例如：
  // - 分析表单数据：console.log('Form submitted:', data)
  // - 重定向到感谢页面：navigateTo('/thank-you')
  // - 显示自定义提示：showToast('感谢您的询盘，我们会尽快联系您')
}

// ============================================================================
// SEO 元数据设置 (SEO Metadata Configuration)
// ============================================================================
//
// 使用 useHead 动态设置页面头部元数据
// 这是 Nuxt 3 提供的组合式 API，用于管理页面 SEO
*
// 设置内容：
* 1. title：页面标题，显示在浏览器标签页
*
// SEO 最佳实践：
* 1. 唯一的页面标题（包含"联系"关键词）
* 2. 品牌一致性（使用公司名称：超核技術有限公司）
* 3. 关键词自然融入标题
* 4. 中文优先（因为主要受众是中文用户）
*
// 搜索引擎优化 (SEO)：
* - 标题：帮助搜索引擎理解页面主题（联系页面）
* - 品牌名称：提升品牌知名度和搜索结果展示
* - 关键词：包含"联系"关键词，帮助用户搜索
*
// ============================================================================
useHead({
  title: '聯絡我們 - 超核技術有限公司',
})
</script>
