import { serverSupabaseClient } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'
import { logAdminAction } from '~/server/utils/adminLogger'

export default defineEventHandler(async (event) => {
    // 强制管理员认证
    const { user } = await requireAdminAuth(event)

    // 设置 event.context.user 供 logAdminAction 使用
    event.context.user = user

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

        // 获取所有产品
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        // 记录操作日志
        await logAdminAction(event, {
            action: 'export',
            resourceType: 'products',
            details: {
                format,
                count: products?.length || 0,
            },
        })

        if (format === 'csv') {
            // 转换为 CSV
            const csv = convertToCSV(products || [])
            setHeaders(event, {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="products_${new Date().toISOString().split('T')[0]}.csv"`,
            })
            return csv
        } else {
            // 返回 JSON
            setHeaders(event, {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="products_${new Date().toISOString().split('T')[0]}.json"`,
            })
            return {
                success: true,
                data: products,
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

    // 获取所有字段
    const headers = [
        'id',
        'slug',
        'name_hk',
        'name_en',
        'category',
        'status',
        'is_featured',
        'created_at',
        'updated_at',
    ]

    // 创建 CSV 行
    const rows = data.map((item) => {
        return [
            item.id,
            item.slug,
            item.name?.['zh-HK'] || item.name?.hk || '',
            item.name?.en || '',
            item.category,
            item.status,
            item.is_featured,
            item.created_at,
            item.updated_at,
        ]
            .map((field) => `"${String(field).replace(/"/g, '""')}"`)
            .join(',')
    })

    return [headers.join(','), ...rows].join('\n')
}
