&lt;!--
# 产品编辑页面 (Product Edit Page)

## 文件作用
这是产品管理后台的产品编辑/创建页面。它提供了一个完整的表单界面，允许管理员：
- 创建新产品（当 id 为 'new' 时）
- 编辑现有产品（当 id 为产品 ID 时）
- 管理产品的基本信息、媒体内容、规格参数

## 实现手段

### 1. 路由模式识别
使用 `route.params.id === 'new'` 来判断是创建新产品还是编辑现有产品：
- `isNew.value === true`：显示"新增產品"标题，调用 POST API
- `isNew.value === false`：显示"編輯產品"标题，加载现有数据，调用 PUT API

### 2. 表单数据管理
使用 Vue 3 的 `ref` 创建响应式表单数据：

typescript
const form = ref({
  slug: '',                      // URL 標識，用於生成友好的 URL
  name: { hk: '', cn: '', en: '' },  // 多語言名稱
  description: { hk: '', cn: '', en: '' },  // 多語言描述
  category: 'server',            // 產品分類
  specs: {} as Record&lt;string, string&gt;,  // 規格參數（鍵值對）
  images: [] as string[],        // 產品圖片數組
  model_3d_url: '',              // 3D 模型 URL
  is_featured: false,            // 是否首頁推薦
  status: 'draft',               // 狀態：draft/published/archived
})


### 3. 規格參數動態管理
為了方便用戶編輯規格參數（鍵值對形式），我們維護了兩個數據結構：
- `form.value.specs`：實際存儲的 JSON 對象 `{ "CPU": "2x AMD", "RAM": "128GB" }`
- `specsItems`：UI 顯示用的數組 `[{ id, key, value }, ...]`

當用戶編輯 UI 時：
1. 用戶在 `specsItems` 數組中添加/編輯/刪除項目
2. `blur` 事件觸發 `syncSpecs()` 將數組轉換為對象存儲到 `form.value.specs`
3. 提交時 `form.value.specs` 會被發送到 API

typescript
// 同步 specsItems 到 form.specs
const syncSpecs = () =&gt; {
  const newSpecs: Record&lt;string, string&gt; = {}
  specsItems.value.forEach(item =&gt; {
    if (item.key) {
      newSpecs[item.key] = item.value
    }
  })
  form.value.specs = newSpecs
}


### 4. 數據加載流程
對於編輯模式（`!isNew.value`），頁面掛載時會：

1. 設置 `loading.value = true` 顯示骨架屏
2. 調用 API 獲取產品數據：`$fetch(\`/api/products/admin/${route.params.id}\`)`
3. 將 API 返回的數據合併到表單中，確保所有字段都存在（防止 undefined）
4. 特別處理 `specs` 字段：如果為 null/undefined 設置為空對象
5. 初始化 `specsItems` 數組以供 UI 顯示
6. 設置 `loading.value = false` 顯示實際表單

typescript
// 確保 specs 字段存在
const specs = data.specs || {}

// Merge with default ensuring all keys exist
form.value = {
  slug: data.slug || '',
  category: data.category || 'server',
  name: {
    hk: data.name?.hk || '',
    cn: data.name?.cn || '',
    en: data.name?.en || '',
  },
  // ... 其他字段
  specs: specs,  // 使用處理後的 specs
  // ...
}


### 5. 保存流程
當用戶點擊"保存更改"按鈕時：

1. 設置 `saving.value = true` 禁用按鈕並顯示"保存中..."
2. 調用 `syncSpecs()` 確保規格參數已同步
3. 根據 `isNew.value` 選擇 API：
   - 創建：`POST /api/products` with payload
   - 更新：`PUT /api/products/admin/${route.params.id}` with payload
4. 如果成功，導航回產品列表頁
5. 如果失敗，顯示錯誤消息
6. 最終設置 `saving.value = false`

### 6. UI 組件集成
- **TypographyHeader**：瑞士設計風格的標題組件
- **ProductGallery**：產品圖片上傳和管理組件（需要實現）
- **FormSkeleton**：表單骨架屏組件（需要實現）

### 7. 響應式設計
使用 Tailwind CSS 的斷點系統：
- 移動端：單列布局（`grid-cols-1`）
- 桌面端：雙列布局（`md:grid-cols-2`）
- 兩列跨越：`md:col-span-2`

vue
&lt;div class="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
  &lt;div&gt;字段 1&lt;/div&gt;
  &lt;div&gt;字段 2&lt;/div&gt;
  &lt;div class="md:col-span-2"&gt;跨越兩列的字段&lt;/div&gt;
&lt;/div&gt;


### 8. 固定底部操作欄
使用 `fixed bottom-0` 創建固定底部欄，包含：
- "取消"按鈕：返回產品列表
- "保存更改"按鈕：提交表單

技術細節：
- `bg-white/80 backdrop-blur`：半透明白色背景 + 毛玻璃效果
- `md:pl-72`：桌面端左邊距為 72（考慮側邊欄寬度）
- `z-40`：確保在其他內容之上
- `hover:-translate-y-0.5 hover:shadow-lg`：懸停時上移並添加陰影（瑞士設計微交互）

### 9. 多語言支持
使用循環渲染為每種語言創建輸入框：

vue
&lt;div v-for="lang in langTabs" :key="lang.key"&gt;
  &lt;label&gt;{{ lang.label }}&lt;/label&gt;
  &lt;input v-model="(form.name as any)[lang.key]" /&gt;
&lt;/div&gt;


數據結構：
typescript
form.value.name = {
  hk: '超核 G2 服務器',  // 繁體中文
  cn: '超核 G2 服务器',  // 簡體中文
  en: 'SuperCore G2 Server',  // 英文
}


## 核心功能

### 功能 1：新產品創建
- URL 路徑：`/admin/products/new`
- 標題：顯示"新增產品"
- API：調用 `POST /api/products`
- 行為：創建成功後導航到列表頁

### 功能 2：現有產品編輯
- URL 路徑：`/admin/products/{id}`
- 標題：顯示"編輯產品"
- API：
  - 加載：`GET /api/products/admin/{id}`
  - 更新：`PUT /api/products/admin/{id}`
- 行為：更新成功後導航到列表頁

### 功能 3：多語言表單
- 支持三種語言：繁體中文 (HK)、簡體中文 (CN)、英文 (EN)
- 每種語言都有獨立的輸入框
- 數據以 JSON 對象形式存儲

### 功能 4：規格參數動態管理
- 可以添加無數量的規格參數
- 每個規格參數包含：鍵（如 CPU）和值（如 2x AMD）
- 支持刪除單個規格
- 數據以 JSON 對象形式存儲到數據庫

### 功能 5：產品狀態管理
支持三種產品狀態：
- **Draft（草稿）**：產品未發布，僅管理員可見
- **Published（已發布）**：產品公開可見
- **Archived（已歸檔）**：產品已停售，但保留記錄

### 功能 6：首頁推薦標記
通過 `is_featured` 標記產品是否在首頁展示：
- `true`：在首頁的推薦產品區域顯示
- `false`：不在首頁顯示

## 使用場景

### 場景 1：創建新產品
1. 管理員訪問 `/admin/products/new`
2. 填寫 URL 標識（slug）：`supercore-g3-server`
3. 選擇分類：`server`
4. 輸入三種語言的名稱和描述
5. 上傳產品圖片
6. 輸入 3D 模型 URL（可選）
7. 添加規格參數（CPU, RAM, Storage 等）
8. 選擇狀態：`published`
9. 勾選"首頁推薦"
10. 點擊"保存更改"

### 場景 2：編輯現有產品
1. 管理員在產品列表頁點擊某個產品的"編輯"按鈕
2. 頁面加載產品數據（顯示骨架屏）
3. 管理員修改產品信息（例如更新規格參數）
4. 添加新的規格參數
5. 點擊"保存更改"
6. 頁面導航回產品列表

### 場景 3：取消編輯
1. 管理員正在編輯產品
2. 決定不保存更改
3. 點擊底部的"取消"按鈕
4. 頁面導航回產品列表，所有更改丟失

## 性能優化

### 優化 1：骨架屏優化
在加載產品數據時顯示骨架屏：
vue
&lt;div v-if="loading" class="space-y-12"&gt;
  &lt;FormSkeleton /&gt;
&lt;/div&gt;
&lt;form v-else&gt;
  &lt;!-- 實際表單內容 --&gt;
&lt;/form&gt;


好處：
- 減少感知加載時間
- 提供更好的用戶體驗
- 避免頁面閃爍

### 優化 2：條件渲染
使用 `v-if` 而不是 `v-show` 切換骨架屏和表單：
- `v-if`：完全移除/添加 DOM 元素（初始渲染性能好）
- `v-show`：僅切換 `display` CSS 屬性（切換性能好）

在這裡使用 `v-if` 是因為：
- 骨架屏和表單不會同時顯示
- 初始渲染時骨架屏更簡單，渲染更快
- 表單內容較多，延遲渲染減少初始負擔

### 優化 3：防抖和節流
在規格參數輸入框上使用 `@blur` 事件而不是 `@input`：

vue
&lt;input v-model="item.key" @blur="syncSpecs" /&gt;


好處：
- 減少 `syncSpecs()` 的調用次數
- 避免在用戶輸入時頻繁更新 `form.value.specs`
- 只在用戶完成輸入（失去焦點）時同步一次

## 可訪問性 (Accessibility)

### 可訪問性 1：表單標籤關聯
每個輸入框都有關聯的 `&lt;label&gt;` 元素：

vue
&lt;label for="slug-input"&gt;URL 標識 (Slug) *&lt;/label&gt;
&lt;input id="slug-input" v-model="form.slug" /&gt;


好處：
- 屏幕閱讀器可以讀出標籤和輸入框的關聯
- 點擊標籤可以聚焦到輸入框
- 符合 WCAG 2.1 Level A 標準

### 可訪問性 2：必填字段標記
使用 `*` 符號標記必填字段：
vue
&lt;label&gt;URL 標識 (Slug) *&lt;/label&gt;


好處：
- 視覺上清晰標識必填字段
- 符合常見的表單設計模式

### 可訪問性 3：錯誤處理
在 `catch` 塊中顯示錯誤消息：
typescript
catch (e: any) {
  alert('加載產品失敗: ' + e.message)
}


改進建議（未實現）：
- 應該使用非阻塞的通知組件而不是 `alert()`
- 應該在輸入框旁邊顯示具體的驗證錯誤消息
- 應該添加表單驗證（例如 slug 不能為空）

### 可訪問性 4：鍵盤導航
所有交互元素都支持鍵盤操作：
- `&lt;NuxtLink&gt;`：使用 Tab 鍵可以聚焦，Enter 鍵導航
- `&lt;button&gt;`：使用 Tab 鍵可以聚焦，Enter/Space 鍵觸發
- `&lt;input&gt;`：使用 Tab 鍵可以聚焦，直接輸入

## 依賴組件

### 組件 1：TypographyHeader
文件路徑：`~/components/swiss/TypographyHeader.vue`
作用：瑞士設計風格的標題組件

使用場景：
- 頁面標題："新增產品"或"編輯產品"
- 卡片標題："基本信息"、"媒體與 3D"、"規格參數"

### 組件 2：ProductGallery
文件路徑：`~/components/products/ProductGallery.vue`（需要實現）
作用：產品圖片上傳和管理組件

功能預期：
- 上傳多張產品圖片
- 拖拽排序圖片
- 刪除單張圖片
- 預覽圖片

### 組件 3：FormSkeleton
文件路徑：`~/components/admin/FormSkeleton.vue`（需要實現）
作用：表單骨架屏組件

功能預期：
- 模擬表單布局
- 使用骨架屏動畫
- 提供視覺佔位符

## 依賴 API

### API 1：加載產品數據
端點：`GET /api/products/admin/{id}`
用途：獲取單個產品的詳細信息

請求示例：
typescript
const data = await $fetch('/api/products/admin/123')


預期響應：
json
{
  "id": 123,
  "slug": "supercore-g2-server",
  "category": "server",
  "name": {
    "hk": "超核 G2 服務器",
    "cn": "超核 G2 服务器",
    "en": "SuperCore G2 Server"
  },
  "description": {
    "hk": "超核 G2 服務器...",
    "cn": "超核 G2 服务器...",
    "en": "SuperCore G2 Server..."
  },
  "specs": {
    "CPU": "2x AMD EPYC 7763",
    "RAM": "128GB DDR4",
    "Storage": "2TB NVMe SSD"
  },
  "images": [
    "https://example.com/product-1.jpg",
    "https://example.com/product-2.jpg"
  ],
  "model_3d_url": "https://prod.spline.design/xxx",
  "featured": true,
  "status": "published"
}


### API 2：創建產品
端點：`POST /api/products`
用途：創建新產品

請求示例：
typescript
const response = await $fetch('/api/products', {
  method: 'POST',
  body: {
    slug: 'supercore-g3-server',
    category: 'server',
    name: { hk: '...', cn: '...', en: '...' },
    description: { hk: '...', cn: '...', en: '...' },
    specs: { "CPU": "2x AMD", "RAM": "128GB" },
    images: [],
    model_3d_url: '',
    is_featured: false,
    status: 'draft'
  }
})


預期響應：
json
{
  "success": true,
  "product": {
    "id": 124,
    "slug": "supercore-g3-server",
    ...
  }
}


### API 3：更新產品
端點：`PUT /api/products/admin/{id}`
用途：更新現有產品

請求示例：
typescript
const response = await $fetch('/api/products/admin/123', {
  method: 'PUT',
  body: {
    slug: 'supercore-g2-server-updated',
    category: 'server',
    ...
  }
})


預期響應：
json
{
  "success": true,
  "product": {
    "id": 123,
    "slug": 'supercore-g2-server-updated',
    ...
  }
}


## 數據流

### 數據流 1：加載產品（編輯模式）

用戶訪問 /admin/products/123
  ↓
onMounted() 鉤子觸發
  ↓
設置 loading = true
  ↓
調用 GET /api/products/admin/123
  ↓
API 返回產品數據
  ↓
合併數據到 form.value（確保所有字段存在）
  ↓
初始化 specsItems 數組
  ↓
設置 loading = false
  ↓
顯示表單內容


### 數據流 2：保存產品（創建模式）

用戶填寫表單
  ↓
點擊"保存更改"按鈕
  ↓
設置 saving = true
  ↓
調用 syncSpecs() 同步規格參數
  ↓
調用 POST /api/products
  ↓
API 創建產品
  ↓
返回成功響應
  ↓
導航到 /admin/products


### 數據流 3：保存產品（編輯模式）

用戶修改表單
  ↓
點擊"保存更改"按鈕
  ↓
設置 saving = true
  ↓
調用 syncSpecs() 同步規格參數
  ↓
調用 PUT /api/products/admin/123
  ↓
API 更新產品
  ↓
返回成功響應
  ↓
導航到 /admin/products


## Tailwind CSS 類名說明

### 布局類
- `max-w-4xl`：最大寬度 56rem (896px)，限制內容寬度
- `mx-auto`：水平居中
- `space-y-12`：垂直方向元素間距 3rem (48px)
- `flex`：使用 Flexbox 布局
- `items-center`：垂直居中
- `space-x-4`：水平方向元素間距 1rem (16px)
- `grid`：使用 CSS Grid 布局
- `grid-cols-1`：移動端單列布局
- `md:grid-cols-2`：桌面端雙列布局
- `md:col-span-2`：桌面端跨越兩列

### 間距類
- `p-6`：所有方向內邊距 1.5rem (24px)
- `md:p-8`：桌面端所有方向內邊距 2rem (32px)
- `py-2`：上下內邹距 0.5rem (8px)
- `py-3`：上下內邹距 0.75rem (12px)
- `px-3`：左右內邹距 0.75rem (12px)
- `px-4`：左右內邹距 1rem (16px)
- `mt-1`：上外邹距 0.25rem (4px)
- `mb-2`：下外邹距 0.5rem (8px)

### 邊框和背景類
- `border`：添加邊框
- `border-swiss-text/10`：邊框顏色為瑞士文本顏色的 10% 不透明度
- `border-swiss-text`：邊框顏色為瑞士文本顏色
- `border-b`：底部邊框
- `border-t`：頂部邊框
- `bg-white`：背景顏色為白色
- `bg-swiss-bg`：背景顏色為瑞士背景顏色
- `bg-swiss-bg-soft`：背景顏色為瑞士軟背景顏色
- `bg-white/80`：背景顏色為白色的 80% 不透明度
- `backdrop-blur`：背景毛玻璃效果

### 文字類
- `text-[10px]`：字體大小 10px（瑞士設計的超小字體）
- `text-sm`：字體大小 0.875rem (14px)
- `font-bold`：字體粗細為 700
- `uppercase`：轉換為大寫
- `tracking-widest`：字間距為 0.1em（瑞士設計的寬字間距）
- `tracking-wider`：字間距為 0.05em
- `text-swiss-text`：文字顏色為瑞士文本顏色
- `text-swiss-text-muted`：文字顏色為瑞士文本顏色（變暗）
- `text-red-500`：文字顏色為紅色（錯誤/刪除操作）

### 布局定位類
- `fixed`：固定定位
- `bottom-0`：底部對齊
- `left-0`：左側對齊
- `right-0`：右側對齊
- `z-40`：z-index 層級為 40

### 交互類
- `hover:text-swiss-text-muted`：懸停時文字顏色變暗
- `hover:text-swiss-text/90`：懸停時文字顏色為 90% 不透明度
- `hover:bg-gray-200`：懸停時背景顏色為灰色
- `hover:bg-swiss-text/90`：懸停時背景顏色為瑞士文本顏色的 90% 不透明度
- `hover:-translate-y-0.5`：懸停時向上移動 2px（瑞士設計微交互）
- `hover:shadow-lg`：懸停時添加大陰影
- `hover:text-red-500`：懸停時文字顏色變為紅色
- `active:scale-[0.98]`：激活時縮放到 98%
- `focus:outline-none`：聚焦時移除默認輪廓
- `focus:border-swiss-text`：聚焦時邊框顏色為瑞士文本顏色
- `disabled:opacity-50`：禁用時透明度為 50%
- `disabled:cursor-not-allowed`：禁用時鼠標指針為不允許

### 過渡類
- `transition-all`：所有屬性過渡動畫
- `transition-colors`：顏色屬性過渡動畫

### 其他類
- `rounded-none`：無圓角（瑞士設計的銳利邊緣）
- `justify-between`：兩端對齊
- `justify-end`：右對齊
- `flex-1`：彈性元素佔據所有可用空間

## Vue 3 特性說明

### ref
用於創建響應式引用：

typescript
const form = ref({
  slug: '',
  name: { hk: '', cn: '', en: '' },
  // ...
})


好處：
- 在模板中可以直接訪問 `form.value`
- 在 JS 中通過 `form.value` 訪問值
- 當值改變時自動觸發視圖更新

### computed
用於創建計算屬性：

typescript
const isNew = computed(() =&gt; route.params.id === 'new')


好處：
- 基於 `route.params.id` 自動計算
- 當 `route.params.id` 改變時自動重新計算
- 只在依賴改變時才重新計算（性能優化）

### onMounted
用於註冊組件掛載後的回調：

typescript
onMounted(async () =&gt; {
  if (!isNew.value) {
    loading.value = true
    try {
      const data = await $fetch(`/api/products/admin/${route.params.id}`)
      // 處理數據...
    } finally {
      loading.value = false
    }
  }
})


好處：
- 確保 DOM 已經掛載
- 適合執行異步數據加載
- 在服務器渲染（SSR）時只會在客戶端執行

### v-model
用於雙向數據綁定：

vue
&lt;input v-model="form.slug" /&gt;


等價於：
vue
&lt;input
  :value="form.slug"
  @input="form.slug = $event.target.value"
/&gt;


好處：
- 簡化雙向綁定代碼
- 自動處理輸入、選擇、複選框等不同元素

### v-for
用於循環渲染：

vue
&lt;div v-for="lang in langTabs" :key="lang.key"&gt;
  &lt;label&gt;{{ lang.label }}&lt;/label&gt;
  &lt;input v-model="(form.name as any)[lang.key]" /&gt;
&lt;/div&gt;


好處：
- 為每種語言動態生成輸入框
- 使用 `:key` 確保高效的列表更新

### v-if
用於條件渲染：

vue
&lt;div v-if="loading"&gt;
  &lt;FormSkeleton /&gt;
&lt;/div&gt;
&lt;form v-else&gt;
  &lt;!-- 表單內容 --&gt;
&lt;/form&gt;


好處：
- 根據條件切換顯示內容
- `v-if` 完全移除/添加 DOM 元素

### v-show
（未使用）等價於切換 `display` CSS 屬性

### @submit.prevent
用於攔截表單提交並阻止默認行為：

vue
&lt;form @submit.prevent="saveProduct"&gt;
  &lt;!-- 表單內容 --&gt;
&lt;/form&gt;


好處：
- 阻止頁面刷新（默認表單提交行為）
- 自定義提交邏輯（調用 `saveProduct` 函數）

## TypeScript 類型說明

### 類型 1：Record&lt;string, string&gt;
用於規格參數的鍵值對對象：

typescript
specs: {} as Record&lt;string, string&gt;


示例值：
typescript
{
  "CPU": "2x AMD EPYC 7763",
  "RAM": "128GB DDR4",
  "Storage": "2TB NVMe SSD"
}


### 類型 2：string[]
用於產品圖片數組：

typescript
images: [] as string[]


示例值：
typescript
[
  "https://example.com/product-1.jpg",
  "https://example.com/product-2.jpg"
]


### 類型 3：Array&lt;{ id: string; key: string; value: string }&gt;
用於規格參數項目數組：

typescript
specsItems: ref&lt;Array&lt;{ id: string; key: string; value: string }&gt;&gt;


示例值：
typescript
[
  {
    id: "spec_0_1234567890",
    key: "CPU",
    value: "2x AMD EPYC 7763"
  },
  {
    id: "spec_1_1234567891",
    key: "RAM",
    value: "128GB DDR4"
  }
]


### 類型斷言：as any
用於繞過 TypeScript 類型檢查：

vue
&lt;input v-model="(form.name as any)[lang.key]" /&gt;


為什麼使用：
- `form.name` 的類型是 `{ hk: string; cn: string; en: string }`
- `lang.key` 是動態的字符串，可能是 `'hk'`, `'cn'`, `'en'`
- TypeScript 無法確定動態訪問的安全性，因此需要類型斷言

更好的方式（未實現）：
typescript
type Language = 'hk' | 'cn' | 'en'
form.name: Record&lt;Language, string&gt;

// 然後可以直接訪問
&lt;input v-model="form.name[lang.key as Language]" /&gt;


## 錯誤處理

### 錯誤 1：產品加載失敗
typescript
catch (e: any) {
  console.error('[Product Edit] Failed to load product:', e)
  alert('加載產品失敗: ' + e.message)
  navigateTo('/admin/products')
}


處理方式：
- 記錄錯誤到控制台
- 顯示錯誤消息給用戶
- 導航回產品列表頁

### 錯誤 2：產品保存失敗
typescript
catch (e: any) {
  alert(e.data?.statusMessage || e.message || '保存失敗，請重試')
}


處理方式：
- 顯示 Nuxt 錯誤消息（`e.data?.statusMessage`）
- 顯示原生錯誤消息（`e.message`）
- 如果都沒有，顯示默認消息
- 不導航離開，允許用戶重試

## 安全考慮

### 安全 1：SQL 注入防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該使用參數化查詢
- 不應該直接拼接 SQL
- 使用 ORM（如 Prisma）自動防護 SQL 注入

### 安全 2：XSS 防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該對輸入內容進行 HTML 轉義
- 不應該直接顯示用戶輸入的 HTML
- 在顯示時使用 `v-html` 應該謹慎

### 安全 3：身份驗證
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證用戶是否已登錄
- API 應該驗證用戶是否有權限訪問該產品
- 使用 JWT 或 Session 進行身份驗證

### 安全 4：CSRF 防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證 CSRF token
- 在表單中添加 CSRF token
- 在 API 端點驗證 token

## 待改進項目

### 改進 1：表單驗證
當前問題：沒有表單驗證

建議實現：
typescript
const validateForm = () =&gt; {
  if (!form.value.slug) {
    alert('請輸入 URL 標識')
    return false
  }
  if (!Object.values(form.value.name).some(name =&gt; name.trim())) {
    alert('請輸入至少一種語言的名稱')
    return false
  }
  if (!Object.values(form.value.description).some(desc =&gt; desc.trim())) {
    alert('請輸入至少一種語言的描述')
    return false
  }
  return true
}

async function saveProduct() {
  if (!validateForm()) {
    return
  }
  // 保存邏輯...
}


### 改進 2：Slug 唯一性驗證
當前問題：沒有檢查 slug 是否已存在

建議實現：
typescript
async function checkSlugUnique(slug: string) {
  const response = await $fetch(`/api/products/check-slug?slug=${slug}`)
  return response.isUnique
}

// 在 blur 時檢查
&lt;input v-model="form.slug" @blur="async () =&gt; {
  const isUnique = await checkSlugUnique(form.value.slug)
  if (!isUnique) {
    alert('此 URL 標識已被使用')
  }
}}" /&gt;


### 改進 3：自動保存草稿
當前問題：用戶可能忘記保存

建議實現：
typescript
// 每隔 30 秒自動保存為草稿
const saveDraftInterval = setInterval(() =&gt; {
  if (!isNew.value && form.value.status === 'draft') {
    $fetch(`/api/products/admin/${route.params.id}`, {
      method: 'PUT',
      body: { ...form.value }
    })
  }
}, 30000)

onUnmounted(() =&gt; {
  clearInterval(saveDraftInterval)
})


### 改進 4：離線支持
當前問題：離線時無法編輯

建議實現：
- 使用 IndexedDB 存儲草稿
- 檢測在線狀態
- 在線時同步到服務器

### 改進 5：圖片壓縮
當前問題：上傳的圖片可能過大

建議實現：
typescript
async function compressImage(file: File): Promise&lt;string&gt; {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = await createImageBitmap(file)

  // 調整尺寸
  const maxWidth = 1920
  const maxHeight = 1080
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
  canvas.width = img.width * scale
  canvas.height = img.height * scale

  // 壓縮
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85)
}


## 測試建議

### 測試 1：新產品創建
typescript
test('should create new product', async () =&gt; {
  const form = ref({
    slug: 'test-product',
    name: { hk: '測試產品', cn: '测试产品', en: 'Test Product' },
    description: { hk: '...', cn: '...', en: '...' },
    category: 'server',
    specs: { CPU: 'Intel Xeon' },
    images: [],
    model_3d_url: '',
    is_featured: false,
    status: 'draft'
  })

  const response = await $fetch('/api/products', {
    method: 'POST',
    body: form.value
  })

  expect(response.success).toBe(true)
  expect(response.product.slug).toBe('test-product')
})


### 測試 2：產品更新
typescript
test('should update existing product', async () =&gt; {
  const response = await $fetch('/api/products/admin/123', {
    method: 'PUT',
    body: {
      slug: 'updated-product',
      // ... 其他字段
    }
  })

  expect(response.success).toBe(true)
  expect(response.product.slug).toBe('updated-product')
})


### 測試 3：規格參數同步
typescript
test('should sync specsItems to form.specs', () =&gt; {
  specsItems.value = [
    { id: '1', key: 'CPU', value: 'Intel' },
    { id: '2', key: 'RAM', value: '16GB' }
  ]

  syncSpecs()

  expect(form.value.specs).toEqual({
    CPU: 'Intel',
    RAM: '16GB'
  })
})


## 總結

這個產品編輯頁面實現了：
- ✅ 新產品創建和現有產品編輯
- ✅ 多語言支持（繁體中文、簡體中文、英文）
- ✅ 規格參數動態管理
- ✅ 產品狀態和首頁推薦標記
- ✅ 骨架屏加載優化
- ✅ 固定底部操作欄
- ✅ 響應式設計

待改進：
- ⏳ 表單驗證
- ⏳ Slug 唯一性驗證
- ⏳ 自動保存草稿
- ⏳ 離線支持
- ⏳ 圖片壓縮

這是一個功能完整、用戶友好的產品管理頁面，遵循了瑞士設計原則和 Vue 3 最佳實踐。
--&gt;
<template>
  <!-- 管理頁面容器：外層包裹容器 -->
  <div class="admin-page-container">
    <!-- 最大寬度限制 + 居中 + 垂直間距 -->
    <div class="max-w-4xl mx-auto space-y-12">

      <!-- 頂部導航區域：返回按鈕 + 頁面標題 -->
      <div class="flex items-center space-x-4">
        <!-- NuxtLink：返回產品列表頁 -->
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
        <NuxtLink to="/admin/products"
          class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
          ←
        </NuxtLink>
        
        <!-- TypographyHeader：瑞士設計風格的標題組件 -->
        <!-- :level="2"：H2 級別的語義標題 -->
        <!-- size="h3"：H3 的視覺樣式 -->
        <!-- class="!mb-0"：強制移除底部外邹距（優先級更高） -->
        <!-- {{ isNew ? '新增產品' : '編輯產品' }}：根據是否為新模式動態顯示標題 -->
        <TypographyHeader :level="2" size="h3" class="!mb-0">
          {{ isNew ? '新增產品' : '編輯產品' }}
        </TypographyHeader>
      </div>

      <!-- 骨架屏：加載時顯示（僅在加載時渲染） -->
      <!-- v-if="loading"：條件渲染，當 loading 為 true 時顯示 -->
      <!-- space-y-12：垂直方向元素間距 48px -->
      <div v-if="loading" class="space-y-12">
        <!-- FormSkeleton：表單骨架屏組件（需要實現） -->
        <FormSkeleton />
      </div>

      <!-- 表單：加載完成後顯示（僅在非加載時渲染） -->
      <!-- @submit.prevent：攔截表單提交並阻止默認行為（頁面刷新） -->
      <!-- space-y-8：垂直方向元素間距 32px -->
      <!-- pb-24：底部內邹距 96px（為固定底部欄留出空間） -->
      <form v-else @submit.prevent="saveProduct" class="space-y-8 pb-24">
        
        <!-- 基本信息卡片 -->
        <!-- bg-white：背景顏色為白色 -->
        <!-- border：添加邊框 -->
        <!-- border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
        <div class="bg-white border border-swiss-text/10">
          
          <!-- 卡片標題區域 -->
          <!-- p-6：所有方向內邹距 24px -->
          <!-- md:p-8：桌面端所有方向內邹距 32px（響應式設計） -->
          <!-- border-b：底部邊框 -->
          <!-- border-swiss-text/10：底部邊框顏色為瑞士文本顏色的 10% 不透明度 -->
          <div class="p-6 md:p-8 border-b border-swiss-text/10">
            <!-- font-bold：字體粗細為 700 -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <div class="font-bold text-swiss-text">基本信息</div>
          </div>
          
          <!-- 卡片內容區域 -->
          <div class="p-6 md:p-8">
            <!-- 網格布局：移動端單列，桌面端雙列 -->
            <!-- grid：使用 CSS Grid 布局 -->
            <!-- grid-cols-1：移動端單列布局 -->
            <!-- md:grid-cols-2：桌面端（medium 斷點及以上）雙列布局 -->
            <!-- gap-6：網格間距 24px -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- URL 標識（Slug）字段 -->
              <div>
                <!-- label：表單標籤 -->
                <!-- block：塊級元素，獨佔一行 -->
                <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                <!-- font-bold：字體粗細為 700 -->
                <!-- uppercase：轉換為大寫 -->
                <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
                <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                <!-- mb-2：下外邹距 8px -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  URL 標識 (Slug) *
                </label>
                
                <!-- input：文本輸入框 -->
                <!-- v-model="form.slug"：雙向數據綁定到 form.slug -->
                <!-- placeholder="supercore-g2-server"：佔位符文本 -->
                <!-- w-full：寬度 100% -->
                <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                <!-- text-sm：字體大小 14px -->
                <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                <input v-model="form.slug" placeholder="supercore-g2-server"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                
                <!-- 幫助文本：解釋 slug 的用途 -->
                <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                <!-- mt-1：上外邹距 4px -->
                <p class="text-[10px] text-swiss-text-muted mt-1">
                  用於網址鏈接，如 supercore-g2-server
                </p>
              </div>

              <!-- 分類字段 -->
              <div>
                <!-- label：表單標籤 -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  分類 *
                </label>
                
                <!-- select：下拉選擇框 -->
                <!-- v-model="form.category"：雙向數據綁定到 form.category -->
                <!-- w-full：寬度 100% -->
                <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                <!-- text-sm：字體大小 14px -->
                <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                <select v-model="form.category"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
                  <!-- option：選項 -->
                  <!-- value="server"：選項值為 "server" -->
                  <option value="server">Server</option>
                  <!-- value="storage"：選項值為 "storage" -->
                  <option value="storage">Storage</option>
                  <!-- value="network"：選項值為 "network" -->
                  <option value="network">Network</option>
                </select>
              </div>

              <!-- 多語言名稱字段（跨越兩列） -->
              <!-- md:col-span-2：桌面端跨越兩列 -->
              <div class="md:col-span-2">
                <!-- label：表單標籤 -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  多語言名稱 *
                </label>
                
                <!-- 空間容器：垂直排列三種語言的輸入框 -->
                <!-- space-y-2：垂直方向元素間距 8px -->
                <div class="space-y-2">
                  <!-- v-for：循環渲染每種語言的輸入框 -->
                  <!-- lang in langTabs：遍歷語言標籤數組 -->
                  <!-- :key="lang.key"：使用語言代碼作為唯一標識（hk, cn, en） -->
                  <div v-for="lang in langTabs" :key="lang.key">
                    <!-- 語言標籤：顯示語言名稱 -->
                    <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                    <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                    <!-- uppercase：轉換為大寫 -->
                    <!-- tracking-wider：字間距為 0.05em -->
                    <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                      <!-- lang.label：語言標籤（繁體 (HK)、簡體 (CN)、English） -->
                      lang.label
                    
                    <!-- input：語言名稱輸入框 -->
                    <!-- v-model="(form.name as any)[lang.key]"：雙向數據綁定到 form.name[lang.key] -->
                    <!-- (form.name as any)：類型斷言為 any，因為 TypeScript 無法確定動態訪問的安全性 -->
                    <!-- :placeholder：佔位符文本 -->
                    <!-- w-full：寬度 100% -->
                    <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                    <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                    <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                    <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                    <!-- text-sm：字體大小 14px -->
                    <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                    <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                    <!-- mt-1：上外邹距 4px -->
                    <input v-model="(form.name as any)[lang.key]" :placeholder="`輸入 ${lang.label} 名稱`"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>

              <!-- 多語言描述字段（跨越兩列） -->
              <!-- md:col-span-2：桌面端跨越兩列 -->
              <div class="md:col-span-2">
                <!-- label：表單標籤 -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  多語言描述 *
                </label>
                
                <!-- 空間容器：垂直排列三種語言的輸入框 -->
                <!-- space-y-2：垂直方向元素間距 8px -->
                <div class="space-y-2">
                  <!-- v-for：循環渲染每種語言的輸入框 -->
                  <!-- lang in langTabs：遍歷語言標籤數組 -->
                  <!-- :key="lang.key"：使用語言代碼作為唯一標識（hk, cn, en） -->
                  <div v-for="lang in langTabs" :key="lang.key">
                    <!-- 語言標籤：顯示語言名稱 -->
                    <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                    <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                    <!-- uppercase：轉換為大寫 -->
                    <!-- tracking-wider：字間距為 0.05em -->
                    <label class="text-[10px] text-swiss-text-muted uppercase tracking-wider">{{
                      lang.label  <!-- lang.label：語言標籤（繁體 (HK)、簡體 (CN)、English） -->
                    }}</label>
                    
                    <!-- textarea：多行文本輸入框 -->
                    <!-- v-model="(form.description as any)[lang.key]"：雙向數據綁定到 form.description[lang.key] -->
                    <!-- (form.description as any)：類型斷言為 any，因為 TypeScript 無法確定動態訪問的安全性 -->
                    <!-- :placeholder：佔位符文本 -->
                    <!-- rows="4"：顯示 4 行 -->
                    <!-- w-full：寬度 100% -->
                    <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                    <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                    <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                    <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                    <!-- text-sm：字體大小 14px -->
                    <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                    <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                    <!-- mt-1：上外邹距 4px -->
                    <textarea v-model="(form.description as any)[lang.key]" :placeholder="`輸入 ${lang.label} 描述`" rows="4"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 媒體與 3D 卡片 -->
        <div class="bg-white border border-swiss-text/10">
          
          <!-- 卡片標題區域 -->
          <div class="p-6 md:p-8 border-b border-swiss-text/10">
            <!-- font-bold：字體粗細為 700 -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <div class="font-bold text-swiss-text">媒體與 3D</div>
          </div>
          
          <!-- 卡片內容區域 -->
          <!-- p-6：所有方向內邹距 24px -->
          <!-- md:p-8：桌面端所有方向內邹距 32px（響應式設計） -->
          <!-- space-y-6：垂直方向元素間距 24px -->
          <div class="p-6 md:p-8 space-y-6">
            
            <!-- 產品圖片字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                產品圖片
              </label>
              
              <!-- ProductGallery：產品圖片上傳和管理組件（需要實現） -->
              <!-- v-model="form.images"：雙向數據綁定到 form.images 數組 -->
              <ProductGallery v-model="form.images" />
            </div>

            <!-- 3D 模型 URL 字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                3D 模型 URL (Spline/GLB)
              </label>
              
              <!-- input：文本輸入框 -->
              <!-- v-model="form.model_3d_url"：雙向數據綁定到 form.model_3d_url -->
              <!-- placeholder="https://prod.spline.design/..."：佔位符文本 -->
              <!-- w-full：寬度 100% -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <input v-model="form.model_3d_url" placeholder="https://prod.spline.design/..."
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
            </div>

            <!-- 首頁推薦和狀態字段（水平排列） -->
            <!-- flex：使用 Flexbox 布局 -->
            <!-- items-center：垂直居中 -->
            <!-- space-x-4：水平方向元素間距 16px -->
            <div class="flex items-center space-x-4">
              
              <!-- 首頁推薦複選框 -->
              <!-- label：表單標籤 -->
              <!-- flex items-center space-x-2：Flexbox 布局 + 垂直居中 + 水平間距 8px -->
              <label class="flex items-center space-x-2">
                <!-- input type="checkbox"：複選框 -->
                <!-- v-model="form.is_featured"：雙向數據綁定到 form.is_featured -->
                <!-- w-4 h-4：寬度和高度都為 16px -->
                <input type="checkbox" v-model="form.is_featured" class="w-4 h-4" />
                
                <!-- 複選框標籤文本 -->
                <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                <!-- font-bold：字體粗細為 700 -->
                <!-- uppercase：轉換為大寫 -->
                <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
                <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text">首頁推薦</span>
              </label>
              
              <!-- 產品狀態下拉選擇框 -->
              <!-- select：下拉選擇框 -->
              <!-- v-model="form.status"：雙向數據綁定到 form.status -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <select v-model="form.status"
                class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
                <!-- option：選項 -->
                <!-- value="draft"：選項值為 "draft"（草稿） -->
                <option value="draft">Draft</option>
                <!-- value="published"：選項值為 "published"（已發布） -->
                <option value="published">Published</option>
                <!-- value="archived"：選項值為 "archived"（已歸檔） -->
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 規格參數（Specs）卡片 -->
        <div class="bg-white border border-swiss-text/10">
          
          <!-- 卡片標題區域 -->
          <!-- p-6：所有方向內邹距 24px -->
          <!-- md:p-8：桌面端所有方向內邹距 32px（響應式設計） -->
          <!-- border-b：底部邊框 -->
          <!-- border-swiss-text/10：底部邊框顏色為瑞士文本顏色的 10% 不透明度 -->
          <!-- flex：使用 Flexbox 布局 -->
          <!-- justify-between：兩端對齊 -->
          <!-- items-center：垂直居中 -->
          <div class="p-6 md:p-8 border-b border-swiss-text/10 flex justify-between items-center">
            <!-- 卡片標題 -->
            <!-- font-bold：字體粗細為 700 -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <div class="font-bold text-swiss-text">規格參數 (Specs)</div>
            
            <!-- 添加規格按鈕 -->
            <!-- button：按鈕元素 -->
            <!-- type="button"：按鈕類型為普通按鈕（不是提交按鈕） -->
            <!-- @click="addSpec"：點擊時調用 addSpec 函數 -->
            <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
            <!-- font-bold：字體粗細為 700 -->
            <!-- uppercase：轉換為大寫 -->
            <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <!-- hover:text-swiss-text-muted：懸停時文字顏色變暗 -->
            <button type="button" @click="addSpec"
              class="text-[10px] font-bold uppercase tracking-widest text-swiss-text hover:text-swiss-text-muted">
              + 添加
            </button>
          </div>
          
          <!-- 卡片內容區域 -->
          <!-- p-6：所有方向內邹距 24px -->
          <!-- md:p-8：桌面端所有方向內邹距 32px（響應式設計） -->
          <!-- space-y-3：垂直方向元素間距 12px -->
          <div class="p-6 md:p-8 space-y-3">
            
            <!-- 規格參數項目列表 -->
            <!-- v-for：循環渲染每個規格參數項目 -->
            <!-- (item, index) in specsItems：遍歷 specsItems 數組 -->
            <!-- :key="item.id"：使用項目 ID 作為唯一標識 -->
            <!-- flex items-center space-x-2：Flexbox 布局 + 垂直居中 + 水平間距 8px -->
            <div v-for="(item, index) in specsItems" :key="item.id" class="flex items-center space-x-2">
              
              <!-- 鍵（Key）輸入框 -->
              <!-- input：文本輸入框 -->
              <!-- v-model="item.key"：雙向數據綁定到 item.key -->
              <!-- @blur="syncSpecs"：失去焦點時調用 syncSpecs 函數（同步 specsItems 到 form.specs） -->
              <!-- placeholder="Key (如 CPU)"：佔位符文本 -->
              <!-- flex-1：彈性元素佔據所有可用空間 -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <input v-model="item.key"
                @blur="syncSpecs"
                placeholder="Key (如 CPU)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              
              <!-- 值（Value）輸入框 -->
              <!-- input：文本輸入框 -->
              <!-- v-model="item.value"：雙向數據綁定到 item.value -->
              <!-- @blur="syncSpecs"：失去焦點時調用 syncSpecs 函數（同步 specsItems 到 form.specs） -->
              <!-- placeholder="Value (如 2x AMD)"：佔位符文本 -->
              <!-- flex-1：彈性元素佔據所有可用空間 -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <input v-model="item.value"
                @blur="syncSpecs"
                placeholder="Value (如 2x AMD)"
                class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
              
              <!-- 刪除按鈕 -->
              <!-- button：按鈕元素 -->
              <!-- type="button"：按鈕類型為普通按鈕（不是提交按鈕） -->
              <!-- @click="removeSpec(index)"：點擊時調用 removeSpec 函數，傳入項目索引 -->
              <!-- px-3：左右內邹距 12px -->
              <!-- py-3：上下內邹距 12px -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- hover:text-red-500：懸停時文字顏色變為紅色（錯誤/刪除操作） -->
              <!-- transition-colors：顏色屬性過渡動畫 -->
              <button type="button" @click="removeSpec(index)"
                class="px-3 py-3 text-swiss-text hover:text-red-500 transition-colors">
                ✕
              </button>
            </div>
            
            <!-- 空狀態提示：當沒有規格參數時顯示 -->
            <!-- v-if="specsItems.length === 0"：條件渲染，當 specsItems 數組為空時顯示 -->
            <!-- text-center：文本居中 -->
            <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
            <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
            <!-- uppercase：轉換為大寫 -->
            <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
            <!-- py-4：上下內邹距 16px -->
            <div v-if="specsItems.length === 0"
              class="text-center text-swiss-text-muted text-[10px] uppercase tracking-widest py-4">
              點擊右上角添加規格
            </div>
          </div>
        </div>

        <!-- 固定底部操作欄 -->
        <!-- fixed：固定定位 -->
        <!-- bottom-0：底部對齊 -->
        <!-- left-0：左側對齊 -->
        <!-- right-0：右側對齊 -->
        <!-- bg-white/80：背景顏色為白色的 80% 不透明度（半透明白色） -->
        <!-- backdrop-blur：背景毛玻璃效果 -->
        <!-- border-t border-swiss-text/10：頂部邊框顏色為瑞士文本顏色的 10% 不透明度 -->
        <!-- p-4：所有方向內邹距 16px -->
        <!-- md:pl-72：桌面端左內邹距为 72（考慮側邊欄寬度） -->
        <!-- z-40：z-index 層級為 40（確保在其他內容之上） -->
        <div
          class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-swiss-text/10 p-4 md:pl-72 z-40">
          <!-- max-w-4xl：最大寬度 56rem (896px)，限制內容寬度 -->
          <!-- mx-auto：水平居中 -->
          <!-- flex：使用 Flexbox 布局 -->
          <!-- justify-end：右對齊 -->
          <!-- space-x-4：水平方向元素間距 16px -->
          <div class="max-w-4xl mx-auto flex justify-end space-x-4">
            
            <!-- 取消按鈕 -->
            <!-- NuxtLink：鏈接組件 -->
            <!-- to="/admin/products"：導航到產品列表頁 -->
            <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
            <!-- font-bold：字體粗細為 700 -->
            <!-- uppercase：轉換為大寫 -->
            <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
            <!-- px-6 py-3：左右內邹距 24px，上下內邹距 12px -->
            <!-- bg-swiss-bg-soft：背景顏色為瑞士軟背景顏色 -->
            <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
            <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
            <!-- hover:bg-gray-200：懸停時背景顏色為灰色 -->
            <!-- hover:-translate-y-0.5：懸停時向上移動 2px（瑞士設計微交互） -->
            <!-- active:scale-[0.98]：激活時縮放到 98% -->
            <!-- transition-all：所有屬性過渡動畫 -->
            <!-- rounded-none：無圓角（瑞士設計的銳利邊緣） -->
            <NuxtLink to="/admin/products"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              取消
            </NuxtLink>
            
            <!-- 保存更改按鈕 -->
            <!-- button：按鈕元素 -->
            <!-- type="submit"：按鈕類型為提交按鈕（觸發表單提交） -->
            <!-- :disabled="saving"：根據 saving 狀態禁用按鈕 -->
            <!-- :class="saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg'"：動態樣式 -->
            <!--   - saving 為 true：透明度 50%，鼠標指針為不允許 -->
            <!--   - saving 為 false：懸停時背景顏色為 90% 不透明度，向上移動 2px，添加大陰影 -->
            <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
            <!-- font-bold：字體粗細為 700 -->
            <!-- uppercase：轉換為大寫 -->
            <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
            <!-- px-6 py-3：左右內邹距 24px，上下內邹距 12px -->
            <!-- bg-swiss-text：背景顏色為瑞士文本顏色 -->
            <!-- text-white：文字顏色為白色 -->
            <!-- transition-all：所有屬性過渡動畫 -->
            <!-- rounded-none：無圓角（瑞士設計的銳利邊緣） -->
            <button type="submit" :disabled="saving"
              :class="saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-swiss-text/90 hover:-translate-y-0.5 hover:shadow-lg'"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-text text-white transition-all rounded-none">
              
              <!-- 條件渲染：根據 saving 狀態顯示不同文本 -->
              <!-- v-if="saving"：當 saving 為 true 時顯示 -->
              <span v-if="saving">保存中...</span>
              
              <!-- v-else：當 saving 為 false 時顯示 -->
              <span v-else>保存更改</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// definePageMeta：定義頁面元數據
// layout: 'admin'：指定使用 'admin' 布局（應該在 layouts/admin.vue 中定義）
definePageMeta({
  layout: 'admin',
})

// useRoute：獲取當前路由信息（Nuxt 3 組合式 API）
// route.params.id：URL 路徑參數（例如 /admin/products/new 中的 'new'，或 /admin/products/123 中的 '123'）
const route = useRoute()

// computed：創建計算屬性（Vue 3 組合式 API）
// route.params.id === 'new'：當路徑參數為 'new' 時，表示創建新模式
// 返回值：true 表示新產品，false 表示編輯現有產品
const isNew = computed(() => route.params.id === 'new')

// ref：創建響應式引用（Vue 3 組合式 API）
// saving：保存狀態（true 表示正在保存，false 表示未保存）
// ref(false)：初始值為 false
const saving = ref(false)

// ref：創建響應式引用（Vue 3 組合式 API）
// loading：加載狀態（true 表示正在加載，false 表示加載完成）
// ref(false)：初始值為 false
const loading = ref(false)

// import：導入 FormSkeleton 組件（表單骨架屏組件，需要實現）
// FormSkeleton：用於在加載時顯示骨架屏，減少感知加載時間
import FormSkeleton from '~/components/admin/FormSkeleton.vue'

// langTabs：語言標籤數組
// 定義了三種語言：繁體中文 (HK)、簡體中文 (CN)、英文 (EN)
// key：語言代碼，用於訪問 form.name[key] 或 form.description[key]
// label：語言顯示名稱，用於在 UI 中顯示
const langTabs = [
  { key: 'hk', label: '繁體 (HK)' },
  { key: 'cn', label: '簡體 (CN)' },
  { key: 'en', label: 'English' },
]

// form：表單數據的響應式引用
// ref()：創建響應式對象（Vue 3 組合式 API）
// slug：URL 標識，用於生成友好的 URL（例如 supercore-g2-server）
// name：多語言名稱，包含三種語言（繁體、簡體、英文）
// description：多語言描述，包含三種語言（繁體、簡體、英文）
// category：產品分類（server/storage/network）
// specs：規格參數，鍵值對形式（例如 { "CPU": "2x AMD", "RAM": "128GB" }）
//   Record<string, string>：TypeScript 類型，表示鍵和值都是字符串的對象
// images：產品圖片數組（包含圖片 URL 字符串）
//   string[]：TypeScript 類型，表示字符串數組
// model_3d_url：3D 模型 URL（Spline 或 GLB 格式）
// is_featured：是否首頁推薦（true 表示在首頁展示）
// status：產品狀態（draft/published/archived）
const form = ref({
  slug: '',
  name: { hk: '', cn: '', en: '' },
  description: { hk: '', cn: '', en: '' },
  category: 'server',
  specs: {} as Record<string, string>,
  images: [] as string[],
  model_3d_url: '',
  is_featured: false,
  status: 'draft',
})

// specsItems：用於編輯的規格參數數組
// ref()：創建響應式數組（Vue 3 組合式 API）
// Array<{ id: string; key: string; value: string }>：TypeScript 類型，表示對象數組
//   id：唯一標識符（用於 v-for 的 key）
//   key：規格鍵（例如 "CPU"）
//   value：規格值（例如 "2x AMD"）
const specsItems = ref<Array<{ id: string; key: string; value: string }>>([])

// initSpecsItems：初始化 specsItems 數組
// 作用：將 form.value.specs 對象轉換為 specsItems 數組，以便在 UI 中顯示和編輯
// 原因：form.value.specs 是鍵值對對象，不方便在 UI 中編輯；specsItems 是數組，容易渲染和操作
const initSpecsItems = () => {
  // Object.keys(form.value.specs)：獲取 specs 對象的所有鍵（例如 ["CPU", "RAM", "Storage"]）
  // map()：遍歷每個鍵，轉換為 specsItems 項目
  specsItems.value = Object.keys(form.value.specs).map((key, index) => ({
    // id：生成唯一標識符（例如 "spec_0_1234567890"）
    //   `spec_${index}_${Date.now()}`：模板字符串，使用索引和當前時間戳
    //   Date.now()：返回當前時間的毫秒數（用於確保唯一性）
    id: `spec_${index}_${Date.now()}`,
    
    // key：規格鍵（例如 "CPU"）
    key,
    
    // value：規格值（從 form.value.specs[key] 中獲取，例如 "2x AMD"）
    value: form.value.specs[key]
  }))
}

// syncSpecs：同步 specsItems 到 form.specs
// 作用：將 specsItems 數組轉換為 form.value.specs 對象
// 原因：在提交表單時，需要將數組轉換為對象形式發送到 API
// 調用時機：當用戶失去焦點時（@blur）或刪除規格時
const syncSpecs = () => {
  // newSpecs：新的規格對象
  // Record<string, string>：TypeScript 類型，表示鍵和值都是字符串的對象
  const newSpecs: Record<string, string> = {}
  
  // forEach()：遍歷 specsItems 數組的每個項目
  specsItems.value.forEach(item => {
    // if (item.key)：如果鍵不為空（避免存儲空鍵）
    if (item.key) {
      // newSpecs[item.key] = item.value：將鍵值對添加到 newSpecs 對象中
      // 例如：newSpecs["CPU"] = "2x AMD"
      newSpecs[item.key] = item.value
    }
  })
  
  // form.value.specs = newSpecs：將新的規格對象賦值給 form.value.specs
  form.value.specs = newSpecs
}

// onMounted：註冊組件掛載後的回調（Vue 3 組合式 API）
// async：聲明為異步函數，可以在其中使用 await
// 作用：在組件掛載到 DOM 後執行（用於加載產品數據）
// 執行時機：只在客戶端執行（不會在服務器渲染時執行）
onMounted(async () => {
  // if (!isNew.value)：如果不是創建新模式（即編輯模式）
  //   isNew.value === false：表示 route.params.id 不是 'new'，而是實際的產品 ID
  if (!isNew.value) {
    // loading.value = true：設置加載狀態為 true，顯示骨架屏
    loading.value = true
    
    // try：嘗試執行可能出錯的代碼（異步 API 調用）
    try {
      // $fetch：Nuxt 3 的數據獲取工具（類似於 fetch）
      // `/api/products/admin/${route.params.id}`：API 端點路徑
      //   route.params.id：產品 ID（例如 '123'）
      // as any：類型斷言為 any（因為 API 響應類型未知）
      const data = await $fetch(`/api/products/admin/${route.params.id}`) as any
      
      // console.log()：記錄日誌到控制台
      // '[Product Edit] Loaded product data:'：日誌標籤
      // JSON.stringify(data, null, 2)：將 data 對象轉換為格式化的 JSON 字符串（2 空格縮進）
      console.log('[Product Edit] Loaded product data:', JSON.stringify(data, null, 2))

      // if (data)：如果成功獲取到數據
      if (data) {
        // specs：處理規格參數
        // data.specs || {}：如果 data.specs 為 null 或 undefined，則使用空對象
        // 原因：防止 specs 為 null 時導致 Object.keys() 報錯
        const specs = data.specs || {}

        // form.value = { ... }：合併數據到表單中
        // 使用默認值確保所有字段都存在（防止 undefined）
        form.value = {
          // data.slug || ''：如果 data.slug 為 null/undefined/空字符串，則使用空字符串
          slug: data.slug || '',
          
          // data.category || 'server'：如果 data.category 為 null/undefined，則使用 'server'
          category: data.category || 'server',
          
          // name：多語言名稱
          name: {
            // data.name?.hk || ''：可選鏈操作符 (?.) + 空值合併運算符 (||)
            //   data.name?.hk：如果 data.name 存在，則訪問 data.name.hk；否則返回 undefined
            //   || ''：如果結果為 undefined/null/空字符串，則使用空字符串
            hk: data.name?.hk || '',
            cn: data.name?.cn || '',
            en: data.name?.en || '',
          },
          
          // description：多語言描述
          description: {
            hk: data.description?.hk || '',
            cn: data.description?.cn || '',
            en: data.description?.en || '',
          },
          
          // specs：使用處理後的 specs 對象（確保不是 null/undefined）
          specs: specs,
          
          // data.images || []：如果 data.images 為 null/undefined，則使用空數組
          images: data.images || [],
          
          // data.model_3d_url || ''：如果 data.model_3d_url 為 null/undefined/空字符串，則使用空字符串
          model_3d_url: data.model_3d_url || '',
          
          // data.featured || false：注意：API 返回的字段名是 'featured'，但表單字段名是 'is_featured'
          is_featured: data.featured || false,
          
          // data.status || 'draft'：如果 data.status 為 null/undefined，則使用 'draft'
          status: data.status || 'draft',
        }

        // console.log()：記錄日誌到控制台
        // '[Product Edit] Form initialized:'：日誌標籤
        console.log('[Product Edit] Form initialized:', JSON.stringify(form.value, null, 2))
        
        // console.log()：記錄日誌到控制台
        // '[Product Edit] Specs keys:'：日誌標籤
        // Object.keys(form.value.specs)：獲取 specs 對象的所有鍵
        console.log('[Product Edit] Specs keys:', Object.keys(form.value.specs))

        // initSpecsItems()：初始化 specsItems 數組
        // 將 form.value.specs 對象轉換為 specsItems 數組，以便在 UI 中顯示和編輯
        initSpecsItems()
      }
      
      // catch：捕獲 try 塊中的錯誤
      // e: any：錯誤對象，類型為 any（因為錯誤類型未知）
    } catch (e: any) {
      // console.error()：記錄錯誤日誌到控制台（紅色背景）
      console.error('[Product Edit] Failed to load product:', e)
      
      // alert()：顯示警告對話框（阻塞用戶操作）
      // e.message：錯誤消息（例如 'Product not found'）
      alert('加載產品失敗: ' + e.message)
      
      // navigateTo()：導航到指定路徑（Nuxt 3 導航函數）
      // '/admin/products'：導航到產品列表頁
      navigateTo('/admin/products')
      
      // finally：無論 try 或 catch 是否執行，都會執行此代碼塊
    } finally {
      // loading.value = false：設置加載狀態為 false，隱藏骨架屏，顯示實際表單
      loading.value = false
    }
  }
})

// addSpec：添加規格參數
// 作用：在 specsItems 數組中添加一個新的空白規格項目
// 調用時機：用戶點擊"+ 添加"按鈕時
function addSpec() {
  // specsItems.value.push()：向數組末尾添加一個新元素
  specsItems.value.push({
    // id：生成唯一標識符（例如 "spec_new_1234567890"）
    //   `spec_new_${Date.now()}`：模板字符串，使用 "spec_new_" 前綴和當前時間戳
    id: `spec_new_${Date.now()}`,
    
    // key：規格鍵（初始為空字符串）
    key: '',
    
    // value：規格值（初始為空字符串）
    value: ''
  })
}

// removeSpec：刪除規格參數
// index：要刪除的項目索引（specsItems 數組中的位置）
// 作用：從 specsItems 數組中刪除指定索引的項目
// 調用時機：用戶點擊刪除按鈕（✕）時
function removeSpec(index: number) {
  // specsItems.value.splice(index, 1)：從數組中刪除元素
  //   index：開始刪除的位置
  //   1：刪除的元素數量
  specsItems.value.splice(index, 1)
  
  // syncSpecs()：同步 specsItems 到 form.specs
  // 原因：刪除後需要更新 form.value.specs 對象
  syncSpecs()
}

// saveProduct：保存產品
// async：聲明為異步函數，可以在其中使用 await
// 作用：創建新產品或更新現有產品
// 調用時機：用戶點擊"保存更改"按鈕時（表單提交時）
async function saveProduct() {
  // saving.value = true：設置保存狀態為 true，禁用按鈕並顯示"保存中..."
  saving.value = true
  
  // try：嘗試執行可能出錯的代碼（異步 API 調用）
  try {
    // syncSpecs()：同步 specsItems 到 form.specs
    // 原因：在保存前確保規格參數是最新的
    syncSpecs()

    // payload：請求負載（要發送到 API 的數據）
    // { ...form.value }：使用展開運算符複製 form.value 對象
    // 原因：避免直接修改 form.value（防止意外的副作用）
    const payload = { ...form.value }

    // if (isNew.value)：如果是創建新模式
    //   isNew.value === true：表示 route.params.id 是 'new'
    if (isNew.value) {
      // 創建新产品
      // $fetch()：Nuxt 3 的數據獲取工具
      // '/api/products'：API 端點路徑
      // method: 'POST'：HTTP 方法為 POST（創建資源）
      // body: payload：請求體為 payload（產品數據）
      const response = await $fetch('/api/products', {
        method: 'POST',
        body: payload,
      })
      
      // if (response.success)：如果 API 返回成功
      //   response.success：API 響應中的 success 字段（例如 { success: true, product: {...} }）
      if (response.success) {
        // navigateTo()：導航到指定路徑（Nuxt 3 導航函數）
        // '/admin/products'：導航到產品列表頁
        navigateTo('/admin/products')
      }
      
      // else：如果是編輯模式
      //   isNew.value === false：表示 route.params.id 是實際的產品 ID
    } else {
      // 更新产品
      // $fetch()：Nuxt 3 的數據獲取工具
      // `/api/products/admin/${route.params.id}`：API 端點路徑
      //   route.params.id：產品 ID（例如 '123'）
      // method: 'PUT'：HTTP 方法為 PUT（更新資源）
      // body: payload：請求體為 payload（產品數據）
      const response = await $fetch(`/api/products/admin/${route.params.id}`, {
        method: 'PUT',
        body: payload,
      })
      
      // if (response.success)：如果 API 返回成功
      if (response.success) {
        // navigateTo()：導航到指定路徑（Nuxt 3 導航函數）
        // '/admin/products'：導航到產品列表頁
        navigateTo('/admin/products')
      }
    }
    
    // catch：捕獲 try 塊中的錯誤
    // e: any：錯誤對象，類型為 any（因為錯誤類型未知）
  } catch (e: any) {
    // alert()：顯示警告對話框（阻塞用戶操作）
    // e.data?.statusMessage：Nuxt 錯誤消息（例如 'Validation failed'）
    // e.message：原生錯誤消息（例如 'Failed to fetch'）
    // || '保存失敗，請重試'：如果都沒有，顯示默認消息
    alert(e.data?.statusMessage || e.message || '保存失敗，請重試')
    
    // finally：無論 try 或 catch 是否執行，都會執行此代碼塊
  } finally {
    // saving.value = false：設置保存狀態為 false，啟用按鈕並顯示"保存更改"
    saving.value = false
  }
}
</script>
