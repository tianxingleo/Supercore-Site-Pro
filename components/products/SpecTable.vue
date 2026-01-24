<template>
  <div class="spec-table">
    <table class="w-full">
      <tbody>
        <tr
          v-for="(value, key) in specs"
          :key="key"
          class="border-b border-swiss-secondary/20 last:border-0"
        >
          <th class="py-4 px-4 text-left font-medium text-swiss-secondary w-1/3">
            {{ getSpecLabel(key) }}
          </th>
          <td class="py-4 px-4 text-swiss-text">
            {{ formatSpecValue(value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Props {
  specs: Record<string, string | number | boolean>
}

const props = defineProps<Props>()

// 規格標籤映射（繁體中文）
const specLabels: Record<string, string> = {
  cpu: '處理器',
  cores: '核心數',
  threads: '線程數',
  ram: '內存',
  storage: '存儲',
  power: '電源',
  rackUnits: '機櫃高度',
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

const getSpecLabel = (key: string): string => {
  return specLabels[key] || key
}

const formatSpecValue = (value: string | number | boolean): string => {
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value.toString()
}
</script>

<style scoped>
.spec-table {
  @apply bg-white rounded-lg overflow-hidden shadow-sm;
}

table {
  border-collapse: collapse;
}

@media (max-width: 768px) {
  th,
  td {
    @apply px-2 py-3 text-sm;
  }
}
</style>
