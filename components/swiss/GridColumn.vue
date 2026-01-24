<template>
  <div :class="columnClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  spanSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
}

const props = withDefaults(defineProps<Props>(), {
  span: 12,
})

const columnClasses = computed(() => {
  const classes: string[] = []

  // Default span
  classes.push(`col-span-${props.span}`)

  // Responsive spans
  if (props.spanSm) classes.push(`sm:col-span-${props.spanSm}`)
  if (props.spanMd) classes.push(`md:col-span-${props.spanMd}`)
  if (props.spanLg) classes.push(`lg:col-span-${props.spanLg}`)

  // Offset
  if (props.offset) {
    classes.push(`offset-${props.offset}`)
  }

  return classes
})
</script>
