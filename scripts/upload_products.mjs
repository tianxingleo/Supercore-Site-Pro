import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI'

const client = createClient(supabaseUrl, supabaseKey)

// 产品数据从 mockData.ts 复制过来
const mockProducts = [
  // === 通用计算服务器 General Computing ===

  // BC120G3 - 1U通用计算服务器
  {
    slug: 'bc120g3',
    name: {
      hk: 'BC120G3 通用計算服務器',
      cn: 'BC120G3 通用计算服务器',
      en: 'BC120G3 General Compute Server'
    },
    description: {
      hk: '1U通用計算服務器，搭載雙路第三代Intel® Xeon® 可擴展處理器和Intel C621A芯片組。支持PCIe 4.0，最多16個DDR4內存插槽(3200MT/s)，以及多種熱插拔硬盤配置(SATA/SAS/NVMe)。',
      cn: '1U通用计算服务器，搭载双路第三代Intel® Xeon® 可扩展处理器和Intel C621A芯片组。支持PCIe 4.0，最多16个DDR4内存插槽(3200MT/s)，以及多种热插拔硬盘配置(SATA/SAS/NVMe)。',
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
    is_featured: true,
    status: 'published'
  },

  // BC120G3-H - 1U通用计算服务器（高配置）
  {
    slug: 'bc120g3-h',
    name: {
      hk: 'BC120G3-H 通用計算服務器',
      cn: 'BC120G3-H 通用计算服务器',
      en: 'BC120G3-H General Compute Server'
    },
    description: {
      hk: '1U通用計算型伺服器，搭载双路3rd Gen Intel Xeon Scalable系列處理器，可扩展至32个DIMM插槽和8TB ECC DDR4 DRAM；最多支持4个PCIe 4.0插槽，提供高速数据传输和扩展性；最多提供12个2.5英寸硬盤插槽，满足大容量存储需求；配备最多两个1200瓦冗餘钛金级PSU，确保稳定的電源供应，提高系统可靠性',
      cn: '1U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器，可扩展至32个DIMM插槽和8TB ECC DDR4 DRAM；最多支持4个PCIe 4.0插槽，提供高速数据传输和扩展性；最多提供12个2.5英寸硬盘插槽，满足大容量存储需求；配备最多两个1200瓦冗余钛金级PSU，确保稳定的电源供应，提高系统可靠性',
      en: '1U general-purpose server with dual 3rd Gen Intel Xeon Scalable processors, expandable to 32 DIMM slots and 8TB ECC DDR4 DRAM; supports up to 4 PCIe 4.0 slots, up to 12x 2.5" drive bays, dual 1200W redundant titanium PSUs.'
    },
    specs: {
      model: 'BC120G3-H',
      cpu: '双路 Intel Xeon 第三代可扩展处理器，支持 CPU TDP 最高 270W',
      chipset: 'Intel C621A',
      memory: '32x DDR4-3200 DIMM slots, 最大8TB, 支持 Intel Optane 持久内存 200 系列',
      storage: '12x 2.5" 热插拔 NVMe/SATA/SAS',
      pcie: '4x PCIe 4.0 插槽',
      power: '2x 1200W 冗余钛金级电源',
      rackUnits: '1U'
    },
    images: ['/images/products/bc120g3/main.png', '/images/products/bc120g3/front.png', '/images/products/bc120g3/back.png'],
    category: 'server',
    is_featured: true,
    status: 'published'
  },

  // BC220G3 - 2U通用计算服务器
  {
    slug: 'bc220g3',
    name: {
      hk: 'BC220G3 通用計算服務器',
      cn: 'BC220G3 通用计算服务器',
      en: 'BC220G3 General Compute Server'
    },
    description: {
      hk: '2U通用計算型伺服器，搭载第3代Intel Xeon Scalable處理器；支持高达4TB內存，拥有16个DIMM插槽，兼容3200MHz ECC DDR4 RDIMM或LRDIMM；配备8个3.5"熱插拔SATA/SAS驱动器插槽和1个M.2 NVMe插槽；包含2个PCIe 4.0 x8 LP插槽和4个PCIe 4.0 x16 LP插槽，满足高速数据传输和扩展需求',
      cn: '2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器；支持高达4TB内存，拥有16个DIMM插槽，兼容3200MHz ECC DDR4 RDIMM或LRDIMM；配备8个3.5"热插拔SATA/SAS驱动器插槽和1个M.2 NVMe插槽；包含2个PCIe 4.0 x8 LP插槽和4个PCIe 4.0 x16 LP插槽，满足高速数据传输和扩展需求',
      en: 'A 2U general-purpose computing server featuring 3rd Gen Intel Xeon Scalable processors. It supports up to 4TB of memory across 16 DIMM slots, providing high-performance computing capabilities.'
    },
    specs: {
      model: 'BC220G3',
      cpu: '双路 Intel Xeon 第三代可扩展处理器',
      memory: '16x DDR4-3200 DIMM slots, 最大4TB',
      storage: '8x 3.5" 热插拔 SATA/SAS + 1x M.2 NVMe',
      pcie: '6x PCIe 4.0 插槽',
      power: '冗余电源',
      rackUnits: '2U'
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    is_featured: true,
    status: 'published'
  },

  // BC220G3-H - 2U通用计算服务器（高配置）
  {
    slug: 'bc220g3-h',
    name: {
      hk: 'BC220G3-H 通用計算服務器',
      cn: 'BC220G3-H 通用计算服务器',
      en: 'BC220G3-H General Compute Server'
    },
    description: {
      hk: '2U通用計算型伺服器，搭载双路3rd Gen Intel Xeon Scalable系列處理器；拥有32个DIMM插槽，支持最高8TB的3200MHz ECC DDR4內存；正面具备24个2.5英寸熱插拔驱动器插槽，支持NVMe、SATA或SAS类型的固态硬盤驱动器；最高支持6个PCIe 4.0插槽，提供海量存储和全域需求计算能力',
      cn: '2U通用计算型服务器，搭载双路3rd Gen Intel Xeon Scalable系列处理器；拥有32个DIMM插槽，支持最高8TB的3200MHz ECC DDR4内存；正面具备24个2.5英寸热插拔驱动器插槽，支持NVMe、SATA或SAS类型的固态硬盘驱动器；最高支持6个PCIe 4.0插槽，提供海量存储和全域需求计算能力',
      en: '2U server with dual 3rd Gen Intel Xeon Scalable processors; 32 DIMM slots supporting up to 8TB 3200MHz ECC DDR4; 24x 2.5" hot-swap drive bays supporting NVMe/SATA/SAS; up to 6 PCIe 4.0 slots.'
    },
    specs: {
      model: 'BC220G3-H',
      cpu: '双路 Intel Xeon 第三代可扩展处理器',
      memory: '32x DDR4-3200 DIMM slots, 最大8TB',
      storage: '24x 2.5" 热插拔 NVMe/SATA/SAS',
      pcie: '6x PCIe 4.0 插槽',
      power: '冗余电源',
      rackUnits: '2U'
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    is_featured: false,
    status: 'published'
  },

  // BC220G3-S - 2U通用计算服务器（存储优化）
  {
    slug: 'bc220g3-s',
    name: {
      hk: 'BC220G3-S 通用計算服務器',
      cn: 'BC220G3-S 通用计算服务器',
      en: 'BC220G3-S General Compute Server'
    },
    description: {
      hk: '2U通用計算型伺服器，搭载第3代Intel Xeon Scalable處理器，支持高达270W的CPU TDP；具有丰富的存储和扩展选项，最高支持16个DIMM插槽共4TB DDR4內存；拥有12个3.5英寸熱插拔驱动器插槽，同时支持SATA3和NVMe RAID，适合大规模数据处理和存储需求；配备两个1200W冗餘钛级電源单元',
      cn: '2U通用计算型服务器，搭载第3代Intel Xeon Scalable处理器，支持高达270W的CPU TDP；具有丰富的存储和扩展选项，最高支持16个DIMM插槽共4TB DDR4内存；拥有12个3.5英寸热插拔驱动器插槽，同时支持SATA3和NVMe RAID，适合大规模数据处理和存储需求；配备两个1200W冗余钛级电源单元',
      en: '2U server with 3rd Gen Intel Xeon Scalable processors supporting up to 270W CPU TDP; 16 DIMM slots with 4TB DDR4; 12x 3.5" hot-swap drive bays supporting SATA3 and NVMe RAID; dual 1200W redundant titanium power supplies.'
    },
    specs: {
      model: 'BC220G3-S',
      cpu: '双路 Intel Xeon 第三代可扩展处理器，支持 CPU TDP 最高 270W',
      memory: '16x DDR4-3200 DIMM slots, 最大4TB',
      storage: '12x 3.5" 热插拔 SATA3/SAS, 支持 NVMe RAID',
      pcie: '多 PCIe 扩展槽',
      power: '2x 1200W 冗余钛级电源',
      rackUnits: '2U'
    },
    images: ['/images/products/bc220g3/main.png', '/images/products/bc220g3/front.png', '/images/products/bc220g3/back.png'],
    category: 'server',
    is_featured: false,
    status: 'published'
  },

  // === 高性能计算服务器 High-Performance Computing ===

  {
    slug: 'hpc-server',
    name: {
      hk: '高性能計算服務器',
      cn: '高性能计算服务器',
      en: 'High-Performance Compute Server'
    },
    description: {
      hk: '高性能計算服務器，適用於科學計算、深度學習、人工智能等需要大規模並行計算的領域。支持GPU加速和高速互連。',
      cn: '高性能计算服务器，适用于科学计算、深度学习、人工智能等需要大规模并行计算的领域。支持GPU加速和高速互连。',
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
    is_featured: true,
    status: 'published'
  },

  // === 通用存储服务器 General Storage ===

  // BS450G3 - 4U通用存储服务器
  {
    slug: 'bs450g3',
    name: {
      hk: 'BS450G3 通用存儲服務器',
      cn: 'BS450G3 通用存储服务器',
      en: 'BS450G3 General Storage Server'
    },
    description: {
      hk: '4U通用存儲服務器，配備雙路第三代Intel® Xeon®可擴展處理器。具有16個ECC DDR4-3200內存插槽，2個Intel® Optane™持久內存插槽，以及36個熱插拔SAS3/SATA3硬盤位。',
      cn: '4U通用存储服务器，配备双路第三代Intel® Xeon®可扩展处理器。具有16个ECC DDR4-3200内存插槽，2个Intel® Optane™持久内存插槽，以及36个热插拔SAS3/SATA3硬盘位。',
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
    is_featured: true,
    status: 'published'
  },

  // BS450G3-S - 4U高密度存储服务器
  {
    slug: 'bs450g3-s',
    name: {
      hk: 'BS450G3-S 高密度存儲服務器',
      cn: 'BS450G3-S 高密度存储服务器',
      en: 'BS450G3-S High-Density Storage Server'
    },
    description: {
      hk: '4U高密度存儲服務器，支持最多60個熱插拔3.5英寸SATA3/SAS3硬盤位，配備雙路第三代Intel® Xeon®可擴展處理器以及靈活的M.2 NVMe存儲選項。',
      cn: '4U高密度存储服务器，支持最多60个热插拔3.5英寸SATA3/SAS3硬盘位，配备双路第三代Intel® Xeon®可扩展处理器以及灵活的M.2 NVMe存储选项。',
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
    is_featured: true,
    status: 'published'
  },

  // === 高性能存储 High-Performance Storage ===

  {
    slug: 'high-performance-storage',
    name: {
      hk: '高性能存儲服務器',
      cn: '高性能存储服务器',
      en: 'High-Performance Storage Server'
    },
    description: {
      hk: '高性能存儲服務器，用於提供高速、高性能數據存儲訪問，適用於大規模數據分析、高性能計算、雲計算以及大規模數據庫管理。',
      cn: '高性能存储服务器，用于提供高速、高性能数据存储访问，适用于大规模数据分析、高性能计算、云计算以及大规模数据库管理。',
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
    is_featured: false,
    status: 'published'
  },

  // === 网络产品 Network Products ===

  // IB交换机
  {
    slug: 'infiniband-switch',
    name: {
      hk: 'IB交換機',
      cn: 'IB交换机',
      en: 'InfiniBand Switch'
    },
    description: {
      hk: 'IB交換機通常用於高性能計算(HPC)、數據中心、雲計算和大規模存儲等領域，以滿足高性能計算和數據傳輸的需求，近年來已成為GPU服務器的首選網絡互連技術。',
      cn: 'IB交换机通常用于高性能计算(HPC)、数据中心、云计算和大规模存储等领域，以满足高性能计算和数据传输的需求，近年来已成为GPU服务器的首选网络互连技术。',
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
    is_featured: true,
    status: 'published'
  },

  // 以太网交换机
  {
    slug: 'ethernet-switch',
    name: {
      hk: '以太網交換機',
      cn: '以太网交换机',
      en: 'Ethernet Switch'
    },
    description: {
      hk: '基於以太網傳輸數據，連接各服務器與網絡防火牆、路由器等網絡設備互聯，從而實現所有設備的互聯互通；應用於企業網絡、運營商網絡、數據中心網絡和工業網絡場景。',
      cn: '基于以太网传输数据，连接各服务器与网络防火墙、路由器等网络设备互联，从而实现所有设备的互联互通；应用于企业网络、运营商网络、数据中心网络和工业网络场景。',
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
    is_featured: false,
    status: 'published'
  }
]

async function uploadProducts() {
  console.log('开始上传产品数据到 Supabase...\n')

  console.log(`准备上传 ${mockProducts.length} 个产品\n`)

  // 逐个上传产品
  for (let i = 0; i < mockProducts.length; i++) {
    const product = mockProducts[i]

    console.log(`[${i + 1}/${mockProducts.length}] 上传产品: ${product.name.cn} (Slug: ${product.slug})`)

    try {
      const { data, error } = await client
        .from('products')
        .upsert(product, {
          onConflict: 'slug'
        })
        .select()

      if (error) {
        console.error(`❌ 失败: ${error.message}`)
        console.error(`   错误详情:`, error)
      } else if (data && data.length > 0) {
        console.log(`✅ 成功: 产品ID = ${data[0].id}`)
      } else {
        console.log(`✅ 成功: 产品已更新`)
      }
    } catch (err) {
      console.error(`❌ 失败: ${err.message}`)
    }
  }

  console.log('\n✨ 所有产品上传完成！')

  // 验证上传结果
  console.log('\n验证上传结果...')
  const { data: products } = await client
    .from('products')
    .select('id, slug, name')
    .order('id', { ascending: true })

  if (products) {
    console.log(`\n数据库中现有 ${products.length} 个产品:\n`)
    products.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.name.cn || p.name.en} (ID: ${p.id}, Slug: ${p.slug})`)
    })
  }

  return products
}

// 执行上传
uploadProducts()
  .then(() => {
    console.log('\n✅ 脚本执行完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 脚本执行失败:', error)
    process.exit(1)
  })
