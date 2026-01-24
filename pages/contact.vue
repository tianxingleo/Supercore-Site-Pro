<template>
  <div class="min-h-screen bg-swiss-bg py-24">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer>
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('nav.contact') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            我們期待與您合作，為您的業務提供專業的基礎設施解決方案
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Contact Content -->
    <section>
      <GridContainer>
        <!-- Contact Form -->
        <div class="col-span-12 lg:col-span-6 mb-12 lg:mb-0">
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="2" size="h3" class="mb-6">
              發送訊息
            </TypographyHeader>
            <ContactForm @submit="handleFormSubmit" />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-span-12 lg:col-span-6 space-y-8">
          <!-- Contact Info -->
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              聯絡方式
            </TypographyHeader>

            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-start">
                <div class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">電郵</div>
                  <a href="mailto:info@projectnexus.hk" class="text-swiss-text hover:text-swiss-accent transition-colors">
                    info@projectnexus.hk
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start">
                <div class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">電話</div>
                  <a href="tel:+85212345678" class="text-swiss-text hover:text-swiss-accent transition-colors">
                    +852 1234 5678
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start">
                <div class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">地址</div>
                  <div class="text-swiss-text">
                    香港九龍觀塘道<br>
                    觀塘創新中心 18 樓
                  </div>
                </div>
              </div>

              <!-- WhatsApp -->
              <div class="flex items-start">
                <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">WhatsApp</div>
                  <a href="https://wa.me/85212345678" target="_blank" rel="noopener noreferrer" class="text-swiss-text hover:text-swiss-accent transition-colors">
                    +852 1234 5678
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              辦公時間
            </TypographyHeader>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-swiss-secondary">星期一 - 星期五</span>
                <span class="text-swiss-text">9:00 - 18:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-swiss-secondary">星期六</span>
                <span class="text-swiss-text">9:00 - 13:00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-swiss-secondary">星期日及公眾假期</span>
                <span class="text-swiss-text">休息</span>
              </div>
            </div>

            <div class="mt-4 p-3 bg-swiss-bg rounded">
              <p class="text-xs text-swiss-secondary">
                緊急技術支援：24/7 全天候服務
              </p>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContactFormData } from '~/types'

const handleFormSubmit = (data: ContactFormData) => {
  console.log('Form submitted:', data)
  // Here you would integrate with your backend API
  // For now, we just log the data
}

useHead({
  title: '聯絡我們 - Project NEXUS (HK)',
})
</script>
