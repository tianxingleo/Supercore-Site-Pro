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

async function fixPostsTable() {
    console.log('🔧 Fixing posts table schema...\n')

    try {
        // 1. 检查 posts 表是否存在
        const { data: tables, error: tablesError } = await supabase
            .from('posts')
            .select('*')
            .limit(0)

        if (tablesError) {
            if (tablesError.message.includes('does not exist')) {
                console.log('📋 Posts table does not exist. Creating it...')

                // 创建 posts 表
                const { error: createError } = await supabase.rpc('exec_sql', {
                    sql: `
                        CREATE TABLE IF NOT EXISTS posts (
                            id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                            slug TEXT UNIQUE NOT NULL,
                            title JSONB NOT NULL,
                            summary JSONB,
                            content JSONB NOT NULL,
                            cover_image TEXT,
                            tags TEXT[],
                            published_at TIMESTAMPTZ,
                            created_at TIMESTAMPTZ DEFAULT NOW(),
                            updated_at TIMESTAMPTZ DEFAULT NOW()
                        );
                    `
                })

                if (createError) {
                    console.error('❌ Error creating table:', createError)
                    return
                }

                console.log('✓ Posts table created successfully')
            } else {
                console.error('❌ Error checking table:', tablesError)
                return
            }
        } else {
            console.log('✓ Posts table already exists')
        }

        // 2. 检查并添加缺失的列
        console.log('\n🔍 Checking table columns...')

        // 由于我们使用的是 service role key，直接查询信息模式
        const { data: columns, error: columnsError } = await supabase
            .rpc('exec_sql', {
                sql: `
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'posts'
                `
            })

        console.log('Current columns:', columns)

        console.log('\n✅ All checks completed!')

    } catch (error) {
        console.error('❌ Unexpected error:', error)
    }
}

fixPostsTable()
