export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'zh-HK',
  fallbackLocale: {
    zh: ['zh-HK'],
    'zh-CN': ['zh-CN'],
    'zh-HK': ['zh-HK'],
    en: ['en'],
    default: ['zh-HK'],
  },
}))
