# 产品详情页面修复

## 问题描述

产品列表页面已经可以正常显示，但点击产品卡片进入详情页面时出现错误：

```
GET http://localhost:3004/products/bc220g3-s/_payload.json?dev 500 (Server Error)
[nuxt] Cannot load payload /products/bc220g3-s/_payload.json?dev Error: Invalid input
[Product Detail] Using mock data due to API failure
```

## 根本原因

产品详情 API 端点 `server/api/products/[slug].get.ts` 存在与列表页面相同的 locale 键映射问题：

**数据库返回**：

```json
{
  "name": {
    "cn": "BC120G3 通用计算服务器",
    "hk": "BC120G3 通用計算服務器",
    "en": "BC120G3 General Compute Server"
  }
}
```

**TypeScript 类型期望**：

```typescript
{
  name: {
    'zh-CN': string,
    'zh-HK': string,
    en: string
  }
}
```

## 解决方案

### 修复 1：产品详情 API 端点 - 已发布产品

**文件**：`server/api/products/[slug].get.ts:94-106`

**修改前**：

```typescript
const mappedProduct: Product = {
  id: String(data.id),
  slug: data.slug,
  name: data.name,
  description: data.description,
  specs: data.specs || {},
  images: data.images || [],
  category: data.category,
  featured: data.is_featured || false,
  createdAt: data.created_at,
}
```

**修改后**：

```typescript
const mappedProduct: Product = {
  id: String(data.id),
  slug: data.slug,
  name: {
    'zh-CN': data.name.cn || data.name['zh-CN'] || '',
    'zh-HK': data.name.hk || data.name['zh-HK'] || '',
    en: data.name.en || '',
  },
  description: {
    'zh-CN': data.description.cn || data.description['zh-CN'] || '',
    'zh-HK': data.description.hk || data.description['zh-HK'] || '',
    en: data.description.en || '',
  },
  specs: data.specs || {},
  images: data.images || [],
  category: data.category,
  featured: data.is_featured || false,
  createdAt: data.created_at,
}
```

### 修复 2：产品详情 API 端点 - 任何状态产品（开发调试用）

**文件**：`server/api/products/[slug].get.ts:71-83`

**修改前**：

```typescript
const mappedProduct: Product = {
  id: String(anyProduct.id),
  slug: anyProduct.slug,
  name: anyProduct.name,
  description: anyProduct.description,
  specs: anyProduct.specs || {},
  images: anyProduct.images || [],
  category: anyProduct.category,
  featured: anyProduct.is_featured || false,
  createdAt: anyProduct.created_at,
}
```

**修改后**：

```typescript
const mappedProduct: Product = {
  id: String(anyProduct.id),
  slug: anyProduct.slug,
  name: {
    'zh-CN': anyProduct.name.cn || anyProduct.name['zh-CN'] || '',
    'zh-HK': anyProduct.name.hk || anyProduct.name['zh-HK'] || '',
    en: anyProduct.name.en || '',
  },
  description: {
    'zh-CN': anyProduct.description.cn || anyProduct.description['zh-CN'] || '',
    'zh-HK': anyProduct.description.hk || anyProduct.description['zh-HK'] || '',
    en: anyProduct.description.en || '',
  },
  specs: anyProduct.specs || {},
  images: anyProduct.images || [],
  category: anyProduct.category,
  featured: anyProduct.is_featured || false,
  createdAt: anyProduct.created_at,
}
```

## 验证测试

### API 测试

```bash
curl http://localhost:3005/api/products/bc120g3
```

**返回结果**：

```json
{
  "id": "1",
  "slug": "bc120g3",
  "name": {
    "zh-CN": "BC120G3 通用计算服务器",
    "zh-HK": "BC120G3 通用計算服務器",
    "en": "BC120G3 General Compute Server"
  },
  "description": {
    "zh-CN": "1U通用计算服务器...",
    "zh-HK": "1U通用計算服務器...",
    "en": "A 1U general-purpose computing server..."
  },
  ...
}
```

## 影响范围

### 现在可以正常工作

- ✅ 产品列表页面显示所有产品
- ✅ 点击产品卡片可以进入详情页面
- ✅ 产品详情页面显示正确的 i18n 翻译
- ✅ 所有语言的文本都能正确显示
- ✅ 产品图片、规格等信息正常显示
- ✅ TypeScript 类型检查通过

### 不再需要

- ❌ 产品详情页面的 mock 数据回退逻辑（可以保留作为容错）
- ❌ 控制台中的错误日志
- ❌ Payload 解析错误

## 修改的文件

1. `server/api/products/[slug].get.ts` - 修复了两处 locale 键映射（已发布产品和任何状态产品）

## 经验教训

1. **统一数据库 schema 和 TypeScript 类型**：在 API 层进行数据映射是最合适的
2. **检查所有相似的 API 端点**：产品列表修复后，应该检查产品详情端点
3. **保持数据结构一致性**：数据库字段命名应该与前端类型定义保持一致
4. **使用显式映射而非隐式依赖**：明确地映射数据库字段到 TypeScript 类型，避免潜在的类型不匹配

## 相关问题

- 初始问题：`products/bc220g3-s/_payload.json?dev 500 (Server Error)`
- 根本原因：与产品列表页面相同的 locale 键映射问题
- 参考修复：`docs/BUG_FIX_PRODUCTS_LOADING_FINAL.md`

## 状态

✅ **已解决** - 产品详情页面现在可以正确显示数据

## 测试清单

- [x] API 端点返回正确的数据结构
- [x] Locale 键映射正确（zh-CN, zh-HK, en）
- [x] 产品详情页面正常加载
- [x] i18n 翻译正常工作
- [x] 产品图片正常显示
- [x] 产品规格正常显示
- [x] 不再有 Payload 错误
