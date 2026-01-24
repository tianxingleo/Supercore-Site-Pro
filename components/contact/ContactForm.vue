<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-swiss-text mb-2">
        姓名 *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="w-full px-4 py-3 border border-swiss-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-swiss-accent focus:border-transparent transition-all"
        placeholder="請輸入您的姓名"
      />
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-swiss-text mb-2">
        電郵 *
      </label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        required
        class="w-full px-4 py-3 border border-swiss-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-swiss-accent focus:border-transparent transition-all"
        placeholder="your@email.com"
      />
    </div>

    <!-- Phone (Optional) -->
    <div>
      <label for="phone" class="block text-sm font-medium text-swiss-text mb-2">
        電話
      </label>
      <input
        id="phone"
        v-model="formData.phone"
        type="tel"
        class="w-full px-4 py-3 border border-swiss-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-swiss-accent focus:border-transparent transition-all"
        placeholder="+852 XXXX XXXX"
      />
    </div>

    <!-- Company (Optional) -->
    <div>
      <label for="company" class="block text-sm font-medium text-swiss-text mb-2">
        公司名稱
      </label>
      <input
        id="company"
        v-model="formData.company"
        type="text"
        class="w-full px-4 py-3 border border-swiss-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-swiss-accent focus:border-transparent transition-all"
        placeholder="請輸入公司名稱"
      />
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-medium text-swiss-text mb-2">
        訊息 *
      </label>
      <textarea
        id="message"
        v-model="formData.message"
        required
        rows="6"
        class="w-full px-4 py-3 border border-swiss-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-swiss-accent focus:border-transparent transition-all resize-none"
        placeholder="請描述您的需求..."
      ></textarea>
    </div>

    <!-- Submit Button -->
    <SwissButton
      type="submit"
      variant="primary"
      size="lg"
      :full-width="true"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? '發送中...' : '發送訊息' }}
    </SwissButton>

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="p-4 bg-green-50 border border-green-200 rounded-lg"
    >
      <p class="text-green-800 text-sm">
        感謝您的訊息！我們會盡快回覆您。
      </p>
    </div>

    <!-- Error Message -->
    <div
      v-if="showError"
      class="p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <p class="text-red-800 text-sm">
        發送失敗，請稍後再試。
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Emit submit event
    emit('submit', formData.value)

    // Show success message
    showSuccess.value = true

    // Reset form
    formData.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    }

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>
