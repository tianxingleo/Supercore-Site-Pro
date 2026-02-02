/**
 * Supabase错误处理插件 (服务端)
 * 捕获并忽略Supabase连接错误，避免阻塞页面渲染
 */
export default defineNuxtPlugin({
    name: 'supabase-error-handler',
    enforce: 'pre', // 在其他插件之前运行
    async setup(nuxtApp) {
        // 监听Supabase相关错误
        nuxtApp.hook('app:error', (error) => {
            console.error('[Supabase Plugin] Raw Error Caught:', error) // 添加这行来排查原始错误
            const errorMessage = error?.message || String(error)

            // 如果是Supabase连接错误，记录但不阻断
            if (
                errorMessage.includes('supabase') ||
                errorMessage.includes('jwks.json') ||
                errorMessage.includes('Connect Timeout Error') ||
                errorMessage.includes('fetch failed')
            ) {
                console.warn('[Supabase] 连接失败，继续运行:', errorMessage)
                // 清除错误，允许应用继续运行
                return
            }
        })

        console.log('[Supabase] 错误处理插件已加载')
    },
})
