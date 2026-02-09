# SUPERCORE TECHNOLOGY LIMITED

> 瑞士国际主义风格的企业级基础设施解决方案官网

## 项目概述

这是一个为香港及海外市场提供高端基础设施解决方案的企业官网，采用现代化的技术栈和设计理念。

**公司名称**：超核技术有限公司
**公司地址**：九龙尖沙咀科学馆道14号新文华中心B座7楼701室108单位

**Company Name**: SUPERCORE TECHNOLOGY LIMITED
**Company Address**: ROOM 701 UNIT 108 7/F TOWER B NEW MANDARIN PLAZA 14 SCIENCE MUSEUM ROAD TSIM SHA TSUI KL

---

## 核心特性

- 🎨 **Swiss International Style** - 极简主义设计，40%+ 负空间
- 🌐 **多语言支持** - 繁体中文（香港）、简体中文、English
- 🎭 **3D 粒子系统** - 程序化生成的 GPU 加速 3D 服务器，滚动触发爆炸动画
- 📱 **响应式设计** - 桌面端完整 3D + 移动端优化降级
- 🎬 **Scrollytelling 动画** - 流畅的滚动触发 3D 展示与交互动画
- ⚡ **性能优化** - GPU 加速渲染、WebP 图片、懒加载、ISR 缓存策略
- 🔍 **SEO 友好** - 结构化数据、动态 Sitemap、完整 Meta 标签
- ♿ **可访问性** - 完整 ARIA 标签、键盘导航支持
- 🛠️ **完整 CMS 后台** - 产品/新闻/询盘管理、批量操作、全局搜索、AI 统计与会话管理
- 🤖 **AI 智能助手** - 基于阿里云通义千问的 RAG 客服系统，支持匿名识别、多会话持久化及每日 Token 限制

---

## 技术栈

### 前端框架
- **Nuxt 3** - Vue 3 SSR 框架
- **TypeScript** - 严格类型检查
- **Vue 3 Composition API** - 响应式开发
- **Pinia** - 状态管理库 (Chat Session 管理等)

### 样式与设计
- **Tailwind CSS** - 实用工具 CSS 框架
- **Nuxt UI** - 基于 Tailwind 的 UI 组件库
- **Swiss Design System** - 自定义设计系统
- **字体**: Inter + Noto Sans HK

### 动画与 3D
- **Three.js** - 3D 渲染引擎（桌面端）
- **GPU 粒子系统** - ShaderMaterial 实现的高性能粒子效果
- **Post-Processing** - UnrealBloomPass 发光效果、HDR 渲染
- **Raycasting 交互** - 鼠标悬停高亮、3D 注释标签跟随
- **GSAP + ScrollTrigger** - 滚动动画系统
- **Lenis** - 平滑滚动体验

### 数据与内容
- **Supabase** - PostgreSQL 数据库 + 认证 + 存储
- **多语言 i18n** - 完整翻译支持
- **Tiptap** - 富文本编辑器
- **DOMPurify + marked** - 安全的 Markdown 渲染 (useSafeMarkdown)

### AI 与向量搜索
- **Vercel AI SDK** - AI 流式响应框架
- **阿里云通义千问** - Qwen-Plus 大语言模型
- **阿里云 DashScope** - 文本 Embedding (text-embedding-v3)
- **OpenAI SDK** - 兼容层调用阿里云 API
- **Supabase pgvector** - 向量相似度搜索 (match_products RPC)

---

## 项目结构

```
Web-For-HK/
├── .env                    # 环境变量配置
├── .env.example           # 环境变量模板
├── app.config.ts          # 应用配置（UI主题、按钮样式等）
├── app.vue                # 根组件
├── nuxt.config.ts         # Nuxt配置（模块、路由规则、i18n等）
├── package.json           # 依赖和脚本
│
├── assets/                # 静态资源
│   └── css/               # 全局样式
│
├── components/            # Vue组件（核心！）
│   ├── 3d/               # 3D场景组件
│   ├── admin/            # 后台管理组件
│   ├── contact/          # 联系表单
│   ├── home/             # 首页组件
│   ├── navigation/       # 导航组件
│   ├── news/             # 新闻组件
│   ├── products/         # 产品组件
│   ├── solutions/        # 解决方案组件
│   ├── swiss/            # Swiss设计系统组件
│   └── ui/               # 通用UI组件
│
├── composables/           # Vue组合式函数
│   ├── useDeviceDetection.ts    # 设备检测
│   ├── useStructuredData.ts     # 结构化数据
│   └── useSwissGrid.ts          # Swiss网格布局
│
├── layouts/               # 页面布局
│   ├── default.vue        # 默认布局（前台）
│   └── admin.vue          # 后台布局
│
├── pages/                 # 页面路由（文件路由）
│   ├── index.vue          # 首页
│   ├── products/          # 产品页面
│   ├── news/              # 新闻页面
│   ├── solutions/         # 解决方案页面
│   ├── about.vue          # 关于页面
│   ├── contact.vue        # 联系页面
│   └── admin/             # 后台管理页面
│
├── server/                # 服务端
│   ├── api/               # API端点
│   │   ├── products/      # 产品API
│   │   ├── news/          # 新闻API
│   │   ├── inquiries/     # 询盘API
│   │   ├── admin/         # 后台API
│   │   ├── ai-chat.ts     # AI聊天API (向量搜索+通义千问)
│   │   └── stats/         # 统计API
│   ├── middleware/        # 中间件
│   └── utils/             # 服务端工具
│
├── public/                # 公共静态文件
│   ├── robots.txt         # 搜索引擎爬虫配置
│   └── icon.png           # 网站图标
│
├── plugins/               # Nuxt插件
│   ├── gsap.client.ts     # GSAP动画库（客户端）
│   ├── seo.ts             # SEO插件
│   └── supabase-*.ts      # Supabase相关插件
│
├── middleware/            # Nuxt中间件
│   └── errorHandler.ts    # 错误处理中间件
│
├── stores/                # Pinia 状态管理
│   └── chat.ts            # AI 聊天会话状态
│
├── types/                 # TypeScript 类型定义
│   └── index.ts           # 主要类型
│
├── utils/                 # 前端工具函数
│   ├── apiHandler.ts      # API 处理
│   ├── imagePlaceholder.ts # 图片占位符
│   ├── logger.ts          # 日志工具
│   └── markdown.ts        # Markdown 处理工具
│
├── database/              # 数据库相关
│   └── migrations/        # 数据库迁移文件
│
├── docs/                  # 文档
│   ├── ADMIN_ENHANCEMENTS.md
│   ├── QUICK_START_ADMIN.md
│   └── IMPLEMENTATION_SUMMARY.md
│
├── i18n/                  # 国际化配置
│   └── locales/           # 语言文件
│       ├── zh-HK.json     # 繁体中文（香港）
│       ├── zh-CN.json     # 简体中文
│       └── en.json        # 英文
│
└── migration-assets/      # 迁移辅助资源
    └── scripts/           # 数据迁移脚本
```

---

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key

# AI 助手配置 (阿里云 DashScope)
DASHSCOPE_API_KEY=your_dashscope_api_key
```

### 开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

---

## 核心页面

### 前台页面

- **首页** (`/`) - 3D 场景 Hero 区块 + 产品分类展示
- **AI 智能助手** - 右下角悬浮聊天窗口，支持：
  - **产品咨询**：基于向量搜索的产品智能答疑
  - **多会话管理**：支持创建、切换、删除和重命名多个对话，状态通过 Pinia 持久化
  - **匿名识别**：基于浏览器指纹的匿名用户 ID 管理，确保非登录用户会话连续性
  - **成本控制**：内置每日 Token 消耗估算与限制功能
- **产品** (`/products`) - 产品列表和详情页
- **解决方案** (`/solutions`) - 解决方案展示
- **新闻** (`/news`) - 新闻列表和详情页
- **关于我们** (`/about`) - 公司介绍
- **联系我们** (`/contact`) - 联系表单

### 后台管理 (`/admin`)

- **仪表板** (`/admin`) - 系统概览、统计数据
- **产品管理** (`/admin/products`) - 产品 CRUD、批量操作
- **新闻管理** (`/admin/news`) - 新闻 CRUD、富文本编辑
- **询盘管理** (`/admin/inquiries`) - 客户询盘查看
- **全局搜索** - 跨资源实时搜索
- **活动日志** (`/admin/logs`) - 操作历史记录
- **登录** (`/admin/login`) - 管理员认证
- **AI 聊天管理** (`/admin/chat`)：
  - **数据看板**：每日消息量、Token 消耗、成本统计及响应性能指标可视化（ECharts）
  - **会话追踪**：查看和管理所有活跃会话，支持历史溯源

---

## 3D 场景说明

### 已实现功能 ✅

1. **程序化生成的粒子系统**
   - **零外部依赖**：完全使用代码生成，无需下载 3D 模型文件
   - **GPU 加速**：使用 Three.js ShaderMaterial 实现，性能优异
   - **高精度模型**：程序化生成的服务器机柜，包含：
     - 机柜框架（17.5U × 42U × 28U）
     - 7 台服务器（其中 3 台为高精度焦点服务器）
     - 详细的硬件组件：硬盘、风扇墙、主板、CPU 散热器、内存条、GPU
     - LED 指示灯（电源、硬盘状态灯）
   - **幽灵服务器效果**：背景服务器以深灰色低对比度呈现，营造景深感
   - **材质差异化渲染**：
     - 塑料材质（风扇）：圆形粒子，较大柔和
     - 金属材质（散热器、GPU）：方形粒子，较小锐利，带高光
     - 发光材质（LED、金色触点）：圆形粒子，带 Bloom 发光
   - **动态数据流**：PCB 主板上的青色数字雨脉冲效果（正弦波流动）
   - **气流粒子系统**：从风扇向后流动的淡蓝色透明粒子（可视化散热效果）
   - **有机噪声场**：爆炸阶段使用 Curl Noise 产生自然的扰动效果
   - **LOD (Level of Detail)**：动态调整粒子大小，基于相机距离自动缩小远景粒子并剔除极远粒子，优化性能并增强景深感（Depth of Field）

    - **Quantum Assembly 入场动画**：粒子从高熵随机状态通过 GSAP 缓动汇聚成有序模型，配合 Shader 实现透明度与位置的平滑过渡

2. **滚动触发的爆炸动画（Scrollytelling）**
   - **多阶段动画序列**：
     - 阶段 1：服务器滑出（Z 轴移动）
     - 阶段 2：机箱盖打开（向上掀起）
     - 阶段 3：组件爆炸解体（各部件沿不同方向展开）
   - **波浪延迟**：每台服务器依次触发动画，形成波浪效果
   - **文字内容协同**：滚动时文字内容淡出并上移，配合 3D 展示
   - **镜头运动**：相机从侧前方移动到正上方，保持最佳视角

3. **交互功能**
   - **鼠标视差效果**：模型跟随鼠标位置轻微旋转
   - **自动旋转**：OrbitControls 提供平滑的自动旋转
   - **动态缩放**：随滚动进度自动调整模型大小（0.75x - 1.3x）
   - **质量自适应**：Ultra/Medium 两种质量级别，自动选择最优配置
   - **交互式高亮系统**：
     - **动态 Hitbox 同步**：不可见的射线检测包围盒实时跟随爆炸动画位移与缩放，确保在任何动画阶段都能精准识别组件
     - **双面检测**：支持相机穿入模型内部时的内壁交互
     - **视觉反馈**：
       - 悬停焦点组件高亮（亮度 x1.8）
       - 非焦点组件自动压暗（透明度降至 30%）
       - 光标变为十字准星
   - **3D 投影注释系统**（Stage 3 爆炸阶段）：
     - **3D-to-2D 投影**：HTML 标签通过矩阵变换精准锁定 3D 组件屏幕坐标
     - **Swiss Design 风格**：极简白底、红色重音边框、等宽字体编号
     - **智能显隐 (Occlusion Culling)**：
       - **射线遮挡检测**：从相机向组件发射射线，若被其他组件遮挡则自动隐藏标签，防止视觉穿帮
       - **屏幕边缘剔除**：自动隐藏移出屏幕外的标签
     - **透视缩放 (Perspective Scaling)**：标签大小随组件距离动态缩放（0.5x - 1.2x），增强空间深度感
     - **动态聚焦**：悬停某标签时，该标签高亮并放大，其余标签自动变暗，引导视觉焦点

4. **后处理与视觉效果**
   - **HDR 渲染管线**：使用 HalfFloatType 浮点缓冲区支持高动态范围
   - **UnrealBloomPass 发光**：
     - 强度：1.0
     - 半径：0.5（柔和平滑）
     - 阈值：1.05（仅高亮部分发光）
   - **发光材质识别**：LED 指示灯、金色触点、黄色装饰自动发光
   - **白色背景优化**：通过 HDR 分离发光与白色背景（1.0）

5. **设备检测与降级**
   - 桌面端：完整 3D 粒子系统 + Post-Processing
   - 移动端：优化的降级方案 + 响应式视图偏移
   - `useDeviceDetection` composable 自动判断
   - 移动端特殊处理：初始位置更低避免标题遮挡，居中视图

6. **加载状态管理**
   - PlaceholderCanvas 加载占位符
   - ClientOnly 组件确保仅客户端渲染
   - 优雅的错误处理
   - 性能优先模式（powerPreference: "high-performance"）

---

## 动画系统

### 已实现的 GSAP 动画

1. **Hero 区域 3D Scrollytelling**
   - 滚动触发的 3D 服务器爆炸动画
   - 文字内容淡出并上移
   - 相机从侧前方移动到正上方
   - 模型动态缩放（0.75x - 1.3x）

2. **Feature Items 特性展示**
   - 分隔线扩展动画
   - 文字上滑淡入
   - 数字淡入效果
   - 交错显示（stagger）

3. **News Cards 新闻卡片**
   - 批量触发动画（ScrollTrigger.batch）
   - 上滑淡入效果
   - 交错延迟显示

4. **Reveal Sections 区域淡入**
   - 通用淡入效果
   - 触发点：元素顶部到达视口 85%

---

## 设计系统

### Swiss 配色方案

```css
Background: #F5F5F7 (mica gray)
Text: #1D1D1F (deep charcoal)
Secondary: #86868b (metal gray)
Accent: #0071e3 (international blue)
```

### 排版系统

```css
Display: 48px / 4rem
H1: 36px / 3rem
H2: 30px / 2.5rem
H3: 24px / 2rem
H4: 20px / 1.25rem
H5: 16px / 1rem
H6: 14px / 0.875rem
```

### Swiss 设计原则

1. **极简主义** - 去除一切非必要元素
2. **网格系统** - 数学化精确布局
3. **无衬线字体** - Inter + Noto Sans HK
4. **负空间** - 40% 以上留白
5. **克制的色彩** - 黑、白、灰为主，国际蓝点缀

---

## 性能优化

### 已实现的优化 ✅

- **WebP 图片格式** - 体积减少 25-35%
- **响应式图片** - 根据屏幕尺寸加载合适尺寸
- **图片懒加载** - 列表页延迟加载
- **图片预加载** - 关键图片优先加载
- **Blur 占位符** - 改善感知体验
- **高 DPI 支持** - 视网膜屏幕优化
- **ISR 缓存策略** - 增量静态再生
- **代码分割** - Nuxt 自动优化
- **性能监控** - Core Web Vitals 追踪（LCP、FID、CLS）

---

## SEO 配置

### 已实现 ✅

- **Meta 标签** - 完整的页面元信息
- **Open Graph** - 社交媒体分享优化
- **Twitter Cards** - Twitter 分享卡片
- **Canonical URL** - 避免重复内容
- **动态 Sitemap** - 从数据库自动生成
- **Robots.txt** - 搜索引擎爬虫配置
- **结构化数据** - JSON-LD 格式
  - 产品结构化数据
  - 文章结构化数据
  - 组织结构化数据
  - 面包屑结构化数据

---

## 可访问性（A11y）

### 已实现 ✅

- **完整 ARIA 标签**
  - 导航：aria-label、aria-current、role
  - 语言切换器：aria-haspopup、aria-expanded、aria-selected
  - 表单：aria-required、autocomplete
  - 按钮：aria-label 描述
- **键盘导航** - 全功能支持
- **焦点管理** - 清晰的焦点指示
- **屏幕阅读器优化** - 语义化 HTML 标签

---

## AI 助手功能

### 系统架构

**RAG (检索增强生成) 流程**：

```
┌─────────────────┐
│  数据写入流程   │
└─────────────────┘
管理员更新产品
    ↓
Supabase Webhook
    ↓
Edge Function (数据清洗)
    ↓
生成向量 (1024维)
    ↓
写入 product_embeddings 表

┌─────────────────┐
│  用户查询流程   │
└─────────────────┘
用户提问
    ↓
生成问题向量
    ↓
pgvector 相似度搜索
    ↓
匹配 Top 5 产品
    ↓
组装 Prompt
    ↓
Qwen-Plus 流式生成
    ↓
前端实时显示
```

### 技术实现

**前端组件** (`components/ui/AiChat.vue`)
- Vercel AI SDK 的 `useChat` hook
- Swiss Design 风格 UI
- Markdown 渲染 (marked)
- 自动滚动、加载动画

**后端 API** (`server/api/ai-chat.ts`)
- 阿里云 text-embedding-v3 (1024 维向量)
- Supabase pgvector 相似度搜索
- 通义千问 Qwen-Plus
- 流式响应 (DataStreamResponse)

**自动化向量化** (Supabase Edge Function)
- 监听 `products` 表的 INSERT/UPDATE
- 自动清洗 JSON 数据为自然语言
- 生成并更新向量到 `product_embeddings` 表
- 全自动化，无需手动同步

### 数据库设计

**核心表结构**：
- `products` - 原产品表（多语言 JSONB）
- `product_embeddings` - 向量表（关联 products）
  - `content` - 清洗后的自然语言文本
  - `embedding` - 1024 维向量 (vector(1024))
- `match_products` - RPC 搜索函数

**关键 SQL**：
```sql
-- 向量相似度搜索
select * from match_products(
  query_embedding => '[...]',  -- 用户问题向量
  match_threshold => 0.5,      -- 相似度阈值
  match_count => 5             -- 返回数量
)
```

### 常见问题与解决

**问题 1：配置文件修改后页面白屏**
- **原因**：Nuxt 缓存未更新
- **解决**：删除 `.nuxt` 文件夹并重启

**问题 2：API 请求被拦截 (302)**
- **原因**：Supabase 路由保护
- **解决**：在 `nuxt.config.ts` 中添加 `/api/ai-chat` 到白名单

**问题 3：向量维度错误**
- **原因**：阿里云模型是 1024 维，不是 1536
- **解决**：数据库使用 `vector(1024)`

详细技术文档：[AI_FEATURES.md](./docs/AI_FEATURES.md)

### 特性

- 🔍 **语义搜索** - 基于向量相似度，理解用户意图
- 📅 **多会话支持** - 支持创建多个独立聊天会话，自动保存历史记录
- 📊 **上下文感知** - 自动关联产品库信息及当前对话上下文
- 🌐 **多语言支持** - 繁体中文/简体中文/英文
- ⚡ **流式响应** - 实时打字效果，改善用户体验
- 🛡️ **安全渲染** - 使用 DOMPurify 过滤，防止 XSS 攻击
- 🎯 **精准匹配** - 相似度阈值 0.5，返回 Top 5 相关产品
- 🤖 **自动化同步** - 产品更新自动生成向量，无需人工干预

---

## CMS 后台功能

### 产品管理

- 列表视图（表格 + 缩略图）
- 多语言编辑器（Tab 切换）
- 规格参数生成器（Key-Value）
- 图片上传（拖拽、预览）
- 批量操作（删除、发布、草稿）
- 数据导出（JSON/CSV）

### 新闻管理

- 富文本编辑器（Tiptap）
- Markdown 支持
- 封面图管理
- 标签系统
- 发布时间控制
- 批量删除
- 数据导出

### 询盘管理

- 客户留言查看
- 状态追踪（new, contacted, closed）
- 批量操作
- 数据导出

### 其他功能

- **全局搜索** - 跨产品/新闻/询盘实时搜索
- **活动日志** - 完整操作历史追踪
- **数据统计** - 产品/新闻/询盘数量统计
- **图片上传组件** - 支持拖拽、预览、压缩

---

## 数据库架构

### 核心表结构

1. **products** - 产品表（多语言名称、JSONB 规格、向量 Embedding）
   - `embedding` 列：1024 维向量（阿里云 text-embedding-v3）
   - `match_products` RPC 函数：向量相似度搜索
2. **posts** - 资讯/博客表（多语言内容）
3. **solutions** - 解决方案表
4. **inquiries** - 客户询盘表
5. **admin_logs** - 管理员操作日志
6. **profiles** - 管理员权限表（Supabase Auth 扩展）

### 存储桶（Storage Buckets）

- **product-assets** - 产品图片和 3D 模型
- **site-media** - 网站媒体资源

### 安全策略

- **RLS（Row Level Security）** - 行级安全控制
- **Public** - 仅 SELECT 权限（已发布内容）
- **Admin** - 完整 CRUD 权限

---

## 部署

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

此项目可以部署到任何支持 Node.js 的平台：

- Netlify
- AWS Amplify
- Railway
- 自建服务器

### 环境变量配置

在部署平台设置以下环境变量：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

---

## Git 工作流

```bash
# 创建功能分支
git checkout -b feat/new-feature

# 提交变更
git add .
git commit -m "feat: add new feature"

# 推送到远程
git push origin feat/new-feature
```

### 提交信息规范

使用 Conventional Commits：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 重构
- `perf:` - 性能优化
- `test:` - 测试
- `chore:` - 构建过程或辅助工具变动

---

## 浏览器支持

- Chrome/Edge (最新版)
- Safari (最新版)
- Firefox (最新版)
- Mobile Safari iOS 14+
- Chrome Android 10+



---

## 文档

- [管理后台快速开始](./docs/QUICK_START_ADMIN.md)
- [后台功能增强说明](./docs/ADMIN_ENHANCEMENTS.md)
- [AI 助手功能开发指南](./docs/AI_FEATURES.md) - RAG 系统架构、数据库设计、负载均衡
- [AI 助手增强计划](./docs/AI%20%E5%8A%A9%E6%89%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%AE%A1%E5%88%92.md) - 持久化与安全性路线图
- [实现总结](./docs/IMPLEMENTATION_SUMMARY.md)

---

## 许可证

MIT License

---

**SUPERCORE TECHNOLOGY LIMITED** - 为香港及海外市场提供专业基础设施解决方案

**Website**: https://www.supercore.hk
**Email**: info@supercore.hk
