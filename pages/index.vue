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
      <trusty-filter :disabled="loading" @submit="handleSearch" />
    </div>
  </div>
  <div class="main-container px-[9.5%] pb-[7%] pt-[5.2%] 2xl:pt-[2%] 2xl:pb-[4%]">
    <p class="title text-40">Best tours</p>

    <div v-if="loading" class="w-full text-center py-8 mt-[3.5%]">
      <PreloaderAnimIcon class="mx-auto" theme="white" />
      <p class="mt-4 text-gray-300">Loading tours...</p>
    </div>

    <div v-else class="flex flex-col gap-y-6 lg:flex-row lg:gap-y-0 lg:gap-x-[2.6%] mt-[3.5%]">
      <div v-if="featuredTours.length === 0" class="text-center w-full py-12">
        <p class="text-xl text-gray-300">No featured tours found.</p>
      </div>

      <div v-else class="lg:flex w-full relative hidden">
        <template v-if="featuredTours.length > 4">
          <button class="swiper-button-prev-custom" ref="prevBtn">
            <arrow-slide-icon class="rotate-180" />
          </button>
          <button class="swiper-button-next-custom" ref="nextBtn">
            <arrow-slide-icon />
          </button>
        </template>

        <swiper-container ref="swiperEl" init="false" class="w-full">
          <swiper-slide v-for="tour in featuredTours" :key="tour.id">
            <TrustyTourCard :tour="tour" @click="navigateTo(`/tours/${tour.id}`)" />
          </swiper-slide>
        </swiper-container>
      </div>

      <div v-if="featuredTours.length > 0" class="block lg:hidden w-full">
        <div v-for="tour in tours" :key="tour.id" class="mb-6">
          <TrustyTourCard :tour="tour" @click="navigateTo(`/tours/${tour.id}`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, nextTick } from 'vue';
import TrustyTourCard from '@/components/ui/TrustyTourCard.vue';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import type { Tour } from '@/types/tours';
import { navigateTo } from 'nuxt/app';
import { useAreasStore } from '@/store/areasStore';
import { Area } from '@/types/areas';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';
import ArrowSlideIcon from '@/components/icons/ArrowSlideIcon.vue';
import type { SwiperContainer } from 'swiper/element';

import { register } from 'swiper/element/bundle';
register();

const areasStore = useAreasStore();
const toursStore = useToursStore();
const { toursFilter } = storeToRefs(toursStore);
const areas = ref<Area[] | null>([]);
const tours = ref<Tour[] | null>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const swiperEl = ref<SwiperContainer | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const nextBtn = ref<HTMLElement | null>(null);

const featuredTours = computed(() => {
  return tours.value || [];
});

const handleSearch = async (values: any) => {
  toursStore.updateToursFilter(values);
  navigateTo('/tours');
};

const getFeaturedTours = async () => {
  loading.value = true;
  error.value = null;

  try {
    tours.value = await toursStore.fetchTours({ featured: 1 });

    await nextTick();
    initSwiper();
  } catch (err) {
    console.error('Error fetching tours:', err);
    error.value = 'Failed to load tours. Please try again.';
    tours.value = [];
  } finally {
    loading.value = false;
  }
};

const initSwiper = () => {
  if (!featuredTours.value.length) {
    console.warn('No featured tours to display');
    return;
  }

  if (!swiperEl.value) {
    console.warn('Swiper element not found');
    return;
  }

  const swiperParams = {
    loop: featuredTours.value.length > 4,
    slidesPerView: 4,
    spaceBetween: 30,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      1280: { slidesPerView: 4, spaceBetween: 30 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
      768: { slidesPerView: 2, spaceBetween: 30 },
      375: { slidesPerView: 1, spaceBetween: 30 },
    },
  };

  Object.assign(swiperEl.value, swiperParams);

  swiperEl.value.initialize();

  nextTick(() => {
    if (swiperEl.value?.swiper && prevBtn.value && nextBtn.value) {
      swiperEl.value.swiper.params.navigation = {
        nextEl: nextBtn.value,
        prevEl: prevBtn.value,
      };

      swiperEl.value.swiper.navigation.init();
      swiperEl.value.swiper.navigation.update();
    }
  });
};

onMounted(async () => {
  await getFeaturedTours();
  setTimeout(() => {
    if (featuredTours.value.length > 0 && swiperEl.value && !swiperEl.value.swiper) {
      initSwiper();
    }
  }, 100);
});

</script>

<style scoped>
.banner {
  background: url('@/assets/images/bg-main.png') no-repeat center bottom;
  background-size: cover;
}

.swiper-button-prev-custom,
.swiper-button-next-custom {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;
}

.swiper-button-prev-custom {
  left: -25px;
}

.swiper-button-next-custom {
  right: -25px;
}
</style>
