<template>
  <div class="flex flex-col justify-between min-h-screen">
    <Header class="px-[9.5%] main-container" />
    <div class="flex-grow flex">
      <div class="w-full">
        <NuxtPage :key="$route.fullPath" />
      </div>
    </div>
    <Footer class="px-[9.5%] main-container" />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>
