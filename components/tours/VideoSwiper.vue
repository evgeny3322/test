<template>
  <div class="rounded-[1rem] overflow-hidden bg-grey-light-1">
    <swiper-container
      init="false"
      class="videoSlider w-full h-full !flex flex-col"
      ref="videoSlider"
    >
      <swiper-slide
        v-for="(tour, index) in props.tours"
        :key="index"
        class="!w-full px-8 pt-8 !h-auto"
      >
        <div v-if="init" class="flex gap-[1.875rem]">
          <TrustyVideoPlayer
            :controls="false"
            :src="tour.video"
            class="rounded-[0.75rem] max-w-[44.5rem] max-h-[26.188rem]"
          />
          <div class="flex flex-col max-[1441px]:max-w-[25.75rem] gap-6 justify-center">
            <div class="flex flex-wrap gap-[0.375rem]">
              <span
                v-for="button in tour.buttons"
                :key="button._id"
                class="text-[0.625rem] bg-grey-light-2 backdrop-blur-xs px-3 py-[0.40rem] rounded-full shadow hover:shadow-lg transition duration-500 ease-in transform"
              >
                {{ button.value }}
              </span>
            </div>
            <p class="text-[3.875rem] leading-[3.488rem]">{{ tour.title }}</p>
            <p class="text-grey-large text-base line-clamp-5 text-sm leading-[1.225rem]">
              {{ tour.description }}
            </p>
            <TrustyButton class="md:max-w-[15.75rem] mt-5"> View Details </TrustyButton>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>
</template>
<script setup lang="ts">
import TrustyVideoPlayer from '../ui/TrustyVideoPlayer.vue';
import { ref } from 'vue';
import { useSwiper } from '@/.nuxt/imports';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import TrustyButton from '../ui/TrustyButton.vue';
import type { Tour } from '@/types/toursTypes';

const props = defineProps<{
  tours: Tour[];
}>();
const randomIndex = ref(Math.floor(Math.random() * props.tours?.length));
const randomIndexValue: number = randomIndex.value;

const videoSlider = ref(null);
const init = ref(false);
const swiper = useSwiper(videoSlider, {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: true,
  },
  pagination: true,
  navigation: false,
  initialSlide: randomIndexValue,
  on: {
    init: () => {
      init.value = true;
    },
  },
});
</script>

<style>
.videoSlider::part(pagination) {
  position: relative !important;
  padding-top: 1rem;
}
</style>
