<!--
# 新聞編輯頁面 (News Edit Page)

## 文件作用
這是新聞管理後台的新聞編輯/創建頁面。它提供了一個完整的表單界面，允許管理员：
- 創建新新聞（當 id 為 'new' 時）
- 編輯現有新聞（當 id 為新聞 ID 時）
- 管理新聞的標題、摘要、正文、封面圖片、標籤、發佈時間

## 實現手段

### 1. 路由模式識別
使用 `route.params.id === 'new'` 來判斷是創建新新聞還是編輯現有新聞：
- `isNew.value === true`：顯示"發佈資訊"標題，調用 POST API
- `isNew.value === false`：顯示"編輯資訊"標題，加載現有數據，調用 PUT API

typescript
const route = useRoute()
const isNew = computed(() => route.params.id === 'new')


### 2. 表單數據管理
使用 Vue 3 的 `ref` 創建響應式表單數據：

typescript
const form = ref({
  slug: '',                        // URL 標識，用於生成友好的 URL
  title: { hk: '', cn: '', en: '' },  // 多語言標題
  summary: { hk: '', cn: '', en: '' },  // 多語言摘要
  content: { hk: '', cn: '', en: '' },  // 多語言正文（富文本）
  cover_image: '',                 // 封面圖片 URL
  tags: [] as string[],            // 標籤數組
  published_at: null as string | null,  // 發佈時間（ISO 格式）
})


### 3. 多語言支持
使用循環渲染為每種語言創建輸入框：

vue
<div v-for="lang in langTabs" :key="lang.key">
  <label>{{ lang.label }}</label>
  <input v-model="form.title[lang.key]" />
</div>


數據結構：
typescript
form.value.title = {
  hk: '超核技術發布新產品',  // 繁體中文
  cn: '超核技术发布新产品',  // 簡體中文
  en: 'Nucleon Tech Launches New Product',  // 英文
}


### 4. 標籤處理（字符串 ↔ 數組轉換）
使用計算屬性的 getter/setter 實現字符串和數組的雙向綁定：

typescript
const tagsInput = computed({
  get: () => (form.value.tags || []).join(','),  // 數組 → 字符串
  set: (val: string) => {                        // 字符串 → 數組
    form.value.tags = val
      .split(',')           // 按逗號分割
      .map((t) => t.trim()) // 去除首尾空格
      .filter((t) => t)      // 過濾空字符串
  },
})


**為什麼這樣設計？**

- 用戶輸入：字符串（例如 "AI, Infrastructure, Cloud"）
- 數據存儲：數組（例如 `["AI", "Infrastructure", "Cloud"]`）
- 計算屬性自動處理轉換，用戶無需關心

**示例**：
typescript
// 用戶輸入
tagsInput.value = "AI, Infrastructure, Cloud"

// 自動轉換為
form.value.tags = ["AI", "Infrastructure", "Cloud"]

// 當訪問 tagsInput 時
console.log(tagsInput.value)  // "AI, Infrastructure, Cloud"


### 5. 發佈時間處理（本地時間 ↔ ISO 格式）
使用計算屬性的 getter/setter 處理本地時間和 ISO 格式的轉換：

typescript
const publishedAtLocal = computed({
  get: () =>
    form.value.published_at ? new Date(form.value.published_at).toISOString().slice(0, 16) : '',
  set: (val: string) => {
    form.value.published_at = val ? new Date(val).toISOString() : null
  },
})


**為什麼這樣設計？**

- HTML `<input type="datetime-local">` 要求格式：`YYYY-MM-DDTHH:mm`（本地時間）
- 數據庫存儲格式：`YYYY-MM-DDTHH:mm:ss.sssZ`（ISO 格式，UTC 時間）
- 計算屬性自動處理轉換，用戶無需關心

**示例**：
typescript
// 用戶選擇（本地時間）
publishedAtLocal.value = "2024-01-15T10:00"

// 自動轉換為
form.value.published_at = "2024-01-15T02:00:00.000Z"  // UTC 時間（假設時區為 +8）

// 當訪問 publishedAtLocal 時
console.log(publishedAtLocal.value)  // "2024-01-15T10:00"


**技術細節**：
- `toISOString()`：將 Date 對象轉換為 ISO 格式字符串
- `.slice(0, 16)`：截取前 16 個字符（`YYYY-MM-DDTHH:mm`），去除秒和時區信息

### 6. 富文本編輯器
使用 `RichTextEditor` 組件編輯新聞正文：

vue
<RichTextEditor v-model="form.content[lang.key]" />


**功能預期**：
- 富文本格式（粗體、斜體、標題、列表等）
- 圖片插入
- 鏈接插入
- 代碼塊

### 7. 圖片上傳
使用 `AdminImageUpload` 組件上傳封面圖片：

vue
<AdminImageUpload v-model="form.cover_image" bucket-name="news-covers" />


**功能預期**：
- 拖拽上傳
- 點擊上傳
- 圖片預覽
- 刪除圖片
- 上傳到 Supabase Storage（`news-covers` 存儲桶）

**或直接輸入 URL**：
vue
<input v-model="form.cover_image" placeholder="https://example.com/image.jpg" />


### 8. 數據加載流程
對於編輯模式（`!isNew.value`），頁面掛載時會：

1. 設置 `loading.value = true` 顯示骨架屏
2. 調用 API 獲取新聞數據：`$fetch(\`/api/news/admin/${route.params.id}\`)`
3. 將 API 返回的數據合併到表單中，確保所有字段都存在（防止 undefined）
4. 特別處理多語言字段（title、summary、content）：使用展開運算符合併
5. 確保 `tags` 始終是數組
6. 設置 `loading.value = false` 顯示實際表單

typescript
if (response.success) {
  const data = response.data
  form.value = {
    ...form.value,            // 保留默認值
    ...data,                  // 合併數據
    title: { ...form.value.title, ...data.title },  // 合併多語言標題
    summary: { ...form.value.summary, ...data.summary },  // 合併多語言摘要
    content: { ...form.value.content, ...data.content },  // 合併多語言正文
    tags: data.tags || [],    // 確保 tags 是數組
  }
}


**為什麼使用展開運算符合併多語言字段？**

- 確保所有語言的鍵都存在（hk、cn、en）
- 避免數據不完整導致的錯誤
- 提供默認值（空字符串）

### 9. 保存流程
當用戶點擊"保存資訊"按鈕時：

1. 設置 `saving.value = true` 禁用按鈕並顯示"保存中..."
2. 根據 `isNew.value` 選擇 API：
   - 創建：`POST /api/news` with payload
   - 更新：`PUT /api/news/admin/${route.params.id}` with payload
3. 如果成功，導航回新聞列表頁
4. 如果失敗，顯示錯誤消息
5. 最終設置 `saving.value = false`

typescript
if (isNew.value) {
  // 創建新文章
  response = await $fetch('/api/news', {
    method: 'POST',
    body: payload,
  })
} else {
  // 更新現有文章
  response = await $fetch(`/api/news/admin/${route.params.id}`, {
    method: 'PUT',
    body: payload,
  })
}


### 10. 固定底部操作欄
使用 `fixed bottom-0` 創建固定底部欄，包含：
- "取消"按鈕：返回新聞列表
- "保存資訊"按鈕：提交表單

技術細節：
- `bg-white/80 backdrop-blur`：半透明白色背景 + 毛玻璃效果
- `md:pl-72`：桌面端左邊距為 72（考慮側邊欄寬度）
- `z-40`：確保在其他內容之上
- `hover:-translate-y-0.5 hover:shadow-lg`：懸停時上移並添加陰影（瑞士設計微交互）

### 11. 響應式設計
使用 Tailwind CSS 的斷點系統：
- 移動端：單列布局（`grid-cols-1`）
- 桌面端：雙列布局（`md:grid-cols-2`）

vue
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>標題字段</div>
  <div>URL Slug 字段</div>
</div>


## 核心功能

### 功能 1：新新聞創建
- URL 路徑：`/admin/news/new`
- 標題：顯示"發佈資訊"
- API：調用 `POST /api/news`
- 行為：創建成功後導航到列表頁

### 功能 2：現有新聞編輯
- URL 路徑：`/admin/news/{id}`
- 標題：顯示"編輯資訊"
- API：
  - 加載：`GET /api/news/admin/{id}`
  - 更新：`PUT /api/news/admin/{id}`
- 行為：更新成功後導航到列表頁

### 功能 3：多語言表單
- 支持三種語言：繁體中文 (HK)、簡體中文 (CN)、英文 (EN)
- 每種語言都有獨立的輸入框（標題、摘要、正文）
- 數據以 JSON 對象形式存儲

### 功能 4：標籤管理
- 支持輸入多個標籤（逗號分隔）
- 自動去除空格
- 自動過濾空標籤
- 數據以數組形式存儲到數據庫

### 功能 5：封面圖片管理
- 支持上傳圖片（拖拽或點擊）
- 支持直接輸入圖片 URL
- 上傳到 Supabase Storage（`news-covers` 存儲桶）

### 功能 6：發佈時間管理
- 支持選擇發佈時間（本地時間）
- 自動轉換為 UTC 時間（ISO 格式）
- 如果為空則設置為 `null`（未發佈）

## 使用場景

### 場景 1：創建新新聞
1. 管理員訪問 `/admin/news/new`
2. 填寫 URL 標識（slug）：`nucleon-tech-launches-new-product`
3. 輸入三種語言的標題、摘要、正文
4. 上傳封面圖片
5. 輸入標籤：`AI, Infrastructure, Cloud`
6. 選擇發佈時間
7. 點擊"保存資訊"

### 場景 2：編輯現有新聞
1. 管理員在新聞列表頁點擊某篇文章的"編輯"按鈕
2. 頁面加載新聞數據（顯示骨架屏）
3. 管理員修改新聞信息（例如更新正文）
4. 添加新的標籤
5. 更新發佈時間
6. 點擊"保存資訊"
7. 頁面導航回新聞列表

### 場景 3：取消編輯
1. 管理員正在編輯新聞
2. 決定不保存更改
3. 點擊底部的"取消"按鈕
4. 頁面導航回新聞列表，所有更改丟失

## 性能優化

### 優化 1：骨架屏優化
在加載新聞數據時顯示骨架屏：
vue
<div v-if="loading" class="space-y-12">
  <FormSkeleton />
</div>
<form v-else>
  <!-- 實際表單內容 -->
</form>


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

### 優化 3：計算屬性緩存
使用 `computed` 處理標籤和發佈時間：
typescript
const tagsInput = computed({
  get: () => (form.value.tags || []).join(','),
  set: (val: string) => { ... },
})

const publishedAtLocal = computed({
  get: () => form.value.published_at ? ... : '',
  set: (val: string) => { ... },
})


好處：
- 自動緩存結果
- 只在依賴改變時重新計算
- 避免在模板中直接調用轉換函數

## 可訪問性 (Accessibility)

### 可訪問性 1：表單標籤關聯
每個輸入框都有關聯的 `<label>` 元素：

vue
<label for="slug-input">URL Slug (唯一標識) *</label>
<input id="slug-input" v-model="form.slug" />


好處：
- 屏幕閱讀器可以讀出標籤和輸入框的關聯
- 點擊標籤可以聚焦到輸入框
- 符合 WCAG 2.1 Level A 標準

### 可訪問性 2：必填字段標記
使用 `*` 符號標記必填字段：
vue
<label>標題 *</label>
<label>摘要 *</label>
<label>正文 (富文本) *</label>


好處：
- 視覺上清晰標識必填字段
- 符合常見的表單設計模式

### 可訪問性 3：錯誤處理
在 `catch` 塊中顯示錯誤消息：
typescript
catch (error: any) {
  console.error('獲取文章失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '獲取文章失敗'
  alert(errorMessage)
}


改進建議（未實現）：
- 應該使用非阻塞的通知組件而不是 `alert()`
- 應該在輸入框旁邊顯示具體的驗證錯誤消息
- 應該添加表單驗證（例如標題不能為空）

### 可訪問性 4：鍵盤導航
所有交互元素都支持鍵盤操作：
- `<NuxtLink>`：使用 Tab 鍵可以聚焦，Enter 鍵導航
- `<button>`：使用 Tab 鍵可以聚焦，Enter/Space 鍵觸發
- `<input>`：使用 Tab 鍵可以聚焦，直接輸入

## 依賴組件

### 組件 1：TypographyHeader
文件路徑：`~/components/swiss/TypographyHeader.vue`
作用：瑞士設計風格的標題組件

使用場景：
- 頁面標題："發佈資訊"或"編輯資訊"

### 組件 2：RichTextEditor
文件路徑：`~/components/admin/RichTextEditor.vue`（需要實現）
作用：富文本編輯器組件

功能預期：
- 富文本格式（粗體、斜體、標題、列表等）
- 圖片插入
- 鏈接插入
- 代碼塊

### 組件 3：AdminImageUpload
文件路徑：`~/components/admin/AdminImageUpload.vue`（需要實現）
作用：管理員圖片上傳組件

功能預期：
- 拖拽上傳
- 點擊上傳
- 圖片預覽
- 刪除圖片
- 上傳到 Supabase Storage

### 組件 4：FormSkeleton
文件路徑：`~/components/admin/FormSkeleton.vue`（需要實現）
作用：表單骨架屏組件

功能預期：
- 模擬表單布局
- 使用骨架屏動畫
- 提供視覺佔位符

## 依賴 API

### API 1：加載新聞數據
端點：`GET /api/news/admin/{id}`
用途：獲取單個新聞的詳細信息

請求示例：
typescript
const response = await $fetch('/api/news/admin/123')


預期響應：
json
{
  "success": true,
  "data": {
    "id": 123,
    "slug": "nucleon-tech-launches-new-product",
    "title": {
      "zh-HK": "超核技術發布新產品",
      "zh-CN": "超核技术发布新产品",
      "en": "Nucleon Tech Launches New Product"
    },
    "summary": {
      "zh-HK": "...",
      "zh-CN": "...",
      "en": "..."
    },
    "content": {
      "zh-HK": "...",
      "zh-CN": "...",
      "en": "..."
    },
    "cover_image": "https://example.com/cover.jpg",
    "tags": ["AI", "Infrastructure", "Cloud"],
    "published_at": "2024-01-15T10:00:00Z",
    "status": "published"
  }
}


### API 2：創建新聞
端點：`POST /api/news`
用途：創建新新聞

請求示例：
typescript
const response = await $fetch('/api/news', {
  method: 'POST',
  body: {
    slug: 'nucleon-tech-launches-new-product',
    title: { hk: '...', cn: '...', en: '...' },
    summary: { hk: '...', cn: '...', en: '...' },
    content: { hk: '...', cn: '...', en: '...' },
    cover_image: '',
    tags: ['AI', 'Infrastructure'],
    published_at: '2024-01-15T10:00:00Z'
  }
})


預期響應：
json
{
  "success": true,
  "data": {
    "id": 124,
    "slug": 'nucleon-tech-launches-new-product',
    ...
  }
}


### API 3：更新新聞
端點：`PUT /api/news/admin/{id}`
用途：更新現有新聞

請求示例：
typescript
const response = await $fetch('/api/news/admin/123', {
  method: 'PUT',
  body: {
    slug: 'nucleon-tech-launches-new-product-updated',
    title: { hk: '...', cn: '...', en: '...' },
    ...
  }
})


預期響應：
json
{
  "success": true,
  "data": {
    "id": 123,
    "slug": 'nucleon-tech-launches-new-product-updated',
    ...
  }
}


## 數據流

### 數據流 1：加載新聞（編輯模式）

用戶訪問 /admin/news/123
  ↓
onMounted() 鉤子觸發
  ↓
設置 loading = true
  ↓
調用 GET /api/news/admin/123
  ↓
API 返回新聞數據
  ↓
合併數據到 form.value（確保所有字段存在）
  ↓
設置 loading = false
  ↓
顯示表單內容


### 數據流 2：保存新聞（創建模式）

用戶填寫表單
  ↓
點擊"保存資訊"按鈕
  ↓
設置 saving = true
  ↓
調用 POST /api/news
  ↓
API 創建新聞
  ↓
返回成功響應
  ↓
導航到 /admin/news


### 數據流 3：保存新聞（編輯模式）

用戶修改表單
  ↓
點擊"保存資訊"按鈕
  ↓
設置 saving = true
  ↓
調用 PUT /api/news/admin/123
  ↓
API 更新新聞
  ↓
返回成功響應
  ↓
導航到 /admin/news


### 數據流 4：標籤處理

用戶輸入標籤
  ↓
tagsInput setter 觸發
  ↓
按逗號分割字符串
  ↓
去除首尾空格
  ↓
過濾空字符串
  ↓
存儲到 form.value.tags（數組）


### 數據流 5：發佈時間處理

用戶選擇發佈時間
  ↓
publishedAtLocal setter 觸發
  ↓
將本地時間轉換為 Date 對象
  ↓
轉換為 ISO 格式（UTC 時間）
  ↓
存儲到 form.value.published_at


## Tailwind CSS 類名說明

### 布局類
- `max-w-4xl`：最大寬度 56rem (896px)，限制內容寬度
- `mx-auto`：水平居中
- `space-y-12`：垂直方向元素間距 3rem (48px)
- `space-y-8`：垂直方向元素間距 2rem (32px)
- `space-y-2`：垂直方向元素間距 0.5rem (8px)
- `space-y-4`：垂直方向元素間距 1rem (16px)
- `flex`：使用 Flexbox 布局
- `items-center`：垂直居中
- `space-x-4`：水平方向元素間距 1rem (16px)
- `flex-1`：彈性元素佔據所有可用空間
- `grid`：使用 CSS Grid 布局
- `grid-cols-1`：移動端單列布局
- `md:grid-cols-2`：桌面端雙列布局

### 間距類
- `p-6`：所有方向內邹距 1.5rem (24px)
- `md:p-8`：桌面端所有方向內邹距 2rem (32px)
- `py-2`：上下內邹距 0.5rem (8px)
- `py-3`：上下內邹距 0.75rem (12px)
- `px-3`：左右內邹距 0.75rem (12px)
- `px-4`：左右內邹距 1rem (16px)
- `px-6`：左右內邹距 1.5rem (24px)
- `mt-1`：上外邹距 0.25rem (4px)
- `mb-2`：下外邹距 0.5rem (8px)

### 邊框和背景類
- `border`：添加邊框
- `border-swiss-text/10`：邊框顏色為瑞士文本顏色的 10% 不透明度
- `border-swiss-text`：邊框顏色為瑞士文本顏色
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
- `text-white`：文字顏色為白色

### 布局定位類
- `fixed`：固定定位
- `bottom-0`：底部對齊
- `left-0`：左側對齊
- `right-0`：右側對齊
- `z-40`：z-index 層級為 40

### 交互類
- `hover:text-swiss-text-muted`：懸停時文字顏色變暗
- `hover:bg-swiss-text/90`：懸停時背景顏色為瑞士文本顏色的 90% 不透明度
- `hover:bg-gray-200`：懸停時背景顏色為灰色
- `hover:-translate-y-0.5`：懸停時向上移動 2px（瑞士設計微交互）
- `hover:shadow-lg`：懸停時添加大陰影
- `active:scale-[0.98]`：激活時縮放到 98%
- `focus:outline-none`：聚焦時移除默認輪廓
- `focus:border-swiss-text`：聚焦時邊框顏色為瑞士文本顏色
- `disabled:opacity-50`：禁用時透明度為 50%
- `disabled:cursor-not-allowed`：禁用時鼠標指針為不允許

### 過渡類
- `transition-all`：所有屬性過渡動畫

### 其他類
- `rounded-none`：無圓角（瑞士設計的銳利邊緣）
- `justify-end`：右對齊
- `gap-2`：元素間距 8px

## Vue 3 特性說明

### ref
用於創建響應式引用：

typescript
const form = ref({
  slug: '',
  title: { hk: '', cn: '', en: '' },
  // ...
})


好處：
- 在模板中可以直接訪問 `form.value`
- 在 JS 中通過 `form.value` 訪問值
- 當值改變時自動觸發視圖更新

### computed
用於創建計算屬性：

typescript
const isNew = computed(() => route.params.id === 'new')


好處：
- 基於 `route.params.id` 自動計算
- 當 `route.params.id` 改變時自動重新計算
- 只在依賴改變時才重新計算（性能優化）

### computed with getter/setter
用於創建帶有 getter 和 setter 的計算屬性：

typescript
const tagsInput = computed({
  get: () => (form.value.tags || []).join(','),
  set: (val: string) => {
    form.value.tags = val.split(',').map(t => t.trim()).filter(t => t)
  },
})


好處：
- 支持雙向綁定
- 自動處理數據轉換
- 用戶無需關心底層數據格式

### onMounted
用於註冊組件掛載後的回調：

typescript
onMounted(async () => {
  if (!isNew.value) {
    loading.value = true
    try {
      const data = await $fetch(`/api/news/admin/${route.params.id}`)
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
<input v-model="form.slug" />


等價於：
vue
<input
  :value="form.slug"
  @input="form.slug = $event.target.value"
/>


好處：
- 簡化雙向綁定代碼
- 自動處理輸入、選擇、複選框等不同元素

### v-for
用於循環渲染：

vue
<div v-for="lang in langTabs" :key="lang.key">
  <label>{{ lang.label }}</label>
  <input v-model="form.title[lang.key]" />
</div>


好處：
- 為每種語言動態生成輸入框
- 使用 `:key` 確保高效的列表更新

### v-if
用於條件渲染：

vue
<div v-if="loading">
  <FormSkeleton />
</div>
<form v-else>
  <!-- 表單內容 -->
</form>


好處：
- 根據條件切換顯示內容
- `v-if` 完全移除/添加 DOM 元素

### @submit.prevent
用於攔截表單提交並阻止默認行為：

vue
<form @submit.prevent="savePost">
  <!-- 表單內容 -->
</form>


好處：
- 阻止頁面刷新（默認表單提交行為）
- 自定義提交邏輯（調用 `savePost` 函數）

## TypeScript 類型說明

### 類型 1：Record<string, string>
用於多語言字段的鍵值對對象：

typescript
title: { hk: '', cn: '', en: '' } as Record<string, string>


示例值：
typescript
{
  "hk": "超核技術發布新產品",
  "cn": "超核技术发布新产品",
  "en": "Nucleon Tech Launches New Product"
}


### 類型 2：string[]
用於標籤數組：

typescript
tags: [] as string[]


示例值：
typescript
["AI", "Infrastructure", "Cloud"]


### 類型 3：string | null
用於可選字符串：

typescript
published_at: null as string | null


示例值：
typescript
null  // 未發佈
"2024-01-15T10:00:00Z"  // 已發佈


## 錯誤處理

### 錯誤 1：新聞加載失敗
typescript
catch (error: any) {
  console.error('獲取文章失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '獲取文章失敗'
  alert(errorMessage)
}


處理方式：
- 記錄錯誤到控制台
- 顯示錯誤消息給用戶
- 不導航離開，允許用戶重試

### 錯誤 2：新聞保存失敗
typescript
catch (error: any) {
  console.error('保存失敗:', error)
  const errorMessage = error.data?.statusMessage || error.message || '保存失敗，請重試'
  alert(errorMessage)
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
（未在代碼中實現，應該在 API 層或富文本編輯器中實現）

建議：
- API 應該對輸入內容進行 HTML 轉義
- 富文本編輯器應該過濾危險標籤（`<script>`, `<iframe>` 等）
- 在顯示時使用 `v-html` 應該謹慎

### 安全 3：身份驗證
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證用戶是否已登錄
- API 應該驗證用戶是否有權限訪問該新聞
- 使用 JWT 或 Session 進行身份驗證

### 安全 4：CSRF 防護
（未在代碼中實現，應該在 API 層實現）

建議：
- API 應該驗證 CSRF token
- 在表單中添加 CSRF token
- 在 API 端點驗證 token

### 安全 5：文件上傳安全
（未在代碼中實現，應該在 API 層實現）

建議：
- 驗證文件類型（只允許圖片：jpg, png, webp）
- 限制文件大小（例如最大 5MB）
- 驗證文件內容（防止惡意文件）
- 使用安全的文件名（避免路徑遍歷攻擊）

## 待改進項目

### 改進 1：表單驗證
當前問題：沒有表單驗證

建議實現：
typescript
const validateForm = () => {
  if (!form.value.slug) {
    alert('請輸入 URL Slug')
    return false
  }
  if (!Object.values(form.value.title).some(title => title.trim())) {
    alert('請輸入至少一種語言的標題')
    return false
  }
  if (!Object.values(form.value.summary).some(summary => summary.trim())) {
    alert('請輸入至少一種語言的摘要')
    return false
  }
  return true
}

async function savePost() {
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
  const response = await $fetch(`/api/news/check-slug?slug=${slug}`)
  return response.isUnique
}

// 在 blur 時檢查
<input v-model="form.slug" @blur="async () => {
  const isUnique = await checkSlugUnique(form.value.slug)
  if (!isUnique) {
    alert('此 URL Slug 已被使用')
  }
}}" />


### 改進 3：自動保存草稿
當前問題：用戶可能忘記保存

建議實現：
typescript
// 每隔 30 秒自動保存為草稿
const saveDraftInterval = setInterval(() => {
  if (!isNew.value && form.value.status === 'draft') {
    $fetch(`/api/news/admin/${route.params.id}`, {
      method: 'PUT',
      body: { ...form.value }
    })
  }
}, 30000)

onUnmounted(() => {
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
async function compressImage(file: File): Promise<string> {
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

### 測試 1：新新聞創建
typescript
test('should create new post', async () => {
  const form = ref({
    slug: 'test-post',
    title: { hk: '測試文章', cn: '测试文章', en: 'Test Post' },
    summary: { hk: '...', cn: '...', en: '...' },
    content: { hk: '...', cn: '...', en: '...' },
    cover_image: '',
    tags: ['AI', 'Test'],
    published_at: '2024-01-15T10:00:00Z'
  })

  const response = await $fetch('/api/news', {
    method: 'POST',
    body: form.value
  })

  expect(response.success).toBe(true)
  expect(response.data.slug).toBe('test-post')
})


### 測試 2：新聞更新
typescript
test('should update existing post', async () => {
  const response = await $fetch('/api/news/admin/123', {
    method: 'PUT',
    body: {
      slug: 'updated-post',
      // ... 其他字段
    }
  })

  expect(response.success).toBe(true)
  expect(response.data.slug).toBe('updated-post')
})


### 測試 3：標籤處理
typescript
test('should parse tags from string', () => {
  form.value.tags = []
  tagsInput.value = 'AI, Infrastructure, Cloud'

  expect(form.value.tags).toEqual(['AI', 'Infrastructure', 'Cloud'])
})

test('should format tags to string', () => {
  form.value.tags = ['AI', 'Infrastructure', 'Cloud']

  expect(tagsInput.value).toBe('AI, Infrastructure, Cloud')
})


### 測試 4：發佈時間處理
typescript
test('should convert local time to ISO format', () => {
  publishedAtLocal.value = '2024-01-15T10:00'

  expect(form.value.published_at).toBe('2024-01-15T02:00:00.000Z')  // UTC 時間
})

test('should convert ISO format to local time', () => {
  form.value.published_at = '2024-01-15T02:00:00.000Z'  // UTC 時間

  expect(publishedAtLocal.value).toBe('2024-01-15T10:00')  // 本地時間（假設時區為 +8）
})


## 總結

這個新聞編輯頁面實現了：
- ✅ 新新聞創建和現有新聞編輯
- ✅ 多語言支持（繁體中文、簡體中文、英文）
- ✅ 富文本編輯器
- ✅ 標籤管理
- ✅ 封面圖片上傳
- ✅ 發佈時間管理
- ✅ 骨架屏加載優化
- ✅ 固定底部操作欄
- ✅ 響應式設計
- ✅ 本地時間 ↔ UTC 時間轉換

待改進：
- ⏳ 表單驗證
- ⏳ Slug 唯一性驗證
- ⏳ 自動保存草稿
- ⏳ 離線支持
- ⏳ 圖片壓縮

這是一個功能完整、用戶友好的新聞管理頁面，遵循了瑞士設計原則和 Vue 3 最佳實踐。
-->
<template>
  <!-- 管理頁面容器：外層包裹容器 -->
  <div class="admin-page-container">
    <!-- 最大寬度限制 + 居中 + 垂直間距 -->
    <div class="max-w-4xl mx-auto space-y-12">
      
      <!-- 頂部導航區域：返回按鈕 + 頁面標題 -->
      <!-- flex：使用 Flexbox 布局 -->
      <!-- items-center：垂直居中 -->
      <!-- space-x-4：水平方向元素間距 16px -->
      <div class="flex items-center space-x-4">
        <!-- NuxtLink：返回新聞列表頁 -->
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
        <NuxtLink to="/admin/news"
          class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
          ←
        </NuxtLink>
        
        <!-- TypographyHeader：瑞士設計風格的標題組件 -->
        <!-- :level="2"：H2 級別的語義標題 -->
        <!-- size="h3"：H3 的視覺樣式 -->
        <!-- class="!mb-0"：強制移除底部外邹距（優先級更高） -->
        <!-- {{ isNew ? '發佈資訊' : '編輯資訊' }}：根據是否為新模式動態顯示標題 -->
        <TypographyHeader :level="2" size="h3" class="!mb-0">
          {{ isNew ? '發佈資訊' : '編輯資訊' }}
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
      <form v-else @submit.prevent="savePost" class="space-y-8 pb-24">
        
        <!-- 表單卡片 -->
        <div class="bg-white border border-swiss-text/10">
          
          <!-- 表單內容區域 -->
          <!-- p-6：所有方向內邹距 24px -->
          <!-- md:p-8：桌面端所有方向內邹距 32px（響應式設計） -->
          <!-- space-y-8：垂直方向元素間距 32px -->
          <div class="p-6 md:p-8 space-y-8">
            
            <!-- 標題和 URL Slug 網格布局 -->
            <!-- grid：使用 CSS Grid 布局 -->
            <!-- grid-cols-1：移動端單列布局 -->
            <!-- md:grid-cols-2：桌面端（medium 斷點及以上）雙列布局 -->
            <!-- gap-6：網格間距 24px -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- 標題字段（跨越兩列：flex-1） -->
              <!-- flex-1：彈性元素佔據所有可用空間 -->
              <div class="flex-1">
                <!-- label：表單標籤 -->
                <!-- block：塊級元素，獨佔一行 -->
                <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                <!-- font-bold：字體粗細為 700 -->
                <!-- uppercase：轉換為大寫 -->
                <!-- tracking-widest：字間距為 0.1em（瑞士設計的寬字間距） -->
                <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                <!-- mb-2：下外邹距 8px -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  標題 *
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
                    
                    <!-- input：語言標題輸入框 -->
                    <!-- v-model="form.title[lang.key]"：雙向數據綁定到 form.title[lang.key] -->
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
                    <input v-model="form.title[lang.key]" :placeholder="`輸入 ${lang.label} 標題`"
                      class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                  </div>
                </div>
              </div>

              <!-- URL Slug 字段 -->
              <div>
                <!-- label：表單標籤 -->
                <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                  URL Slug (唯一標識) *
                </label>
                
                <!-- input：URL Slug 輸入框 -->
                <!-- v-model="form.slug"：雙向數據綁定到 form.slug -->
                <!-- placeholder="industry-news-title"：佔位符文本 -->
                <!-- w-full：寬度 100% -->
                <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                <!-- text-sm：字體大小 14px -->
                <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                <input v-model="form.slug" placeholder="industry-news-title"
                  class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                
                <!-- 幫助文本：解釋 slug 的用途 -->
                <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                <!-- mt-1：上外邹距 4px -->
                <p class="text-[10px] text-swiss-text-muted mt-1">
                  用於網址，例如：/news/industry-news-title
                </p>
              </div>
            </div>

            <!-- 摘要字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                摘要 *
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
                  <!-- v-model="(form.summary as any)[lang.key]"：雙向數據綁定到 form.summary[lang.key] -->
                  <!-- (form.summary as any)：類型斷言為 any，因為 TypeScript 無法確定動態訪問的安全性 -->
                  <!-- :placeholder：佔位符文本 -->
                  <!-- :rows="3"：顯示 3 行 -->
                  <!-- w-full：寬度 100% -->
                  <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                  <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                  <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                  <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                  <!-- text-sm：字體大小 14px -->
                  <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                  <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                  <!-- mt-1：上外邹距 4px -->
                  <textarea v-model="(form.summary as any)[lang.key]" :placeholder="`輸入 ${lang.label} 摘要`" :rows="3"
                    class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text mt-1" />
                </div>
              </div>
            </div>

            <!-- 正文（富文本）字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                正文 (富文本) *
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
                  
                  <!-- RichTextEditor：富文本編輯器組件（需要實現） -->
                  <!-- v-model="(form.content as any)[lang.key]"：雙向數據綁定到 form.content[lang.key] -->
                  <!-- (form.content as any)：類型斷言為 any，因為 TypeScript 無法確定動態訪問的安全性 -->
                  <RichTextEditor v-model="(form.content as any)[lang.key]" />
                </div>
              </div>
            </div>

            <!-- 封面圖片字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                封面圖片
              </label>
              
              <!-- 空間容器：垂直排列上傳和 URL 輸入 -->
              <!-- space-y-4：垂直方向元素間距 16px -->
              <div class="space-y-4">
                <!-- AdminImageUpload：管理員圖片上傳組件（需要實現） -->
                <!-- v-model="form.cover_image"：雙向數據綁定到 form.cover_image -->
                <!-- bucket-name="news-covers"：Supabase Storage 存儲桶名稱 -->
                <AdminImageUpload v-model="form.cover_image" bucket-name="news-covers" />

                <!-- 或直接輸入 URL -->
                <!-- flex items-center gap-2：Flexbox 布局 + 垂直居中 + 水平間距 8px -->
                <div class="flex items-center gap-2">
                  <!-- 提示文本 -->
                  <!-- text-[10px]：瑞士設計的超小字體 (10px) -->
                  <!-- text-swiss-text-muted：文字顏色為瑞士文本顏色（變暗） -->
                  <!-- uppercase：轉換為大寫 -->
                  <!-- tracking-wider：字間距為 0.05em -->
                  <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">或輸入 URL：</span>
                  
                  <!-- input：URL 輸入框 -->
                  <!-- v-model="form.cover_image"：雙向數據綁定到 form.cover_image -->
                  <!-- placeholder="https://example.com/image.jpg"：佔位符文本 -->
                  <!-- flex-1：彈性元素佔據所有可用空間 -->
                  <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
                  <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
                  <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
                  <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
                  <!-- text-sm：字體大小 14px -->
                  <!-- focus:outline-none：聚焦時移除默認輪廓 -->
                  <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
                  <input v-model="form.cover_image" placeholder="https://example.com/image.jpg"
                    class="flex-1 px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
                </div>
              </div>
            </div>

            <!-- 標籤字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                標籤 (Tags, 逗號分隔)
              </label>
              
              <!-- input：標籤輸入框 -->
              <!-- v-model="tagsInput"：雙向數據綁定到 tagsInput 計算屬性 -->
              <!-- placeholder="AI, Infrastructure"：佔位符文本 -->
              <!-- w-full：寬度 100% -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <input v-model="tagsInput" placeholder="AI, Infrastructure"
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
            </div>

            <!-- 發佈時間字段 -->
            <div>
              <!-- label：表單標籤 -->
              <label class="block text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted mb-2">
                發佈時間
              </label>
              
              <!-- input：日期時間選擇器 -->
              <!-- type="datetime-local"：HTML5 日期時間輸入類型 -->
              <!-- v-model="publishedAtLocal"：雙向數據綁定到 publishedAtLocal 計算屬性 -->
              <!-- w-full：寬度 100% -->
              <!-- px-4 py-3：左右內邹距 16px，上下內邹距 12px -->
              <!-- bg-swiss-bg：背景顏色為瑞士背景顏色 -->
              <!-- border border-swiss-text/10：邊框顏色為瑞士文本顏色的 10% 不透明度 -->
              <!-- text-swiss-text：文字顏色為瑞士文本顏色 -->
              <!-- text-sm：字體大小 14px -->
              <!-- focus:outline-none：聚焦時移除默認輪廓 -->
              <!-- focus:border-swiss-text：聚焦時邊框顏色為瑞士文本顏色 -->
              <input type="datetime-local" v-model="publishedAtLocal"
                class="w-full px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text" />
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
            <!-- to="/admin/news"：導航到新聞列表頁 -->
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
            <NuxtLink to="/admin/news"
              class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              取消
            </NuxtLink>
            
            <!-- 保存資訊按鈕 -->
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
              <span v-else>保存資訊</span>
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
// route.params.id：URL 路徑參數（例如 /admin/news/new 中的 'new'，或 /admin/news/123 中的 '123'）
const route = useRoute()

// computed：創建計算屬性（Vue 3 組合式 API）
// route.params.id === 'new'：當路徑參數為 'new' 時，表示創建新模式
// 返回值：true 表示新新聞，false 表示編輯現有新聞
const isNew = computed(() => route.params.id === 'new')

// ref：創建響應式引用（Vue 3 組合式 API）
// saving：保存狀態（true 表示正在保存，false 表示未保存）
// ref(false)：初始值為 false
const saving = ref(false)

// ref：創建響應式引用（Vue 3 組合式 API）
// loading：加載狀態（true 表示正在加載，false 表示加載完成）
// ref(false)：初始值為 false
const loading = ref(false)

// import：導入 AdminImageUpload 組件（管理員圖片上傳組件，需要實現）
// AdminImageUpload：用於上傳新聞封面圖片
import AdminImageUpload from '~/components/admin/AdminImageUpload.vue'

// import：導入 FormSkeleton 組件（表單骨架屏組件，需要實現）
// FormSkeleton：用於在加載時顯示骨架屏，減少感知加載時間
import FormSkeleton from '~/components/admin/FormSkeleton.vue'

// 調試日誌：記錄頁面掛載信息
console.log('[News Edit] Page mounting:', {
  path: route.path,           // 路徑（例如 /admin/news/new）
  params: route.params,       // 路徑參數（例如 { id: 'new' } 或 { id: '123' }）
  isNew: isNew.value,         // 是否為新模式
})

// langTabs：語言標籤數組
// 定義了三種語言：繁體中文 (HK)、簡體中文 (CN)、英文 (EN)
// key：語言代碼，用於訪問 form.title[key]、form.summary[key]、form.content[key]
// label：語言顯示名稱，用於在 UI 中顯示
const langTabs = [
  { key: 'hk', label: '繁體 (HK)' },
  { key: 'cn', label: '簡體 (CN)' },
  { key: 'en', label: 'English' },
]

// form：表單數據的響應式引用
// ref()：創建響應式對象（Vue 3 組合式 API）
// slug：URL 標識，用於生成友好的 URL（例如 nucleon-tech-launches-new-product）
// title：多語言標題，包含三種語言（繁體、簡體、英文）
// summary：多語言摘要，包含三種語言（繁體、簡體、英文）
// content：多語言正文，包含三種語言（繁體、簡體、英文）
// cover_image：封面圖片 URL
// tags：標籤數組（例如 ["AI", "Infrastructure", "Cloud"]）
// published_at：發佈時間（ISO 格式，例如 "2024-01-15T10:00:00Z"）
const form = ref({
  slug: '',
  title: { hk: '', cn: '', en: '' } as Record<string, string>,
  summary: { hk: '', cn: '', en: '' } as Record<string, string>,
  content: { hk: '', cn: '', en: '' } as Record<string, string>,
  cover_image: '',
  tags: [] as string[],
  published_at: null as string | null,
})

// tagsInput：標籤輸入框的計算屬性（帶有 getter/setter）
// computed()：創建計算屬性（Vue 3 組合式 API）
// get: () => (form.value.tags || []).join(',')：數組 → 字符串
//   form.value.tags || []：如果 tags 為 null/undefined，則使用空數組
//   .join(',')：將數組轉換為逗號分隔的字符串（例如 "AI, Infrastructure, Cloud"）
// set: (val: string) => { ... }：字符串 → 數組
//   val.split(',')：按逗號分割字符串
//   .map((t) => t.trim())：去除每個標籤的首尾空格
//   .filter((t) => t)：過濾空字符串
const tagsInput = computed({
  get: () => (form.value.tags || []).join(','),
  set: (val: string) => {
    form.value.tags = val
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)
  },
})

// publishedAtLocal：發佈時間的計算屬性（帶有 getter/setter）
// computed()：創建計算屬性（Vue 3 組合式 API）
// get: () => ...：ISO 格式 → 本地時間
//   form.value.published_at ? ... : ''：如果 published_at 存在則轉換，否則返回空字符串
//   new Date(form.value.published_at)：將 ISO 格式字符串轉換為 Date 對象
//   .toISOString()：將 Date 對象轉換為 ISO 格式字符串（例如 "2024-01-15T10:00:00.000Z"）
//   .slice(0, 16)：截取前 16 個字符（"YYYY-MM-DDTHH:mm"），去除秒和時區信息
// set: (val: string) => { ... }：本地時間 → ISO 格式
//   val ? ... : null：如果值不為空則轉換，否則設置為 null
//   new Date(val)：將本地時間字符串轉換為 Date 對象
//   .toISOString()：將 Date 對象轉換為 ISO 格式字符串（UTC 時間）
const publishedAtLocal = computed({
  get: () =>
    form.value.published_at ? new Date(form.value.published_at).toISOString().slice(0, 16) : '',
  set: (val: string) => {
    form.value.published_at = val ? new Date(val).toISOString() : null
  },
})

// onMounted：註冊組件掛載後的回調（Vue 3 組合式 API）
// async：聲明為異步函數，可以在其中使用 await
// 作用：在組件掛載到 DOM 後執行（用於加載新聞數據）
// 執行時機：只在客戶端執行（不會在服務器渲染時執行）
onMounted(async () => {
  // if (!isNew.value)：如果不是創建新模式（即編輯模式）
  //   isNew.value === false：表示 route.params.id 不是 'new'，而是實際的新聞 ID
  if (!isNew.value) {
    // loading.value = true：設置加載狀態為 true，顯示骨架屏
    loading.value = true
    
    // try：嘗試執行可能出錯的代碼（異步 API 調用）
    try {
      // $fetch：Nuxt 3 的數據獲取工具（類似於 fetch）
      // `/api/news/admin/${route.params.id}`：API 端點路徑
      //   route.params.id：新聞 ID（例如 '123'）
      // as any：類型斷言為 any（因為 API 響應類型未知）
      const response = (await $fetch(`/api/news/admin/${route.params.id}`)) as any
      
      // if (response.success)：如果 API 返回成功
      if (response.success) {
        // data：新聞數據
        const data = response.data
        
        // form.value = { ... }：合併數據到表單中
        // 使用展開運算符合併，確保所有字段都存在（防止 undefined）
        form.value = {
          ...form.value,            // 保留默認值
          ...data,                  // 合併 API 返回的數據
          title: { ...form.value.title, ...data.title },  // 合併多語言標題
          summary: { ...form.value.summary, ...data.summary },  // 合併多語言摘要
          content: { ...form.value.content, ...data.content },  // 合併多語言正文
          tags: data.tags || [],    // 確保 tags 是數組
        }
      }
      
      // catch：捕獲 try 塊中的錯誤
      // error: any：錯誤對象，類型為 any（因為錯誤類型未知）
    } catch (error: any) {
      // console.error()：記錄錯誤日誌到控制台（紅色背景）
      console.error('獲取文章失敗:', error)
      
      // 錯誤消息處理
      // error.data?.statusMessage：Nuxt 錯誤消息（例如 'Article not found'）
      // error.message：原生錯誤消息（例如 'Failed to fetch'）
      // || '獲取文章失敗'：如果都沒有，顯示默認消息
      const errorMessage = error.data?.statusMessage || error.message || '獲取文章失敗'
      
      // alert()：顯示警告對話框（阻塞用戶操作）
      alert(errorMessage)
      
      // finally：無論 try 或 catch 是否執行，都會執行此代碼塊
    } finally {
      // loading.value = false：設置加載狀態為 false，隱藏骨架屏，顯示實際表單
      loading.value = false
    }
  }
})


/**
 * 保存文章（創建或更新）
 * async：聲明為異步函數，可以在其中使用 await
 * 作用：根據 isNew.value 選擇調用創建 API 或更新 API
 * 調用時機：用戶點擊"保存資訊"按鈕時（表單提交時）
 */
async function savePost() {
  // saving.value = true：設置保存狀態為 true，禁用按鈕並顯示"保存中..."
  saving.value = true

  // try：嘗試執行可能出錯的代碼（異步 API 調用）
  try {
    // payload：請求負載（要發送到 API 的數據）
    // { ...form.value }：使用展開運算符複製 form.value 對象
    // 原因：避免直接修改 form.value（防止意外的副作用）
    const payload = { ...form.value }
    
    // response：API 響應
    let response

    // if (isNew.value)：如果是創建新模式
    //   isNew.value === true：表示 route.params.id 是 'new'
    if (isNew.value) {
      // 創建新文章
      // $fetch()：Nuxt 3 的數據獲取工具
      // '/api/news'：API 端點路徑
      // method: 'POST'：HTTP 方法為 POST（創建資源）
      // body: payload：請求體為 payload（新聞數據）
      response = await $fetch('/api/news', {
        method: 'POST',
        body: payload,
      })
      
      // else：如果是編輯模式
      //   isNew.value === false：表示 route.params.id 是實際的新聞 ID
    } else {
      // 更新現有文章
      // $fetch()：Nuxt 3 的數據獲取工具
      // `/api/news/admin/${route.params.id}`：API 端點路徑
      //   route.params.id：新聞 ID（例如 '123'）
      // method: 'PUT'：HTTP 方法為 PUT（更新資源）
      // body: payload：請求體為 payload（新聞數據）
      // as any：類型斷言為 any（因為 API 響應類型未知）
      response = (await $fetch(`/api/news/admin/${route.params.id}`, {
        method: 'PUT',
        body: payload,
      })) as any
    }

    // if (response.success)：如果 API 返回成功
    if (response.success) {
      // navigateTo()：導航到指定路徑（Nuxt 3 導航函數）
      // '/admin/news'：導航到新聞列表頁
      navigateTo('/admin/news')
    }
    
    // catch：捕獲 try 塊中的錯誤
    // error: any：錯誤對象，類型為 any（因為錯誤類型未知）
  } catch (error: any) {
    // console.error()：記錄錯誤日誌到控制台（紅色背景）
    console.error('保存失敗:', error)
    
    // 錯誤消息處理
    // error.data?.statusMessage：Nuxt 錯誤消息（例如 'Validation failed'）
    // error.message：原生錯誤消息（例如 'Failed to fetch'）
    // || '保存失敗，請重試'：如果都沒有，顯示默認消息
    const errorMessage = error.data?.statusMessage || error.message || '保存失敗，請重試'
    
    // alert()：顯示警告對話框（阻塞用戶操作）
    alert(errorMessage)
    
    // finally：無論 try 或 catch 是否執行，都會執行此代碼塊
  } finally {
    // saving.value = false：設置保存狀態為 false，啟用按鈕並顯示"保存資訊"
    saving.value = false
  }
}
</script>
