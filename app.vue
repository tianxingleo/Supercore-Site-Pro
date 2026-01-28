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
const baseUrl = 'https://projectnexus.hk'

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '超核技術有限公司',
  url: baseUrl,
  logo: `${baseUrl}/supercore.png`,
  description: '全球領先的AI算力基礎設施服務商，專注於AI服務器與GPU計算集群的研發、生產與全棧解決方案交付',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'HK',
    addressLocality: 'Hong Kong',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@projectnexus.hk',
  },
  sameAs: [] as string[],
}

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '超核技術有限公司',
  url: baseUrl,
  description: '全球領先的AI算力基礎設施服務商',
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
