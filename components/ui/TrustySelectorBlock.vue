<template>
  <div
    class="bg-grey-light-1 p-8 grid grid-cols-12 mt-[4.5%] gap-x-16 rounded-main-sm relative overflow-hidden"
  >
    <NuxtImg
      v-if="activeCardIndex !== null"
      :src="data.cards[activeCardIndex].image"
      class="absolute h-full w-full -z-10 object-cover"
    />
    <div
      v-if="activeCardIndex !== null"
      class="absolute w-full h-full bg-[#00000099] backdrop-blur-[5px] -z-9"
    ></div>
    <div class="col-span-4 flex flex-col gap-y-6">
      <p class="text-40 leading-36 font-medium">{{ data.title }}</p>
      <span class="text-16 leading-22 text-grey-light-6">{{ data.description }}</span>
    </div>
    <div class="col-span-8 flex flex-col gap-y-6">
      <div
        v-if="!mandatory"
        class="bg-grey-dark p-5 rounded-main-sm grid grid-cols-12 place-items-center cursor-pointer border-1 border-grey-dark gap-x-4"
        :class="{ '!bg-[#313131] border-1 border-grey-light-3': activeCardIndex === null }"
        @click="setActiveCard(null)"
      >
        <div class="col-span-8 w-full">
          <p class="font-medium text-20 leading-20">No needed</p>
        </div>
        <div class="col-span-4 w-full px-[10px]">
          <button
            class="bg-main-black rounded-[99px] py-4 px-6 w-full font-semibold text-26 leading-30"
          >
            0 EUR
          </button>
        </div>
      </div>
      <div
        class="bg-grey-dark p-5 rounded-main-sm grid grid-cols-12 place-items-center cursor-pointer border-1 border-grey-dark gap-x-4"
        v-for="(card, index) in data.cards"
        @click="setActiveCard(index)"
        :class="{ '!bg-[#313131] border-1 border-grey-light-3': activeCardIndex === index }"
      >
        <div class="col-span-8 flex flex-row gap-x-4 w-full">
          <NuxtImg
            class="w-full h-full max-w-[185px] max-h-[121px] rounded-[10px] object-cover"
            :src="card.image"
          />
          <div class="flex flex-col gap-y-[10px]">
            <p class="font-medium text-20 leading-30">{{ card.title }}</p>
            <span class="text-12 leading-17 text-grey-light-6">{{ card.description }}</span>
          </div>
        </div>
        <div class="col-span-4 w-full px-[10px]">
          <button
            class="bg-main-black rounded-[99px] py-4 px-6 w-full font-semibold text-26 leading-30"
          >
            {{ getPriceText(card, index) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';

interface Card {
  title: string;
  description: string;
  image: string;
  cost: number[];
  max_participants: number;
}

const props = withDefaults(
  defineProps<{
    data: {
      title: string;
      description: string;
      cards: Card[];
    };
    mandatory?: boolean;
    participants: number;
  }>(),
  {
    mandatory: true,
  }
);

const { data, mandatory } = toRefs(props);
const activeCardIndex = ref<number | null>(0);

const calculatePrice = (card: Card) => {
  if (props.participants > card.max_participants) {
    console.warn(
      `Participants (${props.participants}) exceed max allowed (${card.max_participants})`
    );
    return 0;
  }
  return card.cost[props.participants - 1] * props.participants;
};

const getPriceText = (card: Card, index: number) => {
  const selectedPrice =
    activeCardIndex.value !== null ? calculatePrice(data.value.cards[activeCardIndex.value]) : 0;
  const currentPrice = calculatePrice(card);
  const priceDifference = currentPrice - selectedPrice;

  if (index === activeCardIndex.value) {
    return `${currentPrice} EUR`;
  } else {
    return priceDifference < 0 ? `- ${Math.abs(priceDifference)} EUR` : `+ ${priceDifference} EUR`;
  }
};

const setActiveCard = (index: number | null) => {
  activeCardIndex.value = index;
};
</script>

<style scoped></style>
