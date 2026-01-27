import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  console.log('[Upload] Request received:', event.method, event.path)

  try {
    // 1. 检查身份验证
    const user = await serverSupabaseUser(event)

    if (!user) {
      console.error('[Upload] No user found in session')
      throw createError({
        statusCode: 401,
        statusMessage: '未授权：请先登录'
      })
    }

    // JWT token 中用户 ID 存储在 sub 字段中
    const userId = user.sub
    console.log('[Upload] User authenticated. ID:', userId, 'Email:', user.email)

    // 使用 service role client（具有完整权限，可以绕过 RLS）
    const client = serverSupabaseServiceRole(event)
    console.log('[Upload] Using service role client:', !!client)

    // 检查管理员角色
    console.log('[Upload] Checking admin role for user:', userId)
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    console.log('[Upload] Profile query result:', {
      hasProfile: !!profile,
      role: profile?.role,
      error: profileError?.message
    })

    if (profileError || !profile || profile.role !== 'admin') {
      console.error('[Upload] Admin check failed:', {
        profileError: profileError?.message,
        profile,
        hasProfile: !!profile,
        role: profile?.role,
        isAdmin: profile?.role === 'admin'
      })
      throw createError({
        statusCode: 403,
        statusMessage: '禁止访问：需要管理员权限'
      })
    }

    console.log('[Upload] Admin check passed ✓')

    // 2. 解析上传的文件
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      console.error('[Upload] No files in form data')
      throw createError({
        statusCode: 400,
        statusMessage: '没有上传文件'
      })
    }

    const file = formData.find(f => f.name === 'file') || formData[0]
    if (!file) {
      throw createError({ statusCode: 400, statusMessage: '没有找到文件字段' })
    }

    console.log('[Upload] File received:', file.filename, 'field:', file.name, 'type:', file.type, 'size:', file.data.length)

    // 3. 验证
    if (!file.type?.startsWith('image/')) {
      throw createError({ statusCode: 400, statusMessage: '只允许图片' })
    }

    // 4. 上传
    const bucketName = 'news-covers'
    const timestamp = Date.now()
    const extension = file.filename?.split('.').pop() || 'jpg'
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
          statusMessage: `存储桶 "${bucketName}" 不存在，请先在 Supabase 控制台创建它并设置为公开。`
        })
      }
      throw createError({
        statusCode: 500,
        statusMessage: uploadError.message
      })
    }

    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(fileName)

    console.log('[Upload] Success:', urlData.publicUrl)
    return {
      success: true,
      data: {
        publicUrl: urlData.publicUrl
      }
    }

  } catch (error: any) {
    console.error('[Upload] Fatal error:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || '未知错误'
    })
  }
})
