import { serverSupabaseServiceRole } from '#supabase/server'
import { requireAdminAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. 检查身份验证
  await requireAdminAuth(event)

  // 2. 获取产品 ID
  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: '无效的产品 ID'
    })
  }

  const client = serverSupabaseServiceRole(event)

  // 3. 查询产品
  const { data: originalProduct, error: fetchError } = await client
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (fetchError) {
    throw createError({
      statusCode: fetchError.code === 'PGRST116' ? 404 : 500,
      message: fetchError.code === 'PGRST116' ? '产品不存在' : `查询失败：${fetchError.message}`
    })
  }

  // 4. 构建克隆数据
  const cloneData = { ...originalProduct }
  
  // 删除不允许直接插入或由数据库自动生成的字段
  delete cloneData.id
  delete cloneData.created_at
  delete cloneData.updated_at

  // 修改特定字段以确保唯一性并标记为克隆
  cloneData.slug = `${cloneData.slug}-copy-${Math.floor(Date.now() / 1000)}`
  cloneData.status = 'draft' // 克隆的产品默认为草稿状态

  // 更新名称
  if (cloneData.name) {
    if (cloneData.name['zh-HK']) cloneData.name['zh-HK'] = `${cloneData.name['zh-HK']} (副本)`
    if (cloneData.name['zh-CN']) cloneData.name['zh-CN'] = `${cloneData.name['zh-CN']} (副本)`
    if (cloneData.name['en']) cloneData.name['en'] = `${cloneData.name['en']} (Copy)`
    
    // 如果存在旧结构的字段，也一起更新
    if (cloneData.name.hk) cloneData.name.hk = `${cloneData.name.hk} (副本)`
    if (cloneData.name.cn) cloneData.name.cn = `${cloneData.name.cn} (副本)`
  }

  // 5. 插入克隆数据
  const { data: newProduct, error: insertError } = await client
    .from('products')
    .insert(cloneData)
    .select()
    .single()

  if (insertError) {
    throw createError({
      statusCode: 500,
      message: `克隆产品失败：${insertError.message}`
    })
  }

  return {
    success: true,
    data: newProduct
  }
})
