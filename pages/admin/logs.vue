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
      <select v-model="filterType" class="px-4 py-3 bg-swiss-bg border border-swiss-text/10 text-swiss-text text-sm focus:outline-none focus:border-swiss-text">
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
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
            {{ formatAction(row.action) }}
          </span>
        </template>

        <!-- 自定義資源類型列 -->
        <template #resource_type-data="{ row }">
          <!-- span：資源類型文本 -->
          <!-- text-[10px]：瑞士設計的超小字體 -->
          <!-- text-swiss-text-muted：次要文本顏色 -->
          <!-- uppercase：全大寫 -->
          <!-- tracking-wider：字母間距加寬 -->
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
            {{ formatResourceType(row.resource_type) }}
          </span>
        </template>

        <!-- 自定義詳情列 -->
        <template #details-data="{ row }">
          <!-- div：容器 -->
          <!-- text-sm：小號字體（14px） -->
          <!-- text-swiss-text：主文本顏色 -->
          <!-- max-w-sm：最大寬度 24rem（384px） -->
          <!-- truncate：截斷溢出部分顯示省略號 -->
          <!-- :title：鼠標懸停時顯示完整內容 -->
          <div class="text-sm text-swiss-text truncate max-w-sm" :title="formatDetails(row)">
            {{ formatDetails(row) }}
          </div>
        </template>

        <!-- 自定義時間列 -->
        <template #created_at-data="{ row }">
          <!-- span：時間文本 -->
          <!-- text-[10px]：瑞士設計的超小字體（10px） -->
          <!-- text-swiss-text-muted：次要文本顏色 -->
          <!-- uppercase：全大寫 -->
          <!-- tracking-wider：字母間距加寬 -->
          <span class="text-[10px] text-swiss-text-muted uppercase tracking-wider">
            {{ formatDate(row.created_at) }}
          </span>
        </template>

        <!-- 自定義操作列 -->
        <template #actions-data="{ row }">
          <!-- 容器：水平排列，間距 8px -->
          <!-- flex：使用 Flexbox 布局 -->
          <div class="flex items-center gap-2">
            <!-- 編輯按鈕 -->
            <!-- NuxtLink：鏈接組件 -->
            <!-- :to：根據資源類型動態跳轉 -->
            <!-- 例如：產品 → /admin/products/123 -->
            <!-- 資源類型判斷：
            //   - 'products'：跳轉到產品編輯頁面
            //   - 'posts'：跳轉到新聞編輯頁面
            //   - 'inquiries'：跳轉到詢盤詳情頁面
            //   - 'site_config'：跳轉到網站配置頁面 -->
            <NuxtLink :to="getResourceUrl(row.resource_type)"
              class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-swiss-text hover:text-swiss-text-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              ✎
            </NuxtLink>

            <!-- 刪除按鈕 -->
            <!-- button：按鈕標籤 -->
            <!-- @click="deleteLog(row.id)"：點擊刪除日誌 -->
            <button @click="deleteLog(row.id)"
              class="text-[10px] font-bold uppercase tracking-widest px-3 py-2 text-red-500 hover:text-red-600 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
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
            <!-- 上一頁按鈕 -->
            <button @click="currentPage--" class="text-[10px] font-bold uppercase tracking-widest px-6 py-3 bg-swiss-bg-soft text-swiss-text border border-swiss-text/10 focus:outline-none focus:border-swiss-text hover:bg-gray-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-none">
              上一頁
            </button>

            <!-- 頁碼顯示 -->
            <!-- span：頁碼 -->
            <span class="text-[10px] font-bold uppercase tracking-widest text-swiss-text-muted flex-grow text-center">
              第 {{ currentPage }} / {{ pagination.total }} 頁
            </span>

            <!-- 下一頁按鈕 -->
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

// filterType：篩選器類型
// 目的：記錄當前選擇的篩選類型
const filterType = ref('')

// currentPage：當前頁碼
// 目的：記錄當前頁碼
const currentPage = ref(1)

// refreshKey：刷新鍵
// 目的：觸發數據刷新
const refreshKey = ref(0)

// computed：構建查詢參數
// 目的：動態生成查詢參數
// 返回值：URL 查詢字符串
const queryParams = computed(() => {
  const params = new URLSearchParams()
  // 添加 page 參數（當前頁碼）
  params.append('page', currentPage.value.toString())
  // 添加 type 參數（如果已選擇）
  if (filterType.value) {
    params.append('type', filterType.value)
  }
  // 轉換為字符串，用於查詢參數
  // 返回格式：`?page=1&type=products` 或 `page=1`
  return params.toString()
})

// useLazyFetch：懶加載操作日誌數據
// 目的：實現非阻塞加載，避免阻塞頁面渲染
// 作用：減少首屏加載時間，提升首屏性能
const { data: response, pending, refresh } = useLazyFetch(
  () => '/api/logs?' + queryParams.value,
  {
    key: () => 'logs-' + currentPage.value + '-' + filterType.value,
    default: { success: false, data: { logs: [], pagination: { page: 1, total: 0, totalPages: 0 } } }
  }
)

// computed：從響應式數據中提取日誌列表
// 目的：統一訪問日誌數據
const logs = computed(() => response.value?.success ? response.value.data.logs || [] : [])

// computed：從響應式數據中提取分頁信息
// 目的：統一訪問分頁信息
const pagination = computed(() => response.value?.success ? response.value.data.pagination : { page: 1, total: 0, totalPages: 0 } )

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
    logout: '登出',
    export: '導出',
  }
  return actionMap[action] || action
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
  return typeMap[type] || type
}

// getResourceUrl：根據資源類型獲取對應的管理頁面 URL
// 目的：動態生成資源編輯頁面的鏈接
// 返回值：對應的管理頁面 URL
const getResourceUrl = (type: string): string => {
  const routes: Record<string, string> = {
    products: '/admin/products',
    posts: '/admin/news',
    inquiries: '/admin/inquiries',
    site_config: '/admin/settings'
  }
  return routes[type] || '/admin'
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
    // 優先優先級：繁體中文 > 簡體中文 > 英文
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

// 刪除日誌
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

// 暴露刷新函數供外部組件使用
// 目的：允許父組件調用 refresh 函數
// 使用場景：其他組件需要刷新日誌數據
defineExpose({
  refresh
})
</script>
