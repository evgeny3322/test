<template>
  <div class="block-container flex flex-col justify-between h-full">
    <div class="grid grid-cols-12 lg:gap-x-20 overflow-x-auto lg:overflow-visible scrollbar-hide">
      <div class="col-span-12 lg:col-span-3 flex flex-col">
        <div
          class="flex flex-row overflow-x-scroll lg:overflow-visible h-full lg:h-max w-full lg:flex-col gap-x-3 gap-y-[6px] scrollbar-hide"
        >
          <p
            @click="setActiveItem(index)"
            v-for="(item, index) in navItems"
            :key="index"
            class="font-medium text-14 lg:text-18 title px-6 py-3 cursor-pointer text-nowrap lg:text-wrap"
            :class="{ 'rounded-2xl bg-[#FFFFFF0D]': activeNavIndex === index }"
          >
            {{ item.name }}
          </p>
        </div>
        <div class="lg:mt-[340px] lg:mb-0 my-8 h-full flex flex-col justify-between">
          <div class="relative flex items-baseline">
            <p
              @click="handleLogout"
              class="lg:px-[13px] mb-6 lg:mb-0 text-grey-light-4 font-medium title text-14 lg:text-18 cursor-pointer hover:text-white transition-colors"
              :class="{ 'opacity-0': isLoggingOut }"
            >
              Log Out
            </p>
            <div v-if="isLoggingOut" class="absolute inset-0 flex items-center">
              <PreloaderAnimIcon class="size-5 lg:ml-[13px]" theme="white" />
            </div>
          </div>
          <template v-if="activeNavIndex === 1">
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-y-3 lg:gap-y-7 justify-between">
              <div class="bg-[#151515] p-6 rounded-2xl h-full">
                <p class="title text-14 lg:text-18 font-medium mb-3">Information</p>
                <span class="text-grey-light-4 text-12 lg:text-14"
                  >At least 8 characters, at least one capital and small letter, number and special
                  character.At least 8 characters, at least one capital and small letter, number and
                  special character.</span
                >
              </div>
              <tours-cards-slider />
            </div>
          </template>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-9">
        <component :is="navItems[activeNavIndex].component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { SwiperSlide } from 'swiper/vue';
import TrustyChip from '@/components/ui/TrustyChip.vue';
import ToursCardsSlider from '@/components/tours/ToursCardsSlider.vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';

const router = useRouter();
const authStore = useAuthStore();
const isLoggingOut = ref(false);

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

const handleLogout = async () => {
  if (isLoggingOut.value) return;

  try {
    isLoggingOut.value = true;
    await authStore.logout();
    router.push('/');
  } catch (err) {
    console.error('Error logout', err);
    isLoggingOut.value = false;
  }
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
