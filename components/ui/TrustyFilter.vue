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
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';

interface PriceRange {
  min: number;
  max: number;
}

interface FilterValue {
  area_id: number | null;
  max_participants: number | null;
  duration: string | null;
  price: PriceRange | null;
  min_cost?: number | null;
  max_cost?: number | null;
}

const emit = defineEmits(['submit']);
const areasStore = useAreasStore();
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);
const areas = ref<any[]>([]);

const showLabels = ref(true);
const showButton = ref(true);
const buttonText = ref('Search');

const values = ref<FilterValue>({
  area_id: null,
  max_participants: null,
  duration: null,
  price: null,
});

const filterConfigs = ref<
  {
    name: keyof FilterValue;
    label: string;
    options: { value: number | string | PriceRange; label: string }[];
    placeholder?: string;
  }[]
>([
  {
    name: 'area_id',
    label: 'Area',
    options: [],
    placeholder: 'Select an area',
  },
  {
    name: 'max_participants',
    label: 'Number of people',
    options: Array.from({ length: 8 }, (_, i) => ({ value: i + 1, label: `${i + 1} People` })),
    placeholder: 'Select number of people',
  },
  {
    name: 'duration',
    label: 'Duration',
    options: [
      { value: '02:00', label: '2 hours' },
      { value: '04:00', label: '4 hours' },
      { value: '06:00', label: '6 hours' },
      { value: '08:00', label: '8 hours' },
    ],
    placeholder: 'Select duration',
  },
  {
    name: 'price',
    label: 'Price',
    options: [
      { value: { min: 500, max: 1500 }, label: '500-1500 EUR' },
      { value: { min: 1500, max: 2500 }, label: '1500-2500 EUR' },
      { value: { min: 2500, max: 1000000000000 }, label: '2500+ EUR' },
    ],
    placeholder: 'Select price range',
  },
]);

const fetchAreasData = async () => {
  areas.value = (await areasStore.fetchAreas()) || [];
  updateFilterConfigs();
};

const updateFilterConfigs = () => {
  const areaFilter = filterConfigs.value.find((f) => f.name === 'area_id');
  if (areaFilter) {
    areaFilter.options = areas.value.map((area: { id: number; name: string }) => ({
      value: area.id,
      label: area.name,
    }));
  }
};

const getMatchingPriceRange = (
  minCost: number | null,
  maxCost: number | null
): PriceRange | null => {
  const priceFilter = filterConfigs.value.find((f) => f.name === 'price');
  if (priceFilter) {
    const match = priceFilter.options.find(
      (opt) =>
        typeof opt.value === 'object' &&
        (opt.value as PriceRange).min === minCost &&
        (opt.value as PriceRange).max === maxCost
    );
    return match ? (match.value as PriceRange) : null;
  }
  return null;
};

const syncValuesWithStore = () => {
  const filter = toursFilter.value ?? {};
  values.value = {
    area_id: filter.area_id || null,
    max_participants: filter.max_participants || null,
    duration: filter.duration || null,
    price: getMatchingPriceRange(filter.min_cost ?? null, filter.max_cost ?? null),
  };
};

watch(toursFilter, syncValuesWithStore, { deep: true });

watch(
  () => values.value.price,
  (newPrice) => {
    if (newPrice) {
      values.value.min_cost = newPrice.min;
      values.value.max_cost = newPrice.max;
    } else {
      values.value.min_cost = null;
      values.value.max_cost = null;
    }
  }
);

const handleChange = <T extends keyof FilterValue>(name: T, value: FilterValue[T]) => {
  values.value[name] = value;
};

const handleSubmit = () => {
  const formattedValues = {
    area_id: values.value.area_id,
    max_participants: values.value.max_participants,
    duration: values.value.duration,
    min_cost: values.value.price?.min ?? null,
    max_cost: values.value.price?.max ?? null,
  };
  emit('submit', formattedValues);
};

onMounted(async () => {
  await fetchAreasData();
  syncValuesWithStore();
});
</script>
