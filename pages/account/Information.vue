<template>
  <div class="grid grid-cols-12 gap-x-7">
    <div class="col-span-12 md:col-span-4 flex flex-col gap-y-7 justify-between md:hidden mb-6">
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
    <div class="bg-tertiary-black p-8 rounded-2xl flex flex-col gap-y-6 col-span-12 md:col-span-8">
      <trusty-field v-model="first_name" :disabled="disabledForm" label="First Name" />
      <trusty-field v-model="last_name" :disabled="disabledForm" label="Last Name" />
      <trusty-field v-model="email" :disabled="disabledForm" label="E-mail Address" type="email" />
      <trusty-field
        :ready="phoneReady"
        v-model="phone"
        :disabled="disabledForm"
        label="Mobile Phone Number"
        type="tel"
        :default-country="phoneCountry"
        @country-changed="(c) => (country_code = c.dialCode)"
      />
      <trusty-button v-if="disabledForm" @click="disabledForm = !disabledForm" class="!py-5 mt-2"
        >Edit</trusty-button
      >
      <trusty-button :loading="loading" v-if="!disabledForm" @click="updateUser" class="!py-5 mt-2"
        >Save</trusty-button
      >
    </div>
    <div class="col-span-4 md:flex flex-col gap-y-7 justify-between hidden">
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
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useDefaultCountry } from '@/composables/useDefaultCountry';

const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);

const first_name = ref(user?.value?.name || null);
const last_name = ref(user?.value?.last_name || null);
const email = ref(user?.value?.email || null);
const phone = ref(user?.value?.phone || null);
const country_code = ref(user?.value?.country || null);
const disabledForm = ref<boolean>(true);

const { defaultCountry: phoneCountry, ready: phoneReady } = useDefaultCountry(
  computed(() => country_code.value)
);

const updateUser = async () => {
  const cleanedPhone = phone.value?.replace(/\s+/g, '') || '';
  const res = await authStore.updateUserInfo({
    name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    phone: cleanedPhone,
    country: country_code.value,
  });
  await authStore.getUserInfo();
  disabledForm.value = true;
};

onMounted(() => authStore.getUserInfo());
</script>

<style scoped></style>
