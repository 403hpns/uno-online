import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  // Just for private purposes: https://403hpns.dev/projects/uno
  app: {
    baseURL: '/projects/uno/',
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['403hpns.dev'],
    },
  },

  i18n: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
  },

  modules: ['@pinia/nuxt', '@nuxt/icon', '@vueuse/nuxt', '@nuxtjs/i18n'],
});
