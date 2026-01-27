import type { Product, News, Solution } from '~/types'

/**
 * Mock Products Data - 基于博迩科技实际产品
 * Data sourced from https://boer.cn/products
 */
export const mockProducts: Product[] = [
  // === 通用计算服务器 General Computing ===

  // BC120G3 - 1U通用计算服务器
  {
    id: 'bc120g3',
    slug: 'bc120g3',
    name: {
      'zh-HK': 'BC120G3 通用計算服務器',
      'zh-CN': 'BC120G3 通用计算服务器',
      en: 'BC120G3 General Compute Server'
    },
    description: {
      'zh-HK': '1U通用計算服務器，搭載雙路第三代Intel® Xeon® 可擴展處理器和Intel C621A芯片組。支持PCIe 4.0，最多16個DDR4內存插槽(3200MT/s)，以及多種熱插拔硬盤配置(SATA/SAS/NVMe)。',
      'zh-CN': '1U通用计算服务器，搭载双路第三代Intel® Xeon® 可扩展处理器和Intel C621A芯片组。支持PCIe 4.0，最多16个DDR4内存插槽(3200MT/s)，以及多种热插拔硬盘配置(SATA/SAS/NVMe)。',
      en: 'A 1U general-purpose computing server equipped with dual 3rd Gen Intel® Xeon® Scalable processors and Intel C621A chipset. Supports PCIe 4.0, up to 16 DDR4 memory slots (3200MT/s), and various hot-swappable drive configurations (SATA/SAS/NVMe).'
    },
    specs: {
      model: 'BC120G3',
      cpu: '双路 Intel® Xeon® 第三代可扩展处理器',
      chipset: 'Intel C621A',
      memory: '16x DDR4-3200 DIMM slots, 最大4TB',
      storage: '热插拔 2.5" SATA/SAS/NVMe',
      pcie: 'PCIe 4.0',
      power: '冗余电源',
      rackUnits: '1U'
    },
    images: ['/images/products/bc120g3/main.png', '/images/products/bc120g3/front.png', '/images/products/bc120g3/back.png'],
    category: 'server',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // BC220G3 - 2U通用计算服务器
  {
    id: 'bc220g3',
    slug: 'bc220g3',
    name: {
      'zh-HK': 'BC220G3 通用計算服務器',
      'zh-CN': 'BC220G3 通用计算服务器',
      en: 'BC220G3 General Compute Server'
    },
    description: {
      'zh-HK': '2U通用計算服務器，採用第三代Intel Xeon可擴展處理器。支持最多4TB內存，配備16個DIMM插槽，提供高性能計算能力。',
      'zh-CN': '2U通用计算服务器，采用第三代Intel Xeon可扩展处理器。支持最多4TB内存，配备16个DIMM插槽，提供高性能计算能力。',
      en: 'A 2U general-purpose computing server featuring 3rd Gen Intel Xeon Scalable processors. It supports up to 4TB of memory across 16 DIMM slots, providing high-performance computing capabilities.'
    },
    specs: {
      model: 'BC220G3',
      cpu: '双路 Intel® Xeon® 第三代可扩展处理器',
      memory: '16x DIMM slots, 最大4TB',
      storage: '热插拔硬盘',
      expansion: '多PCIe扩展槽',
      power: '冗余电源',
      rackUnits: '2U'
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // === 高性能计算服务器 High-Performance Computing ===

  {
    id: 'hpc-server',
    slug: 'hpc-server',
    name: {
      'zh-HK': '高性能計算服務器',
      'zh-CN': '高性能计算服务器',
      en: 'High-Performance Compute Server'
    },
    description: {
      'zh-HK': '高性能計算服務器，適用於科學計算、深度學習、人工智能等需要大規模並行計算的領域。支持GPU加速和高速互連。',
      'zh-CN': '高性能计算服务器，适用于科学计算、深度学习、人工智能等需要大规模并行计算的领域。支持GPU加速和高速互连。',
      en: 'High-performance computing servers for scientific computing, deep learning, AI, and fields requiring massive parallel computing. Supports GPU acceleration and high-speed interconnects.'
    },
    specs: {
      cpu: 'AMD EPYC 9004系列 / Intel Xeon Platinum',
      cores: '64-256核',
      memory: '512GB-4TB DDR5',
      gpu: 'NVIDIA A100/H100',
      interconnect: 'PCIe 5.0 / InfiniBand',
      rackUnits: '2U-4U'
    },
    images: ['/images/categories/hpc.png'],
    category: 'hpc',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // === 通用存储服务器 General Storage ===

  // BS450G3 - 4U通用存储服务器
  {
    id: 'bs450g3',
    slug: 'bs450g3',
    name: {
      'zh-HK': 'BS450G3 通用存儲服務器',
      'zh-CN': 'BS450G3 通用存储服务器',
      en: 'BS450G3 General Storage Server'
    },
    description: {
      'zh-HK': '4U通用存儲服務器，配備雙路第三代Intel® Xeon®可擴展處理器。具有16個ECC DDR4-3200內存插槽，2個Intel® Optane™持久內存插槽，以及36個熱插拔SAS3/SATA3硬盤位。',
      'zh-CN': '4U通用存储服务器，配备双路第三代Intel® Xeon®可扩展处理器。具有16个ECC DDR4-3200内存插槽，2个Intel® Optane™持久内存插槽，以及36个热插拔SAS3/SATA3硬盘位。',
      en: 'A 4U general-purpose storage server with dual 3rd Gen Intel® Xeon® Scalable processors. Features 16 ECC DDR4-3200 memory slots, 2 Intel® Optane™ persistent memory slots, and 36 hot-swappable SAS3/SATA3 drive bays.'
    },
    specs: {
      model: 'BS450G3',
      cpu: '双路 Intel® Xeon® 第三代可扩展处理器',
      memory: '16x DDR4-3200 + 2x Intel® Optane™',
      storage: '36x 热插拔 3.5" SAS3/SATA3',
      capacity: '最大576TB',
      raid: '硬件RAID支持',
      rackUnits: '4U'
    },
    images: ['/images/products/bs450g3/main.png', '/images/products/bs450g3/front.png', '/images/products/bs450g3/back.png'],
    category: 'storage',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // BS450G3-S - 4U高密度存储服务器
  {
    id: 'bs450g3-s',
    slug: 'bs450g3-s',
    name: {
      'zh-HK': 'BS450G3-S 高密度存儲服務器',
      'zh-CN': 'BS450G3-S 高密度存储服务器',
      en: 'BS450G3-S High-Density Storage Server'
    },
    description: {
      'zh-HK': '4U高密度存儲服務器，支持最多60個熱插拔3.5英寸SATA3/SAS3硬盤位，配備雙路第三代Intel® Xeon®可擴展處理器以及靈活的M.2 NVMe存儲選項。',
      'zh-CN': '4U高密度存储服务器，支持最多60个热插拔3.5英寸SATA3/SAS3硬盘位，配备双路第三代Intel® Xeon®可扩展处理器以及灵活的M.2 NVMe存储选项。',
      en: 'A 4U high-density storage server that supports up to 60 hot-swappable 3.5-inch SATA3/SAS3 drive bays, along with dual 3rd Gen Intel® Xeon® Scalable processors and flexible M.2 NVMe storage options.'
    },
    specs: {
      model: 'BS450G3-S',
      cpu: '双路 Intel® Xeon® 第三代可扩展处理器',
      storage: '60x 热插拔 3.5" SATA3/SAS3',
      capacity: '最大960TB',
      cacheStorage: 'M.2 NVMe',
      raid: '硬件RAID支持',
      rackUnits: '4U'
    },
    images: ['/images/products/bs450g3/main.png', '/images/products/bs450g3/front.png', '/images/products/bs450g3/back.png'],
    category: 'storage',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // === 高性能存储 High-Performance Storage ===

  {
    id: 'high-performance-storage',
    slug: 'high-performance-storage',
    name: {
      'zh-HK': '高性能存儲服務器',
      'zh-CN': '高性能存储服务器',
      en: 'High-Performance Storage Server'
    },
    description: {
      'zh-HK': '高性能存儲服務器，用於提供高速、高性能數據存儲訪問，適用於大規模數據分析、高性能計算、雲計算以及大規模數據庫管理。',
      'zh-CN': '高性能存储服务器，用于提供高速、高性能数据存储访问，适用于大规模数据分析、高性能计算、云计算以及大规模数据库管理。',
      en: 'High-performance storage servers providing fast, high-performance data storage access for large-scale data analysis, HPC, cloud computing, and large database management.'
    },
    specs: {
      capacity: '200TB-2PB',
      drives: 'NVMe全闪存阵列',
      interface: 'NVMe-oF',
      raid: 'RAID 0/1/5/6/10/50/60',
      cache: '64GB-256GB',
      throughput: '50GB/s+',
      rackUnits: '2U-4U'
    },
    images: ['/images/categories/hp-storage.png'],
    category: 'storage-hp',
    featured: false,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // === 网络产品 Network Products ===

  // IB交换机
  {
    id: 'infiniband-switch',
    slug: 'infiniband-switch',
    name: {
      'zh-HK': 'IB交換機',
      'zh-CN': 'IB交换机',
      en: 'InfiniBand Switch'
    },
    description: {
      'zh-HK': 'IB交換機通常用於高性能計算(HPC)、數據中心、雲計算和大規模存儲等領域，以滿足高性能計算和數據傳輸的需求，近年來已成為GPU服務器的首選網絡互連技術。',
      'zh-CN': 'IB交换机通常用于高性能计算(HPC)、数据中心、云计算和大规模存储等领域，以满足高性能计算和数据传输的需求，近年来已成为GPU服务器的首选网络互连技术。',
      en: 'InfiniBand switches are commonly used in HPC, data centers, cloud computing, and large-scale storage to meet high-performance computing and data transmission requirements. Recently become the preferred network interconnect technology for GPU servers.'
    },
    specs: {
      speed: 'HDR 200Gb/s / NDR 400Gb/s',
      ports: '32-128端口',
      latency: '<100ns',
      architecture: '无阻塞架构',
      power: '150W-500W',
      rackUnits: '1U-2U'
    },
    images: ['/images/categories/ib-switch.png'],
    category: 'network',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },

  // 以太网交换机
  {
    id: 'ethernet-switch',
    slug: 'ethernet-switch',
    name: {
      'zh-HK': '以太網交換機',
      'zh-CN': '以太网交换机',
      en: 'Ethernet Switch'
    },
    description: {
      'zh-HK': '基於以太網傳輸數據，連接各服務器與網絡防火牆、路由器等網絡設備互聯，從而實現所有設備的互聯互通；應用於企業網絡、運營商網絡、數據中心網絡和工業網絡場景。',
      'zh-CN': '基于以太网传输数据，连接各服务器与网络防火墙、路由器等网络设备互联，从而实现所有设备的互联互通；应用于企业网络、运营商网络、数据中心网络和工业网络场景。',
      en: 'Data transmission via Ethernet, connecting servers with network equipment like firewalls and routers to enable interconnectivity; used in enterprise, carrier, data center, and industrial network scenarios.'
    },
    specs: {
      ports: '24-48端口',
      speed: '1G/10G/25G/40G/100G',
      uplinkPorts: '4-8上行端口',
      switchingCapacity: '1.28Tbps-10Tbps',
      packetForwarding: '720Mpps-3000Mpps',
      power: '100W-300W'
    },
    images: ['/images/categories/ethernet-switch.png'],
    category: 'network',
    featured: false,
    createdAt: '2025-01-26T00:00:00Z'
  }
  ,

  // BC120G3 通用计算服务器
  {
    id: 'bc120g3',
    slug: 'bc120g3',
    name: {
      'zh-HK': 'BC120G3 通用計算伺服器',
      'zh-CN': 'BC120G3 通用计算服务器',
      en: '[TRANSLATE] BC120G3 通用计算服务器'
    },
    description: {
      'zh-HK': '1U通用計算型伺服器，搭载双路3rd Gen Intel Xeon Scalable系列處理器，Intel C621A芯片組，支持PCIe4.0协议，提供最大16根3200MT/s DDR4內存插槽，前置支持4块3.5寸SATA/SAS或8块2.5寸SATA/SAS+2块2.5寸NVME/SATA/SAS 熱插拔硬盤，满足计算需求',
      'zh-CN': '1U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器，Intel C621A芯片组，支持PCIe4.0协议，提供最大16根3200MT/s DDR4内存插槽，前置支持4块3.5寸SATA/SAS或8块2.5寸SATA/SAS+2块2.5寸NVME/SATA/SAS 热插拔硬盘，满足计算需求',
      en: '[TRANSLATE] 1U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器，Intel C621A芯片组，支持PCIe4.0协议，提供最大16根3200MT/s DDR4内存插槽，前置支持4块3.5寸SATA/SAS或8块2.5寸SATA/SAS+2块2.5寸NVME/SATA/SAS 热插拔硬盘，满足计算需求'
    },
    specs: {
      "model": "BC120G3",
      "cpu": "双路 Intel Xeon 第三代可扩展处理器",
      "chipset": "Intel C621A",
      "memory": "16x DDR4-3200 DIMM slots, 最大4TB",
      "storage": "热插拔 2.5\" SATA/SAS/NVMe",
      "pcie": "PCIe 4.0",
      "power": "2x 860W 冗余白金级电源",
      "rackUnits": "1U"
    },
    images: ['/images/products/bc120g3/main.png', '/images/products/bc120g3/front.png', '/images/products/bc120g3/back.png'],
    category: 'server',
    featured: true,
    createdAt: '2026-01-26T07:33:52.481Z'
  },

  // BC120G3-H 通用计算服务器
  {
    id: 'bc120g3-h',
    slug: 'bc120g3-h',
    name: {
      'zh-HK': 'BC120G3-H 通用計算伺服器',
      'zh-CN': 'BC120G3-H 通用计算服务器',
      en: '[TRANSLATE] BC120G3-H 通用计算服务器'
    },
    description: {
      'zh-HK': '1U通用計算型伺服器，搭载双路3rd Gen Intel Xeon Scalable系列處理器，可扩展至32个DIMM插槽和8TB ECC DDR4 DRAM；最多支持4个PCIe 4.0插槽，提供高速数据传输和扩展性；最多提供12个2.5英寸硬盤插槽，满足大容量存储需求；配备最多两个1200瓦冗餘钛金级PSU，确保稳定的電源供应，提高系统可靠性',
      'zh-CN': '1U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器，可扩展至32个DIMM插槽和8TB ECC DDR4 DRAM；最多支持4个PCIe 4.0插槽，提供高速数据传输和扩展性；最多提供12个2.5英寸硬盘插槽，满足大容量存储需求；配备最多两个1200瓦冗余钛金级PSU，确保稳定的电源供应，提高系统可靠性',
      en: '[TRANSLATE] 1U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器，可扩展至32个DIMM插槽和8TB ECC DDR4 DRAM；最多支持4个PCIe 4.0插槽，提供高速数据传输和扩展性；最多提供12个2.5英寸硬盘插槽，满足大容量存储需求；配备最多两个1200瓦冗余钛金级PSU，确保稳定的电源供应，提高系统可靠性'
    },
    specs: {
      "model": "BC120G3-H",
      "cpu": "双路 Intel Xeon 第三代可扩展处理器，支持 CPU TDP 最高 270W",
      "chipset": "Intel C621A",
      "memory": "32x DDR4-3200 DIMM slots, 最大8TB, 支持 Intel Optane 持久内存 200 系列",
      "storage": "12x 2.5\" 热插拔 NVMe/SATA/SAS",
      "pcie": "4x PCIe 4.0 插槽",
      "power": "2x 1200W 冗余钛金级电源",
      "rackUnits": "1U"
    },
    images: ['/images/products/bc120g3/main.png', '/images/products/bc120g3/front.png', '/images/products/bc120g3/back.png'],
    category: 'server',
    featured: true,
    createdAt: '2026-01-26T07:33:52.482Z'
  },

  // BC220G3 通用计算服务器
  {
    id: 'bc220g3',
    slug: 'bc220g3',
    name: {
      'zh-HK': 'BC220G3 通用計算伺服器',
      'zh-CN': 'BC220G3 通用计算服务器',
      en: '[TRANSLATE] BC220G3 通用计算服务器'
    },
    description: {
      'zh-HK': '2U通用計算型伺服器，搭载第3代Intel Xeon Scalable處理器；支持高达4TB內存，拥有16个DIMM插槽，兼容3200MHz ECC DDR4 RDIMM或LRDIMM；配备8个3.5\"熱插拔SATA/SAS驱动器插槽和1个M.2 NVMe插槽；包含2个PCIe 4.0 x8 LP插槽和4个PCIe 4.0 x16 LP插槽，满足高速数据传输和扩展需求',
      'zh-CN': '2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器；支持高达4TB内存，拥有16个DIMM插槽，兼容3200MHz ECC DDR4 RDIMM或LRDIMM；配备8个3.5\"热插拔SATA/SAS驱动器插槽和1个M.2 NVMe插槽；包含2个PCIe 4.0 x8 LP插槽和4个PCIe 4.0 x16 LP插槽，满足高速数据传输和扩展需求',
      en: '[TRANSLATE] 2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器；支持高达4TB内存，拥有16个DIMM插槽，兼容3200MHz ECC DDR4 RDIMM或LRDIMM；配备8个3.5\"热插拔SATA/SAS驱动器插槽和1个M.2 NVMe插槽；包含2个PCIe 4.0 x8 LP插槽和4个PCIe 4.0 x16 LP插槽，满足高速数据传输和扩展需求'
    },
    specs: {
      "model": "BC220G3",
      "cpu": "双路 Intel Xeon 第三代可扩展处理器",
      "memory": "16x DDR4-3200 DIMM slots, 最大4TB",
      "storage": "8x 3.5\" 热插拔 SATA/SAS + 1x M.2 NVMe",
      "pcie": "6x PCIe 4.0 插槽",
      "power": "冗余电源",
      "rackUnits": "2U"
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    featured: true,
    createdAt: '2026-01-26T07:33:52.483Z'
  },

  // BC220G3-H 通用计算服务器
  {
    id: 'bc220g3-h',
    slug: 'bc220g3-h',
    name: {
      'zh-HK': 'BC220G3-H 通用計算伺服器',
      'zh-CN': 'BC220G3-H 通用计算服务器',
      en: '[TRANSLATE] BC220G3-H 通用计算服务器'
    },
    description: {
      'zh-HK': '2U通用計算型伺服器，搭载双路3rd Gen Intel Xeon Scalable系列處理器；拥有32个DIMM插槽，支持最高8TB的3200MHz ECC DDR4內存；正面具备24个2.5英寸熱插拔驱动器插槽，支持NVMe、SATA或SAS类型的固态硬盤驱动器；最高支持6个PCIe 4.0插槽，提供海量存储和全域需求计算能力',
      'zh-CN': '2U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器；拥有32个DIMM插槽，支持最高8TB的3200MHz ECC DDR4内存；正面具备24个2.5英寸热插拔驱动器插槽，支持NVMe、SATA或SAS类型的固态硬盘驱动器；最高支持6个PCIe 4.0插槽，提供海量存储和全域需求计算能力',
      en: '[TRANSLATE] 2U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器；拥有32个DIMM插槽，支持最高8TB的3200MHz ECC DDR4内存；正面具备24个2.5英寸热插拔驱动器插槽，支持NVMe、SATA或SAS类型的固态硬盘驱动器；最高支持6个PCIe 4.0插槽，提供海量存储和全域需求计算能力'
    },
    specs: {
      "model": "BC220G3-H",
      "cpu": "双路 Intel Xeon 第三代可扩展处理器",
      "memory": "32x DDR4-3200 DIMM slots, 最大8TB",
      "storage": "24x 2.5\" 热插拔 NVMe/SATA/SAS",
      "pcie": "6x PCIe 4.0 插槽",
      "power": "冗余电源",
      "rackUnits": "2U"
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    featured: false,
    createdAt: '2026-01-26T07:33:52.483Z'
  },

  // BC220G3-S 通用计算服务器
  {
    id: 'bc220g3-s',
    slug: 'bc220g3-s',
    name: {
      'zh-HK': 'BC220G3-S 通用計算伺服器',
      'zh-CN': 'BC220G3-S 通用计算服务器',
      en: '[TRANSLATE] BC220G3-S 通用计算服务器'
    },
    description: {
      'zh-HK': '2U通用計算型伺服器，搭载第3代Intel Xeon Scalable處理器，支持高达270W的CPU TDP；具有丰富的存储和扩展选项，最高支持16个DIMM插槽共4TB DDR4內存；拥有12个3.5英寸熱插拔驱动器插槽，同时支持SATA3和NVMe RAID，适合大规模数据处理和存储需求；配备两个1200W冗餘钛级電源单元',
      'zh-CN': '2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器，支持高达270W的CPU TDP；具有丰富的存储和扩展选项，最高支持16个DIMM插槽共4TB DDR4内存；拥有12个3.5英寸热插拔驱动器插槽，同时支持SATA3和NVMe RAID，适合大规模数据处理和存储需求；配备两个1200W冗余钛级电源单元',
      en: '[TRANSLATE] 2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器，支持高达270W的CPU TDP；具有丰富的存储和扩展选项，最高支持16个DIMM插槽共4TB DDR4内存；拥有12个3.5英寸热插拔驱动器插槽，同时支持SATA3和NVMe RAID，适合大规模数据处理和存储需求；配备两个1200W冗余钛级电源单元'
    },
    specs: {
      "model": "BC220G3-S",
      "cpu": "双路 Intel Xeon 第三代可扩展处理器，支持 CPU TDP 最高 270W",
      "memory": "16x DDR4-3200 DIMM slots, 最大4TB",
      "storage": "12x 3.5\" 热插拔 SATA3/SAS, 支持 NVMe RAID",
      "pcie": "多 PCIe 扩展槽",
      "power": "2x 1200W 冗余钛级电源",
      "rackUnits": "2U"
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    featured: false,
    createdAt: '2026-01-26T07:33:52.483Z'
  }]

/**
 * Mock News Data - 博迩科技行业资讯
 */
export const mockNews: News[] = [
  {
    id: '1',
    slug: 'amd-epyc-4004-series',
    title: {
      'zh-HK': 'AMD擴展EPYC CPU產品組合，為中小企業帶來更高性能和價值',
      'zh-CN': 'AMD扩展EPYC CPU产品组合，为中小企业带来更高性能和价值',
      en: 'AMD Expands EPYC CPU Portfolio to Bring Higher Performance and Value to SMBs'
    },
    content: {
      'zh-HK': 'AMD EPYC 4004 系列處理器為領先服務器供應商的入門級系統設計提供更廣泛的支持...',
      'zh-CN': 'AMD EPYC 4004系列处理器为领先服务器供应商的入门级系统设计提供更广泛的支持...',
      en: 'AMD EPYC 4004 series processors provide broader support for entry-level system designs from leading server vendors...'
    },
    excerpt: {
      'zh-HK': 'AMD EPYC 4004系列處理器推出，為中小企業提供高性價比的解決方案。',
      'zh-CN': 'AMD EPYC 4004系列处理器推出，为中小企业提供高性价比的解决方案。',
      en: 'AMD EPYC 4004 series processors launch, bringing cost-effective solutions to SMBs.'
    },
    locale: 'zh-HK',
    publishDate: '2024-06-11',
    author: '博迩科技團隊',
    imageUrl: '/images/news/amd-epyc.jpg',
    featured: true,
    createdAt: '2024-06-11T00:00:00Z'
  },
  {
    id: '2',
    slug: 'amd-zen5-rylon-ai',
    title: {
      'zh-HK': 'AMD 推出 "Zen 5"架構下一代銳龍處理器以賦能超前AI體驗',
      'zh-CN': 'AMD 推出 "Zen 5"架构下一代锐龙处理器以赋能超前AI体验',
      en: 'AMD Unveils Next-Gen Ryzen Processors with "Zen 5" Architecture for AI Experiences'
    },
    content: {
      'zh-HK': 'AMD Ryzen AI 300 系列處理器為 Windows Copilot+ PC 解聯革命性的 AI 體驗；AMD 銳龍 9000 系列處理器為效率、性能和內容創作設定新標杆...',
      'zh-CN': 'AMD Ryzen AI 300 系列处理器为 Windows Copilot+ PC 解锁革命性的 AI 体验；AMD 锐龙 9000 系列处理器为效率、性能和内容创作设定新标杆...',
      en: 'AMD Ryzen AI 300 series processors unlock revolutionary AI experiences for Windows Copilot+ PCs; AMD Ryzen 9000 series sets new benchmarks for efficiency, performance, and content creation...'
    },
    excerpt: {
      'zh-HK': '新一代處理器為 AI 應用和內容創作帶來革命性提升。',
      'zh-CN': '新一代处理器为 AI 应用和内容创作带来革命性提升。',
      en: 'New-generation processors bring revolutionary improvements to AI applications and content creation.'
    },
    locale: 'zh-HK',
    publishDate: '2024-06-11',
    author: '博迩科技團隊',
    imageUrl: '/images/news/rylon-ai.jpg',
    featured: true,
    createdAt: '2024-06-11T00:00:00Z'
  },
  {
    id: '3',
    slug: 'amd-computex-2024',
    title: {
      'zh-HK': 'AMD 在 Computex 2024 上擴大其在數據中心和個人電腦領域的 AI 和高性能計算領先地位',
      'zh-CN': 'AMD 在 Computex 2024 上扩大其在数据中心和个人电脑领域的 AI 和高性能计算领先地位',
      en: 'AMD Expands AI and HPC Leadership in Data Center and PC at Computex 2024'
    },
    content: {
      'zh-HK': '下一代 AMD EPYC 處理器將擴展數據中心 CPU 領先地位；全新 AMD Ryzen AI 300 系列筆記本電腦和 AMD Ryzen 9000 系列桌面處理器為 Copilot+ PC、遊戲、內容創造和工作效率提供領先性能...',
      'zh-CN': '下一代 AMD EPYC 处理器将扩展数据中心 CPU 领先地位；全新 AMD Ryzen AI 300 系列笔记本电脑和 AMD Ryzen 9000 系列桌面处理器为 Copilot+ PC、游戏、内容创造和工作效率提供领先性能...',
      en: 'Next-gen AMD EPYC processors will extend data center CPU leadership; new AMD Ryzen AI 300 series laptops and AMD Ryzen 9000 series desktop processors deliver leading performance for Copilot+ PCs, gaming, content creation, and productivity...'
    },
    excerpt: {
      'zh-HK': 'AMD 於 Computex 2024 展示最新的處理器技術和 AI 解決方案。',
      'zh-CN': 'AMD 于 Computex 2024 展示最新的处理器技术和 AI 解决方案。',
      en: 'AMD showcases latest processor technologies and AI solutions at Computex 2024.'
    },
    locale: 'zh-HK',
    publishDate: '2024-06-11',
    author: '博迩科技團隊',
    imageUrl: '/images/news/computex-2024.jpg',
    featured: false,
    createdAt: '2024-06-11T00:00:00Z'
  }
]

/**
 * Mock Solutions Data - 博迩科技解决方案
 * Data sourced from https://www.boer.cn/solutions
 */
export const mockSolutions: Solution[] = [
  {
    id: '1',
    slug: 'ai-computing-networking',
    title: {
      'zh-HK': 'AI算力與組網方案',
      'zh-CN': 'AI算力与组网方案',
      en: 'AI Computing and Networking Solution'
    },
    description: {
      'zh-HK': '為美國AI算力與組網項目提供算、存、網一體化建設。融合新舊設備解決供給難題，網絡優化設計超出用戶預期。',
      'zh-CN': '为美国AI算力与组网项目提供算、存、网一体化建设。融合新旧设备解决供给难题，网络优化设计超出用户预期。',
      en: 'Provides integrated construction of computing, storage, and networking for USA AI projects. Merges new and old equipment to solve supply challenges with network optimization exceeding expectations.'
    },
    icon: 'Server',
    category: 'idc',
    features: [
      '骨干网：多ISP高速光口连接',
      '业务网：防火墙+多层交换机MLAG',
      '带外网：OOB-SW远程管理',
      '算力网：HPC高速交换机',
      '存储服务器：新旧设备融合',
      'SDWAN：HA高可用技术'
    ],
    order: 1
  },
  {
    id: '2',
    slug: 'gpu-server-cluster',
    title: {
      'zh-HK': 'GPU算力服務器集群組網方案',
      'zh-CN': 'GPU算力服务器集群组网方案',
      en: 'GPU Computing Server Cluster Networking Solution'
    },
    description: {
      'zh-HK': '綜合分層架構，分為計算、網絡和存儲層。GPU和CPU計算節點配合管理節點實現資源協調優化，專為提升大數據和深度學習效率而設計。',
      'zh-CN': '综合分层架构，分为计算、网络和存储层。GPU和CPU计算节点配合管理节点实现资源协调优化，专为提升大数据和深度学习效率而设计。',
      en: 'Comprehensive tiered architecture with computing, networking, and storage layers. GPU and CPU nodes with management coordination, designed to enhance big data and deep learning efficiency.'
    },
    icon: 'Code',
    category: 'development',
    features: [
      '计算层：GPU+CPU节点+管理节点',
      '网络层：IB高速网络',
      '带内管理网络',
      'OOB带外管理',
      '存储层：全闪NVMe SSD阵列',
      '高容量SAS HDD存储'
    ],
    order: 2
  },
  {
    id: '3',
    slug: 'vr-gaming-networking',
    title: {
      'zh-HK': 'VR遊戲組網方案',
      'zh-CN': 'VR游戏组网方案',
      en: 'VR Gaming Networking Solution'
    },
    description: {
      'zh-HK': '確保VR遊戲場景的流暢性和穩定性，提供高帶寬低延遲。星型拓撲易於管理和擴展，高性能GPU服務器處理複雜場景計算。',
      'zh-CN': '确保VR游戏场景的流畅性和稳定性，提供高带宽低延迟。星型拓扑易于管理和扩展，高性能GPU服务器处理复杂场景计算。',
      en: 'Ensures smoothness and stability for VR gaming with high bandwidth and low latency. Star topology for easy management, high-performance GPU servers for complex calculations.'
    },
    icon: 'Network',
    category: 'operations',
    features: [
      '星型拓扑结构',
      '高性能GPU服务器',
      '先进无线AP接入点',
      '最新Wi-Fi标准支持',
      '集成防火墙和入侵检测',
      '实时网络监控'
    ],
    order: 3
  },
  {
    id: '4',
    slug: 'volcano-engine-cloud',
    title: {
      'zh-HK': '火山引擎雲產品方案',
      'zh-CN': '火山引擎云产品方案',
      en: 'Volcano Engine Cloud Product Solution'
    },
    description: {
      'zh-HK': '一站式數字化轉型解決方案，覆蓋計算、存儲、網絡、AI、大數據和容器服務。提供極致性能、彈性擴展和多層安全保障。',
      'zh-CN': '一站式数字化转型解决方案，覆盖计算、存储、网络、AI、大数据和容器服务。提供极致性能、弹性扩展和多层安全保障。',
      en: 'One-stop digital transformation solution covering computing, storage, networking, AI, big data, and container services with extreme performance and elastic scaling.'
    },
    icon: 'Cloud',
    category: 'development',
    features: [
      '极致性能：先进架构处理大规模数据',
      '弹性扩展：动态资源调整',
      '安全可靠：多层安全防护',
      '丰富功能：AI+大数据分析',
      '企业应用部署',
      '内容分发服务'
    ],
    order: 4
  }
]

/**
 * Mock API Functions
 */
export const getProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockProducts
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockProducts.find(p => p.slug === slug) || null
}

export const getNews = async (locale: string = 'zh-HK'): Promise<News[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockNews.filter(news => news.locale === locale || 'zh-HK')
}

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockNews.find(n => n.slug === slug) || null
}

export const getSolutions = async (): Promise<Solution[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockSolutions
}

export const getSolutionBySlug = async (slug: string): Promise<Solution | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockSolutions.find(s => s.slug === slug) || null
}
