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
                v-for="slide in slides"
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
                  :src="slide.image"
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
              :pagination="true"
              grab-cursor
              :thumbs="{ swiper: thumbsSwiperRef }"
              :modules="modules"
              class="mySwiper2"
            >
              <SwiperSlide
                class="overflow-hidden rounded-[14px]"
                v-for="slide in slides"
                :key="slide.id"
              >
                <video-player v-if="slide.videoUrl" :src="slide.videoUrl" />
                <NuxtImg
                  v-if="!slide.videoUrl"
                  class="!rounded-[14px]"
                  alt="slide"
                  :src="slide.image"
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
                  v-for="slide in slides"
                  :key="slide.id"
                  class="overflow-hidden !rounded-[14px]"
                >
                  <div class="bg-[#00000080] absolute top-0 left-0 w-full h-full"></div>
                  <NuxtImg class="!rounded-[14px]" alt="slide" :src="slide.image" />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </ClientOnly>
      </div>
      <div class="col-span-12 lg:col-span-4 space-y-6">
        <div class="flex flex-row space-x-[6px]">
          <trusty-chip v-for="i in 2" :key="i"> mini card</trusty-chip>
        </div>
        <p class="text-36 leading-30 lg:text-64 font-medium lg:leading-56">Great Rome</p>
        <span class="text-14 lg:text-16 leading-22 text-grey-light-6"
          >The words of the Romantic poet Lord Byron, written more than two centuries ago, still
          worthily represent one of the most beautiful countries of the world. And we at Inspiritaly
          are here to drive you through this magic that inspired world-known poets and artists, in a
          deep and Italian-passioned spirit.</span
        >
      </div>
    </div>
    <trusty-selector-block :data="carsData" :participants="3" />
    <trusty-selector-block :data="lunchData" :participants="3" />
    <trusty-selector-block :data="segmentData" :mandatory="false" :participants="3" />
    <trusty-selector-block :data="driveData" :mandatory="false" :participants="3" />
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
          <span class="px-8">{{ calculateDriveTimePrice() }} EUR</span>
        </button>
      </div>
    </div>
    <div class="border-b-1 border-[#313131] my-[4.5%]"></div>
    <div
      class="bg-[#FFFFFF] rounded-[12px] p-6 flex flex-col lg:flex-row lg:justify-between mt-4 gap-y-2 lg:gap-x-5"
    >
      <div class="flex flex-col gap-y-[6px]">
        <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Select date</span>
        <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold title">
          {{ tourDate }}
        </p>
      </div>
      <div class="border-b-1 border-[#F2F2F2] lg:hidden"></div>
      <div class="flex flex-col gap-y-[6px]">
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
      <div class="border-b-1 border-[#F2F2F2] lg:hidden"></div>
      <div class="flex flex-col gap-y-[6px]">
        <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total duration</span>
        <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold title">
          {{ totalDuration }} h
        </p>
      </div>
      <div class="border-b-1 border-[#F2F2F2] lg:hidden"></div>
      <div class="flex flex-col gap-y-[6px]">
        <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Total price</span>
        <p class="text-18 lg:text-26 leading-30 text-main-black !font-semibold">
          {{ totalPrice }} EUR
        </p>
      </div>
      <div class="border-b-1 border-[#F2F2F2] lg:hidden"></div>
      <div class="flex flex-col gap-y-[6px]">
        <span class="text-12 lg:text-13 leading-24 text-[#B3B3B3]">Price per participant</span>
        <p class="text-18 lg:text-26 leading-30 text-main-black font-semibold">
          {{ pricePerParticipant }} EUR/P
        </p>
      </div>
      <trusty-button color="black" @click="bookTour" class="select-none mt-2 lg:mt-0">
        Book Now
      </trusty-button>
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

const thumbsSwiperRef = ref<SwiperType | null>(null);

const activeIndex = ref(0);
const onSlideChange = (swiper: any) => {
  activeIndex.value = swiper.activeIndex;
};

const nextBtn = ref<HTMLElement | null>(null);
const prevBtn = ref<HTMLElement | null>(null);
const driveTime = ref<number>(1);
const modules = [FreeMode, Navigation, Thumbs];
const participants = ref(1);
const tourDate = ref<string>('20.03.2025');
const baseDuration = 9;
const basePrice = ref<number>(1100);
const driveTimeRate = 50;

const incDriveTime = () => {
  if (driveTime.value < 24) driveTime.value++;
};

const descDriveTime = () => {
  if (driveTime.value > 0) driveTime.value--;
};

const calculateDriveTimePrice = () => {
  return driveTime.value * driveTimeRate;
};

const decreaseParticipants = () => {
  if (participants.value > 1) participants.value--;
};

const increaseParticipants = () => {
  participants.value++;
};

const totalDuration = computed(() => baseDuration + driveTime.value);
const totalPrice = computed(() => basePrice.value + calculateDriveTimePrice());
const pricePerParticipant = computed(() => (totalPrice.value / participants.value).toFixed(2));

const bookTour = () => {
  console.log('Booking tour...');
};

const slides = ref([
  {
    id: 1,
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    image:
      'https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    videoUrl: '',
    image:
      'https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    videoUrl: '',
    image:
      'https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    videoUrl: '',
    image:
      'https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    videoUrl: '',
    image:
      'https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]);
const carsData = ref({
  title: 'Select your car',
  description:
    'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
  cards: [
    {
      image:
        'https://images.unsplash.com/photo-1678690301561-80bf8aebb928?q=80&w=1820&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'S class',
      description: 'Luxury sedan with premium comfort, ideal for business trips and luxury travel.',
      max_participants: 4,
      cost: [300, 250, 220, 200],
    },
    {
      image:
        'https://images.unsplash.com/photo-1678690301561-80bf8aebb928?q=80&w=1820&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'V class',
      description: 'Spacious and comfortable minivan, perfect for family trips or small groups.',
      max_participants: 6,
      cost: [500, 450, 400, 370, 350, 330],
    },
    {
      image:
        'https://images.unsplash.com/photo-1662364518459-e79c3ad6935f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'E class',
      description: 'Business-class sedan with a balance of luxury and affordability.',
      max_participants: 4,
      cost: [600, 550, 500, 450],
    },
  ],
});
const lunchData = ref({
  title: 'Select your lunch',
  description:
    'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
  cards: [
    {
      image:
        'https://images.unsplash.com/photo-1625938398962-a5fe49775142?q=80&w=1664&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Light lunch',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 4,
      cost: [300, 250, 220, 200],
    },
    {
      image:
        'https://images.unsplash.com/photo-1707736496276-734cdbe768f5?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Michelin restaurant launch',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 6,
      cost: [500, 450, 400, 370, 350, 330],
    },
    {
      image:
        'https://plus.unsplash.com/premium_photo-1664391811784-53a136d9ab16?q=80&w=1666&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Pasta making workshop with lunch',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 4,
      cost: [300, 250, 220, 200],
    },
  ],
});
const segmentData = ref({
  title: '3rd Segment name',
  description:
    'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
  cards: [
    {
      image:
        'https://images.unsplash.com/photo-1699352972902-eae3dfc7660e?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Addon name',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 6,
      cost: [500, 450, 400, 370, 350, 330],
    },
    {
      image:
        'https://images.unsplash.com/photo-1699352972902-eae3dfc7660e?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Addon name',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 4,
      cost: [300, 250, 220, 200],
    },
  ],
});
const driveData = ref({
  title: 'Drive guide',
  description:
    'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful countries of the world. And we at Inspiritaly are here to drive you through this magic that inspired world-known poets and artists, in a deep and Italian-passioned spirit.',
  cards: [
    {
      image:
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Addon name',
      description:
        'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
      max_participants: 4,
      cost: [300, 250, 220, 200],
    },
  ],
});

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiperRef.value = swiper;
};

onMounted(() => {
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
</style>
