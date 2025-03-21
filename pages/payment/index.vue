<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex w-full">
        <h1 class="font-normal text-[2.5rem] leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[3rem] leading-[110%]"
          >{{ customTour?.total_price }} EUR</span
        >
      </div>
      <hr class="my-8 border-under-line" />
      <div class="w-full flex flex-col gap-8">
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="tourData?.media[0]"
              alt="Payment icon"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ tourData?.name }}
              </h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="md:pb-8 pb-6">{{ tourData?.area.name }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="md:pb-8 pb-6">
                    {{ dayjs(customTour?.date).format('DD/MM/YYYY HH:mm') }}
                  </li>
                  <li class="text-grey-light-4">Number of participants:</li>
                  <li>{{ customTour?.participants }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration:</li>
                  <li class="md:pb-8 pb-6">{{ (customTour?.total_duration ?? 1) / 60 }} Hours</li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ customTour?.total_price }} Eur</li>
                  <li class="text-grey-light-4">Transportation:</li>
                  <li>{{ customTour?.addons[0].name }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">List of services:</li>
                  <li v-for="service in customTour?.addons">{{ service.name }}</li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="my-8 border-grey-light-29 rounded-full" />
          <!-- accardion show more -->
          <TrustyAccordion :title="'Show details'">
            <div
              v-for="service in customTour?.addons"
              class="flex flex-col w-full gap-6 mt-8 p-[1.125rem] bg-grey-dark rounded-[1rem]"
            >
              <div class="flex xl:flex-row flex-col gap-4">
                <NuxtImg
                  :src="service.media[0]"
                  alt="Payment icon"
                  class="overflow-hidden rounded-[1rem] xl:min-w-[19.063rem] h-[7.563rem] object-cover"
                />
                <div class="flex flex-col gap-[0.625rem]">
                  <h3 class="font-normal leading-[1.875rem] text-[1.25rem]">{{ service.name }}</h3>
                  <span class="text-grey-light-6 text-[0.75rem] font-normal leading-[140%]">{{
                    service.description
                  }}</span>
                </div>
                <TrustyButton
                  class="min-w-[12.563rem] h-[3.688rem] md:!text-[1.625rem] max-xl:w-full self-center xl:ml-[2.563rem]"
                  type="black"
                  color="black"
                  >{{ service.price[(customTour?.participants ?? 0) - 1] }} EUR</TrustyButton
                >
              </div>
            </div>
          </TrustyAccordion>
        </div>
      </div>
      <hr class="my-8 border-under-line" />
      <!-- Payment form -->
      <div>
        <div
          id="payment-form"
          class="payment_form form mt-[-38px] bg-grey-dark p-[1.125rem] rounded-[1rem]"
        >
          <input type="hidden" name="stripeToken" id="stripe-token-id" />
          <div
            v-if="authStore?.isAuthenticated == false"
            class="flex xl:flex-row flex-col w-full gap-4"
          >
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="name"
              placeholder="First name"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="last_name"
              placeholder="Last name"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="email"
              placeholder="example@gmail.com"
            />
            <trusty-field
              class="w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              type="tel"
              v-model="phone"
              placeholder="44 44 44 44"
            />
          </div>
          <label
            v-if="authStore?.isAuthenticated == false"
            class="relative my-[28px] flex gap-4 justify-center xl:items-center items-start w-full cursor-pointer"
          >
            <input type="checkbox" value="" class="peer sr-only" true-value="1" false-value="0" />
            <div
              class="bg-grey-light-1 peer-checked:bg-main peer h-6 w-[39px] min-w-[3.5rem] rounded-full after:absolute after:left-[2px] after:top-[2px] md:after:left-[4px] md:after:top-[4px] xl:after:top-[13px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-[160%] peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 md:h-[31px] md:w-[56px] md:after:h-[24px] md:after:w-[24px] md:peer-checked:after:translate-x-[100%]"
            ></div>
            <span class="account_toggler_text text-grey-light-6"
              >Create Personal Account After Payment, it will facilitate you a lot if you book other
              services, and it requires no further data entry, only 1 click! Please
              <a href="" class="underline text-white">Login</a> if you already have an account</span
            >
          </label>
          <div id="payment-element">
            <!--Stripe.js injects the Payment Element-->
          </div>
          <!-- <p v-if="noteError" class="ml-1 mt-2 inline-block text-sm font-extralight text-[#df1b41]">
          {{ noteError }}
        </p> -->

          <div
            class="next_step_button_wrapper mt-[40px] flex xl:h-[4rem] mt-[30px] gap-6 justify-center item-center xl:flex-row flex-col"
          >
            <textarea
              ref="textarea"
              maxlength="230"
              class="input text-[0.875rem] md:text-[1.125rem] ym-record-keys mb-0 w-full resize-none overflow-hidden h-[4rem] p-5 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem]"
              rows="1"
              v-model="note"
              placeholder="Here you can leave any notes…"
            ></textarea>
            <trusty-button
              class="btn w-full xl:w-1/4 btn-primary"
              id="submit"
              data-testid="paymentPage-submit"
              @click="createOrder"
            >
              Pay now
            </trusty-button>
          </div>
          <p id="payment-message" class="payment_timer_text hidden"></p>
        </div>
      </div>
      <div
        class="inline-flex gap-1 flex-wrap xl:text-[1.125rem] text-[0.75rem] pt-8 justify-center items-center text-grey-light-6"
      >
        <span>This offer will expire within the next </span>
        <Timer class="text-white" v-if="stripe" :minutes="4" :seconds="30" @e="" />
        <span>after which the price might be different</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import { ref, onMounted } from 'vue';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import Timer from '@/components/payment/Timer.vue';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';
import { Tour } from '@/types/tours';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import { useRuntimeConfig } from 'nuxt/app';
import axios from 'axios';

const { name, last_name, email, phone, note }: any = ref<any>('');

const config = useRuntimeConfig();

const toursStore = useToursStore();
const { customTour } = storeToRefs(toursStore);
const tourData = ref<Tour | null>(null);
const authStore = useAuthStore();
const authToken = ref<string | null>(authStore.token || null);

const handleTours = async () => {
  return await toursStore.getTourById(customTour.value?.tour_id || 1);
};
const fetchTourData = async () => {
  try {
    tourData.value = await handleTours();
    console.log('tourData', tourData.value);
  } catch (error) {
    console.log('Error fetching tour data:', error);
  }
};

const stripe: any = ref<Stripe | null>(null);
const elements: any = ref<StripeElements | null>(null);
console.log('customTour', customTour.value);
onMounted(async () => {
  fetchTourData();
  stripe.value = await loadStripe(`${config.public.stripeKey}`);
  if (stripe.value) {
    const appearanceModes = {
      light: {
        rules: {
          '.Input': {
            color: '#2B2D32',
            border: '1px solid #FFFFFF4A',
            borderRadius: '53px',
            padding: '22px 20px',
            backgroundColor: '#313131 !important',
          },
          '.Input::placeholder': {
            color: '#878787',
          },
          '.Input:hover': {
            border: 'inputHover.value',
          },
          '.Input:active': {
            border: 'inputActive.value',
          },
          '.Input:focus': {
            boxShadow: 'none',
            borderColor: 'black',
          },
          '.Label': {
            opacity: '0',
            visibility: 'hidden',
            width: '0',
            height: '0',
            display: 'none !important',
          },
          '.Input--invalid': {
            boxShadow: 'none',
            color: '#FA4141',
            borderColor: '#FA4141',
          },
          '.p-FieldError': {
            color: '#FA4141',
          },

          // See all supported class names and selector syntax below
        },
      },
      dark: {
        rules: {
          '.Input': {
            color: '#FFFFFF99',
            border: '1px solid #FFFFFF4A',
            borderRadius: '1rem',
            padding: '22px 20px',
            backgroundColor: '#313131',
          },
          '.Input::placeholder': {
            color: '#FFFFFF4A',
          },
          '.Input:hover': {
            border: 'inputHover.value',
          },
          '.Input:active': {
            border: 'inputActive.value',
          },
          '.Input:focus': {
            boxShadow: 'none',
            borderColor: 'black',
          },
          '.Label': {
            opacity: '0',
            visibility: 'hidden',
            width: '0',
            height: '0',
            display: 'none !important',
          },
          '.Input--invalid': {
            boxShadow: 'none',
            color: '#FA4141',
            borderColor: '#FA4141',
          },

          // See all supported class names and selector syntax below
        },
      },
    };
    elements.value = stripe.value.elements({
      clientSecret: 'pi_3R19TDDQ1dOHvCP327uabfWf_secret_u0rjXh9kcJ0nNLtsKdsaJ68EL',
      appearance: appearanceModes['dark'],
    });
    const paymentElement = elements.value.create('payment', {
      fields: { billingDetails: { name: 'auto' } },
    });
    paymentElement.mount('#payment-element');
    console.log(elements.value);
    const { paymentIntent, error } = await stripe.value.confirmPayment(elements);
    if (error) {
      // Display error.message in your UI.
    } else {
      console.log(paymentIntent);
      // The payment has succeeded
      // Display a success message
    }
  }
});
function createOrder() {
  if (authStore.isAuthenticated == false) {
    axios
      .post(
        `${config.public.apiUrl}/orders/guest/order/store`,
        {
          assembled_tours: {
            tour_id: customTour.value?.tour_id,
            date: customTour.value?.date,
            participants: customTour.value?.participants,
            total_duration: customTour.value?.total_duration,
            total_price: customTour.value?.total_price,
          },
          addons: [customTour.value?.total_price],
          order: {
            total_sum: customTour.value?.total_price,
            description: tourData.value?.description,
            source: 'architecto',
          },
          user: {
            name: name.value,
            last_name: last_name.value,
            email: email.value,
            phone: phone.value,
            country: 'architecto',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then(function (response) {
        console.log('success', response);
        return response;
      })
      .catch(function (error) {
        console.log('error', error);
        return error;
      });
  } else {
    axios
      .post(
        `${config.public.apiUrl}/orders/auth/order/store`,
        {
          assembled_tours: {
            tour_id: customTour.value?.tour_id,
            date: customTour.value?.date,
            participants: customTour.value?.participants,
            total_duration: customTour.value?.total_duration,
            total_price: customTour.value?.total_price,
          },
          addons: customTour.value?.addons.map((addon) => addon?.id),
          order: {
            total_sum: customTour.value?.total_price,
            description: tourData.value?.description,
            source: 'architecto',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.value}`,
          },
        }
      )
      .then(function (response) {
        console.log('success', response);
        return response;
      })
      .catch(function (error) {
        console.log('error', error);

        return error;
      });
  }
}
</script>
