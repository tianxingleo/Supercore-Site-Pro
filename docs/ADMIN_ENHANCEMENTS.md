# 后台功能增强文档

本文档说明了新增的后台管理功能。

## 🎯 新增功能总览

### 1. ✅ 批量操作功能

#### 产品管理 (Products)
- **批量删除**: 选择多个产品后一次性删除
- **批量发布**: 将选中的产品状态批量改为"已发布"
- **批量草稿**: 将选中的产品状态批量改为"草稿"

#### 新闻管理 (News)
- **批量删除**: 选择多个新闻后一次性删除

#### 询盘管理 (Inquiries)
- **批量删除**: 选择多个询盘后一次性删除
- **批量标记为已读**: 将选中的询盘批量标记为已读状态

**使用方法**:
1. 在列表页面勾选需要操作的项目
2. 点击页面右上角的"批量操作"按钮
3. 从下拉菜单中选择要执行的操作
4. 确认操作即可

---

### 2. ✅ 全局搜索功能

在管理后台顶部导航栏中新增了全局搜索框，支持跨资源类型搜索。

**搜索范围**:
- **产品**: 搜索产品名称（中文/英文）、slug、分类
- **新闻**: 搜索标题（中文/英文）、slug
- **询盘**: 搜索邮箱、公司名称、留言内容

**使用方法**:
1. 点击顶部导航栏的搜索框
2. 输入关键词（支持实时搜索）
3. 从下拉结果中点击相应项目即可直接跳转

**技术实现**:
- 使用PostgreSQL的`ilike`进行不区分大小写的模糊搜索
- 支持JSONB字段的多语言搜索
- 实时搜索，300ms延迟防抖

---

### 3. ✅ 操作日志功能

记录所有管理员的操作行为，便于追踪和审计。

**记录的操作类型**:
- `create` - 创建
- `update` - 更新
- `delete` - 删除
- `bulk_delete` - 批量删除
- `bulk_update` - 批量更新
- `export` - 导出数据

**日志包含信息**:
- 操作用户（邮箱和ID）
- 操作类型和资源类型
- 操作详情（如批量操作的数量）
- IP地址和User-Agent
- 操作时间戳

**查看日志**:
1. 在左侧导航栏点击"Logs"进入日志页面
2. 可按资源类型筛选日志
3. 支持分页浏览

**技术实现**:
- 数据库表: `admin_logs`
- 自动记录API: `/server/utils/adminLogger.ts`
- 查看接口: `/api/admin/logs`

---

### 4. ✅ 数据导出功能

支持将管理数据导出为JSON或CSV格式，便于备份和分析。

**支持导出的数据**:
- 产品列表
- 新闻列表
- 询盘列表

**导出格式**:
- **JSON**: 完整的数据结构，包含所有字段
- **CSV**: 适合在Excel中打开的表格格式

**使用方法**:
1. 在相应的管理页面点击右上角的"導出數據"按钮
2. 选择导出格式（JSON或CSV）
3. 浏览器会自动下载文件

**文件命名**:
- 格式: `{资源类型}_{日期}.{格式}`
- 示例: `products_2026-01-28.csv`

---

## 📁 新增文件列表

### 数据库
```
scripts/create_admin_logs_table.sql  - 操作日志表结构
```

### 服务端
```
server/utils/adminLogger.ts          - 日志记录工具函数

server/api/admin/
  ├── search.get.ts                  - 全局搜索API
  └── logs.get.ts                    - 操作日志查看API

server/api/products/admin/
  ├── bulk.post.ts                   - 产品批量操作API
  └── export.get.ts                  - 产品导出API

server/api/news/admin/
  ├── bulk.post.ts                   - 新闻批量操作API
  └── export.get.ts                  - 新闻导出API

server/api/inquiries/admin/
  ├── bulk.post.ts                   - 询盘批量操作API
  └── export.get.ts                  - 询盘导出API
```

### 前端
```
components/admin/
  └── GlobalSearch.vue               - 全局搜索组件

pages/admin/
  ├── logs.vue                       - 操作日志页面
  ├── products/index.vue             - 更新：添加批量操作和导出
  ├── news/index.vue                 - 更新：添加批量操作和导出
  └── inquiries.vue                  - 更新：添加批量操作和导出

layouts/admin.vue                    - 更新：添加全局搜索和日志导航
```

---

## 🚀 部署步骤

### 1. 创建操作日志表

在Supabase SQL编辑器中执行以下脚本：

```bash
# 方式1：通过Supabase Dashboard
1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行 scripts/create_admin_logs_table.sql

# 方式2：通过命令行（如果配置了Supabase CLI）
supabase db push
```

### 2. 重启开发服务器

```bash
npm run dev
```

### 3. 测试功能

1. 登录管理后台
2. 测试批量操作
3. 测试全局搜索
4. 测试数据导出
5. 查看操作日志

---

## 🔧 API接口说明

### 批量操作API

**端点**: `POST /api/{resource}/admin/bulk`

**请求体**:
```json
{
  "ids": [1, 2, 3],           // 要操作的ID数组
  "action": "delete",         // 操作类型: delete | update
  "data": {                   // 仅在action=update时需要
    "status": "published"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "deleted": 3              // 或 "updated": 3
  }
}
```

### 导出API

**端点**: `GET /api/{resource}/admin/export?format={json|csv}`

**参数**:
- `format`: `json` 或 `csv`

**响应**:
- 直接返回文件下载

### 全局搜索API

**端点**: `GET /api/admin/search?q={关键词}&type={类型}`

**参数**:
- `q`: 搜索关键词（必需）
- `type`: 资源类型，可选 `products` | `posts` | `inquiries` | `all`（默认all）

**响应**:
```json
{
  "success": true,
  "data": {
    "products": [...],
    "posts": [...],
    "inquiries": [...]
  },
  "query": "搜索关键词"
}
```

### 操作日志API

**端点**: `GET /api/admin/logs?page={页码}&limit={每页数量}&type={类型}`

**参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认50）
- `type`: 资源类型筛选（可选）

**响应**:
```json
{
  "success": true,
  "data": {
    "logs": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

---

## 🎨 用户界面改进

### 产品、新闻、询盘管理页面

**新增元素**:
- 每行前面添加复选框用于多选
- 右上角新增"批量操作"按钮（仅在有选中项时显示）
- 右上角新增"導出數據"按钮

**批量操作菜单**:
- 根据不同页面显示不同的批量操作选项
- 点击后弹出确认对话框
- 操作完成后自动刷新列表

### 管理后台布局

**顶部导航**:
- 左侧: Logo
- 中间: 全局搜索框（自动补全下拉）
- 右侧: 登出按钮

**左侧菜单**:
- 新增"Logs"导航项

---

## 🔐 安全性说明

1. **权限控制**: 所有管理API都需要管理员权限认证
2. **日志记录**: 自动记录所有敏感操作
3. **批量操作限制**: 批量操作需要用户二次确认
4. **导出数据**: 仅导出必要字段，敏感信息已过滤

---

## 📊 性能优化

1. **搜索优化**: 
   - 使用PostgreSQL索引加速搜索
   - 结果限制为每类10条

2. **日志查询优化**:
   - 创建了索引: `idx_admin_logs_user_id`, `idx_admin_logs_resource_type`, `idx_admin_logs_created_at`
   - 支持分页查询

3. **批量操作优化**:
   - 使用Supabase的`.in()`方法进行批量删除/更新
   - 单次操作在数据库层面完成

---

## 🐛 故障排除

### 问题1: 批量操作失败

**可能原因**: 
- 数据库连接问题
- 权限不足

**解决方法**:
1. 检查网络连接
2. 确认用户是否有管理员权限
3. 查看浏览器控制台错误信息

### 问题2: 操作日志表不存在

**解决方法**:
执行 `scripts/create_admin_logs_table.sql` 创建表

### 问题3: 搜索无结果

**可能原因**:
- 搜索关键词不匹配
- 数据库中没有相关数据

**解决方法**:
1. 尝试更改搜索关键词
2. 检查数据库是否有数据
3. 查看API响应确认是否有错误

---

## 📝 待办事项

- [ ] 添加高级筛选功能
- [ ] 支持更多导出格式（Excel）
- [ ] 添加定时备份功能
- [ ] 日志支持更详细的筛选条件
- [ ] 批量操作添加撤销功能

---

## 📞 技术支持

如有问题，请查看:
- 代码注释
- API文档
- 控制台错误信息

或联系开发团队。
