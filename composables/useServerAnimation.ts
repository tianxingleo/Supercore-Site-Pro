/**
 * Server Animation Composable
 * 管理伺服器爆炸動畫的滾動觸發效果
 */

import { ref, onMounted, onUnmounted } from 'vue'
import type { gsapType, ScrollTriggerType } from '#app'

export const useServerAnimation = () => {
  const nuxtApp = useNuxtApp()
  const { $gsap, $ScrollTrigger } = nuxtApp as {
    $gsap: { gsap: gsapType }
    $ScrollTrigger: { ScrollTrigger: ScrollTriggerType }
  }

  const { gsap } = $gsap
  const { ScrollTrigger } = $ScrollTrigger

  const timeline = ref<gsapType.Timeline>()
  const isAnimating = ref(false)

  /**
   * 初始化滾動動畫時間軸
   * @param callbacks - 動畫回調函數
   */
  const initAnimationTimeline = (callbacks: {
    onFadeIn?: (progress: number) => void
    onCaseOpen?: (progress: number) => void
    onExplode?: (progress: number) => void
    onReassemble?: (progress: number) => void
  }) => {
    // 創建主時間軸，綁定到整個頁面滾動
    timeline.value = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // 平滑動畫
        pin: false, // 不固定元素
      },
    })

    // 階段 1: 淡入效果 (0-20%)
    timeline.value.to(
      {},
      {
        duration: 20,
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onFadeIn?.(progress)
        },
      }
    )

    // 階段 2: 機櫃打開 (20-50%)
    timeline.value.to(
      {},
      {
        duration: 30,
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onCaseOpen?.(progress)
        },
      }
    )

    // 階段 3: 組件爆炸 (50-80%)
    timeline.value.to(
      {},
      {
        duration: 30,
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onExplode?.(progress)
        },
      }
    )

    // 階段 4: 重新組裝或過渡 (80-100%)
    timeline.value.to(
      {},
      {
        duration: 20,
        onUpdate: function () {
          const progress = this.progress()
          callbacks.onReassemble?.(progress)
        },
      }
    )
  }

  /**
   * 創建文字疊加層動畫
   * @param elements - 要動畫化的元素選擇器
   */
  const animateTextOverlays = (elements: string[]) => {
    elements.forEach((selector, index) => {
      gsap.fromTo(
        selector,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
          },
          delay: index * 0.2,
        }
      )
    })
  }

  /**
   * 為元素添加視差效果
   * @param selector - 元素選擇器
   * @param speed - 視差速度 (0-1)
   */
  const addParallaxEffect = (selector: string, speed: number = 0.5) => {
    gsap.to(selector, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: selector,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  /**
   * 清理動畫資源
   */
  const cleanup = () => {
    if (timeline.value) {
      timeline.value.kill()
    }
    ScrollTrigger.getAll().forEach((trigger: ScrollTriggerType) => {
      trigger.kill()
    })
  }

  onMounted(() => {
    isAnimating.value = true
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    timeline,
    isAnimating,
    initAnimationTimeline,
    animateTextOverlays,
    addParallaxEffect,
    cleanup,
  }
}
