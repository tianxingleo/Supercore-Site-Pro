<template>
  <div class="spec-table overflow-hidden">
    <table class="w-full border-collapse">
      <tbody>
        <tr
          v-for="(value, key) in specs"
          :key="key"
          class="border-b border-gray-100 last:border-0 group hover:bg-swiss-bg-soft transition-colors"
        >
          <th class="py-6 px-0 text-left w-1/3">
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-swiss-text/40 group-hover:text-swiss-text/60 transition-colors">
              {{ key }} <span class="text-swiss-text/10">/</span> {{ getSpecLabel(key) }}
            </span>
          </th>
          <td class="py-6 px-0 text-right text-swiss-text font-bold">
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
@media (max-width: 768px) {
  th,
  td {
    @apply py-4;
  }
}
</style>
