<template>
  <div
    class="w-full relative overflow-hidden min-h-[22rem] 2xl:min-h-[26rem] h-full object-cover flex justify-center items-center bg-gray-200 p-5 rounded-2xl shadow hover:shadow-lg transition duration-500 ease-in transform cursor-pointer"
    @click="handleClick"
  >
    <div class="bg-[#00000055] z-1 absolute h-full w-full"></div>
    <div
      class="w-full h-full min-h-[19rem] z-2 flex flex-col justify-center items-start self-start"
    >
      <h1 class="text-26 font-medium leading-[1.875rem]">
        {{ props.tour?.name }}
      </h1>
      <p class="text-lg font-medium mb-4">
        from {{ props.tour?.min_cost && +props.tour?.min_cost?.toFixed() }} € per person
      </p>
      <p class="text-grey-light-6 text-14 line-clamp-3 mt-auto leading-[1.225rem]">
        {{ props.tour?.short_description }}
      </p>
      <div class="flex flex-wrap gap-[0.375em] items-center mt-4 w-full h-auto">
        <trusty-chip>
          {{ props.tour?.area?.name }}
        </trusty-chip>
        <trusty-chip>
          {{ formatDuration(+props.tour?.duration) }}
        </trusty-chip>
        <trusty-chip> 1-{{ props.tour?.max_participants }} persons </trusty-chip>
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
import { useRouter } from 'vue-router';
import TrustyChip from '@/components/ui/TrustyChip.vue';

const router = useRouter();
const props = defineProps<{
  tour: Tour;
}>();

const handleClick = () => {
  if (props.tour && props.tour.id) {
    router.push(`/tours/${props.tour.id}`);
  }
};

const formatDuration = (minutes?: number): string => {
  if (!minutes) return '0 Min';
  const hrs = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${hrs > 0 ? `${hrs} Hrs` : ''} ${min > 0 ? `${min} Min` : ''}`.trim();
};
</script>
