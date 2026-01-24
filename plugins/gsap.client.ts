/**
 * GSAP Plugin Configuration
 * 配置 GSAP 和 ScrollTrigger 用於滾動動畫
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  // 註冊 ScrollTrigger 插件
  gsap.registerPlugin(ScrollTrigger)

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
