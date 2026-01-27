<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" :class="[
    scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100' : 'bg-transparent'
  ]">
    <GridContainer>
      <div class="col-span-12 flex items-center justify-between py-5 md:py-8 transition-all duration-500"
        :class="{ 'py-3 md:py-4': scrolled }">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center space-x-3 group">
          <img src="/images/logo.png" alt="SUPERCORE Logo"
            class="object-contain drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-all duration-500 w-20 h-20 md:w-32 md:h-32"
            :class="{ '!w-12 !h-12 md:!w-20 md:!h-20': scrolled }" />
          <TypographyHeader :level="3" size="h4"
            class="hidden sm:block !mb-0 tracking-[0.2em] font-black uppercase transition-all duration-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            :color="scrolled ? 'text' : 'white'">
            SUPERCORE
          </TypographyHeader>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-12">
          <NuxtLink v-for="item in navItems" :key="item.key" :to="localePath(item.to)"
            class="nav-link group relative py-1 px-1">
            <TypographyHeader :level="4" size="h6"
              class="text-swiss-text-muted group-hover:text-swiss-text transition-colors duration-500 !mb-0 font-bold uppercase tracking-widest text-[10px]">
              {{ $t(item.label) }}
            </TypographyHeader>
          </NuxtLink>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Locale Switcher -->
          <LocaleSwitcher />

          <!-- Mobile Menu Button -->
          <button class="md:hidden p-2 text-swiss-text hover:text-swiss-accent transition-colors"
            @click="toggleMobileMenu" aria-label="Toggle menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </GridContainer>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="mobileMenuOpen" class="md:hidden bg-swiss-bg/95 backdrop-blur-md border-t border-swiss-secondary/10">
        <GridContainer>
          <div class="col-span-12 py-4 space-y-4">
            <NuxtLink v-for="item in navItems" :key="item.key" :to="localePath(item.to)" class="block py-2"
              @click="mobileMenuOpen = false">
              <TypographyHeader :level="4" size="h5">
                {{ $t(item.label) }}
              </TypographyHeader>
            </NuxtLink>
          </div>
        </GridContainer>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { key: 'home', label: 'nav.home', to: '/' },
  { key: 'products', label: 'nav.products', to: '/products' },
  { key: 'solutions', label: 'nav.solutions', to: '/solutions' },
  { key: 'about', label: 'nav.about', to: '/about' },
  { key: 'contact', label: 'nav.contact', to: '/contact' },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 檢測滾動狀態
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.nav-link {
  position: relative;
}
</style>
