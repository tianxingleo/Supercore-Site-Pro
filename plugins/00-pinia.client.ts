// plugins/00-pinia.client.ts
import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize Pinia
  const pinia = createPinia()

  // Make pinia available in the app
  nuxtApp.vueApp.use(pinia)

  // Provide pinia instance globally
  nuxtApp.provide('pinia', pinia)

  console.log('[Pinia] Initialized successfully')
})
