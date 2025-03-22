import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/auth/reset-password/')) {
    const hash = to.params.hash;
    if (hash) {
      return navigateTo(`/password/reset/${hash}`);
    }
  }

  if (process.client) {
    const isPasswordResetUrl =
      window.location.href.includes('/password/reset/') ||
      window.location.pathname.startsWith('/password/reset/');

    if (isPasswordResetUrl) {
      const path = window.location.pathname;
      const parts = path.split('/');
      if (parts.length >= 3) {
        const hash = parts[parts.length - 1];
        if (!to.path.startsWith('/password/reset/')) {
          return navigateTo(`/password/reset/${hash}`);
        }
      }
    }
  }
});
