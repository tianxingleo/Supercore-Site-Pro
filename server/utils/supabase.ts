import { createClient } from '@supabase/supabase-js'
import { H3Event } from 'h3'

/**
 * 获取具有 Service Role 权限的 Supabase 客户端（带增强的配置容错）
 */
export function getInternalSupabaseClient(event: H3Event) {
  const config = useRuntimeConfig(event)
  
  // 按照优先级尝试获取配置：
  // 1. RuntimeConfig 的私有字段 (supabaseService)
  // 2. RuntimeConfig 的公共字段 (supabaseUrl/Key)
  // 3. 环境变量直接读取 (SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_SERVICE_KEY)
  const supabaseUrl = config.supabaseService?.url || config.public?.supabaseUrl || process.env.SUPABASE_URL
  const supabaseKey = config.supabaseService?.key || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || config.public?.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Supabase Utils] Missing configuration:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    })
    throw createError({
      statusCode: 500,
      message: '服务器配置错误：Supabase 凭证缺失。'
    })
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
