<!--
================================================================================
应用导航栏组件（App Navbar Component）
================================================================================

文件作用：
此文件是网站的全局导航栏组件，包含 Logo、桌面端导航链接、
语言切换器和移动端菜单按钮。

实现手段：
1. Vue 3 Composition API（<script setup>）
2. 瑞士国际主义设计风格（TypographyHeader）
3. 响应式设计：桌面端（md 以上）和移动端
4. 滚动监听：滚动时改变导航栏背景和高度
5. 过渡动画：使用 Vue Transition 实现移动端菜单动画
6. 无障碍支持：aria-label、role 属性

核心功能：
1. Logo：点击返回首页
2. 桌面端导航：显示所有页面链接
3. 移动端菜单：点击按钮展开/收起
4. 语言切换器：支持多语言切换
5. 滚动效果：滚动时导航栏变为半透明并缩小

页面结构：
1. 导航栏容器：固定定位，滚动时改变样式
2. 左侧：Logo（NuxtLink）
3. 中间：桌面端导航链接
4. 右侧：语言切换器 + 移动端菜单按钮
5. 移动端菜单：下拉菜单（Transition 动画）

滚动效果：
- 未滚动：透明背景，高度 h-24/md:h-32
- 滚动后：半透明白色背景（bg-white/90），高度 h-16/md:h-24
- 添加 backdrop-blur：毛玻璃效果
- 添加边框：border-b border-gray-100

移动端菜单动画：
- 使用 Vue Transition 的 slide-down 模式
- 进入：从上方滑下，渐显
- 退出：向上滑出，渐隐
- 过渡时间：0.3s
- 缓动函数：ease

导航链接下划线动画：
- 默认：无下划线
- Hover：下划线从左向右展开
- 过渡时间：0.3s
- 缓动函数：ease-out

导航项：
- 首页（Home）：/
- 产品（Products）：/products
- 解决方案（Solutions）：/solutions
- 新闻（News）：/news
- 关于（About）：/about
- 联系我们（Contact）：/contact

无障碍功能：
- aria-label="Main Navigation"：导航栏标签
- NuxtLink aria-label：链接标签
- button aria-label：按钮标签
- aria-expanded：菜单展开状态
- aria-controls：控制的元素 ID
- role="menubar"：菜单栏角色
- role="menuitem"：菜单项角色
- aria-current：当前页面指示

Logo 配置：
- 文件：/icon.png
- 格式：webp（优先）、avif、jpg
- 尺寸：256x256 像素
- 质量：90%
- 加载策略：eager（立即加载，优先级高）
- 预加载：preload
- 对象适应：object-contain（保持比例）
- 滚动时高度变化：h-24/h-32 → h-16/h-24

使用方式：
自动在 app.vue 或 layouts/default.vue 中引入：
```vue
<template>
  <div>
    <AppNavbar />
    <NuxtPage />
    <AppFooter />
  </div>
</template>
```

技术栈：
- 框架：Nuxt 3（Vue 3）
- 样式：Tailwind CSS
- 国际化：@nuxtjs/i18n
- 图片：@nuxt/image（NuxtImg）
- 路由：NuxtLink

样式特点：
- 瑞士设计风格：简洁、网格系统
- 固定定位：fixed top-0
- 过渡动画：transition-all duration-500
- 毛玻璃效果：backdrop-blur-md
- 下划线动画：::after 伪元素

注意：
- Logo 文件必须在 public/ 目录
- 移动端菜单只在 md 以下显示（hidden md:block）
- 桌面端导航只在 md 以上显示（hidden md:flex）
- 滚动阈值：50px（scrollY > 50）

================================================================================
-->

<template>
  <!-- ====================================================================================
       导航栏容器
       ====================================================================================
       - fixed：固定定位
       - top-0 left-0 right-0：固定在页面顶部
       - z-50：高层级，确保在其他元素之上
       - transition-all duration-500：所有属性的过渡动画持续 500ms
       :class：动态类名绑定
         - scrolled && 'bg-white/90 backdrop-blur-md border-b border-gray-100'：滚动时的样式
           - bg-white/90：90% 透明白色背景
           - backdrop-blur-md：毛玻璃效果
           - border-b border-gray-100：底部边框
         - !scrolled && 'bg-transparent'：未滚动时的样式
           - bg-transparent：透明背景
       aria-label="Main Navigation"：无障碍标签
  -->
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100' : 'bg-transparent']"
    aria-label="Main Navigation"
  >
    <!-- ====================================================================================
         导航栏内容容器
         ====================================================================================
         - w-full：宽度 100%
         - px-6 sm:px-8 lg:px-12：水平内边距（移动端 1.5rem，平板 2rem，桌面 3rem）
         - py-5 md:py-8：垂直内边距（移动端 1.25rem，桌面 2rem）
         - transition-all duration-500：所有属性的过渡动画持续 500ms
         :class：动态类名绑定
           - scrolled && 'py-3 md:py-4'：滚动时垂直内边距变小
    -->
    <div
      class="w-full px-6 sm:px-8 lg:px-12 py-5 md:py-8 transition-all duration-500"
      :class="{ 'py-3 md:py-4': scrolled }"
    >
      <!-- ====================================================================================
           主内容容器
           ====================================================================================
           - flex：弹性布局
           - items-center：垂直居中
           - justify-between：两端对齐
           - max-w-[1400px]：最大宽度 1400px
           - mx-auto：水平居中
      -->
      <div class="flex items-center justify-between max-w-[1400px] mx-auto">
        <!-- ====================================================================================
             Logo 区域
             ====================================================================================
             - flex items-center：弹性布局，垂直居中
             - group：组，用于 hover 效果
             - aria-label：无障碍标签
        -->
        <NuxtLink :to="localePath('/')" class="flex items-center group" aria-label="SUPERCORE Home">
          <!-- NuxtImg：Nuxt 提供的图片优化组件 -->
          <!-- src="/icon.png"：图片路径 -->
          <!-- alt="SUPERCORE Logo"：替代文本（屏幕阅读器使用） -->
          <!-- width="256"：宽度 256px -->
          <!-- height="256"：高度 256px -->
          <!-- format="webp"：格式优先级（webp 优先） -->
          <!-- quality="90"：图片质量 90%（范围 0-100） -->
          <!-- loading="eager"：加载策略，立即加载（优先级高） -->
          <!-- preload：预加载图片 -->
          <!-- @load="imageLoaded = true"：图片加载完成后设置 imageLoaded = true -->
          <!-- class：样式类 -->
          <!--   - object-contain：对象适应（保持比例，不裁剪） -->
          <!--   - drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]：阴影效果 -->
          <!--   - transition-all duration-500：所有属性的过渡动画持续 500ms -->
          <!--   - h-24 md:h-32：高度（移动端 6rem，桌面 8rem） -->
          <!--   - w-auto：宽度自动 -->
          <!-- :class：动态类名绑定 -->
          <!--   - scrolled && '!h-16 md:!h-24'：滚动时高度变小 -->
          <!--   - imageLoaded ? 'opacity-100' : 'opacity-0'：图片加载完成后显示（淡入效果） -->
          <NuxtImg
            src="/icon.png"
            alt="SUPERCORE Logo"
            width="256"
            height="256"
            format="webp"
            quality="90"
            loading="eager"
            preload
            @load="imageLoaded = true"
            class="object-contain drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-all duration-500 h-24 md:h-32 w-auto"
            :class="[scrolled ? '!h-16 md:!h-24' : '', imageLoaded ? 'opacity-100' : 'opacity-0']"
          />
        </NuxtLink>

        <!-- ====================================================================================
             桌面端导航链接
             ====================================================================================
             - hidden：默认隐藏
             - md:flex：平板以上显示（弹性布局）
             - items-center：垂直居中
             - space-x-12：水平间距 3rem
             - role="menubar"：菜单栏角色（无障碍）
        -->
        <div class="hidden md:flex items-center space-x-12" role="menubar">
          <!-- 循环渲染导航项 -->
          <!-- v-for="item in navItems"：遍历导航项数组 -->
          <!-- :key="item.key"：使用 item.key 作为唯一键 -->
          <!-- :to="localePath(item.to)"：根据当前语言生成路径 -->
          <!-- class：样式类 -->
          <!--   - nav-link：导航链接类名（用于下划线动画） -->
          <!--   - group：组，用于 hover 效果 -->
          <!--   - relative：相对定位（用于下划线定位） -->
          <!--   - py-1 px-1：内边距（垂直 0.25rem，水平 0.25rem） -->
          <!-- role="menuitem"：菜单项角色（无障碍） -->
          <!-- :aria-current：动态属性，指示当前页面 -->
          <!--   - route.path === localePath(item.to) ? 'page' : undefined：如果是当前页面，设置为 'page' -->
          <!-- :aria-label="$t(item.label)"：无障碍标签 -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.key"
            :to="localePath(item.to)"
            class="nav-link group relative py-1 px-1"
            role="menuitem"
            :aria-current="route.path === localePath(item.to) ? 'page' : undefined"
            :aria-label="$t(item.label)"
          >
            <!-- 导航链接文本 -->
            <!-- TypographyHeader：排版标题组件 -->
            <!-- :level="4"：标题级别 4（H4） -->
            <!-- size="h6"：字体大小 H6 -->
            <!-- class：样式类 -->
            <!--   - text-swiss-text-muted：次要文本颜色 -->
            <!--   - group-hover:text-swiss-text：hover 时变为瑞士设计文本色 -->
            <!--   - transition-colors duration-500：颜色过渡动画持续 500ms -->
            <!--   - !mb-0：强制无下边距 -->
            <!--   - font-bold：粗体 -->
            <!--   - uppercase：全大写 -->
            <!--   - tracking-widest：超宽字间距 -->
            <!--   - text-[10px]：极小字体 -->
            <TypographyHeader
              :level="4"
              size="h6"
              class="text-swiss-text-muted group-hover:text-swiss-text transition-colors duration-500 !mb-0 font-bold uppercase tracking-widest text-[10px]"
            >
              <!-- $t(item.label)：翻译函数，获取导航项文本 -->
              {{ $t(item.label) }}
            </TypographyHeader>
          </NuxtLink>
        </div>

        <!-- ====================================================================================
             右侧操作区域
             ====================================================================================
             - flex：弹性布局 -->
        - items-center：垂直居中 --> - space-x-4：水平间距 1rem -->
        <div class="flex items-center space-x-4">
          <!-- ====================================================================================
               语言切换器
               ====================================================================================
               <!-- LocaleSwitcher：自定义组件，用于切换语言 -->
          <LocaleSwitcher />

          <!-- ====================================================================================
               移动端菜单按钮
               ====================================================================================
               <!-- type="button"：按钮类型（防止表单提交） -->
          <!-- class：样式类 -->
          <!--   - md:hidden：桌面端隐藏，移动端显示 -->
          <!--   - p-2：内边距 0.5rem -->
          <!--   - text-swiss-text：瑞士设计文本色 -->
          <!--   - hover:text-swiss-accent：hover 时变为强调色 -->
          <!--   - transition-colors：颜色过渡动画 -->
          <!-- @click="toggleMobileMenu"：点击时切换移动端菜单状态 -->
          <!-- :aria-label：动态属性，根据 mobileMenuOpen 显示 "Close menu" 或 "Open menu" -->
          <!-- :aria-expanded="mobileMenuOpen"：菜单展开状态（无障碍） -->
          <!-- aria-controls="mobile-menu"：控制的元素 ID（无障碍） -->
          <button
            type="button"
            class="md:hidden p-2 text-swiss-text hover:text-swiss-accent transition-colors"
            @click="toggleMobileMenu"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <!-- SVG 图标 -->
            <!-- class：样式类 -->
            <!--   - w-6 h-6：24px x 24px -->
            <!--   - fill="none"：无填充 -->
            <!--   - stroke="currentColor"：使用当前文本颜色 -->
            <!--   - viewBox="0 0 24 24"：视口（SVG 坐标系） -->
            <!--   - aria-hidden="true"：隐藏此元素（屏幕阅读器） -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <!-- 菜单图标（汉堡菜单） -->
              <!-- v-if="!mobileMenuOpen"：如果菜单未打开，显示汉堡图标（三条线） -->
              <!-- stroke-linecap="round"：线条末端圆角 -->
              <!-- stroke-linejoin="round"：线条连接处圆角 -->
              <!-- stroke-width="2"：线条宽度 2px -->
              <!-- d：路径指令 -->
              <!--   - M4 6h16：从 (4,6) 到 (20,6) 的线条 -->
              <!--   - M4 12h16：从 (4,12) 到 (20,12) 的线条 -->
              <!--   - M4 18h16：从 (4,18) 到 (20,18) 的线条 -->
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>

              <!-- 关闭图标（X） -->
              <!-- v-else：如果菜单已打开，显示关闭图标（X） -->
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ====================================================================================
         移动端菜单
         ====================================================================================
         - Transition name="slide-down"：Vue 过渡组件，使用 slide-down 模式
         - v-if="mobileMenuOpen"：只在菜单打开时显示
         - id="mobile-menu"：元素 ID（用于 aria-controls）
         - class：样式类 -->
    <!--   - md:hidden：桌面端隐藏，移动端显示 -->
    <!--   - bg-swiss-bg/95：95% 透明的瑞士设计背景色 -->
    <!--   - backdrop-blur-md：毛玻璃效果 -->
    <!--   - border-t border-swiss-secondary/10：顶部边框 -->
    -->
    <Transition name="slide-down">
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="md:hidden bg-swiss-bg/95 backdrop-blur-md border-t border-swiss-secondary/10"
      >
        <!-- ====================================================================================
             移动端菜单内容
             ====================================================================================
             - px-6 sm:px-8 lg:px-12：水平内边距 -->
        <!-- py-4：垂直内边距 -->
        <!-- max-w-[1400px]：最大宽度 1400px -->
        <!-- mx-auto：水平居中 -->
        <!-- space-y-4：每个元素之间有 1rem 间距 -->
        <!-- role="menu"：菜单角色（无障碍）
        -->
        <div class="px-6 sm:px-8 lg:px-12 py-4 max-w-[1400px] mx-auto space-y-4" role="menu">
          <!-- 循环渲染导航项 -->
          <!-- v-for="item in navItems"：遍历导航项数组 -->
          <!-- :key="item.key"：使用 item.key 作为唯一键 -->
          <!-- :to="localePath(item.to)"：根据当前语言生成路径 -->
          <!-- class：样式类 -->
          <!--   - block：块级元素（占满整行） -->
          <!--   - py-2：内边距（上下 0.5rem） -->
          <!-- @click="mobileMenuOpen = false"：点击时关闭移动端菜单 -->
          <!-- role="menuitem"：菜单项角色（无障碍） -->
          <!-- :aria-current：动态属性，指示当前页面 -->
          <NuxtLink
            v-for="item in navItems"
            :key="item.key"
            :to="localePath(item.to)"
            class="block py-2"
            @click="mobileMenuOpen = false"
            role="menuitem"
            :aria-current="route.path === localePath(item.to) ? 'page' : undefined"
          >
            <!-- 移动端导航链接文本 -->
            <!-- TypographyHeader：排版标题组件 -->
            <!-- :level="4"：标题级别 4（H4） -->
            <!-- size="h5"：字体大小 H5 -->
            <TypographyHeader :level="4" size="h5">
              <!-- $t(item.label)：翻译函数，获取导航项文本 -->
              {{ $t(item.label) }}
            </TypographyHeader>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
<script setup lang="ts">
// ====================================================================================
// 国际化：路径生成
// ====================================================================================
// useLocalePath()：根据当前语言生成路径的组合式函数
// 例如：localePath('/products') 会根据当前语言生成 /products（英文）或 /zh-HK/products（繁体）
const localePath = useLocalePath()

// ====================================================================================
// 路由信息
// ====================================================================================
// useRoute()：获取当前路由信息的组合式函数
// route.path：当前路径（例如：/products）
const route = useRoute()

// ====================================================================================
// 响应式状态
// ====================================================================================
// scrolled：是否已滚动
// 用于控制导航栏的背景和高度
const scrolled = ref(false)

// mobileMenuOpen：移动端菜单是否打开
const mobileMenuOpen = ref(false)

// imageLoaded：图片是否已加载
// 用于控制 Logo 的淡入效果
const imageLoaded = ref(false)

// ====================================================================================
// 导航项数组
// ====================================================================================
// navItems：包含所有导航项的数组
// 每个项包含：
// - key：唯一键
// - label：翻译键路径（例如：'nav.home'）
// - to：路由路径（例如：'/'）
const navItems = [
  { key: 'home', label: 'nav.home', to: '/' },
  { key: 'products', label: 'nav.products', to: '/products' },
  { key: 'solutions', label: 'nav.solutions', to: '/solutions' },
  { key: 'news', label: 'nav.news', to: '/news' },
  { key: 'about', label: 'nav.about', to: '/about' },
  { key: 'contact', label: 'nav.contact', to: '/contact' },
]

// ====================================================================================
// 切换移动端菜单
// ====================================================================================
/**
 * toggleMobileMenu() - 切换移动端菜单状态
 *
 * 功能：
 * 切换 mobileMenuOpen 的值（true ↔ false）
 * 用于移动端菜单按钮的点击事件
 *
 * 调用时机：
 * - 用户点击移动端菜单按钮时
 *
 * 效果：
 * - mobileMenuOpen = false → mobileMenuOpen = true（打开菜单）
 * - mobileMenuOpen = true → mobileMenuOpen = false（关闭菜单）
 */
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// ====================================================================================
// 监听滚动状态
// ====================================================================================
/**
 * handleScroll() - 处理滚动事件
 *
 * 功能：
 * 检测页面滚动位置，设置 scrolled 状态。
 * 滚动超过 50px 时，导航栏变为半透明背景并缩小。
 *
 * 滚动阈值：50px
 * - window.scrollY：页面垂直滚动位置
 * - scrolled.value：true/false
 *
 * 调用时机：
 * - 页面滚动时（window 的 'scroll' 事件）
 *
 * 效果：
 * - scrollY <= 50：透明背景，高度 h-24/h-32
 * - scrollY > 50：半透明白色背景（bg-white/90），高度 h-16/h-24
 */
const handleScroll = () => {
  // 判断滚动位置是否超过 50px
  scrolled.value = window.scrollY > 50
}

// ====================================================================================
// 组件挂载生命周期
// ====================================================================================
// onMounted()：Vue 生命周期钩子，组件挂载到 DOM 后执行
onMounted(() => {
  // 初始检测滚动状态
  handleScroll()

  // 监听滚动事件
  window.addEventListener('scroll', handleScroll)
})

// ====================================================================================
// 组件卸载生命周期
// ====================================================================================
// onUnmounted()：Vue 生命周期钩子，组件卸载前执行
// 用于清理资源，避免内存泄漏
onUnmounted(() => {
  // 移除滚动事件监听器
  window.removeEventListener('scroll', handleScroll)
})
</script>
<style scoped>
/* ====================================================================================
 * 移动端菜单动画
 * ====================================================================================
 * 
 * Vue Transition 的 slide-down 模式
 * - enter-active：进入动画的激活状态
 * - leave-active：离开动画的激活状态
 * 
 * 过渡效果：
 * - 所有属性（all）
 * - 持续时间 0.3s
 * - 缓动函数：ease（平滑开始和结束）
 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

/* 进入动画的起始状态 */
.slide-down-enter-from,
/* 离开动画的结束状态 */
.slide-down-leave-to {
  opacity: 0; /* 完全透明 */
  transform: translateY(-10px); /* 向上偏移 10px */
}

/* ====================================================================================
 * 导航链接下划线动画
 * ====================================================================================
 * 
 * 使用 ::after 伪元素实现下划线动画
 * 
 * 动画效果：
 * - 默认：无下划线（width: 0）
 * - Hover：下划线从左向右展开（width: 100%）
 * - 过渡时间：0.3s
 * - 缓动函数：ease-out（快速开始，慢速结束）
 */
.nav-link::after {
  /* 创建伪元素 */
  content: ''; /* 空内容 */
  position: absolute; /* 绝对定位 */
  bottom: 0; /* 定位到元素底部 */
  left: 0; /* 定位到元素左侧 */
  width: 0; /* 初始宽度为 0 */
  height: 1px; /* 高度为 1px */
  background-color: #1d1d1f; /* 下划线颜色（深灰色） */
  transition: width 0.3s ease-out; /* 宽度过渡动画 */
}

/* Hover 时展开下划线 */
.nav-link:hover::after {
  width: 100%; /* 展开到 100% 宽度 */
}
</style>
