import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore } from '@/store/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const authStore = useAuthStore();

    if (!authStore.initialized) {
      authStore.initAuth();
    }

    const publicRoutes = [
      '/auth/sign-in',
      '/auth/sign-up',
      '/auth/email-verification',
      '/auth/finalize-registration',
      '/',
    ];

    const authRoutes = [
      '/auth/sign-in',
      '/auth/sign-up',
      '/auth/email-verification',
      '/auth/finalize-registration',
    ];

    const protectedRoutes = ['/account'];

    if (authStore.isAuthenticated && authRoutes.includes(to.path)) {
      return navigateTo('/account');
    }

    const requiresAuth = protectedRoutes.some(
      (route) => to.path === route || to.path.startsWith(`${route}/`)
    );

    if (requiresAuth && !authStore.isAuthenticated) {
      authStore.setIntendedRoute(to.fullPath);
      return navigateTo('/auth/sign-in');
    }

    return;
  }
});
