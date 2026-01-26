<template>
  <component :is="tag" :type="tag === 'button' ? type : undefined" :to="tag === 'a' ? to : undefined"
    :href="tag === 'a' ? to : undefined" :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  tag?: 'button' | 'a'
  type?: 'button' | 'submit' | 'reset'
  to?: string
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  type: 'button',
  disabled: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const base = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-all',
    'duration-300',
    'ease-out',
    'rounded-none',
    'tracking-widest',
    'uppercase',
    'text-[10px]',
    'font-bold',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-swiss-text',
  ]

  // Size variants
  const sizes = {
    sm: ['px-4', 'py-2', 'text-sm'],
    md: ['px-6', 'py-3', 'text-base'],
    lg: ['px-8', 'py-4', 'text-lg'],
  }

  // Variant styles
  const variants = {
    primary: [
      'bg-swiss-text',
      'text-white',
      'hover:bg-black',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
    secondary: [
      'bg-swiss-bg-soft',
      'text-swiss-text',
      'hover:bg-gray-200',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
    ghost: [
      'bg-transparent',
      'text-swiss-text',
      'border',
      'border-gray-200',
      'hover:bg-swiss-text',
      'hover:text-white',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
  }

  // Width
  const width = props.fullWidth ? ['w-full'] : []

  return [...base, ...sizes[props.size], ...variants[props.variant], ...width]
})

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
