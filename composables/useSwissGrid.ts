/**
 * Swiss Grid System Composable
 * 提供瑞士设计系统的网格布局工具函数
 */

export interface GridConfig {
  columns: number
  gap: string
  padding: string
  maxWidth: string
}

/**
 * 获取标准瑞士网格配置
 */
export const useSwissGrid = () => {
  /**
   * 计算列宽百分比
   * @param span - 跨越的列数 (1-12)
   * @param columns - 总列数 (默认 12)
   */
  const getColumnWidth = (span: number, columns: number = 12): string => {
    return `${(span / columns) * 100}%`
  }

  /**
   * 计算网格间距
   * @param size - 间距尺寸
   */
  const getGapSpacing = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
    const gaps = {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    }
    return gaps[size]
  }

  /**
   * 计算容器内边距
   * @param size - 内边距尺寸
   */
  const getPaddingSize = (size: 'sm' | 'md' | 'lg'): string => {
    const paddings = {
      sm: '1.5rem',
      md: '2rem',
      lg: '3rem',
    }
    return paddings[size]
  }

  /**
   * 计算负边距（用于创建全宽行）
   * @param padding - 内边距值
   */
  const getNegativeMargin = (padding: string): string => {
    return `calc(-${padding})`
  }

  /**
   * 获取响应式列数
   * @param breakpoint - 断点
   */
  const getResponsiveColumns = (breakpoint: 'sm' | 'md' | 'lg' | 'xl'): number => {
    const columns = {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 12,
    }
    return columns[breakpoint]
  }

  /**
   * 计算留白比例（瑞士设计要求 40%+ 留白）
   * @param contentWidth - 内容宽度
   */
  const calculateNegativeSpace = (contentWidth: number): {
    contentWidth: string
    negativeSpace: string
    percentage: number
  } => {
    const totalWidth = 100
    const content = contentWidth
    const negative = totalWidth - content
    const percentage = (negative / totalWidth) * 100

    return {
      contentWidth: `${content}%`,
      negativeSpace: `${negative}%`,
      percentage,
    }
  }

  /**
   * 验证留白比例是否符合瑞士设计标准（≥40%）
   * @param percentage - 留白百分比
   */
  const validateSwissRatio = (percentage: number): boolean => {
    return percentage >= 40
  }

  /**
   * 获取黄金比例布局尺寸
   * @param containerWidth - 容器宽度
   */
  const getGoldenRatioLayout = (
    containerWidth: number,
  ): {
    large: string
    small: string
  } => {
    const goldenRatio = 1.618
    const large = containerWidth / goldenRatio
    const small = containerWidth - large

    return {
      large: `${large}%`,
      small: `${small}%`,
    }
  }

  /**
   * 生成网格布局类名
   * @param config - 网格配置
   */
  const generateGridClasses = (config: Partial<GridConfig> = {}): string => {
    const defaultConfig: GridConfig = {
      columns: 12,
      gap: 'gap-6',
      padding: 'px-6',
      maxWidth: 'max-w-7xl',
    }

    const merged = { ...defaultConfig, ...config }

    return [
      'grid',
      `grid-cols-${merged.columns}`,
      merged.gap,
      merged.padding,
      merged.maxWidth,
      'mx-auto',
    ].join(' ')
  }

  return {
    getColumnWidth,
    getGapSpacing,
    getPaddingSize,
    getNegativeMargin,
    getResponsiveColumns,
    calculateNegativeSpace,
    validateSwissRatio,
    getGoldenRatioLayout,
    generateGridClasses,
  }
}
