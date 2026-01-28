export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        const query = getQuery(event)
        const page = parseInt((query.page as string) || '1')
        const limit = parseInt((query.limit as string) || '50')
        const resourceType = query.type as string
        const userId = query.userId as string

        const offset = (page - 1) * limit

        // 构建查询
        let queryBuilder = supabase
            .from('admin_logs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        // 过滤条件
        if (resourceType) {
            queryBuilder = queryBuilder.eq('resource_type', resourceType)
        }
        if (userId) {
            queryBuilder = queryBuilder.eq('user_id', userId)
        }

        const { data: logs, error, count } = await queryBuilder

        if (error) throw error

        return {
            success: true,
            data: {
                logs: logs || [],
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
        }
    } catch (error: any) {
        console.error('Failed to fetch logs:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || '获取日志失败',
        })
    }
})
