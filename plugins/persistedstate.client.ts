// plugins/persistedstate.client.ts
import { createPersistedState } from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // 仅在浏览器端执行，服务端永远不会碰到它，500错误彻底根除
  nuxtApp.$pinia.use(createPersistedState())
})
