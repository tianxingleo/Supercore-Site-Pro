export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: {
    zh: ['zh-HK'],
    'zh-CN': ['zh-CN'],
    'zh-HK': ['zh-HK'],
    en: ['en'],
    default: ['en'],
  },
}))
