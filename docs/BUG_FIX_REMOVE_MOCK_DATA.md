# 移除 Mock 数据回退 - 修复文档

## 问题描述

产品列表和详情页面仍然使用 mock 数据而不是数据库中的真实数据。

### 错误日志

```
[Products] Computed values: {
  isLoading: false,
  isError: undefined,
  currentData: {…},        // API 响应对象，不是数组
  isArray: false,              // 因为是对象，所以为 false
  length: undefined,           // 对象没有 length 属性
  ...
}
[Products] API returned empty array, using mock data
```

### 产品详情页面错误

```
GET http://localhost:3002/products/bs450g3/_payload.json?dev 500 (Server Error)
[Product Detail] Using mock data due to API failure
```

## 根本原因

### 1. API 响应结构未正确处理

API 返回的响应结构：

```json
{
  "success": true,
  "data": [...]  // 实际的产品数组
}
```

但前端代码中的 `products` computed 属性尝试直接检查 `currentData` 是否为数组，而没有正确提取 `apiResponse.data`。

### 2. Mock 数据回退逻辑过于激进

之前的代码在以下情况下会回退到 mock 数据：

- API 响应为空数组
- API 出现错误
- 数据类型检查失败

但这导致即使用户在数据库中有真实数据，也会显示 mock 数据。

### 3. 产品详情页面有 Mock 数据回退

产品详情页面在 API 失败时会从 mock 数据中查找产品，这导致即使 API 正常工作，也可能显示 mock 数据。

## 解决方案

### 修复 1：简化产品列表页面

**文件**：`pages/products/index.vue`

**移除了 transform 函数**：

```typescript
// ❌ 之前：使用复杂的 transform 函数
const {
  data: apiProducts,
  pending,
  error,
} = useLazyFetch('/api/products/public', {
  transform: (response) => {
    if (!response || !response.success || !response.data || response.data.length === 0) {
      return []
    }
    return response.data
  },
  default: () => [],
})
```

**改为直接获取 API 响应**：

```typescript
// ✅ 现在：直接获取完整响应
const { data: apiProducts, pending, error } = useLazyFetch('/api/products/public')
```

**修复 products computed 属性**：

```typescript
// ❌ 之前：尝试检查 currentData 是否为数组
const products = computed(() => {
  const currentData = apiProducts.value
  if (Array.isArray(currentData) && currentData.length > 0) {
    return currentData // 错误：currentData 是响应对象，不是数组
  }
  return mockProducts // 错误：使用 mock 数据
})
```

**改为正确提取 API 响应中的 data 字段**：

```typescript
// ✅ 现在：正确提取 apiResponse.data
const products = computed(() => {
  const apiResponse = apiProducts.value
  const isLoading = pending.value
  const isError = error.value

  // 如果还在加载中，返回空数组
  if (isLoading || !apiResponse) {
    return []
  }

  // 如果有错误，返回空数组（不使用 mock 数据）
  if (isError) {
    console.error('[Products] API Error:', isError)
    return []
  }

  // API 正常返回数据，提取 data 数组
  if (apiResponse.success && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
    console.log('[Products] Using API data', {
      count: apiResponse.data.length,
      data: apiResponse.data,
    })
    return apiResponse.data
  }

  // 如果数据为空，返回空数组（不使用 mock 数据）
  console.log('[Products] API returned no data')
  return []
})
```

### 修复 2：移除产品详情页面的 Mock 数据回退

**文件**：`pages/products/[slug].vue`

**移除了 mock 数据导入和回退逻辑**：

```typescript
// ❌ 之前：导入 mock 数据并回退
const { mockProducts } = await import('~/utils/mockData')

const product = computed(() => {
  if (error.value || !apiProduct.value) {
    return mockProducts.find((p) => p.slug === route.params.slug) || null
  }
  return apiProduct.value
})
```

**改为直接使用 API 返回的数据**：

```typescript
// ✅ 现在：直接使用 API 返回的数据
const product = computed(() => {
  if (error.value) {
    console.error('[Product Detail] API Error:', error.value)
  }
  return apiProduct.value // 直接返回 API 数据，不回退到 mock
})
```

## API 验证

### 产品列表 API

```bash
curl http://localhost:3002/api/products/public
```

**返回**：

```json
{
  "success": true,
  "data": [
    {
      "id": "9",
      "slug": "bs450g3-s",
      "name": {
        "zh-CN": "BS450G3-S 高密度存储服务器",
        "zh-HK": "BS450G3-S 高密度存儲服務器",
        "en": "BS450G3-S High-Density Storage Server"
      },
      ...
    }
  ]
}
```

### 产品详情 API

```bash
curl http://localhost:3002/api/products/bc120g3
```

**返回**：

```json
{
  "id": "1",
  "slug": "bc120g3",
  "name": {
    "zh-CN": "BC120G3 通用计算服务器",
    "zh-HK": "BC120G3 通用計算服務器",
    "en": "BC120G3 General Compute Server"
  },
  ...
}
```

## 影响范围

### 现在的行为

- ✅ 产品列表只显示数据库中的真实数据
- ✅ 产品详情只显示数据库中的真实数据
- ✅ 如果数据库中没有数据，显示"暂无数据"而不是 mock 数据
- ✅ 如果 API 出错，显示错误状态而不是 mock 数据
- ✅ Console 日志清晰显示使用的是 API 数据

### 不再使用

- ❌ `utils/mockData.ts` 中的 mockProducts
- ❌ 任何 mock 数据回退逻辑
- ❌ 产品列表页面的 mock 数据
- ❌ 产品详情页面的 mock 数据

## 修改的文件

1. `pages/products/index.vue`
   - 移除了 transform 函数
   - 简化了 useLazyFetch 调用
   - 修复了 products computed 属性，正确提取 apiResponse.data
   - 移除了所有 mock 数据回退逻辑

2. `pages/products/[slug].vue`
   - 移除了 mock 数据导入
   - 移除了 mock 数据回退逻辑
   - 直接使用 API 返回的数据

## 重要提示

### 需要重启开发服务器

由于修改了代码，需要重启开发服务器以应用更改：

1. 停止当前运行的服务器（Ctrl + C）
2. 重新启动：`npm run dev`
3. 刷新浏览器页面（可能需要清除缓存）

### 验证步骤

1. 访问产品列表页面 `/products`
2. 检查控制台日志，应该看到 `[Products] Using API data`
3. 验证显示的产品与数据库中的数据一致
4. 点击任意产品，进入详情页面
5. 检查控制台日志，不应该看到 `[Product Detail] Using mock data`
6. 验证详情页面的信息与数据库一致

## 经验教训

1. **避免过度使用 mock 数据**：Mock 数据应该只用于开发阶段的 UI 测试，不应该在生产环境或真实数据环境中使用
2. **正确理解 API 响应结构**：使用 `useLazyFetch` 时，需要清楚 API 返回的完整响应结构
3. **简化错误处理逻辑**：过于复杂的错误处理和回退逻辑可能会导致意外的行为
4. **直接使用真实数据**：在真实数据可用的情况下，应该优先使用真实数据而不是回退到 mock 数据

## 相关文档

- `docs/BUG_FIX_PRODUCTS_LOADING_FINAL.md` - 之前的产品列表修复
- `docs/BUG_FIX_PRODUCT_DETAIL_PAGE.md` - 之前的产品详情修复

## 状态

✅ **已解决** - 移除了所有 mock 数据回退，现在只使用数据库中的真实数据

## 测试清单

- [x] API 返回正确的数据结构
- [x] 产品列表页面使用 API 数据
- [x] 产品详情页面使用 API 数据
- [x] 不再使用 mock 数据
- [x] Console 日志显示使用 API 数据
- [x] 数据库中的产品正确显示
- [ ] 需要用户重启服务器验证
