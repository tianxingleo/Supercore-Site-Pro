<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      scrolled ? 'bg-swiss-bg/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    ]"
  >
    <GridContainer>
      <div class="col-span-12 flex items-center justify-between py-4 md:py-6">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 bg-swiss-text rounded-sm group-hover:bg-swiss-accent transition-colors duration-300"></div>
          <TypographyHeader level="3" size="h5" class="hidden sm:block">
            Project NEXUS
          </TypographyHeader>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="nav-link group relative py-2"
          >
            <TypographyHeader
              level="4"
              size="h6"
              class="text-swiss-text group-hover:text-swiss-accent transition-colors duration-300"
            >
              {{ $t(item.label) }}
            </TypographyHeader>
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-swiss-accent group-hover:w-full transition-all duration-300"></span>
          </NuxtLink>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Locale Switcher -->
          <LocaleSwitcher />

          <!-- Mobile Menu Button -->
          <button
            class="md:hidden p-2 text-swiss-text hover:text-swiss-accent transition-colors"
            @click="toggleMobileMenu"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
            <NuxtLink
              v-for="item in navItems"
              :key="item.key"
              :to="item.to"
              class="block py-2"
              @click="mobileMenuOpen = false"
            >
              <TypographyHeader level="4" size="h5">
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
