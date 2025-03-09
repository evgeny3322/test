import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { email: string },
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        // Симуляция API-запроса
        if (email === 'user@example.com' && password === 'password123') {
          this.user = { email };
          return true;
        } else {
          throw new Error('Неверный email или пароль');
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.user = null;
    },
  },
});
