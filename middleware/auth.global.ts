import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from 'nuxt/app';
import { useAuthStore } from '@/store/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const authStore = useAuthStore();

    if (to.path.startsWith('/auth')) {
      if (authStore.isAuthenticated) {
        return navigateTo('/account');
      }
      return;
    }

    if (
      to.path.startsWith('/account') ||
      to.path.startsWith('/payment')
    ) {
      if (!authStore.isAuthenticated) {
        return navigateTo('/auth/sign-in');
      }
    }
  }
});