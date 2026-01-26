import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env from project root
dotenv.config({ path: path.join(process.cwd(), '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mock Traditional Chinese converter (simplified for this script)
function toTraditional(text) {
    // Common terms for IT in Hong Kong
    return text
        .replace(/服务器/g, '伺服器')
        .replace(/存储/g, '存儲')
        .replace(/网络/g, '網絡')
        .replace(/计算/g, '計算')
        .replace(/搭载/g, '搭載')
        .replace(/支持/g, '支援')
        .replace(/插槽/g, '插槽')
        .replace(/硬盘/g, '硬盤')
        .replace(/驱动器/g, '驅動器')
        .replace(/扩展/g, '擴展')
        .replace(/冗余/g, '冗餘')
        .replace(/电源/g, '電源')
}

async function migrateProducts() {
    const productsPath = path.join(process.cwd(), 'migration-assets', 'collected-data', 'boer-products.json')

    if (!fs.existsSync(productsPath)) {
        console.error(`Error: File not found at ${productsPath}`)
        return
    }

    const rawData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    console.log(`Found ${rawData.length} products to migrate.`)

    const productsToInsert = rawData.map(item => {
        const slug = item.product_id.toLowerCase().replace(/[^a-z0-9-]/g, '-')

        return {
            slug,
            name: {
                hk: toTraditional(item.name_zhCN),
                cn: item.name_zhCN,
                en: item.name_zhCN // Placeholder for EN
            },
            description: {
                hk: toTraditional(item.description_zhCN),
                cn: item.description_zhCN,
                en: item.description_zhCN // Placeholder for EN
            },
            category: item.category,
            specs: {
                model: item.specs_model,
                cpu: item.specs_cpu,
                memory: item.specs_memory,
                storage: item.specs_storage,
                pcie: item.specs_pcie,
                power: item.specs_power,
                rackUnits: item.specs_rackUnits
            },
            images: [`/images/products/${item.image_filename}`],
            is_featured: item.featured,
            status: 'published'
        }
    })

    const { data, error } = await supabase
        .from('products')
        .upsert(productsToInsert, { onConflict: 'slug' })

    if (error) {
        console.error('Error migrating products:', error)
    } else {
        console.log('Successfully migrated products!')
    }
}

async function migrateNews() {
    // Since we don't have a news JSON yet, we'll create some sample news based on the project focus
    const sampleNews = [
        {
            title: {
                hk: '博迩科技發佈全新 G3 系列伺服器解決方案',
                cn: '博迩科技发布全新 G3 系列服务器解决方案',
                en: 'Boer Tech Launches New G3 Series Server Solutions'
            },
            content: {
                hk: '我們很榮幸宣佈推出全新的 G3 系列伺服器，旨在為 AI 計算和數據中心提供卓越性能。',
                cn: '我们很荣幸宣布推出全新的 G3 系列服务器，旨在为 AI 计算和数据中心提供卓越性能。',
                en: 'We are proud to announce the launch of our new G3 series servers, designed for AI compute and data centers.'
            },
            cover_image: '/images/news/g3-launch.jpg',
            tags: ['Product', 'Server', 'AI'],
            published_at: new Date().toISOString()
        },
        {
            title: {
                hk: '數據中心基礎設施極簡主義設計趨勢',
                cn: '数据中心基础设施极简主义设计趋势',
                en: 'Trends in Data Center Infrastructure Minimalism'
            },
            content: {
                hk: '瑞士國際主義風格如何影響現代數據中心的硬件設計與管理。',
                cn: '瑞士国际主义风格如何影响现代数据中心的硬件设计与管理。',
                en: 'How Swiss International Style influences modern data center hardware design and management.'
            },
            cover_image: '/images/news/design-trends.jpg',
            tags: ['Design', 'Data Center'],
            published_at: new Date().toISOString()
        }
    ]

    const { data, error } = await supabase
        .from('posts')
        .insert(sampleNews)

    if (error) {
        console.error('Error migrating news:', error)
    } else {
        console.log('Successfully migrated news!')
    }
}

async function run() {
    await migrateProducts()
    await migrateNews()
}

run()
