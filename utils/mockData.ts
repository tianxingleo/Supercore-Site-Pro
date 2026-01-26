import type { Product, News, Solution } from '~/types'

/**
 * Mock Products Data - 基于博迩科技产品线
 */
export const mockProducts: Product[] = [
  // 通用计算服务器
  {
    id: '1',
    slug: 'general-compute-server',
    name: {
      zhHK: '通用計算服務器',
      zhCN: '通用计算服务器',
      en: 'General Compute Server'
    },
    description: {
      zhHK: '通用計算和數據處理服務器，適用於多種企業應用、數據庫管理、虛擬化等應用場景，具有較高的靈活性和通用性。',
      zhCN: '通用计算和数据处理服务器，适用于多种企业应用、数据库管理、虚拟化等应用场景，具有较高的灵活性和通用性。',
      en: 'General computing and data processing servers suitable for various enterprise applications, database management, and virtualization scenarios with high flexibility and versatility.'
    },
    specs: {
      cpu: 'Intel Xeon / AMD EPYC',
      cores: '32-128',
      ram: '128GB-2TB DDR4/DDR5',
      storage: '可選配置',
      power: '800W-1600W',
      rackUnits: '1U-2U'
    },
    images: ['/images/products/general-compute.jpg'],
    category: 'server',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },
  // 高性能计算服务器
  {
    id: '2',
    slug: 'hpc-server',
    name: {
      zhHK: '高性能計算服務器',
      zhCN: '高性能计算服务器',
      en: 'High-Performance Compute Server'
    },
    description: {
      zhHK: '高性能計算服務器，適用於科學計算、深度學習、人工智能等需要大規模並行計算的領域。',
      zhCN: '高性能计算服务器，适用于科学计算、深度学习、人工智能等需要大规模并行计算的领域。',
      en: 'High-performance computing servers for scientific computing, deep learning, AI, and fields requiring massive parallel computing.'
    },
    specs: {
      cpu: 'AMD EPYC 9004系列 / Intel Xeon Platinum',
      cores: '64-256',
      ram: '512GB-4TB DDR5',
      gpu: 'NVIDIA A100/H100',
      interconnect: 'PCIe 5.0 / CXL',
      rackUnits: '2U-4U'
    },
    images: ['/images/products/hpc-server.jpg'],
    category: 'server',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },
  // 高性能存储
  {
    id: '3',
    slug: 'high-performance-storage',
    name: {
      zhHK: '高性能存儲服務器',
      zhCN: '高性能存储服务器',
      en: 'High-Performance Storage Server'
    },
    description: {
      zhHK: '高性能存儲服務器，用於提供高速、高性能數據存儲訪問，適用於大規模數據分析、高性能計算、雲計算以及大規模數據庫管理。',
      zhCN: '高性能存储服务器，用于提供高速、高性能数据存储访问，适用于大规模数据分析、高性能计算、云计算以及大规模数据库管理。',
      en: 'High-performance storage servers providing fast, high-performance data storage access for large-scale data analysis, HPC, cloud computing, and large database management.'
    },
    specs: {
      capacity: '200TB-2PB',
      drives: '24-48',
      interface: 'NVMe/SAS/SATA',
      raid: 'RAID 0/1/5/6/10/50/60',
      cache: '64GB-256GB',
      throughput: '50GB/s',
      rackUnits: '4U-42U'
    },
    images: ['/images/products/hp-storage.jpg'],
    category: 'storage',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },
  // 通用存储
  {
    id: '4',
    slug: 'general-storage',
    name: {
      zhHK: '通用存儲服務器',
      zhCN: '通用存储服务器',
      en: 'General Storage Server'
    },
    description: {
      zhHK: '通用存儲服務器，適用於大規模數據處理、數據存儲場景，滿足大容量、可擴展性以及高可用存儲需求。',
      zhCN: '通用存储服务器，适用于大规模数据处理、数据存储场景，满足大容量、可扩展性以及高可用存储需求。',
      en: 'General storage servers for large-scale data processing and storage scenarios, meeting requirements for large capacity, scalability, and high availability.'
    },
    specs: {
      capacity: '50TB-500TB',
      drives: '12-24',
      interface: 'SAS/SATA/NVMe',
      raid: 'RAID 0/1/5/6/10',
      powerSupply: '冗余電源',
      rackUnits: '2U-4U'
    },
    images: ['/images/products/general-storage.jpg'],
    category: 'storage',
    featured: false,
    createdAt: '2025-01-26T00:00:00Z'
  },
  // IB交换机
  {
    id: '5',
    slug: 'infiniband-switch',
    name: {
      zhHK: 'IB交換機',
      zhCN: 'IB交换机',
      en: 'InfiniBand Switch'
    },
    description: {
      zhHK: 'IB交換機通常用於高性能計算(HPC)、數據中心、雲計算和大規模存儲等領域，以滿足高性能計算和數據傳輸的需求，近年來已成為GPU服務器的首選網絡互連技術。',
      zhCN: 'IB交换机通常用于高性能计算(HPC)、数据中心、云计算和大规模存储等领域，以满足高性能计算和数据传输的需求，近年来已成为GPU服务器的首选网络互连技术。',
      en: 'InfiniBand switches are commonly used in HPC, data centers, cloud computing, and large-scale storage to meet high-performance computing and data transmission requirements. Recently become the preferred network interconnect technology for GPU servers.'
    },
    specs: {
      speed: 'HDR 200Gb/s / NDR 400Gb/s',
      ports: '32-128',
      latency: '<100ns',
      architecture: '架構式交換',
      power: '150W-500W',
      rackUnits: '1U-2U'
    },
    images: ['/images/products/ib-switch.jpg'],
    category: 'network',
    featured: true,
    createdAt: '2025-01-26T00:00:00Z'
  },
  // 以太网交换机
  {
    id: '6',
    slug: 'ethernet-switch',
    name: {
      zhHK: '以太網交換機',
      zhCN: '以太网交换机',
      en: 'Ethernet Switch'
    },
    description: {
      zhHK: '基於以太網傳輸數據，連接各服務器與網絡防火牆、路由器等網絡設備互聯，從而實現所有設備的互聯互通；應用於企業網絡、運營商網絡、數據中心網絡和工業網絡場景。',
      zhCN: '基于以太网传输数据，连接各服务器与网络防火墙、路由器等网络设备互联，从而实现所有设备的互联互通；应用于企业网络、运营商网络、数据中心网络和工业网络场景。',
      en: 'Data transmission via Ethernet, connecting servers with network equipment like firewalls and routers to enable interconnectivity; used in enterprise, carrier, data center, and industrial network scenarios.'
    },
    specs: {
      ports: '24-48',
      speed: '1G/10G/25G/40G/100G',
      uplinkPorts: '4-8',
      switchingCapacity: '1.28Tbps-10Tbps',
      packetForwarding: '720Mpps-3000Mpps',
      power: '100W-300W'
    },
    images: ['/images/products/ethernet-switch.jpg'],
    category: 'network',
    featured: false,
    createdAt: '2025-01-26T00:00:00Z'
  }
]

/**
 * Mock News Data - 博迩科技行业资讯
 */
export const mockNews: News[] = [
  {
    id: '1',
    slug: 'amd-epyc-4004-series',
    title: {
      zhHK: 'AMD擴展EPYC CPU產品組合，為中小企業帶來更高性能和價值',
      zhCN: 'AMD扩展EPYC CPU产品组合，为中小企业带来更高性能和价值',
      en: 'AMD Expands EPYC CPU Portfolio to Bring Higher Performance and Value to SMBs'
    },
    content: {
      zhHK: 'AMD EPYC 4004系列處理器為領先服務器供應商的入門級系統設計提供更廣泛的支持...',
      zhCN: 'AMD EPYC 4004系列处理器为领先服务器供应商的入门级系统设计提供更广泛的支持...',
      en: 'AMD EPYC 4004 series processors provide broader support for entry-level system designs from leading server vendors...'
    },
    excerpt: {
      zhHK: 'AMD EPYC 4004系列處理器推出，為中小企業提供高性價比的解決方案。',
      zhCN: 'AMD EPYC 4004系列处理器推出，为中小企业提供高性价比的解决方案。',
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
      zhHK: 'AMD 推出 "Zen 5"架構下一代銳龍處理器以賦能超前AI體驗',
      zhCN: 'AMD 推出 "Zen 5"架构下一代锐龙处理器以赋能超前AI体验',
      en: 'AMD Unveils Next-Gen Ryzen Processors with "Zen 5" Architecture for AI Experiences'
    },
    content: {
      zhHK: 'AMD 銳龍 AI 300 系列處理器解鎖面向 Windows Copilot+ PC 的革命性 AI體驗；AMD 銳龍 9000 系列處理器為效率、性能和內容創作設定新標杆...',
      zhCN: 'AMD 锐龙 AI 300 系列处理器解锁面向 Windows Copilot+ PC 的革命性 AI体验；AMD 锐龙 9000 系列处理器为效率、性能和内容创作设定新标杆...',
      en: 'AMD Ryzen AI 300 series processors unlock revolutionary AI experiences for Windows Copilot+ PCs; AMD Ryzen 9000 series sets new benchmarks for efficiency, performance, and content creation...'
    },
    excerpt: {
      zhHK: '新一代處理器為 AI 應用和內容創作帶來革命性提升。',
      zhCN: '新一代处理器为 AI 应用和内容创作带来革命性提升。',
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
      zhHK: 'AMD 在 Computex 2024 上擴大其在數據中心和個人電腦領域的AI和高性能計算領先地位',
      zhCN: 'AMD 在 Computex 2024 上扩大其在数据中心和个人电脑领域的AI和高性能计算领先地位',
      en: 'AMD Expands AI and HPC Leadership in Data Center and PC at Computex 2024'
    },
    content: {
      zhHK: '下一代 AMD EPYC 處理器將擴大數據中心 CPU 的領先地位；全新 AMD 銳龍 AI 300 系列筆記本電腦和 AMD 銳龍 9000 系列台式機處理器為 Copilot+ PC、遊戲、內容創造和工作效率提供領先性能...',
      zhCN: '下一代 AMD EPYC 处理器将扩大数据中心 CPU 的领先地位；全新 AMD 锐龙 AI 300 系列笔记本电脑和 AMD 锐龙 9000 系列台式机处理器为 Copilot+ PC、游戏、内容创造和工作效率提供领先性能...',
      en: 'Next-gen AMD EPYC processors will extend data center CPU leadership; new AMD Ryzen AI 300 series laptops and AMD Ryzen 9000 series desktop processors deliver leading performance for Copilot+ PCs, gaming, content creation, and productivity...'
    },
    excerpt: {
      zhHK: 'AMD 在 Computex 2024 展示最新的處理器技術和 AI 解決方案。',
      zhCN: 'AMD 在 Computex 2024 展示最新的处理器技术和 AI 解决方案。',
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
 */
export const mockSolutions: Solution[] = [
  {
    id: '1',
    slug: 'stable-backend',
    title: {
      zhHK: '後台穩定',
      zhCN: '后台稳定',
      en: 'Stable Backend'
    },
    description: {
      zhHK: '產品成熟，穩定可靠，為您的業務提供堅實的技術支撐。',
      zhCN: '产品成熟，稳定可靠，为您的业务提供坚实的技术支撑。',
      en: 'Mature and reliable products providing solid technical support for your business.'
    },
    icon: 'Server',
    category: 'idc',
    features: [
      '企業級硬件',
      '99.9% 可用性',
      '7x24 監控',
      '快速故障響應',
      '預防性維護'
    ],
    order: 1
  },
  {
    id: '2',
    slug: 'cost-saving',
    title: {
      zhHK: '節省成本',
      zhCN: '节省成本',
      en: 'Cost Saving'
    },
    description: {
      zhHK: '優化資源配置，節省人力維護和時間成本。',
      zhCN: '优化资源配置，节省人力维护和时间成本。',
      en: 'Optimize resource allocation to save on maintenance and time costs.'
    },
    icon: 'Settings',
    category: 'operations',
    features: [
      '按需擴展',
      '能耗優化',
      '自動化運維',
      '資源統一管理',
      '降低TCO'
    ],
    order: 2
  },
  {
    id: '3',
    slug: 'latest-technology',
    title: {
      zhHK: '最新技術',
      zhCN: '最新技术',
      en: 'Latest Technology'
    },
    description: {
      zhHK: '不斷創新產品的應用，引領行業技術發展。',
      zhCN: '不断创新产品的应用，引领行业技术发展。',
      en: 'Continuously innovate product applications and lead industry technology development.'
    },
    icon: 'Code',
    category: 'development',
    features: [
      'AI 賦能',
      '雲端整合',
      '容器化部署',
      '微服務架構',
      'DevOps 實踐'
    ],
    order: 3
  },
  {
    id: '4',
    slug: 'secure-reliable',
    title: {
      zhHK: '安全可靠',
      zhCN: '安全可靠',
      en: 'Secure & Reliable'
    },
    description: {
      zhHK: '保護用戶數據安全，提供全方位的安全防護。',
      zhCN: '保护用户数据安全，提供全方位的安全防护。',
      en: 'Protect user data security with comprehensive security protection.'
    },
    icon: 'Shield',
    category: 'operations',
    features: [
      '數據加密',
      '訪問控制',
      '安全審計',
      '威脅檢測',
      '合規認證'
    ],
    order: 4
  },
  {
    id: '5',
    slug: 'fast-response',
    title: {
      zhHK: '快速響應',
      zhCN: '快速响应',
      en: 'Fast Response'
    },
    description: {
      zhHK: '響應速度迅速，反應及時，確保業務連續性。',
      zhCN: '响应速度迅速，反应及时，确保业务连续性。',
      en: 'Rapid response speed and timely reaction ensure business continuity.'
    },
    icon: 'Cloud',
    category: 'operations',
    features: [
      '專業技術團隊',
      '多渠道支持',
      '工單系統',
      '遠程協助',
      '現場支援'
    ],
    order: 5
  },
  {
    id: '6',
    slug: 'one-stop-service',
    title: {
      zhHK: '一站式服務',
      zhCN: '一站式服务',
      en: 'One-Stop Service'
    },
    description: {
      zhHK: '從規劃到實施全套服務，提供完整解決方案。',
      zhCN: '从规划到实施全套服务，提供完整解决方案。',
      en: 'Complete service from planning to implementation, providing comprehensive solutions.'
    },
    icon: 'Network',
    category: 'idc',
    features: [
      '需求分析',
      '方案設計',
      '設備選型',
      '部署實施',
      '培訓支持'
    ],
    order: 6
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
