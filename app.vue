<template>
  <div class="min-h-screen bg-swiss-bg">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// 直接定義全局結構化數據
const baseUrl = 'https://www.example.com'

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XX Technology Co., Ltd.',
  url: baseUrl,
  logo: `${baseUrl}/icon.png`,
  description:
    'Leading global AI computing infrastructure provider, focusing on AI server & GPU cluster R&D, production and full-stack solutions.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'HK',
    addressLocality: 'Hong Kong',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@example.com',
  },
  sameAs: [] as string[],
}

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'XX Technology Co., Ltd.',
  url: baseUrl,
  description: 'Global leading AI computing infrastructure service provider',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

useHead({
  htmlAttrs: {
    lang: locale,
  },
  bodyAttrs: {
    class: 'antialiased',
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationData),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(websiteData),
    },
  ],
})
</script>

<style>
/* Page Transition Animation */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Layout Transition Animation */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.3s ease-in-out;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
