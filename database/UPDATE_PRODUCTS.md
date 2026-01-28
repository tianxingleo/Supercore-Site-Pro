# 更新产品数据库数据

## 问题说明

首页产品卡片无法显示产品名称和描述，因为数据库中的产品记录缺少必要的 `name`、`description` 和 `specs` 字段。

## 解决步骤

### 1. 登录 Supabase Dashboard

访问：https://oqwvbyacnriohxopgaks.supabase.co
使用你的账户登录。

### 2. 打开 SQL Editor

- 在左侧菜单中点击 "SQL Editor"
- 点击 "New query" 创建新查询

### 3. 执行更新脚本

复制 `database/migrations/001_update_products.sql` 文件中的所有SQL语句，粘贴到SQL Editor中，然后点击 "Run" 执行。

该脚本会：

- 更新所有15个产品的 `name` 字段（包含中文、繁体、英文）
- 更新所有产品的 `description` 字段
- 更新产品的 `specs` 字段（CPU、机架单元等）
- 修正产品 `category` 分类
- 设置部分产品为精选（featured）

### 4. 验证更新

执行以下SQL验证数据是否正确更新：

```sql
SELECT
  id,
  slug,
  name->>'zh-CN' as name_cn,
  name->>'zh-HK' as name_hk,
  description->>'zh-CN' as desc_cn,
  description->>'zh-HK' as desc_hk,
  category,
  is_featured,
  status
FROM products
WHERE status = 'published'
ORDER BY created_at DESC;
```

预期结果应该显示所有产品都有完整的 `name` 和 `description` 字段。

## 产品清单

以下产品将被更新：

### 高性能计算 (HPC)

1. BC120G3 - 双路通用服务器
2. BC120G3-H - 高性能计算服务器
3. BC220G3 - 通用计算服务器
4. BC220G3-H - 高性能计算服务器
5. BC220G3-S - 存储服务器

### 高性能存储

6. BS450G3-H - 高性能存储服务器
7. BS270G3 - 高性能存储服务器

### 通用存储

8. BS450G3 - 高密度存储服务器
9. BS450G3-S - 高密度存储服务器

### 通用计算 (精选产品)

10. BC440G3-P - 通用服务器
11. BC440G3-N - 通用服务器
12. BC440G3-T - 通用服务器
13. BC445G3-P - 存储服务器
14. BC445G3-N - 存储服务器

## 测试页面

执行完SQL后，刷新首页和产品列表页，应该能正常显示产品名称和描述了。

如果仍有问题，请检查：

1. 浏览器开发者工具的Console和Network标签
2. 确认API返回的产品数据是否包含 `name` 和 `description` 字段
3. 检查前端是否正确处理了数据
