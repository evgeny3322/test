<template>
  <div class="block-container">
    <div class="bg-grey-light-1 rounded-2xl p-5 lg:p-8 grid grid-cols-12">
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
                <NuxtImg
                  v-if="!slide.videoUrl"
                  class="!rounded-[14px] object-cover"
                  alt="slide"
                  :src="slide"
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
                <NuxtImg v-if="!slide.videoUrl" class="!rounded-[14px]" alt="slide" :src="slide" />
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
                  <NuxtImg
                    class="!rounded-[14px] w-full object-cover h-[90px]"
                    alt="slide"
                    :src="slide"
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
          <trusty-chip v-if="tour?.duration">{{ formatDuration(+tour?.duration) }} </trusty-chip>
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
    <div class="border-b-1 border-[#313131] my-[4.5%]"></div>
    <div class="lg:sticky bottom-[20px] left-0 flex justify-center w-full z-10">
      <div
        class="bg-[#FFFFFF] rounded-[12px] w-full max-w-[1170px] xl:max-w-[1612px] p-6 grid grid-cols-12 mt-4 gap-y-2 lg:gap-x-5"
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
            {{ totalPrice }} EUR
          </p>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Price per participant</span>
          <p
            class="text-18 lg:text-23 xl:text-26 leading-30 text-main-black font-semibold text-nowrap"
          >
            {{ pricePerParticipant }} EUR/P
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
import { storeToRefs } from 'pinia';
import { navigateTo } from 'nuxt/app';

const toursStore = useToursStore();

const route = useRoute();

const thumbsSwiperRef = ref<SwiperType | null>(null);

const activeIndex = ref(0);

const tour = ref<Tour | null>(null);

const nextBtn = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const modules = [FreeMode, Navigation, Thumbs];
const participants = ref(1);
const tourDate = ref<string | null | Date>(new Date().toISOString());
const hourDiscount = ref(0);

const selectedAddons = ref<{ [key: number]: Addon }>({});

const driverHourlyRate = computed(() => {
  const transportAddon = Object.values(selectedAddons.value).find(
    (a) => a.segmentType === 'Transportation'
  );
  const transportPrice = transportAddon ? calculatePrice(transportAddon) : 0;
  const baseTourHours = (Number(tour.value?.duration) || 1) / 60;

  return baseTourHours > 0 ? transportPrice / baseTourHours - hourDiscount.value : 0;
});

const handleAddonSelected = (addon: Addon, segmentIndex: number, segment: Segment) => {
  selectedAddons.value[segmentIndex] = {
    ...addon,
    segmentType: segment.type.name || '',
  };
  console.log('Updated selected addons:', selectedAddons.value);
};
const formatDuration = (minutes?: number): string => {
  if (!minutes) return '0 Min';
  const hrs = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${hrs > 0 ? `${hrs} Hrs` : ''} ${min > 0 ? `${min} Min` : ''}`.trim();
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

const formattedTotalDuration = computed(() => {
  const hours = Math.floor(totalDuration.value);
  const minutes = Math.round((totalDuration.value - hours) * 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '0m';
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

const totalDuration = computed(() => {
  const baseDurationMinutes = Number(tour.value?.duration) || 0;
  let additionalMinutes = 0;

  console.log(`\n[Duration] --- Calculating total tour duration ---`);
  console.log(`[Duration] Base tour duration: ${baseDurationMinutes} min`);

  for (const [key, selectedAddon] of Object.entries(selectedAddons.value)) {
    if (!selectedAddon) continue;

    const segment = tour.value?.segments?.find((seg) => seg.id === Number(key));
    if (!segment) {
      console.warn(`[Duration] → Segment not found for addon key: ${key}`);
      continue;
    }

    const addonDurationMinutes = Number(selectedAddon.duration) || 0;
    const segmentDurationMinutes = Number(segment.duration ?? 60);

    console.log(`\n[Duration] Segment ${key} → "${selectedAddon.name}"`);
    console.log(`[Duration] → Segment base duration: ${segmentDurationMinutes} min`);
    console.log(`[Duration] → Addon duration: ${addonDurationMinutes} min`);

    if (addonDurationMinutes > segmentDurationMinutes) {
      const extraTime = addonDurationMinutes - segmentDurationMinutes;
      additionalMinutes += extraTime;
      console.log(`[Duration] → Additional time added: ${extraTime} min`);
    } else {
      console.log(`[Duration] → No additional time needed.`);
    }
  }

  const totalMinutes = baseDurationMinutes + additionalMinutes;
  const totalHours = (totalMinutes / 60).toFixed(2);

  console.log(`\n[Duration] Total tour time: ${totalMinutes} min (${totalHours} h)`);

  return Number(totalHours);
});

const calculatePrice = (addon: Addon): number => {
  if (!addon || !addon.price || !Array.isArray(addon.price)) {
    console.warn(`[Price] Invalid price data for addon: ${addon?.name || 'Unknown addon'}`);
    return 0;
  }

  if (participants.value > addon.max_participants) {
    console.warn(`[Price] Group size (${participants.value}) exceeds max for addon: ${addon.name}`);
    return 0;
  }

  console.log(`\n[Price] --- Calculating addon: "${addon.name}" ---`);

  const priceIndex = participants.value - 1;
  const baseCost = addon.price[priceIndex] ?? addon.price.at(-1) ?? 0;
  const basePrice = baseCost * participants.value;

  console.log(`[Price] → Price from backend (per participant): ${baseCost} EUR`);
  console.log(`[Price] → Group size: ${participants.value}`);
  console.log(`[Price] → Base total: ${basePrice.toFixed(2)} EUR`);

  const segment = tour.value?.segments.find((seg) => seg.addons.some((a) => a.id === addon.id));

  if (!segment) {
    console.warn(`[Price] → Segment not found for addon "${addon.name}", using base price only.`);
    return basePrice;
  }

  const addonDuration: number = Number(addon.duration) || 0;
  const segmentDuration: number = Number(segment.duration ?? 60);
  const additionalTime: number = addonDuration - segmentDuration;

  if (additionalTime > 0) {
    const additionalHours: number = additionalTime / 60;

    const transportAddon = Object.values(selectedAddons.value).find(
      (a) => a.segmentType === 'Transportation'
    );
    const isSelf = transportAddon?.id === addon.id;
    const transportPrice: number = transportAddon && !isSelf ? calculatePrice(transportAddon) : 0;
    const baseTourHours: number = (Number(tour.value?.duration) || 1) / 60;

    const hourlyRate: number =
      baseTourHours > 0 ? transportPrice / baseTourHours - hourDiscount.value : 0;

    const extraCost: number = additionalHours * hourlyRate;

    console.log(`[Price] → Addon duration: ${addonDuration} min`);
    console.log(`[Price] → Segment base duration: ${segmentDuration} min`);
    console.log(
      `[Price] → Additional time: ${additionalTime} min (${additionalHours.toFixed(2)}h)`
    );
    console.log(`[Price] → Driver hourly rate: ${hourlyRate.toFixed(2)} EUR`);
    console.log(`[Price] → Extra cost for overtime: ${extraCost.toFixed(2)} EUR`);
    console.log(`[Price] → Final total price: ${(basePrice + extraCost).toFixed(2)} EUR`);

    return basePrice + extraCost;
  }

  console.log(`[Price] → No additional time. Final price: ${basePrice.toFixed(2)} EUR`);
  return basePrice;
};

const totalPrice = computed(() => {
  let total = 0;
  for (const addon of Object.values(selectedAddons.value)) {
    total += calculatePrice(addon);
  }
  return Number(total.toFixed(2));
});

const pricePerParticipant = computed(() => {
  const total = totalPrice.value;
  if (isNaN(total) || total <= 0 || participants.value <= 0) {
    return 0;
  }

  return parseFloat((total / participants.value).toFixed(2));
});

const bookTour = () => {
  toursStore.updateCustomTour({
    tour_id: Number(route.params.id),
    date: tourDate.value,
    participants: participants.value,
    total_duration: totalDuration.value * 60,
    total_price: totalPrice.value,
    addons: Object.values(selectedAddons.value),
  });
  navigateTo('/payment');
};

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiperRef.value = swiper;
};

const handleGetTour = async () => {
  const tourId = Number(route.params.id);
  tour.value = (await toursStore.getTourById(tourId)) || tour.value;
};

const handleGetDiscount = async () => {
  hourDiscount.value = (await toursStore.getHourDiscount()) || hourDiscount.value;
};

onMounted(() => {
  handleGetTour();
  handleGetDiscount();
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
