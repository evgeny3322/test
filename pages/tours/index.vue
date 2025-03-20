<template>
  <trusty-filter
    class="w-full px-[8.5%] mb-8"
    :showLabels="false"
    :disabled="loading"
    @submit="handleSearch"
  />
  <div class="w-full flex flex-col gap-[7.5rem] items-center justify-between py-6 px-[5.5%]">
    <div v-if="loading" class="w-full text-center py-8">
      <PreloaderAnimIcon class="mx-auto" theme="white" />
      <p class="mt-4 text-gray-300">Loading tours...</p>
    </div>

    <div
      v-else
      class="w-full grid md:grid-cols-4 sm:grid-cols-2 gap-[1.875rem] items-center justify-between"
    >
      <template v-if="tours.length > 0">
        <template v-for="(tour, index) in tours" :key="tour.id">
          <TourCard :tour="tour" @click="navigateTo('/tours/' + tour.id)" />
          <VideoSwiper
            :tours="tours"
            v-if="(index + 1) % 8 === 0 && index + 1 < tours.length"
            class="col-span-full"
          />
        </template>
      </template>

      <div v-else class="text-center col-span-full py-12">
        <p class="text-xl text-gray-300">No featured tours found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TourCard from '@/components/ui/TrustyTourCard.vue';
import VideoSwiper from '@/components/tours/VideoSwiper.vue';
import type { Tour, TourFilters } from '@/types/tours';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import { useToursStore } from '@/store/toursStore';
import { ref, watchEffect, onMounted } from 'vue';
import { navigateTo } from 'nuxt/app';
import { storeToRefs } from 'pinia';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';

const tours = ref<Tour[]>([]);
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);
const loading = ref(true);
const error = ref<string | null>(null);

const handleSearch = async (values: any) => {
  loading.value = true;
  try {
    toursStore.updateToursFilter(values);
    await getTours(values);
  } catch (err) {
    error.value = 'Failed to search tours. Please try again.';
    console.error('Search error:', err);
  } finally {
    loading.value = false;
  }
};

const getTours = async (filters: TourFilters = {}) => {
  loading.value = true;
  error.value = null;

  try {
    const fetchedTours = await toursStore.fetchTours(filters);
    if (fetchedTours) {
      tours.value = fetchedTours;
    } else {
      tours.value = [];
      if (toursStore.error) {
        error.value = toursStore.error;
      }
    }
  } catch (err) {
    error.value = 'Failed to load tours. Please try again.';
    console.error('Error fetching tours:', err);
    tours.value = [];
  } finally {
    loading.value = false;
  }
};

watchEffect(() => {
  if (toursFilter.value) {
    getTours(toursFilter.value);
  } else {
    getTours();
  }
});

onMounted(() => {
  getTours();
});
</script>
