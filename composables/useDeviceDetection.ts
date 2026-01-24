/**
 * Device Detection Composable
 * 檢測設備類型和性能，決定是否啟用高級動畫
 */

import { ref, onMounted, onUnmounted } from 'vue'

export interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  isLowPerformance: boolean
  pixelRatio: number
  viewportWidth: number
  viewportHeight: number
}

export const useDeviceDetection = () => {
  const deviceInfo = ref<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    isLowPerformance: false,
    pixelRatio: 1,
    viewportWidth: 1920,
    viewportHeight: 1080,
  })

  const checkDevice = () => {
    if (process.client) {
      const width = window.innerWidth
      const height = window.innerHeight
      const userAgent = navigator.userAgent.toLowerCase()
      const pixelRatio = window.devicePixelRatio || 1

      // 檢測觸摸設備
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // 檢測移動設備
      const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width < 768

      // 檢測平板
      const isTablet = /ipad|tablet|playbook|silk/i.test(userAgent) || (width >= 768 && width < 1024)

      // 檢測低性能設備（基於像素比和螢幕尺寸）
      const isLowPerformance = pixelRatio > 2 || width < 768 || isMobile

      deviceInfo.value = {
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        isTouch,
        isLowPerformance,
        pixelRatio,
        viewportWidth: width,
        viewportHeight: height,
      }
    }
  }

  const canUseWebGL = (): boolean => {
    if (process.client) {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    }
    return false
  }

  const canUseAdvanced3D = (): boolean => {
    return (
      !deviceInfo.value.isLowPerformance &&
      canUseWebGL() &&
      deviceInfo.value.isDesktop
    )
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', checkDevice)
    }
  })

  return {
    deviceInfo,
    checkDevice,
    canUseWebGL,
    canUseAdvanced3D,
  }
}
