/**
 * Image Placeholder Generator
 * 生成 SVG 圖片占位符用於開發階段
 */

export const generatePlaceholder = (
  width: number,
  height: number,
  text: string = 'Placeholder',
  bgColor: string = '#F5F5F7',
  textColor: string = '#1D1D1F'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Inter, sans-serif"
        font-size="${Math.min(width, height) / 10}"
        fill="${textColor}"
      >${text}</text>
    </svg>
  `.replace(/\s+/g, ' ').trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const productImages: Record<string, string> = {
  'enterprise-server-rack': generatePlaceholder(800, 600, 'Enterprise Server'),
  'high-performance-storage': generatePlaceholder(800, 600, 'Storage System'),
  'managed-switch': generatePlaceholder(800, 600, 'Network Switch'),
}

export const solutionImages: Record<string, string> = {
  'data-center-services': generatePlaceholder(400, 300, 'Data Center'),
  'network-infrastructure': generatePlaceholder(400, 300, 'Network'),
  'managed-operations': generatePlaceholder(400, 300, 'Operations'),
  'custom-development': generatePlaceholder(400, 300, 'Development'),
  'security-solutions': generatePlaceholder(400, 300, 'Security'),
  'cloud-services': generatePlaceholder(400, 300, 'Cloud'),
}
