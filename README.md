# SUPERCORE TECHNOLOGY LIMITED

> 瑞士國際主義風格的企業級基礎設施解決方案官網

## 專案概述

這是一個為香港及海外市場提供高端基礎設施解決方案的企業官網，採用現代化的技術棧和設計理念。

公司名稱：超核技術有限公司
公司地址：九龍尖沙咀科學館道14號新文華中心B座7樓701室108單位

Company Name:SUPERCORE TECHNOLOGY LIMITED
Company Address:ROOM 701 UNIT 108 7/F TOWER B NEW MANDARIN PLAZA 14 SCIENCE MUSEUM ROAD TSIM SHA TSUI KL

香港公司 SUPERCORE TECHNOLOGY LIMITED

### 核心特性

- 🎨 **Swiss International Style** - 極簡主義設計，40%+ 負空間
- 🌐 **多語言支持** - 繁體中文（香港）、简体中文、English
- 🎭 **3D 滾動敘事** - 使用 Three.js 實現伺服器爆炸動畫
- 📱 **響應式設計** - 桌面端 3D + 移動端優化降級
- ⚡ **性能優化** - ISR 緩存策略，優化首屏加載
- 🔍 **SEO 友好** - 完整的 SEO 配置和 sitemap

## 技術棧

### 前端框架

- **Nuxt 3** - Vue 3 SSR 框架
- **TypeScript** - 嚴格類型檢查
- **Vue 3 Composition API** - 響應式開發

### 樣式與設計

- **Tailwind CSS** - 實用工具 CSS 框架
- **Swiss Design System** - 自定義設計系統
- **自定義字體** - Inter + Noto Sans HK

### 動畫與 3D

- **Three.js** - 3D 渲染引擎
- **GSAP + ScrollTrigger** - 滾動動畫
- **Lenis** - 平滑滾動體驗

### 數據與內容

- **模擬數據層** - 獨立前端開發
- **多語言 i18n** - 完整翻譯支持

## 項目結構

```
Web-For-HK/
├── assets/              # 靜態資源
├── components/          # Vue 組件
│   ├── 3d/             # 3D 場景組件
│   ├── navigation/     # 導航組件
│   ├── products/       # 產品組件
│   ├── solutions/      # 解決方案組件
│   ├── contact/        # 聯絡表單組件
│   └── swiss/          # Swiss 設計組件
├── composables/        # Vue composables
├── layouts/            # 頁面佈局
├── pages/              # 頁面路由
├── public/             # 公共資源
├── server/             # 服務器端 API
├── types/              # TypeScript 類型
└── utils/              # 工具函數
```

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發服務器

```bash
npm run dev
```

訪問 http://localhost:3000

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 核心頁面

- **首頁** (`/`) - 3D 動畫 Hero 區塊 + 特性展示
- **產品** (`/products`) - 產品列表和詳情
- **解決方案** (`/solutions`) - 分類解決方案展示
- **關於我們** (`/about`) - 公司介紹和發展歷程
- **聯絡我們** (`/contact`) - 聯絡表單和資訊

## 動畫系統

### 4 階段滾動動畫

1. **淡入** (0-20%) - 立方體從小到大放大
2. **機櫃打開** (20-50%) - 旋轉並移動展示內部
3. **組件爆炸** (50-80%) - 組件向外散開
4. **重新組裝** (80-100%) - 組件重新組合

### 設備檢測

- 桌面端：完整 3D 動畫體驗
- 移動端：優化的降級方案（靜態圖片 + 動畫）

## 設計系統

### Swiss 顏色

- Background: `#F5F5F7` (mica gray)
- Text: `#1D1D1F` (deep charcoal)
- Secondary: `#86868b` (metal gray)
- Accent: `#0071e3` (international blue)

### 排版

- Display: 48px / 4rem
- H1: 36px / 3rem
- H2: 30px / 2.5rem
- H3: 24px / 2rem
- H4: 20px / 1.25rem
- H5: 16px / 1rem
- H6: 14px / 0.875rem

## 部署

### Vercel (推薦)

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

此項目可以部署到任何支持 Node.js 的平台：

- Netlify
- AWS Amplify
- Railway
- 自建伺服器

## 環境變量

創建 `.env` 文件：

```env
# API 端點（未來使用）
NUXT_PUBLIC_API_URL=https://api.supercore.com.hk
```

## Git 工作流

```bash
# 創建功能分支
git checkout -b feat/new-feature

# 提交變更
git add .
git commit -m "feat: add new feature"

# 推送到遠端
git push origin feat/new-feature
```

## 性能優化

- ✅ ISR 緩存策略
- ✅ 圖片懶加載（待實現）
- ✅ 代碼分割
- ✅ Tree shaking
- ✅ Gzip 壓縮
- ✅ CDN 邊緣節點

## SEO 配置

- ✅ Meta tags
- ✅ Open Graph
- ✅ Twitter Cards
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ 結構化數據（待實現）

## 瀏覽器支持

- Chrome/Edge (最新版)
- Safari (最新版)
- Firefox (最新版)
- Mobile Safari iOS 14+
- Chrome Android 10+

## 許可證

MIT License

---

**SUPERCORE TECHNOLOGY LIMITED** - 為香港及海外市場提供專業基礎設施解決方案

# 第一部分：数据库架构设计 (Supabase PostgreSQL)

我们不需要复杂的几十张表，只需 **6 张核心表** 即可支撑整个业务。

### 1. 核心表结构 (Schema Design)

#### A. `products` (产品表 - 核心资产)

这是最复杂的表，利用 `JSONB` 存储多语言和不定的规格参数。

| **字段名**     | **类型**  | **说明**          | **示例数据 (JSON 结构)**                                                      |
| -------------- | --------- | ----------------- | ----------------------------------------------------------------------------- |
| `id`           | int8      | 主键              | 1001                                                                          |
| `slug`         | text      | URL 标识 (Unique) | `supercore-g2-server`                                                             |
| `name`         | **jsonb** | **多语言名称**    | `{"hk": "SUPERCORE G2 伺服器", "cn": "SUPERCORE G2 服务器", "en": "SUPERCORE G2 Server"}` |
| `description`  | **jsonb** | **多语言简介**    | `{"hk": "专为 AI 训练设计...", "en": "Designed for AI..."}`                   |
| `category`     | text      | 分类              | `server`, `storage`, `network`                                                |
| `specs`        | **jsonb** | **规格参数**      | `{"cpu": "2x AMD EPYC", "ram": "2TB", "gpu": "8x H100"}`                      |
| `images`       | text[]    | 图片数组          | `["/p/server-front.png", "/p/server-open.png"]`                               |
| `model_3d_url` | text      | Spline/GLB 链接   | `https://prod.spline.design/...`                                              |
| `is_featured`  | bool      | 首页推荐          | `true`                                                                        |
| `status`       | text      | 状态              | `published`, `draft`, `archived`                                              |

#### B. `posts` (资讯/博客表)

用于发布行业动态和公司新闻。

| **字段名**     | **类型**    | **说明**             | **示例数据**                                    |
| -------------- | ----------- | -------------------- | ----------------------------------------------- |
| `id`           | int8        | 主键                 |                                                 |
| `title`        | **jsonb**   | 多语言标题           | `{"hk": "本公司获得...", "en": "We won..."}`    |
| `content`      | **jsonb**   | 多语言正文(Markdown) | `{"hk": "# 大事记...", "en": "# Milestone..."}` |
| `cover_image`  | text        | 封面图               | 必须是黑白或去底风格                            |
| `published_at` | timestamptz | 发布时间             |                                                 |
| `tags`         | text[]      | 标签                 | `["AI", "Infrastructure"]`                      |

#### C. `solutions` (解决方案表)

用于展示“IDC建设”、“运维咨询”等非实体产品。

| **字段名** | **类型** | **说明**                           |
| ---------- | -------- | ---------------------------------- |
| `id`       | int8     | 主键                               |
| `title`    | jsonb    | 多语言标题                         |
| `icon`     | text     | Lucide 图标代号 (如 `ServerCrash`) |
| `features` | jsonb    | 核心卖点列表                       |

#### D. `inquiries` (客户询盘表)

存储联系表单提交的数据。

| **字段名** | **类型** | **说明**                     |
| ---------- | -------- | ---------------------------- |
| `id`       | int8     | 主键                         |
| `email`    | text     | 客户邮箱                     |
| `company`  | text     | 公司名称                     |
| `message`  | text     | 留言内容                     |
| `status`   | text     | `new`, `contacted`, `closed` |

#### E. `site_config` (全站配置 - 这里的“开关”很重要)

用于控制网站的全局状态，无需重新部署代码。

| **字段名** | **类型** | **说明** | **示例**                                   |
| ---------- | -------- | -------- | ------------------------------------------ |
| `key`      | text     | 配置键   | `promo_banner`                             |
| `value`    | jsonb    | 配置值   | `{"enabled": true, "text_hk": "双11优惠"}` |

#### F. `profiles` (管理员表)

Supabase Auth 的扩展表，用于通过 RLS 控制后台访问权限。

---

### 2. 存储设计 (Storage Buckets)

在 Supabase Storage 创建两个公开的 Bucket：

1. **`product-assets`**: 存放去底的产品 PNG、3D 模型文件。
2. **`site-media`**: 存放博客封面、Banner 图。

**关键策略：** 开启 Supabase 的 Image Transformation 功能。前端请求图片时，可以加上 `?width=800&format=webp`，自动优化性能。

---

### 3. 安全策略 (RLS - Row Level Security)

这是最重要的一步，防止数据库裸奔。

- **Public (匿名用户):** 仅拥有 `products`, `posts`, `solutions` 的 `SELECT` 权限 (且 `status = 'published'`)。
- **Admin (管理员):** 拥有所有表的 `ALL` 权限 (CRUD)。

---

# 第二部分：管理后台设计 (Admin Panel)

**设计原则：** 后台也要“瑞士风”。简洁、克制、无废话。不要用花哨的 Admin 模板，直接用 Nuxt UI 手写布局。

### 1. 技术栈

- **框架:** Nuxt 3 (与前台在同一个项目中，路由为 `/admin/...`)
- **UI 组件:** **Nuxt UI** (基于 Tailwind，自带 Dark Mode，极简风格)。
- **编辑器:** **Tiptap** (Headless 富文本编辑器) 或 **Vue-Markdown-Editor**。

### 2. 功能模块规划 (Sitemap)

- **`/admin/login`**: 极简登录页 (Email + Password)。
- **`/admin/dashboard`**:
  - 显示今日询盘数量。
  - 显示网站当前的“系统状态” (3D 地球是否开启，促销条是否开启)。
- **`/admin/products`**:
  - **列表页:** 表格展示，带缩略图。
  - **编辑页 (重点):**
    - _基本信息:_ 输入框。
    - _多语言切换器:_ 一个 Tab 栏 `[ 繁体 | 简体 | English ]`，切换 Tab 时输入框绑定的 JSON 字段不同。
    - _规格生成器:_ "Add Spec" 按钮，点击添加一行 `Key - Value` 键值对。
    - _图片上传:_ 拖拽上传区，上传后自动显示预览，**并强制提示：“请确保图片为透明背景 PNG”**。
- **`/admin/news`**: Markdown 编辑器。
- **`/admin/inquiries`**: 查看客户留言。

---

# 第三部分：防呆设计与工作流 (The Workflow)

为了确保同事（非技术人员）不会破坏网站美感，后台必须加入“硬限制”。

### 1. 自动化的图片处理

在后台上传图片时，触发 Supabase Edge Function 或前端 JS：

- **限制:** 仅允许 PNG/JPG/WEBP。
- **压缩:** 上传前自动调用 `browser-image-compression` 库进行压缩。
- **校验:** 如果图片长宽比太离谱（比如超长条），弹出警告。

### 2. 多语言自动补全 (AI 辅助)

在编辑产品时，增加一个 **"✨ AI Translate"** 按钮。

- **逻辑:** 同事只输入“繁体中文”的内容，点击按钮，调用 OpenAI/Gemini API，自动填好“简体中文”和“英文”的输入框。
- **Prompt:** _"Translate this technical server description into Hong Kong Traditional Chinese (professional IT terminology) and English."_

### 3. 内容预览 (Preview Mode)

在发布前，必须提供一个 **"Preview"** 按钮。

- 点击后，弹出一个新窗口，渲染真实的前端页面（传入 `preview=true` 参数，让 RLS 允许读取 draft 状态的数据）。
- 让同事看到：“哦，原来我这段字太长了，把排版撑破了”，然后回去改。
