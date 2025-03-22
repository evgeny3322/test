<template>
  <div class="block-container flex flex-col justify-between h-full">
    <div class="grid grid-cols-12 lg:gap-x-20 overflow-x-auto lg:overflow-visible scrollbar-hide">
      <div class="col-span-12 lg:col-span-3 flex flex-col">
        <div
          class="flex flex-row overflow-x-scroll lg:overflow-visible h-full lg:h-max w-full lg:flex-col gap-x-3 gap-y-[6px] scrollbar-hide"
        >
          <template v-for="item in availableNavItems" :key="item.name">
            <p
              @click="setActiveItem(item)"
              class="font-medium text-14 lg:text-18 title px-6 py-3 cursor-pointer text-nowrap lg:text-wrap"
              :class="{ 'rounded-2xl bg-[#FFFFFF0D]': activeNavItem?.name === item.name }"
            >
              {{ item.name }}
            </p>
          </template>
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

          <template v-if="activeNavItem?.name === 'Agency information'">
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-y-3 lg:gap-y-7 justify-between">
              <div class="bg-[#151515] p-6 rounded-2xl h-full">
                <p class="title text-14 lg:text-18 font-medium mb-3">Information</p>
                <span class="text-grey-light-4 text-12 lg:text-14">
                  At least 8 characters, at least one capital and small letter, number and special
                  character.
                </span>
              </div>
              <tours-cards-slider />
            </div>
          </template>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-9">
        <component :is="activeNavItem?.component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import ToursCardsSlider from '@/components/tours/ToursCardsSlider.vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { storeToRefs } from 'pinia';

const router = useRouter();
const isLoggingOut = ref(false);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

interface NavItem {
  name: string;
  component: ReturnType<typeof defineAsyncComponent>;
  access: boolean;
}

const activeNavItem = ref<NavItem | null>(null);

const isReqAgency = computed(() => user?.value?.type === 'request_for_agency');

const navItems = computed<NavItem[]>(() => [
  {
    name: 'Tours History',
    component: defineAsyncComponent(() => import('./Tours.vue')),
    access: true,
  },
  {
    name: 'Agency information',
    component: defineAsyncComponent(() => import('./AgencyInformation.vue')),
    access: isReqAgency.value,
  },
  {
    name: 'Account Information',
    component: defineAsyncComponent(() => import('./Information.vue')),
    access: true,
  },
  {
    name: 'Terms of Service',
    component: defineAsyncComponent(() => import('./Terms.vue')),
    access: isReqAgency.value,
  },
  {
    name: 'Documents/Invoices',
    component: defineAsyncComponent(() => import('./DocumentsInvoices.vue')),
    access: isReqAgency.value,
  },
]);

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
const availableNavItems = computed(() => navItems.value.filter((i) => i.access));

const setActiveItem = (item: NavItem) => {
  activeNavItem.value = item;
};

onMounted(() => {
  activeNavItem.value = availableNavItems.value[1] ?? null;
});
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
