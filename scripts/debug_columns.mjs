import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = 'sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI'

const client = createClient(supabaseUrl, supabaseKey)

async function checkAllTables() {
    const tables = ['products', 'posts', 'solutions', 'inquiries', 'site_config', 'profiles']

    for (const table of tables) {
        console.log(`正在获取 ${table} 记录...`)
        const { data, error } = await client
            .from(table)
            .select('*')
            .limit(1)

        if (error) {
            console.error(`获取 ${table} 数据失败:`, error.message)
        } else if (data && data.length > 0) {
            console.log(`${table} 字段列表:`)
            console.log(Object.keys(data[0]).join(', '))
        } else {
            console.log(`${table} 表中没有找到记录。`)
        }
        console.log('---')
    }
}

checkAllTables()
