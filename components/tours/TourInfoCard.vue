<template>
  <div class="bg-[#262626] p-6 rounded-main-sm flex flex-col">
    <p class="mb-4 text-28">{{ data.title }}</p>
    <div class="border-y-1 border-[#313131] py-4 flex flex-row gap-x-8">
      <NuxtImg :src="data.img" class="max-w-[167px] max-h-[261px] rounded-main-sm object-cover" />
      <div>
        <p class="text-28">{{ data.title }}</p>
        <div class="mt-5 grid grid-cols-12 grid-rows-3 gap-x-15 gap-y-8">
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Area:</span>
            <p class="text-18">{{ data.area }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Total duration:</span>
            <p class="text-18">{{ data.duration }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">List of services:</span>
            <p class="text-18">{{ data.services[0].name }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Date:</span>
            <p class="text-18">{{ data.date }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Price per participant:</span>
            <p class="text-18">{{ data.price }} EUR/P</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">List of services:</span>
            <p class="text-18">{{ data.services[1].name }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Number of participants:</span>
            <p class="text-18">{{ data.participants }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">Car:</span>
            <p class="text-18">{{ data.cars[0].model }}</p>
          </div>
          <div class="flex flex-col gap-y-2 col-span-4">
            <span class="text-18 text-grey-light-4">List of services:</span>
            <p class="text-18">{{ data.services[2].name }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-row justify-end">
      <div class="flex flex-row items-center gap-x-6 mt-4">
        <p class="text-24 font-semibold">1 100 EUR</p>
        <trusty-button> Duplicate Tour </trusty-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//TODO добавить нужные типы и вынести их
import TrustyButton from '@/components/ui/TrustyButton.vue';

const props = defineProps<{
  data: {
    title: string;
    img: string;
    area: string;
    duration: string;
    services: any;
    date: string;
    participants: number;
    price: number;
    cars: any;
  };
}>();
</script>

<style scoped></style>
