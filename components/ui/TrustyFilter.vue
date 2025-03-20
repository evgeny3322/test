<template>
  <div
    class="mt-9 bg-secondary-black p-6 rounded-[12px] flex flex-col lg:flex-row space-y-4 lg:space-x-6 lg:space-y-0 lg:justify-between lg:items-end"
    :class="{ 'opacity-80': disabled }"
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
        :disabled="disabled"
        :placeholder="filter.placeholder"
      />
    </div>

    <trusty-button v-if="showButton" @click="handleSubmit" class="text-nowrap" :disabled="disabled">
      <div v-if="disabled" class="flex items-center justify-center">
        <PreloaderAnimIcon class="size-5 mr-2" theme="black" />
        <span>{{ buttonText }}</span>
      </div>
      <span v-else>{{ buttonText }}</span>
    </trusty-button>
  </div>
</template>

<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { ref, onMounted, watch } from 'vue';
import { useAreasStore } from '@/store/areasStore';

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
const areas = ref<any[]>([]);

const props = defineProps({
  showLabels: {
    type: Boolean,
    default: true,
  },
  showButton: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'Search',
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const values = ref<FilterValue>({
  area_id: null,
  max_participants: null,
  duration: null,
  price: null,
  min_cost: null,
  max_cost: null,
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
    placeholder: 'Whole country',
  },
  {
    name: 'max_participants',
    label: 'Number of people',
    options: Array.from({ length: 8 }, (_, i) => ({ value: i + 1, label: `${i + 1} People` })),
    placeholder: 'Any',
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
    placeholder: 'Show all',
  },
  {
    name: 'price',
    label: 'Price',
    options: [
      { value: { min: 500, max: 1500 }, label: '500-1500 EUR' },
      { value: { min: 1500, max: 2500 }, label: '1500-2500 EUR' },
      { value: { min: 2500, max: 1000000000000 }, label: '2500+ EUR' },
    ],
    placeholder: 'Show all',
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

const initializeValues = () => {
  if (props.initialValues && Object.keys(props.initialValues).length > 0) {
    const initialValues = props.initialValues as any;

    values.value = {
      area_id: initialValues.area_id || null,
      max_participants: initialValues.max_participants || null,
      duration: initialValues.duration || null,
      price: getMatchingPriceRange(initialValues.min_cost, initialValues.max_cost),
      min_cost: initialValues.min_cost || null,
      max_cost: initialValues.max_cost || null,
    };
  }
};

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
  if (props.disabled) return;

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
  initializeValues();
});
</script>
