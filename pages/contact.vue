<template>
  <div class="min-h-screen bg-swiss-bg">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer :grid="true">
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('nav.contact') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            {{ $t('contact.pageSubtitle') }}
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Contact Content -->
    <section>
      <GridContainer :grid="true">
        <!-- Contact Form -->
        <div class="col-span-12 lg:col-span-6 mb-12 lg:mb-0">
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              {{ $t('contact.contactInfo') }}
            </TypographyHeader>
            <ContactForm @submit="handleFormSubmit" />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-span-12 lg:col-span-6 space-y-8">
          <!-- Contact Info -->
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6"> 聯絡方式 </TypographyHeader>

            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-swiss-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">{{ $t('contact.email') }}</div>
                  <a
                    :href="`mailto:${$t('company.email')}`"
                    class="text-swiss-text hover:text-swiss-accent transition-colors"
                  >
                    {{ $t('company.email') }}
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-swiss-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">{{ $t('contact.phone') }}</div>
                  <a
                    :href="`tel:${$t('company.phone')}`"
                    class="text-swiss-text hover:text-swiss-accent transition-colors"
                  >
                    {{ $t('company.phone') }}
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start">
                <div
                  class="w-10 h-10 bg-swiss-accent/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <svg
                    class="w-5 h-5 text-swiss-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-swiss-secondary mb-1">{{ $t('contact.address') }}</div>
                  <div
                    class="text-swiss-text"
                    v-html="$t('company.address').replace(/, /g, ',<br />')"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              {{ $t('contact.businessHours') }}
            </TypographyHeader>

            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-swiss-secondary">{{ $t('contact.mondayToFriday') }}</span>
                <span class="text-swiss-text">{{ $t('contact.workingHours') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-swiss-secondary">{{ $t('contact.weekend') }}</span>
                <span class="text-swiss-text">{{ $t('contact.closed') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-swiss-secondary">{{ $t('contact.sundayHoliday') }}</span>
                <span class="text-swiss-text">{{ $t('contact.closed') }}</span>
              </div>
            </div>

            <div class="mt-4 p-3 bg-swiss-bg rounded">
              <p class="text-xs text-swiss-secondary">{{ $t('contact.emergencyContact') }}</p>
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
  title: '聯絡我們 - 廣東博迩科技有限公司',
})
</script>
