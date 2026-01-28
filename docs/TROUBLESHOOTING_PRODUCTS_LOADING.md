# 产品信息加载问题 - 故障排除指南

## 诊断总结

### ✅ 已确认正常

1. **Supabase 数据库连接** - 正常
2. **Supabase API 端点** - 正常
3. **数据库中的产品数据** - 存在（9 条记录）
4. **API 数据返回** - 正常

### ❌ 可能的问题

1. **前端数据获取逻辑** - 需要检查
2. **浏览器缓存** - 可能缓存了旧数据
3. **页面渲染问题** - 需要调试

## 解决步骤

### 步骤 1：访问诊断页面

打开浏览器访问：

```
http://localhost:3001/debug-data
```

这个页面会显示：

- API 端点状态
- Mock 数据状态
- 当前使用的数据源（API 或 Mock）
- 页面加载状态
- 错误信息（如果有）

### 步骤 2：清除浏览器缓存

1. **Chrome/Edge**：
   - 按 `Ctrl + Shift + Delete`
   - 选择"缓存的图像和文件"
   - 点击"清除数据"

2. **Firefox**：
   - 按 `Ctrl + Shift + Delete`
   - 选择"缓存"
   - 点击"立即清除"

3. **或者使用无痕模式**：
   - Chrome/Edge: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`

### 步骤 3：检查控制台日志

1. 打开开发者工具 (`F12`)
2. 切换到 "Console" 标签
3. 刷新产品页面 (`/products`)

查找以下日志：

- `[Products] Using mock data due to API failure or empty response`
- `[Products] Using API data`
- `[Products] API data loaded successfully`
- 任何红色的错误信息

### 步骤 4：网络请求检查

1. 打开开发者工具 (`F12`)
2. 切换到 "Network" 标签
3. 刷新产品页面 (`/products`)
4. 查找 `/api/products/public` 请求

检查：

- **Status** - 应该是 `200` 或 `304`
- **Response** - 应该包含产品数据
- **Time** - 响应时间

### 步骤 5：直接访问 API

打开新标签页访问：

```
http://localhost:3001/api/products/public
```

应该看到类似这样的响应：

```json
{
  "success": true,
  "data": [
    {
      "id": "9",
      "slug": "bs450g3-s",
      "name": { ... },
      "description": { ... },
      ...
    }
  ]
}
```

## 已实施的修复

### 1. 移除离线模式

```env
# 已删除这行：
# NUXT_PUBLIC_SUPABASE_OFFLINE=true
```

### 2. 产品列表页逻辑

- ✅ API 正常时使用真实数据
- ✅ API 失败时自动切换到 Mock 数据
- ✅ 保留加载动画
- ✅ 添加"暂无产品数据"状态

### 3. 产品详情页逻辑

- ✅ API 正常时使用真实数据
- ✅ API 失败时自动切换到 Mock 数据
- ✅ 根据 slug 匹配产品

### 4. 诊断页面

创建 `/debug-data` 页面用于：

- 检查 API 状态
- 检查 Mock 数据
- 显示当前数据源
- 显示错误信息

## 如果问题仍然存在

### 方案 A：强制使用 Mock 数据

如果想立即看到产品，可以临时修改页面直接使用 Mock 数据：

**`pages/products/index.vue`**:

```typescript
// 暂时注释掉 API 调用
// const { data: apiProducts, pending, error } = useLazyFetch<Product[]>('/api/products/public', {
//   transform: (data) => {
//     if (!data || data.length === 0) return []
//     return data
//   },
//   default: () => [],
// })

// 直接使用 Mock 数据
const products = computed(() => {
  return mockProducts
})
```

### 方案 B：检查环境变量

确认 `.env` 文件内容正确：

```env
SUPABASE_URL=https://oqwvbyacnriohxopgaks.supabase.co
SUPABASE_KEY=sb_publishable_xfhjuY2GGaHAvM1k8dMGyA_uIoWntqZ
SUPABASE_SECRET_KEY=sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI
```

### 方案 C：检查数据库权限

在 Supabase Dashboard 中检查：

1. 进入 Table Editor
2. 选择 `products` 表
3. 检查 RLS (Row Level Security) 策略

确保有类似这样的策略：

```sql
-- 允许公开读取 status='published' 的产品
CREATE POLICY "Public read access" ON products
  FOR SELECT
  USING (status = 'published');
```

### 方案 D：重启开发服务器

```bash
# 停止服务器
Ctrl + C

# 清除缓存
rm -rf .nuxt

# 重新安装依赖（可选）
npm install

# 重新启动
npm run dev
```

## 预期结果

### 正常情况

1. 访问 `/products` 页面
2. 看到短暂加载动画（骨架屏）
3. 产品列表显示（9 个产品）
4. 每个产品卡片显示：
   - 产品图片
   - 产品名称
   - 产品描述

### 降级情况（API 失败）

1. 访问 `/products` 页面
2. 看到短暂加载动画（骨架屏）
3. 产品列表显示（15 个 Mock 产品）
4. 控制台显示：
   ```
   [Products] Using mock data due to API failure or empty response
   ```

## 联系支持

如果以上步骤都无法解决问题，请提供以下信息：

1. **诊断页面截图**
   - 访问 `/debug-data`
   - 截图所有状态信息

2. **控制台日志**
   - 打开开发者工具 (`F12`)
   - 切换到 "Console"
   - 复制所有日志

3. **网络请求信息**
   - 打开开发者工具 (`F12`)
   - 切换到 "Network"
   - 找到 `/api/products/public` 请求
   - 截图请求和响应信息

## 相关文件

- `pages/products/index.vue` - 产品列表页
- `pages/products/[slug].vue` - 产品详情页
- `server/api/products/public.get.ts` - 产品 API 端点
- `utils/mockData.ts` - Mock 数据
- `.env` - 环境变量配置
- `pages/debug-data.vue` - 诊断页面（新建）

---

**文档更新时间**: 2026-01-27
**版本**: 1.0
