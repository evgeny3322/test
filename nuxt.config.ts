// @ts-ignore
import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  ssr: true,

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ['@pinia/nuxt', '@nuxtjs/device', 'nuxt-swiper', '@nuxt/image'],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_APP_API_URL,
      stripeKey: process.env.VITE_APP_STRIPE_KEY,
    },
  },
});
