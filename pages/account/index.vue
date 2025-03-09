<template>
  <div class="block-container flex flex-col justify-between h-full">
    <div class="grid grid-cols-12 gap-x-20">
      <div class="col-span-3 flex flex-col">
        <div class="flex flex-col gap-y-[6px]">
          <p
            @click="setActiveItem(index)"
            v-for="(item, index) in navItems"
            :key="index"
            class="font-medium text-18 title px-6 py-3 cursor-pointer"
            :class="{ 'rounded-main-sm bg-[#FFFFFF0D]': activeNavIndex === index }"
          >
            {{ item.name }}
          </p>
        </div>
        <p class="px-[13px] text-grey-light-4 font-medium title text-18 cursor-pointer mt-[341px]">
          Log Out
        </p>
      </div>
      <div class="col-span-9">
        <component :is="navItems[activeNavIndex].component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

interface NavItem {
  name: string;
  component: ReturnType<typeof defineAsyncComponent>;
}

const activeNavIndex = ref<number>(0);

const navItems = ref<NavItem[]>([
  {
    name: 'Tours History',
    component: defineAsyncComponent(() => import('./Tours.vue')),
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
</script>
