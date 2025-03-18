<template>
  <div class="flex flex-col items-center justify-center  w-full text-center px-4 py-20">
    <div class="flex flex-col items-center max-w-lg">
      <p class="text-32 lg:text-40 font-medium mb-8">Page Not Found</p>
      <p class="text-16 lg:text-18 text-grey-light-6 mb-12">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <trusty-button @click="router.push('/')" class="!py-4 !px-10">
        <span class="text-18 font-medium">Return to Homepage</span>
      </trusty-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'nuxt/app';
import TrustyButton from '@/components/ui/TrustyButton.vue';

const router = useRouter();
</script>