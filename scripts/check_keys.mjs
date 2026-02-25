import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://43.132.185.199:8000'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6NDg1NjAwMDAwMH0.l8S1kMtd5gjV05aQNykVlcnnaI7IJEkX-AfsJmJizU0'

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
