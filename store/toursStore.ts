import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { toursAPI } from '@/utils/api';
import { Tour, TourFilters } from '@/types/tours';

export const useToursStore = defineStore('tours', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const toursFilter = ref<TourFilters | null>(null);

  const updateToursFilter = (filters: TourFilters) => {
    toursFilter.value = filters;
  };

  const fetchTours = async (filters: TourFilters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await toursAPI.getTours(filters);
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Tour loading error';
    } finally {
      loading.value = false;
    }
  };

  const getTourById = async (id: number) => {
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

  return {
    toursFilter,
    loading,
    error,
    fetchTours,
    getTourById,
    updateToursFilter,
    getHourDiscount,
  };
});
