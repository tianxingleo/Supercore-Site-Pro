import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'

interface LogDetails {
    action: 'create' | 'update' | 'delete' | 'bulk_delete' | 'export' | 'bulk_update'
    resourceType: 'products' | 'posts' | 'inquiries' | 'solutions' | 'site_config'
    resourceId?: number | number[]
    details?: Record<string, any>
}

/**
 * 记录管理员操作日志
 */
export async function logAdminAction(event: H3Event, logData: LogDetails) {
    try {
        const supabase = serverSupabaseServiceRole(event)
        const user = event.context.user

        // 获取请求信息
        const headers = getHeaders(event)
        const ipAddress =
            headers['x-forwarded-for'] ||
            headers['x-real-ip'] ||
            event.node.req.socket.remoteAddress ||
            'unknown'
        const userAgent = headers['user-agent'] || 'unknown'

        // 插入日志
        const { error } = await supabase.from('admin_logs').insert({
            user_id: user?.id || null,
            user_email: user?.email || 'system',
            action: logData.action,
            resource_type: logData.resourceType,
            resource_id: Array.isArray(logData.resourceId) ? null : logData.resourceId,
            details: {
                ...logData.details,
                resource_ids: Array.isArray(logData.resourceId) ? logData.resourceId : undefined,
            },
            ip_address: ipAddress,
            user_agent: userAgent,
        })

        if (error) {
            console.error('Failed to log admin action:', error)
        }
    } catch (error) {
        console.error('Error logging admin action:', error)
    }
}
