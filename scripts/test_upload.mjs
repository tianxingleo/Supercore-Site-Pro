import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_RULE_KEY || process.env.SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase connection and storage...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Present ✓' : 'Missing ✗')
console.log('Using:', process.env.SUPABASE_RULE_KEY ? 'Service Role Key' : 'Anon Key')

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorage() {
    try {
        // 1. List all buckets
        console.log('\n📦 Listing all storage buckets...')
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
            console.error('❌ Error listing buckets:', listError)
            return
        }

        console.log(`✓ Found ${buckets.length} buckets:`)
        buckets.forEach(bucket => {
            console.log(`  - ${bucket.name} (public: ${bucket.public})`)
        })

        // 2. Check if news-covers bucket exists
        const bucketName = 'news-covers'
        const exists = buckets.some(b => b.name === bucketName)

        if (!exists) {
            console.log(`\n⚠️  Bucket "${bucketName}" does not exist`)
            console.log('Creating it now...')

            const { data, error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            })

            if (createError) {
                console.error('❌ Error creating bucket:', createError)
                return
            }

            console.log('✓ Bucket created successfully')
        } else {
            console.log(`\n✓ Bucket "${bucketName}" exists`)
        }

        // 3. Test upload with dummy data
        console.log('\n🧪 Testing file upload...')
        const testFileName = `test-${Date.now()}.txt`
        const testContent = new Blob(['Hello, this is a test file'], { type: 'text/plain' })

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(testFileName, testContent, {
                contentType: 'text/plain',
                upsert: false
            })

        if (uploadError) {
            console.error('❌ Upload failed:', uploadError)
            console.error('Error details:', JSON.stringify(uploadError, null, 2))
            return
        }

        console.log('✓ Upload successful:', uploadData.path)

        // 4. Get public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(testFileName)
        console.log('✓ Public URL:', urlData.publicUrl)

        // 5. Clean up test file
        console.log('\n🧹 Cleaning up test file...')
        const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([testFileName])

        if (deleteError) {
            console.error('⚠️  Could not delete test file:', deleteError)
        } else {
            console.log('✓ Test file cleaned up')
        }

        console.log('\n✅ All tests passed!')

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }
}

testStorage()
