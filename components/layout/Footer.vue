<template>
  <div id="footer" class="pt-[7%] pb-[2%] 2xl:pt-[4%]">
    <div class="flex flex-col mx-auto">
      <div class="flex flex-col lg:flex-row justify-between items-start">
        <p class="title text-23 leading-18 cursor-pointer">InspirItaly</p>
        <div class="flex flex-row items-center gap-x-[18px] my-[30px] lg:hidden">
          <component
            class="w-[24px] h-[24px] cursor-pointer"
            v-for="(social, index) in socialIcons"
            :key="index"
            :is="social.icon"
          />
        </div>
        <div class="flex flex-col gap-y-5 mb-7.5 lg:mb-0">
          <p v-for="item in navItems" :key="item" class="text cursor-pointer">{{ item }}</p>
        </div>
        <div class="flex flex-col gap-y-2 mb-7.5 lg:mb-0">
          <p class="text">Our Location</p>
          <span class="description"
            >Via Ambrogio Traversari, 64/Rosso <br class="hidden lg:block" />
            Florence, Italy, 50126</span
          >
        </div>
        <div class="flex flex-col gap-y-5 mb-7.5 lg:mb-0">
          <div class="flex flex-col gap-y-[10px] text">
            <p>Need Help? Call Us Now</p>
            <p>+39 055 3950450</p>
          </div>
          <div class="flex flex-col gap-y-[10px] description">
            <span>Monday – Friday: 9:00-20:00</span>
            <span>Saturday: 11:00 – 15:00</span>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:flex flex-row items-center gap-x-5 my-7.5 justify-end lg:my-0 lg:mt-7.5"
      >
        <component
          class="w-[24px] h-[24px] cursor-pointer"
          v-for="(social, index) in socialIcons"
          :key="index"
          :is="social.icon"
        />
      </div>
    </div>
    <div class="border-b-[#434343] border-b-[1px] lg:mt-[65px]"></div>
    <div class="flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between">
      <div class="my-7.5 flex flex-col justify-start lg:flex-row lg:items-center">
        <p class="description lg:mr-4">We Accept:</p>
        <div class="flex flex-row items-center gap-x-4 mt-3 lg:mt-0">
          <component v-for="(accept, index) in acceptItems" :key="index" :is="accept.icon" />
        </div>
      </div>
      <p class="text-center description">Copyright © 2025 TailGrids. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import FaceBookIcon from '@/components/icons/FaceBookIcon.vue';
import TwitterIcon from '@/components/icons/TwitterIcon.vue';
import InstaIcon from '@/components/icons/InstaIcon.vue';
import LinkedInIcon from '@/components/icons/LinkedInIcon.vue';
import PaypalIcon from '@/components/icons/PaypalIcon.vue';
import VisaIcon from '@/components/icons/VisaIcon.vue';
import MasterCardIcon from '@/components/icons/MasterCardIcon.vue';
import ExpressIcon from '@/components/icons/ExpressIcon.vue';
import DiscoverIcon from '@/components/icons/DiscoverIcon.vue';
import { markRaw, ref } from 'vue';
import { useDevice } from '@/.nuxt/imports';

const navItems = ref<string[]>(['Home', 'Best tours']);

const socialIcons = ref<{ icon: any; link: string }[]>([
  {
    icon: markRaw(FaceBookIcon),
    link: 'https://www.facebook.com/',
  },
  {
    icon: markRaw(TwitterIcon),
    link: 'https://twitter.com/',
  },
  {
    icon: markRaw(InstaIcon),
    link: 'https://www.instagram.com/',
  },
  {
    icon: markRaw(LinkedInIcon),
    link: 'https://www.linkedin.com/',
  },
]);

const acceptItems = ref<{ icon: any; link: string }[]>([
  {
    icon: markRaw(PaypalIcon),
    link: 'https://www.paypal.com/',
  },
  {
    icon: markRaw(VisaIcon),
    link: 'https://www.visa.com/',
  },
  {
    icon: markRaw(MasterCardIcon),
    link: 'https://www.mastercard.com/',
  },
  {
    icon: markRaw(ExpressIcon),
    link: 'https://www.express.com/',
  },
  {
    icon: markRaw(DiscoverIcon),
    link: 'https://www.discover.com/',
  },
]);
</script>
