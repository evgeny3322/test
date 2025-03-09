<template>
  <div class="flex flex-row justify-between items-center w-full py-6">
    <p @click="router.push('/')" class="title text-23 leading-24 cursor-pointer">InspirItaly</p>
    <template v-if="isDesktop">
      <div class="flex flex-row gap-x-10">
        <p
          @click="handleSetActiveNav(item)"
          v-for="item in navItems"
          :key="item"
          :class="{ '!text-[#FFFFFF]': item === activeNav }"
          class="whitespace-nowrap cursor-pointer font-semibold text-[#939393] text-14"
        >
          {{ item }}
        </p>
      </div>
      <div class="flex flex-row items-center gap-x-[22px]">
        <p class="font-semibold cursor-pointer text-14">Login</p>
        <trusty-button class="!py-2">
          <p class="whitespace-nowrap font-semibold text-14">Sign Up</p>
        </trusty-button>
        <LanguageSwitcher />
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-4">
        <LanguageSwitcher />
        <div class="bg-[#FFFFFF1A] w-10 h-10 flex items-center justify-center cursor-pointer">
          <burger-icon />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'nuxt/app';
import BurgerIcon from '@/components/icons/BurgerIcon.vue';
import { useDevice } from '@/.nuxt/imports';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue';

const router = useRouter();
const { isMobile, isDesktop } = useDevice();

const navItems = ref<string[]>(['Best tours', 'ALL Tours', 'Contact Us']);

const activeNav = ref<string>('Best tours');

const handleSetActiveNav = (item: string) => {
  activeNav.value = item;
};
</script>
