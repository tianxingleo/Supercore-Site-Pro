<template>
  <NuxtLink v-if="tag === 'a' && to" :to="to" custom v-slot="{ navigate }">
    <a v-bind="$attrs" @click="navigate" :class="buttonClasses" :href="to" @click.exact="handleClick($event, navigate)"
      @keydown.enter.prevent="handleClick($event, navigate)" @keydown.space.prevent="handleClick($event, navigate)">
      <slot />
    </a>
  </NuxtLink>
  <a v-else-if="tag === 'a'" v-bind="$attrs" :href="to" :class="buttonClasses" @click="handleClick"
    @keydown.enter.prevent="handleClick($event)">
    <slot />
  </a>
  <button v-else v-bind="$attrs" :type="type" :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
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
      'hover:bg-swiss-text/90',
      'hover:-translate-y-0.5',
      'hover:shadow-lg',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
    secondary: [
      'bg-swiss-bg-soft',
      'text-swiss-text',
      'hover:bg-gray-200',
      'hover:-translate-y-0.5',
      'hover:shadow-md',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
    ghost: [
      'bg-transparent',
      'text-swiss-text',
      'border',
      'border-swiss-text/20',
      'hover:border-swiss-text',
      'hover:bg-swiss-text',
      'hover:text-white',
      'hover:-translate-y-0.5',
      'active:scale-[0.98]',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ],
  }

  // Width
  const width = props.fullWidth ? ['w-full'] : []

  return [...base, ...sizes[props.size], ...variants[props.variant], ...width]
})

const handleClick = (event: Event, navigate?: () => void) => {
  if (!props.disabled) {
    if (navigate) {
      event.preventDefault()
      navigate()
    }
    emit('click', event)
  }
}
</script>
