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
        class="!w-full md:px-[3.25rem] px-5 md:pt-[3.25rem] pt-5 !h-auto"
      >
        <div v-if="init" class="flex md:flex-row flex-col gap-[1.875rem] max-[1279px]:h-full">
          <TrustyVideoPlayer
            :controls="false"
            :src="tour.media[0]"
            class="rounded-[0.75rem] xl:min-w-[41.813rem] xl:min-h-[23.563rem] max-w-[44.5rem] md:max-h-[26.188rem] max-h-[10rem] min-h-[10rem]"
          />
          <div
            class="flex flex-col max-[1441px]:max-w-[25.75rem] w-full max-[950px]:!max-w-[100%] gap-6 justify-center max-[1279px]:h-full"
          >
            <div class="flex flex-wrap gap-[0.375rem]">
              <trusty-chip class="max-h-[1.625rem] flex justify-center items-center">
                {{ tour?.area?.name }}
              </trusty-chip>
              <trusty-chip class="max-h-[1.625rem] flex justify-center items-center">
                {{ formatDuration(+tour?.duration) }}
              </trusty-chip>
              <trusty-chip class="max-h-[1.625rem] flex justify-center items-center">
                1-{{ tour?.max_participants }} persons
              </trusty-chip>
            </div>
            <p class="md:text-[3.875rem] text-[2.25rem] leading-[3.488rem]">{{ tour.name }}</p>
            <p class="text-grey-large text-base line-clamp-5 text-sm leading-[1.225rem]">
              {{ tour.description }}
            </p>
            <TrustyButton
              class="md:max-w-[12rem] mt-auto font-normal"
              @click="navigateToTour(tour.id)"
            >
              View Details
            </TrustyButton>
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

import 'swiper/css';
import 'swiper/css/pagination';
import TrustyButton from '../ui/TrustyButton.vue';
import { Tour } from '@/types/tours';
import TrustyChip from '@/components/ui/TrustyChip.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{
  tours: Tour[];
}>();

const randomIndex = ref(Math.floor(Math.random() * props.tours?.length));
const randomIndexValue: number = randomIndex.value;
const videoSlider = ref(null);
const init = ref(false);
const formatDuration = (minutes?: number): string => {
  if (!minutes) return '0 Min';
  const hrs = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${hrs > 0 ? `${hrs} Hrs` : ''} ${min > 0 ? `${min} Min` : ''}`.trim();
};
const swiper = useSwiper(videoSlider, {
  loop: true,
  autoplay: {
    delay: 10000,
    disableOnInteraction: true,
  },
  navigation: true,
  pagination: true,
  initialSlide: randomIndexValue,
  on: {
    init: () => {
      init.value = true;
    },
  },
});

const navigateToTour = (id: number) => {
  if (id) {
    router.push(`/tours/${id}`);
  }
};
</script>
<style>
.videoSlider::part(pagination) {
  position: relative !important;
  padding-top: 1.4rem;
  padding-bottom: 0.625rem;
}
.videoSlider::part(button-next) {
  color: white;
  width: 0.625rem;
  right: 1.563rem;
}
.videoSlider::part(button-prev) {
  color: white;
  width: 0.625rem;
  left: 1.563rem;
}
.videoSlider::part(bullet) {
  background: white;
}
.videoSlider::part(bullet-active) {
  background: white;
}
@media screen and (max-width: 768px) {
  .videoSlider::part(button-prev),
  .videoSlider::part(button-next) {
    display: none;
  }
}
</style>
