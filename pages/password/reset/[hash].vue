<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-[#262626] p-8 rounded-2xl max-w-md w-full">
      <p class="text-center text-white text-xl mb-4">Redirecting to password reset...</p>
      <div class="flex justify-center">
        <PreloaderAnimIcon theme="white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  console.log('Password reset page mounted with hash:', route.params.hash);

  // Redirect to the auth reset page after a brief delay
  setTimeout(() => {
    if (route.params.hash) {
      router.push(`/auth/reset-password/${route.params.hash}`);
    } else {
      router.push('/auth/forgot-password');
    }
  }, 1000); // Short delay to show the loading indicator
});
</script>
