<template>
  <div class="lg:min-h-[511px] banner flex justify-end">
    <div
      class="md:max-w-[1440px] xl:max-w-[1920px] w-full px-[9.5%] py-[8%] lg:py-[2.5%] flex flex-col justify-end mx-auto"
    >
      <div class="flex flex-col gap-y-7 text-center w-full lg:w-[50%] lg:text-start">
        <p class="title text-32 leading-24 lg:text-74 lg:leading-59">Luxury Tours</p>
        <span class="text-16 font-medium"
          >With TailGrids, business and students thrive together. Business can perfectly match their
          staffing to changing demand throughout the dayed.</span
        >
      </div>
      <trusty-filter
        v-model:values="currentFilters"
        :filters="filterConfigs"
        :initial-values="initialFilterValues"
        @submit="handleSearch"
        button-text="Search"
      />
    </div>
  </div>
  <div class="main-container px-[9.5%] pb-[7%] pt-[5.2%] 2xl:pt-[2%] 2xl:pb-[4%]">
    <p class="title text-40">Best tours</p>
    <div class="flex flex-col gap-y-6 lg:flex-row lg:gap-y-0 lg:gap-x-[2.6%] mt-[3.5%]">
      <template v-for="tour in tours" :key="tour._id">
        <TrustyTourCard :tour="tour" @click="navigateTo(`/tours/${tour._id}`)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TrustyTourCard from '@/components/ui/TrustyTourCard.vue';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import type { Tour } from '@/types/tours';
import { navigateTo } from 'nuxt/app';

const filterConfigs = [
  {
    name: 'area',
    label: 'Area',
    options: [
      { value: 'Florence', label: 'Florence' },
      { value: 'Rome', label: 'Rome' },
      { value: 'Venice', label: 'Venice' },
    ],
  },
  {
    name: 'people',
    label: 'Number of people',
    options: [
      { value: 1, label: '1 People' },
      { value: 2, label: '2 People' },
      { value: 3, label: '3 People' },
      { value: 4, label: '4 People' },
    ],
  },
  {
    name: 'duration',
    label: 'Duration',
    options: [
      { value: 1, label: '1 hour' },
      { value: 2, label: '2 hours' },
      { value: 3, label: '3 hours' },
      { value: 4, label: '4 hours' },
    ],
  },
  {
    name: 'price',
    label: 'Price',
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

const tours: Tour[] = [
  {
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image:
      'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Great Rome',
    semi_title: 'from 1 500 € per person',
    description:
      'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    _id: 'some-id',
    buttons: [
      {
        value: 'Venice',
        _id: 'some-id',
      },
      {
        value: '8 Hrs',
        _id: 'some-id',
      },
      {
        value: '2-8 persons',
        _id: 'some-id',
      },
    ],
  },
  {
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image:
      'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Great Rome',
    semi_title: 'from 1 500 € per person',
    description:
      'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    _id: 'some-id',
    buttons: [
      {
        value: 'Venice',
        _id: 'some-id',
      },
      {
        value: '8 Hrs',
        _id: 'some-id',
      },
      {
        value: '2-8 persons',
        _id: 'some-id',
      },
    ],
  },
  {
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image:
      'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Great Rome',
    semi_title: 'from 1 500 € per person',
    description:
      'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    _id: 'some-id',
    buttons: [
      {
        value: 'Venice',
        _id: 'some-id',
      },
      {
        value: '8 Hrs',
        _id: 'some-id',
      },
      {
        value: '2-8 persons',
        _id: 'some-id',
      },
    ],
  },
  {
    video: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image:
      'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Great Rome',
    semi_title: 'from 1 500 € per person',
    description:
      'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    _id: 'some-id',
    buttons: [
      {
        value: 'Venice',
        _id: 'some-id',
      },
      {
        value: '8 Hrs',
        _id: 'some-id',
      },
      {
        value: '2-8 persons',
        _id: 'some-id',
      },
    ],
  },
];
</script>

<style scoped>
.banner {
  background: url('@/assets/images/bg-main.png') no-repeat center bottom;
  background-size: cover;
}
</style>
