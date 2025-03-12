<template>
  <div class="flex flex-row justify-between items-center w-full py-6 px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 p-8 rounded-[1rem]">
      <div class="flex w-full">
        <h1 class="font-normal text-[2.5rem] leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[3rem] leading-[110%]">1 100 EUR</span>
      </div>
      <hr class="my-8 border-under-line" />
      <div class="w-full flex flex-col gap-8">
        <div
          v-for="pay in payment"
          class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29"
        >
          <div class="w-full flex flex-row gap-8">
            <NuxtImg
              :src="pay.img"
              alt="Payment icon"
              class="overflow-hidden rounded-[1rem] min-w-[17.813rem] h-[16.313rem] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">Tour Chianti</h2>
              <div class="flex flex-row gap-[3.75rem] font-normal text-[1.125rem]">
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="pb-8">{{ pay.area }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="pb-8">{{ pay.date }}</li>
                  <li class="text-grey-light-4">Number of participants::</li>
                  <li>{{ pay.participants_number }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration::</li>
                  <li class="pb-8">{{ pay.total_duration }} Hours</li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="pb-8">{{ pay.total_price }} Eur</li>
                  <li class="text-grey-light-4">Transportation::</li>
                  <li>{{ pay.transportation }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">List of services:</li>
                  <li v-for="service in pay.services">{{ service.title }}</li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="my-8 border-grey-light-29 rounded-full" />
          <!-- accardion show more -->
          <TrustyAccordion :title="'Show details'">
            <div
              v-for="service in pay.services"
              class="flex flex-col w-full gap-6 mt-8 p-[1.125rem] bg-grey-dark rounded-[1rem]"
            >
              <div class="flex flex-row gap-4">
                <NuxtImg
                  :src="service.img"
                  alt="Payment icon"
                  class="overflow-hidden rounded-[1rem] min-w-[19.063rem] h-[7.563rem] object-cover"
                />
                <div class="flex flex-col gap-[0.625rem]">
                  <h3 class="font-normal leading-[1.875rem] text-[1.25rem]">{{ service.title }}</h3>
                  <span class="text-grey-light-6 text-[0.75rem] font-normal leading-[140%]">{{
                    service.description
                  }}</span>
                </div>
                <TrustyButton
                  class="min-w-[12.563rem] h-[3.688rem] self-center md:ml-[2.563rem]"
                  type="black"
                  >{{ service.price }} EUR</TrustyButton
                >
              </div>
            </div>
          </TrustyAccordion>
        </div>
      </div>
      <hr class="my-8 border-under-line" />
      <div>
        <form id="payment-form" class="payment_form form mt-[-38px]">
          <div id="payment-element">
            <!--Stripe.js injects the Payment Element-->
          </div>
          <label class="relative mt-[28px] inline-flex w-full cursor-pointer items-start">
            <input type="checkbox" value="" class="peer sr-only" true-value="1" false-value="0" />
            <div
              class="bg-toggler_gray peer-checked:bg-main peer h-6 w-[39px] min-w-[39px] rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-[80%] peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 md:h-[31px] md:w-[51px] md:after:h-[27px] md:after:w-[27px] md:peer-checked:after:translate-x-[70%]"
            ></div>
            <span class="account_toggler_text"
              >Create Personal Account After Payment, it will facilitate you a lot if you book other
              services, and it requires no further data entry, only 1 click!</span
            >
          </label>
          <textarea
            ref="textarea"
            maxlength="230"
            class="input ym-record-keys mb-0 mt-[30px] w-full resize-none overflow-hidden"
            rows="1"
            placeholder="Here you can leave any notes…"
          ></textarea>
          <!-- <p v-if="noteError" class="ml-1 mt-2 inline-block text-sm font-extralight text-[#df1b41]">
          {{ noteError }}
        </p> -->

          <div class="next_step_button_wrapper mt-[40px]">
            <button class="btn btn-primary" id="submit" data-testid="paymentPage-submit">
              Pay now
            </button>
          </div>
          <p id="payment-message" class="payment_timer_text hidden"></p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { ref, onMounted } from 'vue';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
onMounted(async () => {
  stripe.value = await loadStripe(
    'pk_test_51HDUQDDQ1dOHvCP3TE1SQo4k3Xf5QA6e8BK5Y0DOwVguJY2wjfzNyKRSqieKgvjVt1al29dF1jArAyJjohwl2UBn00iVae0ns4'
  );
  if (stripe.value) {
    const appearanceModes = {
      light: {
        rules: {
          '.Input': {
            color: '#2B2D32',
            border: '1px solid #878787',
            borderRadius: '53px',
            padding: '22px 20px',
            backgroundColor: '#E8EDE880',
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
            color: '#FFFFFF',
            border: '1px solid #3D4043',
            borderRadius: '53px',
            padding: '22px 20px',
            backgroundColor: '#2B2D32',
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
  }
});
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
