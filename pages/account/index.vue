<template>
  <div class="block-container flex flex-col justify-between h-full">
    <div class="grid grid-cols-12 gap-x-20">
      <div class="col-span-3 flex flex-col justify-between">
        <div class="flex flex-col gap-y-[6px]">
          <p
            @click="setActiveItem(index)"
            v-for="(item, index) in navItems"
            :key="index"
            class="font-medium text-18 title px-6 py-3 cursor-pointer"
            :class="{ 'rounded-main-sm bg-[#FFFFFF0D]': activeNavIndex === index }"
          >
            {{ item.name }}
          </p>
        </div>
        <p class="px-[13px] text-grey-light-4 font-medium title text-18 cursor-pointer">Log Out</p>
        <template v-if="activeNavIndex === 1">
          <div class="col-span-4 flex flex-col gap-y-7 justify-between">
            <div class="bg-[#151515] p-6 rounded-main-sm h-full">
              <p class="title text-18 font-medium mb-3">Information</p>
              <span class="text-grey-light-4 text-14"
                >At least 8 characters, at least one capital and small letter, number and special
                character.At least 8 characters, at least one capital and small letter, number and
                special character.</span
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
                      <div
                        class="absolute top-0 h-full w-full p-5 z-11 flex flex-col justify-between"
                      >
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
        </template>
      </div>
      <div class="col-span-9">
        <component :is="navItems[activeNavIndex].component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { SwiperSlide } from 'swiper/vue';
import TrustyChip from '@/components/ui/TrustyChip.vue';

interface NavItem {
  name: string;
  component: ReturnType<typeof defineAsyncComponent>;
}

const activeNavIndex = ref<number>(1);

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

const navItems = ref<NavItem[]>([
  {
    name: 'Tours History',
    component: defineAsyncComponent(() => import('./Tours.vue')),
  },
  {
    name: 'Agency information',
    component: defineAsyncComponent(() => import('./AgencyInformation.vue')),
  },
  {
    name: 'Account Information',
    component: defineAsyncComponent(() => import('./Information.vue')),
  },
  {
    name: 'Terms of Service',
    component: defineAsyncComponent(() => import('./Terms.vue')),
  },
  {
    name: 'Documents/Invoices',
    component: defineAsyncComponent(() => import('./DocumentsInvoices.vue')),
  },
]);

const setActiveItem = (index: number) => {
  activeNavIndex.value = index;
};
</script>
