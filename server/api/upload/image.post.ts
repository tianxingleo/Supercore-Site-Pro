import { serverSupabaseServiceRole } from '#supabase/server'
import { readMultipartFormData } from 'h3'
import { requireAdminAuth } from '~/server/utils/auth'
import { sanitizeStorageUrl } from '~/server/utils/storageUrl'

export default defineEventHandler(async (event) => {
  console.log('[Upload] Request received:', event.method, event.path)

  try {
    // 1. 使用与其他 admin API 一致的认证方式（含 cookie 回退）
    const { user } = await requireAdminAuth(event)
    const userId = user?.id || (user as any)?.sub
    console.log('[Upload] Admin authenticated. ID:', userId, 'Email:', (user as any).email)
    console.log('[Upload] Admin check passed ✓')

    // 获取 service role 客户端用于存储操作
    const client = serverSupabaseServiceRole(event)

    // 2. 解析上传的文件
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      console.error('[Upload] No files in form data')
      throw createError({
        statusCode: 400,
        message: '没有上传文件'
      })
    }

    const file = formData.find(f => f.name === 'file') || formData[0]
    if (!file) {
      throw createError({ statusCode: 400, message: '没有找到文件字段' })
    }

    console.log('[Upload] File received:', file.filename, 'field:', file.name, 'type:', file.type, 'size:', file.data.length)

    // 3. 验证
    if (!file.type?.startsWith('image/')) {
      throw createError({ statusCode: 400, message: '只允许图片' })
    }

    // 4. 上传
    const bucketField = formData.find(f => f.name === 'bucket')
    const bucketName = bucketField?.data.toString() || 'news-covers'
    const timestamp = Date.now()
    // 根据实际 content-type 决定扩展名（前端统一压缩为 jpeg）
    const mimeToExt: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
    const extension = mimeToExt[file.type || ''] || file.filename?.split('.').pop() || 'jpg'
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 7)}.${extension}`

    console.log('[Upload] Uploading to bucket:', bucketName, 'path:', fileName)

    const { data: uploadData, error: uploadError } = await client
      .storage
      .from(bucketName)
      .upload(fileName, file.data, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('[Upload] Supabase storage error:', uploadError)
      // 如果是 bucket 不存在，尝试说明
      if (uploadError.message.includes('bucket not found')) {
        throw createError({
          statusCode: 500,
          message: `存储桶 "${bucketName}" 不存在，请先在 Supabase 控制台创建它并设置为公开。`
        })
      }
      throw createError({
        statusCode: 500,
        message: uploadError.message
      })
    }

    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(fileName)

    const publicUrl = sanitizeStorageUrl(urlData.publicUrl) as string
    console.log('[Upload] Success:', publicUrl)
    return {
      success: true,
      data: {
        publicUrl
      }
    }

  } catch (error: any) {
    console.error('[Upload] Fatal error:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: error.message || '未知错误'
    })
  }
})
