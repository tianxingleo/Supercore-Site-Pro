<template>
  <div class="animated-text-overlay fixed inset-0 pointer-events-none z-10">
    <!-- Phase 1: 淡入階段 -->
    <Transition name="fade">
      <div
        v-if="currentPhase >= 0"
        class="text-overlay absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
      >
        <TypographyHeader
          v-if="currentPhase === 0"
          level="2"
          size="h2"
          class="text-swiss-text"
        >
          {{ $t('home.animation.phase1') }}
        </TypographyHeader>
      </div>
    </Transition>

    <!-- Phase 2: 機櫃打開 -->
    <Transition name="slide-up">
      <div
        v-if="currentPhase >= 1"
        class="text-overlay absolute top-1/3 right-12"
      >
        <TypographyHeader
          v-if="currentPhase === 1"
          level="3"
          size="h3"
          class="text-swiss-text"
        >
          {{ $t('home.animation.phase2') }}
        </TypographyHeader>
      </div>
    </Transition>

    <!-- Phase 3: 組件爆炸 -->
    <Transition name="slide-up">
      <div
        v-if="currentPhase >= 2"
        class="text-overlay absolute top-1/2 left-12"
      >
        <TypographyHeader
          v-if="currentPhase === 2"
          level="3"
          size="h3"
          class="text-swiss-text"
        >
          {{ $t('home.animation.phase3') }}
        </TypographyHeader>
      </div>
    </Transition>

    <!-- Phase 4: 重新組裝 -->
    <Transition name="fade">
      <div
        v-if="currentPhase >= 3"
        class="text-overlay absolute bottom-32 left-1/2 -translate-x-1/2"
      >
        <TypographyHeader
          v-if="currentPhase === 3"
          level="3"
          size="h4"
          class="text-swiss-secondary"
        >
          {{ $t('home.animation.phase4') }}
        </TypographyHeader>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  phase: number
}

const props = defineProps<Props>()
const currentPhase = ref(props.phase)

watch(
  () => props.phase,
  (newPhase) => {
    currentPhase.value = newPhase
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.text-overlay {
  max-width: 400px;
}
</style>
