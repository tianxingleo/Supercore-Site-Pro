<template>
  <component :is="tag" :class="headerClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'text' | 'secondary' | 'accent'
  align?: 'left' | 'center' | 'right'
  tracking?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider'
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  margin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  size: 'h1',
  weight: 'bold',
  color: 'text',
  align: 'left',
  tracking: 'tight',
  leading: 'tight',
  margin: true,
})

const tag = computed(() => `h${props.level}` as const)

const headerClasses = computed(() => {
  const classes: string[] = []

  // Size variants (Swiss design - large, bold headings)
  const sizes = {
    display: ['text-5xl', 'sm:text-6xl', 'lg:text-7xl', 'font-bold'],
    h1: ['text-4xl', 'sm:text-5xl', 'lg:text-6xl'],
    h2: ['text-3xl', 'sm:text-4xl', 'lg:text-5xl'],
    h3: ['text-2xl', 'sm:text-3xl', 'lg:text-4xl'],
    h4: ['text-xl', 'sm:text-2xl', 'lg:text-3xl'],
    h5: ['text-lg', 'sm:text-xl', 'lg:text-2xl'],
    h6: ['text-base', 'sm:text-lg', 'lg:text-xl'],
  }
  classes.push(...sizes[props.size])

  // Weight
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
  classes.push(weights[props.weight])

  // Color
  const colors = {
    text: 'text-swiss-text',
    secondary: 'text-swiss-secondary',
    accent: 'text-swiss-accent',
  }
  classes.push(colors[props.color])

  // Alignment
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  classes.push(alignments[props.align])

  // Letter spacing (Swiss design uses tight tracking)
  const trackings = {
    tighter: 'tracking-tighter',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
    wider: 'tracking-wider',
  }
  classes.push(trackings[props.tracking])

  // Line height
  const lineHeights = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  }
  classes.push(lineHeights[props.leading])

  // Margin
  if (props.margin) {
    classes.push('mb-4', 'last:mb-0')
  }

  return classes
})
</script>
