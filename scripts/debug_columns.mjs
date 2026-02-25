import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://43.132.185.199:8000'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDg1NjAwMDAwMH0.l8S1kMtd5gjV05aQNykVlcnnaI7IJEkX-AfsJmJizU0'

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
