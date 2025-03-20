import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore } from '@/store/authStore';

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side
  if (process.client) {
    const authStore = useAuthStore();

    // Initialize the auth store if not already done
    if (!authStore.initialized) {
      authStore.initAuth();
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/email-verification', '/auth/finalize-registration', '/'];

    // Auth routes that should redirect to account when logged in
    const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/auth/email-verification', '/auth/finalize-registration'];

    // Protected routes that require authentication
    const protectedRoutes = ['/account', '/payment', '/payment/'];

    // If user is logged in and tries to access auth pages, redirect to account
    if (authStore.isAuthenticated && authRoutes.includes(to.path)) {
      return navigateTo('/account');
    }

    // Check if trying to access a protected route while not authenticated
    const requiresAuth = protectedRoutes.some(route =>
      to.path === route || to.path.startsWith(`${route}/`)
    );

    if (requiresAuth && !authStore.isAuthenticated) {
      // Store the intended destination to redirect after login
      authStore.setIntendedRoute(to.fullPath);
      return navigateTo('/auth/sign-in');
    }

    // Allow continued navigation for public routes or authenticated users
    return;
  }
});