<template>
  <div>
    <div v-if="isPasswordReset" class="flex justify-center items-center min-h-screen">
      <div class="bg-[#262626] p-8 rounded-2xl max-w-md w-full">
        <p class="text-center text-white text-xl mb-4">Redirecting to password reset...</p>
        <div class="flex justify-center">
          <PreloaderAnimIcon theme="white" />
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full text-center px-4 py-20">
      <div class="flex flex-col items-center max-w-lg">
        <p class="text-32 lg:text-40 font-medium mb-8">Page Not Found</p>
        <p class="text-16 lg:text-18 text-grey-light-6 mb-12">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <trusty-button @click="router.push('/')" class="!py-4 !px-10">
          <span class="text-18 font-medium">Return to Homepage</span>
        </trusty-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';

const router = useRouter();
const route = useRoute();

const isPasswordReset = computed(() => {
  return route.path.startsWith('/password/reset/');
});

onMounted(() => {
  console.log('Catch-all route mounted, path:', route.path);

  if (isPasswordReset.value) {
    const pathParts = route.path.split('/');
    const token = pathParts[pathParts.length - 1];

    if (token) {
      router.push(`/auth/reset-password/${token}`);
    } else {
      router.push('/auth/forgot-password');
    }
  }
});
</script>
