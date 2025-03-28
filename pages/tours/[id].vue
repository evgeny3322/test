<template>
  <trusty-preloader v-if="loading" title="Loading tour..." />
  <div v-if="!loading" class="block-container">
    <div v-if="tour" class="bg-grey-light-1 rounded-2xl p-5 lg:p-8 grid grid-cols-12">
      <div class="col-span-12 lg:col-span-8 lg:mr-[30px]">
        <ClientOnly>
          <div class="mb-6 block lg:hidden">
            <swiper-container
              @slideChange="onSlideChange"
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
              :loop="true"
              :spaceBetween="10"
              grab-cursor
              class="mb-6"
              :pagination="{ el: '.swiper-pagination', clickable: true }"
              :autoplay="{
                delay: 5000,
                disableOnInteraction: false,
              }"
            >
              <swiper-slide
                class="overflow-hidden rounded-[14px] w-full max-h-[220px] sm:max-h-[320px]"
                v-for="slide in tour?.media"
                :key="slide.id"
              >
                <div class="bg-[#00000080] absolute top-0 left-0 w-full h-full"></div>
                <video-player
                  class="max-h-[220px] sm:max-h-[320px]"
                  v-if="slide.videoUrl"
                  :src="slide.videoUrl"
                />
                <div
                  v-if="!imageLoaded"
                  class="w-full h-full lg:max-w-[185px] max-h-[121px] rounded-[10px]"
                >
                  <trusty-skeleton class="w-full h-[121px] lg:w-[185px] lg:h-[109px]" />
                </div>
                <NuxtImg
                  v-show="imageLoaded"
                  v-if="!slide.videoUrl"
                  class="!rounded-[14px] object-cover"
                  alt="slide"
                  :src="slide"
                  @load="imageLoaded = true"
                  @error="imageLoaded = true"
                />
              </swiper-slide>
            </swiper-container>
            <div class="swiper-pagination"></div>
          </div>
          <div class="hidden lg:block">
            <Swiper
              :style="{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff',
              }"
              :loop="true"
              :spaceBetween="10"
              :autoplay="{
                delay: 5000,
                disableOnInteraction: false,
              }"
              :pagination="false"
              grab-cursor
              :thumbs="{ swiper: thumbsSwiperRef }"
              :modules="modules"
              class="mySwiper2"
            >
              <SwiperSlide
                class="overflow-hidden rounded-[14px]"
                v-for="slide in tour?.media"
                :key="slide.id"
              >
                <video-player v-if="slide.videoUrl" :src="slide.videoUrl" />
                <div
                  v-if="!imageLoaded"
                  class="w-full h-full max-w-[969px] max-h-[390px] rounded-[10px]"
                >
                  <trusty-skeleton class="w-[969px] h-[390px]" />
                </div>
                <NuxtImg
                  v-show="imageLoaded"
                  v-if="!slide.videoUrl"
                  class="!rounded-[14px]"
                  alt="slide"
                  :src="slide"
                  @load="imageLoaded = true"
                  @error="imageLoaded = true"
                />
              </SwiperSlide>
            </Swiper>

            <!-- Нижний слайдер (превью) -->
            <div class="relative mt-[30px] px-15">
              <button class="swiper-button-prev-custom" ref="prevBtn">
                <arrow-slide-icon class="rotate-180" />
              </button>
              <button class="swiper-button-next-custom" ref="nextBtn">
                <arrow-slide-icon />
              </button>
              <Swiper
                @swiper="setThumbsSwiper"
                grab-cursor
                :loop="true"
                :spaceBetween="30"
                :slidesPerView="4"
                :freeMode="true"
                :watchSlidesProgress="true"
                :navigation="{
                  nextEl: nextBtn,
                  prevEl: prevBtn,
                }"
                :modules="modules"
                class="mySwiper"
              >
                <SwiperSlide
                  v-for="slide in tour?.media"
                  :key="slide.id"
                  class="overflow-hidden !rounded-[14px] cursor-pointer"
                >
                  <div class="bg-[#00000080] absolute top-0 left-0 w-full h-full"></div>
                  <div
                    v-if="!imageLoaded"
                    class="w-full h-full max-w-[190px] max-h-[90px] rounded-[10px]"
                  >
                    <trusty-skeleton class="w-[190px] h-[90px]" />
                  </div>
                  <NuxtImg
                    v-show="imageLoaded"
                    class="!rounded-[14px] w-full object-cover h-[90px]"
                    alt="slide"
                    :src="slide"
                    @load="imageLoaded = true"
                    @error="imageLoaded = true"
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </ClientOnly>
      </div>
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div class="flex flex-row space-x-[6px]">
          <trusty-chip v-if="tour?.area.name">{{ tour?.area?.name }}</trusty-chip>
          <trusty-chip v-if="tour?.duration"
            >{{ priceService.formatDuration(+tour?.duration) }}
          </trusty-chip>
        </div>
        <p class="text-36 leading-30 lg:text-64 font-medium lg:leading-59">
          {{ tour?.name }}
        </p>
        <span class="text-14 lg:text-16 leading-22 text-grey-light-6">{{ tour?.description }}</span>
      </div>
    </div>
    <trusty-selector-block
      v-for="(segment, segmentIndex) in tour?.segments"
      :data="segment"
      :key="segment.id"
      :participants="participants"
      @addon-selected="handleAddonSelected"
      @addon-removed="handleAddonRemoved"
      @addon-unavailable="handleAddonUnavailable"
      :driver-hour-rate="driverHourlyRate"
    />
    <div class="border-b-1 border-[#313131] my-[2.5rem] lg:my-[3.80rem]"></div>
    <div class="lg:sticky bottom-[20px] left-0 flex justify-center w-full z-10">
      <div
        v-if="tour"
        class="bg-[#FFFFFF] rounded-[12px] w-full max-w-[1170px] xl:max-w-[1612px] p-6 grid grid-cols-12 gap-y-2 lg:gap-x-5"
      >
        <div class="flex flex-col gap-y-[6px] col-span-12 lg:col-span-2" :translate="'no'">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Select date</span>
          <VueDatePicker
            v-model="displayDate"
            :enable-time-picker="false"
            :auto-apply="true"
            :format="'dd.MM.yyyy'"
            :hide-input-icon="true"
            :clearable="false"
            min-date="today"
          />
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col lg:text-center gap-y-[6px] col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3] text-nowrap"
            >Amount of participants</span
          >
          <div class="flex flex-row gap-x-6 lg:justify-between lg:gap-x-0 px-4 font-semibold">
            <p
              @click="decreaseParticipants"
              class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black cursor-pointer select-none"
            >
              -
            </p>
            <p class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black font-semibold title">
              {{ participants }}
            </p>
            <p
              @click="increaseParticipants"
              class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black cursor-pointer select-none"
            >
              +
            </p>
          </div>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total duration</span>
          <p
            class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black font-semibold title"
            :translate="'no'"
          >
            {{ formattedTotalDuration }}
          </p>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total price</span>
          <p class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black !font-semibold">
            {{ priceService.formatPrice(totalPrice) }} EUR
          </p>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Price per participant</span>
          <p
            class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black font-semibold text-nowrap"
          >
            {{ priceService.formatPrice(pricePerParticipant) }} EUR/P
          </p>
        </div>
        <trusty-button
          color="black"
          @click="bookTour"
          class="select-none mt-2 lg:mt-0 col-span-12 lg:col-span-2 items-center"
        >
          Book Now
        </trusty-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ArrowSlideIcon from '@/components/icons/ArrowSlideIcon.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustySelectorBlock from '@/components/ui/TrustySelectorBlock.vue';
import VideoPlayer from '@/components/ui/TrustyVideoPlayer.vue';
import TrustyChip from '@/components/ui/TrustyChip.vue';
import { useToursStore } from '@/store/toursStore';
import { useRoute } from 'vue-router';
import { Addon, Segment, Tour } from '@/types/tours';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { navigateTo } from 'nuxt/app';
import TrustySkeleton from '@/components/ui/TrustySkeleton.vue';
import TrustyPreloader from '@/components/ui/TrustyPreloader.vue';
import { PriceCalculationService } from '@/utils/priceCalculationService';

const toursStore = useToursStore();
const route = useRoute();
const priceService = PriceCalculationService;

const thumbsSwiperRef = ref<SwiperType | null>(null);
const activeIndex = ref(0);
const tour = ref<Tour | null>(null);
const imageLoaded = ref<boolean>(false);
const loading = ref<boolean>(false);
const nextBtn = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const modules = [FreeMode, Navigation, Thumbs];
const participants = ref(1);
const tourDate = ref<string | null | Date>(new Date().toISOString());
const hourDiscount = ref(0);

const selectedAddons = ref<{ [key: number]: Addon }>({});

const driverHourlyRate = computed(() => {
  if (!tour.value) return 0;
  const baseTourDuration = Number(tour.value.duration) || 0;
  return priceService.calculateDriverHourlyRate(
    selectedAddons.value,
    baseTourDuration,
    hourDiscount.value
  );
});

const handleAddonSelected = (addon: Addon, segmentIndex: number, segment: Segment) => {
  selectedAddons.value[segmentIndex] = {
    ...addon,
    segmentType: segment.type.name || '',
  };
  console.log('Updated selected addons:', selectedAddons.value);
};

const handleAddonRemoved = (segmentId: number) => {
  if (selectedAddons.value[segmentId]) {
    delete selectedAddons.value[segmentId];
  }
  console.log('Updated selected addons:', selectedAddons.value);
};

const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.activeIndex;
};

const displayDate = computed({
  get: () => (tourDate.value ? new Date(tourDate.value) : null),
  set: (val) => {
    tourDate.value = val ? val.toISOString() : null;
  },
});

const totalDuration = computed(() => {
  if (!tour.value) return 0;
  return priceService.calculateTotalDuration(
    Number(tour.value.duration) || 0,
    selectedAddons.value,
    tour.value.segments || []
  );
});

const formattedTotalDuration = computed(() => {
  return priceService.formatTotalDuration(totalDuration.value);
});

const decreaseParticipants = () => {
  if (participants.value > 1) participants.value--;
};

const increaseParticipants = () => {
  if (!tour.value) {
    console.warn('Tour is not available');
    return;
  }
  const maxParticipants = tour.value.max_participants !== null ? tour.value.max_participants : 8;

  if (participants.value < maxParticipants) {
    participants.value++;
  }
};

const handleAddonUnavailable = (segmentId: number, addonId: number) => {
  if (!selectedAddons.value[segmentId]) return;

  console.log(`Removing addon ID ${addonId} from segment ${segmentId}`);

  delete selectedAddons.value[segmentId];

  const segment = tour.value?.segments.find((seg) => seg.id === segmentId);
  if (!segment) {
    console.warn(`Segment with ID ${segmentId} not found.`);
    return;
  }

  const availableAddons = segment.addons
    .filter((addon) => addon.max_participants >= participants.value)
    .sort((a, b) => (a.price[0] ?? Infinity) - (b.price[0] ?? Infinity));

  if (availableAddons.length > 0) {
    selectedAddons.value[segmentId] = {
      ...availableAddons[0],
      segmentType: segment.type.name,
    };
    console.log(`Selected new addon: ${availableAddons[0].name} for segment ${segmentId}`);
  } else {
    console.warn(`No available addons for segment ${segmentId}`);
  }
};

const totalPrice = computed(() => {
  if (!tour.value) return 0;
  return priceService.calculateTotalPrice(
    selectedAddons.value,
    tour.value.segments || [],
    participants.value,
    driverHourlyRate.value
  );
});

const pricePerParticipant = computed(() => {
  return priceService.calculatePricePerParticipant(totalPrice.value, participants.value);
});

const bookTour = () => {
  if (!tour.value) {
    console.error('Cannot book tour: tour data is not available');
    return;
  }

  const calculatedPrice = priceService.calculateTotalPrice(
    selectedAddons.value,
    tour.value.segments || [],
    participants.value,
    driverHourlyRate.value
  );

  const totalPriceInteger = Math.round(calculatedPrice);

  const durationInMinutes = Math.round(totalDuration.value * 60);

  console.log('Booking tour with data:', {
    tourId: Number(route.params.id),
    participants: participants.value,
    totalDurationHours: totalDuration.value,
    totalDurationMinutes: durationInMinutes,
    originalPrice: calculatedPrice,
    finalPrice: totalPriceInteger,
  });

  toursStore.updateCustomTour({
    tour_id: Number(route.params.id),
    date: tourDate.value,
    participants: participants.value,
    total_duration: durationInMinutes,
    total_price: totalPriceInteger,
    addons: Object.values(selectedAddons.value),
  });

  navigateTo('/payment');
};

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiperRef.value = swiper;
};

const getTour = async () => {
  loading.value = true;
  const tourId = Number(route.params.id);
  tour.value = (await toursStore.getTourById(tourId)) || tour.value;
  loading.value = false;
};

const getDiscount = async () => {
  hourDiscount.value = (await toursStore.getHourDiscount()) || hourDiscount.value;
};

onMounted(() => {
  getTour();
  getDiscount();
  if (thumbsSwiperRef.value && thumbsSwiperRef.value.params.navigation) {
    thumbsSwiperRef.value.params.navigation = {
      nextEl: nextBtn.value,
      prevEl: prevBtn.value,
    };
    thumbsSwiperRef.value.navigation!.init();
    thumbsSwiperRef.value.navigation!.update();
  }
});
</script>

<style>
.swiper-pagination {
  display: flex !important;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.swiper-pagination-bullet {
  width: 8px !important;
  height: 8px !important;
  background-color: #ffffff66 !important;
  opacity: 1 !important;
  transition: all 0.3s ease;
  border-radius: 100%;
}

.swiper-pagination-bullet-active {
  background-color: #ffffff !important;
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
  left: 0;
}

.swiper-button-next-custom {
  right: 0;
}

.mySwiper2 .swiper-wrapper {
  max-height: 390px;
}

.mySwiper2 .swiper-slide {
  max-height: 390px;
}

.mySwiper2 .swiper-slide img {
  max-height: 390px;
  object-fit: cover;
  width: 100%;
}

.mySwiper2 .swiper-slide video {
  max-height: 390px;
  object-fit: cover;
  width: 100%;
}

.custom-swiper-pagination {
  position: relative;
  bottom: -10px;
  text-align: center;
  z-index: 10;
}

input[type='date']::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.date-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-label {
  font-size: 14px;
  color: gray;
}

.dp__input {
  font-size: 18px;
  font-weight: 600;
  font-family: 'Involve', sans-serif;
  color: black;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  outline: none;
  box-shadow: none;
}

.dp__menu {
  border-radius: 12px;
}

.dp__instance_calendar {
  padding: 10px;
  border-radius: 12px;
}

.dp__active_date {
  background-color: black !important;
  color: white !important;
  border-radius: 8px;
}

.dp__today {
  border: 1px solid black !important;
  border-radius: 8px;
}

.dp__overlay_cell_active {
  background-color: black !important;
  color: white !important;
  border-radius: 8px;
}

@media screen {
  @media (min-width: 1024px) {
    .dp__input {
      font-size: 23px;
    }
  }
  @media (min-width: 1280px) {
    .dp__input {
      font-size: 26px;
    }
  }
}
</style>
