/**
 * Lenis Smooth Scroll Plugin
 * 實現平滑滾動效果，提升用戶體驗
 */

import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical' as const,
    gestureDirection: 'vertical' as const,
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  })

  nuxtApp.provide('lenis', lenis)

  // 整合 ScrollTrigger 和 Lenis
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      const gsap = nuxtApp.$gsap as any

      if (gsap && gsap.ticker) {
        gsap.ticker.add((time: number) => {
          lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0)
      }
    })
  }

  // 響應式滾動循環
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  if (process.client) {
    requestAnimationFrame(raf)
  }
})
