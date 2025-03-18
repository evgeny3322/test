<template>
  <div
    class="mt-9 bg-secondary-black p-6 rounded-[12px] flex flex-col lg:flex-row space-y-4 lg:space-x-6 lg:space-y-0 lg:justify-between lg:items-end"
  >
    <div v-for="(filter, index) in filterConfigs" :key="index" class="flex flex-col w-full">
      <span
        v-if="showLabels && filter.label"
        class="text-[#B3B3B3] font-medium leading-6 text-[13px] mb-[6px]"
      >
        {{ filter.label }}
      </span>

      <trusty-complete
        :options="filter.options"
        v-model="values[filter.name]"
        itemClass="p-[6px]"
        :placeholder="filter.placeholder"
        @change="handleChange(filter.name, $event)"
        select-class="p-[13px] h-[50px]"
        :id="`filter-${filter.name}`"
      />
    </div>

    <trusty-button v-if="showButton" @click="handleSubmit" class="text-nowrap">
      {{ buttonText }}
    </trusty-button>
  </div>
</template>

<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { ref, onMounted, watch } from 'vue';
import { useAreasStore } from '@/store/areasStore';

const emit = defineEmits(['submit']);
const areasStore = useAreasStore();
const areas = ref<any[]>([]);

const showLabels = ref(true);
const showButton = ref(true);
const buttonText = ref('Search');

const values = ref<Record<string, string | number | null>>({});

const filterConfigs = ref<any>([
  {
    name: 'area_id',
    label: 'Area',
    options: [],
  },
  {
    name: 'max_participants',
    label: 'Number of people',
    options: [
      { value: 1, label: '1 People' },
      { value: 2, label: '2 People' },
      { value: 3, label: '3 People' },
      { value: 4, label: '4 People' },
      { value: 5, label: '5 People' },
      { value: 6, label: '6 People' },
      { value: 7, label: '7 People' },
      { value: 8, label: '8 People' },
    ],
  },
  {
    name: 'duration',
    label: 'Duration',
    options: [
      { value: '2', label: '2 hours' },
      { value: '4', label: '4 hours' },
      { value: '6', label: '6 hours' },
      { value: '8', label: '8 hours' },
    ],
  },
  {
    name: 'price',
    label: 'Price',
    options: [
      { value: { min: 500, max: 1500 }, label: '500-1500 EUR' },
      { value: { min: 1500, max: 2500 }, label: '1500-2500 EUR' },
      { value: { min: 500 }, label: '2500+ EUR' },
    ],
  },
]);

const fetchAreasData = async () => {
  areas.value = (await areasStore.fetchAreas()) || [];
  updateFilterConfigs();
};

const updateFilterConfigs = () => {
  filterConfigs.value[0].options =
    areas.value.map((area) => ({ value: area.id, label: area.name })) || [];
};

const handleChange = (name: string, value: string | number) => {
  values.value[name] = value;
};

const handleSubmit = () => {
  const formattedValues = {
    area_id: values.value.area_id || null,
    max_participants: values.value.max_participants || null,
    duration: values.value.duration || '',
    min_cost:
      values.value.price && typeof values.value.price === 'object' && 'min' in values.value.price
        ? (values.value.price as { min: number }).min
        : null,
    max_cost:
      values.value.price && typeof values.value.price === 'object' && 'max' in values.value.price
        ? (values.value.price as { max: number }).max
        : null,
  };
  emit('submit', formattedValues);
};

onMounted(fetchAreasData);
</script>
