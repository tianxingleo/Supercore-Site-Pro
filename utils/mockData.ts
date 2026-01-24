import type { Product, News, Solution } from '~/types'

/**
 * Mock Products Data
 */
export const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'enterprise-server-rack',
    name: {
      zhHK: '企業級伺服器機櫃',
      zhCN: '企业级服务器机柜',
      en: 'Enterprise Server Rack'
    },
    description: {
      zhHK: '高性能企業級伺服器解決方案，提供卓越的運算能力和存儲擴展性。',
      zhCN: '高性能企业级服务器解决方案，提供卓越的运算能力和存储扩展性。',
      en: 'High-performance enterprise server solution with superior computing power and storage scalability.'
    },
    specs: {
      cpu: 'Intel Xeon Gold 6248R',
      cores: 48,
      threads: 96,
      ram: '256GB DDR4',
      storage: '2TB NVMe SSD',
      power: '1200W',
      rackUnits: '42U'
    },
    images: ['/images/products/server-rack.jpg'],
    category: 'server',
    featured: true,
    createdAt: '2025-01-24T00:00:00Z'
  },
  {
    id: '2',
    slug: 'high-performance-storage',
    name: {
      zhHK: '高性能存儲陣列',
      zhCN: '高性能存储阵列',
      en: 'High-Performance Storage Array'
    },
    description: {
      zhHK: '專為大數據和雲端應用設計的存儲解決方案，提供極速響應時間。',
      zhCN: '专为大数据和云端应用设计的存储解决方案，提供极速响应时间。',
      en: 'Storage solution designed for big data and cloud applications with ultra-fast response times.'
    },
    specs: {
      capacity: '100TB RAW',
      drives: 24,
      raid: 'RAID 6',
      cache: '64GB',
      throughput: '10GB/s',
      rackUnits: '4U'
    },
    images: ['/images/products/storage-array.jpg'],
    category: 'storage',
    featured: true,
    createdAt: '2025-01-24T00:00:00Z'
  },
  {
    id: '3',
    slug: 'managed-switch',
    name: {
      zhHK: '託管型網絡交換機',
      zhCN: '托管型网络交换机',
      en: 'Managed Network Switch'
    },
    description: {
      zhHK: '支持 VLAN、QoS 和遠端管理的企業級網絡交換機。',
      zhCN: '支持 VLAN、QoS 和远程管理的企业级网络交换机。',
      en: 'Enterprise-grade network switch with VLAN, QoS and remote management support.'
    },
    specs: {
      ports: 48,
      speed: '10Gbps',
      uplinkPorts: 4,
      switchingCapacity: '1.28Tbps',
      packetForwarding: '720Mpps',
      power: '120W'
    },
    images: ['/images/products/switch.jpg'],
    category: 'network',
    featured: false,
    createdAt: '2025-01-24T00:00:00Z'
  }
]

/**
 * Mock News Data
 */
export const mockNews: News[] = [
  {
    id: '1',
    slug: 'new-data-center-open',
    title: {
      zhHK: '全新數據中心正式啟用',
      zhCN: '全新数据中心正式启用',
      en: 'New Data Center Now Operational'
    },
    content: {
      zhHK: '我們很高興宣佈位於香港的新數據中心已正式啟用。這個最先進的設施將為我們的客戶提供更高的可靠性和更快的響應時間...',
      zhCN: '我们很高兴宣布位于香港的新数据中心已正式启用。这个最先进的设施将为我们的客户提供更高的可靠性和更快的响应时间...',
      en: 'We are excited to announce that our new data center in Hong Kong is now operational. This state-of-the-art facility will provide our clients with enhanced reliability and faster response times...'
    },
    excerpt: {
      zhHK: '投資逾千萬港元，打造金融級基礎設施，服務全港企業。',
      zhCN: '投资逾千万港元，打造金融级基础设施，服务全港企业。',
      en: 'Over 10 million HKD investment to build financial-grade infrastructure serving enterprises across Hong Kong.'
    },
    locale: 'zh-HK',
    publishDate: '2025-01-15',
    author: 'Project NEXUS Team',
    imageUrl: '/images/news/datacenter.jpg',
    featured: true,
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    slug: 'ai-solutions-launch',
    title: {
      zhHK: '推出 AI 驅動的智能運維解決方案',
      zhCN: '推出 AI 驱动的智能运维解决方案',
      en: 'AI-Powered Operations Management Solution Launched'
    },
    content: {
      zhHK: '通過引入人工智能和機器學習技術，我們的智能運維平台可以提前預警潛在問題，實現預測性維護...',
      zhCN: '通过引入人工智能和机器学习技术，我们的智能运维平台可以提前预警潜在问题，实现预测性维护...',
      en: 'By leveraging AI and machine learning technologies, our intelligent operations platform can proactively alert to potential issues and enable predictive maintenance...'
    },
    excerpt: {
      zhHK: '利用先進的 AI 技術，實現 7x24 小時自動監控和智能故障診斷。',
      zhCN: '利用先进的 AI 技术，实现 7x24 小时自动监控和智能故障诊断。',
      en: 'Leveraging advanced AI technology for 7x24 automated monitoring and intelligent fault diagnosis.'
    },
    locale: 'zh-HK',
    publishDate: '2025-01-10',
    author: 'Project NEXUS Team',
    imageUrl: '/images/news/ai-ops.jpg',
    featured: true,
    createdAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '3',
    slug: 'cloud-migration-success',
    title: {
      zhHK: '成功協助金融客戶完成雲端遷移',
      zhCN: '成功协助金融客户完成云端迁移',
      en: 'Successful Cloud Migration for Financial Client'
    },
    content: {
      zhHK: '我們很榮幸協助一家知名金融機構成功遷移其核心業務系統到雲端平台，實現了零停機遷移...',
      zhCN: '我们很荣幸协助一家知名金融机构成功迁移其核心业务系统到云端平台，实现了零停机迁移...',
      en: 'We are honored to have assisted a renowned financial institution in successfully migrating their core business systems to the cloud platform, achieving zero-downtime migration...'
    },
    excerpt: {
      zhHK: '為期三個月的遷移項目，業務連續性達到 99.99%。',
      zhCN: '为期三个月的迁移项目，业务连续性达到 99.99%。',
      en: 'Three-month migration project with 99.99% business continuity.'
    },
    locale: 'zh-HK',
    publishDate: '2025-01-05',
    author: 'Project NEXUS Team',
    imageUrl: '/images/news/cloud.jpg',
    featured: false,
    createdAt: '2025-01-05T00:00:00Z'
  }
]

/**
 * Mock Solutions Data
 */
export const mockSolutions: Solution[] = [
  {
    id: '1',
    slug: 'data-center-services',
    title: {
      zhHK: '數據中心服務',
      zhCN: '数据中心服务',
      en: 'Data Center Services'
    },
    description: {
      zhHK: '提供從設計、建設到運維的全生命週期數據中心服務。',
      zhCN: '提供从设计、建设到运维的全生命周期数据中心服务。',
      en: 'Full-lifecycle data center services from design and construction to operations.'
    },
    icon: 'Server',
    category: 'idc',
    features: [
      '機櫃租用',
      '託管服務',
      '災難恢復',
      '安全監控',
      '能源管理'
    ],
    order: 1
  },
  {
    id: '2',
    slug: 'network-infrastructure',
    title: {
      zhHK: '網絡基建',
      zhCN: '网络基建',
      en: 'Network Infrastructure'
    },
    description: {
      zhHK: '構建高可靠、高安全的企業級網絡架構。',
      zhCN: '构建高可靠、高安全的企业级网络架构。',
      en: 'Building highly reliable and secure enterprise-grade network architecture.'
    },
    icon: 'Network',
    category: 'idc',
    features: [
      'SD-WAN',
      '網絡安全',
      '負載均衡',
      'VPN 隧道',
      '帶寬管理'
    ],
    order: 2
  },
  {
    id: '3',
    slug: 'managed-operations',
    title: {
      zhHK: '託管運維',
      zhCN: '托管运维',
      en: 'Managed Operations'
    },
    description: {
      zhHK: '7x24 小時專業運維團隊，保障您的業務系統穩定運行。',
      zhCN: '7x24 小时专业运维团队，保障您的业务系统稳定运行。',
      en: '7x24 professional operations team ensuring stable operation of your business systems.'
    },
    icon: 'Settings',
    category: 'operations',
    features: [
      '全天候監控',
      '故障響應',
      '性能優化',
      '安全補丁',
      '備份恢復'
    ],
    order: 3
  },
  {
    id: '4',
    slug: 'custom-development',
    title: {
      zhHK: '定制開發',
      zhCN: '定制开发',
      en: 'Custom Development'
    },
    description: {
      zhHK: '根據業務需求，提供定制化軟件開發和解決方案。',
      zhCN: '根据业务需求，提供定制化软件开发和解决方案。',
      en: 'Customized software development and solutions based on business requirements.'
    },
    icon: 'Code',
    category: 'development',
    features: [
      '需求分析',
      '系統架構',
      '敏捷開發',
      '測試部署',
      '持續支持'
    ],
    order: 4
  },
  {
    id: '5',
    slug: 'security-solutions',
    title: {
      zhHK: '安全解決方案',
      zhCN: '安全解决方案',
      en: 'Security Solutions'
    },
    description: {
      zhHK: '多層次的安全防護體系，保護您的數字資產。',
      zhCN: '多层次的安全防护体系，保护您的数字资产。',
      en: 'Multi-layered security protection system safeguarding your digital assets.'
    },
    icon: 'Shield',
    category: 'operations',
    features: [
      '防火牆',
      '入侵檢測',
      '數據加密',
      '訪問控制',
      '安全審計'
    ],
    order: 5
  },
  {
    id: '6',
    slug: 'cloud-services',
    title: {
      zhHK: '雲端服務',
      zhCN: '云端服务',
      en: 'Cloud Services'
    },
    description: {
      zhHK: '提供公有雲、私有雲和混合雲部署方案。',
      zhCN: '提供公有云、私有云和混合云部署方案。',
      en: 'Public, private and hybrid cloud deployment solutions.'
    },
    icon: 'Cloud',
    category: 'development',
    features: [
      '雲端遷移',
      '容器化',
      '微服務',
      'DevOps',
      '成本優化'
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
