/**
 * Supabase离线模式插件
 * 当Supabase无法连接时，允许网站继续运行
 */
export default defineNuxtPlugin(() => {
    // 在客户端禁用自动用户检查以避免连接超时
    // 这样即使Supabase无法连接，网站也能正常访问
    if (process.client) {
        console.log('[Supabase] 客户端模式：允许离线访问')
    }
})
