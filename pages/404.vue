<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <GridContainer :grid="true">
      <div class="col-span-12 lg:col-span-8 lg:offset-2 text-center py-32">
        <!-- 404 标题 -->
        <TypographyHeader
          :level="1"
          size="display"
          class="mb-8 !text-[12rem] md:!text-[16rem] lg:!text-[20rem] !leading-none tracking-tighter"
        >
          404
        </TypographyHeader>

        <!-- 错误信息 -->
        <TypographyHeader
          :level="2"
          size="h2"
          class="mb-6 !tracking-tight"
        >
          {{ $t('error.title') }}
        </TypographyHeader>

        <p class="text-swiss-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          {{ $t('error.message') }}
        </p>

        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <SwissButton
            variant="primary"
            size="lg"
            @click="navigateTo(localePath('/'))"
          >
            {{ $t('error.backHome') }}
          </SwissButton>

          <SwissButton
            variant="ghost"
            size="lg"
            @click="goBack"
          >
            {{ $t('error.goBack') }}
          </SwissButton>
        </div>

        <!-- 装饰性元素 -->
        <div class="mt-24 pt-12 border-t border-gray-100">
          <div class="inline-flex items-center gap-3 text-swiss-text/40 text-xs font-mono">
            <span>ERROR_CODE: 404</span>
            <span class="w-1 h-1 bg-swiss-text/40 rounded-full"></span>
            <span>PAGE_NOT_FOUND</span>
          </div>
        </div>
      </div>
    </GridContainer>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo(localePath('/'))
  }
}

useHead({
  title: '404 - Page Not Found',
})
</script>
