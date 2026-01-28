export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        const body = await readBody(event)
        const { ids, action, data } = body

        if (!Array.isArray(ids) || ids.length === 0) {
            throw createError({
                statusCode: 400,
                message: '请选择至少一个项目',
            })
        }

        if (!action || !['delete', 'update'].includes(action)) {
            throw createError({
                statusCode: 400,
                message: '无效的操作类型',
            })
        }

        let result

        if (action === 'delete') {
            // 批量删除
            const { error } = await supabase.from('posts').delete().in('id', ids)

            if (error) throw error

            // 记录操作日志
            await logAdminAction(event, {
                action: 'bulk_delete',
                resourceType: 'posts',
                resourceId: ids,
                details: {
                    count: ids.length,
                },
            })

            result = { deleted: ids.length }
        } else if (action === 'update') {
            // 批量更新
            if (!data) {
                throw createError({
                    statusCode: 400,
                    message: '缺少更新数据',
                })
            }

            const { error } = await supabase.from('posts').update(data).in('id', ids)

            if (error) throw error

            // 记录操作日志
            await logAdminAction(event, {
                action: 'bulk_update',
                resourceType: 'posts',
                resourceId: ids,
                details: {
                    count: ids.length,
                    updates: data,
                },
            })

            result = { updated: ids.length }
        }

        return {
            success: true,
            data: result,
        }
    } catch (error: any) {
        console.error('Bulk operation failed:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || '批量操作失败',
        })
    }
})
