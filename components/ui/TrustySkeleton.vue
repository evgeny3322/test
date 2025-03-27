<template>
  <div class="animate-pulse bg-[#0E0E0E] rounded-md" :class="[customClass]"></div>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string | string[] | Record<string, boolean>;
}>();
</script>
