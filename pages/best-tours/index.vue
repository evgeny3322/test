<template>
  <trusty-filter
    class="w-full px-[8.5%] mb-8"
    :disabled="loading"
    :initial-values="initialFilterValues"
    @submit="handleSearch"
  />
  <div
    class="w-full flex flex-col gap-[7.5rem] items-center justify-between py-[2.5rem] lg:py-[3.80rem] px-[5.5%]"
  >
    <div v-if="loading" class="w-full text-center py-8">
      <PreloaderAnimIcon class="mx-auto" theme="white" />
      <p class="mt-4 text-gray-300">Loading tours...</p>
    </div>

    <div
      v-else
      class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-[1.875rem] items-center justify-between"
    >
      <template v-if="featuredTours.length > 0">
        <template v-for="(tour, index) in featuredTours" :key="tour.id">
          <TrustyTourCard :tour="tour" @click="navigateTo('/tours/' + tour.id)" />
        </template>
      </template>

      <div v-else class="text-center col-span-full py-12">
        <p class="text-xl text-gray-300">No featured tours found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyTourCard from '@/components/ui/TrustyTourCard.vue';
import type { Tour, TourFilters } from '@/types/tours';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import { useToursStore } from '@/store/toursStore';
import { computed, onMounted, ref } from 'vue';
import { navigateTo } from 'nuxt/app';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { storeToRefs } from 'pinia';

const tours = ref<Tour[]>([]);
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);
const loading = ref(true);
const error = ref<string | null>(null);

const initialFilterValues = {
  ...(toursFilter.value || {}),
  featured: 1,
};

const featuredTours = computed(() => {
  return tours.value;
});

const handleSearch = async (values: TourFilters) => {
  loading.value = true;

  try {
    const filters = { ...values, featured: 1 };
    toursStore.updateToursFilter(filters);
    tours.value = await toursStore.fetchTours(filters);
  } catch (err) {
    error.value = 'Failed to search tours. Please try again.';
    console.error('Search error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  error.value = null;

  try {
    const filters = {
      ...(toursFilter.value || {}),
      featured: 1,
    };

    tours.value = await toursStore.fetchTours(filters);
  } catch (err) {
    error.value = 'Failed to load tours. Please try again.';
    console.error('Error fetching tours:', err);
    tours.value = [];
  } finally {
    loading.value = false;
  }
});
</script>
