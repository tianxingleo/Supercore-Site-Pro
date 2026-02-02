/**
 * Lenis Smooth Scroll Plugin
 * 實現平滑滾動效果，提升用戶體驗
 */

import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  const lenis = new Lenis({
    duration: 1.0, // Snappier feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1, // Slightly more responsive
    touchMultiplier: 1.5,
    // 排除 AI 聊天窗口和其他需要原生滚动的元素
    wrapper: document.documentElement,
    content: document.body,
  })

  // 整合 ScrollTrigger 和 Lenis
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      const gsap = nuxtApp.$gsap as any
      const ScrollTrigger = nuxtApp.$ScrollTrigger as any

      if (gsap && gsap.ticker) {
        // 整合 GSAP Ticker - 這是同步動畫與滾動的最佳做法
        gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000)
        })

        // 防止幀率下降時的跳躍
        gsap.ticker.lagSmoothing(0)
      }

      // 確保 ScrollTrigger 使用 Lenis 的滾動代理
      if (ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update)
      }

      // 處理頁面高度變化 (例如圖片加載後)
      const resizeObserver = new ResizeObserver(() => {
        lenis.resize()
      })
      resizeObserver.observe(document.body)
    })
  }

  // 提供全局訪問
  return {
    provide: {
      lenis
    }
  }
})
