<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex w-full">
        <h1 class="max-w-[16.563rem] font-normal text-[2.5rem] leading-[90%]">
          Thanks for your Request!
        </h1>
      </div>
      <hr class="my-8 border-under-line" />
      <hr class="mb-8 md:block hidden border-under-line" />
      <div class="w-full flex flex-col gap-8">
        <div
          v-for="pay in payment"
          class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29"
        >
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="pay.img"
              alt="Payment icon"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">Tour Chianti</h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="md:pb-8 pb-6">{{ pay.area }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="md:pb-8 pb-6">{{ pay.date }}</li>
                  <li class="text-grey-light-4">Number of participants:</li>
                  <li>{{ pay.participants_number }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration::</li>
                  <li class="md:pb-8 pb-6">{{ pay.total_duration }} Hours</li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ pay.total_price }} Eur</li>
                  <li class="text-grey-light-4">Transportation:</li>
                  <li>{{ pay.transportation }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">List of services:</li>
                  <li v-for="service in pay.services">{{ service.title }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-8 border-under-line" />
      <span class="mb-8"
        >Your account successfully created, please proceed to the My Account section where you can
        find your Tours History page and other functions.</span
      >
      <div class="flex flex-col w-full bg-grey-dark rounded-[1rem]">
        <div class="flex xl:flex-row flex-col w-full gap-4 p-[1.125rem]">
          <trusty-field
            class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
            model-value=""
            placeholder="Paolo"
          />
          <trusty-field
            class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
            model-value=""
            placeholder="Fanty"
          />
          <trusty-field
            class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
            model-value=""
            placeholder="example@gmail.com"
          />
        </div>
        <div class="flex xl:flex-row flex-col w-full gap-4 px-[1.125rem] pb-[1.125rem]">
          <trusty-field
            class="xl:w-1/2 w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
            model-value=""
            placeholder="Italy"
          />
          <trusty-field
            class="xl:w-1/2 w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
            type="tel"
            model-value=""
            placeholder="44 44 44 44"
          />
          <trusty-button class="w-full !font-semibold h-[4rem] bg-grey-light-1 rounded-[1rem]">
            <span>Confirm account creation</span>
          </trusty-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.field-input {
  height: 4rem;
}
</style>
<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import { ref, onMounted } from 'vue';

const payment = [
  {
    id: 1,
    img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Tour Chianti',
    area: 'Florence',
    date: '29/02/2024 21:49',
    participants_number: '2',
    total_duration: '2',
    total_price: '1000',
    currency: 'some currency',
    transportation: 'Mercedes “S Class”',
    services: [
      {
        id: 1,
        title: 'S class',
        description:
          'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
        price: 800,
        img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
      },
      {
        id: 2,
        title: 'Light lunch',
        description:
          'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
        price: 200,
        img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
      },
    ],
  },
  {
    id: 1,
    img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
    title: 'Tour Chianti',
    area: 'Florence',
    date: '29/02/2024 21:49',
    participants_number: '2',
    total_duration: '2',
    total_price: '1000',
    currency: 'some currency',
    transportation: 'Mercedes “S Class”',
    services: [
      {
        id: 1,
        title: 'S class',
        description:
          'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
        price: 800,
        img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
      },
      {
        id: 2,
        title: 'Light lunch',
        description:
          'The words of the Romantic poet Lord Byron, written more than two centuries ago, still worthily represent one of the most beautiful more than two centuries ago, still worthily represent one of the most beautiful',
        price: 200,
        img: 'https://png.pngtree.com/thumb_back/fh260/background/20210316/pngtree-vertical-version-of-cherry-blossom-photography-romantic-pink-image_586839.jpg',
      },
    ],
  },
];
</script>
