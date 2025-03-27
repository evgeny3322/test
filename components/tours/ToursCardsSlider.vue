<template>
  <div class="rounded-2xl">
    <ClientOnly>
      <swiper-container
        :style="{
          '--swiper-navigation-color': '#fff',
          '--swiper-navigation-size': '20px',
          '--swiper-pagination-color': '#fff',
          '--swiper-pagination-bullet-size': '8px',
          '--swiper-pagination-bullet-width': '8px',
          '--swiper-pagination-bullet-height': '8px',
          '--swiper-pagination-bullet-inactive-color': '#fff',
          '--swiper-pagination-bullet-opacity': '1',
        }"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        grab-cursor
        :pagination="true"
        :navigation="true"
      >
        <swiper-slide
          class="overflow-hidden rounded-[14px] h-[144px] md:h-[347px]"
          v-for="tour in tours"
          :key="tour.id"
        >
          <div @click="navigateTo(`/tours/${tour.id}`)" class="relative h-full cursor-pointer">
            <NuxtImg
              class="!rounded-[14px] h-full w-full object-cover"
              alt="tour"
              height="100%"
              width="100%"
              :src="tour.media[0]"
            />
            <div class="absolute top-0 h-full w-full bg-[#00000033] z-10"></div>
            <div class="absolute top-0 h-full w-full p-5 z-11 flex flex-col justify-between">
              <div>
                <p class="font-medium text-26 leading-30 mb-[6px] line-clamp-3">{{ tour.name }}</p>
                <p class="text-lg font-medium mb-4">
                  from {{ tour?.min_cost && +tour?.min_cost?.toFixed() }} € per person
                </p>
              </div>
              <div class="mb-[14px]">
                <span class="text-grey-light-7">{{
                  tour.description.length > 50
                    ? tour.description.slice(0, 50) + '...'
                    : tour.description
                }}</span>
                <div class="flex flex-wrap mt-4 gap-x-[6px] gap-y-1">
                  <trusty-chip>{{ tour?.area.name }}</trusty-chip>
                  <trusty-chip>{{ Math.floor(Number(tour.duration) / 60) }} Hrs</trusty-chip>
                  <trusty-chip>1-{{ tour.max_participants }} persons</trusty-chip>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import ArrowSlideIcon from '@/components/icons/ArrowSlideIcon.vue';
import TrustyChip from '@/components/ui/TrustyChip.vue';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Tour } from '@/types/tours';
import { onMounted, ref } from 'vue';
import { useToursStore } from '@/store/toursStore';
import { navigateTo } from 'nuxt/app';

const tours = ref<Tour[]>([]);

const toursStore = useToursStore();

const getTours = async () => {
  tours.value = (await toursStore.fetchTours()) || tours.value;
};
onMounted(() => {
  getTours();
});
</script>

<style scoped></style>
