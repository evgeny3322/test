<template>
  <div class="block-container">
    <div class="bg-grey-light-1 rounded-main-sm p-5 lg:p-8 grid grid-cols-12">
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
          <trusty-chip>{{ tour?.area?.name }}</trusty-chip>
          <trusty-chip>{{ tour?.duration }} Hrs</trusty-chip>
        </div>
        <p class="text-36 leading-30 lg:text-64 font-medium lg:leading-56">
          {{ tour?.area?.name }}
        </p>
        <span class="text-14 lg:text-16 leading-22 text-grey-light-6">{{
          tour?.area?.description
        }}</span>
      </div>
    </div>
    <trusty-selector-block
      v-for="(segment, segmentIndex) in tour?.segments"
      :data="segment"
      :key="segment.id"
      :participants="participants"
      @addon-selected="handleAddonSelected"
    />
    <div
      class="bg-grey-light-1 rounded-main-sm grid grid-cols-12 gap-y-6 lg:gap-x-8 mt-[4.5%] p-5 lg:p-8"
    >
      <div class="col-span-12 lg:col-span-4">
        <p class="text-26 leading-30 lg:text-40 lg:leading-36 font-medium">Additional drive time</p>
      </div>
      <div
        class="col-span-12 lg:col-span-8 bg-[#181818] rounded-main-sm p-[18px] flex flex-col lg:flex-row lg:justify-between px-6 py-5 gap-y-6"
      >
        <div
          class="bg-[#282828] rounded-main-sm flex flex-row justify-between items-center px-6 py-3 lg:py-5 lg:gap-x-20"
        >
          <span
            @click="descDriveTime"
            class="cursor-pointer text-28 lg:text-40 leading-20 select-none"
            >-</span
          >
          <span class="text-20 leading-20">{{ driveTime }}</span>
          <span
            @click="incDriveTime"
            class="cursor-pointer text-28 lg:text-40 leading-20 select-none"
            >+</span
          >
        </div>
        <button
          class="bg-main-black rounded-[99px] py-4 px-6 font-semibold text-18 lg:text-26 leading-30"
        >
          <span class="px-8 text-nowrap">{{ calculateDriveTimePrice }} EUR</span>
        </button>
      </div>
    </div>
    <div class="border-b-1 border-[#313131] my-[4.5%]"></div>
    <div class="lg:sticky bottom-[8%] left-0 flex justify-center w-full z-10">
      <div
        class="bg-[#FFFFFF] rounded-[12px] w-full max-w-[1170px] xl:max-w-[1612px] p-6 grid grid-cols-12 mt-4 gap-y-2 lg:gap-x-5"
      >
        <div class="flex flex-col gap-y-[6px] col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Select date</span>
          <!--          <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold title">-->
          <!--            {{ tourDate }}-->
          <!--          </p>-->

          <!--          TODO переделать датапикер когда в дизайне будет-->
          <input
            v-model="tourDate"
            type="date"
            class="text-main-black title font-semibold text-18 lg:text-26 leading-30 cursor-pointer"
            lang="en"
          />
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col lg:text-center gap-y-[6px] col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Amount of participants</span>
          <div class="flex flex-row gap-x-6 lg:justify-between lg:gap-x-0 px-4 font-semibold">
            <p
              @click="decreaseParticipants"
              class="text-18 lg:text-26 leading-30 text-main-black cursor-pointer select-none"
            >
              -
            </p>
            <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold title">
              {{ participants }}
            </p>
            <p
              @click="increaseParticipants"
              class="text-18 lg:text-26 leading-30 text-main-black cursor-pointer select-none"
            >
              +
            </p>
          </div>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total duration</span>
          <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold title">
            {{ totalDuration }} h
          </p>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total price</span>
          <p class="text-18 lg:text-26 leading-30 text-main-black !font-semibold">
            {{ totalPrice }} EUR
          </p>
        </div>
        <div class="border-b-1 border-[#F2F2F2] col-span-12 lg:hidden"></div>
        <div class="flex flex-col gap-y-[6px] lg:text-center col-span-12 lg:col-span-2">
          <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Price per participant</span>
          <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold">
            {{ pricePerParticipant }} EUR/P
          </p>
        </div>
        <trusty-button
          color="black"
          @click="bookTour"
          class="select-none mt-2 lg:mt-0 col-span-12 lg:col-span-2"
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
import { Addon, Tour } from '@/types/tours';

const toursStore = useToursStore();

const route = useRoute();

const thumbsSwiperRef = ref<SwiperType | null>(null);

const activeIndex = ref(0);

const tour = ref<Tour | null>(null);

const nextBtn = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const driveTime = ref<number>(1);
const modules = [FreeMode, Navigation, Thumbs];
const participants = ref(1);
const tourDate = ref<string | null>(null);
const driveTimeRate = 50;
const hourDiscount = ref(0);

const selectedAddons = ref<{ [key: number]: Addon }>({});

const handleAddonSelected = (addon: Addon, segmentIndex: number, segmentType: string) => {
  selectedAddons.value[segmentIndex] = {
    ...addon,
    segmentType,
  };

  console.log('Updated selected addons:', selectedAddons.value);
};

const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.activeIndex;
};

const incDriveTime = () => {
  if (driveTime.value < 24) driveTime.value++;
};

const descDriveTime = () => {
  if (driveTime.value > 0) driveTime.value--;
};

const calculateDriveTimePrice = computed(() => {
  const transportationAddons = Object.values(selectedAddons.value).filter(
    (addon) => addon.segmentType === 'Transportation'
  );

  if (transportationAddons.length === 0) return 0;

  const selectedTransportationAddon = transportationAddons[0];
  const addonPrice = calculatePrice(selectedTransportationAddon);
  const baseDuration = Number(tour.value?.duration) || 1;
  const discount = Number(hourDiscount.value) || 0;

  console.log('Addon Price:', addonPrice);
  console.log('Base Duration:', baseDuration);
  console.log('Discount:', discount);

  const calculatedPrice = addonPrice / baseDuration - discount;
  console.log('Final calculated additional_hour_price:', calculatedPrice);

  return Math.max(calculatedPrice, 0);
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

const totalDuration = computed(() => {
  const baseDuration = Number(tour.value?.duration) || 0;
  let additionalMinutes = 0;

  console.log(`Base tour duration: ${baseDuration} min`);

  for (const [key, selectedAddon] of Object.entries(selectedAddons.value)) {
    if (!selectedAddon) continue;

    const segment = tour.value?.segments?.find((seg) => seg.id === Number(key));
    if (!segment) continue;

    const addonDuration = Number(selectedAddon.duration) || 0;
    const segmentDuration = Number(segment.duration) || 0;

    if (addonDuration > segmentDuration) {
      const extraTime = addonDuration - segmentDuration;
      additionalMinutes += extraTime;
      console.log(`Adding extra time for segment ${key}: +${extraTime} min`);
    }
  }

  const totalMinutes = baseDuration + additionalMinutes;
  const totalHours = totalMinutes / 60;

  console.log(`Total tour duration: ${totalMinutes} min (${totalHours} h)`);

  return totalHours;
});

const calculatePrice = (addon: Addon) => {
  console.log(`Calculating price for addon: ${addon.name}`);

  if (!addon.base_cost || !Array.isArray(addon.base_cost)) {
    console.warn(`Invalid base_cost for addon: ${addon.name}`);
    return 0;
  }

  if (participants.value > addon.max_participants) {
    console.warn(
      `Participants (${participants.value}) exceed max allowed for this addon (${addon.max_participants})`
    );
    return 0;
  }

  const baseCost = addon.base_cost[participants.value - 1] ?? addon.base_cost[0];

  if (baseCost === undefined) {
    console.warn(`No valid base cost found for ${participants.value} participants`);
    return 0;
  }

  const price = baseCost * participants.value;
  console.log(`Base cost: ${baseCost}, Participants: ${participants.value}, Total price: ${price}`);

  return price;
};

const totalPrice = computed(() => {
  let total = 0;
  console.log('Calculating total price...');

  for (const addon of Object.values(selectedAddons.value)) {
    if (!addon) continue;
    total += calculatePrice(addon);
  }

  const additionalHours = totalDuration.value - (Number(tour.value?.duration) || 0);
  const additionalDriverCost = calculateDriveTimePrice.value;

  if (additionalHours > 0) {
    total += additionalHours * additionalDriverCost;
  }

  console.log(`Total price for tour: ${total.toFixed(2)} EUR`);
  return total;
});

const pricePerParticipant = computed(() => {
  const total = totalPrice.value;
  if (isNaN(total) || total <= 0 || participants.value <= 0) {
    return 0;
  }

  return parseFloat((total / participants.value).toFixed(2));
});

const bookTour = () => {
  console.log('Booking tour...');
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
</style>
