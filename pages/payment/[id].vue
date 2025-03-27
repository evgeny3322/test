<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex w-full">
        <h1 class="max-w-[16.563rem] font-normal text-[2.5rem] leading-[90%]">{{ title }}</h1>
      </div>
      <hr class="my-8 border-under-line" />
      <div class="w-full flex flex-col gap-8">
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="tourData?.media[0]"
              alt="Payment icon"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] xl:h-auto xl:w-[38.7%] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ tourData?.name }}
              </h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4 mb-1">Area:</li>
                  <li class="md:pb-8 pb-6">{{ tourData?.area.name }}</li>
                  <li class="text-grey-light-4 mb-1">Date:</li>
                  <li class="md:pb-8 pb-6">
                    {{ dayjs(customTour?.date).format('DD/MM/YYYY HH:mm') }}
                  </li>
                  <li class="text-grey-light-4 mb-1">Number of participants:</li>
                  <li>{{ customTour?.participants }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4 mb-1">Total duration:</li>
                  <li class="md:pb-8 pb-6">{{ (customTour?.total_duration ?? 1) / 60 }} Hours</li>
                  <li class="text-grey-light-4 mb-1">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ customTour?.total_price }} Eur</li>
                  <li class="text-grey-light-4 mb-1">Transportation:</li>
                  <li>{{ customTour?.addons[0].name }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4 mb-1">List of services:</li>
                  <li v-for="service in customTour?.addons">{{ service.name }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!authStore?.isAuthenticated && formData.createAccount === 'true'"
        class="flex w-full flex-col"
      >
        <hr class="my-8 border-under-line" />
        <span class="mb-8"
          >Your account successfully created, please proceed to the My Account section where you can
          find your Tours History page and other functions.</span
        >
        <form
          @submit.prevent="handleSubmit"
          class="flex flex-col w-full bg-grey-dark rounded-[1rem]"
        >
          <div class="flex xl:flex-row flex-col w-full gap-4 p-[1.125rem]">
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.firstName"
              placeholder="First name"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.lastName"
              placeholder="Last name"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.email"
              placeholder="example@gmail.com"
            />
          </div>
          <div class="flex xl:flex-row flex-col w-full gap-4 px-[1.125rem] pb-[1.125rem]">
            <trusty-field
              class="xl:w-1/2 w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.country"
              placeholder="Country"
            />
            <trusty-field
              class="xl:w-1/2 w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              type="tel"
              v-model="formData.phone"
              @country-changed="handleCountryChanged"
              :default-country="formData.iso2"
              placeholder="44 44 44 44"
            />
            <trusty-button
              type="submit"
              class="w-full !font-semibold h-[4rem] bg-grey-light-1 rounded-[1rem] items-center xl:w-[87.7%]"
            >
              <span>Confirm account creation</span>
            </trusty-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import { ref, onBeforeMount, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from 'nuxt/app';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';
import { Tour } from '@/types/tours';

const authStore = useAuthStore();

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const toursStore = useToursStore();
const { customTour }: any = storeToRefs(toursStore);
const tourData = ref<Tour | null>(null);

const handleTours = async () => {
  return await toursStore.getTourById(customTour.value?.tour_id || 1);
};
const fetchTourData = async () => {
  try {
    tourData.value = await handleTours();
  } catch (error) {
    console.log('Error fetching tour data:', error);
  }
};

const title = ref<string>('');

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dialCode: '',
  iso2: '',
  country: '',
  createAccount: 'false',
});

const handleCountryChanged = (event: any) => {
  formData.country = event.name;
  formData.dialCode = event.dialCode;
  formData.iso2 = event.iso2;
};

let handleSubmit: () => void;

onBeforeMount(async () => {
  await fetchTourData();

  const { order_id, payment_code, notes, ...restFormData } = route.query;

  Object.assign(formData, restFormData);

  await router.replace({ query: {} });

  if (!authStore?.isAuthenticated) {
    handleSubmit = () => {
      axios.post(
        `${config.public.apiUrl}/orders/payment/order/user/store`,
        {
          order_id,
          name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          country: formData.country,
          phone: `+${formData.dialCode} ${formData.phone}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
    };
  }

  switch (route.params.id) {
    case 'success':
      title.value = 'Thanks for your Request!';

      await axios.post(
        `${config.public.apiUrl}/orders/payment/update`,
        { order_id, payment_code, notes },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      break;
    case 'failure':
      title.value = 'Something went wrong.';
  }
});
</script>
<style>
.field-input {
  height: 4rem;
}
</style>
