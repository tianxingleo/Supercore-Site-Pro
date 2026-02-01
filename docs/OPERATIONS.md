# 超核技术有限公司网站运维手册

## 📋 目录

1. [系统概述](#系统概述)
2. [部署指南](#部署指南)
3. [环境配置](#环境配置)
4. [监控与日志](#监控与日志)
5. [备份策略](#备份策略)
6. [日常维护](#日常维护)
7. [故障排查](#故障排查)
8. [性能优化](#性能优化)
9. [安全维护](#安全维护)
10. [更新流程](#更新流程)
11. [应急响应](#应急响应)

---

## 系统概述

### 技术栈

- **前端框架**: Nuxt 3 (Vue 3 SSR)
- **语言**: TypeScript
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **部署**: Vercel / Netlify / 自建服务器
- **CDN**: Vercel Edge Network / Cloudflare

### 项目结构

```
Web-For-HK/
├── server/           # 服务端 API
├── pages/           # 页面路由
├── components/      # Vue 组件
├── composables/     # 组合式函数
├── utils/          # 工具函数
├── middleware/     # 中间件
├── database/       # 数据库迁移
└── docs/          # 文档
```

### 关键服务

- **前台网站**: https://www.supercore.hk
- **管理后台**: https://www.supercore.hk/admin
- **数据库**: Supabase (oqwvbyacnriohxopgaks.supabase.co)
- **状态监控**: `/api/system/ping`

---

## 部署指南

### 前置要求

- Node.js 18+
- npm 或 pnpm
- Git
- Supabase 账号

### 环境变量配置

创建 `.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SECRET_KEY=your-service-role-key

# 可选：其他配置
NUXT_PUBLIC_APP_URL=https://www.supercore.hk
```

### 本地开发

```bash
# 1. 克隆仓库
git clone <repository-url>
cd Web-For-HK

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 启动开发服务器
npm run dev

# 5. 访问
# 前台: http://localhost:3000
# 管理后台: http://localhost:3000/admin
```

### 生产部署

#### 方案 1: Vercel（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel --prod

# 4. 配置环境变量（在 Vercel Dashboard）
#    SUPABASE_URL
#    SUPABASE_KEY
#    SUPABASE_SECRET_KEY
```

**Vercel Dashboard 配置**:

1. 进入 Project Settings
2. Environment Variables:
   - `SUPABASE_URL`: 你的 Supabase URL
   - `SUPABASE_KEY`: 你的 Supabase Anon Key
   - `SUPABASE_SECRET_KEY`: 你的 Supabase Service Role Key

#### 方案 2: 自建服务器

```bash
# 1. 构建项目
npm run build

# 2. 启动生产服务器
npm run preview

# 3. 使用 PM2 守护进程
npm install -g pm2
pm2 start .output/server/index.mjs --name "supercore-website"

# 4. 配置 Nginx 反向代理
# 编辑 /etc/nginx/sites-available/supercore
```

**Nginx 配置示例**:

```nginx
server {
    listen 80;
    server_name www.supercore.hk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 数据库初始化

```bash
# 1. 在 Supabase Dashboard 中创建表

# 2. 运行迁移脚本
npm run database:migrate

# 3. 上传初始产品数据
node scripts/upload_products.mjs
```

---

## 环境配置

### 开发环境 vs 生产环境

| 配置项 | 开发环境 | 生产环境 |
|--------|----------|----------|
| Node.js | v18+ | v18+ LTS |
| TypeScript 类型检查 | 关闭 | 开启 |
| Source Maps | 启用 | 启用 |
| 日志级别 | DEBUG | INFO/WARN |
| 性能监控 | 开启 | 开启 |
| 错误报告 | 开发工具 | 生产日志 |

### Supabase 配置

1. **创建项目**:
   - 访问 https://supabase.com
   - 创建新项目
   - 获取 API 密钥

2. **数据库表结构**:

   ```sql
   -- 产品表
   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     slug TEXT UNIQUE NOT NULL,
     name JSONB NOT NULL,
     description JSONB,
     specs JSONB,
     images TEXT[],
     category TEXT,
     model_3d_url TEXT,
     is_featured BOOLEAN DEFAULT false,
     status TEXT DEFAULT 'draft',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- 新闻表
   CREATE TABLE posts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     slug TEXT UNIQUE NOT NULL,
     title JSONB NOT NULL,
     content JSONB,
     excerpt JSONB,
     cover_image TEXT,
     category TEXT,
     tags TEXT[],
     status TEXT DEFAULT 'draft',
     published_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- 询盘表
   CREATE TABLE inquiries (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     company TEXT,
     message TEXT,
     status TEXT DEFAULT 'new',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- 管理员配置表
   CREATE TABLE profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     role TEXT DEFAULT 'user',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Row Level Security (RLS)**:

   ```sql
   -- 公共读取：已发布的产品
   CREATE POLICY "Public products are viewable by everyone"
   ON products FOR SELECT
   USING (status = 'published');

   -- 管理员完全访问
   CREATE POLICY "Admins can do anything"
   ON products FOR ALL
   USING (
     EXISTS (
       SELECT 1 FROM profiles
       WHERE profiles.id = auth.uid()
       AND profiles.role = 'admin'
     )
   );
   ```

---

## 监控与日志

### 内置监控工具

#### 1. 性能监控面板

开发环境自动显示，包含：
- 页面加载时间
- API 响应时间
- 数据库查询时间
- 内存使用
- Core Web Vitals (LCP, FID, CLS)

访问：页面右下角（开发环境）

#### 2. 错误日志查看器

开发环境自动显示，包含：
- 错误级别（DEBUG, INFO, WARN, ERROR, FATAL）
- 错误消息
- 堆栈跟踪
- 请求上下文

访问：页面右下角红色按钮（开发环境）

#### 3. 系统状态 API

```bash
# 检查系统状态
curl https://www.supercore.hk/api/system/ping

# 返回示例
{
  "success": true,
  "data": {
    "frontend": {
      "url": "www.supercore.hk",
      "status": "online",
      "responseTime": 45
    },
    "backend": {
      "url": "https://oqwvbyacnriohxopgaks.supabase.co",
      "status": "online",
      "responseTime": 123,
      "httpStatus": 200
    }
  }
}
```

### 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| DEBUG | 详细调试信息 | 变量值、执行流程 |
| INFO | 一般信息 | API 调用、数据加载 |
| WARN | 警告信息 | 性能问题、废弃功能 |
| ERROR | 错误信息 | API 失败、数据库错误 |
| FATAL | 致命错误 | 系统崩溃、安全漏洞 |

### 日志存储位置

1. **开发环境**:
   - 控制台输出
   - 浏览器 LocalStorage (ErrorLogViewer)

2. **生产环境**:
   - Supabase 日志
   - 服务器日志文件
   - 错误追踪服务（可选）

### 外部监控推荐

1. **Uptime Monitoring**:
   - UptimeRobot (免费)
   - Pingdom
   - StatusCake

2. **Error Tracking**:
   - Sentry
   - Rollbar
   - Bugsnag

3. **Performance Monitoring**:
   - Google Analytics
   - Vercel Analytics
   - Web Vitals (Chrome User Experience Report)

---

## 备份策略

### 数据库备份

Supabase 自动备份：
- **保留期**: 7 天（免费版）/ 30 天（Pro 版）
- **备份频率**: 每日
- **备份位置**: Supabase Cloud

### 手动备份

#### 1. 导出数据库

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 导出数据
supabase db dump -f backup-$(date +%Y%m%d).sql
```

#### 2. 导出产品数据

```bash
# 通过 API 导出
curl -H "Authorization: Bearer YOUR_ADMIN_KEY" \
  https://www.supercore.hk/api/products/export
```

#### 3. 备份媒体文件

```bash
# 下载 Supabase Storage 中的文件
# 使用 Supabase Dashboard 或 CLI
```

### 备份计划

| 备份类型 | 频率 | 保留期 | 位置 |
|---------|------|--------|------|
| 数据库自动备份 | 每日 | 7 天 | Supabase |
| 数据库手动备份 | 每周 | 30 天 | 本地/云存储 |
| 媒体文件 | 每月 | 永久 | 本地/云存储 |
| 代码仓库 | 每次 | 永久 | GitHub/GitLab |

---

## 日常维护

### 每日检查清单

- [ ] 检查网站可访问性
- [ ] 查看错误日志（如有新错误）
- [ ] 检查系统状态 API
- [ ] 监控性能指标

### 每周任务

- [ ] 检查并更新依赖包
- [ ] 审查安全日志
- [ ] 备份数据库
- [ ] 检查存储空间使用情况

### 每月任务

- [ ] 审查并优化慢查询
- [ ] 更新文档
- [ ] 审查用户访问统计
- [ ] 清理无用数据

### 依赖更新

```bash
# 检查过时的包
npm outdated

# 更新所有依赖
npm update

# 更新主要版本（谨慎）
npx nuxi update

# 审计安全漏洞
npm audit
npm audit fix
```

---

## 故障排查

### 常见问题

#### 1. 网站无法访问

**症状**: 页面返回 500 错误或无法加载

**排查步骤**:

```bash
# 1. 检查环境变量
cat .env

# 2. 检查 Supabase 连接
curl https://oqwvbyacnriohxopgaks.supabase.co/rest/v1/

# 3. 查看服务器日志
# Vercel Dashboard → Logs
# 或本地：tail -f logs/error.log

# 4. 重启服务
pm2 restart supercore-website
```

**常见原因**:
- 环境变量未配置
- Supabase 服务中断
- 域名 DNS 问题
- SSL 证书过期

#### 2. 管理后台无法登录

**症状**: 登录后立即退出或显示 401 错误

**排查步骤**:

```bash
# 1. 检查 Cookie 设置
# 浏览器开发者工具 → Application → Cookies

# 2. 清除浏览器 Cookie
# 手动删除 sb-* 相关 Cookie

# 3. 检查用户角色
# 在 Supabase Dashboard → Table Editor → profiles
# 确认 role = 'admin'

# 4. 检查认证配置
# 查看 nuxt.config.ts 中的 supabase 配置
```

#### 3. 图片无法加载

**症状**: 产品图片显示为空白或 404

**排查步骤**:

```bash
# 1. 检查图片路径
# 确认 images 字段包含正确的 URL

# 2. 检查 Supabase Storage
# 登录 Supabase Dashboard → Storage
# 确认 product-assets bucket 存在

# 3. 检查图片权限
# Storage → product-assets → Policies
# 确认 PUBLIC 访问已启用
```

#### 4. 数据加载缓慢

**症状**: API 响应时间超过 3 秒

**排查步骤**:

```bash
# 1. 检查 Supabase 性能
# Supabase Dashboard → Reports
# 查看慢查询

# 2. 添加索引
# 在 Supabase SQL Editor 中：
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);

# 3. 启用查询缓存
# 检查 nuxt.config.ts 中的 routeRules 配置
```

#### 5. 国际化不工作

**症状**: 语言切换后内容未更新

**排查步骤**:

```bash
# 1. 检查语言文件
ls i18n/locales/

# 2. 检查翻译键值
# 确认所有键值在三个语言文件中都存在

# 3. 清除缓存
# 浏览器 Ctrl+Shift+R
```

### 错误代码参考

| HTTP 状态码 | 含义 | 解决方案 |
|------------|------|----------|
| 400 | 请求参数错误 | 检查 API 请求格式 |
| 401 | 未授权 | 检查登录状态和 Cookie |
| 403 | 禁止访问 | 检查用户权限（role = 'admin'） |
| 404 | 资源不存在 | 检查 URL 路径 |
| 500 | 服务器内部错误 | 查看服务器日志 |
| 503 | 服务不可用 | 检查 Supabase 状态 |
| 504 | 网关超时 | 检查网络连接和慢查询 |

---

## 性能优化

### 监控指标

#### Core Web Vitals

| 指标 | 良好 | 需改进 | 差 |
|------|------|--------|-----|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

#### 性能优化建议

1. **图片优化**:
   ```typescript
   // 使用 NuxtImg 组件
   <NuxtImg
     :src="image.url"
     width="400"
     height="400"
     format="webp"
     loading="lazy"
     sizes="xs:100vw sm:50vw md:33vw"
   />
   ```

2. **代码分割**:
   ```typescript
   // 懒加载组件
   const HeavyComponent = defineAsyncComponent(() =>
     import('~/components/HeavyComponent.vue')
   )
   ```

3. **ISR 缓存**:
   ```typescript
   // nuxt.config.ts
   routeRules: {
     '/': { isr: 3600 },      // 1 小时
     '/products': { isr: 86400 }, // 1 天
   }
   ```

4. **数据库查询优化**:
   ```sql
   -- 只选择需要的列
   SELECT id, slug, name FROM products;

   -- 使用索引
   CREATE INDEX idx_status ON products(status);
   ```

5. **CDN 加速**:
   - 使用 Vercel Edge Network
   - 配置 Cloudflare CDN（可选）
   - 启用图片 CDN

### 性能测试工具

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://www.supercore.hk --view

# WebPageTest
# 访问 https://www.webpagetest.org

# PageSpeed Insights
# 访问 https://pagespeed.web.dev
```

---

## 安全维护

### 安全最佳实践

#### 1. 环境变量管理

```bash
# ❌ 错误：不要将 .env 提交到 Git
git add .env

# ✅ 正确：使用 .env.example
echo "SUPABASE_URL=your_url" > .env.example
git add .env.example
```

#### 2. API 密钥保护

- **SUPABASE_KEY**: 公开，可暴露给客户端
- **SUPABASE_SECRET_KEY**: 绝不暴露，仅服务端使用

#### 3. 管理员账户

```bash
# 定期更改管理员密码
# 在 Supabase Dashboard → Authentication → Users
# 找到管理员账户，点击 "Send Password Reset"

# 启用 2FA（双因素认证）
# Supabase Dashboard → Authentication → Policies
```

#### 4. Row Level Security

```sql
-- 确保所有表都有 RLS 策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
```

### 安全审计检查清单

- [ ] 环境变量未暴露
- [ ] API 密钥已轮换（每 90 天）
- [ ] SSL 证书有效
- [ ] 管理员使用强密码
- [ ] 启用了 Row Level Security
- [ ] 已配置 CORS 策略
- [ ] 启用了速率限制
- [ ] 定期更新依赖包
- [ ] 审查访问日志

### 安全事件响应

如果发现安全漏洞：

1. **立即行动**:
   ```bash
   # 1. 撤销所有管理员会话
   # Supabase Dashboard → Authentication → Users
   # 点击 "Revoke" 令所有用户重新登录

   # 2. 轮换 API 密钥
   # Supabase Dashboard → Project Settings → API Keys
   ```

2. **调查和修复**:
   - 审查访问日志
   - 确认漏洞范围
   - 实施修复

3. **预防措施**:
   - 添加额外的安全措施
   - 更新安全文档
   - 进行安全审计

---

## 更新流程

### 代码更新

#### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feat/new-feature

# 2. 开发并测试
npm run dev
# 进行开发和测试

# 3. 提交代码
git add .
git commit -m "feat: add new feature"

# 4. 推送到远程
git push origin feat/new-feature

# 5. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR

# 6. 代码审查
# 团队成员审查代码

# 7. 合并到主分支
git checkout main
git merge feat/new-feature

# 8. 部署到生产环境
git push origin main
# Vercel 会自动部署
```

#### 2. 紧急修复流程

```bash
# 1. 创建 hotfix 分支
git checkout -b hotfix/critical-bug

# 2. 快速修复
# 编辑文件...

# 3. 直接提交到 main
git add .
git commit -m "hotfix: fix critical bug"
git push origin main

# 4. 监控部署
# Vercel 会自动部署并通知
```

### 数据库更新

#### 1. 创建迁移

```bash
# 创建迁移文件
# database/migrations/001_add_new_field.sql

-- 示例：添加新字段
ALTER TABLE products ADD COLUMN new_field TEXT;
```

#### 2. 应用迁移

```bash
# 在 Supabase SQL Editor 中运行迁移
# 或使用 Supabase CLI
supabase db push
```

#### 3. 验证更新

```bash
# 检查开发环境
npm run dev

# 检查生产环境
# 访问网站并验证功能
```

### 依赖更新

#### 1. 检查更新

```bash
# 查看过时包
npm outdated

# 安全审计
npm audit
```

#### 2. 更新依赖

```bash
# 安全更新
npm audit fix

# 重大版本更新（谨慎）
npm install package@latest

# 更新 Nuxt
npx nuxi update
```

#### 3. 测试更新

```bash
# 1. 本地测试
npm run build
npm run preview

# 2. 部署到预览环境
vercel

# 3. 验证功能
# 手动测试所有核心功能
```

---

## 应急响应

### 紧急联系人

| 角色 | 姓名 | 联系方式 | 职责 |
|------|------|----------|------|
| 技术负责人 | - | - | 技术决策 |
| 运维工程师 | - | - | 系统维护 |
| 开发负责人 | - | - | 代码问题 |

### 服务中断响应流程

#### 1. 确认问题

```bash
# 检查服务状态
curl https://www.supercore.hk/api/system/ping

# 检查 Supabase 状态
# https://status.supabase.com

# 查看错误日志
# Vercel Dashboard → Logs
```

#### 2. 评估影响

- [ ] 网站完全无法访问？
- [ ] 部分功能受影响？
- [ ] 数据泄露风险？
- [ ] 性能严重下降？

#### 3. 初步响应

**网站完全无法访问**:

```bash
# 1. 检查部署状态
# Vercel Dashboard → Deployments

# 2. 回滚到上一个版本
# Vercel Dashboard → Deployments → 选择上一个版本 → Redeploy

# 3. 如果 Vercel 正常，检查 DNS
# 检查域名 DNS 设置
```

**数据库连接失败**:

```bash
# 1. 检查 Supabase 状态页
# https://status.supabase.com

# 2. 验证环境变量
# Vercel Dashboard → Project Settings → Environment Variables

# 3. 测试数据库连接
# 使用 Supabase Dashboard → SQL Editor
```

#### 4. 通知相关人员

- **用户**: 发布状态页面（https://status.supercore.hk）
- **团队**: 发送警报通知
- **管理层**: 重大事件及时上报

#### 5. 恢复服务

```bash
# 1. 修复问题
# 根据故障类型进行修复

# 2. 部署修复
git push origin main

# 3. 验证恢复
curl https://www.supercore.hk/api/system/ping
```

#### 6. 事后分析

- [ ] 记录事件详情
- [ ] 分析根本原因
- [ ] 制定预防措施
- [ ] 更新文档和流程

### 备用方案

#### 主站宕机备用方案

1. **启用维护模式**:
   ```typescript
   // nuxt.config.ts
   routeRules: {
     '/': { redirect: '/maintenance' }
   }
   ```

2. **切换到备用服务器**:
   ```bash
   # 更新 DNS 记录指向备用服务器
   # TTL 设置为 300 秒（5 分钟）
   ```

3. **显示状态页面**:
   ```html
   <!-- public/maintenance.html -->
   <h1>系统维护中</h1>
   <p>我们正在努力恢复服务，请稍后再试。</p>
   <p>预计恢复时间：30 分钟</p>
   ```

---

## 附录

### 有用的命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run preview         # 预览生产构建

# 数据库
npm run database:migrate # 运行数据库迁移
node scripts/upload_products.mjs  # 上传产品数据

# 代码质量
npm run lint            # 代码检查
npm run type-check      # TypeScript 类型检查

# 部署
vercel                  # 部署到 Vercel
vercel --prod          # 生产环境部署
```

### 重要链接

- **网站**: https://www.supercore.hk
- **管理后台**: https://www.supercore.hk/admin
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: [项目地址]

### 技术支持

如有问题，请联系：

- **技术支持**: tech@supercore.hk
- **紧急联系**: [紧急电话]

### 文档更新

本文档最后更新：2026-01-30

维护人员：技术团队

---

**© 2026 超核技术有限公司 - 保留所有权利**
