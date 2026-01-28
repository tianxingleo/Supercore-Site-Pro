import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const results = {
    envConfig: {
      hasUrl: !!process.env.SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SECRET_KEY,
      urlPrefix: process.env.SUPABASE_URL?.substring(0, 20) + '...',
    },
    connectionStatus: 'unknown' as string,
    tables: {} as any,
    error: null as any,
  }

  try {
    // 验证配置
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      results.connectionStatus = 'failed'
      results.error = 'Missing Supabase configuration'
      return results
    }

    // 创建客户端
    const client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    results.connectionStatus = 'connected'

    // 测试每个表
    const tables = ['products', 'inquiries', 'posts']

    for (const table of tables) {
      try {
        const result = await client
          .from(table)
          .select('*', { count: 'exact', head: true })

        results.tables[table] = {
          count: result.count,
          error: result.error?.message || null,
          status: result.error ? 'error' : 'success'
        }

        console.log(`[Test Connection] ${table}:`, {
          count: result.count,
          error: result.error
        })
      } catch (err: any) {
        results.tables[table] = {
          count: 0,
          error: err.message,
          status: 'error'
        }
        console.error(`[Test Connection] ${table} error:`, err)
      }
    }

    return results
  } catch (error: any) {
    results.connectionStatus = 'failed'
    results.error = error.message
    console.error('[Test Connection] Fatal error:', error)
    return results
  }
})
