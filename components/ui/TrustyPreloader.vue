<template>
  <div
    class="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
    data-testid="loader"
  >
    <div class="flex max-w-[350px] flex-col items-center justify-center gap-y-9 lg:max-w-[600px]">
      <PreloaderAnimIcon class="lg:size-[153px]" />
      <p class="text-center text-sm text-white lg:text-2xl">{{ title }}</p>
    </div>
  </div>
</template>

<script setup>
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
const { title } = defineProps({
  title: {
    type: String,
    default:
      'Please Wait a few seconds, our system is calculating, don’t click any button now, or the back arrow',
  },
});
</script>
