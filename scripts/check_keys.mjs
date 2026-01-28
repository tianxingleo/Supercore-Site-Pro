import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oqwvbyacnriohxopgaks.supabase.co'
const supabaseKey = 'sb_secret_TS1l8TARkTDnM9khaRX64Q_gu0uwVkI'

const client = createClient(supabaseUrl, supabaseKey)

async function checkJsonKeys() {
    const { data, error } = await client
        .from('products')
        .select('name, description')
        .limit(1)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Name keys:', Object.keys(data[0].name))
        console.log('Description keys:', Object.keys(data[0].description))
    }
}

checkJsonKeys()
