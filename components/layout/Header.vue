<template>
  <div class="flex flex-row justify-between items-center w-full py-6">
    <p @click="goToHome()" class="title text-23 leading-24 cursor-pointer">InspirItaly</p>
    <div class="flex-row gap-x-10 hidden lg:flex">
      <p
        @click="handleNavigation(item)"
        v-for="item in navItems"
        :key="item.name"
        :class="{ '!text-[#FFFFFF]': item.name === activeNav }"
        class="whitespace-nowrap cursor-pointer font-semibold text-text-grey text-14"
      >
        {{ item.name }}
      </p>
    </div>
    <div class="flex flex-row items-center gap-x-3 lg:gap-x-[22px]">
      <template v-if="isAuthenticated">
        <trusty-button class="!py-2" @click="handleUserAccount">
          <p class="whitespace-nowrap font-semibold text-14">My Account</p>
        </trusty-button>
      </template>

      <template v-else>
        <p
          class="hidden lg:block font-semibold cursor-pointer text-14"
          @click="router.push('/auth/sign-in')"
        >
          Login
        </p>
        <trusty-button class="!py-2" @click="router.push('/auth/sign-up')">
          <p class="whitespace-nowrap font-semibold text-14">Sign Up</p>
        </trusty-button>
      </template>

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
      class="fixed inset-0 backdrop-blur-[1.25rem] bg-opacity-80 z-50 lg:hidden"
      @click="showMobileMenu = false"
    >
      <div
        class="bg-secondary-black w-4/5 ml-auto h-full px-[1.813rem] py-[0.875rem] flex flex-col"
        @click.stop
      >
        <div class="flex justify-between items-center mb-8">
          <p class="title text-23 leading-24">InspirItaly</p>
          <button @click="showMobileMenu = false" class="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-col items-end gap-y-12 h-full">
          <p
            v-for="item in navItems"
            :key="item.name"
            @click="handleMobileNavigation(item)"
            :class="{ 'text-white': item.name === activeNav }"
            class="font-bold text-16 text-text-grey leading-6 cursor-pointer"
          >
            {{ item.name }}
          </p>
          <LanguageSwitcher />
          <div class="mt-auto flex flex-col w-full gap-3">
            <template v-if="isAuthenticated">
              <trusty-button
                @click="handleUserAccount"
                class="h-[2rem] flex items-center justify-center"
              >
                My Account
              </trusty-button>
            </template>

            <template v-else>
              <trusty-button
                @click="
                  router.push('/auth/sign-in');
                  showMobileMenu = false;
                "
                class="h-[2rem] flex items-center justify-center !bg-thirdary-black !text-white !border !border-fourthary-black"
              >
                Login
              </trusty-button>
              <trusty-button
                @click="
                  router.push('/auth/sign-up');
                  showMobileMenu = false;
                "
                class="h-[2rem] flex items-center justify-center"
              >
                Sign up
              </trusty-button>
            </template>
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
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const showMobileMenu = ref(false);
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

interface NavItem {
  name: string;
  path: string;
}

const navItems = ref<NavItem[]>([
  { name: 'ALL Tours', path: '/tours' },
  { name: 'Best tours', path: '/best-tours' },
  { name: 'Contact Us', path: '#footer' },
]);

const activeNav = ref<string | null>(null);

const updateActiveNav = (path: string) => {
  if (path === '/') {
    activeNav.value = null;
    return;
  }

  const currentNavItem = navItems.value.find((item) => {
    if (item.path.startsWith('#')) return false;
    return path.startsWith(item.path);
  });

  if (currentNavItem) {
    activeNav.value = currentNavItem.name;
  } else {
    activeNav.value = null;
  }
};

onMounted(() => {
  updateActiveNav(router.currentRoute.value.path);

  if (!authStore.initialized) {
    authStore.initAuth();
  }
});

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    updateActiveNav(newPath);
  }
);

const handleNavigation = (item: NavItem) => {
  if (item.path.startsWith('#')) {
    scrollToElement(item.path);
    if (router.currentRoute.value.path !== '/') {
      activeNav.value = item.name;
    }
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
  handleNavigation(item);
  showMobileMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const goToHome = () => {
  router.push('/');
  activeNav.value = null;
};

const handleUserAccount = () => {
  router.push('/account');
  showMobileMenu.value = false;
};
</script>
