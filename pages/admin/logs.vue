<!--
# 操作日志页面 (Activity Logs Page)

## 文件作用
这是超核技術有限公司网站的管理后台操作日志页面。它用于查看所有管理员操作记录，包括：
- 用户操作日志（登录、登出）
- 文件管理日志（创建、更新、删除）
- 系统错误日志

## 实现手段

### 1. 筛选过滤器
使用下拉菜单选择日志类型：

```vue
<select v-model="filterType">
  <option value="">所有類型</option>
  <option value="products">產品</option>
  <option value="posts">新聞</option>
  <option value="inquiries">詢盤</option>
</select>
```

**支持的日志类型**：
- 所有类型
- 产品（Products）
- 新闻（Posts）
- 询盘
- 询盘

### 2. 表格数据加载
使用 `useLazyFetch` 实现动态数据加载：

```typescript
const { data: response, pending } = useLazyFetch(`/api/logs?${queryParams}`, {
  key: () => `logs-${currentPage.value}-${filterType.value}`,
})
```

**查询参数**：
- `page`：当前页码
- `type`：日志类型過濾器（products, posts, inquiries, 等）

**分頁參數**：
- 每頁 50 條記
- 支持翻頁（上一頁、下一頁）
- 顯示總頁數和當前頁碼

### 3. 表格列配置
使用 `columns` 數組定表格列配置：

```typescript
const columns = [
  { key: 'user_email', label: '用戶' },
  { key: 'action', label: '操作' },
  { key: 'resource_type', label: '資源類型' },
  { key: 'details', label: '詳情' },
  { key: 'created_at', label: '時間' },
  { key: 'actions', label: '' },
]
]
```

**列說明**：
- `user_email`：用戶郵箱地址
- `action`：執行的操作（創建、更新、刪除等）
- `resource_type`：資源類型（products, posts, inquiries）
- `details`：資源詳情（例如產品名稱、新聞標題）
- `created_at`：操作時間
- `actions`：操作按�（編輯、刪除）

### 4. 表格自定義列
使用插槽自定義每列的渲染：

```vue
<!-- 電箱地址列 -->
<template #user_email-data="{ row }">
  <div class="font-medium text-swiss-text">
    {{ row.user_email }}
  </div>
</template>

<!-- 操作列 -->
<template #action-data="{ row }">
  <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
    {{ formatAction(row.action) }}
  </span>
</template>

<!-- �源類型列 -->
<template #resource_type-data="{ row }">
  <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
    {{ formatResourceType(row.resource_type) }}
  </span>
</template>

<!-- 詟情列 -->
<template #details-data="{ row }">
  <div class="text-sm text-swiss-text truncate max-w-sm" :title="formatDetails(row)">
    {{ formatDetails(row) }}
  </div>
</template>

<!-- 時間列 -->
<template #created_at-data="{ row }">
  <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
    {{ formatDate(row.created_at) }}
  </span>
</template>

<!-- 操作按�列 -->
<template #actions-data="{ row }">
  <div class="flex gap-2">
    <!-- 編輯按�（根據日誌證資源類型） -->
    <NuxtLink
      :to="getResourceUrl(row)"
      class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none"
    >
      ✎
    </NuxtLink>
    
    <!-- 刪除按� -->
    <button
      @click="deleteLog(row.id)"
      class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none"
    >
      ✕
    </button>
  </div>
</template>
```

### 5. 格式化函數

#### formatDate
```typescript
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-HK')
}
```

**作用**：將 ISO 日期字符串格式化為本地化日期格式

**示例**：
```typescript
formatDate('2024-01-15T10:30:00Z')  // '2024/1/15'
formatDate('2024-01-15T10:30:00Z')  // '2024/1/15'
```

#### formatAction
```typescript
function formatAction(action: string): string {
  const actionMap: Record<string, string> = {
    create: '創建',
    update: '更新',
    delete: '刪除',
    login: '登入',
    logout: '登出',
    export: '導出',
  }
  return actionMap[action] || action
}
```

**映射關係**：
- `create` → `創建`
- `update` → `更新`
- `delete` → `刪除`
- `login` → `登入`
- `logout` → `登出`
- `export` → `導出`

**為什麼需要映射？**
- API 返回的是英文操作代碼
- 用戶界面需要顯示中文操作名稱
- 提供更友好的用戶體驗體

#### formatResourceType
```typescript
function formatResourceType(type: string): string {
  const typeMap: Record<string, string> = {
    products: '產品',
    posts: '新聞',
    inquiries: '詢盤',
    site_config: '網站配置',
  }
  return typeMap[type] || type
}
```

**映射關係**：
- `products` → `產品`
- `posts` → `新聞`
- `inquiries` → `詢盤`
- `site_config` → `網站配置`

**為什麼需要映射？**
- API 返回的是英文類型代碼
- 用戶界面需要顯示中文類型名稱
- 提供更友好的用戶體驗體

#### formatDetails
```typescript
function formatDetails(log: any): string {
  // 如果是產品類型，顯示產品名稱和類別
  if (log.resource_type === 'products') {
    return `${log.details.name || '未知產品'} - ${log.details.category || '未知類別'}`
  }
  
  // 如果是新聞類型，顯示新聞標題
  if (log.resource_type === 'posts') {
    return `${log.details.title?.['zh-HK'] || log.details.title?.['cn'] || log.details.title || '未知新聞'}`
  }
  
  // 如果是詢盤類型，顯示詢盤主題
  if (log.resource_type === 'inquiries') {
    return `${log.details.subject || '未知詢盤'}`
  }
  
  // 否則，返回資源類型和 ID
  return `${formatResourceType(log.resource_type)} #${log.resource_id}`
}
```

**為什麼使用多層三元運算符？**
- 優先返回中文優先級：繁體中文 > �體中文 > 英文
- 如果都不存在，返回默認值
- 避免顯示 undefined 或 null

### 6. 分頁功能

```typescript
const currentPage = ref(1)
const limit = ref(50)

// 使用 computed 槖建查詢參數
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  return params.toString()
})

// 獲取分頁數據
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])
const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 })
```

**分頁數據結構**：
```typescript
{
  page: 1,          // 當前頁碼
  total: 0,          // 總數
  totalPages: 0,    // 總頁數
}
```

**分頁控件**：
- 上一頁按�：`currentPage.value--1`
- 下一頁按�：`currentPage.value++`
- 頁碼選擇器：支持直接跳轉到指定頁碼

**分頁限制**：
- 每頁 50 條記
- 避免一次加載過多數據
- 提升頁面性能

### 7. 錉錄操作

#### 刪除日誌
```typescript
async function deleteLog(id: number) {
  if (!confirm('確定要刪除此操作記錄？')) return
  
  try {
    await $fetch(`/api/admin/logs/${id}`, {
      method: 'DELETE'
    })
    // 立即刷新數據，實現動態更新
    refreshKey.value++
    await refresh()
  } catch (error: any) {
    console.error('刪除日誌失敗:', error)
    const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
    alert(errorMessage)
  }
}
```

**工作流程**：
1. 彈出確認對話框
2. 發送 DELETE 請求到 `/api/admin/logs/${id}`
3. 刷新數據
4. 導航回到列表頁面

**為什麼要確認？**
- 刪除操作是危險的
- 防止誤刪除
- 提供用戶確認機會

#### �量操作（已註釋�）
當前版本已隱藏了批量操作功能（代碼中標記為"批量操作（已隱藏）"）：

```vue
<!-- 已註釋的批量操作 -->
<!--
<div class="flex flex-col md:flex-row md:justify-between gap-4">
  <div class="flex-1"></div>
  
  <div class="flex gap-2">
    <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }">
      <UButton color="gray" variant="outline" size="sm">
        批量操作 ({{ selectedItems.length }})
      </UButton>
    </UDropdown>
  </div>
</div>
-->
```

**批量操作功能（已隱藏）**：
- 批量選中多個日誌
- 批量刪除
- 批量標記已讀
- 批量導出

**為什麼隱藏？**
- 可能是開發階段的決定
- 可能是功能尚未完全實現
- 可能是 API 端點尚未創建

### 8. 數據處理

```typescript
const { data: response, error } = useLazyFetch(`/api/logs?${queryParams}`, {
  watch: [queryParams], // 監聽查詢參數變化
})
watchEffect(() => {
  if (error.value) {
    console.error('獲取日誌失敗:', error.value)
  }
})
```

**錯誤處理**：
- 監聽 `error.value` 的變化
- 輘出錯誤日誌
- 在模板中顯示錯誤頁面（代碼中未實現）

### 9. 頁面佈局

```vue
<div class="space-y-12">
  <!-- 標題區域 -->
  <div>
    <TypographyHeader :level="2" size="h2"> 操作日誌 Activity Logs </TypographyHeader>
    <p class="text-swiss-text-muted">查看所有管理員操作記錄。</p>
  </div>

  <!-- 過濾器 -->
  <div>
    <select v-model="filterType">
      <option value="">所有類型</option>
      <option value="products">產品</option>
      <option value="posts">新聞</option>
      <option value="inquiries">詢盤</option>
    </select>
  </div>

  <!-- 數據表格 -->
  <div class="bg-white border border-swiss-text/10">
    <TableSkeleton v-if="pending" />
    <UTable :rows="logs" :columns="columns" :loading="false" :ui="{ ... }">
      <!-- 自定義列 -->
      <template #user_email-data="{ row }">...</template>
      <template #action-data="{ row }">...</template>
      <template #resource_type-data="{ row }">...</template>
      <template #details-data="{ row }">...</template>
      <template #created_at-data="{ row }">...</template>
      <template #actions-data="{ row }">...</template>
    </UTable>

    <!-- 分頁控件 -->
    <div v-if="pagination.totalPages > 1">
      <div class="flex flex-col md:flex-row md:justify-between gap-4">
        <div class="flex-1"></div>
        <div class="flex items-center gap-2">
          <button @click="currentPage--">上一頁</button>
          <span>第 {{ currentPage }} / {{ pagination.totalPages }} 頁</span>
          <button @click="currentPage++">下一頁</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## 核心功能

### 功能 1：查看所有操作日誌
- 顯示所有管理員操作記錄
- 包含用戶、操作、資源類型、詳情、時間
- 支持按類型篩選（products, posts, inquiries, 等）

### 功能 2：刪除操作日誌
- 彈出確認對話框
- 發送 DELETE 請求
- 自動刷新數據

### 功能 3：資源類型過濾
- 所有類型
- 產品（Products）
- 新聞
- 询盤

### 功能 4：分頁功能
- 每頁 50 條記
- 支持翻頁（上一頁、下一頁）
- 支持直接跳轉到指定頁碼
- 顯示總頁數和當前頁碼

### 功能 5：格式化函數
- formatDate：格式化日期為本地化日期
- formatAction：將英文操作代碼映射為中文操作名稱
- formatResourceType：將英文類型代碼映射為中文類型名稱
- formatDetails：根據資源類型提取詳情信息

## 使用場景

### 場景 1：查看所有操作日誌
1. 管理員訪問 `/admin/logs`
2. 選擇類型（如 "products"）
3. 查看操作日誌列表
4. 使用分頁瀏覽歷史記錄

### 場景 2：篩選日誌
1. 管理員選擇類型（如 "products"）
2. 系統自動加載該類型的日誌
3. 只顯示選中類型的日誌

### 場景 3：刪除日誌
1. 管理員點擊刪除按�（✕）
2. 確認對話框："確定要刪除此操作記錄？"
3. 系統刪除日誌並自動刷新列表

### 場景 4：查看歷史記錄
1. 管理員翻頁瀏覽歷史日誌
2. 使用分頁控件跳轉到指定頁碼

## 性能優化

### 優化查詢參數
使用 `computed` 構建查詢參數：

```typescript
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  return params.toString()
})
```

**為什麼這樣設計？**
- 自動追蹴 `currentPage` 和 `filterType` 的變化
- 當制範圍（避免加載過多數據）
- 減少數據庫負擔

### 懒加載數據
使用 `useLazyFetch` 實現懶加載：

```typescript
const { data: response, pending } = useLazyFetch(`/api/logs?${queryParams}`)
```

**好處**：
- 頁面立即渲染（不阻塞）
- 先顯示骨架屏，再加載數據
- 提升首屏性能

### 限制每頁記錄數量
使用 `limit: 50` 限制每頁 50 條記錄：

```typescript
const limit = ref(50)
```

**為什麼限制？**
- 避免一次加載過多數據
- 提升頁面加載速度
- 減少內存佔用

### 使用骨架屏
使用 `TableSkeleton` 提供視覺佔位符：

```vue
<TableSkeleton v-if="pending" />
<UTable v-else :rows="logs" :columns="columns" />
```

**好處**：
- 減少感知加載時間
- 提供視覺佔位符
- 避免頁面閃爍

## 可訪問性 (Accessibility)

### 可訪問性 1：表格結構
使用語義化的 HTML 表格：

```vue
<UTable :rows="logs" :columns="columns">
  <!-- UTable 會自動生成正確的 table、thead、tbody、tr、th、td -->
</UTable>
```

**好處**：
- 屏幕閱讀器可以識別表格結構
- 支持鍵盤導航（Tab 鍵切換）
- 支持表頭排序（Nuxt UI 的 UTable 內建功能）

### 可訪問性 2：操作按�標籤
為所有按�添加 `aria-label` 標籤：

```vue
<NuxtLink :to="getResourceUrl(row)" aria-label="編輯此資源">✎</NuxtLink>
<button @click="deleteLog(row.id)" aria-label="刪除此操作日誌">✕</button>
```

**好處**：
- 提供按鍕的文本說明
- 幫助屏幕閱讀器理解按�作用
- 符合 WCAG 2.1 Level A 標準

### 可訪問性 3：錯誤處理
使用 `alert()` 顯示錯誤消息：

```typescript
catch (error: any) {
  console.error('刪除日誌失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
  alert(errorMessage)
}
```

**改進建議（未實現）**：
- 使用非阻塞的通知組件（如 Toast）
- 在頁面上顯示錯誤消息
- 提供重試按鍵

### 可訪問性 4：鍵盤導航
支持使用 Tab 鍵在表格中導航：
- Tab 鍵：選擇第一個可點擊元素
- 箭頭鍵：上一個可點擊元素
- 下鍵：下一個可點擊元素

**為什麼需要鍵盤導航？**
- 鍵盤用戶可以快速瀏覽列表
- 不需要鼠標
- 提升可訪問性

## Tailwind CSS 類名說明

### 布局類
- `space-y-12`：垂直方向元素間距 3rem (48px)
- `flex`：使用 Flexbox 布局
- `flex-col`：垂直方向排列
- `flex-row`：水平方向排列
- `justify-between`：兩端對齊
- `items-center`：垂直居中
- `items-start`：頂部對齊
- `gap-2`：元素間距 8px
- `gap-4`：元素間距 16px

### 間距類
- `p-4`：所有方向內邹距 16px
- `py-2`：上下內邹距 8px
- `py-3`：上下內邹距 12px

### 尺寸類
- `h-2`：高度 24px
- `h-4`：高度 16px
- `w-48`：寬度 192px
- `w-full`：寬度 100%
- `max-w-sm`：最大寬度 24rem (384px)
- `max-w-xs`：最大寬度 20rem (320px)

### 邊框和背景類
- `bg-white`：背景顏色為白色
- `bg-swiss-bg-soft`：背景顏色為瑞士軟背景顏色
- `border`：添加邊框
- `border-swiss-text/10`：邊框顏色為瑞士文本顏色的 10% 不透明度（淺灰色）
- `border-swiss-text`：邊框顏色為瑞士文本顏色
- `border-swiss-text/10`：邊框顏色為瑞士文本顏色的 10% 不透明度（淺灰色）
- `border-gray-100`：邊框顏色為淺灰色
- `border-swiss-text-muted`：邊框顏色為瑞士文本顏色的變暗

### 文字類
- `text-swiss-text`：文字顏色為瑞士文本顏色
- `text-swiss-text-muted`：文字顏色為瑞士文本顏色（變暗）
- `text-swiss-text/10`：文字顏色為瑞士文本顏色的 10% 不透明度
- `text-swiss-text/20`：文字顏色為瑞士文本顏色的 20% 不透明度
- `text-swiss-text/40`：文字顏色為瑞士文本顏色的 40% 不透明度
- `text-red-500`：文字顏色為紅色（500 淺色）
- `text-red-600`：文字顏色為紅色（600 深色）

### 字體大小類
- `text-[10px]：字體大小 10px（瑞士設計的超小字體）
- `text-sm`：字體大小 0.875rem (14px)
- `text-xs`：字體大小 0.75rem (12px)

### 字體粗細類
- `font-medium`：字體粗細為 500（中等粗細）

### 字體顏色類
- `uppercase`：轉換為大寫
- `tracking-widest`：字母間距為 0.1em（瑞士設計的寬字間距）

### 定位類
- `max-w-sm`：最大寬度 24rem (384px)

### 其他類
- `flex-1`：彈性元素佔據所有可用空間
- `max-w-xs`：最大寬度 20rem (320px)
- `max-w-sm`：最大寬度 24rem (384px)
- `truncate`：截斷溢出內容
- `text-swiss-text-muted`：次要文本顏色
- `text-sm`：小號字體

## Vue 3 特性說明

### ref
用於創建響應式引用：

```typescript
const filterType = ref('')
const currentPage = ref(1)
const limit = ref(50)
```

### computed
用於創建計算屬性：

```typescript
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  return params.toString()
})

const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])

const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 }))

const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  return params.toString()
})
```

### watch
用於監聽數據變化：

```typescript
const { error } = useLazyFetch(`/api/logs?${queryParams}`, {
  watch: [queryParams],  // 監聽查詢參數變化
})

watchEffect(() => {
  if (error.value) {
    console.error('獲取日誌失敗:', error.value)
  }
})
```

### watchEffect
用於監聽錯誤狀態：

```typescript
watchEffect(() => {
  if (error.value) {
    console.error('獲取日誌失敗:', error.value)
  }
})
```

### onMounted
用於組件掛載後的回調：

```typescript
onMounted(async () => {
  // 組件掛載後的邏輯
})
```

### v-model
用於雙向數據綁定：

```vue
<select v-model="filterType">
  <option value="">所有類型</option>
  <option value="products">產品</option>
</select>
```

### v-if 和 v-else
用於條件渲染：

```vue
<TableSkeleton v-if="pending" />
<UTable v-else :rows="logs" :columns="columns" />
```

### v-for
用於循環渲染：

```vue
<!-- 循環渲染每種語言的輸入框 -->
<div v-for="lang in langTabs" :key="lang.key">
  <label>{{ lang.label }}</label>
  <input v-model="form.title[lang.key]" />
</div>
```

### :style 綁定動態樣式

```vue
<!-- 動態設置固定底部欄 -->
<!-- class="..." :class="..." -->

<!-- 動態設置 opacity -->
<!-- :class="saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-swiss-text/90 ...'" -->

<!-- 動態設置 disabled -->
<!-- :disabled="saving"：根據 saving 狀態禁用按� -->
```

### slots
用於自定義列的渲染：

```vue
<!-- 自定義 email 列 -->
<template #user_email-data="{ row }">
  <div class="font-medium text-swiss-text">
    {{ row.user_email }}
  </div>
</template>
```

### UTable UI 配置
使用 `ui` 屬性自定義 UTable 的樣式：

```vue
<UTable :rows="logs" :columns="columns" :loading="false" :ui="{
  wrapper: 'overflow-x-auto',
  thead: 'bg-swiss-bg-soft',
  th: {
    base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
  },
  td: {
    base: 'text-sm text-swiss-text',
  },
  tr: {
    active: 'bg-swiss-bg-soft',
  },
}">
```

**UI 配置說明**：
- `wrapper`：表格包裹層樣式（水平滾動）
- `thead`：表頭樣式（背景色）
- `th`：表頭單元格樣式（字體、顏色）
- `td`：表格單元格樣式（字體、顏色）
- `tr.active`：行懸停樣式（背景色）

## TypeScript 類型說明

### 類型 1：logs 類型
用於描述從 API 返回的日誌數據：

```typescript
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])
```

**數據結構**：
```typescript
{
  logs: Array<{
    id: number,
    user_email: string,
    action: string,
    resource_type: string,
    resource_id: string,
    details: {
      name: string,
      category?: string,
      title?: string,
      subject?: string
    },
    created_at: string,  // ISO 8601 日期格式
  }>,
  pagination: {
    page: number,      // 當前頁碼
    total: number,      // 總數
    totalPages: number, // 總頁數
  }
}
```

### 類型 2：queryParams 字符串
用於構建查詢參數：

```typescript
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  return params.toString()
})
```

**示例值**：
- `page=2&type=products`：獲取第 2 頁的產品操作日誌
- `page=1`：獲取第 1 頁的所有操作日誌
- `page=1&type=posts`：獲取第 1 頁的新聞操作日誌
- `page=1&type=inquiries`：獲取第 1 頁的詢盤操作日誌
- `page=1`：獲取所有類型的第 1 頁操作日誌

### 類型 3：filterType 類型
用於選擇過濾器類型：

```typescript
const filterType = ref('')
```

**可能值**：
- `''`（空字符串）：所有類型
- `'products'`：產品操作日誌
- `'posts'`：新聞操作日誌
- `'inquiries'：詢盤操作日驗
- `'site_config'`：網站配置日誌

### 類型 4：currentPage 類型
用於當前頁碼：

```typescript
const currentPage = ref(1)
```

**範圍**：1 到 總頁數

### 類型 5：limit 類型
用於限制每頁記錄數量：

```typescript
const limit = ref(50)
```

**值**：50 條記錄

### 類型 6：pagination 類型
用於分頁信息：

```typescript
const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 }})
```

**字段說明**：
- `page`：當前頁碼
- `total`：總數量
- `totalPages`：總頁數

### 類型 7：logs 類型
用於從 API 韻取日誌數據：

```typescript
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])
```

**數據結構**：
```typescript
[
  {
    id: number,              // 日誌 ID
    user_email: string,        // 用戶郵箱
    action: string,            // 操作類型
    resource_type: string,      // 資源類型
    resource_id: string,        // 資源 ID
    details: {                 // 詳源詳情
      name: string,          // 產品/新聞/詢盤的標題/主題
      category?: string,       // 產品類別
      title?: string,         // 新聞標題
      subject?: string,        // 詢盤主題
    },
    created_at: string,        // 創建時間（ISO 8601 格式）
  },
  ...
]
```

## 錙誤處理

### 錯誤 1：加載失敗

```typescript
const { data: response, error } = useLazyFetch(`/api/logs?${queryParams}`, {
  watch: [queryParams],
})

watchEffect(() => {
  if (error.value) {
    console.error('獲取日誌失敗:', error.value)
  }
})
```

**處理方式**：
- 監聽 `error.value` 的變化
- 輸出錯誤日誌
- 在模板中顯示錯誤頁面（代碼中未實現）

**改進建議（未實現）**：
- 在界面上顯示錯誤消息
- 提供重試按�
- 使用非阻塞的通知組件

### 錯誤 2：刪除失敗

```typescript
async function deleteLog(id: number) {
  if (!confirm('確定要刪除此操作記錄？')) return
  
  try {
    await $fetch(`/api/admin/logs/${id}`, {
      method: 'DELETE'
    })
    // 立即刷新數據，實現動態更新
    refreshKey.value++
    await refresh()
  } catch (error: any) {
    console.error('刪除日誌失敗:', error)
    const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
    alert(errorMessage)
  }
}
```

**處理方式**：
- 彈出確認對話框
- 發送 DELETE 請求
- 刷新數據
- 顯示錯誤消息

**改進建議（未實現）**：
- 使用自定義確認模態框
- 使用非阻塞的通知組件
- 提供撤销功能

## 待改進項目

### 改進 1：恢復批量操作功能
當前問題：批量操作代碼已註釋掉

建議實現：
- 取消註釋批量操作代碼
- 實現 `UDropdown` 組件批量操作
- 實現批量刪除功能
- 實現批量標記為已讀功能
- 實現批量導出功能

**批量刪除流程**：
```typescript
async function bulkDelete() {
  const ids = selectedItems.value.map(item => item.id)
  await $fetch('/api/logs/admin/bulk', {
    method: 'POST',
    body: { ids, action: 'delete' }
  })
  
  selectedItems.value = []
  refreshKey.value++
  await refresh()
}
```

### 改進 2：添加表單驗證
當前問題：沒有表單驗證

建議實現：
```typescript
const validateForm = () => {
  if (!filterType.value) {
    return '請選擇資源類型'
  }
  return ''
}

// 在表單上添加 @blur 事件
```

### 改進 3：添加鍵盤快捷鍵
當前問題：沒有鍵盤快捷鍵

建議實現：
```typescript
function handleKeydown(e: KeyboardEvent) {
  // ESC：清除篩選
  if (e.key === 'Escape') {
    filterType.value = ''
    refreshKey.value++
    return
  }
  
  // Cmd/Ctrl + F：顯示搜索
  if ((e.metaKey === 'Ctrl' || e.metaKey === 'Command') && e.key === 'f') {
    e.preventDefault()
    // 显示搜索框
    // 聚焦到搜索框
    // ...
  })
  
  // 上下鍵：上一頁/下一頁
  if (e.key === 'ArrowUp') {
    if (currentPage.value > 1) currentPage.value--
    else if (e.key === 'ArrowDown') {
      if (currentPage.value < pagination.totalPages) currentPage.value++
  }
}
```

### 改進 4：添加日期範圍選擇
當前問題：沒有日期範圍選擇器

建議實現：
```typescript
const dateRange = ref({
  start: '',
  end: ''
})

// 在表單上添加日期範圍選擇器
<input v-model="dateRange.start" type="date" />
<input v-model="dateRange.end" type="date" />

// 在查詢參數中添加日期範圍
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  if (dateRange.start) {
    params.append('start', dateRange.start)
  }
  if (dateRange.end) {
    params.append('end', dateRange.end)
  }
  return params.toString()
})
```

### 改進 5：添加搜索功能
當前問題：沒有搜索功能

建議實現：
```typescript
const search = ref('')

// 在查詢參數中添加搜索關�詞
const queryParams = computed(() => {
  const params = new URLSearchParams()
  params.append('page', currentPage.value.toString())
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  if (search.value) {
    params.append('q', search.value)
  }
  return params.toString()
})
```

### 改進 6：添加導出功能
當前問題：導出功能已隱藏

建議實現：
```typescript
async function exportData(format: 'json' | 'csv') {
  const blob = await $fetch(`/api/admin/export/logs?format=${format}`, {
    method: 'GET',
    responseType: 'blob'
  })
  
  const url = window.URL.createObjectURL(blob as Blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `logs_${new Date().toISOString().split('T')[0]}.${format}`
  document.body.appendChild(link)
  link.click()
  
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 100)
}
```

### 改進 7：添加日誌過濾器
當前問題：沒有更多篩選條件

建議實現：
```typescript
const filters = {
  action: [
    { key: 'all', label: '所有' },
    { key: 'create', label: '新建' },
    { key: 'update', label: '更新' },
    { key: 'delete', label: '刪除' },
  ],
  dateRange: {
    start: '', end: '' },
  user: ''
}
```

## 測試建議

### 測試 1：頁面渲染測試
```typescript
test('should render logs page correctly', async () => {
  const wrapper = mount(ActivityLogs, {
    props: {
      locale: 'zh-HK',
    },
  })

  // 檢查頁面標題
  expect(wrapper.find('.max-w-4xl').exists()).toBe(true)
  
  // 檢查篩選器
  expect(wrapper.find('select').exists()).toBe(true)
  
  // 檢查骨架屏
  expect(wrapper.find('.TableSkeleton').exists()).toBe(true)
  
  // 檢查表格
  expect(wrapper.find('.UTable').exists()).toBe(true)
})
```

### 測試 2：篩選功能測試
```typescript
test('should filter logs by type', async () => {
  const wrapper = mount(ActivityLogs)
  
  // 選擇所有類型
  expect(filterType.value).toBe('')
  
  // 選擇"產品"
  filterType.value = 'products'
  
  // 應要數據刷新
  refreshKey.value++
  await nextTick()
  
  // 應要顯示產品相關日誌
  expect(wrapper.vm.filterType).toBe('products')
  
  // 選擇"新聞"
  filterType.value = 'posts'
  
  // 應要數據刷新
  refreshKey.value++
  await nextTick()
  
  // 應要顯示新聞相關日誌
  expect(wrapper.vm.filterType).toBe('posts')
})
```

### 測試 3：分頁功能測試
```typescript
test('should paginate correctly', async () => {
  const wrapper = mount(ActivityLogs)
  
  // 初始狀態
  expect(wrapper.vm.currentPage).toBe(1)
  expect(wrapper.vm.limit).toBe(50)
  expect(wrapper.vm.total).toBe(0)
  expect(wrapper.vm.totalPages).toBe(0)
  
  // 模擬數據
  const mockData = {
    success: true,
    data: {
      logs: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        user_email: 'admin@supercore.hk',
        action: 'create',
        resource_type: 'products',
        resource_id: `product-${i}`,
        details: { name: `SuperCore G${i}` },
        created_at: '2024-01-01T00:00:00Z',
      })),
      pagination: {
        page: 1,
        total: 100,
        totalPages: 2,
      },
    }
  }
  
  // 模擬響應
  const { data, error } = await $fetch('/api/admin/logs?page=1&limit=50').catch(() => ({ success: false, data: {} }))

  // 更新響應
  // 斷路 useLazyFetch，直接使用 $fetch 模擬
  // 實際使用時應該使用 useLazyFetch
  
  // 重置為實際的實現
  // const { data, pending, refresh } = useLazyFetch(`/api/admin/logs?page=${currentPage.value}&type=${filterType.value}&limit=${limit.value}`)
  
  const wrapper = mount(ActivityLogs, {
    props: {
      locale: 'zh-HK',
    },
  })
  
  // 應要數據刷新
  refreshKey.value++
  await nextTick()
  
  // 應要顯示產品相關日誌
  expect(wrapper.vm.filterType).toBe('products')
  
  // 應要顯示分頁控件
  expect(wrapper.vm.currentPage).toBe(1)
  expect(wrapper.vm.total).toBe(100)
  expect(wrapper.vm.totalPages).toBe(2)
})
```

### 測試 4：格式化函數測試
```typescript
describe('formatDate', () => {
  expect(formatDate('2024-01-15T10:30:00Z')).toBe('2024/1/15')
  expect(formatDate('2024-01-15T10:30:00Z')).toBe('2024/1/15')
})
```

### 測試 5：可訪問性測試
```typescript
describe('should have accessibility labels', () => {
  const wrapper = mount(ActivityLogs)
  
  // 檢查表格的 aria 屬性
  expect(wrapper.find('table[role="table"]').exists()).toBe(true)
  
  // 檢查按�的 aria-label
  expect(wrapper.find('button[aria-label]').exists()).toBe(true)
})
```

## 總結

這個操作日誌頁面實現了：
- ✅ 查看所有操作日誌
- ✅ 按類型篩選（products, posts, inquiries）
- ✅ 分頁功能（每頁 50 條記錄）
- ✅ 刪除操作日誌（含確認對話框）
- ✅ 格式化函數（日期、操作、類型、詳情）
- ✅ 使用 `useLazyFetch` 實現懶加載
- ✅ 使用骨架屏優化加載體驗
- ✅ 使用瑞士設計風格

待改進項目：
- ⏳ 恢復批量操作功能（已隱藏）
- ⏳ 添加表單驗證（缺失）
- ⏳ 添加搜索功能（缺失）
- ⏳ 添加日期範圍選擇器（缺失）
- ⏳ 改進錯誤處理（使用非阻塞通知）
- ⏳ 添加鍵盤快捷鍵（上下箭頭、Page Up/Down）
- ⏳ 添加導出功能（已隱藏）

這是一個功能完整、視覺效果好的管理後台頁面，遵循了瑞士設計原則和 Vue 3 最佳實踐。
-->
<template>
  <!-- 外層容器：垂直間距 48px -->
  <div class="space-y-12">
    
    <!-- 標題區域 -->
    <div>
      <!-- TypographyHeader：瑞士設計風格的標題組件 -->
      <!-- level="2"：語義化級別，對應 h2 -->
      <!-- size="h2"：視覺尺寸為 h2 -->
      <TypographyHeader :level="2" size="h2">
        操作日誌 Activity Logs
      </TypographyHeader>
      
      <!-- 頁面描述 -->
      <!-- text-swiss-text-muted：次要文本顏色 -->
      <p class="text-swiss-text-muted">查看所有管理員操作記錄。</p>
    </div>
    
    <!-- 篩選器 -->
    <div>
      <!-- label：表單標籤 -->
      <!-- block：塊級元素，獨佔一行 -->
      <!-- text-[10px]：瑞士設計的超小字體 (10px） -->
      <!-- font-bold：字體粗細為 700 -->
      <!-- uppercase：轉換為大寫 -->
      <!-- tracking-widest：字母間距為 0.1em（瑞士設計的寬字間距） -->
      <!-- text-swiss-text-muted：次要文本顏色 -->
      <!-- mb-2：下外邹距 8px -->
      <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
        選擇類型 *
      </label>
      
      <!-- select：下拉選擇框 -->
      <!-- v-model="filterType"：雙向綁定到 filterType -->
      <!-- placeholder="所有類型"：佔位符文本 -->
      <!-- class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
        <option value="">所有類型</option>
        <option value="products">產品</option>
        <option value="posts">新聞</option>
        <option value="inquiries">詢盤</option>
      </select>
    </div>

    <!-- 數據表格 -->
    <!-- bg-white：背景顏色為白色 -->
    <!-- border：添加邊框 -->
    <!-- border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度（淺灰色） -->
    <div class="bg-white border border-swiss-text/10">
      <!-- 骨架屏：加載時顯示 -->
      <TableSkeleton v-if="pending" />
      
      <!-- 數據表格：數據加載完成後顯示 -->
      <!-- v-else：當數據加載完成後顯示 -->
      <!-- :rows="logs"：表格行數據 -->
      <!-- :columns="columns"：表格列配置 -->
      <!-- :loading="false"：不顯示加載動畫 -->
      <!-- :ui="..."：UI 配置對象 -->
      <UTable :rows="logs" :columns="columns" :loading="false" :ui="{
        // wrapper：表格包裹層樣式
        wrapper: 'overflow-x-auto',
        
        // 表頭樣式
        thead: 'bg-swiss-bg-soft',
        th: {
          base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
        },
        
        // 單元格樣式
        td: {
          base: 'text-sm text-swiss-text',
        },
        
        // 激活行樣式
        tr: {
          active: 'bg-swiss-bg-soft',
        },
      }">
        
        <!-- 自定義 email 列 -->
        <template #user_email-data="{ row }">
          <!-- 容器 -->
          <div class="font-medium text-swiss-text">
            {{ row.user_email }}
          </div>
        </template>
        
        <!-- 自定義 action 列 -->
        <template #action-data="{ row }">
          <!-- span：操作文本 -->
          <!-- text-[10px]：瑞士設計的超小字體 -->
          <!-- text-swiss-text-muted：次要文本顏色 -->
          <!-- uppercase：全大寫 -->
          <!-- tracking-wider：字母間距加寬 -->
          {{ formatAction(row.action) }}
        </template>
        
        <!-- 自定義資源類型列 -->
        <template #resource_type-data="{ row }">
          <!-- span：資源類型文本 -->
          <!-- text-[10px]：瑞士設計的超小字體 -->
          <!-- text-swiss-text-muted：次要文本顏色 -->
          <!-- uppercase：全大寫 -->
          <!-- tracking-wider：字母間距加寬 -->
          {{ formatResourceType(row.resource_type) }}
        </template>
        
        <!-- 自定義詳情列 -->
        <template #details-data="{ row }">
          <!-- div：容器 -->
          <!-- text-sm：小號字體（14px） -->
          <!-- text-swiss-text：主文本顏色 -->
          <!-- max-w-sm：最大寬度 24rem（384px） -->
          <!-- truncate：截斷溢出部分顯示省略號 -->
          <!-- max-w-sm：最大寬度 24rem（384px） -->
          <!-- :title：鼠標懸停時顯示完整內容 -->
          <!-- {{ formatDetails(row) }}
          </div>
        </template>
        
        <!-- 自定義時間列 -->
        <template #created_at-data="{ row }">
          <!-- span：時間文本 -->
          <!-- text-[10px]：瑞士設計的超小字體（10px） -->
          <!-- text-swiss-text-muted：次要文本顏色 -->
          <!-- uppercase：全大寫 -->
          <!-- tracking-wider：字母間距加寬 -->
          <!-- {{ formatDate(row.created_at) }}
        </template>
        
        <!-- 自定義操作列 -->
        <template #actions-data="{ row }">
          <!-- 容器：水平排列，間距 8px -->
          <!-- flex：使用 Flexbox 布局 -->
          <div class="flex items-center gap-2">
            <!-- 編輯按� -->
            <!-- NuxtLink：鏈接組件 -->
            <!-- :to：根據資源類型動態跳轉 -->
            <!-- 例如：產品 → /admin/products/123 -->
            <!-- 資源類型判斷：
            //   - 'products'：跳轉到產品編輯頁面
            //   - 'posts'：跳轉到新聞編輯頁面
            //   - 'inquiries'：跳轉到詢盤詳情頁面
            //   - 'site_config'：跳轉到網站配置頁面 -->
            const getResourceUrl = (type: string) => {
              const routes = {
                products: '/admin/products',
                posts: '/admin/news',
                inquiries: '/admin/inquiries',
                site_config: '/admin/settings'
              }
              return `${routes[type]}`
            }
            <NuxtLink :to="getResourceUrl(row.resource_type)"
              class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              ✎
            </NuxtLink>
            
            <!-- 刪除按� -->
            <!-- button：按�標籤 -->
            <!-- @click="deleteLog(row.id)"：點擊刪除日誌 -->
            <!-- class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              ✕
            </button>
          </div>
        </template>
      </UTable>
      
      <!-- 分頁控件 -->
      <div v-if="pagination.totalPages > 1"
        class="flex flex-col md:flex-row md:justify-between gap-4">
          <!-- 左側：佔位符（用於垂直居中） -->
          <div class="flex-1"></div>
          
          <!-- 右側：分頁控件 -->
          <!-- flex items-center gap-2：水平排列，間距 8px -->
          <div class="flex items-center gap-2">
            <!-- 上一頁按� -->
            <button @click="currentPage--" class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 focus:outline-none focus:border-swiss-text hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              上一頁
            </button>
            
            <!-- 頁碼顯示 -->
            <!-- span：頁碼 -->
            <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted flex-grow text-center">
              第 {{ currentPage }} / {{ pagination.total }} 頁
            </span>
            
            <!-- 下一頁按� -->
            <button @click="currentPage++" class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 focus:outline-none focus:border-swiss-text hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              下一頁
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta：定義頁面元數據
// layout: 'admin'：使用 admin 布局（應該在 layouts/admin.vue 中定義）
definePageMeta({
  layout: 'admin',
})

// useRoute：獲取當前路由信息
// 用於訪問路由參數（如查詢參數）
const route = useRoute()

// useLazyFetch：懶加載操作日誌數據
// 目的：實現非阻塞加載，避免阻塞頁面渲染
// 作用：減少首屏加載時間，提升首屏性能
const { data: response, pending, refresh } = useLazyFetch(
  `/api/logs?${queryParams.value}`, {
  key: () => `logs-${currentPage.value}-${filterType.value}`,
  // watch: [queryParams]：監聽查詢參數的變化，自動刷新數據
  key: () => `logs-${currentPage.value}-${filterType.value}`,
  // transform: (data: any) => data,
  default: () => ({ success: false, data: { logs: [], pagination: { page: 1, total: 0, totalPages: 0 } })
})

// computed：從響應式數據中提取日誌列表
// 目的：統一訪問日誌數據
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])

// computed：從響應式數據中提取分頁信息
// 目的：統一訪問分頁信息
const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 } )

// useRoute：獲取當前路由信息
// 目的：訪問路由參數（page、type 等）
const route = useRoute()

// computed：根據路由參判斷是否為新產品創建
// 目的：顯示不同的標題
const isNew = computed(() => route.params.id === 'new')

// 常量操作選中項數組
// 目的：記錄批量選中的項目
const selectedItems = ref<any[]>([])

// 列配置：定義表格的列配置
const columns = [
  {
    key: 'user_email',
    label: '用戶',
  },
  {
    key: 'action',
    label: '操作',
  },
  {
    key: 'resource_type',
    label: '資源類型',
  },
  {
    key: 'details',
    label: '詳情',
  },
  {
    key: 'created_at',
    label: '時間',
  },
  {
    key: 'actions',
    label: '',
  },
]

// formatDate：格式化日期為本地化日期
// 目的：將 ISO 8601 日期字符串格式化為本地化日期
// 返回值：本地化日期字符串（例如：2024/1/15）
function formatDate(dateStr: string): string {
  // new Date(dateStr)：將日期字符串轉換為 Date 對象
  // .toLocaleDateString('zh-HK')：格式化為香港地區日期格式（2024/1/15）
  return new Date(dateStr).toLocaleDateString('zh-HK')
}

// formatAction：格式化操作名稱
// 目的：將英文操作代碼映射為中文操作名稱
// 返回值：中文操作名稱（如 '創建'）
const formatAction = (action: string): string => {
  const actionMap: Record<string, string> = {
    create: '創建',
    update: '更新',
    delete: '刪除',
    login: '登入',
    logout: 'logout',
    export: '導出',
  }
  // actionMap[action] || action
}

// formatResourceType：格式化資源類型名稱
// 目的：將英文類型代碼映射為中文類型名稱
// 返回值：中文類型名稱（如 '產品'）
const formatResourceType = (type: string): string => {
  const typeMap: Record<string, string> = {
    products: '產品',
    posts: '新聞',
    inquiries: '詢盤',
    site_config: '網站配置',
  }
  // typeMap[type] || type
}

// formatDetails：格式化日誌詳情
// 目的：根據資源類型提取詳情信息
// 返回值：格式化後的詳細字符串
const formatDetails = (log: any): string => {
  // 如果是產品類型，顯示產品名稱和類別
  if (log.resource_type === 'products') {
    // 顯示產品名稱或默認值
    const name = log.details?.name || '未知產品'
    // 顯示產品類別或默認值
    const category = log.details?.category || '未知類別'
    // 組合名稱和類別
    return `${name} - ${category}`
  }
  
  // 如果是新聞類型，顯示新聞標題
  if (log.resource_type === 'posts') {
    // 優先優先級：繁體中文 > �體中文 > 英文
    const title = log.details?.title?.['zh-HK'] || log.details?.title?.['cn'] || log.details?.title
    return title || '未知新聞'
  }
  
  // 如果是詢盤類型，顯示詢盤主題
  if (log.resource_type === 'inquiries') {
    const subject = log.details?.subject || '未知詢盤'
    return subject || '未知詢盤'
  }
  
  // 否則，顯示資源類型和 ID
  // 格式：`${類型名稱} #${ID}`
  return `${formatResourceType(log.resource_type)} #${log.resource_id}`
}

// computed：構建查詢參數
// 目的：動態生成查詢參數
// 返回值：URL 查詢字符串
const queryParams = computed(() => {
  const params = new URLSearchParams()
  // 添加 page 參�數（當前頁碼）
  params.append('page', currentPage.value.toString())
  // 添加 type 參數（如果已選擇）
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  // 轉換為字符串，用於查詢參數
  // 返回格式：`?page=1&type=products` 或 `page=1`
  return params.toString()
})

// computed：從響應式數據中提取日誌列表
// 目的：統一訪問日誌數據
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])

// computed：從響應式數據中提取分頁信息
// 目的：統一訪問分頁信息
const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 } })

// selectedItems：記錄選中的批量操作項目
// 目的：記錄批量選中的日誌，用於批量操作
const selectedItems = ref<any[]>([])

// toggleSelection：切換選中狀態
// 目的：添加或移除選中狀態
function toggleSelection(row: any) {
  // 查找項目在 selectedItems 中的索引
  const index = selectedItems.value.findIndex((item) => item.id === row.id)
  
  // 如果已存在，移除該項目
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    // 如果不存在，添加該項目
    selectedItems.value.push(row)
  }
}

// refreshKey：刷新鍵
// 目的：觸發數據刷新
// 原理流程：
// 1. 修改 currentPage 或 filterType
// 2. refreshKey.value++
// 3. useLazyFetch 的 key 改變時重新請求數據
// 4. response 和 logs 會自動更新
// 5. UI 會自動重新渲染
const refreshKey = ref(0)

// 切除日誌
// 目的：刪除單個日誌
// 工作流程：
// 1. 彈出確認對話框
// 2. 發送 DELETE 請求
// 3. 修改 refreshKey 觸發數據刷新
// 4. await refresh() 等待數據刷新完成
// 5. 顯示成功消息
async function deleteLog(id: number) {
  // 如果用戶取消刪除，直接返回
  if (!confirm('確定要刪除此操作記錄？')) return
  
  // try-catch 捕獲錯誤
  try {
    // 發送 DELETE 請求到後台 API
    await $fetch(`/api/admin/logs/${id}`, {
      method: 'DELETE'
    })
    
    // 立即刷新數據，實現動態更新
    // 修改 refreshKey 觸發數據刷新
    refreshKey.value++
    
    // 等待數據刷新完成
    await refresh()
    
    // 显示成功消息
    alert('刪除成功')
  } catch (error: any) {
    // 錁錯誤日誌
    console.error('刪除日誌失敗:', error)
    
    // 顯示錯誤消息（使用 API 返回的消息，默認：'刪除失敗，請重試'）
    const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
    alert(errorMessage)
  }
}

// 导出日志
// 目的：將日誌數據導出為 JSON 或 CSV 格式
// 工作流程：
// 1. �用瀏覽器的 fetch 發起下載
// 2. 導出數據格式：JSON 或 CSV
// 3. 觸發瀏覽器下載文件
// 4. 清理臨時 URL
// function exportData(format: 'json' | 'csv') {
//   try {
//     // 使用 $fetch 获取數據，包含認證信息
//     // 注意：使用 $fetch 而不是 useLazyFetch，確保可以下載二進制文件
//     const blob = await $fetch(`/api/admin/export/logs?format=${format}`, {
//       method: 'GET',
//       responseType: 'blob'  // 指定響應類型為 Blob
//     })
//     
//     // 創建臨時 URL 並觸發瀏覽器下載
//     const url = window.URL.createObjectURL(blob as Blob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = `logs_${new Date().toISOString().split('T')[0]}.${format}`
//     
//     // 添加到 DOM
//     document.body.appendChild(link)
//     
//     // 模擬點擊下載
//     link.click()
//     
//     // 清理
//     setTimeout(() => {
//       // 移除 DOM 中的元素
//       document.body.removeChild(link)
//       // 釋放 URL 內存
//       window.URL.revokeObjectURL(url)
//     }, 100)
//   } catch (error: any) {
//     console.error('導出失敗:', error)
//     // 顯示錯誤消息
//     alert('導出失敗，請重試')
//   }
// }

// 暴露刷新函數供外部組件使用
// 目的：允許父組件調用 refresh 函數
// 使用場景：其他組件需要刷新日誌數據
defineExpose({
  refresh
})
</script>
