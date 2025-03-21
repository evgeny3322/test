<template>
  <div
    class="bg-grey-light-1 p-5 lg:p-8 grid grid-cols-12 mt-[4.5%] lg:gap-x-16 rounded-2xl relative overflow-hidden"
  >
    <NuxtImg
      v-if="activeCardIndex !== null"
      :src="data.addons[activeCardIndex].media[0]"
      class="absolute h-full w-full -z-10 object-cover"
    />
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
        v-for="(card, index) in filteredAddons"
        :key="card.id"
        class="bg-grey-dark p-4 lg:p-5 rounded-2xl grid grid-cols-12 place-items-center cursor-pointer border-1 border-grey-dark gap-x-4"
        @click="setActiveCard(index)"
        :class="{ '!bg-[#313131] border-1 border-grey-light-3': activeCardIndex === index }"
      >
        <div class="col-span-12 lg:col-span-8 flex flex-col lg:flex-row gap-y-4 gap-x-4 w-full">
          <NuxtImg
            class="w-full h-full lg:max-w-[185px] max-h-[121px] rounded-[10px] object-cover"
            :src="card.media[0]"
          />
          <div class="flex flex-col gap-y-[10px]">
            <p class="font-medium text-16 lg:text-20 leading-30">{{ card.name }}</p>
            <span class="text-12 leading-17 text-grey-light-6">{{ card.description }}</span>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-4 w-full px-[10px] mt-[10px] lg:mt-0">
          <button
            class="bg-main-black rounded-[99px] py-4 px-6 w-full font-semibold text-18 lg:text-26 leading-30 text-white cursor-pointer"
          >
            {{ getPriceText(card, index) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, defineEmits, onMounted, watch } from 'vue';
import { Addon, Segment } from '@/types/tours';

const props = defineProps<{
  data: Segment;
  participants: number;
}>();

const emit = defineEmits<{
  (event: 'addon-selected', addon: Addon, segmentIndex: number, segment: Segment): void;
  (event: 'addon-removed', addonId: number): void;
  (event: 'addon-unavailable', segmentId: number, addonId: number): void;
}>();

const { data } = toRefs(props);
const activeCardIndex = ref<number | null>(null);

const mandatory = computed(() => {
  return data.value.type.mandatory;
});
const filteredAddons = computed(() => {
  return data.value.addons.filter((addon) => addon.max_participants >= props.participants);
});

watch(
  () => props.participants,
  (newParticipants) => {
    data.value.addons.forEach((addon, index) => {
      if (addon.max_participants < newParticipants) {
        console.log(
          `Addon ${addon.name} (ID: ${addon.id}) in segment ${data.value.id} is no longer available`
        );
        emit('addon-unavailable', data.value.id, addon.id);

        if (activeCardIndex.value === index) {
          console.log(`Removing active addon (ID: ${addon.id}) as it's no longer available`);
          activeCardIndex.value = null;
        }
      }
    });

    if (activeCardIndex.value === null && filteredAddons.value.length > 0) {
      const cheapestIndex = filteredAddons.value.reduce(
        (minIdx, addon, idx, arr) =>
          calculatePrice(addon) < calculatePrice(arr[minIdx]) ? idx : minIdx,
        0
      );
      setActiveCard(cheapestIndex);
    }
  },
  { deep: true }
);

const calculatePrice = (addon: Addon) => {
  if (!addon || !addon.price || !Array.isArray(addon.price)) {
    console.warn(`Invalid cost data for addon: ${addon?.name || 'Unknown addon'}`);
    return 0;
  }

  if (props.participants > addon.max_participants) {
    console.warn(
      `Too many participants (${props.participants}) for addon: ${addon.name} (max: ${addon.max_participants})`
    );
    return 0;
  }

  const priceIndex = props.participants - 1;
  const baseCost = priceIndex < addon.price.length ? addon.price[priceIndex] : addon.price.at(-1);

  if (baseCost === undefined) {
    console.warn(`No base cost found for ${props.participants} participants`);
    return 0;
  }

  return Math.round(baseCost * props.participants);
};

const getPriceText = (card: Addon, index: number) => {
  const currentPrice = calculatePrice(card);
  const selectedPrice =
    activeCardIndex.value !== null
      ? calculatePrice(filteredAddons.value[activeCardIndex.value])
      : 0;

  if (selectedPrice === 0) return `${currentPrice} EUR`;

  const priceDifference = currentPrice - selectedPrice;

  if (priceDifference === 0) {
    return `${currentPrice} EUR`;
  }

  const sign = priceDifference < 0 ? '-' : '+';
  console.log(`Price difference: ${priceDifference}`);
  return `${sign} ${Math.abs(priceDifference)} EUR`;
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
  if (mandatory.value && filteredAddons.value.length > 0) {
    const cheapestIndex = filteredAddons.value.reduce(
      (minIdx, addon, idx, arr) =>
        calculatePrice(addon) < calculatePrice(arr[minIdx]) ? idx : minIdx,
      0
    );
    setActiveCard(cheapestIndex);
  }
});
</script>

<style scoped></style>
