<template>
  <div class="lg:min-h-[511px] banner flex justify-end">
    <div
      class="md:max-w-[1440px] xl:max-w-[1920px] w-full px-[9.5%] py-[8%] lg:py-[2.5%] flex flex-col justify-end mx-auto"
    >
      <div class="flex flex-col gap-y-7 text-center w-full lg:w-[50%] lg:text-start">
        <p class="title text-32 leading-24 lg:text-74 lg:leading-59">Luxury Tours</p>
        <span class="text-16 font-medium"
          >With TailGrids, business and students thrive together. Business can perfectly match their
          staffing to changing demand throughout the dayed.</span
        >
      </div>
      <trusty-filter @submit="handleSearch" />
    </div>
  </div>
  <div class="main-container px-[9.5%] pb-[7%] pt-[5.2%] 2xl:pt-[2%] 2xl:pb-[4%]">
    <p class="title text-40">Best tours</p>
    <div class="flex flex-col gap-y-6 lg:flex-row lg:gap-y-0 lg:gap-x-[2.6%] mt-[3.5%]">
      <template v-for="tour in tours" :key="tour.id">
        <TrustyTourCard :tour="tour" @click="navigateTo(`/tours/${tour.id}`)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TrustyTourCard from '@/components/ui/TrustyTourCard.vue';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import type { Tour } from '@/types/tours';
import { navigateTo } from 'nuxt/app';
import { useAreasStore } from '@/store/areasStore';
import { Area } from '@/types/areas';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';

const areasStore = useAreasStore();
const toursStore = useToursStore();
const areas = ref<Area[] | null>([]);
const tours = ref<Tour[] | null>([]);

const handleFilterChange = (values: any) => {
  // Сохраняем значения фильтров, но не применяем их автоматически
};

const handleSearch = async (values: any) => {
  toursStore.updateToursFilter(values);
  console.log(values);
  // navigateTo('/tours')
};

const handleGetAreas = () => {};
const getTours = async () => {
  tours.value = (await toursStore.fetchTours()) || tours.value;
};

onMounted(async () => {
  await getTours();
});
</script>

<style scoped>
.banner {
  background: url('@/assets/images/bg-main.png') no-repeat center bottom;
  background-size: cover;
}
</style>
