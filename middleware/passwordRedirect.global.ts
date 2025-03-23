import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.path.startsWith('/password/reset/')) {
      const pathParts = to.path.split('/');
      const hash = pathParts[pathParts.length - 1];

      if (hash) {
        return navigateTo(`/auth/reset-password/${hash}`);
      }
    }

    if (process.client) {
      const currentUrl = window.location.href;
      const currentPath = window.location.pathname;

      const isPasswordResetUrl =
        currentUrl.includes('/password/reset/') || currentPath.startsWith('/password/reset/');

      if (isPasswordResetUrl) {
        const parts = currentPath.split('/');
        if (parts.length >= 3) {
          const hash = parts[parts.length - 1];

          if (!to.path.startsWith('/auth/reset-password/')) {
            return navigateTo(`/auth/reset-password/${hash}`);
          }
        }
      }
    }
  }
);
