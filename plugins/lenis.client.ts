/**
 * Lenis Smooth Scroll Plugin
 * 實現平滑滾動效果，提升用戶體驗
 */

import { useLenis } from 'useLenis'
import type { LenisOptions } from '@studio-freight/lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const lenisOptions: LenisOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  }

  const lenis = useLenis(lenisOptions)

  nuxtApp.provide('lenis', lenis)

  // 整合 ScrollTrigger 和 Lenis
  if (process.client) {
    nuxtApp.hook('page:finish', () => {
      const { gsap } = useNuxtApp().$gsap as { gsap: any }

      gsap.ticker.add((time: number) => {
        lenis.value?.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    })
  }
})
