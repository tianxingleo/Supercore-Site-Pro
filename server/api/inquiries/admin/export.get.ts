export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event)
        const query = getQuery(event)
        const format = (query.format as string) || 'json'

        if (!['json', 'csv'].includes(format)) {
            throw createError({
                statusCode: 400,
                message: '不支持的导出格式',
            })
        }

        // 获取所有询盘
        const { data: inquiries, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        // 记录操作日志
        await logAdminAction(event, {
            action: 'export',
            resourceType: 'inquiries',
            details: {
                format,
                count: inquiries?.length || 0,
            },
        })

        if (format === 'csv') {
            // 转换为 CSV
            const csv = convertToCSV(inquiries || [])
            setHeaders(event, {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="inquiries_${new Date().toISOString().split('T')[0]}.csv"`,
            })
            return csv
        } else {
            // 返回 JSON
            setHeaders(event, {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="inquiries_${new Date().toISOString().split('T')[0]}.json"`,
            })
            return {
                success: true,
                data: inquiries,
                exportedAt: new Date().toISOString(),
            }
        }
    } catch (error: any) {
        console.error('Export failed:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || '导出失败',
        })
    }
})

function convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return ''

    const headers = ['id', 'email', 'company', 'message', 'status', 'created_at']

    const rows = data.map((item) => {
        return [
            item.id,
            item.email,
            item.company || '',
            item.message,
            item.status,
            item.created_at,
        ]
            .map((field) => `"${String(field).replace(/"/g, '""')}"`)
            .join(',')
    })

    return [headers.join(','), ...rows].join('\n')
}
