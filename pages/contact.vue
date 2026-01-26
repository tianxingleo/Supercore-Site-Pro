<template>
  <div class="min-h-screen bg-white">
    <!-- Page Header -->
    <section class="pt-48 pb-24 border-b border-gray-100 mb-12">
      <GridContainer :grid="true">
        <div class="col-span-12 lg:col-span-8">
          <TypographyHeader level="1" size="display" class="mb-8">
            {{ $t('nav.contact') }}
          </TypographyHeader>
          <TypographyHeader level="2" size="h3" color="secondary" weight="normal" class="max-w-2xl opacity-80">
            {{ $t('contact.pageSubtitle') }}
          </TypographyHeader>
        </div>
      </GridContainer>
    </section>

    <!-- Contact Content -->
    <section class="pb-32">
      <GridContainer :grid="true" gap="none" class="border-t border-l border-gray-100">
        <!-- Contact Form -->
        <div class="col-span-12 lg:col-span-7 border-r border-b border-gray-100 p-12 md:p-20">
          <div class="max-w-xl">
            <div class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              Send Inquiry
            </div>
            <ContactForm @submit="handleFormSubmit" />
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-span-12 lg:col-span-5 space-y-px bg-gray-100">
          <!-- Contact Info -->
          <div class="bg-white p-12 md:p-20 h-full border-r border-b border-gray-100">
            <div class="inline-block mb-12 text-[10px] font-bold tracking-[0.3em] uppercase text-swiss-text border-b border-swiss-text pb-1">
              Contact Detail
            </div>

            <div class="space-y-16 mt-12">
              <!-- Email -->
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4">Electronic Mail</span>
                <a
                  :href="`mailto:${$t('company.email')}`"
                  class="text-2xl font-bold text-swiss-text hover:underline decoration-1 underline-offset-8"
                >
                  {{ $t('company.email') }}
                </a>
              </div>

              <!-- Phone -->
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4">Direct Line</span>
                <a
                  :href="`tel:${$t('company.phone')}`"
                  class="text-2xl font-bold text-swiss-text hover:underline decoration-1 underline-offset-8"
                >
                  {{ $t('company.phone') }}
                </a>
              </div>

              <!-- Address -->
              <div class="flex flex-col">
                <span class="text-[9px] font-bold text-swiss-text/30 uppercase tracking-[0.2em] mb-4">Headquarters</span>
                <p class="text-xl font-medium text-swiss-text leading-relaxed">
                  {{ $t('company.address') }}
                </p>
              </div>
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
