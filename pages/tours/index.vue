<template>
  <trusty-filter
    class="w-full px-[8.5%] mb-8"
    :showLabels="false"
    :disabled="loading"
    :initial-values="initialFilterValues"
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
        <p class="text-xl text-gray-300">No tours found matching your criteria.</p>
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
import { ref, onMounted } from 'vue';
import { navigateTo } from 'nuxt/app';
import { storeToRefs } from 'pinia';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';

const tours = ref<Tour[]>([]);
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);
const loading = ref(true);
const error = ref<string | null>(null);

const initialFilterValues = toursFilter.value || {};

const handleSearch = async (values: TourFilters) => {
  loading.value = true;
  error.value = null;

  try {
    toursStore.updateToursFilter(values);

    tours.value = await toursStore.fetchTours(values);
  } catch (err) {
    error.value = 'Failed to search tours. Please try again.';
    console.error('Search error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    tours.value = await toursStore.fetchTours(toursFilter.value || {});
  } catch (err) {
    error.value = 'Failed to load tours. Please try again.';
    console.error('Error fetching tours:', err);
  } finally {
    loading.value = false;
  }
});
</script>
