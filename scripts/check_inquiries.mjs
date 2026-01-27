import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkInquiries() {
    console.log('🔍 Checking inquiries table...\n')

    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .limit(5)

        if (error) {
            console.error('❌ Error:', error.message)
            console.log('\n💡 The inquiries table might not exist. Creating it...')
            return false
        }

        console.log(`✅ Inquiries table exists with ${data.length} records`)
        if (data.length > 0) {
            console.log('\nSample data:')
            data.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.email} - ${item.company || 'N/A'}`)
            })
        }
        return true
    } catch (error) {
        console.error('❌ Unexpected error:', error)
        return false
    }
}

checkInquiries()
