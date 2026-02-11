# <img src="./public/icon.png" width="32" height="32" /> XX TECHNOLOGY LIMITED

<p align="left">
  <img src="https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
</p>

> **瑞士国际主义风格的企业级基础设施解决方案官网**  
> _A premium enterprise infrastructure solutions portal for Hong Kong and overseas markets._

---

## 📖 项目概述 | Overview

这是一个为香港及海外市场提供高端基础设施解决方案的企业官网，采用现代化的技术栈和逻辑严密的 **瑞士国际主义 (Swiss International Style)** 设计理念。

### 🏢 公司信息 | Company Info
| 属性 | 内容 |
| :--- | :--- |
| **公司名称 (中)** | XX科技有限公司 |
| **公司名称 (EN)** | XX TECHNOLOGY LIMITED |
| **公司地址 (中)** | 香港九龙 |
| **Address (EN)** | Kowloon, Hong Kong |

### 🎬 GIF 演示
<p align="center">
  <img src="https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_c7c48c53f058cbe67efb00ee1143a049.gif" width="100%" style="border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
</p>

---

## ✨ 核心特性 | Key Features

✨ **视觉设计 (Design)**
- 🎨 **Swiss International Style** - 极简主义设计，40%+ 负空间
- 🎭 **3D 粒子系统** - 程序化生成的 GPU 加速 3D 服务器，滚动触发爆炸动画
- 🎬 **Scrollytelling 动画** - 流畅的滚动触发 3D 展示与交互动画

🌐 **核心功能 (Features)**
- 🌍 **多语言支持** - 繁体中文（香港）、简体中文、English
- 🤖 **AI 智能助手** - 基于阿里云通义千问的 RAG 客服系统，支持匿名识别、多会话持久化及每日 Token 限制
- 📱 **响应式设计** - 桌面端完整 3D + 移动端优化降级

🛠️ **工程化与后台 (Engineering)**
- ⚡ **性能优化** - GPU 加速渲染、WebP 图片、懒加载、ISR 缓存策略
- 🔍 **SEO 友好** - 结构化数据、动态 Sitemap、完整 Meta 标签
- ♿ **可访问性** - 完整 ARIA 标签、键盘导航支持
- 🛠️ **完整 CMS 后台** - 产品/新闻/询盘管理、批量操作、全局搜索、AI 统计与会话管理

---

## 🛠️ 技术栈 | Tech Stack

### 🚀 前端框架 (Frontend)
- **Nuxt 3** - Vue 3 SSR 框架
- **TypeScript** - 严格类型检查
- **Vue 3 Composition API** - 响应式开发
- **Pinia** - 状态管理库 (Chat Session 管理等)

### 🎨 样式与交互 (Styling & Interaction)
- **Tailwind CSS** - 实用工具 CSS 框架
- **Nuxt UI** - 基于 Tailwind 的 UI 组件库
- **Swiss Design System** - 自定义设计系统
- **GSAP + ScrollTrigger** - 滚动动画系统
- **Lenis** - 平滑滚动体验
- **字体**: Inter + Noto Sans HK

### 📦 动画与 3D (Animation & 3D)
- **Three.js** - 3D 渲染引擎（桌面端）
- **GPU 粒子系统** - ShaderMaterial 实现的高性能粒子效果
- **Post-Processing** - UnrealBloomPass 发光效果、HDR 渲染
- **Raycasting 交互** - 鼠标悬停高亮、3D 注释标签跟随

### 🗄️ 数据与内容 (Data & Content)
- **Supabase** - 提供全栈后端支持，包含 PostgreSQL (pgvector)、Auth 认证、S3 兼容存储及 Edge Functions 自动化逻辑
- **多语言 i18n** - 完整翻译支持
- **Tiptap** - 富文本编辑器
- **DOMPurify + marked** - 安全的 Markdown 渲染 (useSafeMarkdown)

### 🧠 AI 与向量搜索 (AI Integration)
- **Vercel AI SDK** - AI 流式响应框架
- **阿里云通义千问** - Qwen-Plus 大语言模型
- **阿里云 DashScope** - 文本 Embedding (text-embedding-v3)
- **OpenAI SDK** - 兼容层调用阿里云 API
- **Supabase pgvector** - 向量相似度搜索 (match_products RPC)

---

## 📂 项目结构 | Project Structure

```bash
Web-For-HK/
├── .env                    # 环境变量配置
├── .env.example           # 环境变量模板
├── app.config.ts          # 应用配置（UI主题、按钮样式等）
├── app.vue                # 根组件
├── nuxt.config.ts         # Nuxt配置（模块、路由规则、i18n等）
├── package.json           # 依赖和脚本
├── assets/                # 静态资源
│   └── css/               # 全局样式
├── components/            # Vue组件
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
├── composables/           # Vue组合式函数
│   ├── useDeviceDetection.ts    # 设备检测
│   ├── useStructuredData.ts     # 结构化数据
│   └── useSwissGrid.ts          # Swiss网格布局
├── layouts/               # 页面布局
├── pages/                 # 页面路由
├── server/                # 服务端
│   ├── api/               # API端点 (Products, News, Inquiries, Admin, AI, Stats)
│   ├── middleware/        # 中间件
│   └── utils/             # 服务端工具
├── public/                # 静态文件
├── plugins/               # Nuxt插件 (GSAP, SEO, Supabase)
├── stores/                # Pinia 状态管理
├── types/                 # TypeScript 类型定义
├── utils/                 # 前端工具函数
├── database/              # 数据库迁移
└── docs/                  # 技术文档
```

---

## 🖼️ 页面截图 | Page Screenshots

### 🏠 首页 | Homepage

![首页截图 - Hero区域](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_e5aa933799a57be14f8f0f79850d3ca0.webp)

![首页截图 - 产品分类](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_55fc1b687a344107d5c95899cdec96d5.webp)

![首页截图 - 3D服务器动画](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_5fb1216b41f0180e3d2f8906854305d0.webp)

---

### 🤖 AI 智能助手 | AI Assistant

![AI助手 - 聊天界面](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_60221f428a6d597b8615b2b2182bfedf.webp)

![AI助手 - 产品咨询](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_a8402d41ccaa6ec756218a0ae6f8831f.webp)

---

### 📦 产品页面 | Products

![产品列表页](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_841d9d4cf76149a7bdf43a46ff8d766b.webp)

![产品详情页](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_5195d79427766fd85e7903c76a2e4899.webp)

---

### 💡 解决方案页面 | Solutions

![解决方案页面](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_780bf1729065743582fd517b8e55db17.webp)

---

### 📰 新闻页面 | News

![新闻列表页](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_ff4ad5c0e6f61d6b1ca8e9f3d8d134f2.webp)

---

### 🏢 关于页面 | About

![关于我们页面](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_1f7196183d4a5fa7d44aea6d495fa218.webp)

---

### 📝 表单页面 | Contact

![联系我们表单页](https://pub-f8d3afa0c3274f1e943ee2f8c45dff96.r2.dev/26_02_0f951a23b647df06eec3d9ead5f77905.webp)

---

## 🚀 快速开始 | Quick Start

### 1️⃣ 环境要求
- Node.js 18+
- npm 或 yarn 或 pnpm

### 2️⃣ 安装与运行
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
访问 http://localhost:3000

### 3️⃣ 配置环境变量
创建 `.env` 文件：
```env
# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key

# AI 助手配置 (阿里云 DashScope)
DASHSCOPE_API_KEY=your_dashscope_api_key
```

### 4️⃣ 构建与部署
```bash
npm run build   # 构建生产版本
npm run preview # 预览生产版本
```

---

## 🖼️ 核心页面 | Core Pages

### 📍 前台页面
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

### 🔐 后台管理 (`/admin`)
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

## 🧊 3D 场景说明 | 3D Scene Details

### ✅ 已实现功能
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

5. **设备检测与加载**
   - **降级方案**：移动端自动选择优化的降级方案 + 响应式视图偏移
   - **状态管理**：PlaceholderCanvas 加载占位符，ClientOnly 确保渲染安全

---

## 🎬 动画系统 | Animation System

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

## ⚡ Supabase 核心架构 | Infrastructure
Supabase 为本项目提供了稳定且高性能的后端基础设施，实现了从认证到存储的全栈能力。

### 🔑 认证系统 (Authentication)
- **管理员权限控制**：基于 Supabase Auth 的安全认证体系。
- **持久化会话**：支持会话状态的持久化管理，确保管理后台的安全性。

### 🗄️ 数据库架构 (PostgreSQL)
- **关系型数据模型**：高效管理产品 (`products`)、新闻 (`posts`)、询盘 (`inquiries`) 等核心资源。
- **行级安全策略 (RLS)**：
  - **Public**：仅允许匿名访问已发布的内容。
  - **Admin**：通过身份验证后的管理员拥有完整的 CRUD 权限。
- **操作日志**：自动记录管理员的操作审计轨迹 (`admin_logs`)。

### ☁️ 对象存储 (Storage Buckets)
- **product-assets**：存储高分辨率产品图片及 3D 模型。
- **site-media**：管理网站静态媒体资源。
- **性能优化**：内置图片压缩与 CDN 加快全球访问速度。

### 🧠 向量搜索与自动化 (AI & Vector)
- **pgvector 支持**：内置 1024 维向量索引，支持高效的语义相似度检索。
- **自动化 Webhooks**：
  - 监听数据库变更，实时触发 Edge Functions。
  - 自动执行内容清洗与向量化同步，确保 AI 助手知识库的即时性。

---

## 📈 性能与 SEO | Performance & SEO

- ✅ **性能优化**: WebP 图片, 响应式图片加载, 懒加载, ISR 缓存策略, 代码分割
- ✅ **SEO 配置**: Meta 标签, Open Graph, Twitter Cards, 动态 Sitemap, Robots.txt
- ✅ **结构化数据**: JSON-LD 格式 (Products, Articles, Org, Breadcrumbs)

---

## 📄 后台功能与文档 | CMS & Docs

### 🛠️ CMS 后台
- **产品管理**: 多语言编辑, 规格生成器, 批量操作
- **新闻管理**: Tiptap 富文本, 标签系统, 时间控制
- **询盘管理**: 状态追踪, 数据导出 (JSON/CSV)
- **全局搜索 & 日志**: 跨资源搜索, 完整管理员操作历史

### 📘 相关文档
- [管理后台快速开始](./docs/QUICK_START_ADMIN.md)
- [后台功能增强说明](./docs/ADMIN_ENHANCEMENTS.md)
- [AI 助手功能开发指南](./docs/AI_FEATURES.md)
- [AI 助手增强计划](./docs/AI%20%E5%8A%A9%E6%89%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%AE%A1%E5%88%92.md)
- [实现总结](./docs/IMPLEMENTATION_SUMMARY.md)

---

### 📜 许可证 | License
MIT License

---

### 📞 联系我们 | Contact
**XX TECHNOLOGY LIMITED**
🌐 **Website**: [www.example.com](https://www.example.com)
📧 **Email**: [contact@example.com](mailto:contact@example.com)

---
<p align="center">Built with ❤️ by XX Team</p>
