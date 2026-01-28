<template>
  <form @submit.prevent="handleSubmit" class="space-y-12" aria-label="Contact inquiry form">
    <!-- Name -->
    <div class="relative group">
      <label for="name"
        class="block text-[10px] font-bold text-swiss-text/40 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-swiss-text">
        Full Name
        <span class="text-swiss-text opacity-20">/ {{ $t('contact.name') || '姓名' }}</span>
      </label>
      <input id="name" v-model="formData.name" type="text" name="name" autocomplete="name" required aria-required="true"
        class="w-full bg-transparent border-b border-gray-200 py-4 focus:outline-none focus:border-swiss-text transition-all font-bold text-swiss-text placeholder:text-gray-300 placeholder:font-normal"
        placeholder="Enter your name" />
    </div>

    <!-- Email -->
    <div class="relative group">
      <label for="email"
        class="block text-[10px] font-bold text-swiss-text/40 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-swiss-text">
        Email Address
        <span class="text-swiss-text opacity-20">/ {{ $t('contact.email') || '電郵' }}</span>
      </label>
      <input id="email" v-model="formData.email" type="email" name="email" autocomplete="email" required
        aria-required="true"
        class="w-full bg-transparent border-b border-gray-200 py-4 focus:outline-none focus:border-swiss-text transition-all font-bold text-swiss-text placeholder:text-gray-300 placeholder:font-normal"
        placeholder="your@email.com" />
    </div>

    <!-- Company -->
    <div class="relative group">
      <label for="company"
        class="block text-[10px] font-bold text-swiss-text/40 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-swiss-text">
        Company
        <span class="text-swiss-text opacity-20">/ {{ $t('contact.company') || '公司' }}</span>
      </label>
      <input id="company" v-model="formData.company" type="text" name="company" autocomplete="organization"
        class="w-full bg-transparent border-b border-gray-200 py-4 focus:outline-none focus:border-swiss-text transition-all font-bold text-swiss-text placeholder:text-gray-300 placeholder:font-normal"
        placeholder="Company name" />
    </div>

    <!-- Message -->
    <div class="relative group">
      <label for="message"
        class="block text-[10px] font-bold text-swiss-text/40 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-swiss-text">
        Project Details
        <span class="text-swiss-text opacity-20">/ {{ $t('contact.message') || '訊息' }}</span>
      </label>
      <textarea id="message" v-model="formData.message" name="message" required aria-required="true" rows="4"
        class="w-full bg-transparent border-b border-gray-200 py-4 focus:outline-none focus:border-swiss-text transition-all font-bold text-swiss-text placeholder:text-gray-300 placeholder:font-normal resize-none"
        placeholder="Tell us about your requirements"></textarea>
    </div>

    <!-- Submit Button -->
    <div class="pt-6">
      <SwissButton type="submit" variant="primary" size="lg" :full-width="true" :disabled="isSubmitting" class="!py-6"
        :aria-label="isSubmitting ? 'Sending inquiry' : 'Submit inquiry request'">
        {{ isSubmitting ? 'SENDING...' : 'SEND REQUEST' }}
      </SwissButton>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="p-6 bg-black text-white text-center">
      <p class="text-[10px] font-bold tracking-widest uppercase">
        Message Received. We will contact you shortly.
      </p>
    </div>

    <!-- Error Message -->
    <div v-if="showError" class="p-6 bg-red-600 text-white text-center">
      <p class="text-[10px] font-bold tracking-widest uppercase">
        Submission Error. Please try again.
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ContactFormData } from '~/types'

const emit = defineEmits<{
  submit: [data: ContactFormData]
}>()

const formData = ref<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  showSuccess.value = false
  showError.value = false

  try {
    const response = await $fetch('/api/inquiries', {
      method: 'POST',
      body: {
        email: formData.value.email,
        company: formData.value.company,
        message: formData.value.message,
      },
    })

    if (response.success) {
      showSuccess.value = true

      formData.value = {
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      }

      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    }
  } catch (error: any) {
    showError.value = true
    console.error('提交詢盤失敗:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
