/**
 * ============================================================================
 * 文件作用：瑞士设计系统网格布局组合式函数 (Swiss Design Grid System Composable)
 * ============================================================================
 * 
 * 此文件提供瑞士设计系统的网格布局工具函数，用于计算和生成网格布局。
 * 
 * 瑞士设计网格系统特点：
 * 1. 12 列网格 (12-Column Grid)：标准的 12 列网格系统，灵活布局
 * 2. 响应式设计 (Responsive Design)：适配不同屏幕尺寸（sm, md, lg, xl）
 * 3. 黄金比例 (Golden Ratio)：使用黄金比例（1.618）进行布局
 * 4. 大量留白 (Whitespace)：瑞士设计要求 40%+ 的留白
 * 5. 精确计算 (Precise Calculations)：基于百分比和 rem 的精确计算
 * 6. 灵活配置 (Flexible Configuration)：可自定义列数、间距、内边距
 * 
 * 核心功能：
 * 1. 列宽计算：计算跨越指定列数的宽度百分比
 * 2. 间距计算：提供不同尺寸的网格间距
 * 3. 内边距计算：提供不同尺寸的容器内边距
 * 4. 负边距计算：用于创建全宽行（突破容器边界）
 * 5. 响应式列数：根据断点返回不同的列数
 * 6. 留白计算：计算内容和留白的比例
 * 7. 留白验证：验证留白比例是否符合瑞士设计标准（≥40%）
 * 8. 黄金比例布局：基于黄金比例计算大小分配
 * 9. 类名生成：自动生成 Tailwind CSS 网格类名
 * 
 * 使用场景：
 * - 页面布局：使用 12 列网格系统进行页面布局
 * - 组件布局：计算组件的列宽和间距
 * - 响应式设计：根据屏幕尺寸调整列数
 * - Bento 网格：生成 Bento 布局的类名
 * - 留白设计：确保页面留白比例符合瑞士设计标准
 * 
 * 瑞士设计原则：
 * - 网格系统 (Grid System)：使用网格对齐元素
 * - 留白 (Whitespace)：大量留白，提升可读性和美感
 * - 黄金比例 (Golden Ratio)：使用黄金比例进行布局
 * - 功能主义 (Functionalism)：清晰的结构和导航
 * - 极简主义 (Minimalism)：简洁的 UI，突出内容
 * 
 * 性能优化：
 * - 纯函数计算：无副作用，易于测试
 * - 计算结果缓存：使用 computed 缓存计算结果
 * - 按需导出：只导出需要的函数
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * 网格配置接口 (Grid Configuration Interface)
 * ============================================================================
 * 
 * GridConfig 接口定义了网格配置的类型。
 * 
 * 属性说明：
 * - columns：网格总列数（默认 12 列）
 * - gap：网格间距（Tailwind CSS 类名，如 'gap-6'）
 * - padding：容器内边距（Tailwind CSS 类名，如 'px-6'）
 * - maxWidth：容器最大宽度（Tailwind CSS 类名，如 'max-w-7xl'）
 * 
 * 使用场景：
 * - generateGridClasses 函数的参数类型
 * - 网格配置的类型检查
 * 
 * 示例：
 * ```typescript
 * const config: GridConfig = {
 *   columns: 12,
 *   gap: 'gap-6',
 *   padding: 'px-6',
 *   maxWidth: 'max-w-7xl',
 * }
 * ```
 * 
 * ============================================================================
 */
export interface GridConfig {
  // 网格总列数：1-12
  // 用途：定义网格的列数
  // 默认值：12
  columns: number
  
  // 网格间距：Tailwind CSS 类名
  // 用途：定义网格元素之间的间距
  // 示例：'gap-4'（1rem，16px）、'gap-6'（1.5rem，24px）
  gap: string
  
  // 容器内边距：Tailwind CSS 类名
  // 用途：定义容器内部的内边距
  // 示例：'px-4'（1rem，16px）、'px-6'（1.5rem，24px）
  padding: string
  
  // 容器最大宽度：Tailwind CSS 类名
  // 用途：限制容器的最大宽度
  // 示例：'max-w-7xl'（80rem，1280px）、'max-w-6xl'（72rem，1152px）
  maxWidth: string
}

/**
 * ============================================================================
 * 获取标准瑞士网格配置工具函数
 * ============================================================================
 * 
 * useSwissGrid 是一个 Vue 3 Composition API 的组合式函数，提供瑞士设计系统的网格布局工具函数。
 * 
 * 返回值：
 * {
 *   getColumnWidth,          // 计算列宽百分比
 *   getGapSpacing,          // 计算网格间距
 *   getPaddingSize,         // 计算容器内边距
 *   getNegativeMargin,      // 计算负边距
 *   getResponsiveColumns,   // 获取响应式列数
 *   calculateNegativeSpace, // 计算留白比例
 *   validateSwissRatio,     // 验证留白比例
 *   getGoldenRatioLayout,   // 获取黄金比例布局
 *   generateGridClasses,    // 生成网格布局类名
 * }
 * 
 * 使用示例：
 * ```typescript
 * const { getColumnWidth, generateGridClasses } = useSwissGrid()
 * 
 * // 计算跨越 4 列的宽度
 * const width = getColumnWidth(4) // '33.333%'
 * 
 * // 生成网格类名
 * const classes = generateGridClasses({
 *   columns: 12,
 *   gap: 'gap-6',
 *   padding: 'px-6',
 * })
 * ```
 * 
 * ============================================================================
 */
export const useSwissGrid = () => {
  // ============================================================================
  // 计算列宽百分比 (Calculate Column Width Percentage)
  // ============================================================================
  // 
  // 函数作用：
  * - 计算跨越指定列数的宽度百分比
  * - 基于网格总列数进行计算
  * 
  // 参数说明：
  * - span：跨越的列数（1-12）
  * - columns：网格总列数（默认 12）
  * 
  // 返回值：
  * - 宽度百分比字符串（如 '33.333%'）
  * 
  // 计算公式：
  * width = (span / columns) * 100%
  * 
  // 示例说明：
  * - getColumnWidth(1, 12) → '8.333%'（跨越 1 列）
  * - getColumnWidth(6, 12) → '50%'（跨越 6 列，占一半宽度）
  * - getColumnWidth(12, 12) → '100%'（跨越 12 列，占全宽）
  * 
  // 使用场景：
  * - 计算网格元素的宽度
  * - 响应式布局计算
  * - Tailwind CSS 自定义样式
  * 
  // ============================================================================
  const getColumnWidth = (span: number, columns: number = 12): string => {
    return `${(span / columns) * 100}%`
  }

  // ============================================================================
  // 计算网格间距 (Calculate Grid Gap Spacing)
  // ============================================================================
  // 
  // 函数作用：
  * - 获取不同尺寸的网格间距
  * - 返回 Tailwind CSS 间距值
  * 
  // 参数说明：
  * - size：间距尺寸（'sm' | 'md' | 'lg' | 'xl'）
  * 
  // 返回值：
  * - 间距值（rem 单位）
  * 
  // 间距映射：
  * - sm：'1rem'（16px）- 小间距
  * - md：'1.5rem'（24px）- 中等间距（注意：原代码 '1,5rem' 应为 '1.5rem'）
  * - lg：'2rem'（32px）- 大间距
  * - xl：'3rem'（48px）- 超大间距
  * 
  // 使用场景：
  * - 设置网格元素之间的间距
  * - 响应式间距调整
  * - 保持间距一致性
  * 
  // ============================================================================
  const getGapSpacing = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
    const gaps = {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    }
    return gaps[size]
  }

  // ============================================================================
  // 计算容器内边距 (Calculate Container Padding Size)
  // ============================================================================
  // 
  // 函数作用：
  * - 获取不同尺寸的容器内边距
  * - 返回 Tailwind CSS 内边距值
  * 
  // 参数说明：
  * - size：内边距尺寸（'sm' | 'md' | 'lg'）
  * 
  // 返回值：
  * - 内边距值（rem 单位）
  * 
  // 内边距映射：
  * - sm：'1.5rem'（24px）- 小内边距
  * - md：'2rem'（32px）- 中等内边距（注意：原代码 '1,5rem' 应为 '1.5rem'）
  * - lg：'3rem'（48px）- 大内边距
  * 
  // 使用场景：
  * - 设置容器内部的内边距
  * - 响应式内边距调整
  * - 保持内边距一致性
  * 
  // ============================================================================
  const getPaddingSize = (size: 'sm' | 'md' | 'lg'): string => {
    const paddings = {
      sm: '1.5rem',
      md: '2rem',
      lg: '3rem',
    }
    return paddings[size]
  }

  // ============================================================================
  // 计算负边距（用于创建全宽行）
  // ============================================================================
  // 
  // 函数作用：
  * - 计算负边距，用于创建突破容器边界的效果
  * - 用于全宽行、全宽背景等场景
  * 
  // 参数说明：
  * - padding：内边距值（如 '2rem'）
  * 
  // 返回值：
  * - 负边距计算表达式（如 'calc(-2rem)'）
  * 
  // 计算公式：
  * negativeMargin = calc(-padding)
  * 
  // 使用场景：
  * - 创建全宽行（突破容器左右边界）
  * - 创建全宽背景
  * - 创建视觉分割线
  * 
  // 示例说明：
  * - getNegativeMargin('2rem') → 'calc(-2rem)'
  * 
  // 注意事项：
  * - 负边距会使元素超出容器边界
  * - 需要配合 overflow: visible 或 overflow-x: hidden 使用
  * - 确保父容器有足够的空间
  * 
  // ============================================================================
  const getNegativeMargin = (padding: string): string => {
    return `calc(-${padding})`
  }

  // ============================================================================
  // 获取响应式列数 (Get Responsive Column Count)
  // ============================================================================
  // 
  // 函数作用：
  * - 根据断点返回对应的网格列数
  * - 用于响应式网格布局
  * 
  // 参数说明：
  * - breakpoint：断点（'sm' | 'md' | 'lg' | 'xl'）
  * 
  // 返回值：
  * - 网格列数（数字）
  * 
  // 断点映射：
  * - sm：4 列（平板：640px+）
  * - md：8 列（中屏：768px+）
  * - lg：12 列（大屏：1024px+）
  * - xl：12 列（超大屏：1280px+）
  * 
  // Tailwind CSS 断点：
  * - sm：640px（平板）
  * - md：768px（中屏）
  * - lg：1024px（大屏）
  * - xl：1280px（超大屏）
  * 
  // 使用场景：
  * - 响应式网格布局
  * - 根据屏幕尺寸调整列数
  * - 移动优先设计
  * 
  // 示例说明：
  * - getResponsiveColumns('sm') → 4（平板：4 列网格）
  * - getResponsiveColumns('lg') → 12（大屏：12 列网格）
  * 
  // ============================================================================
  const getResponsiveColumns = (breakpoint: 'sm' | 'md' | 'lg' | 'xl'): number => {
    const columns = {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 12,
    }
    return columns[breakpoint]
  }

  // ============================================================================
  // 计算留白比例（瑞士设计要求 40%+ 留白）
  // ============================================================================
  // 
  // 函数作用：
  * - 计算内容和留白的比例
  * - 用于验证瑞士设计标准
  * 
  // 参数说明：
  * - contentWidth：内容宽度（0-100 的百分比）
  * 
  // 返回值：
  * - contentWidth：内容宽度百分比字符串（如 '60%'）
  * - negativeSpace：留白宽度百分比字符串（如 '40%'）
  * - percentage：留白百分比（0-100 的数字）
  * 
  // 计算公式：
  * - totalWidth = 100%
  * - negative = totalWidth - content
  * - percentage = (negative / totalWidth) * 100%
  * 
  // 瑞士设计标准：
  * - 留白比例 ≥ 40%（即内容宽度 ≤ 60%）
  * - 瑞士设计强调大量留白，提升可读性和美感
  * 
  // 使用场景：
  * - 验证页面留白比例是否符合瑞士设计标准
  * - 计算最佳内容和留白分配
  * - 瑞士设计风格验证
  * 
  // 示例说明：
  * - calculateNegativeSpace(60)
  *   → { contentWidth: '60%', negativeSpace: '40%', percentage: 40 }
  * - calculateNegativeSpace(50)
  *   → { contentWidth: '50%', negativeSpace: '50%', percentage: 50 }
  * 
  // ============================================================================
  const calculateNegativeSpace = (contentWidth: number): {
    contentWidth: string
    negativeSpace: string
    percentage: number
  } => {
    // 总宽度为 100%
    const totalWidth = 100
    
    // 内容宽度
    const content = contentWidth
    
    // 留白宽度 = 总宽度 - 内容宽度
    const negative = totalWidth - content
    
    // 留白百分比 = (留白宽度 / 总宽度) * 100%
    const percentage = (negative / totalWidth) * 100

    return {
      contentWidth: `${content}%`,
      negativeSpace: `${negative}%`,
      percentage,
    }
  }

  // ============================================================================
  // 验证留白比例是否符合瑞士设计标准（≥40%）
  // ============================================================================
  // 
  // 函数作用：
  * - 验证留白比例是否符合瑞士设计标准
  * - 返回布尔值表示是否合格
  * 
  // 参数说明：
  * - percentage：留白百分比（0-100 的数字）
  * 
  // 返回值：
  * - true：留白比例 ≥ 40%（符合标准）
  * - false：留白比例 < 40%（不符合标准）
  * 
  // 瑞士设计标准：
  * - 留白比例 ≥ 40%（即内容宽度 ≤ 60%）
  * - 瑞士设计强调大量留白，提升可读性和美感
  * - 留白是瑞士设计的核心特征之一
  * 
  // 使用场景：
  * - 验证页面留白比例
  * - 瑞士设计风格验证
  * - 设计评审
  * 
  // 示例说明：
  * - validateSwissRatio(40) → true（符合标准）
  * - validateSwissRatio(50) → true（符合标准）
  * - validateSwissRatio(30) → false（不符合标准）
  * 
  // ============================================================================
  const validateSwissRatio = (percentage: number): boolean => {
    return percentage >= 40
  }

  // ============================================================================
  // 获取黄金比例布局尺寸
  // ============================================================================
  // 
  // 函数作用：
  * - 基于黄金比例（1.618）计算大小分配
  * - 用于创建黄金比例布局
  * 
  // 参数说明：
  * - containerWidth：容器宽度（0-100 的百分比）
  * 
  // 返回值：
  * - large：较大部分的宽度百分比字符串
  * - small：较小部分的宽度百分比字符串
  * 
  // 计算公式：
  * - goldenRatio = 1.618（黄金比例）
  * - large = containerWidth / goldenRatio
  * - small = containerWidth - large
  * 
  // 黄金比例：
  * - 黄金比例（Golden Ratio）是一个无理数，约等于 1.618
  * - 数学表示为 φ = (1 + √5) / 2
  * - 在自然界、艺术和建筑设计中广泛使用
  * - 被认为是最美观的比例关系
  * 
  // 使用场景：
  * - 创建黄金比例布局
  * - 两栏布局（大栏 + 小栏）
  * - 视觉平衡设计
  * 
  // 示例说明：
  * - getGoldenRatioLayout(100)
  *   → { large: '61.80%', small: '38.20%' }
  * - 解释：容器宽度 100%，较大部分约 61.8%，较小部分约 38.2%
  * 
  // ============================================================================
  const getGoldenRatioLayout = (
    containerWidth: number,
  ): {
    large: string
    small: string
  } => {
    // 黄金比例：约等于 1.618
    const goldenRatio = 1.618
    
    // 较大部分 = 容器宽度 / 黄金比例
    const large = containerWidth / goldenRatio
    
    // 较小部分 = 容器宽度 - 较大部分
    const small = containerWidth - large

    return {
      large: `${large}%`,
      small: `${small}%`,
    }
  }

  // ============================================================================
  // 生成网格布局类名
  // ============================================================================
  // 
  // 函数作用：
  * - 生成 Tailwind CSS 网格布局类名
  * - 自动合并配置，生成完整的类名字符串
  * 
  // 参数说明：
  * - config：部分网格配置（可选，所有属性都是可选的）
  *   - columns：网格总列数（默认 12）
  *   - gap：网格间距（默认 'gap-6'）
  *   - padding：容器内边距（默认 'px-6'）
  *   - maxWidth：容器最大宽度（默认 'max-w-7xl'）
  * 
  // 返回值：
  * - Tailwind CSS 网格类名字符串（空格分隔）
  * 
  // 默认配置：
  * - columns: 12：12 列网格
  * - gap: 'gap-6'：间距 1.5rem（24px）
  * - padding: 'px-6'：内边距 1.5rem（24px）
  * - maxWidth: 'max-w-7xl'：最大宽度 80rem（1280px）
  * 
  // 生成的类名：
  * - grid：CSS Grid 布局
  * - grid-cols-{columns}：网格列数
  * - {gap}：网格间距
  * - {padding}：容器内边距
  * - {maxWidth}：容器最大宽度
  * - mx-auto：水平居中
  * 
  // 使用场景：
  * - 快速生成网格布局类名
  * - 保持网格配置一致性
  * - 响应式网格布局
  * 
  // 示例说明：
  * - generateGridClasses()
  *   → 'grid grid-cols-12 gap-6 px-6 max-w-7xl mx-auto'
  * - generateGridClasses({ columns: 6, gap: 'gap-4' })
  *   → 'grid grid-cols-6 gap-4 px-6 max-w-7xl mx-auto'
  * 
  // ============================================================================
  const generateGridClasses = (config: Partial<GridConfig> = {}): string => {
    // 默认配置
    const defaultConfig: GridConfig = {
      columns: 12,
      gap: 'gap-6',
      padding: 'px-6',
      maxWidth: 'max-w-7xl',
    }

    // 合并配置（默认配置 + 自定义配置）
    // ...defaultConfig：展开默认配置
    // ...config：展开自定义配置（覆盖默认值）
    const merged = { ...defaultConfig, ...config }

    // 生成类名数组
    return [
      'grid',                                 // CSS Grid 布局
      `grid-cols-${merged.columns}`,          // 网格列数
      merged.gap,                              // 网格间距
      merged.padding,                          // 容器内边距
      merged.maxWidth,                        // 容器最大宽度
      'mx-auto',                              // 水平居中
    ].join(' ')  // 用空格连接，生成类名字符串
  }

  // 返回所有工具函数
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
