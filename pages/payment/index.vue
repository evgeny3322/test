<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex flex-wrap w-full">
        <h1 class="font-normal text-23 md:text-40 leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[2.125rem] md:text-[3rem] leading-[110%]"
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
                  class="min-w-[12.563rem] h-[3.688rem] md:!text-[1.625rem] max-xl:w-full self-center xl:ml-[2.563rem] items-center"
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
        <form
          id="payment-form"
          class="payment_form form mt-[-38px] bg-grey-dark p-[1.125rem] rounded-[1rem]"
        >
          <input type="hidden" name="stripeToken" id="stripe-token-id" />
          <div v-if="!authStore?.isAuthenticated" class="flex xl:flex-row flex-col w-full gap-4">
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
            <trusty-field
              class="w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              type="tel"
              v-model="formData.phone"
              @country-changed="handleCountryChanged"
              placeholder="44 44 44 44"
            />
          </div>
          <label
            v-if="!authStore?.isAuthenticated"
            class="relative my-[28px] flex gap-4 justify-center xl:items-center items-start w-full cursor-pointer"
          >
            <input v-model="createAccount" type="checkbox" value="" class="peer sr-only" />
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
          <!--          -->
          <!--          <p v-if="validationError" class="ml-1 mt-2 inline-block text-sm font-extralight text-[#df1b41]">-->
          <!--            {{ validationError }}-->
          <!--          </p>-->
          <div
            class="next_step_button_wrapper mt-[40px] flex xl:h-[4rem] mt-[30px] gap-6 justify-center item-center xl:flex-row flex-col"
          >
            <textarea
              ref="textarea"
              maxlength="230"
              class="input text-[0.875rem] md:text-[1.125rem] ym-record-keys mb-0 w-full resize-none overflow-hidden h-[4rem] p-5 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem]"
              rows="1"
              v-model="formData.notes"
              placeholder="Here you can leave any notes…"
            ></textarea>
            <trusty-button
              class="btn w-full xl:w-1/4 btn-primary items-center"
              id="submit"
              type="submit"
              data-testid="paymentPage-submit"
            >
              Pay now
            </trusty-button>
          </div>
        </form>
      </div>
      <div
        class="inline-flex gap-1 flex-wrap xl:text-[1.125rem] text-[0.75rem] pt-8 justify-center items-center text-grey-light-6"
      >
        <span>This offer will expire within the next </span>
        <Timer
          v-if="stripe"
          class="text-white"
          :minutes="4"
          :seconds="30"
          @time-up="showTimerExpiredModal = true"
        />
        <span>after which the price might be different</span>
      </div>
    </div>
  </div>

  <TrustyModal
    v-model="showTimerExpiredModal"
    :show-close-button="false"
    :show-default-footer="true"
    :close-on-backdrop="true"
    action-button-text="OK"
    @confirm="router.push('/')"
    @close="router.push('/')"
  >
    <template #header>
      <h2 class="text-[40px] font-bold text-center text-white">Payment timer expired!</h2>
    </template>
  </TrustyModal>
</template>
<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import { ref, onBeforeMount, onMounted, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe, Stripe, StripeElements, StripeElementChangeEvent } from '@stripe/stripe-js';
import Timer from '@/components/payment/Timer.vue';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';
import { Tour } from '@/types/tours';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import { useRuntimeConfig, navigateTo } from 'nuxt/app';
import axios from 'axios';
import TrustyModal from '@/components/ui/TrustyModal.vue';

const router = useRouter();
// const mainStore = useMainStore()

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dialCode: '',
  iso2: '',
  country: '',
  notes: '',
});

const createAccount = ref<boolean>(false);

const handleCountryChanged = (event: any) => {
  formData.country = event.name;
  formData.dialCode = event.dialCode;
  formData.iso2 = event.iso2;
};

const showTimerExpiredModal = ref<boolean>(false);

const config = useRuntimeConfig();

const toursStore = useToursStore();
const { customTour }: any = storeToRefs(toursStore);
const tourData = ref<Tour | null>(null);
const authStore = useAuthStore();
const authToken = ref<string | null>(authStore.token || null);

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

const stripe: any = ref<Stripe | null>(null);
const elements: any = ref<StripeElements | null>(null);

// const validationError = ref(false)

const paymentMount = ref(false);

const payment_button_color = [
  '!pointer-events-none',
  '!bg-gray-400',
  '!border-gray-800',
  '!cursor-not-allowed',
];

async function initPayment(responseData: any) {
  // eslint-disable-next-line
  stripe.value = await loadStripe(`${config.public.stripeKey}`);
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
        '.p-FieldError': {
          color: '#FA4141',
        },
      },
    },
  };

  await initialize(responseData);

  async function waitForElement(selector: string) {
    while (!document.querySelector(selector)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async function setupForm() {
    await waitForElement('#payment-form');

    document
      .querySelector<HTMLFormElement>('#payment-form')
      ?.addEventListener('submit', handleSubmit);
  }

  await setupForm();

  // Fetches a payment intent and captures the client secret
  async function initialize(responseData: any) {
    elements.value = stripe.value.elements({
      clientSecret: responseData.payment.client_secret,
      appearance: appearanceModes['dark'],
    });
    const paymentElement = elements.value.create('payment');
    await waitForElement('#payment-element');
    paymentElement.mount('#payment-element');

    paymentElement.on('change', async function (event: StripeElementChangeEvent) {
      paymentMount.value = true;

      await nextTick();

      const submitButton = document.querySelector('#submit');
      const buttonWrapper = document.querySelector('.next_step_button_wrapper');

      if (submitButton && buttonWrapper)
        submitButton.classList[event.complete ? 'remove' : 'add'](...payment_button_color);
    });
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    //TODO Validate form here using yup

    async function confirm() {
      const formQueryParams = new URLSearchParams({ ...formData }).toString();

      const { error, paymentIntent } = await stripe.value.confirmPayment({
        elements: elements.value,
        redirect: 'if_required',
      });

      const redirectTo = (status: 'success' | 'failure') => {
        navigateTo(
          `/payment/${status}?order_id=${responseData.order.id}&payment_code=${responseData.payment.id}&${formQueryParams}&createAccount=${createAccount.value}`
        );
      };

      if (error) {
        redirectTo('failure');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        redirectTo('success');
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        const { error: actionError, paymentIntent: updatedPaymentIntent } =
          await stripe.value.handleCardAction(paymentIntent.client_secret);

        if (actionError) {
          redirectTo('failure');
        } else if (updatedPaymentIntent.status === 'succeeded') {
          redirectTo('success');
        }
      }
    }

    await confirm();
  }
}
onBeforeMount(async () => {
  await fetchTourData();

  // orderData.value.countdown = null
  axios
    .post(
      `${config.public.apiUrl}/orders/${authStore.isAuthenticated ? 'auth' : 'guest'}/order/store`,
      {
        assembled_tours: {
          tour_id: customTour.value?.tour_id,
          date: customTour.value?.date.slice(0, 19),
          participants: customTour.value?.participants,
          total_duration: customTour.value?.total_duration,
          total_price: customTour.value?.total_price,
        },
        addons: customTour.value?.addons.map((addon: any) => addon?.id),
        order: {
          total_sum: customTour.value?.total_price,
          description: tourData.value?.description,
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
      if (response.data.status === 'success') {
        initPayment(response.data.data);
      }
    });
});
// Timer 5 min
// let now = new Date()
// let countdown = new Date(now.getTime() + 5 * 60000)
// storage.setItem('countdown', countdown, 'session')

onMounted(() => {
  // paymentVisited.value = true
  //
  // let now = new Date()
  // let countdown = new Date(now.getTime() + 5 * 60000)
  // storage.setItem('countdown', countdown, 'session')
});
</script>
