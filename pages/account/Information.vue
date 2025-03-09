<template>
  <div class="grid grid-cols-12 gap-x-7">
    <div class="bg-[#262626] p-8 rounded-main-sm flex flex-col gap-y-6 col-span-8">
      <trusty-field model-value="" label="First Name" />
      <trusty-field model-value="" label="Last Name" />
      <trusty-field model-value="" label="E-mail Address" type="email" />
      <trusty-field model-value="" label="Mobile Phone Number" type="tel" />
      <trusty-button class="!py-5 mt-2"> Edit </trusty-button>
    </div>
    <div class="col-span-4 flex flex-col gap-y-7 justify-between">
      <div class="bg-[#151515] p-6 rounded-main-sm h-full">
        <p class="title text-18 font-medium mb-3">Information</p>
        <span class="text-grey-light-4 text-14"
          >At least 8 characters, at least one capital and small letter, number and special
          character.At least 8 characters, at least one capital and small letter, number and special
          character.</span
        >
      </div>
      <div class="rounded-main-sm">
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
            grab-cursor
            :pagination="true"
            :navigation="true"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false,
            }"
          >
            <swiper-slide
              class="overflow-hidden rounded-[14px]"
              v-for="slide in slides"
              :key="slide.src"
            >
              <div class="relative">
                <NuxtImg
                  class="!rounded-[14px] max-h-[347px] w-full object-cover"
                  alt="slide"
                  :src="slide.src"
                />
                <div class="absolute top-0 h-full w-full bg-[#00000033] z-10"></div>
                <div class="absolute top-0 h-full w-full p-5 z-11 flex flex-col justify-between">
                  <div>
                    <p class="font-medium text-26 leading-30 mb-[6px]">{{ slide.title }}</p>
                    <span class="font-medium text-18 leading-24">{{ slide.price }}</span>
                  </div>
                  <div class="mb-[14px]">
                    <span class="text-grey-light-7">{{
                      slide.desc.length > 50 ? slide.desc.slice(0, 50) + '...' : slide.desc
                    }}</span>
                    <div class="flex flex-row mt-4 gap-x-[6px]">
                      <trusty-chip v-for="chip in slide.chips">{{ chip.value }}</trusty-chip>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyField from '@/components/ui/TrustyField.vue';
import { SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import TrustyChip from '@/components/ui/TrustyChip.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import ArrowSlideIcon from '@/components/icons/ArrowSlideIcon.vue';

//TODO добавить типы когда будут известны данные
const slides = ref([
  {
    src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Mysterious Venice',
    price: 'from 1 500 € per person',
    desc: 'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    chips: [{ value: 'Venice' }, { value: '4 Hrs' }, { value: '2-8 persons' }],
  },
  {
    src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Mysterious Venice',
    price: 'from 1 500 € per person',
    desc: 'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    chips: [{ value: 'Venice' }, { value: '4 Hrs' }, { value: '2-8 persons' }],
  },
  {
    src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Mysterious Venice',
    price: 'from 1 500 € per person',
    desc: 'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    chips: [{ value: 'Venice' }, { value: '4 Hrs' }, { value: '2-8 persons' }],
  },
  {
    src: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Mysterious Venice',
    price: 'from 1 500 € per person',
    desc: 'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
    chips: [{ value: 'Venice' }, { value: '4 Hrs' }, { value: '2-8 persons' }],
  },
]);
</script>

<style scoped></style>
