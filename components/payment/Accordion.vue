<template>
  <div class="flex flex-col w-full">
    <div @click="toggleAccordion" class="flex cursor-pointer items-center gap-[0.75rem]">
      <span>{{ title }}</span>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-inspector="components/ui/TrustyComplete.vue:8:7"
        class="duration-300 max-md:ml-auto stroke-2"
        :class="{ 'rotate-180': isShow, 'rotate-0': !isShow }"
        data-v-e7d25b7a=""
      >
        <path
          d="M1 1L7 7L13 1"
          stroke="white"
          stroke-linecap="square"
          data-v-inspector="components/icons/ArrowDownOutlinedIcon.vue:3:5"
        ></path>
      </svg>
    </div>
    <div v-if="isShow" class="duration-300">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { string } from 'yup';

const isShow = ref(false);

const toggleAccordion = () => {
  isShow.value = !isShow.value;
};
defineProps({
  title: {
    type: String,
    default: 'Show details',
  },
});
</script>
