<template>
  <!-- 规格表格容器 -->
  <!-- class="spec-table"：基础类名 -->
  <!-- overflow-hidden：隐藏溢出内容 -->
  <div class="spec-table overflow-hidden">
    <!-- 表格元素 -->
    <!-- class="w-full"：宽度 100% -->
    <!-- border-collapse：边框合并（相邻边框合并为一条） -->
    <table class="w-full border-collapse">
      <!-- 表体 -->
      <!-- v-for：遍历规格数据 -->
      <!-- (value, key) in specs"：解构键值对 -->
      <!-- :key="key"：使用键作为唯一标识 -->
      <tbody>
        <tr v-for="(value, key) in specs" :key="key"
            <!-- border-b border-gray-100：底部边框，浅灰色 -->
            <!-- last:border-0：最后一行移除边框 -->
            <!-- group hover:bg-swiss-bg-soft：悬停时瑞士风格浅色背景 -->
            <!-- transition-colors：平滑颜色过渡 -->
            class="border-b border-gray-100 last:border-0 group hover:bg-swiss-bg-soft transition-colors">
          <!-- 表头单元格（规格名称） -->
          <!-- py-6：上下内边距 6 单位 -->
          <!-- px-0：无左右内边距 -->
          <!-- text-left：文本左对齐 -->
          <!-- w-1/3：宽度 1/3（33.33%） -->
          <!-- scope="row"：语义化属性，表示单元格是行头 -->
          <th class="py-6 px-0 text-left w-1/3" scope="row">
            <!-- 规格名称容器 -->
            <!-- text-[10px]：极小字体（10px） -->
            <!-- font-bold：字重加粗 -->
            <!-- tracking-[0.2em]：字母间距加宽 -->
            <!-- uppercase：全大写 -->
            <!-- text-swiss-text/40：主文本颜色，40% 不透明度 -->
            <!-- group-hover:text-swiss-text/60：悬停时变为 60% 不透明度 -->
            <!-- transition-colors：平滑颜色过渡 -->
            <span
              class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text/40 group-hover:text-swiss-text/60 transition-colors">
              <!-- 规格键名 + 斜杠 + 规格标签 -->
              {{ key }} <span class="text-swiss-text/10">/</span> {{ getSpecLabel(key) }}
            </span>
          </th>
          <!-- 表格单元格（规格值） -->
          <!-- py-6：上下内边距 6 单位 -->
          <!-- px-0：无左右内边距 -->
          <!-- text-right：文本右对齐 -->
          <!-- text-swiss-text：主文本颜色 -->
          <!-- font-bold：字重加粗 -->
          <td class="py-6 px-0 text-right text-swiss-text font-bold">
            <!-- 格式化后的规格值 -->
            {{ formatSpecValue(value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  /**
   * ============================================================================
   * 文件作用：产品规格表格组件 (Product Specifications Table Component)
   * ============================================================================
   * 
   * 此组件是一个瑞士风格的产品规格表格，用于展示产品技术规格。
   * 
   * 功能说明：
   * 1. 规格展示：键值对形式展示产品规格
   * 2. 标签映射：英文规格键映射为中文标签
   * 3. 值格式化：自动格式化不同类型的值（字符串、数字、布尔值）
   * 4. 悬停效果：悬停时高亮当前行
   * 5. 响应式设计：移动端调整内边距
   * 
   * 瑞士设计特点：
   * - 网格布局 (Grid System)：表格布局
   * - 大标题 (Display Typography)：粗体标题，紧凑字母间距
   * - 极简主义 (Minimalism)：简洁的 UI，突出内容
   * - 功能主义 (Functionalism)：快速加载，清晰导航
   * 
   * 表格结构：
   * - 左列：规格名称（1/3 宽度）
   * - 右列：规格值（2/3 宽度）
   * 
   * 规格类型：
   * 1. 字符串：直接显示（如 'Intel Xeon'）
   * 2. 数字：格式化为本地化字符串（如 '1,234'）
   * 3. 布尔值：显示为"是"或"否"
   * 
   * 性能优化：
   * - border-collapse：边框合并，减少 DOM 节点
   * - overflow-hidden：隐藏溢出内容
   * - 响应式设计：移动端调整内边距
   * 
   * 可访问性 (Accessibility)：
   * - 语义化 HTML：使用 th/td、scope="row"
   * - 悬停效果：提供视觉反馈
   * - 对比度：文本和背景对比度符合 WCAG 标准
   * 
   * ============================================================================
   */

  // ============================================================================
  // Props 类型定义 (Props Type Definition)
  // ============================================================================
  // 
  // 定义组件的 Props，使用 TypeScript 接口指定类型
  // 
  // Props 说明：
  // - specs：规格对象的键值对
  *   - key：规格键（字符串，如 'cpu', 'ram'）
  *   - value：规格值（字符串、数字或布尔值）
  * 
  // ============================================================================
  interface Props {
    // 规格对象
    // 类型：Record<string, string | number | boolean>
    // 键值对示例：
    // {
    //   cpu: 'Intel Xeon Gold 6248R',
    //   cores: 24,
    //   threads: 48,
    //   ram: '128GB DDR4',
    //   storage: '2TB NVMe',
    //   raid: true
    // }
    specs: Record<string, string | number | boolean>
  }

  // 定义 props
  const props = defineProps<Props>()

  // ============================================================================
  // 规格标签映射 (Spec Labels Mapping)
  // ============================================================================
  // 
  // specLabels 对象定义了英文规格键到中文标签的映射
  // 
  // 为什么需要映射？
  // - 数据库中存储的是英文规格键（如 'cpu', 'ram'）
  // - 用户界面需要显示中文标签（如 '處理器', '內存'）
  // 
  // Record<string, string> 类型说明：
  // - Record<string, string>：一个键值对对象，键和值都是字符串
  // - TypeScript 的工具类型，简化对象类型定义
  // 
  // 映射关系：
  // - cpu → 處理器
  // - cores → 核心數
  // - threads → 線程數
  // - ram → 內存
  // - storage → 存儲
  // - power → 電源
  // - rackUnits → 機�高度
  // - capacity → 容量
  // - drives → 硬碟數量
  // - raid → RAID 級別
  // - cache → 緩存
  // - throughput → 吞吐量
  // - ports → 端口數
  // - speed → 速度
  // - uplinkPorts → 上行端口
  // - switchingCapacity → 交換容量
  // - packetForwarding → 轉發性能
  // 
  // ============================================================================
  const specLabels: Record<string, string> = {
    cpu: '處理器',
    cores: '核心數',
    threads: '線程數',
    ram: '內存',
    storage: '存儲',
    power: '電源',
    rackUnits: '機�高度',
    capacity: '容量',
    drives: '硬碟數量',
    raid: 'RAID 級別',
    cache: '緩存',
    throughput: '吞吐量',
    ports: '端口數',
    speed: '速度',
    uplinkPorts: '上行端口',
    switchingCapacity: '交換容量',
    packetForwarding: '轉發性能',
  }

  // 获取规格标签的函数
  // 
  // 参数：
  // - key：英文规格键（如 'cpu'）
  // 
  // 返回值：
  // - 中文标签（如 '處理器'）
  // - 如果规格键不存在，返回原始键名
  // 
  // 使用示例：
  // getSpecLabel('cpu') → '處理器'
  // getSpecLabel('unknown') → 'unknown'
  // 
  // ============================================================================
  const getSpecLabel = (key: string): string => {
    // 返回映射的中文标签，如果不存在则返回原始键名
    return specLabels[key] || key
  }

  // 格式化规格值的函数
  // 
  // 函数作用：
  // - 根据值的类型自动格式化显示
  // 
  // 参数：
  // - value：规格值（字符串、数字或布尔值）
  // 
  // 返回值：
  // - 格式化后的字符串
  //   - 布尔值 true → '是'
  //   - 布尔值 false → '否'
  //   - 数字 → 格式化后的数字字符串（如 '1,234'）
  //   - 字符串 → 原样字符串
  // 
  // 工作流程：
  // 1. 检查是否为布尔值
  // 2. 如果是布尔值，返回'是'或'否'
  // 3. 检查是否为数字
  // 4. 如果是数字，使用 toLocaleString() 格式化
  // 5. 否则，转换为字符串并返回
  // 
  // 格式化规则：
  // - 布尔值：true → '是'，false → '否'
  // - 数字：toLocaleString() 自动添加千位分隔符（如 1,234）
  // - 字符串：直接显示
  // 
  // ============================================================================
  const formatSpecValue = (value: string | number | boolean): string => {
    // 如果是布尔值
    if (typeof value === 'boolean') {
      // true → '是'，false → '否'
      return value ? '是' : '否'
    }
    
    // 如果是数字
    if (typeof value === 'number') {
      // 使用 toLocaleString() 格式化数字
      // 自动添加千位分隔符（如 1234 → '1,234'）
      return value.toLocaleString()
    }
    
    // 否则，转换为字符串并返回
    return value.toString()
  }
</script>

<!-- 样式定义 (Scoped Styles) -->
<!-- scoped：样式只作用于当前组件，不影响其他组件 -->
<style scoped>
  <!-- 响应式设计：移动端调整内边距 -->
  <!-- @media (max-width: 768px)：平板及以下设备 -->
  @media (max-width: 768px) {
    <!-- th, td：表头和表格单元格 -->
    <!-- py-4：上下内边距 4 单位（比桌面端的 6 单位小） -->
    th,
    td {
      @apply py-4;
    }
  }
</style>
