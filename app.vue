<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <WhatsAppWidget />
</template>

<script setup lang="ts">
import WhatsAppWidget from '@/components/layout/WhatsAppWidget.vue';
</script>
