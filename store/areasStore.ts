import { defineStore } from 'pinia';
import { ref } from 'vue';
import { areasAPI } from '@/services/api';
import type { Area, AreasResponse } from '@/types/areas';

export const useAreasStore = defineStore('areas', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAreas = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await areasAPI.getAreas();
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Areas loading error';
    } finally {
      loading.value = false;
    }
  };

  const getAreaById = async (id: number): Promise<Area | null> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await areasAPI.getAreaById(id);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Area loading error';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    fetchAreas,
    getAreaById,
  };
});
