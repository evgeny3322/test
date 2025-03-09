<template>
  <trusty-filter
    :filters="filterConfigs"
    :initial-values="initialFilterValues"
    @update:values="handleFilterChange"
    @submit="handleSearch"
    button-text="Search"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';

const filterConfigs = [
  {
    name: 'area',
    placeholder: 'Select area',
    options: [
      { value: 'Florence', label: 'Florence' },
      { value: 'Rome', label: 'Rome' },
      { value: 'Venice', label: 'Venice' },
    ],
  },
  {
    name: 'people',
    placeholder: 'Pax(1-8)',
    options: [
      { value: 1, label: '1 People' },
      { value: 2, label: '2 People' },
      { value: 3, label: '3 People' },
      { value: 4, label: '4 People' },
    ],
  },
  {
    name: 'duration',
    placeholder: 'Duration',
    options: [
      { value: 1, label: '1 hour' },
      { value: 2, label: '2 hours' },
      { value: 3, label: '3 hours' },
      { value: 4, label: '4 hours' },
    ],
  },
  {
    name: 'price',
    placeholder: 'Price range',
    options: [
      { value: 1, label: '1500 - 2500 €' },
      { value: 2, label: '2500 - 3500 €' },
      { value: 3, label: '3500 - 4500 €' },
      { value: 4, label: '4500 - 5500 €' },
    ],
  },
];

const initialFilterValues = {
  area: '',
  people: '',
  duration: '',
  price: '',
};

const currentFilters = ref({ ...initialFilterValues });

const handleFilterChange = (values: any) => {
  currentFilters.value = values;
  // Сохраняем значения фильтров, но не применяем их автоматически
};

const handleSearch = (values: any) => {
  // Здесь можете отправить запрос к API с параметрами фильтра
};
</script>
