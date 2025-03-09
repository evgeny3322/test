<template>
  <trusty-filter
    class="w-full px-[8.5%] mb-8"
    :showLabels="false"
    :filters="filterConfigs"
    :initial-values="initialFilterValues"
    @update:values="handleFilterChange"
    @submit="handleSearch"
  />
  <div class="w-full flex flex-col gap-[7.5rem] items-center justify-between py-6 px-[5.5%]">
    <div
      class="w-full grid md:grid-cols-4 sm:grid-cols-2 gap-[1.875rem] items-center justify-between"
    >
      <template v-for="(tour, index) in tours" :key="tour._id">
        <!-- Отображаем карточки туров -->
        <TourCard :tour="tour" />

        <!-- Вставляем VideoSwiper после каждых 8 туров -->
        <VideoSwiper
          :tours="tours"
          v-if="(index + 1) % 8 === 0 && index + 1 < tours.length"
          class="col-span-full"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import TourCard from '@/components/ui/TrustyTourCard.vue';
import VideoSwiper from '@/components/tours/VideoSwiper.vue';
import type { Tour } from '@/types/toursTypes';
import { ref } from 'vue';
const filterConfigs = [
  {
    name: 'area',
    label: 'Area',
    placeholder: 'Area',
    options: [
      { value: 'Florence', label: 'Florence' },
      { value: 'Rome', label: 'Rome' },
      { value: 'Venice', label: 'Venice' },
    ],
  },
  {
    name: 'people',
    label: 'Number of people',
    placeholder: 'Number of people',
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
    label: 'Price',
    placeholder: 'Price',
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
// const props = defineProps<{
//   tours: Tours[];
// }>();
</script>
