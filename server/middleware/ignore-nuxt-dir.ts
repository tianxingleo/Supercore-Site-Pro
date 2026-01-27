import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const path = event.path
  if (path === '/_nuxt' || path === '/_nuxt/') {
    return {
      status: 200,
      body: 'Ignore _nuxt directory request'
    }
  }
})
