<template>
  <div class="grid grid-cols-12 gap-x-7">
    <div class="bg-tertiary-black p-8 rounded-2xl flex flex-col gap-y-6 col-span-8">
      <trusty-field model-value="" label="First Name" />
      <trusty-field model-value="" label="Last Name" />
      <trusty-field model-value="" label="E-mail Address" type="email" />
      <trusty-field model-value="" label="Mobile Phone Number" type="tel" />
      <trusty-button class="!py-5 mt-2"> Edit</trusty-button>
    </div>
    <div class="col-span-4 flex flex-col gap-y-7 justify-between">
      <div class="bg-[#151515] p-6 rounded-2xl h-full max-h-[300px]">
        <p class="title text-18 font-medium mb-3">Information</p>
        <span class="text-grey-light-4 text-14"
          >At least 8 characters, at least one capital and small letter, number and special
          character.At least 8 characters, at least one capital and small letter, number and special
          character.</span
        >
      </div>
      <tours-cards-slider />
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import ToursCardsSlider from '@/components/tours/ToursCardsSlider.vue';
</script>

<style scoped></style>
