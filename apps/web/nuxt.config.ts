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

  modules: ['@pinia/nuxt', '@nuxt/icon', '@vueuse/nuxt'],
});
