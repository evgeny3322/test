<template>
  <div
    class="w-full relative overflow-hidden min-h-[344px] h-full object-cover flex justify-center items-center bg-gray-200 p-5 rounded-2xl shadow hover:shadow-lg transition duration-500 ease-in transform cursor-pointer"
  >
    <div
      class="w-full h-full min-h-[19rem] z-1 flex flex-col justify-center items-start self-start"
    >
      <h1 class="text-26 font-medium leading-[1.875rem]">
        {{ props.tour?.name }}
      </h1>
      <p class="text-lg font-medium mb-4">
        {{ props.tour?.description }}
      </p>
      <p class="text-grey-large text-14 line-clamp-3 mt-auto leading-[1.225rem]">
        <!--        TODO поменять на нормальное описание когда исправят на бэке-->
        <!--        {{ props.tour?.internal_description }}-->
      </p>
      <div class="flex flex-wrap gap-[0.375em] items-center mt-4 w-full h-auto">
        <trusty-chip>
          {{ props.tour?.area?.name }}
        </trusty-chip>
        <trusty-chip>
          {{ props.tour?.duration }}
        </trusty-chip>
        <trusty-chip>
          {{ props.tour?.max_participants }}
        </trusty-chip>
      </div>
    </div>
    <NuxtImg
      width="300"
      class="absolute brightness-80 object-cover w-full h-full"
      :src="props.tour?.media[0]"
      alt="Tour"
    />
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tours';
import { navigateTo } from 'nuxt/app';
import TrustyChip from '@/components/ui/TrustyChip.vue';

const props = defineProps<{
  tour: Tour;
}>();
</script>
