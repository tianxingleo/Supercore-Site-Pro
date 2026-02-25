
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

console.log('Testing connection to:', supabaseUrl)
console.log('Using key starting with:', supabaseKey?.substring(0, 20))

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    try {
        const { data, error } = await supabase.from('chat_sessions').select('count').limit(1)
        if (error) {
            console.error('Connection failed:', error)
        } else {
            console.log('Connection successful! Data:', data)
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

test()
