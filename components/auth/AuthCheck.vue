<template>
  <!-- If authenticated condition is true, show the default slot -->
  <slot v-if="shouldShowAuthContent"></slot>
  <!-- If not authenticated, show the unauthenticated slot if provided -->
  <slot v-else name="unauthenticated"></slot>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';

const props = defineProps({
  authenticated: {
    type: Boolean,
    default: true
  }
});

const authStore = useAuthStore();

const shouldShowAuthContent = computed(() => {
  return props.authenticated ? authStore.isAuthenticated : !authStore.isAuthenticated;
});
</script>