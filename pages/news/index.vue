<template>
  <!-- 网站最小高度设置为全屏高度，背景色为白色 -->
  <div class="min-h-screen bg-white">
    <!-- 页面头部区域：包含大标题和副标题 -->
    <!-- 上边距 pt-48：顶部留出足够空间给导航栏和视觉效果 -->
    <!-- 下边距 pb-24：为内容区提供呼吸空间 -->
    <!-- border-b border-gray-100：底部添加浅灰色的瑞士风格分割线 -->
    <!-- mb-12：为新闻列表区添加底部间距 -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <!-- 使用瑞士网格系统容器，启用网格布局模式 -->
      <GridContainer :grid="true">
        <!-- 内容占据 12 列（全宽）在大屏幕上占据 8 列 -->
        <div class="col-span-12 lg:col-span-8">
          <!-- 主标题组件 -->
          <!-- TypographyHeader：瑞士风格的标题组件 -->
          <!-- level="1"：语义化级别，对应 h1 -->
          <!-- size="display"：显示尺寸，用于超大标题 -->
          <!-- class="font-black tracking-tighter uppercase"：字重加粗、字母间距紧凑、全大写 -->
          <TypographyHeader
            :level="1"
            size="display"
            class="mb-8 font-black tracking-tighter uppercase"
          >
            <!-- 使用 i18n 国际化翻译键 'news.title'，支持中英文切换 -->
            {{ $t('news.title') }}
          </TypographyHeader>
          <!-- 副标题组件 -->
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
            <!-- 使用 i18n 国际化翻译键 'news.subtitle' -->
            {{ $t('news.subtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- 新闻列表网格区域 -->
    <!-- pb-32：底部留出大量空间，确保滚动体验流畅 -->
    <section class="pb-32">
      <!-- 使用瑞士网格系统容器 -->
      <!-- grid="true"：启用网格布局 -->
      <!-- gap="none"：不使用内边距，由子元素自己控制间距 -->
      <!-- border-t border-l border-gray-100：添加顶部和左侧的瑞士风格网格线 -->
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <!-- 加载状态：显示骨架屏 -->
        <!-- v-if="pending"：当数据正在加载时显示 -->
        <template v-if="pending">
          <!-- 循环生成 6 个骨架屏占位符 -->
          <!-- v-for="i in 6"：生成 6 个占位卡片 -->
          <!-- key="i"：使用索引作为 key，对于骨架屏是合理的 -->
          <div
            v-for="i in 6"
            :key="i"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100"
          >
            <!-- NewsSkeleton：骨架屏组件 -->
            <!-- class="!border-none"：强制移除边框，因为父元素已经提供了网格线 -->
            <NewsSkeleton class="!border-none" />
          </div>
        </template>
        <!-- 数据加载完成且有内容：显示新闻卡片 -->
        <!-- v-else-if="posts && posts.length"：当 posts 存在且有数据时显示 -->
        <template v-else-if="posts && posts.length">
          <!-- 循环渲染每个新闻文章 -->
          <!-- key="post.id"：使用文章 ID 作为 key，这是最佳实践 -->
          <!-- class="opacity-0 translate-y-8"：初始状态：透明、向下偏移 8 单位（用于动画） -->
          <!-- class="news-page-card-item"：添加特定类名，用于 GSAP 动画选择器 -->
          <div
            v-for="(post, index) in posts"
            :key="post.id"
            class="col-span-12 md:col-span-6 lg:col-span-4 border-r border-b border-gray-100 news-page-card-item opacity-0 translate-y-8"
          >
            <!-- NewsCard：新闻卡片组件 -->
            <!-- :post="post"：传递文章数据 -->
            <!-- class="!border-none"：强制移除边框 -->
            <NewsCard :post="post" class="!border-none" />
          </div>
        </template>
        <!-- 数据加载完成但无内容：显示空状态提示 -->
        <!-- v-else：当没有数据时显示 -->
        <template v-else>
          <!-- 全宽容器，居中显示空状态 -->
          <div class="col-span-12 border-r border-b border-gray-100 py-32 text-center">
            <!-- 空状态文本 -->
            <!-- text-swiss-secondary：使用瑞士风格的次要颜色 -->
            <!-- uppercase tracking-widest text-sm：全大写、宽字母间距、小号字体 -->
            <p class="text-swiss-secondary uppercase tracking-widest text-sm">
              <!-- 使用 i18n 国际化翻译键 'news.noNews' -->
              {{ $t('news.noNews') }}
            </p>
          </div>
        </template>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * ============================================================================
 * 文件作用：新闻列表页面 (News List Page)
 * ============================================================================
 *
 * 此文件是超核技術有限公司网站的新闻列表页面，用于展示所有新闻文章。
 *
 * 页面路由：/news
 *
 * 实现手段：
 * 1. 懒加载 (Lazy Loading)：使用 useLazyFetch 异步加载新闻数据，避免阻塞页面渲染
 * 2. 骨架屏 (Skeleton Loading)：加载时显示占位符，提升用户体验
 * 3. 响应式布局 (Responsive Grid)：使用瑞士网格系统，适配桌面、平板、移动设备
 * 4. GSAP 动画 (GSAP Animation)：使用 ScrollTrigger 实现卡片进入动画
 * 5. SEO 优化 (SEO Optimization)：使用 useHead 设置页面元数据
 * 6. 国际化 (i18n)：支持中英文双语切换
 * 7. 瑞士设计风格 (Swiss Design)：简洁的网格布局、大标题、留白充足
 *
 * 核心功能：
 * 1. 显示页面标题和副标题（国际化）
 * 2. 加载新闻文章列表（异步、懒加载）
 * 3. 加载状态：显示骨架屏（6 个占位符）
 * 4. 数据完成：显示新闻卡片（网格布局）
 * 5. 空状态：显示"暂无新闻"提示
 * 6. 卡片进入动画（GSAP ScrollTrigger）
 * 7. SEO 元数据设置
 * 8. 错误处理和日志输出
 *
 * 瑞士设计特点：
 * - 网格系统 (Grid System)：12 列网格，响应式布局
 * - 大标题 (Display Typography)：font-black, tracking-tighter, uppercase
 * - 分割线 (Grid Lines)：border-gray-100 形成瑞士风格网格
 * - 留白 (Whitespace)：大量留白，呼吸空间充足
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * - 功能性 (Functionality)：快速加载，清晰导航
 *
 * 性能优化：
 * - useLazyFetch：延迟加载数据，不阻塞初始渲染
 * - 骨架屏：提前显示 UI 结构，减少感知加载时间
 * - GSAP ScrollTrigger：按需触发动画，减少初始渲染开销
 * - 批量动画 (Batch Animation)：使用 ScrollTrigger.batch 优化多个元素动画
 *
 * 可访问性 (Accessibility)：
 * - 语义化 HTML：使用 section、div 等语义化标签
 * - 屏幕阅读器友好：清晰的文本内容
 * - 国际化支持：中英文双语
 *
 * 使用场景：
 * - 用户访问 /news 路由查看所有新闻
 * - 管理员发布新闻后，用户在此页面看到更新
 * - SEO 爬虫抓取新闻列表页
 *
 * 依赖组件：
 * - GridContainer：瑞士网格容器组件
 * - TypographyHeader：瑞士风格标题组件
 * - NewsSkeleton：骨架屏组件
 * - NewsCard：新闻卡片组件
 *
 * 依赖 API：
 * - /api/news/public：获取公开新闻列表
 *
 * 依赖类型：
 * - Post：新闻文章类型定义
 *
 * ============================================================================
 */

// 导入 Post 类型定义，用于类型检查和 TypeScript 智能提示
import type { Post } from '~/types'

// 控制台输出：页面加载开始日志
// 用于调试：确认页面组件是否成功挂载
console.log('[News] Page mounting...')

// ============================================================================
// 懒加载新闻数据 (Lazy Fetch News Data)
// ============================================================================
//
// 使用 useLazyFetch 而非 useFetch 的原因：
// 1. 非阻塞渲染：不会阻塞页面初始渲染，避免白屏问题
// 2. 用户体验：可以先显示页面框架，再异步加载数据
// 3. 路由切换：从其他页面切换过来时，避免等待数据加载
//
// useLazyFetch 参数说明：
// - '/api/news/public'：API 端点路径
// - <Post[]>：泛型类型，表示返回的是 Post 数组
// - 解构赋值：{ data: posts, pending, error }
//   - data：响应式数据，重命名为 posts
//   - pending：布尔值，表示数据是否正在加载
//   - error：错误对象，表示加载是否失败
//
// 工作原理：
// 1. 页面立即渲染，不等待数据
// 2. pending = true，显示骨架屏
// 3. 后台异步请求数据
// 4. 数据加载完成后：
//    - pending = false
//    - posts = 文章数组
//    - 触发 watch 回调，显示内容
//
// ============================================================================
const { data: posts, pending, error } = useLazyFetch<Post[]>('/api/news/public')

// 控制台输出：数据加载状态日志
// 用于调试：查看数据加载结果
console.log('[News] Data loaded:', { posts, pending, error })

// ============================================================================
// SEO 元数据设置 (SEO Metadata Configuration)
// ============================================================================
//
// 使用 useHead 动态设置页面头部元数据
// 这是 Nuxt 3 提供的组合式 API，用于管理页面 SEO
//
// 设置内容：
// 1. title：页面标题，显示在浏览器标签页
// 2. meta：元数据数组
//    - description：页面描述，显示在搜索引擎结果中
//
// SEO 最佳实践：
// 1. 唯一的页面标题（包含品牌名称）
// 2. 准确的页面描述（150-160 字符）
// 3. 关键词自然融入标题和描述
// 4. 品牌一致性（使用公司名称 SUPERCORE）
//
// 搜索引擎优化 (SEO)：
// - 标题：帮助搜索引擎理解页面主题
// - 描述：影响点击率 (CTR) 和搜索排名
// - 社交媒体分享：Open Graph 和 Twitter Cards
//
// ============================================================================
useHead({
  title: '行业咨询 - SUPERCORE',
  meta: [
    {
      name: 'description',
      content: '超核技術有限公司海外官方网站行业咨询界面，为您提供最新的行业动态及公司快讯。',
    },
  ],
})

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
// 2. 用户反馈：可以显示友好的错误提示（本例未实现）
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
    console.error('Failed to load news:', error.value)
    // TODO: 可以在此处添加用户友好的错误提示
    // 例如：showErrorNotification('加载新闻失败，请稍后重试')
  }
})

// ============================================================================
// GSAP 动画系统 (GSAP Animation System)
// ============================================================================
//
// 动画类型：ScrollTrigger 批量进入动画
//
// 技术栈：
// 1. GSAP (GreenSock Animation Platform)：强大的 JavaScript 动画库
// 2. ScrollTrigger：GSAP 的滚动触发插件
//
// 动画效果：
// - 卡片从透明渐变到不透明
// - 卡片从下方向上移动进入视口
// - 多个卡片依次进入（交错动画）
// - 只触发一次（不会重复动画）
//
// 性能考虑：
// - 使用 ScrollTrigger.batch 优化多个元素的动画
// - 只在客户端（浏览器）环境中执行
// - 使用 setTimeout 确保 DOM 完全渲染后再触发动画
//
// 获取 Nuxt 应用实例
// useNuxtApp() 返回 Nuxt 应用上下文
// 可以访问全局插件、注入的属性等
const nuxtApp = useNuxtApp()

// 解构获取 GSAP 和 ScrollTrigger 插件
// 这些是通过 nuxt.config.ts 中的 plugins 配置注入的全局插件
// 使用 (nuxtApp as any) 进行类型断言，因为 TS 可能不识别这些插件属性
const { $gsap, $ScrollTrigger } = nuxtApp as any

// ============================================================================
// 监听数据加载完成并触发动画 (Watch Data Loading and Trigger Animation)
// ============================================================================
//
// 使用 watch 监听 posts 和 pending 的变化
// 当这两个依赖改变时，执行回调函数
//
// 为什么使用 watch 而不是 watchEffect？
// - watch 可以明确指定监听的依赖（posts 和 pending）
// - watch 提供新旧值作为参数（本例未使用）
// - watch 是惰性执行，不会立即执行
//
// 动画触发条件：
// 1. !isPending：数据加载完成
// 2. newPosts && newPosts.length > 0：有文章数据
// 3. process.client：在客户端环境（避免 SSR 错误）
//
// 动画执行流程：
// 1. 数据加载完成（pending = false）
// 2. 等待 DOM 更新（Vue 的响应式系统）
// 3. 使用 setTimeout 确保 DOM 完全渲染
// 4. 查找所有带 .news-page-card-item 类的元素
// 5. 使用 ScrollTrigger.batch 批量应用动画
// 6. 刷新 ScrollTrigger
//
// 动画参数说明：
// - opacity: 0 → 1：透明度从 0 渐变到 1
// - y: 32px → 0：从下方向上移动（translate-y-8 = 2rem = 32px）
// - stagger: 0.1：每个卡片延迟 0.1 秒进入，形成交错效果
// - duration: 0.8：动画持续 0.8 秒
// - ease: 'power3.out'：使用 power3 缓动函数，结束时减速（更自然）
// - overwrite: true：覆盖之前的动画，避免冲突
// - start: 'top 90%'：当元素顶部到达视口 90% 位置时触发
// - once: true：只触发一次动画
//
// ============================================================================
watch([posts, pending], ([newPosts, isPending]) => {
  // 控制台输出：动画触发日志
  // 用于调试：查看数据加载状态
  console.log('[News] Animation watch:', {
    isPending,
    postsLength: newPosts?.length || 0,
    isArray: Array.isArray(newPosts),
  })

  // 检查动画触发条件
  if (!isPending && newPosts && newPosts.length > 0 && process.client) {
    // 控制台输出：开始触发动画
    console.log('[News] Triggering animation...')

    // 使用 setTimeout 确保 DOM 完全渲染后再执行动画
    // 为什么需要 setTimeout？
    // 1. Vue 的响应式更新是异步的
    // 2. v-for 渲染 DOM 需要时间
    // 3. 需要确保所有 .news-page-card-item 元素都已插入 DOM
    // 4. 延迟 100ms 通常足够（可根据实际情况调整）
    setTimeout(() => {
      // 检查 GSAP 和 ScrollTrigger 是否可用
      if ($gsap && $ScrollTrigger) {
        // 查找所有新闻卡片元素
        // querySelectorAll 返回 NodeList，包含所有匹配的元素
        const cards = document.querySelectorAll('.news-page-card-item')
        console.log('[News] Found cards:', cards.length)

        // 如果找到卡片元素，执行动画
        if (cards.length > 0) {
          // 使用 ScrollTrigger.batch 批量处理动画
          // batch 方法可以优化多个元素的滚动触发动画
          //
          // ScrollTrigger.batch 参数说明：
          // - '.news-page-card-item'：选择器，匹配所有卡片元素
          // - onEnter：当元素进入视口时执行的回调
          // - start：触发位置，'top 90%' 表示元素顶部到达视口 90% 位置
          // - once：是否只触发一次
          //
          // onEnter 回调参数：
          // - batch：进入视口的元素数组
          //
          // gsap.to 参数说明：
          // - batch：目标元素数组
          // - opacity: 1：目标透明度
          // - y: 0：目标 Y 轴位置（移除初始的 translate-y-8）
          // - stagger：交错动画，0.1 秒延迟
          // - duration：动画持续时间
          // - ease：缓动函数
          // - overwrite：覆盖之前的动画状态
          //
          $ScrollTrigger.batch('.news-page-card-item', {
            onEnter: (batch: any) => {
              $gsap.to(batch, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: true,
              })
            },
            start: 'top 90%',
            once: true,
          })

          // 刷新 ScrollTrigger
          // 重新计算所有触发器的位置
          // 在 DOM 更新后调用，确保触发器位置正确
          $ScrollTrigger.refresh()

          // 控制台输出：动画触发成功
          console.log('[News] Animation triggered successfully!')
        } else {
          // 如果找不到卡片元素，输出警告
          console.warn('[News] No cards found for animation')
        }
      } else {
        // 如果 GSAP 或 ScrollTrigger 不可用，输出警告
        // 可能原因：
        // 1. 插件未正确加载
        // 2. 客户端环境问题
        // 3. SSR/客户端环境不一致
        console.warn('[News] GSAP or ScrollTrigger not available')
      }
    }, 100) // 延迟 100ms 确保 DOM 渲染完成
  }
})
</script>
