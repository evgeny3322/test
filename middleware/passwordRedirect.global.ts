import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/password/reset/')) {
    const pathParts = to.path.split('/');
    const hash = pathParts[pathParts.length - 1];

    if (hash) {
      return navigateTo(`/auth/reset-password/${hash}`);
    }
    return navigateTo('/auth/forgot-password');
  }
});
