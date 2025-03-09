<template>
  <div class="flex flex-col justify-between min-h-screen main-container">
    <Header class="px-[9.5%]" />
    <div class="flex-grow flex">
      <div class="w-full">
        <slot />
      </div>
    </div>
    <Footer class="px-[9.5%]" />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>
