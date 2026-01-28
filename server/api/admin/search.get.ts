export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        const query = getQuery(event)
        const searchTerm = (query.q as string) || ''
        const type = query.type as string // products, posts, inquiries, all

        if (!searchTerm || searchTerm.trim().length === 0) {
            return {
                success: true,
                data: {
                    products: [],
                    posts: [],
                    inquiries: [],
                },
            }
        }

        const results: any = {
            products: [],
            posts: [],
            inquiries: [],
        }

        // 搜索产品
        if (!type || type === 'products' || type === 'all') {
            const { data: products } = await supabase
                .from('products')
                .select('id, slug, name, category, status, created_at')
                .or(
                    `slug.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,name->>zh-HK.ilike.%${searchTerm}%,name->>en.ilike.%${searchTerm}%`
                )
                .limit(10)

            results.products = products || []
        }

        // 搜索文章
        if (!type || type === 'posts' || type === 'all') {
            const { data: posts } = await supabase
                .from('posts')
                .select('id, slug, title, published_at, created_at')
                .or(
                    `slug.ilike.%${searchTerm}%,title->>zh-HK.ilike.%${searchTerm}%,title->>en.ilike.%${searchTerm}%`
                )
                .limit(10)

            results.posts = posts || []
        }

        // 搜索询盘
        if (!type || type === 'inquiries' || type === 'all') {
            const { data: inquiries } = await supabase
                .from('inquiries')
                .select('id, email, company, message, status, created_at')
                .or(`email.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`)
                .limit(10)

            results.inquiries = inquiries || []
        }

        return {
            success: true,
            data: results,
            query: searchTerm,
        }
    } catch (error: any) {
        console.error('Search failed:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || '搜索失败',
        })
    }
})
