&lt;!--
# 新聞管理頁面 (News Management Page)

## 文件作用
這是新聞管理後台的列表頁面。它提供了一個完整的界面，允許管理员：
- 查看所有新聞文章的列表
- 創建新新聞
- 編輯現有新聞
- 刪除新聞
- 批量操作（已註釋掉）
- 導出數據（已註釋掉）

## 實現手段

### 1. 頁面布局結構
使用兩列響應式布局：
- **移動端**：垂直堆疊（標題區域和按鈕區域上下排列）
- **桌面端**：水平排列（標題區域在左，按鈕區域在右）

vue
&lt;!-- 頂部區域：標題 + 按鈕 --&gt;
&lt;div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6"&gt;
  &lt;!-- 左側：標題和描述 --&gt;
  &lt;div&gt;
    &lt;TypographyHeader :level="2" size="h2"&gt;資訊管理 News&lt;/TypographyHeader&gt;
    &lt;p&gt;發佈行業動態及公司新聞。&lt;/p&gt;
  &lt;/div&gt;
  
  &lt;!-- 右側：發佈諮訊按鈕 --&gt;
  &lt;SwissButton tag="a" to="/admin/news/new"&gt;發佈諮訊&lt;/SwissButton&gt;
&lt;/div&gt;


### 2. 動態數據加載
使用 `useLazyFetch` 實現動態數據加載和自動刷新：

typescript
const { data: response, pending, refresh, error } = useLazyFetch('/api/news', {
  key: () =&gt; `news-${refreshKey.value}`,  // 使用 refreshKey 作為緩存鍵
  transform: (data: any) =&gt; data,         // 數據轉換
  default: () =&gt; ({ success: false, data: [] })  // 默認值
})

const posts = computed(() =&gt; response.value?.success ? response.value.data : [])


**為什麼使用 `useLazyFetch` 而不是 `useFetch`？**

- **`useLazyFetch`**：異步加載，頁面立即渲染（先顯示骨架屏，再加載數據）
- **`useFetch`**：同步加載，頁面等待數據加載完成後才渲染（阻塞頁面渲染）

在這裡使用 `useLazyFetch` 的好處：
- 提升首屏渲染性能
- 減少用戶感知的加載時間
- 支持懶加載和預取

### 3. 自動刷新機制
通過修改 `refreshKey` 觸發數據刷新：

typescript
const refreshKey = ref(0)

// 當需要刷新數據時
refreshKey.value++  // 修改 refreshKey
await refresh()    // 重新調用 API


**為什麼這樣設計？**

- `useLazyFetch` 的 `key` 屬性依賴於 `refreshKey`
- 當 `refreshKey` 改變時，`useLazyFetch` 會自動重新請求數據
- 比直接調用 `refresh()` 更可靠（因為 `key` 變化會強制重新獲取）

**使用場景**：
- 刪除文章後刷新列表
- 批量操作後刷新列表
- 導出數據後刷新列表

### 4. 骨架屏優化
在加載時顯示骨架屏：

vue
&lt;div class="bg-white border border-swiss-text/10"&gt;
  &lt;TableSkeleton v-if="pending" /&gt;
  &lt;UTable v-else :rows="posts" :columns="columns" /&gt;
&lt;/div&gt;


好處：
- 減少感知加載時間
- 提供更好的用戶體驗
- 避免頁面閃爍

### 5. 表格自定義列
使用 `&lt;template #column-data="{ row }"&gt;` 語法自定義列的渲染：

vue
&lt;UTable :rows="posts" :columns="columns"&gt;
  &lt;!-- 自定義標題列 --&gt;
  &lt;template #title-data="{ row }"&gt;
    &lt;div&gt;{{ row.title?.['zh-HK'] || row.title?.['hk'] }}&lt;/div&gt;
  &lt;/template&gt;
  
  &lt;!-- 自定義發佈時間列 --&gt;
  &lt;template #published_at-data="{ row }"&gt;
    &lt;span&gt;{{ row.published_at ? formatDate(row.published_at) : '未發佈' }}&lt;/span&gt;
  &lt;/template&gt;
  
  &lt;!-- 自定義操作列 --&gt;
  &lt;template #actions-data="{ row }"&gt;
    &lt;NuxtLink :to="`/admin/news/${row.id}`"&gt;編輯&lt;/NuxtLink&gt;
    &lt;button @click="deletePost(row.id)"&gt;刪除&lt;/button&gt;
  &lt;/template&gt;
&lt;/UTable&gt;


**為什麼使用插槽？**

- 允許自定義單元格的渲染邏輯
- 可以添加複雜的 UI 組件（如按鈕、鏈接）
- 可以訪問行數據（`row`）進行條件渲染

### 6. 多語言支持
新聞標題支持多語言（繁體中文、簡體中文、英文）：

typescript
// 數據結構
{
  title: {
    'zh-HK': '超核技術發布新產品',
    'zh-CN': '超核技术发布新产品',
    'en': 'Nucleon Tech Launches New Product'
  }
}

// 在 UI 中顯示
{{ row.title?.['zh-HK'] || row.title?.['hk'] }}


**為什麼這樣處理？**

- `?.`：可選鏈操作符，如果 `row.title` 不存在則返回 `undefined`
- `||`：空值合併運算符，如果第一個值為假值則使用第二個值
- 優先顯示 `zh-HK`，如果不存在則顯示 `hk`（向後兼容）

### 7. 批量操作（已註釋掉）
代碼中包含批量操作和導出的邏輯，但被註釋掉了：

typescript
// 批量刪除
async function bulkDelete() {
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 篇文章嗎？`)) return
  
  const ids = selectedItems.value.map((item) =&gt; item.id)
  await $fetch('/api/news/admin/bulk', {
    method: 'POST',
    body: { ids, action: 'delete' },
  })
  
  selectedItems.value = []
  refreshKey.value++
  await refresh()
}


**為什麼註釋掉？**

- 可能是開發階段的決定
- 可能是功能尚未完全實現
- 可能是 API 端點尚未創建

### 8. 數據導出（已註釋掉）
支持導出為 JSON 和 CSV 格式：

typescript
async function exportData(format: 'json' | 'csv') {
  const blob = await $fetch(`/api/news/admin/export?format=${format}`, {
    method: 'GET',
    responseType: 'blob'  // 關鍵：指定響應類型為 blob
  })
  
  // 創建下載鏈接
  const url = window.URL.createObjectURL(blob as Blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `news_${new Date().toISOString().split('T')[0]}.${format}`
  document.body.appendChild(link)
  link.click()
  
  // 清理
  setTimeout(() =&gt; {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 100)
}


**技術細節**：
- `responseType: 'blob'`：指定響應類型為 Blob（二進制大對象）
- `window.URL.createObjectURL()`：創建臨時 URL
- `link.download`：指定下載文件名
- `window.URL.revokeObjectURL()`：釋放內存（重要！）

### 9. 響應式表格樣式
使用 `ui` 屬性自定義 UTable 的樣式：

typescript
&lt;UTable :rows="posts" :columns="columns" :ui="{
  wrapper: 'overflow-x-auto',  // 表格容器：水平滾動
  thead: 'bg-swiss-bg-soft',   // 表頭背景顏色
  th: {
    base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
  },
  td: {
    base: 'text-sm text-swiss-text',
  },
  tr: {
    active: 'bg-swiss-bg-soft',  // 懸停行背景顏色
  },
}"&gt;


**為什麼使用瑞士設計樣式？**

- `text-[10px]`：瑞士設計的超小字體
- `uppercase`：瑞士設計的大寫標題
- `tracking-widest`：瑞士設計的寬字間距
- `bg-swiss-bg-soft`：瑞士設計的軟背景顏色

### 10. 錯誤處理
在 `watchEffect` 中監聽錯誤：

typescript
watchEffect(() =&gt; {
  if (error.value) {
    console.error('獲取文章列表失敗:', error.value)
  }
})


**為什麼使用 `watchEffect` 而不是 `watch`？**

- **`watchEffect`**：自動追蹤依賴，當依賴改變時自動執行
- **`watch`**：需要手動指定依賴

在這裡使用 `watchEffect` 的好處：
- 自動追蹤 `error.value`
- 不需要手動指定 `() =&gt; error.value`
- 代碼更簡潔

## 核心功能

### 功能 1：查看新聞列表
- 使用 `useLazyFetch` 動態加載新聞數據
- 顯示新聞標題、發佈時間、操作按鈕
- 使用骨架屏優化加載體驗

### 功能 2：創建新聞
- 點擊"發佈諮訊"按鈕導航到 `/admin/news/new`
- 路由：`&lt;NuxtLink&gt;` 或 `SwissButton` 的 `to` 屬性

### 功能 3：編輯新聞
- 點擊編輯按鈕（✎）導航到 `/admin/news/{id}`
- 使用 `NuxtLink` 進行客戶端導航（無頁面刷新）

### 功能 4：刪除新聞
- 點擊刪除按鈕（✕）觸發確認對話框
- 調用 `DELETE /api/news/{id}` API
- 刪除成功後刷新列表

### 功能 5：批量操作（已註釋掉）
- 支持批量選擇新聞
- 支持批量刪除
- 使用下拉菜單選擇操作

### 功能 6：數據導出（已註釋掉）
- 支持導出為 JSON 格式
- 支持導出為 CSV 格式
- 使用 Blob 下載文件

## 使用場景

### 場景 1：查看新聞列表
1. 管理員訪問 `/admin/news`
2. 頁面加載骨架屏
3. `useLazyFetch` 異步加載數據
4. 表格顯示新聞列表
5. 管理員瀏覽新聞

### 場景 2：創建新新聞
1. 管理員點擊"發佈諮訊"按鈕
2. 導航到 `/admin/news/new`
3. 填寫新聞信息
4. 點擊保存

### 場景 3：編輯新聞
1. 管理員在新聞列表點擊某篇文章的"編輯"按鈕
2. 導航到 `/admin/news/{id}`
3. 修改新聞信息
4. 點擊保存

### 場景 4：刪除新聞
1. 管理員在新聞列表點擊某篇文章的"刪除"按鈕
2. 彈出確認對話框："確定刪除此文章？"
3. 管理員點擊"確定"
4. 調用 `DELETE /api/news/{id}` API
5. `refreshKey.value++` 觸發數據刷新
6. 表格自動更新，該文章消失

### 場景 5：批量刪除（已註釋掉）
1. 管理員勾選多篇文章
2. 點擊"批量操作"下拉菜單
3. 選擇"批量刪除"
4. 確認對話框："確定要刪除選中的 X 篇文章嗎？"
5. 調用 `POST /api/news/admin/bulk` API
6. 刷新列表

## 性能優化

### 優化 1：懶加載數據
使用 `useLazyFetch` 而不是 `useFetch`：

typescript
const { data: response, pending, refresh } = useLazyFetch('/api/news', {
  key: () =&gt; `news-${refreshKey.value}`,
})


好處：
- 頁面立即渲染（先顯示骨架屏）
- 不阻塞首屏渲染
- 提升首屏性能

### 優化 2：計算屬性緩存
使用 `computed` 計算文章列表：

typescript
const posts = computed(() =&gt; response.value?.success ? response.value.data : [])


好處：
- 當 `response.value` 改變時自動重新計算
- 只在依賴改變時才重新計算（性能優化）
- 避免在模板中直接訪問 `response.value?.data`

### 優化 3：骨架屏優化
使用 `TableSkeleton` 組件：

vue
&lt;TableSkeleton v-if="pending" /&gt;
&lt;UTable v-else :rows="posts" /&gt;


好處：
- 減少感知加載時間
- 提供視覺佔位符
- 避免頁面閃爍

### 優化 4：條件渲染
使用 `v-if` 和 `v-else` 切換骨架屏和表格：

vue
&lt;div v-if="pending"&gt;
  &lt;TableSkeleton /&gt;
&lt;/div&gt;
&lt;div v-else&gt;
  &lt;UTable :rows="posts" /&gt;
&lt;/div&gt;


好處：
- `v-if` 完全移除/添加 DOM 元素（初始渲染性能好）
- 不在內存中同時保持兩個組件實例

### 優化 5：自動刷新機制
通過 `refreshKey` 觸發數據刷新：

typescript
const refreshKey = ref(0)

// 刷新數據
refreshKey.value++
await refresh()


好處：
- 利用 `useLazyFetch` 的緩存機制
- 比直接調用 API 更可靠
- 避免重複請求

## 可訪問性 (Accessibility)

### 可訪問性 1：語義化 HTML
使用語義化標籤：
- `&lt;div&gt;`：通用容器
- `&lt;button&gt;`：交互元素
- `&lt;NuxtLink&gt;`：鏈接元素
- `&lt;span&gt;`：行內文本

改進建議：
- 應該使用 `&lt;table&gt;` 元素而不是 `&lt;UTable&gt;` 組件
- 應該使用 `&lt;th&gt;` 和 `&lt;td&gt;` 元素

### 可訪問性 2：鍵盤導航
所有交互元素都支持鍵盤操作：
- `&lt;NuxtLink&gt;`：Tab 鍵聚焦，Enter 鍵導航
- `&lt;button&gt;`：Tab 鍵聚焦，Enter/Space 鍵觸發

### 可訪問性 3：錯誤處理
使用 `alert()` 顯示錯誤消息：

typescript
catch (error: any) {
  const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
  alert(errorMessage)
}


改進建議：
- 應該使用非阻塞的通知組件而不是 `alert()`
- 應該在界面上顯示錯誤消息，而不是彈窗

### 可訪問性 4：確認對話框
使用 `confirm()` 顯示確認對話框：

typescript
if (!confirm('確定刪除此文章？')) return


改進建議：
- 應該使用自定義的確認模態框
- 提供更友好的用戶體驗

## 依賴組件

### 組件 1：TypographyHeader
文件路徑：`~/components/swiss/TypographyHeader.vue`
作用：瑞士設計風格的標題組件

使用場景：
- 頁面標題："資訊管理 News"

### 組件 2：SwissButton
文件路徑：`~/components/swiss/SwissButton.vue`
作用：瑞士設計風格的按鈕組件

使用場景：
- "發佈諮訊"按鈕
- 屬性：`tag="a"`, `to="/admin/news/new"`, `variant="primary"`, `size="lg"`

### 組件 3：UTable
文件路徑：`@nuxt/ui`（Nuxt UI 庫）
作用：表格組件

使用場景：
- 顯示新聞列表
- 屬性：`:rows`, `:columns`, `:ui`

### 組件 4：TableSkeleton
文件路徑：`~/components/admin/TableSkeleton.vue`（需要實現）
作用：表格骨架屏組件

使用場景：
- 加載時顯示骨架屏

## 依賴 API

### API 1：獲取新聞列表
端點：`GET /api/news`
用途：獲取所有新聞文章

請求示例：
typescript
const { data: response, pending } = useLazyFetch('/api/news')


預期響應：
json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": {
        "zh-HK": "超核技術發布新產品",
        "zh-CN": "超核技术发布新产品",
        "en": "Nucleon Tech Launches New Product"
      },
      "slug": "nucleon-tech-launches-new-product",
      "content": {
        "zh-HK": "...",
        "zh-CN": "...",
        "en": "..."
      },
      "published_at": "2024-01-15T10:00:00Z",
      "status": "published"
    }
  ]
}


### API 2：刪除新聞
端點：`DELETE /api/news/{id}`
用途：刪除單篇新聞

請求示例：
typescript
await $fetch(`/api/news/${id}`, {
  method: 'DELETE'
})


預期響應：
json
{
  "success": true,
  "message": "文章刪除成功"
}


### API 3：批量刪除（已註釋掉）
端點：`POST /api/news/admin/bulk`
用途：批量刪除多篇新聞

請求示例：
typescript
await $fetch('/api/news/admin/bulk', {
  method: 'POST',
  body: {
    ids: [1, 2, 3],
    action: 'delete'
  }
})


預期響應：
json
{
  "success": true,
  "message": "批量刪除成功"
}


### API 4：導出數據（已註釋掉）
端點：`GET /api/news/admin/export?format={format}`
用途：導出新聞數據

請求示例：
typescript
const blob = await $fetch(`/api/news/admin/export?format=json`, {
  method: 'GET',
  responseType: 'blob'
})


預期響應：
- Blob 對象（二進制大對象）

## 數據流

### 數據流 1：頁面加載

用戶訪問 /admin/news
  ↓
組件掛載
  ↓
useLazyFetch 異步加載數據
  ↓
pending = true（顯示骨架屏）
  ↓
API 返回數據
  ↓
pending = false（顯示表格）
  ↓
computed 計算 posts 列表
  ↓
表格渲染 posts


### 數據流 2：刪除文章

用戶點擊刪除按鈕
  ↓
確認對話框
  ↓
用戶確認
  ↓
調用 DELETE /api/news/{id}
  ↓
API 刪除文章
  ↓
返回成功響應
  ↓
refreshKey.value++（修改緩存鍵）
  ↓
useLazyFetch 自動重新請求
  ↓
表格自動更新


### 數據流 3：導出數據（已註釋掉）

用戶選擇導出格式
  ↓
調用 GET /api/news/admin/export?format=json
  ↓
API 返回 Blob 對象
  ↓
創建臨時 URL
  ↓
創建下載鏈接
  ↓
觸發下載
  ↓
清理臨時 URL


## Tailwind CSS 類名說明

### 布局類
- `space-y-12`：垂直方向元素間距 3rem (48px)
- `flex`：使用 Flexbox 布局
- `flex-col`：垂直方向排列
- `md:flex-row`：桌面端水平方向排列
- `md:justify-between`：桌面端兩端對齊
- `md:items-end`：桌面端底部對齊
- `gap-6`：元素間距 1.5rem (24px)
- `flex-1`：彈性元素佔據所有可用空間

### 間距類
- `mb-4`：下外邹距 1rem (16px)
- `gap-3`：元素間距 0.75rem (12px)
- `gap-4`：元素間距 1rem (16px)
- `gap-2`：元素間距 0.5rem (8px)
- `px-3`：左右內邹距 0.75rem (12px)
- `py-2`：上下內邹距 0.5rem (8px)

### 邊框和背景類
- `bg-white`：背景顏色為白色
- `bg-swiss-bg-soft`：背景顏色為瑞士軟背景顏色
- `border`：添加邊框
- `border-swiss-text/10`：邊框顏色為瑞士文本顏色的 10% 不透明度
- `border-swiss-text/20`：邊框顏色為瑞士文本顏色的 20% 不透明度

### 文字類
- `text-[10px]`：字體大小 10px（瑞士設計的超小字體）
- `text-sm`：字體大小 0.875rem (14px)
- `font-medium`：字體粗細為 500
- `font-bold`：字體粗細為 700
- `uppercase`：轉換為大寫
- `tracking-widest`：字間距為 0.1em（瑞士設計的寬字間距）
- `tracking-wider`：字間距為 0.05em
- `text-swiss-text`：文字顏色為瑞士文本顏色
- `text-swiss-text-muted`：文字顏色為瑞士文本顏色（變暗）
- `text-red-500`：文字顏色為紅色（錯誤/刪除操作）
- `text-red-600`：文字顏色為紅色（懸停狀態）

### 交互類
- `hover:text-swiss-text-muted`：懸停時文字顏色變暗
- `hover:text-red-600`：懸停時文字顏色變為紅色
- `hover:-translate-y-0.5`：懸停時向上移動 2px（瑞士設計微交互）
- `active:scale-[0.98]`：激活時縮放到 98%
- `transition-all`：所有屬性過渡動畫
- `overflow-x-auto`：水平方向滾動（當內容溢出時）

### 其他類
- `rounded-none`：無圓角（瑞士設計的銳利邊緣）
- `w-full`：寬度 100%
- `md:w-auto`：桌面端寬度自適應

## Vue 3 特性說明

### ref
用於創建響應式引用：

typescript
const search = ref('')
const refreshKey = ref(0)
const selectedItems = ref&lt;any[]&gt;([])


好處：
- 在模板中可以直接訪問 `search.value`
- 在 JS 中通過 `search.value` 訪問值
- 當值改變時自動觸發視圖更新

### computed
用於創建計算屬性：

typescript
const posts = computed(() =&gt; response.value?.success ? response.value.data : [])


好處：
- 基於 `response.value` 自動計算
- 當 `response.value` 改變時自動重新計算
- 只在依賴改變時才重新計算（性能優化）

### watchEffect
用於自動追蹤依賴的副作用：

typescript
watchEffect(() =&gt; {
  if (error.value) {
    console.error('獲取文章列表失敗:', error.value)
  }
})


好處：
- 自動追蹤 `error.value`
- 不需要手動指定依賴
- 當依賴改變時自動執行

### useLazyFetch
用於異步加載數據：

typescript
const { data: response, pending, refresh, error } = useLazyFetch('/api/news', {
  key: () =&gt; `news-${refreshKey.value}`,
  transform: (data: any) =&gt; data,
  default: () =&gt; ({ success: false, data: [] })
})


好處：
- 頁面立即渲染（不阻塞）
- 支持懶加載和預取
- 支持自動刷新（通過修改 `key`）

### v-if 和 v-else
用於條件渲染：

vue
&lt;TableSkeleton v-if="pending" /&gt;
&lt;UTable v-else :rows="posts" :columns="columns" /&gt;


好處：
- 根據條件切換顯示內容
- `v-if` 完全移除/添加 DOM 元素

### v-for
用於循環渲染：

vue
&lt;UTable :rows="posts" :columns="columns"&gt;
  &lt;template #title-data="{ row }"&gt;
    &lt;div&gt;{{ row.title?.['zh-HK'] }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/UTable&gt;


好處：
- 為每行動態生成內容
- 插槽可以訪問行數據（`row`）

### 插槽 (Slots)
使用具名插槽自定義列的渲染：

vue
&lt;UTable :rows="posts" :columns="columns"&gt;
  &lt;template #title-data="{ row }"&gt;
    &lt;div&gt;{{ row.title?.['zh-HK'] }}&lt;/div&gt;
  &lt;/template&gt;
&lt;/UTable&gt;


好處：
- 允許自定義單元格的渲染邏輯
- 可以添加複雜的 UI 組件
- 可以訪問行數據

### defineExpose
暴露函數給父組件：

typescript
defineExpose({
  refresh
})


好處：
- 父組件可以調用 `refresh()` 函數
- 支持組件間通信

## TypeScript 類型說明

### 類型 1：any[]
用於選中的項目數組：

typescript
selectedItems: ref&lt;any[]&gt;([])


示例值：
typescript
[
  { id: 1, title: {...}, ... },
  { id: 2, title: {...}, ... }
]


### 類型 2：'json' | 'csv'
用於導出格式：

typescript
async function exportData(format: 'json' | 'csv')


可選值：
- `'json'`：JSON 格式
- `'csv'`：CSV 格式

### 類型 3：Blob
用於二進制大對象（文件下載）：

typescript
const blob = await $fetch('/api/news/admin/export?format=json', {
  method: 'GET',
  responseType: 'blob'
})


作用：
- 表示二進制數據（如文件、圖片）
- 可以創建下載鏈接

### 類型 4：error: any
用於錯誤對象：

typescript
catch (error: any) {
  console.error('刪除失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
  alert(errorMessage)
}


作用：
- 捕獲任何類型的錯誤
- 訪問錯誤消息

## 錯誤處理

### 錯誤 1：數據加載失敗
typescript
watchEffect(() =&gt; {
  if (error.value) {
    console.error('獲取文章列表失敗:', error.value)
  }
})


處理方式：
- 記錄錯誤到控制台
- 不顯示錯誤消息給用戶（靜默失敗）

改進建議：
- 應該在界面上顯示錯誤消息
- 應該提供重試按鈕

### 錯誤 2：刪除失敗
typescript
catch (error: any) {
  console.error('刪除失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
  alert(errorMessage)
}


處理方式：
- 記錄錯誤到控制台
- 顯示錯誤消息給用戶
- 不導航離開，允許用戶重試

### 錯誤 3：批量刪除失敗
typescript
catch (error: any) {
  console.error('批量刪除失敗:', error)
  alert(error.data?.message || '批量刪除失敗')
}


處理方式：
- 記錄錯誤到控制台
- 顯示錯誤消息給用戶

### 錯誤 4：導出失敗
typescript
catch (error: any) {
  console.error('導出失敗:', error)
  alert('導出失敗，請重試')
}


處理方式：
- 記錄錯誤到控制台
- 顯示錯誤消息給用戶

## 安全考慮

### 安全 1：身份驗證
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證用戶是否已登錄
- API 應該驗證用戶是否有權限訪問管理後台
- 使用 JWT 或 Session 進行身份驗證

### 安全 2：CSRF 防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證 CSRF token
- 在表單中添加 CSRF token
- 在 API 端點驗證 token

### 安全 3：XSS 防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該對輸入內容進行 HTML 轉義
- 不應該直接顯示用戶輸入的 HTML
- 在顯示時使用 `v-html` 應該謹慎

### 安全 4：文件下載安全
在導出數據時使用 `responseType: 'blob'`：

typescript
const blob = await $fetch('/api/news/admin/export?format=json', {
  method: 'GET',
  responseType: 'blob'
})


好處：
- 避免瀏覽器嘗試解析文件內容
- 確保文件正確下載

## 待改進項目

### 改進 1：恢復批量操作功能
當前問題：批量操作代碼被註釋掉了

建議實現：
- 取消註釋批量操作相關代碼
- 實現 API 端點 `POST /api/news/admin/bulk`
- 添加批量操作的 UI 組件

### 改進 2：恢復導出功能
當前問題：導出功能代碼被註釋掉了

建議實現：
- 取消註釋導出相關代碼
- 實現 API 端點 `GET /api/news/admin/export`
- 添加導出按鈕到頁面

### 改進 3：錯誤處理改進
當前問題：使用 `alert()` 顯示錯誤消息

建議實現：
- 使用非阻塞的通知組件（如 Toast）
- 在界面上顯示錯誤消息
- 提供重試按鈕

### 改進 4：確認對話框改進
當前問題：使用 `confirm()` 顯示確認對話框

建議實現：
- 使用自定義的確認模態框
- 提供更友好的用戶體驗
- 支持自定義按鈕文本

### 改進 5：搜索功能
當前問題：沒有搜索功能

建議實現：
typescript
// 添加搜索輸入框
&lt;input v-model="search" placeholder="搜索文章..." /&gt;

// 根據搜索關鍵詞過濾
const filteredPosts = computed(() =&gt; {
  if (!search.value) return posts.value
  
  return posts.value.filter(post =&gt; {
    const title = post.title?.['zh-HK'] || post.title?.['hk'] || ''
    return title.toLowerCase().includes(search.value.toLowerCase())
  })
})


### 改進 6：分頁功能
當前問題：沒有分頁功能

建議實現：
typescript
// 添加分頁狀態
const page = ref(1)
const pageSize = ref(10)

// 根據頁碼和頁面大小過濾
const paginatedPosts = computed(() =&gt; {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return posts.value.slice(start, end)
})


### 改進 7：排序功能
當前問題：沒有排序功能

建議實現：
typescript
// 添加排序狀態
const sortBy = ref('published_at')
const sortOrder = ref&lt;'asc' | 'desc'&gt;('desc')

// 根據排序字段和順序排序
const sortedPosts = computed(() =&gt; {
  return [...posts.value].sort((a, b) =&gt; {
    const valueA = a[sortBy.value]
    const valueB = b[sortBy.value]
    
    if (sortOrder.value === 'asc') {
      return valueA &gt; valueB ? 1 : -1
    } else {
      return valueA &lt; valueB ? 1 : -1
    }
  })
})


## 測試建議

### 測試 1：頁面加載
typescript
test('should load news list', async () =&gt; {
  const { data, pending } = useLazyFetch('/api/news')
  
  expect(pending.value).toBe(true)
  
  await waitFor(() =&gt; {
    expect(data.value?.success).toBe(true)
    expect(data.value?.data).toBeInstanceOf(Array)
  })
})


### 測試 2：刪除文章
typescript
test('should delete post', async () =&gt; {
  const id = 1
  
  await $fetch(`/api/news/${id}`, {
    method: 'DELETE'
  })
  
  // 等待數據刷新
  await waitFor(() =&gt; {
    expect(posts.value.find(p =&gt; p.id === id)).toBeUndefined()
  })
})


### 測試 3：導出數據
typescript
test('should export data as JSON', async () =&gt; {
  const blob = await $fetch('/api/news/admin/export?format=json', {
    method: 'GET',
    responseType: 'blob'
  })
  
  expect(blob).toBeInstanceOf(Blob)
  expect(blob.type).toContain('application/json')
})


## 總結

這個新聞管理頁面實現了：
- ✅ 查看新聞列表
- ✅ 創建新聞（通過導航）
- ✅ 編輯新聞
- ✅ 刪除新聞
- ✅ 懶加載數據優化
- ✅ 骨架屏優化
- ✅ 自動刷新機制
- ✅ 多語言支持
- ⏳ 批量操作（已註釋掉）
- ⏳ 數據導出（已註釋掉）

待改進：
- ⏳ 恢復批量操作功能
- ⏳ 恢復導出功能
- ⏳ 錯誤處理改進
- ⏳ 確認對話框改進
- ⏳ 搜索功能
- ⏳ 分頁功能
- ⏳ 排序功能

這是一個功能完整、性能優化的新聞管理頁面，遵循了瑞士設計原則和 Vue 3 最佳實踐。
--&gt;
<template>
  <!-- 外層容器：垂直排列元素，間距為 48px -->
  <div class="space-y-12">
    
    <!-- 頂部區域：標題 + 按鈕 -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- flex-col：移動端垂直方向排列 -->
    <!-- md:flex-row：桌面端水平方向排列 -->
    <!-- md:justify-between：桌面端兩端對齊（標題在左，按鈕在右） -->
    <!-- md:items-end：桌面端底部對齊 -->
    <!-- gap-6：元素間距 24px -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
      <!-- 左側：標題和描述 -->
      <div>
        <!-- TypographyHeader：瑞士設計風格的標題組件 -->
        <!-- :level="2"：H2 級別的語義標題 -->
        <!-- size="h2"：H2 的視覺樣式 -->
        <!-- class="mb-4"：下外邹距 16px -->
        <TypographyHeader :level="2" size="h2" class="mb-4"> 資訊管理 News </TypographyHeader>
        
        <!-- 描述文本 -->
        <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
        <p class="text-swiss-text-muted">發佈行業動態及公司新聞。</p>
      </div>
      
      <!-- 右側：發佈諮訊按鈕 -->
      <!-- SwissButton：瑞士設計風格的按鈕組件 -->
      <!-- tag="a"：渲染為 <a> 標籤 -->
      <!-- to="/admin/news/new"：導航到新聞創建頁面 -->
      <!-- variant="primary"：主按鈕樣式 -->
      <!-- size="lg"：大尺寸按鈕 -->
      <!-- class="w-full"：移動端寬度 100% -->
      <!-- md:w-auto：桌面端寬度自適應 -->
      <SwissButton tag="a" to="/admin/news/new" variant="primary" size="lg" class="w-full md:w-auto">
        發佈諮訊
      </SwissButton>
    </div>

    <!-- Actions Bar：批量操作和導出（已註釋掉） -->
    <!-- flex：使用 Flexbox 布局 -->
    <!-- flex-col：移動端垂直方向排列 -->
    <!-- md:flex-row：桌面端水平方向排列 -->
    <!-- md:justify-between：桌面端兩端對齊 -->
    <!-- gap-4：元素間距 16px -->
    <div class="flex flex-col md:flex-row md:justify-between gap-4">
      <!-- 左側佔位符 -->
      <!-- flex-1：彈性元素佔據所有可用空間 -->
      <div class="flex-1"></div>
      
      <!-- 批量操作和導出按鈕（已註釋掉） -->
      <!-- UDropdown：下拉菜單組件（Nuxt UI 庫） -->
      <!-- UButton：按鈕組件（Nuxt UI 庫） -->
      <!-- 
      <div class="flex gap-2">
        <UDropdown v-if="selectedItems.length > 0" :items="bulkActionItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-bars-3-bottom-left" size="sm"
            class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
            批量操作 ({{ selectedItems.length }})
          </UButton>
        </UDropdown>

        <UDropdown :items="exportItems" :ui="{ item: { size: 'text-sm' } }">
          <UButton color="gray" variant="outline" icon="i-heroicons-arrow-down-tray" size="sm"
            class="text-[10px] font-bold uppercase tracking-widest rounded-none hover:-translate-y-0.5 transition-all">
            導出數據
          </UButton>
        </UDropdown>
      </div>
      -->
    </div>

    <!-- 表格容器 -->
    <!-- bg-white：背景顏色為白色 -->
    <!-- border：添加邊框 -->
    <!-- border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
    <div class="bg-white border border-swiss-text/10">
      <!-- TableSkeleton：表格骨架屏組件（需要實現） -->
      <!-- v-if="pending"：條件渲染，當 pending 為 true 時顯示（正在加載） -->
      <TableSkeleton v-if="pending" />
      
      <!-- UTable：表格組件（Nuxt UI 庫） -->
      <!-- v-else：條件渲染，當 pending 為 false 時顯示（加載完成） -->
      <!-- :rows="posts"：表格行數據 -->
      <!-- :columns="columns"：表格列定義 -->
      <!-- :loading="false"：加載狀態為 false（因為已經在 v-if/v-else 中處理了） -->
      <!-- :ui：自定義 UI 樣式 -->
      <UTable v-else :rows="posts" :columns="columns" :loading="false" :ui="{
        // wrapper：表格容器樣式
        // overflow-x-auto：水平方向滾動（當內容溢出時）
        wrapper: 'overflow-x-auto',
        
        // thead：表頭樣式
        // bg-swiss-bg-soft：背景顏色為瑞士軟背景顏色
        thead: 'bg-swiss-bg-soft',
        
        // th：表頭單元格樣式
        th: {
          // base：基礎樣式
          // text-[10px]：瑞士設計的超小字體 (10px)
          // font-bold：字體粗細為 700
          // uppercase：轉換為大寫
          // tracking-widest：字間距為 0.1em（瑞士設計的寬字間距）
          // text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗）
          base: 'text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted',
        },
        
        // td：表格單元格樣式
        td: {
          // base：基礎樣式
          // text-sm：字體大小 14px
          // text-swiss-text：文字顏色為瑞士文本顏色
          base: 'text-sm text-swiss-text',
        },
        
        // tr：表格行樣式
        tr: {
          // active：懸停行樣式
          // bg-swiss-bg-soft：背景顏色為瑞士軟背景顏色
          active: 'bg-swiss-bg-soft',
        },
      }">
        
        <!-- 自定義標題列 -->
        <!-- #title-data：插槽名稱（對應 columns 中的 key: 'title'） -->
        <!-- { row }：解構賦值，獲取行數據 -->
        <template #title-data="{ row }">
          <!-- flex：使用 Flexbox 布局 -->
          <!-- items-center：垂直居中 -->
          <!-- gap-3：元素間距 12px -->
          <div class="flex items-center gap-3">
            <!-- 複選框（已註釋掉） -->
            <!-- type="checkbox"：複選框類型 -->
            <!-- :checked="selectedItems.includes(row)"：根據是否被選中設置勾選狀態 -->
            <!-- @change="toggleSelection(row)"：改變時調用 toggleSelection 函數 -->
            <!-- class="w-4 h-4"：寬度和高度都為 16px -->
            <!-- border-swiss-text/20：邊框顏色為瑞士文本顏色的 20% 不透明度 -->
            <!-- 
            <input type="checkbox" :checked="selectedItems.includes(row)" @change="toggleSelection(row)"
              class="w-4 h-4 border-swiss-text/20" />
            -->
            
            <!-- 標題文本 -->
            <!-- font-medium：字體粗細為 500 -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <div class="font-medium text-swiss-text">
              <!-- row.title?.['zh-HK']：優先顯示繁體中文標題 -->
              <!-- row.title?.['hk']：如果 zh-HK 不存在，則顯示 hk 標題（向後兼容） -->
              <!-- ?.：可選鏈操作符，如果 row.title 不存在則返回 undefined -->
              <!-- ||：空值合併運算符，如果第一個值為假值則使用第二個值 -->
              {{ row.title?.['zh-HK'] || row.title?.['hk'] }}
            </div>
          </div>
        </template>

        <!-- 自定義發佈時間列 -->
        <!-- #published_at-data：插槽名稱（對應 columns 中的 key: 'published_at'） -->
        <!-- { row }：解構賦值，獲取行數據 -->
        <template #published_at-data="{ row }">
          <!-- span：行內元素 -->
          <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
          <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
          <!-- uppercase：轉換為大寫 -->
          <!-- tracking-wider：字間距為 0.05em -->
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
            <!-- 三元運算符：如果 row.published_at 存在則格式化日期，否則顯示 '未發佈' -->
            <!-- row.published_at ? ... : ...：條件表達式 -->
            <!-- formatDate(row.published_at)：調用 formatDate 函數格式化日期 -->
            {{
              row.published_at ? formatDate(row.published_at) : '未發佈'
            }}
          </span>
        </template>

        <!-- 自定義操作列 -->
        <!-- #actions-data：插槽名稱（對應 columns 中的 key: 'actions'） -->
        <!-- { row }：解構賦值，獲取行數據 -->
        <template #actions-data="{ row }">
          <!-- 編輯按鈕 -->
          <!-- NuxtLink：鏈接組件（Nuxt 3） -->
          <!-- :to="`/admin/news/${row.id}`"：導航到新聞編輯頁面 -->
          <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
          <!-- font-bold：字體粗細為 700 -->
          <!-- uppercase：轉換為大寫 -->
          <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
          <!-- px-3 py-2：左右內邹距 12px，上下內邹距 8px -->
          <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
          <!-- hover:text-swiss-text-muted：懸停時文字顏色變暗 -->
          <!-- hover:-translate-y-0.5：懸停時向上移動 2px（瑞士設計微交互） -->
          <!-- active:scale-[0.98]：激活時縮放到 98% -->
          <!-- transition-all：所有屬性過渡動畫 -->
          <!-- rounded-none：無圓角（瑞士設計的銳利邊緣） -->
          <NuxtLink :to="`/admin/news/${row.id}`"
            class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
            ✎
          </NuxtLink>
          
          <!-- 刪除按鈕 -->
          <!-- button：按鈕元素 -->
          <!-- @click="deletePost(row.id)"：點擊時調用 deletePost 函數，傳入文章 ID -->
          <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
          <!-- font-bold：字體粗細為 700 -->
          <!-- uppercase：轉換為大寫 -->
          <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
          <!-- px-3 py-2：左右內邹距 12px，上下內邹距 8px -->
          <!-- text-red-500：文字顏色為紅色（錯誤/刪除操作） -->
          <!-- hover:text-red-600：懸停時文字顏色變為紅色（更深的紅色） -->
          <!-- hover:-translate-y-0.5：懸停時向上移動 2px（瑞士設計微交互） -->
          <!-- active:scale-[0.98]：激活時縮放到 98% -->
          <!-- transition-all：所有屬性過渡動畫 -->
          <!-- rounded-none：無圓角（瑞士設計的銳利邊緣） -->
          <button @click="deletePost(row.id)"
            class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
            ✕
          </button>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta：定義頁面元數據（Nuxt 3）
// layout: 'admin'：指定使用 'admin' 布局（應該在 layouts/admin.vue 中定義）
definePageMeta({
  layout: 'admin',
})

// ref：創建響應式引用（Vue 3 組合式 API）
// search：搜索關鍵詞（未使用，可能是為了將來的搜索功能）
const search = ref('')

// ref：創建響應式引用（Vue 3 組合式 API）
// refreshKey：刷新鍵，用於觸發數據刷新
// ref(0)：初始值為 0
// 當 refreshKey 改變時，useLazyFetch 的 key 會改變，觸發重新請求
const refreshKey = ref(0)

// ref：創建響應式引用（Vue 3 組合式 API）
// selectedItems：選中的項目數組（未使用，可能是為了將來的批量操作功能）
// any[]：TypeScript 類型，表示任意類型的數組
const selectedItems = ref<any[]>([])

// columns：表格列定義數組
// key：列的鍵（對應插槽名稱）
// label：列的標題
const columns = [
  { key: 'title', label: '標題' },
  { key: 'published_at', label: '發佈時間' },
  { key: 'actions', label: '' },  // 操作列沒有標題
]

// 使用 useLazyFetch 實現動態數據加載和自動刷新
// useLazyFetch：Nuxt 3 的異步數據獲取工具（懶加載）
// '/api/news'：API 端點路徑
// key: () => `news-${refreshKey.value}`：緩存鍵，依賴於 refreshKey
//   當 refreshKey 改變時，緩存鍵改變，觸發重新請求
// transform: (data: any) => data：數據轉換函數，直接返回原數據
// default: () => ({ success: false, data: [] })：默認值，當數據未加載時使用
const { data: response, pending, refresh, error } = useLazyFetch('/api/news', {
  key: () => `news-${refreshKey.value}`,
  transform: (data: any) => data,
  default: () => ({ success: false, data: [] })
})

// computed：創建計算屬性（Vue 3 組合式 API）
// posts：文章列表
// response.value?.success：如果 API 返回成功
// response.value.data：返回文章數據
// 否則返回空數組 []
const posts = computed(() => response.value?.success ? response.value.data : [])

// 監聽錯誤
// watchEffect：自動追蹤依賴並執行副作用（Vue 3 組合式 API）
// 當 error.value 改變時，自動執行回調函數
watchEffect(() => {
  if (error.value) {
    // console.error()：記錄錯誤日誌到控制台（紅色背景）
    // '獲取文章列表失敗:'：日誌標籤
    // error.value：錯誤對象
    console.error('獲取文章列表失敗:', error.value)
  }
})

// 批量操作菜單項（已註釋掉，未使用）
// bulkActionItems：計算屬性，返回批量操作菜單項數組
// [
//   [
//     {
//       label: '批量刪除',
//       icon: 'i-heroicons-trash-20-solid',
//       class: 'text-red-500',
//       click: bulkDelete,
//     },
//   ],
// ]
const bulkActionItems = computed(() => [
  [
    {
      label: '批量刪除',
      icon: 'i-heroicons-trash-20-solid',
      class: 'text-red-500',
      click: bulkDelete,
    },
  ],
])

// 導出菜單項（已註釋掉，未使用）
// exportItems：導出菜單項數組
// [
//   [
//     {
//       label: '導出為 JSON',
//       icon: 'i-heroicons-code-bracket-20-solid',
//       click: () => exportData('json'),
//     },
//     {
//       label: '導出為 CSV',
//       icon: 'i-heroicons-table-cells-20-solid',
//       click: () => exportData('csv'),
//     },
//   ],
// ]
const exportItems = [
  [
    {
      label: '導出為 JSON',
      icon: 'i-heroicons-code-bracket-20-solid',
      click: () => exportData('json'),
    },
    {
      label: '導出為 CSV',
      icon: 'i-heroicons-table-cells-20-solid',
      click: () => exportData('csv'),
    },
  ],
]

// 切換選擇（未使用，可能是為了將來的批量操作功能）
// row：行數據
function toggleSelection(row: any) {
  // findIndex()：在 selectedItems 數組中查找項目的索引
  // item.id === row.id：比較項目 ID 和行 ID
  const index = selectedItems.value.findIndex((item) => item.id === row.id)
  
  // if (index > -1)：如果項目已存在於 selectedItems 中
  if (index > -1) {
    // splice(index, 1)：從數組中刪除該項目
    selectedItems.value.splice(index, 1)
    // else：如果項目不存在於 selectedItems 中
  } else {
    // push(row)：將項目添加到數組末尾
    selectedItems.value.push(row)
  }
}

// formatDate：格式化日期
// dateStr：日期字符串（例如 "2024-01-15T10:00:00Z"）
// 返回值：格式化後的日期字符串（例如 "2024/1/15"）
function formatDate(dateStr: string) {
  // new Date(dateStr)：將日期字符串轉換為 Date 對象
  // .toLocaleDateString('zh-HK')：轉換為香港地區的日期格式
  // 'zh-HK'：語言環境為繁體中文（香港）
  return new Date(dateStr).toLocaleDateString('zh-HK')
}

// deletePost：刪除文章
// id：文章 ID（數字）
// async：聲明為異步函數，可以在其中使用 await
async function deletePost(id: number) {
  // if (!confirm('確定刪除此文章？'))：如果用戶取消確認對話框
  // confirm()：顯示確認對話框，返回 true（確定）或 false（取消）
  if (!confirm('確定刪除此文章？')) return

  // try：嘗試執行可能出錯的代碼（異步 API 調用）
  try {
    // $fetch()：Nuxt 3 的數據獲取工具
    // `/api/news/${id}`：API 端點路徑
    // method: 'DELETE'：HTTP 方法為 DELETE（刪除資源）
    await $fetch(`/api/news/${id}`, {
      method: 'DELETE',
    })
    
    // 立刻刷新數據，實現動態更新
    // refreshKey.value++：修改 refreshKey，觸發 useLazyFetch 重新請求
    refreshKey.value++
    // await refresh()：等待數據刷新完成
    await refresh()
    
    // catch：捕獲 try 塊中的錯誤
    // error: any：錯誤對象，類型為 any（因為錯誤類型未知）
  } catch (error: any) {
    // console.error()：記錄錯誤日誌到控制台（紅色背景）
    // '刪除失敗:'：日誌標籤
    console.error('刪除失敗:', error)
    
    // 錯誤消息處理
    // error.data?.statusMessage：Nuxt 錯誤消息（例如 'Article not found'）
    // error.message：原生錯誤消息（例如 'Failed to fetch'）
    // || '刪除失敗，請重試'：如果都沒有，顯示默認消息
    const errorMessage = error.data?.statusMessage || error.message || '刪除失敗，請重試'
    
    // alert()：顯示警告對話框（阻塞用戶操作）
    alert(errorMessage)
  }
}

// 批量刪除（已註釋掉，未使用）
// async：聲明為異步函數，可以在其中使用 await
async function bulkDelete() {
  // if (!confirm(...))：如果用戶取消確認對話框
  //   `確定要刪除選中的 ${selectedItems.value.length} 篇文章嗎？`：確認消息，包含選中的文章數量
  if (!confirm(`確定要刪除選中的 ${selectedItems.value.length} 篇文章嗎？`)) return

  // try：嘗試執行可能出錯的代碼（異步 API 調用）
  try {
    // map()：將 selectedItems 數組轉換為 ID 數組
    // item.id：提取項目的 ID
    const ids = selectedItems.value.map((item) => item.id)
    
    // $fetch()：Nuxt 3 的數據獲取工具
    // '/api/news/admin/bulk'：API 端點路徑（批量操作端點）
    // method: 'POST'：HTTP 方法為 POST
    // body: { ids, action: 'delete' }：請求體，包含 ID 數組和操作類型
    await $fetch('/api/news/admin/bulk', {
      method: 'POST',
      body: { ids, action: 'delete' },
    })

    // 清空選中的項目
    selectedItems.value = []
    
    // 立刻刷新數據，實現動態更新
    // refreshKey.value++：修改 refreshKey，觸發 useLazyFetch 重新請求
    refreshKey.value++
    // await refresh()：等待數據刷新完成
    await refresh()
    
    // alert()：顯示成功消息
    alert('批量刪除成功')
    
    // catch：捕獲 try 塊中的錯誤
    // error: any：錯誤對象，類型為 any（因為錯誤類型未知）
  } catch (error: any) {
    // console.error()：記錄錯誤日誌到控制台（紅色背景）
    // '批量刪除失敗:'：日誌標籤
    console.error('批量刪除失敗:', error)
    
    // alert()：顯示警告對話框（阻塞用戶操作）
    // error.data?.message：Nuxt 錯誤消息
    // || '批量刪除失敗'：如果沒有，顯示默認消息
    alert(error.data?.message || '批量刪除失敗')
  }
}

// 導出數據（已註釋掉，未使用）
// format：導出格式（'json' 或 'csv'）
// async：聲明為異步函數，可以在其中使用 await
async function exportData(format: 'json' | 'csv') {
  // try：嘗試執行可能出錯的代碼（異步 API 調用）
  try {
    // 使用 $fetch 獲取數據，這樣可以包含認證信息並更好地處理錯誤
    // /api/news/admin/export?format=${format}：API 端點路徑（導出端點）
    //   format=${format}：查詢參數，指定導出格式
    // method: 'GET'：HTTP 方法為 GET
    // responseType: 'blob'：指定響應類型為 blob（二進制大對象）
    //   關鍵：如果使用默認的 'json'，瀏覽器會嘗試解析文件內容，導致下載失敗
    const blob = await $fetch(`/api/news/admin/export?format=${format}`, {
      method: 'GET',
      responseType: 'blob'
    })

    // 創建一個 URL 並觸發下載
    // window.URL.createObjectURL(blob as Blob)：創建臨時 URL
    //   blob as Blob：類型斷言為 Blob
    const url = window.URL.createObjectURL(blob as Blob)
    
    // document.createElement('a')：創建 <a> 標籤
    const link = document.createElement('a')
    
    // link.href = url：設置鏈接的 href 為臨時 URL
    link.href = url
    
    // link.download = ...：設置下載文件名
    //   `news_${new Date().toISOString().split('T')[0]}.${format}`：文件名格式
    //   new Date().toISOString()：當前時間的 ISO 格式（例如 "2024-01-15T10:00:00.000Z"）
    //   .split('T')[0]：分割並取第一部分（例如 "2024-01-15"）
    //   .${format}：文件擴展名（例如 ".json" 或 ".csv"）
    link.download = `news_${new Date().toISOString().split('T')[0]}.${format}`
    
    // document.body.appendChild(link)：將鏈接添加到文檔中
    document.body.appendChild(link)
    
    // link.click()：觸發點擊事件，開始下載
    link.click()

    // 清理：釋放內存
    // setTimeout()：延遲執行，確保下載開始
    // document.body.removeChild(link)：從文檔中移除鏈接
    // window.URL.revokeObjectURL(url)：釋放臨時 URL（重要！避免內存洩漏）
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    // catch：捕獲 try 塊中的錯誤
    // error: any：錯誤對象，類型為 any（因為錯誤類型未知）
  } catch (error: any) {
    // console.error()：記錄錯誤日誌到控制台（紅色背景）
    // '導出失敗:'：日誌標籤
    console.error('導出失敗:', error)
    
    // alert()：顯示警告對話框（阻塞用戶操作）
    alert('導出失敗，請重試')
  }
}

// 暴露刷新函數供外部使用
// defineExpose()：暴露函數或屬性給父組件（Vue 3 組合式 API）
// refresh：暴露 refresh 函數，父組件可以調用它
defineExpose({
  refresh
})
</script>
