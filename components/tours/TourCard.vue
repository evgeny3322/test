<template>
  <div
    class="w-full relative overflow-hidden min-h-[344px] h-full object-cover flex justify-center items-center bg-gray-200 p-5 rounded-2xl shadow hover:shadow-lg transition duration-500 ease-in transform"
  >
    <div class="w-full h-full z-1 flex flex-col justify-center items-start self-start">
      <h1 class="text-2xl font-normal leading-[1.875rem]">
        {{ props.tour?.title }}
      </h1>
      <p class="text-lg mb-4">
        {{ props.tour?.semi_title }}
      </p>
      <p class="text-grey-large text-base line-clamp-3 text-sm leading-[1.225rem]">
        {{ props.tour?.description }}
      </p>
      <div class="flex flex-wrap gap-[0.375em] items-center mt-auto w-full h-auto">
        <button
          v-for="(block, index) in tour.buttons"
          :key="index"
          class="text-[0.625rem] bg-grey-light-2 backdrop-blur-xs px-3 py-[0.40rem] rounded-full shadow hover:shadow-lg transition duration-500 ease-in transform"
          @click="$router.push('/tours/' + tour._id)"
        >
          {{ block.value }}
        </button>
      </div>
    </div>
    <NuxtImg
      width="300"
      class="absolute opacity-70 object-cover w-full h-full"
      :src="props.tour?.image"
      alt="Tour"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tour: {
    type: Object,
  },
});
interface Tour {
  title: string;
  video?: string;
  image?: string;
  semi_title?: string;
  description: string;
  buttons?: Blocks[];
  _id: string;
}
interface Blocks {
  value: string;
  _id: string;
}
const tour: Tour = {
  title: 'Tour Chianti',
  semi_title: 'from 1 500 € per person',
  description:
    'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
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
  _id: 'some-id',
};
</script>
