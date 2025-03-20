<template>
  <slot v-if="shouldShowAuthContent"></slot>
  <slot v-else name="unauthenticated"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

const props = defineProps({
  authenticated: {
    type: Boolean,
    default: true,
  },
});

const authStore = useAuthStore();

const shouldShowAuthContent = computed(() => {
  return props.authenticated ? authStore.isAuthenticated : !authStore.isAuthenticated;
});
</script>
