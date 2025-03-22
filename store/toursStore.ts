import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toursAPI } from '@/utils/api';
import { CustomTour, Tour, TourFilters } from '@/types/tours';

export const useToursStore = defineStore('tours', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const toursFilter = ref<TourFilters | null>(null);
  const cachedTours = ref<Map<string, Tour[]>>(new Map());

  const generateCacheKey = (filters: TourFilters): string => {
    return JSON.stringify(filters || {});
  };
  const customTour = ref<CustomTour | null>(null);

  const updateCustomTour = (tour: CustomTour) => {
    customTour.value = tour;
  };
  const updateToursFilter = (filters: TourFilters) => {
    toursFilter.value = { ...filters };
  };

  const fetchTours = async (filters: TourFilters = {}): Promise<Tour[]> => {
    loading.value = true;
    error.value = null;

    const cacheKey = generateCacheKey(filters);

    if (cachedTours.value.has(cacheKey)) {
      loading.value = false;
      return cachedTours.value.get(cacheKey) || [];
    }

    try {
      const response = await toursAPI.getTours(filters);
      const tours = response.data.data;

      cachedTours.value.set(cacheKey, tours);

      return tours;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Tour loading error';
      return [];
    } finally {
      loading.value = false;
    }
  };

  const getFeaturedTours = async () => {
    return await fetchTours({ featured: 1 });
  };

  const getTourById = async (id: number): Promise<Tour | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await toursAPI.getTourById(id);
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Tour loading error';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getHourDiscount = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await toursAPI.getDiscount();
      return response.data.data[0].value;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Tour loading error';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const clearCache = () => {
    cachedTours.value.clear();
  };

  return {
    toursFilter,
    customTour,
    loading,
    error,
    fetchTours,
    getFeaturedTours,
    getTourById,
    updateToursFilter,
    getHourDiscount,
    updateCustomTour,
    clearCache,
  };
});
