<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]" v-if="!errorMessage">
      <div class="flex w-full">
        <h1 class="max-w-[16.563rem] font-normal text-[2.5rem] leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[2.125rem] md:text-[3rem] leading-[110%]"
        >{{ formatPrice(totalPrice) }} EUR</span
        >
      </div>
      <hr class="my-8 border-under-line" />
      <div class="w-full flex flex-col gap-8">
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="tourData?.media?.[0] || ''"
              alt="Tour image"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ tourData?.name || 'Tour' }}
              </h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="md:pb-8 pb-6">{{ tourData?.area?.name || 'N/A' }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="md:pb-8 pb-6">
                    {{ customTour?.date ? formatDate(customTour.date) : 'N/A' }}
                  </li>
                  <li class="text-grey-light-4">Number of participants:</li>
                  <li>{{ customTour?.participants || 0 }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration:</li>
                  <li class="md:pb-8 pb-6">
                    {{ formatDuration((customTour?.total_duration || 0) / 60) }}
                  </li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ formatPrice(totalPrice) }} EUR</li>
                  <li class="text-grey-light-4">Transportation:</li>
                  <li>{{ transportationName || 'N/A' }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">List of services:</li>
                  <li v-for="(addon, index) in customTour?.addons" :key="index">
                    {{ addon.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr class="my-8 border-grey-light-29 rounded-full" />
          <!-- accordion show more -->
          <TrustyAccordion :title="'Show details'">
            <div
              v-for="(addon, index) in customTour?.addons"
              :key="index"
              class="flex flex-col w-full gap-6 mt-8 p-[1.125rem] bg-grey-dark rounded-[1rem]"
            >
              <div class="flex xl:flex-row flex-col gap-4">
                <NuxtImg
                  :src="addon.media?.[0] || ''"
                  alt="Addon image"
                  class="overflow-hidden rounded-[1rem] xl:min-w-[19.063rem] h-[7.563rem] object-cover"
                />
                <div class="flex flex-col gap-[0.625rem]">
                  <h3 class="font-normal leading-[1.875rem] text-[1.25rem]">{{ addon.name }}</h3>
                  <span class="text-grey-light-6 text-[0.75rem] font-normal leading-[140%]">{{
                      addon.description
                    }}</span>
                </div>
                <TrustyButton
                  class="min-w-[12.563rem] h-[3.688rem] md:!text-[1.625rem] max-xl:w-full self-center xl:ml-[2.563rem] items-center"
                  type="black"
                  color="black"
                >{{ formatPrice(getAddonPrice(addon)) }} EUR</TrustyButton
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
          @submit.prevent="handleSubmit"
        >
          <div
            v-if="!isAuthenticated"
            class="flex xl:flex-row flex-col w-full gap-4"
            :class="{ 'opacity-70 pointer-events-none': isRequesting }"
          >
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="form.name"
              placeholder="First name"
              :error="validationErrors.name"
              @update:modelValue="clearFieldError('name')"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="form.last_name"
              placeholder="Last name"
              :error="validationErrors.last_name"
              @update:modelValue="clearFieldError('last_name')"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="form.email"
              placeholder="example@gmail.com"
              :error="validationErrors.email"
              @update:modelValue="clearFieldError('email')"
            />
            <trusty-field
              class="w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              type="tel"
              v-model="form.phone"
              placeholder="44 44 44 44"
              :error="validationErrors.phone"
              @country-changed="onCountryChanged"
              @update:modelValue="clearFieldError('phone')"
            />
          </div>

          <label
            v-if="!isAuthenticated"
            class="relative my-[28px] flex gap-4 justify-center xl:items-center items-start w-full cursor-pointer"
            :class="{ 'opacity-70 pointer-events-none': isRequesting }"
          >
            <input
              type="checkbox"
              v-model="form.createAccount"
              class="peer sr-only"
            />
            <div
              class="bg-grey-light-1 peer-checked:bg-main peer h-6 w-[39px] min-w-[3.5rem] rounded-full after:absolute after:left-[2px] after:top-[2px] md:after:left-[4px] md:after:top-[4px] xl:after:top-[13px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-[160%] peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 md:h-[31px] md:w-[56px] md:after:h-[24px] md:after:w-[24px] md:peer-checked:after:translate-x-[100%]"
            ></div>
            <span class="account_toggler_text text-grey-light-6"
            >Create Personal Account After Payment, it will facilitate you a lot if you book other
              services, and it requires no further data entry, only 1 click! Please
              <a href="/auth/sign-in" class="underline text-white">Login</a> if you already have an account</span
            >
          </label>

          <!-- Stripe Payment Element Container -->
          <div id="payment-element" class="mt-6" :class="{ 'opacity-70': isRequesting }">
            <!-- Stripe.js injects the Payment Element here -->
          </div>

          <!-- Validation Error Message -->
          <p v-if="paymentError" class="mt-2 text-sm text-red-500">
            {{ paymentError }}
          </p>

          <div
            class="next_step_button_wrapper mt-[40px] flex xl:h-[4rem] gap-6 justify-center item-center xl:flex-row flex-col"
            :class="{ 'opacity-70 pointer-events-none': isRequesting || !paymentMounted }"
          >
            <textarea
              ref="textarea"
              maxlength="230"
              class="input text-[0.875rem] md:text-[1.125rem] ym-record-keys mb-0 w-full resize-none overflow-hidden h-[4rem] p-5 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem]"
              rows="1"
              v-model="form.note"
              placeholder="Here you can leave any notes…"
              :disabled="isRequesting"
            ></textarea>
            <trusty-button
              class="btn w-full xl:w-1/4 btn-primary items-center"
              id="submit"
              type="submit"
              :disabled="isRequesting || !paymentMounted"
            >
              <div v-if="isRequesting" class="flex items-center justify-center">
                <PreloaderAnimIcon class="size-5 mr-2" theme="black" />
                <span>Processing...</span>
              </div>
              <span v-else>Pay now</span>
            </trusty-button>
          </div>
        </form>
      </div>

      <div class="inline-flex gap-1 flex-wrap xl:text-[1.125rem] text-[0.75rem] pt-8 justify-center items-center text-grey-light-6">
        <span>This offer will expire within the next </span>
        <Timer class="text-white" :minutes="4" :seconds="30" @time-up="handleTimerExpired" />
        <span>after which the price might be different</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem] items-center text-center">
      <h1 class="text-[2.5rem] font-normal mb-6">Unable to Process Payment</h1>
      <p class="text-grey-light-6 text-[1.125rem] mb-8">{{ errorMessage }}</p>
      <trusty-button @click="router.push('/tours')" class="items-center">
        Return to Tours
      </trusty-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { ref, reactive, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe, Stripe, StripeElements, StripeElementChangeEvent } from '@stripe/stripe-js';
import Timer from '@/components/payment/Timer.vue';
import { useToursStore } from '@/store/toursStore';
import { storeToRefs } from 'pinia';
import { Addon, Tour } from '@/types/tours';
import { useAuthStore } from '@/store/authStore';
import dayjs from 'dayjs';
import { useRuntimeConfig } from 'nuxt/app';
import axios from 'axios';
import * as yup from 'yup';
import { VueTelInputCountryObject } from '@/types/type';

const router = useRouter();
const config = useRuntimeConfig();
const toursStore = useToursStore();
const authStore = useAuthStore();

// Store references
const { customTour } = storeToRefs(toursStore);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const authToken = computed(() => authStore.token);

// Page state
const tourData = ref<Tour | null>(null);
const errorMessage = ref<string | null>(null);
const isRequesting = ref(false);
const paymentError = ref<string | null>(null);
const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const paymentMounted = ref(false);
const totalPrice = computed(() => customTour.value?.total_price || 0);
const transportationName = computed(() => {
  const transport = customTour.value?.addons.find(addon =>
    addon.segmentType?.toLowerCase() === 'transportation'
  );
  return transport?.name || 'Not selected';
});

// Form state
const form = reactive({
  name: '',
  last_name: '',
  email: '',
  phone: '',
  country_code: '39', // Default to Italy
  note: '',
  createAccount: true
});

const validationErrors = reactive({
  name: false,
  last_name: false,
  email: false,
  phone: false
});

// Form validation schema
const guestValidationSchema = yup.object({
  name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country_code: yup.string()
});

// Helper functions
const formatPrice = (price: number): string => {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

const formatDuration = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours > 0 && minutes > 0) {
    return `${wholeHours} Hour${wholeHours !== 1 ? 's' : ''} ${minutes} Min`;
  } else if (wholeHours > 0) {
    return `${wholeHours} Hour${wholeHours !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} Min`;
  }
};

const getAddonPrice = (addon: Addon): number => {
  if (!addon || !addon.price || !Array.isArray(addon.price)) return 0;

  const participants = customTour.value?.participants || 1;
  const priceIndex = Math.min(participants - 1, addon.price.length - 1);

  return addon.price[priceIndex] || 0;
};

const onCountryChanged = (country: VueTelInputCountryObject) => {
  form.country_code = country.dialCode;
};

const clearFieldError = (field: string) => {
  if (field in validationErrors) {
    //@ts-ignore
    validationErrors[field] = false;
  }
  paymentError.value = null;
};

const validateForm = async (): Promise<boolean> => {
  // If authenticated, skip form validation
  if (isAuthenticated.value) return true;

  try {
    await guestValidationSchema.validate(form, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(error => {
        if (error.path && error.path in validationErrors) {
          //@ts-ignore
          validationErrors[error.path] = true;
        }
      });
      paymentError.value = err.inner[0]?.message || 'Please check the form for errors';
    } else {
      paymentError.value = 'An error occurred while validating the form';
    }
    return false;
  }
};

// API calls
const fetchTourData = async () => {
  if (!customTour.value?.tour_id) {
    errorMessage.value = 'No tour selected. Please return to the tours page and select a tour.';
    return;
  }

  try {
    tourData.value = await toursStore.getTourById(customTour.value.tour_id);
  } catch (error) {
    console.error('Error fetching tour data:', error);
    errorMessage.value = 'Could not load tour information. Please try again later.';
  }
};

// Payment handling
const initStripe = async (paymentSecret: string) => {
  try {
    // Load Stripe
    //@ts-ignore
    const stripeInstance = await loadStripe(config.public.stripeKey);
    if (!stripeInstance) {
      throw new Error('Failed to load Stripe');
    }

    stripe.value = stripeInstance;

    // Initialize Stripe Elements
    const appearance = {
      theme: 'night',
      variables: {
        colorPrimary: '#FFFFFF',
        colorBackground: '#313131',
        colorText: '#FFFFFF99',
        colorDanger: '#FA4141',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '16px'
      },
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
        '.Input:focus': {
          boxShadow: 'none',
          borderColor: '#FFFFFF',
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
        '.Error': {
          color: '#FA4141',
        }
      }
    };

    elements.value = stripe.value.elements({
      clientSecret: paymentSecret,
      //@ts-ignore
      appearance
    });

    // Create and mount the Payment Element
    const paymentElement = elements.value.create('payment');

    // Wait for element to be ready to mount
    await new Promise(resolve => setTimeout(resolve, 100));

    const paymentElementContainer = document.getElementById('payment-element');
    if (!paymentElementContainer) {
      throw new Error('Payment element container not found');
    }

    paymentElement.mount('#payment-element');

    // Listen for element changes
    //@ts-ignore
    paymentElement.on('change', (event: StripeElementChangeEvent) => {
      paymentMounted.value = event.complete;
    });

    // Add form submit handler
    document.getElementById('payment-form')?.addEventListener('submit', handleSubmit);

  } catch (error) {
    console.error('Error initializing Stripe:', error);
    errorMessage.value = 'Payment system is currently unavailable. Please try again later.';
  }
};

const createOrder = async (): Promise<{ orderId: number, paymentSecret: string } | null> => {
  isRequesting.value = true;

  try {
    let response;

    // Different endpoints for authenticated vs guest users
    if (isAuthenticated.value) {
      response = await axios.post(
        `${config.public.apiUrl}/orders/auth/order/store`,
        {
          assembled_tours: {
            tour_id: customTour.value?.tour_id,
            date: customTour.value?.date ? dayjs(customTour.value.date).format('YYYY-MM-DD HH:mm:ss') : null,
            participants: customTour.value?.participants,
            total_duration: customTour.value?.total_duration,
            total_price: customTour.value?.total_price,
          },
          addons: customTour.value?.addons.map(addon => addon.id),
          order: {
            total_sum: customTour.value?.total_price,
            description: tourData.value?.description || '',
            note: form.note
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${authToken.value}`
          }
        }
      );
    } else {
      response = await axios.post(
        `${config.public.apiUrl}/orders/guest/order/store`,
        {
          assembled_tours: {
            tour_id: customTour.value?.tour_id,
            date: customTour.value?.date ? dayjs(customTour.value.date).format('YYYY-MM-DD HH:mm:ss') : null,
            participants: customTour.value?.participants,
            total_duration: customTour.value?.total_duration,
            total_price: customTour.value?.total_price,
          },
          addons: customTour.value?.addons.map(addon => addon.id),
          order: {
            total_sum: customTour.value?.total_price,
            description: tourData.value?.description || '',
            note: form.note
          },
          user: {
            name: form.name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
            country: form.country_code,
            create_account: form.createAccount ? 1 : 0
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      );
    }

    if (response.data.status === 'success') {
      return {
        orderId: response.data.data.order.id,
        paymentSecret: response.data.data.payment.client_secret
      };
    } else if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to create order');
    }

    return null;
  } catch (error) {
    console.error('Error creating order:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 410) {
        errorMessage.value = 'This order has already been paid.';
      } else if (error.response?.status === 422) {
        paymentError.value = 'Please check your information and try again.';
      } else {
        paymentError.value = error.response?.data?.message || 'An error occurred while creating your order.';
      }
    } else {
      paymentError.value = 'An unexpected error occurred. Please try again later.';
    }

    return null;
  } finally {
    isRequesting.value = false;
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  // Validate the form first (for guest users)
  if (!await validateForm()) {
    return;
  }

  // Save user data to localStorage BEFORE initiating payment
  // (this ensures data is saved before Stripe redirects)
  if (!isAuthenticated.value && form.createAccount) {
    try {
      localStorage.setItem('newUserData', JSON.stringify({
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        country_code: form.country_code
      }));
      console.log('User data saved to localStorage');
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  }

  isRequesting.value = true;
  paymentError.value = null;

  try {
    if (!stripe.value || !elements.value) {
      throw new Error('Payment system is not initialized');
    }

    // Create the order and get payment intent
    const orderData = await createOrder();
    if (!orderData) {
      throw new Error('Failed to create order');
    }

    // Extract payment intent ID from the secret (for the return URL)
    const paymentIntentId = orderData.paymentSecret.includes('_secret_')
      ? orderData.paymentSecret.split('_secret_')[0]
      : orderData.paymentSecret;

    // Confirm the payment
    const { error } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${config.public.appUrl}/payment/success?order_id=${orderData.orderId}&payment_code=${paymentIntentId}`
      }
    });

    // If there's an error, Stripe.js will show payment element errors
    if (error) {
      // Only log and set message for non-UI errors
      if (error.type !== 'validation_error') {
        console.error('Stripe payment error:', error);
        paymentError.value = error.message || 'Payment failed. Please try again.';
      }
    }
  } catch (error:any) {
    console.error('Payment submission error:', error);
    paymentError.value = error.message || 'An unexpected error occurred. Please try again.';
  } finally {
    isRequesting.value = false;
  }
};

const handleTimerExpired = () => {
  errorMessage.value = 'The payment session has expired. Please return to the tour page and try again.';
  // Clear any sensitive data
  if (elements.value) {
    elements.value = null;
  }
};

// Initialization
const setupPayment = async () => {
  if (!customTour.value) {
    errorMessage.value = 'No tour selected. Please select a tour first.';
    return;
  }

  isRequesting.value = true;

  try {
    // First fetch tour data
    await fetchTourData();

    // Don't proceed if there was an error
    if (errorMessage.value) return;

    // Create a temporary order to get the payment intent
    const orderData = await createOrder();

    if (orderData) {
      // Initialize Stripe with payment intent
      await initStripe(orderData.paymentSecret);
    } else {
      // Handle case where order creation failed
      errorMessage.value = 'Unable to initialize payment. Please try again later.';
    }
  } finally {
    isRequesting.value = false;
  }
};

// Lifecycle hooks
onBeforeMount(() => {
  // Redirect if no tour data
  if (!customTour.value?.tour_id) {
    router.push('/tours');
  }
});

onMounted(() => {
  setupPayment();
});

onBeforeUnmount(() => {
  // Cleanup any event listeners
  document.getElementById('payment-form')?.removeEventListener('submit', handleSubmit);
});
</script>

<style>
.field-input {
  height: 4rem;
}
</style>