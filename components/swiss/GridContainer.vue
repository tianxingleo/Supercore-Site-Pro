<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  grid?: boolean
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  centered?: boolean
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  grid: false,
  cols: 12,
  gap: 'md',
  centered: true,
  padding: true,
})

const containerClasses = computed(() => {
  const classes: string[] = []

  // Max width sizing
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }
  classes.push(sizes[props.size])

  // Center alignment
  if (props.centered) {
    classes.push('mx-auto')
  }

  // Grid system
  if (props.grid) {
    classes.push('grid', 'grid-cols-12')
  }

  // Gap spacing
  const gaps = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }
  if (props.gap !== 'none') {
    classes.push(gaps[props.gap])
  }

  // Padding
  if (props.padding) {
    classes.push('px-6', 'sm:px-8', 'lg:px-12')
  }

  return classes
})
</script>
