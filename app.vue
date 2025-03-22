<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
  <WhatsAppWidget />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget.vue';

const route = useRoute();

const layout = computed(() => {
  return route.path === '/' ? 'home' : 'default';
});
</script>
