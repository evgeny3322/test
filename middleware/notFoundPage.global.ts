import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from 'nuxt/app';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const nuxtApp = useNuxtApp();

    if (!to.matched.length) {
      return navigateTo('/404');
    }
  }
);
