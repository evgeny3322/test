<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const layout = route.path === '/' ? 'home' : 'default';
</script>
