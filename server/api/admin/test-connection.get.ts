import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const results = {
    envConfig: {
      hasUrl: !!config.supabaseService.url,
      hasKey: !!config.supabaseService.key,
      urlPrefix: config.supabaseService.url?.substring(0, 20) + '...',
    },
    connectionStatus: 'unknown' as string,
    tables: {} as any,
    error: null as any,
  }

  try {
    // 验证配置
    const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL
    const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {
      results.connectionStatus = 'failed'
      results.error = 'Missing Supabase configuration (URL or Service Key)'
      return results
    }

    // 创建客户端
    const client = createClient(
      supabaseUrl,
      supabaseKey,
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
