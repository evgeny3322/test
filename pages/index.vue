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
      <trusty-filter @submit="handleSearch" />
    </div>
  </div>
  <div class="main-container px-[9.5%] pb-[7%] pt-[5.2%] 2xl:pt-[2%] 2xl:pb-[4%]">
    <p class="title text-40">Best tours</p>
    <div class="flex flex-col gap-y-6 lg:flex-row lg:gap-y-0 lg:gap-x-[2.6%] mt-[3.5%]">
      <div class="lg:flex w-full relative">
        <template v-if="featuredTours.length > 4">
          <button class="swiper-button-prev-custom" ref="prevBtn">
            <arrow-slide-icon class="rotate-180" />
          </button>
          <button class="swiper-button-next-custom" ref="nextBtn">
            <arrow-slide-icon />
          </button>
        </template>

        <swiper-container ref="swiperEl" init="false" class="w-full hidden lg:block">
          <swiper-slide v-for="tour in featuredTours" :key="tour.id">
            <TrustyTourCard v-if="init" :tour="tour" @click="navigateTo(`/tours/${tour.id}`)" />
          </swiper-slide>
        </swiper-container>
      </div>
      <div class="block lg:hidden" v-for="tour in featuredTours" :key="tour.id">
        <TrustyTourCard :tour="tour" @click="navigateTo(`/tours/${tour.id}`)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import TrustyTourCard from '@/components/ui/TrustyTourCard.vue';
import TrustyFilter from '@/components/ui/TrustyFilter.vue';
import type { Tour } from '@/types/tours';
import { navigateTo } from 'nuxt/app';
import { useAreasStore } from '@/store/areasStore';
import { Area } from '@/types/areas';
import { useToursStore } from '@/store/toursStore';
import ArrowSlideIcon from '@/components/icons/ArrowSlideIcon.vue';
import { useSwiper } from '@/.nuxt/imports';
import type { SwiperContainer } from 'swiper/element';

const areasStore = useAreasStore();
const toursStore = useToursStore();
const areas = ref<Area[] | null>([]);
const tours = ref<Tour[] | null>([]);

const swiperEl = ref<SwiperContainer | null>(null);
const nextBtn = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const init = ref(false);

const swiper = useSwiper(swiperEl, {
  loop: true,
  slidesPerView: 4,
  spaceBetween: 30,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: nextBtn.value,
    prevEl: prevBtn.value,
  },
  breakpoints: {
    1024: { slidesPerView: 3, spaceBetween: 30 },
    768: { slidesPerView: 2, spaceBetween: 30 },
    375: { slidesPerView: 1, spaceBetween: 30 },
  },
  on: {
    init: () => {
      init.value = true;
    },
  },
});

const handleFilterChange = (values: any) => {
  // Сохраняем значения фильтров, но не применяем их автоматически
};
const featuredTours = computed(() => {
  return tours.value?.filter((tour) => tour.featured) || [];
});
const handleSearch = async (values: any) => {
  toursStore.updateToursFilter(values);
  navigateTo('/tours');
};

const getTours = async () => {
  tours.value = (await toursStore.fetchTours()) || tours.value;
};
const initSwiper = () => {
  if (!swiperEl.value || !nextBtn.value || !prevBtn.value) {
    console.warn('Swiper elements not found');
    return;
  }

  const swiperInstance = swiperEl.value as unknown as HTMLElement & { swiper?: any };

  if (swiperInstance?.swiper) {
    console.log('Swiper instance found:', swiperInstance.swiper);
    swiperInstance.swiper.params.navigation.nextEl = nextBtn.value;
    swiperInstance.swiper.params.navigation.prevEl = prevBtn.value;
    swiperInstance.swiper.navigation.init();
  } else {
    console.warn('Swiper instance not found');
  }
};
onMounted(async () => {
  await getTours();
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
