import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/auth/reset-password/')) {
    const path = to.path;
    const segments = path.split('/');
    const hash = segments[segments.length - 1];

    if (hash && hash.length > 8) {
      if (!to.path.startsWith('/auth/reset-password/')) {
        return navigateTo(`/auth/reset-password/${hash}`);
      }
    } else {
      return navigateTo('/auth/forgot-password');
    }
  }
});
