import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig(event)

  console.log('[Auth API] Received magic login request, query:', query)

  if (query.test !== 'true' && query.test !== '') {
    throw createError({ statusCode: 403, message: 'Unauthorized: Magic link parameter missing' })
  }

  const supabaseUrl = config.supabaseService.url || config.public.supabaseUrl
  const supabaseServiceKey = config.supabaseService.key

  console.log('[Auth API] Using Supabase URL:', supabaseUrl)

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Auth API] Config missing:', { hasUrl: !!supabaseUrl, hasKey: !!supabaseServiceKey })
    throw createError({ 
      statusCode: 500, 
      message: `Supabase configuration missing on server (URL: ${!!supabaseUrl}, Key: ${!!supabaseServiceKey}, Env: ${process.env.NODE_ENV})` 
    })
  }

  // 使用 Service Role Key 创建管理客户端
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const adminEmail = 'admin@supercore.hk'
  const adminPassword = 'SupercoreMagic123!' // 固定测试密码，仅内部使用
  
  try {
    // 1. 尝试获取现有用户
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('[Auth API] listUsers error:', listError)
      throw createError({ 
        statusCode: 500, 
        message: `Auth Service Error: ${listError.message} (Role: service_role)` 
      })
    }
    
    let targetUser = users.users.find(u => u.email === adminEmail)

    // 2. 如果用户不存在，则创建一个
    if (!targetUser) {
      console.log('[Auth] Creating test admin user...')
      const { data: newUser, error: createErrorMsg } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Test Administrator' }
      })
      
      if (createErrorMsg) {
        console.error('[Auth API] createUser error:', createErrorMsg)
        throw createError({ statusCode: 500, message: `Create User Failed: ${createErrorMsg.message}` })
      }
      targetUser = newUser.user
    } else {
      // 3. 如果用户已存在，确保密码正确（以防万一被改过）
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
        password: adminPassword
      })
      if (updateError) {
        console.warn('[Auth API] Password update failed (might be expected):', updateError.message)
      }
    }

    // 4. 核心：确保该用户在 profiles 表中拥有 admin 权限
    if (targetUser) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: targetUser.id,
          role: 'admin',
          full_name: 'Test Administrator',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('[Auth] Profile upsert failed:', profileError)
        // 这个不一定要 throw，因为 Auth 实际上已经通了，但为了严谨我们可以记录它
      }
    }
  } catch (err: any) {
    console.error('[Auth API] Fatal error:', err)
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      message: `System Error: ${err.message || 'Unknown error'}`
    })
  }

  return {
    email: adminEmail,
    password: adminPassword
  }
})
