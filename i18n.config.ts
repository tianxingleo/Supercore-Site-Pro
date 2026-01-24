export default defineI18nConfig(() => ({
  locale: 'zh-HK',
  fallbackLocale: 'zh-HK',
  messages: {
    'zh-HK': {
      nav: {
        home: '首頁',
        products: '產品',
        solutions: '解決方案',
        about: '關於我們',
        contact: '聯絡我們'
      },
      home: {
        hero: {
          title: '專業基礎設施解決方案',
          subtitle: '服務香港及海外市場',
          cta: '了解更多',
          ctaSecondary: '聯絡我們'
        },
        features: {
          title: '核心優勢',
          feature1: {
            title: '高性能伺服器',
            description: '提供企業級伺服器解決方案，確保業務連續性'
          },
          feature2: {
            title: '專業運維服務',
            description: '24/7 全天候技術支援，保障系統穩定運行'
          },
          feature3: {
            title: '安全可靠',
            description: '金融級安全標準，保護您的數據資產'
          }
        }
      }
    },
    'zh-CN': {
      nav: {
        home: '首页',
        products: '产品',
        solutions: '解决方案',
        about: '关于我们',
        contact: '联系我们'
      },
      home: {
        hero: {
          title: '专业基础设施解决方案',
          subtitle: '服务香港及海外市场',
          cta: '了解更多',
          ctaSecondary: '联系我们'
        },
        features: {
          title: '核心优势',
          feature1: {
            title: '高性能服务器',
            description: '提供企业级服务器解决方案，确保业务连续性'
          },
          feature2: {
            title: '专业运维服务',
            description: '24/7 全天候技术支持，保障系统稳定运行'
          },
          feature3: {
            title: '安全可靠',
            description: '金融级安全标准，保护您的数据资产'
          }
        }
      }
    },
    'en': {
      nav: {
        home: 'Home',
        products: 'Products',
        solutions: 'Solutions',
        about: 'About Us',
        contact: 'Contact'
      },
      home: {
        hero: {
          title: 'Professional Infrastructure Solutions',
          subtitle: 'Serving Hong Kong and Overseas Markets',
          cta: 'Learn More',
          ctaSecondary: 'Contact Us'
        },
        features: {
          title: 'Core Advantages',
          feature1: {
            title: 'High-Performance Servers',
            description: 'Enterprise-grade server solutions ensuring business continuity'
          },
          feature2: {
            title: 'Professional Operations',
            description: '24/7 technical support ensuring stable system operations'
          },
          feature3: {
            title: 'Secure & Reliable',
            description: 'Financial-grade security standards protecting your data assets'
          }
        }
      }
    }
  }
}))
