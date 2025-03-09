<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Password -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Кнопка входа -->
    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
    >
      Войти
    </button>

    <!-- Ссылка на регистрацию -->
    <p class="text-sm text-gray-600 text-center">
      Нет аккаунта?
      <NuxtLink to="/auth/sign-up" class="text-blue-500 hover:underline"
        >Зарегистрироваться</NuxtLink
      >
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore'; // Pinia Store

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleSubmit = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (error) {
    console.error('Ошибка входа', error);
  }
};
</script>
