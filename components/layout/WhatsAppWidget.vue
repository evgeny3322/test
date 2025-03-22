<template>
  <div @click.stop class="fixed right-[10px] bottom-[10px] z-40">
    <div
      class="self-stretch flex-col justify-start items-start gap-0.5 flex relative cursor-pointer"
      @trigger="hideOnClickOutside"
    >
      <a
        class="w-full mt-[37px] px-4 py-6 bg-[#22c55e] rounded-tl-xl rounded-tr-xl rounded-bl-xl flex-col justify-start items-start gap-4 inline-flex min-w-max duration-300 group absolute right-0 bottom-[110%]"
        :class="{ '!hidden': !isVisible }"
        href="https://wa.me/<номер>"
        target="_blank"
        rel="nofollow noopener noreferrer"
        @click="closeWidget"
      >
        <img
          src="@/assets/images/whatsapp-logo.png"
          alt=""
          width="124"
          height="29"
        />
        <div class="self-stretch flex-col justify-start items-start gap-0.5 flex">
          <p class="text-white text-lg font-bold leading-[27px]">Get a quick consultation</p>
          <p class="text-white text-sm font-normal leading-[21px]">
            Our managers respond instantly.
          </p>
        </div>
        <div
          class="grow w-full shrink basis-0 px-[31px] py-[13px] bg-black rounded-lg justify-center items-center gap-2 flex border border-transparent duration-300 group-hover:bg-transparent group-hover:border-white"
        >
          <span class="text-center text-white text-sm font-bold leading-tight duration-300">Write to WhatsApp</span>
        </div>
      </a>
      <WhatsappIcon
        @click="toggleVisibility"
        @mouseover="mouseOverHandler"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WhatsappIcon from '@/components/icons/WhatsAppIcon.vue';

const isMobile = ref<boolean>(false);

isMobile.value = window?.innerWidth <= 767;

const isVisible = ref<boolean>(false);

const hideOnClickOutside = (): void => {
  isVisible.value = false;
};
const mouseOverHandler = (): void => {
  if (!isMobile.value) {
    isVisible.value = true;
  }
};
const closeWidget = (): void => {
    isVisible.value = false;
};

const toggleVisibility = (): void => {
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  document.addEventListener('click', closeWidget);
});
</script>
