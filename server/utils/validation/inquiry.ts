export function validateCreateInquiry(body: any) {
  const { email, company, message } = body

  // 必填字段验证
  if (!email || typeof email !== 'string' || email.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: '電郵地址為必填項',
    })
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: '訊息內容為必填項',
    })
  }

  // Email 格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: '電郵地址格式不正確',
    })
  }

  // 字段长度限制
  if (email.length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: '電郵地址過長',
    })
  }

  if (company && company.length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: '公司名稱過長',
    })
  }

  if (message.length > 5000) {
    throw createError({
      statusCode: 400,
      statusMessage: '訊息內容過長（最多 5000 字）',
    })
  }

  // 返回清理后的数据
  return {
    email: email.trim(),
    company: company ? company.trim() : null,
    message: message.trim(),
  }
}
