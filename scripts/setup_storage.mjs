import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
    console.log('Checking storage buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
        console.error('Error listing buckets:', listError.message)
        return
    }

    const bucketName = 'news-covers'
    const exists = buckets.some(b => b.name === bucketName)

    if (!exists) {
        console.log(`Creating bucket: ${bucketName}`)
        const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: 5242880 // 5MB
        })

        if (createError) {
            console.error('Error creating bucket:', createError.message)
        } else {
            console.log('Bucket created successfully')
        }
    } else {
        console.log(`Bucket ${bucketName} already exists`)
    }
}

setupStorage()
