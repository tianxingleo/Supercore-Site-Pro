export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl || process.env.SUPABASE_URL || ''
  const supabaseKey = config.supabaseService.key || config.public.supabaseKey || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY || ''

  const results: any = {
    frontend: { url: 'localhost', status: 'online', responseTime: 0 },
    backend: { url: supabaseUrl, status: 'unknown', responseTime: null },
  }

  // 超时函数
  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const startTime = Date.now()
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      const duration = Date.now() - startTime
      clearTimeout(timeoutId)
      return { response, duration }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // 检查后端服务器
  if (supabaseUrl) {
    const backendStart = Date.now()
    try {
      const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
      const apiUrl = `https://${projectRef}.supabase.co/rest/v1/`

      const { response: pingResponse, duration } = await fetchWithTimeout(
        apiUrl,
        {
          method: 'GET',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
          },
        },
        5000
      )

      // 任何 200-499 的响应都表示服务器在线
      const isOnline = pingResponse.status >= 200 && pingResponse.status < 500

      results.backend = {
        url: supabaseUrl,
        status: isOnline ? 'online' : 'offline',
        responseTime: duration,
        httpStatus: pingResponse.status,
      }
    } catch (error) {
      results.backend = {
        url: supabaseUrl,
        status: 'offline',
        responseTime: null,
        error: error instanceof Error ? error.message : 'Connection failed',
      }
    }
  } else {
    results.backend = {
      url: 'N/A',
      status: 'unknown',
      responseTime: null,
      error: 'SUPABASE_URL not configured',
    }
  }

  return {
    success: true,
    data: results,
  }
})
