# Project NEXUS (HK)

香港及海外市场的高端基础设施解决方案官网

## 项目状态

**当前进度：第 1 天完成（共 20 天）**

### 已完成任务 ✅

- ✅ 初始化 Nuxt 3 项目（TypeScript）
- ✅ 安装核心依赖
  - `@nuxtjs/tailwindcss` - Tailwind CSS
  - `@nuxtjs/i18n` - 国际化支持（zh-HK, zh-CN, en）
  - `gsap` - 动画库
  - `@tresjs/core` - Vue 3 Three.js 集成
  - `@nuxtjs/supabase` - Supabase 集成
  - `lenis` - 平滑滚动
- ✅ 配置瑞士设计系统
  - 色彩方案：`#F5F5F7`（背景）、`#1D1D1F`（文字）、`#86868b`（次要信息）、`#0071e3`（强调色）
  - 12 列网格系统
  - Inter + Noto Sans HK 字体组合
- ✅ 配置 ESLint 和 Prettier
- ✅ 配置 Husky pre-commit 钩子
- ✅ 创建基础项目结构

## 项目结构

```
web-for-hk/
├── assets/
│   └── css/
│       ├── main.css          # 主样式文件（瑞士设计基础）
│       └── tailwind.css      # Tailwind 入口
├── components/               # Vue 组件（待创建）
├── composables/              # Vue 组合式函数（待创建）
├── locales/                  # i18n 语言文件
│   ├── zh-HK.json           # 繁体中文（香港）
│   ├── zh-CN.json           # 简体中文
│   └── en.json              # 英文
├── pages/
│   └── index.vue            # 首页
├── public/                   # 静态资源（待添加）
├── .env.example             # 环境变量模板
├── app.vue                  # 应用根组件
├── nuxt.config.ts           # Nuxt 配置
├── tailwind.config.js       # Tailwind 配置（瑞士设计）
└── tsconfig.json            # TypeScript 配置
```

## 技术栈

- **前端框架**：Nuxt 3 (SSR 模式)
- **样式**：Tailwind CSS + 瑞士设计系统
- **动画**：GSAP (ScrollTrigger) + Lenis
- **3D 渲染**：TresJS (Vue 3 + Three.js)
- **数据库**：Supabase (PostgreSQL)
- **部署**：Vercel（计划）

## 下一步（第 2 天）

- [ ] 创建瑞士风格原子组件库
  - [ ] `SwissButton.vue`
  - [ ] `GridContainer.vue`
  - [ ] `TypographyHeader.vue`
- [ ] 创建 `useSwissGrid.ts` composable
- [ ] 完善多语言配置

## 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行 ESLint
npm run lint

# 修复 ESLint 错误
npm run lint:fix

# 格式化代码
npm run format

# 类型检查
npm run typecheck
```

## Git 工作流

当前分支：`claudecode_auto`

提交规范遵循 Conventional Commits：
- `feat`: 新功能
- `fix`: 修复
- `style`: 代码样式
- `refactor`: 重构
- `perf`: 性能优化
- `docs`: 文档
- `chore`: 构建/工具

## 设计规范

### 瑞士国际主义风格

- **色彩**：极简灰度 + 克制的蓝色强调
- **排版**：数学网格、40%+ 留白
- **字体**：Inter（英文）+ Noto Sans HK（中文）
- **视觉**：去底静物、微距摄影、无阴影

### 香港术语对照

| 简体中文 | 香港繁体 | 英文 |
|---------|---------|------|
| 服务器 | 伺服器 | Server |
| 鼠标 | 滑鼠 | Mouse |
| 硬盘 | 硬碟 | Hard Disk |
| 数据库 | 资料库 | Database |
| 视频 | 影片 | Video |

---

**Project NEXUS (HK)** - 瑞士极简风格基础设施解决方案官网
