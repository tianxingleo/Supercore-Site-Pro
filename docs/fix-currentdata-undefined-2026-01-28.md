# 修复产品页面 currentData 变量未定义错误

## 问题描述
在访问产品列表页面时（`/zh-CN/products`），浏览器控制台出现以下错误：

```
ERROR [SYSTEM] Client Error: currentData is not defined
  Context: {
    "component": "Unknown",
    "info": "watcher callback",
    "type": "Vue Error",
    "errorName": "ReferenceError",
    "source": "client"
  }
```

## 问题原因
在 `pages/products/index.vue` 文件的第129行，一个 watch 回调函数中使用了未定义的变量 `currentData`：

```typescript
watch(products, (newProducts) => {
  console.log('[Products] Display products changed:', {
    length: newProducts.length,
    isUsingMock: newProducts === mockProducts,
    apiProductsLength: currentData?.length || 0,  // ❌ currentData 未定义
    mockProductsLength: mockProducts.length,
  })
})
```

## 解决方案
将 `currentData` 替换为正确的变量引用 `apiProducts.value?.data`：

```typescript
watch(products, (newProducts) => {
  console.log('[Products] Display products changed:', {
    length: newProducts.length,
    isUsingMock: newProducts === mockProducts,
    apiProductsLength: apiProducts.value?.data?.length || 0,  // ✅ 正确引用
    mockProductsLength: mockProducts.length,
  })
})
```

## 修改文件
- `pages/products/index.vue` - 第129行

## 测试验证
修改后，访问产品列表页面 `/zh-CN/products` 应该不再出现 `currentData is not defined` 错误。

## 修复日期
2026-01-28
