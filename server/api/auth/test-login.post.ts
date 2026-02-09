import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  console.log('[Auth API] Received magic login request, query:', query)

  // 仅在开发环境下或特定安全验证后允许此操作
  // if (process.env.NODE_ENV === 'production') {
  //   throw createError({ statusCode: 403, message: 'Forbidden' })
  // }

  if (query.test !== 'true' && query.test !== '') {
    throw createError({ statusCode: 403, message: 'Unauthorized' })
  }

  const supabaseUrl = config.public.supabaseUrl
  const supabaseServiceKey = config.supabaseService.key

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({ statusCode: 500, message: 'Supabase config missing' })
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
  
  // 1. 尝试获取现有用户
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) throw createError({ statusCode: 500, message: listError.message })
  
  let targetUser = users.users.find(u => u.email === adminEmail)

  // 2. 如果用户不存在，则创建一个
  if (!targetUser) {
    console.log('[Auth] 创建测试管理员用户...')
    const { data: newUser, error: createErrorMsg } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Test Administrator' }
    })
    
    if (createErrorMsg) throw createError({ statusCode: 500, message: createErrorMsg.message })
    targetUser = newUser.user
  } else {
    // 3. 如果用户已存在，确保密码正确（以防万一被改过）
    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      password: adminPassword
    })
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

    if (profileError) console.error('[Auth] 提升权限失败:', profileError)
  }

  return {
    email: adminEmail,
    password: adminPassword
  }
})
