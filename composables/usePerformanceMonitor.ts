/**
 * Performance Monitoring Composable
 * 監控網站性能指標
 */

import { ref, onMounted, onUnmounted } from 'vue'

export interface PerformanceMetrics {
  // Core Web Vitals
  LCP: number | null // Largest Contentful Paint (目標: < 2.5s)
  FID: number | null // First Input Delay (目標: < 100ms)
  CLS: number | null // Cumulative Layout Shift (目標: < 0.1)
  // Other metrics
  FCP: number | null // First Contentful Paint (目標: < 1.8s)
  TTI: number | null // Time to Interactive (目標: < 3.8s)
  loadTime: number | null // 頁面加載時間
}

export const usePerformanceMonitor = () => {
  const metrics = ref<PerformanceMetrics>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTI: null,
    loadTime: null,
  })

  const isMonitoring = ref(false)

  const measureLCP = () => {
    if (process.client && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          metrics.value.LCP = lastEntry.startTime
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        return observer
      } catch (e) {
        console.warn('LCP measurement not supported:', e)
      }
    }
    return null
  }

  const measureFID = () => {
    if (process.client && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            metrics.value.FID = entry.processingStart - entry.startTime
          })
        })
        observer.observe({ entryTypes: ['first-input'] })
        return observer
      } catch (e) {
        console.warn('FID measurement not supported:', e)
      }
    }
    return null
  }

  const measureCLS = () => {
    if (process.client && 'PerformanceObserver' in window) {
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              metrics.value.CLS = clsValue
            }
          })
        })
        observer.observe({ entryTypes: ['layout-shift'] })
        return observer
      } catch (e) {
        console.warn('CLS measurement not supported:', e)
      }
    }
    return null
  }

  const measureFCP = () => {
    if (process.client && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            metrics.value.FCP = (fcpEntry as any).startTime
          }
        })
        observer.observe({ entryTypes: ['paint'] })
        return observer
      } catch (e) {
        console.warn('FCP measurement not supported:', e)
      }
    }
    return null
  }

  const measureLoadTime = () => {
    if (process.client) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any
        if (navigation) {
          metrics.value.loadTime = navigation.loadEventEnd - navigation.startTime
        }
      })
    }
  }

  const startMonitoring = () => {
    if (isMonitoring.value) return

    isMonitoring.value = true

    const observers = [
      measureLCP(),
      measureFID(),
      measureCLS(),
      measureFCP(),
    ]

    measureLoadTime()

    // Cleanup function
    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }

  const getPerformanceGrade = (metric: keyof PerformanceMetrics): string => {
    const value = metrics.value[metric]
    if (value === null) return 'N/A'

    switch (metric) {
      case 'LCP':
        if (value < 2500) return 'Good'
        if (value < 4000) return 'Needs Improvement'
        return 'Poor'
      case 'FID':
        if (value < 100) return 'Good'
        if (value < 300) return 'Needs Improvement'
        return 'Poor'
      case 'CLS':
        if (value < 0.1) return 'Good'
        if (value < 0.25) return 'Needs Improvement'
        return 'Poor'
      case 'FCP':
        if (value < 1800) return 'Good'
        if (value < 3000) return 'Needs Improvement'
        return 'Poor'
      default:
        return 'N/A'
    }
  }

  onMounted(() => {
    const cleanup = startMonitoring()

    onUnmounted(() => {
      cleanup?.()
    })
  })

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    getPerformanceGrade,
  }
}
