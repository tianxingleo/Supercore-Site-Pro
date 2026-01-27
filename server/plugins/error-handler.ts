import type { H3Error } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  const h3OnError = nitroApp.h3App.options.onError

  nitroApp.h3App.options.onError = (error: Error, event: H3Event) => {
    const h3Error = error as H3Error

    // Ignore 404 errors for /_nuxt/ path (Vite internal requests)
    // This is a known issue when using --host flag with Nuxt 3
    if (h3Error?.statusCode === 404 && event.path.startsWith('/_nuxt/')) {
      h3Error.unhandled = false
      return
    }

    // Call original error handler
    if (h3OnError) {
      return h3OnError(error, event)
    }
  }
})
