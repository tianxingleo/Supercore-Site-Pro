# SUPERCORE TECHNOLOGY LIMITED

> 瑞士國際主義風格的企業級基礎設施解決方案官網

## 專案概述

這是一個為香港及海外市場提供高端基礎設施解決方案的企業官網，採用現代化的技術棧和設計理念。

**公司名稱**：超核技術有限公司
**公司地址**：九龍尖沙咀科學館道14號新文華中心B座7樓701室108單位

**Company Name**: SUPERCORE TECHNOLOGY LIMITED
**Company Address**: ROOM 701 UNIT 108 7/F TOWER B NEW MANDARIN PLAZA 14 SCIENCE MUSEUM ROAD TSIM SHA TSUI KL

---

## 核心特性

- 🎨 **Swiss International Style** - 極簡主義設計，40%+ 負空間
- 🌐 **多語言支持** - 繁體中文（香港）、简体中文、English
- 🎭 **3D 交互場景** - Three.js 3D 伺服器模型展示
- 📱 **響應式設計** - 桌面端 3D + 移動端優化降級
- 🎬 **GSAP 動畫** - 流暢的滾動觸發動畫效果
- ⚡ **性能優化** - WebP 圖片、懶加載、ISR 緩存策略
- 🔍 **SEO 友好** - 結構化數據、動態 Sitemap、完整 Meta 標籤
- ♿ **可訪問性** - 完整 ARIA 標籤、鍵盤導航支援
- 🛠️ **完整 CMS 後台** - 產品/新聞/詢盤管理、批量操作、全局搜索

---

## 技術棧

### 前端框架
- **Nuxt 3** - Vue 3 SSR 框架
- **TypeScript** - 嚴格類型檢查
- **Vue 3 Composition API** - 響應式開發

### 樣式與設計
- **Tailwind CSS** - 實用工具 CSS 框架
- **Nuxt UI** - 基於 Tailwind 的 UI 組件庫
- **Swiss Design System** - 自定義設計系統
- **字體**: Inter + Noto Sans HK

### 動畫與 3D
- **Three.js** - 3D 渲染引擎（桌面端）
- **GSAP + ScrollTrigger** - 滾動動畫系統
- **Lenis** - 平滑滾動體驗

### 數據與內容
- **Supabase** - PostgreSQL 資料庫 + 認證 + 儲存
- **多語言 i18n** - 完整翻譯支持
- **Tiptap** - 富文本編輯器

---

## 項目結構

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
│   ├── usePerformanceMonitor.ts # 性能监控
│   ├── useServerAnimation.ts    # 服务端动画
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
│   │   └── stats/         # 统计API
│   ├── middleware/        # 中间件
│   └── utils/             # 服务端工具
│
├── public/                # 公共静态文件
│   ├── models/            # 3D模型文件
│   │   └── server/        # 服务器模型（4.8MB）
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
├── types/                 # TypeScript类型定义
│   └── index.ts           # 主要类型
│
├── utils/                 # 前端工具函数
│   ├── apiHandler.ts      # API处理
│   ├── imagePlaceholder.ts # 图片占位符
│   └── logger.ts          # 日志工具
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

## 快速開始

### 環境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安裝依賴

```bash
npm install
```

### 配置環境變量

創建 `.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
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

---

## 核心頁面

### 前台頁面

- **首頁** (`/`) - 3D 場景 Hero 區塊 + 產品分類展示
- **產品** (`/products`) - 產品列表和詳情頁
- **解決方案** (`/solutions`) - 解決方案展示
- **新聞** (`/news`) - 新聞列表和詳情頁
- **關於我們** (`/about`) - 公司介紹
- **聯絡我們** (`/contact`) - 聯絡表單

### 後台管理 (`/admin`)

- **儀表板** (`/admin`) - 系統概覽、統計數據
- **產品管理** (`/admin/products`) - 產品 CRUD、批量操作
- **新聞管理** (`/admin/news`) - 新聞 CRUD、富文本編輯
- **詢盤管理** (`/admin/inquiries`) - 客戶詢盤查看
- **全局搜索** - 跨資源實時搜索
- **活動日誌** (`/admin/logs`) - 操作歷史記錄
- **登錄** (`/admin/login`) - 管理員認證

---

## 3D 場景說明

### 已實現功能 ✅

1. **完整的 Three.js 場景框架**
   - 場景、相機、渲染器配置
   - 環境光、平行光、輪廓光照明系統
   - 鼠標視差效果（3D 模型跟隨鼠標移動）

2. **真實的 3D 伺服器模型**
   - 模型文件：`public/models/server/model.obj` (4.8MB, 38,006 面)
   - 材質文件：`public/models/server/model.mtl` (9 種材質)
   - 自動縮放和居中對齊

3. **設備檢測與降級**
   - 桌面端：完整 3D 場景
   - 移動端：靜態圖片降級方案
   - `useDeviceDetection` composable 自動判斷

4. **加載狀態管理**
   - PlaceholderCanvas 加載占位符
   - 加載進度顯示
   - 優雅的錯誤處理

### 待完善功能 📋

- 機櫃門開啟動畫
- 組件爆炸拆解效果
- 重新組裝動畫
- 更複雜的滾動敘事效果

---

## 動畫系統

### 已實現的 GSAP 動畫

1. **Feature Items 特性展示**
   - 分隔線擴展動畫
   - 文字上滑淡入
   - 數字淡入效果
   - 交錯顯示（stagger）

2. **News Cards 新聞卡片**
   - 批量觸發動畫（ScrollTrigger.batch）
   - 上滑淡入效果
   - 交錯延遲顯示

3. **Reveal Sections 區域淡入**
   - 通用淡入效果
   - 觸發點：元素頂部到達視口 85%

---

## 設計系統

### Swiss 配色方案

```css
Background: #F5F5F7 (mica gray)
Text: #1D1D1F (deep charcoal)
Secondary: #86868b (metal gray)
Accent: #0071e3 (international blue)
```

### 排版系統

```css
Display: 48px / 4rem
H1: 36px / 3rem
H2: 30px / 2.5rem
H3: 24px / 2rem
H4: 20px / 1.25rem
H5: 16px / 1rem
H6: 14px / 0.875rem
```

### Swiss 設計原則

1. **極簡主義** - 去除一切非必要元素
2. **網格系統** - 數學化精確佈局
3. **無襯線字體** - Inter + Noto Sans HK
4. **負空間** - 40% 以上留白
5. **克制的色彩** - 黑、白、灰為主，國際藍點綴

---

## 性能優化

### 已實現的優化 ✅

- **WebP 圖片格式** - 體積減少 25-35%
- **響應式圖片** - 根據屏幕尺寸加載合適尺寸
- **圖片懶加載** - 列表頁延遲加載
- **圖片預加載** - 關鍵圖片優先加載
- **Blur 占位符** - 改善感知體驗
- **高 DPI 支持** - 視網膜屏幕優化
- **ISR 緩存策略** - 增量靜態再生
- **代碼分割** - Nuxt 自動優化
- **性能監控** - Core Web Vitals 追蹤（LCP、FID、CLS）

---

## SEO 配置

### 已實現 ✅

- **Meta 標籤** - 完整的頁面元信息
- **Open Graph** - 社交媒體分享優化
- **Twitter Cards** - Twitter 分享卡片
- **Canonical URL** - 避免重複內容
- **動態 Sitemap** - 從數據庫自動生成
- **Robots.txt** - 搜索引擎爬蟲配置
- **結構化數據** - JSON-LD 格式
  - 產品結構化數據
  - 文章結構化數據
  - 組織結構化數據
  - 麵包屑結構化數據

---

## 可訪問性（A11y）

### 已實現 ✅

- **完整 ARIA 標籤**
  - 導航：aria-label、aria-current、role
  - 語言切換器：aria-haspopup、aria-expanded、aria-selected
  - 表單：aria-required、autocomplete
  - 按鈕：aria-label 描述
- **鍵盤導航** - 全功能支持
- **焦點管理** - 清晰的焦點指示
- **屏幕閱讀器優化** - 語義化 HTML 標籤

---

## CMS 後台功能

### 產品管理

- 列表視圖（表格 + 縮略圖）
- 多語言編輯器（Tab 切換）
- 規格參數生成器（Key-Value）
- 圖片上傳（拖拽、預覽）
- 批量操作（刪除、發布、草稿）
- 數據導出（JSON/CSV）

### 新聞管理

- 富文本編輯器（Tiptap）
- Markdown 支持
- 封面圖管理
- 標籤系統
- 發布時間控制
- 批量刪除
- 數據導出

### 詢盤管理

- 客戶留言查看
- 狀態追蹤（new, contacted, closed）
- 批量操作
- 數據導出

### 其他功能

- **全局搜索** - 跨產品/新聞/詢盤實時搜索
- **活動日誌** - 完整操作歷史追蹤
- **數據統計** - 產品/新聞/詢盤數量統計
- **圖片上傳組件** - 支持拖拽、預覽、壓縮

---

## 數據庫架構

### 核心表結構

1. **products** - 產品表（多語言名稱、JSONB 規格）
2. **posts** - 資訊/博客表（多語言內容）
3. **solutions** - 解決方案表
4. **inquiries** - 客戶詢盤表
5. **admin_logs** - 管理員操作日誌
6. **profiles** - 管理員權限表（Supabase Auth 擴展）

### 存儲桶（Storage Buckets）

- **product-assets** - 產品圖片和 3D 模型
- **site-media** - 網站媒體資源

### 安全策略

- **RLS（Row Level Security）** - 行級安全控制
- **Public** - 僅 SELECT 權限（已發布內容）
- **Admin** - 完整 CRUD 權限

---

## 部署

### Vercel（推薦）

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

### 環境變量配置

在部署平台設置以下環境變量：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

---

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

### 提交信息規範

使用 Conventional Commits：

- `feat:` - 新功能
- `fix:` - Bug 修復
- `docs:` - 文檔更新
- `style:` - 代碼格式調整
- `refactor:` - 重構
- `perf:` - 性能優化
- `test:` - 測試
- `chore:` - 構建過程或輔助工具變動

---

## 瀏覽器支持

- Chrome/Edge (最新版)
- Safari (最新版)
- Firefox (最新版)
- Mobile Safari iOS 14+
- Chrome Android 10+

---

## 待完善功能

### 短期優化

- [ ] AI 輔助翻譯（多語言內容生成）
- [ ] 圖片自動化處理（背景檢測、智能壓縮）
- [ ] A/B 測試支持

### 長期規劃

- [ ] 3D 動畫增強（機櫃開啟、組件爆炸效果）
- [ ] 更多結構化數據類型
- [ ] 產品預覽模式

---

## 文檔

- [管理後台快速開始](./docs/QUICK_START_ADMIN.md)
- [後台功能增強說明](./docs/ADMIN_ENHANCEMENTS.md)
- [實現總結](./docs/IMPLEMENTATION_SUMMARY.md)

---

## 許可證

MIT License

---

**SUPERCORE TECHNOLOGY LIMITED** - 為香港及海外市場提供專業基礎設施解決方案

**Website**: https://www.supercore.hk
**Email**: info@supercore.hk
