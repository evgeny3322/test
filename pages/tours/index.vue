<template>
  <trusty-filter class="w-full px-[8.5%] mb-8" :showLabels="false" @submit="handleSearch" />
  <div class="w-full flex flex-col gap-[7.5rem] items-center justify-between py-6 px-[5.5%]">
    <div
      class="w-full grid md:grid-cols-4 sm:grid-cols-2 gap-[1.875rem] items-center justify-between"
    >
      <template v-for="(tour, index) in tours" :key="tour.id">
        <TourCard :tour="tour" @click="navigateTo('/tours/' + tour.id)" />
        <VideoSwiper
          :tours="tours"
          v-if="(index + 1) % 8 === 0 && index + 1 < tours.length"
          class="col-span-full"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import TourCard from '@/components/ui/TrustyTourCard.vue';
import VideoSwiper from '@/components/tours/VideoSwiper.vue';
import type { Tour, TourFilters } from '@/types/tours';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import { useToursStore } from '@/store/toursStore';
import { onMounted, ref, watchEffect } from 'vue';
import { navigateTo } from 'nuxt/app';
import { storeToRefs } from 'pinia';

const tours = ref<Tour[]>([]);
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);

const handleSearch = async (values: any) => {
  toursStore.updateToursFilter(values);
  console.log(values);
  if (values) {
    toursStore.updateToursFilter(values);
  }
};

const getTours = async (filters: TourFilters = {}) => {
  tours.value = (await toursStore.fetchTours(filters)) || tours.value;
};

watchEffect(() => {
  if (toursFilter.value) {
    getTours(toursFilter.value);
  } else {
    getTours();
  }
});
</script>
