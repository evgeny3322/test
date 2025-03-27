<template>
  <div
    class="bg-grey-light-1 p-5 lg:p-8 grid grid-cols-12 mt-[2.5rem] lg:mt-[3.80rem] lg:gap-x-16 rounded-2xl relative overflow-hidden"
  >
    <transition name="fade">
      <NuxtImg
        v-if="activeCardIndex !== null"
        :key="data.addons[activeCardIndex].media[0]"
        :src="data.addons[activeCardIndex].media[0]"
        class="absolute h-full w-full -z-10 object-cover"
      />
    </transition>
    <div
      v-if="activeCardIndex !== null"
      class="absolute w-full h-full bg-[#00000099] backdrop-blur-[5px] -z-9"
    ></div>
    <div class="col-span-12 lg:col-span-4 flex flex-col gap-y-6 mb-6 lg:mb-0">
      <p class="text-26 leading-30 lg:text-40 lg:leading-36 font-medium text-white">
        {{ data.name }}
      </p>
      <span class="text-14 lg:text-16 leading-22 text-grey-light-6">{{ data.description }}</span>
    </div>
    <div class="col-span-12 lg:col-span-8 flex flex-col gap-y-6">
      <div
        v-if="!mandatory"
        class="bg-grey-dark p-5 rounded-2xl grid grid-cols-12 place-items-center cursor-pointer border-1 border-grey-dark gap-x-4 gap-y-4"
        :class="{ '!bg-[#313131] border-1 border-grey-light-3': activeCardIndex === null }"
        @click="setActiveCard(null)"
      >
        <div class="col-span-12 lg:col-span-8 w-full">
          <p class="font-medium text-20 leading-20">No needed</p>
        </div>
        <div class="col-span-12 lg:col-span-4 w-full lg:px-[10px]">
          <button
            class="bg-main-black rounded-[99px] py-4 px-6 w-full font-semibold text-white text-26 leading-30"
          >
            0 EUR
          </button>
        </div>
      </div>
      <div
        v-for="(addon, index) in addonsWithAvailability"
        :key="addon.id"
        class="bg-grey-dark p-4 lg:p-5 rounded-2xl grid grid-cols-12 place-items-center cursor-pointer border-1 border-grey-dark gap-x-4"
        @click="addon.unavailable ? null : setActiveCard(index)"
        :class="[
          activeCardIndex === index ? '!bg-[#313131] border-1 border-grey-light-3' : '',
          addon.unavailable && '!border-[#A23535]',
        ]"
      >
        <div
          :class="{ 'opacity-50': addon.unavailable }"
          class="col-span-12 lg:col-span-8 flex flex-col lg:flex-row gap-y-4 gap-x-4 w-full h-full"
        >
          <div
            v-if="!imageLoaded"
            class="w-full h-full lg:max-w-[185px] max-h-[121px] rounded-[10px]"
          >
            <trusty-skeleton class="w-[242px] h-[121px] lg:w-[185px] lg:h-[109px]" />
          </div>
          <NuxtImg
            v-show="imageLoaded"
            class="w-full h-full lg:max-w-[185px] max-h-[121px] rounded-[10px] object-cover"
            :src="addon.media[0]"
            @load="imageLoaded = true"
            @error="imageLoaded = true"
          />
          <div class="flex flex-col gap-y-[10px]">
            <p class="font-medium text-16 lg:text-20 leading-30">{{ addon.name }}</p>
            <span class="text-12 leading-17 text-grey-light-6 line-clamp-4">{{
              addon.description
            }}</span>
          </div>
        </div>
        <div
          class="flex justify-center items-center col-span-12 lg:col-span-4 w-full px-[10px] mt-[10px] lg:mt-0 relative h-full"
        >
          <button
            class="bg-main-black rounded-[99px] py-4 px-6 w-full font-semibold text-18 lg:text-26 leading-30 text-white cursor-pointer"
          >
            {{ addon.unavailable ? 'unavailable' : getPriceText(addon, index) }}
          </button>
          <span v-if="addon.unavailable" class="text-[#A13535] absolute bottom-[-8%] right-[20%]"
            >max {{ addon.max_participants }} participants</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, defineEmits, onMounted, watch } from 'vue';
import { Addon, Segment } from '@/types/tours';
import TrustySkeleton from '@/components/ui/TrustySkeleton.vue';
import { PriceCalculationService } from '@/utils/priceCalculationService';

const props = defineProps<{
  data: Segment;
  participants: number;
  driverHourRate: number;
}>();

const emit = defineEmits<{
  (event: 'addon-selected', addon: Addon, segmentIndex: number, segment: Segment): void;
  (event: 'addon-removed', addonId: number): void;
  (event: 'addon-unavailable', segmentId: number, addonId: number): void;
}>();

const { data } = toRefs(props);
const activeCardIndex = ref<number | null>(null);
const imageLoaded = ref<boolean>(false);
const priceService = PriceCalculationService;

const mandatory = computed(() => {
  return data.value.type.mandatory;
});

const addonsWithAvailability = computed(() => {
  return data.value.addons.map((addon) => {
    const maxParticipants = Number(addon.max_participants) || 0;
    const currentParticipants = Number(props.participants) || 1;

    return {
      ...addon,
      unavailable: maxParticipants > 0 && maxParticipants < currentParticipants,
    };
  });
});

const autoSelectAddon = () => {
  if (mandatory.value) {
    const availableAddons = addonsWithAvailability.value.filter((a) => !a.unavailable);

    if (availableAddons.length > 0) {
      const cheapestIndex = availableAddons.reduce(
        (minIdx, addon, idx, arr) =>
          calculatePrice(addon) < calculatePrice(arr[minIdx]) ? idx : minIdx,
        0
      );

      const selectedAddonId = availableAddons[cheapestIndex].id;
      const realIndex = data.value.addons.findIndex((a) => a.id === selectedAddonId);
      setActiveCard(realIndex);
    }
  } else {
    setActiveCard(null);
  }
};

watch(
  () => props.participants,
  () => {
    let shouldRecalculate = false;

    data.value.addons.forEach((addon, index) => {
      const isUnavailable = addon.max_participants < props.participants;

      if (isUnavailable) {
        emit('addon-unavailable', data.value.id, addon.id);

        if (activeCardIndex.value === index) {
          activeCardIndex.value = null;
          shouldRecalculate = true;
        }
      }
    });

    if (!mandatory.value) {
      const currentAddon = data.value.addons[activeCardIndex.value ?? -1];
      const stillValid = currentAddon && currentAddon.max_participants >= props.participants;

      if (!stillValid) {
        console.log(`🔄 Switching to "No needed" for segment ${data.value.id}`);
        setActiveCard(null);
      } else {
        console.log(`✅ Keeping selected addon for non-mandatory segment ${data.value.id}`);
      }

      return;
    }

    const availableAddons = addonsWithAvailability.value.filter((a) => !a.unavailable);

    if (availableAddons.length > 0) {
      const cheapestIndex = availableAddons.reduce(
        (minIdx, addon, idx, arr) =>
          calculatePrice(addon) < calculatePrice(arr[minIdx]) ? idx : minIdx,
        0
      );

      const addonId = availableAddons[cheapestIndex].id;
      const realIndex = data.value.addons.findIndex((a) => a.id === addonId);

      if (activeCardIndex.value !== realIndex) {
        setActiveCard(realIndex);
      }
    } else {
      setActiveCard(null);
    }
  },
  { deep: true }
);

const calculatePrice = (addon: Addon): number => {
  if (!addon || !addon.price || !Array.isArray(addon.price)) {
    console.warn(`Invalid cost data for addon: ${addon?.name || 'Unknown addon'}`);
    return 0;
  }

  if (props.participants > addon.max_participants) {
    console.warn(`Too many participants (${props.participants}) for addon: ${addon.name}`);
    return 0;
  }

  const priceIndex = props.participants - 1;
  const baseCost =
    priceIndex < addon.price.length ? addon.price[priceIndex] : (addon.price.at(-1) ?? 0);
  const basePrice = priceService.roundPrice((baseCost || 0) * props.participants);

  const addonDuration = Number(addon.duration) || 0;
  const segmentDuration = Number(props.data.duration) || 0;
  const additionalTime = addonDuration - segmentDuration;

  if (additionalTime > 0) {
    const extraCost = priceService.roundPrice((additionalTime / 60) * props.driverHourRate);
    return priceService.roundPrice(basePrice + extraCost);
  }

  return basePrice;
};

const getPriceText = (card: Addon, index: number) => {
  const currentPrice = calculatePrice(card);
  const formattedPrice = priceService.formatPrice(currentPrice);

  const selectedPrice =
    activeCardIndex.value !== null
      ? calculatePrice(addonsWithAvailability.value[activeCardIndex.value])
      : 0;

  if (selectedPrice === 0) return `${formattedPrice} EUR`;

  const priceDifference = currentPrice - selectedPrice;

  if (priceDifference === 0) {
    return `${formattedPrice} EUR`;
  }

  const sign = priceDifference < 0 ? '-' : '+';
  const formattedDifference = priceService.formatPrice(Math.abs(priceDifference));

  return `${sign} ${formattedDifference} EUR`;
};

const setActiveCard = (index: number | null) => {
  console.log(`Setting active card: ${index}`);
  activeCardIndex.value = index;
  if (index !== null) {
    const selectedAddon = data.value.addons[index];
    console.log(`Selected addon for segment ${data.value.id}:`, selectedAddon);
    emit('addon-selected', selectedAddon, data.value.id, data.value);
  } else {
    console.log(`Removing addon for segment ${data.value.id}`);
    emit('addon-removed', data.value.id);
  }
};

onMounted(() => {
  autoSelectAddon();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
