import { marked } from 'marked'

/**
 * Markdown 渲染器
 */
export function useSafeMarkdown() {
  // 配置 marked 选项
  marked.setOptions({
    breaks: true, // 支持换行
    gfm: true, // 支持 GitHub Flavored Markdown
  })

  /**
   * 渲染 Markdown 为 HTML
   * @param content - Markdown 内容
   * @returns HTML
   */
  const renderMarkdown = (content: string): string => {
    if (!content) return ''

    try {
      const html = marked(content) as string
      return html
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return content
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

      // 创建临时 DOM 元素提取文本
      if (process.client) {
        const tmp = document.createElement('div')
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ''
      }

      // 服务端简单处理
      return html.replace(/<[^>]*>/g, '')
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
