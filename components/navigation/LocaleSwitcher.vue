<template>
  <div class="relative" ref="dropdownRef">
    <button type="button"
      class="flex items-center space-x-1 px-3 py-2 rounded-none hover:bg-swiss-bg-soft transition-colors"
      @click="toggleDropdown">
      <svg class="w-5 h-5 text-swiss-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
        </path>
      </svg>
      <span class="text-sm font-medium text-swiss-text hidden sm:inline">
        {{ currentLocale }}
      </span>
      <svg class="w-4 h-4 text-swiss-text transition-transform" :class="{ 'rotate-180': dropdownOpen }" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="fade">
      <div v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-none shadow-2xl border border-gray-100 py-1 z-50">
        <button v-for="(locale, index) in availableLocales" :key="locale.code" type="button"
          class="w-full px-4 py-3 text-left hover:bg-swiss-bg-soft transition-colors flex items-center justify-between"
          :class="{ 'bg-swiss-bg-soft': locale.code === currentLocaleCode }" @click="switchLocale(locale.code)">
          <span class="text-sm font-medium text-swiss-text">
            {{ locale.name }}
          </span>
          <svg v-if="locale.code === currentLocaleCode" class="w-4 h-4 text-swiss-accent" fill="currentColor"
            viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLDivElement>()

const currentLocaleCode = computed(() => locale.value)

const currentLocale = computed(() => {
  const loc = availableLocales.value.find(l => l.code === locale.value)
  return loc?.shortName || locale.value
})

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string; shortName: string }>).map(l => ({
    code: l.code,
    name: l.name,
    shortName: l.code === 'zh-HK' ? 'HK' : l.code === 'zh-CN' ? 'CN' : 'EN'
  }))
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const switchLocale = async (code: string) => {
  await setLocale(code as any)
  navigateTo(switchLocalePath(code as any))
  dropdownOpen.value = false
}

// 點擊外部關閉下拉選單
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
