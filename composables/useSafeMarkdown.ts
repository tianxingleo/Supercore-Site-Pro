import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * 安全的 Markdown 渲染器
 * 使用 DOMPurify 防止 XSS 攻击
 */
export function useSafeMarkdown() {
  // 配置 marked 选项
  marked.setOptions({
    breaks: true, // 支持换行
    gfm: true, // 支持 GitHub Flavored Markdown
  })

  /**
   * 渲染 Markdown 为安全的 HTML
   * @param content - Markdown 内容
   * @returns 清理后的 HTML
   */
  const renderMarkdown = (content: string): string => {
    if (!content) return ''

    try {
      // 1. 将 Markdown 转换为 HTML
      const html = marked(content) as string

      // 2. 使用 DOMPurify 清理 HTML，移除潜在的恶意代码
      const cleanHtml = DOMPurify.sanitize(html, {
        // 允许的标签
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
          'blockquote', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3',
          'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr',
          'th', 'td', 'div', 'span', 'hr'
        ],
        // 允许的属性
        ALLOWED_ATTR: [
          'href', 'class', 'target', 'rel', 'id'
        ],
        // 允许 data-* 属性
        ALLOW_DATA_ATTR: false,
        // 允许 URI 协议
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      })

      return cleanHtml
    } catch (error) {
      console.error('Markdown rendering error:', error)
      // 出错时返回纯文本，转义 HTML
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }
  }

  /**
   * 提取纯文本内容（用于复制等场景）
   * @param content - Markdown 内容
   * @returns 纯文本
   */
  const extractPlainText = (content: string): string => {
    if (!content) return ''

    try {
      const html = marked(content) as string
      const cleanHtml = DOMPurify.sanitize(html)

      // 创建临时 DOM 元素提取文本
      if (process.client) {
        const tmp = document.createElement('div')
        tmp.innerHTML = cleanHtml
        return tmp.textContent || tmp.innerText || ''
      }

      // 服务端简单处理
      return cleanHtml.replace(/<[^>]*>/g, '')
    } catch (error) {
      console.error('Plain text extraction error:', error)
      return content
    }
  }

  return {
    renderMarkdown,
    extractPlainText
  }
}
