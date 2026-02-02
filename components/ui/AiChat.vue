<script setup lang="ts">
import { useChat } from 'ai/vue'
import { ref, watch, nextTick, computed } from 'vue'
import { marked } from 'marked'

const isOpen = ref(false)
const scrollContainer = ref<HTMLDivElement | null>(null)

// useChat 会自动调用 /api/chat
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/ai-chat'
})

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true, // 支持 GitHub Flavored Markdown
})

// 渲染 Markdown 为 HTML
const renderMarkdown = (content: string) => {
  return marked(content)
}

// 监听消息变化，自动滚动到底部
watch(messages, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}, { deep: true })

// 监听打开状态，打开时也滚动到底部
watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
    <!-- Chat Window -->
    <div
      v-if="isOpen"
      data-lenis-prevent
      class="mb-4 w-[420px] max-w-[90vw] h-[650px] max-h-[85vh] bg-white dark:bg-zinc-950 border border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right"
    >
      <!-- Header with Swiss Grid Info -->
      <div class="p-4 bg-white dark:bg-zinc-950 text-black dark:text-white flex justify-between items-center select-none border-b border-black dark:border-white relative overflow-hidden text-nowrap">
        <!-- Background Scanning Line (Header) -->
        <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 dark:via-white/5 to-transparent h-full w-full -translate-y-full animate-[scan_2s_linear_infinite]"></div>
        
        <div class="flex items-center gap-4">
          <div class="flex flex-col">
            <span class="text-[9px] leading-none opacity-40 font-mono tracking-widest uppercase mb-1">Terminal v2.1.0</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-black dark:bg-white animate-pulse"></div>
              <span class="font-bold tracking-tighter uppercase text-base italic">Supercore AI</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="hidden sm:flex flex-col items-end mr-4 font-mono text-[9px] opacity-40 uppercase">
            <span>Lat: 22.2988° N</span>
            <span>Lng: 114.1741° E</span>
          </div>
          <button 
            @click="isOpen = false" 
            class="group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all p-2 border border-black dark:border-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter" class="group-hover:rotate-90 transition-transform duration-300"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- Messages Area with Grid Pattern -->
      <div
        ref="scrollContainer"
        class="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-10 relative scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent bg-[#F5F5F7] dark:bg-black"
        style="overscroll-behavior: contain; background-image: radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 24px 24px;"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="mt-8 space-y-6 select-none relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-nowrap">
          <div class="w-12 h-0.5 bg-black dark:bg-white"></div>
          <h2 class="font-bold text-4xl tracking-tighter text-black dark:text-white uppercase leading-[0.85]">
            Modular<br/>Intelligence.
          </h2>
          <div class="space-y-4 max-w-[300px]">
            <p class="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed whitespace-normal text-wrap uppercase tracking-tight">
              System is operational. Provide parameters or specific queries regarding infrastructure solutions.
            </p>
            <div class="flex flex-wrap gap-2 pt-2">
              <button @click="input = '查看服務器產品規格'; handleSubmit($event as any)" class="text-[9px] font-bold uppercase border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 px-3 py-2 text-center hover:border-black dark:hover:border-white transition-all">Specs.</button>
              <button @click="input = '聯繫技術支持'; handleSubmit($event as any)" class="text-[9px] font-bold uppercase border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-900 px-3 py-2 text-center hover:border-black dark:hover:border-white transition-all">Support.</button>
            </div>
          </div>
        </div>

        <div v-for="m in messages" :key="m.id" class="flex flex-col animate-in fade-in duration-300">
          <div 
            :class="[
              'p-5 text-sm max-w-[95%] relative', 
              m.role === 'user' 
                ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white ml-auto border border-black/10 dark:border-white/10' 
                : 'bg-white dark:bg-zinc-900 text-black dark:text-white border border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] mr-auto'
            ]"
          >
            <!-- Message Header Identifier -->
            <div class="absolute -top-6 left-0 font-mono text-[8px] uppercase tracking-widest opacity-30 whitespace-nowrap">
              {{ m.role === 'user' ? 'USR_BLOCK' : 'SYS_OUTPUT' }} // {{ new Date().toLocaleTimeString() }}
            </div>

            <!-- 用户消息 -->
            <div v-if="m.role === 'user'" class="whitespace-pre-wrap font-medium tracking-tight text-zinc-700 dark:text-zinc-300">{{ m.content }}</div>
            <!-- AI 消息 -->
            <div
              v-else
              class="prose prose-sm dark:prose-invert max-w-none
                     prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-black dark:prose-headings:text-white
                     prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-200
                     prose-pre:rounded-none prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-950 prose-pre:text-black dark:prose-pre:text-white prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10
                     prose-code:bg-zinc-100 dark:prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-none prose-code:before:content-none prose-code:after:content-none
                     prose-strong:font-black prose-strong:text-black dark:prose-strong:text-white
                     prose-table:border prose-table:border-black/20 dark:prose-table:border-white/20
                     prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-th:text-black dark:prose-th:text-white prose-th:p-2 prose-th:uppercase prose-th:text-[10px]"
              v-html="renderMarkdown(m.content)"
            />
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex flex-col gap-2 pt-4">
          <div class="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            <span class="inline-block w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 animate-ping"></span>
            <span>Fetching Data...</span>
          </div>
          <div class="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div class="h-full bg-black dark:bg-white w-1/4 animate-[loading_2s_infinite_linear]"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <form @submit="handleSubmit" class="p-6 bg-white dark:bg-zinc-950 border-t border-black dark:border-white relative z-10">
        <div class="relative flex flex-col gap-3">
          <div class="flex items-center justify-between px-1 text-[8px] font-bold uppercase tracking-widest opacity-30">
            <span>Terminal Input Ready</span>
            <span class="font-mono">{{ input.length }}/500</span>
          </div>
          <div class="flex items-center gap-3 border-b border-black/10 dark:border-white/10 pb-1">
            <div class="text-zinc-300 dark:text-zinc-700 font-mono text-sm leading-none">_</div>
            <input
              v-model="input"
              @change="handleInputChange"
              placeholder="Query system..."
              class="flex-1 bg-transparent text-sm outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 font-medium tracking-tight"
            />
            <button 
              type="submit" 
              :disabled="isLoading || !input.trim()" 
              class="group px-4 py-2 bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white transition-all disabled:opacity-5 disabled:grayscale flex items-center justify-center p-0"
            >
              <span class="text-[10px] font-bold uppercase mr-2 group-disabled:hidden">Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Toggle Button -->
    <button 
      @click="isOpen = !isOpen" 
      class="group relative w-16 h-16 bg-white dark:bg-zinc-950 text-black dark:text-white border-2 border-black dark:border-white shadow-[0px_4px_12px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-y-[2px] transition-all duration-300 flex items-center justify-center z-50 overflow-hidden"
    >
      <div class="relative w-full h-full flex flex-col items-center justify-center">
        <span 
          class="transition-all duration-300 font-black tracking-tighter leading-none"
          :class="isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'"
        >
          <span class="text-xl block italic">AI</span>
          <span class="text-[8px] uppercase tracking-[0.2em] font-mono opacity-40">Active</span>
        </span>
        <span 
          class="absolute transition-all duration-300 transform"
          :class="isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </span>
      </div>
    </button>
  </div>
</template>

<style scoped>
@keyframes scan {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}

@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* Custom scrollbar to match Swiss style */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #000;
}
.dark ::-webkit-scrollbar-thumb {
  background: #fff;
}
</style>
