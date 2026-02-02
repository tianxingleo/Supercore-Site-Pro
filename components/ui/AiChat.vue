<script setup lang="ts">
import { useChat } from 'ai/vue'
import { ref } from 'vue'

const isOpen = ref(false)
// useChat 会自动调用 /api/chat
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/ai-chat'
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <div v-if="isOpen" class="mb-4 w-[350px] h-[500px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
      <div class="p-4 bg-blue-600 text-white flex justify-between items-center">
        <span class="font-medium">Supercore AI 助手</span>
        <button @click="isOpen = false" class="hover:opacity-80">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/20">
        <div v-for="m in messages" :key="m.id"
             :class="['p-3 rounded-lg text-sm max-w-[85%]', m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white dark:bg-gray-800 border dark:border-gray-700 mr-auto']">
          {{ m.content }}
        </div>
        <div v-if="isLoading" class="text-xs text-gray-400 ml-2">Thinking...</div>
      </div>

      <form @submit="handleSubmit" class="p-3 border-t dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
        <input
          v-model="input"
          @change="handleInputChange"
          placeholder="請問有什麼可以幫您？"
          class="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button type="submit" :disabled="isLoading" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          Send
        </button>
      </form>
    </div>

    <button @click="isOpen = !isOpen" class="w-14 h-14 bg-blue-600 rounded-full text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
      <span class="text-2xl">💬</span>
    </button>
  </div>
</template>
