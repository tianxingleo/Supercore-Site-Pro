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

async function checkPosts() {
    console.log('🔍 Checking posts in database...\n')

    try {
        // 1. 获取所有文章（使用 service role，不受 RLS 限制）
        const { data: allPosts, error: allError } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })

        if (allError) {
            console.error('❌ Error fetching all posts:', allError)
            return
        }

        console.log(`📋 Total posts in database: ${allPosts.length}\n`)

        if (allPosts.length === 0) {
            console.log('⚠️  No posts found. Please insert test data.')
            return
        }

        // 显示所有文章的详细信息
        allPosts.forEach((post, index) => {
            console.log(`Post ${index + 1}:`)
            console.log(`  ID: ${post.id}`)
            console.log(`  Slug: ${post.slug}`)
            console.log(`  Title (HK): ${post.title?.hk || post.title?.['zh-HK'] || 'N/A'}`)
            console.log(`  Published at: ${post.published_at || 'Not published'}`)
            console.log(`  Created at: ${post.created_at}`)
            console.log(`  Is published: ${post.published_at && new Date(post.published_at) <= new Date() ? '✓ Yes' : '✗ No'}`)
            console.log()
        })

        // 2. 获取已发布的文章（模拟公开 API）
        const now = new Date().toISOString()
        const { data: publishedPosts, error: pubError } = await supabase
            .from('posts')
            .select('*')
            .not('published_at', 'is', null)
            .lte('published_at', now)
            .order('published_at', { ascending: false })
            .limit(3)

        if (pubError) {
            console.error('❌ Error fetching published posts:', pubError)
            return
        }

        console.log(`\n📰 Published posts (visible on homepage): ${publishedPosts.length}`)
        if (publishedPosts.length === 0) {
            console.log('\n⚠️  No published posts found!')
            console.log('Please update posts to set published_at to current or past time.')
        } else {
            console.log('\n✅ Published posts that should appear on homepage:')
            publishedPosts.forEach((post, index) => {
                console.log(`  ${index + 1}. ${post.title?.hk || post.title?.['zh-HK']} (${post.slug})`)
            })
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }
}

checkPosts()
