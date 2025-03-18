<template>
  <div class="flex flex-row justify-between items-center w-full py-6">
    <p @click="router.push('/')" class="title text-23 leading-24 cursor-pointer">InspirItaly</p>
    <div class="flex-row gap-x-10 hidden lg:flex">
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
    <div class="flex flex-row items-center gap-x-3 lg:gap-x-[22px]">
      <p class="hidden lg:block font-semibold cursor-pointer text-14">Login</p>
      <trusty-button class="!py-2">
        <p class="whitespace-nowrap font-semibold text-14">Sign Up</p>
      </trusty-button>
      <LanguageSwitcher class="hidden lg:block" />
      <div class="flex items-center justify-center lg:hidden cursor-pointer">
        <burger-icon />
      </div>
    </div>
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

const navItems = ref<string[]>(['Best tours', 'ALL Tours', 'Contact Us']);

const activeNav = ref<string>('Best tours');

const handleSetActiveNav = (item: string) => {
  activeNav.value = item;
};
</script>
