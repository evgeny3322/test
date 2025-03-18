<template>
  <div class="flex flex-row justify-between items-center w-full py-6">
    <p @click="goToHome()" class="title text-23 leading-24 cursor-pointer">InspirItaly</p>
    <div class="flex-row gap-x-10 hidden lg:flex">
      <p
        @click="handleNavigation(item)"
        v-for="item in navItems"
        :key="item.name"
        :class="{ '!text-[#FFFFFF]': item.name === activeNav }"
        class="whitespace-nowrap cursor-pointer font-semibold text-[#939393] text-14"
      >
        {{ item.name }}
      </p>
    </div>
    <div class="flex flex-row items-center gap-x-3 lg:gap-x-[22px]">
      <p class="hidden lg:block font-semibold cursor-pointer text-14" @click="router.push('/auth/sign-in')">Login</p>
      <trusty-button class="!py-2" @click="router.push('/auth/sign-up')">
        <p class="whitespace-nowrap font-semibold text-14">Sign Up</p>
      </trusty-button>
      <LanguageSwitcher class="hidden lg:block" />
      <div
        class="flex items-center justify-center lg:hidden cursor-pointer"
        @click="toggleMobileMenu"
      >
        <burger-icon />
      </div>
    </div>

    <div
      v-if="showMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-80 z-50 lg:hidden"
      @click="showMobileMenu = false"
    >
      <div
        class="bg-[#262626] w-4/5 h-full p-6 flex flex-col"
        @click.stop
      >
        <div class="flex justify-between items-center mb-8">
          <p class="title text-23 leading-24">InspirItaly</p>
          <button @click="showMobileMenu = false" class="text-white text-24">×</button>
        </div>

        <div class="flex flex-col gap-y-6">
          <p
            v-for="item in navItems"
            :key="item.name"
            @click="handleMobileNavigation(item)"
            :class="{ 'text-white': item.name === activeNav }"
            class="font-medium text-18 text-[#939393] cursor-pointer"
          >
            {{ item.name }}
          </p>

          <div class="border-b border-gray-700 my-4"></div>

          <p @click="router.push('/auth/sign-in')" class="font-medium text-18 text-[#939393] cursor-pointer">Login</p>
          <p @click="router.push('/auth/sign-up')" class="font-medium text-18 text-[#939393] cursor-pointer">Sign Up</p>

          <div class="mt-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'nuxt/app';
import BurgerIcon from '@/components/icons/BurgerIcon.vue';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.vue';

const router = useRouter();
const showMobileMenu = ref(false);

interface NavItem {
  name: string;
  path: string;
}

const navItems = ref<NavItem[]>([
  { name: 'Best tours', path: '/' },
  { name: 'ALL Tours', path: '/tours' },
  { name: 'Contact Us', path: '#footer' }
]);

const activeNav = ref<string>('Best tours');

const updateActiveNav = (path: string) => {
  const currentNavItem = navItems.value.find(item => {
    if (path === '/' && item.path === '/') return true;
    return path !== '/' && item.path !== '/' && path.startsWith(item.path);
  });

  if (currentNavItem) {
    activeNav.value = currentNavItem.name;
  } else if (path === '/') {
    activeNav.value = 'Best tours';
  }
};

onMounted(() => {
  updateActiveNav(router.currentRoute.value.path);
});

watch(() => router.currentRoute.value.path, (newPath) => {
  updateActiveNav(newPath);
});

const handleNavigation = (item: NavItem) => {
  activeNav.value = item.name;

  if (item.path.startsWith('#')) {
    scrollToElement(item.path);
  } else {
    router.push(item.path);
  }
};

const scrollToElement = (selector: string) => {
  nextTick(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const handleMobileNavigation = (item: NavItem) => {
  activeNav.value = item.name;

  if (item.path.startsWith('#')) {
    scrollToElement(item.path);
  } else {
    router.push(item.path);
  }

  showMobileMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const goToHome = () => {
  router.push('/');
  activeNav.value = 'Best tours';
};
</script>
