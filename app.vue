<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';

const route = useRoute();

const layout = computed(() => {
  return route.path === '/' ? 'home' : 'default';
});
</script>
