<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <!-- Payment Header -->
      <div class="flex flex-wrap w-full">
        <h1 class="font-normal text-23 md:text-40 leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[2.125rem] md:text-[3rem] leading-[110%]">
          {{ customTour?.total_price }} EUR
        </span>
      </div>
      <hr class="my-8 border-under-line" />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
        <PreloaderAnimIcon class="size-12" theme="white" />
        <p class="mt-4 text-16 text-grey-light-7">Preparing your payment...</p>
      </div>

      <!-- Payment Content -->
      <div v-else class="w-full flex flex-col gap-8">
        <!-- Tour Summary -->
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <!-- Tour Image -->
            <NuxtImg
              :src="tourData?.media?.[0]"
              alt="Tour image"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] xl:h-auto xl:w-[38.7%] object-cover"
            />

            <!-- Tour Details -->
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ tourData?.name }}
              </h2>
              <div class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]">
                <!-- Column 1 -->
                <ul>
                  <li class="text-grey-light-4 mb-1">Area:</li>
                  <li class="md:pb-8 pb-6">{{ tourData?.area?.name }}</li>
                  <li class="text-grey-light-4 mb-1">Date:</li>
                  <li class="md:pb-8 pb-6">
                    {{ formatDate(customTour?.date) }}
                  </li>
                  <li class="text-grey-light-4 mb-1">Number of participants:</li>
                  <li>{{ customTour?.participants }} {{ customTour?.participants === 1 ? 'Person' : 'People' }}</li>
                </ul>

                <!-- Column 2 -->
                <ul>
                  <li class="text-grey-light-4 mb-1">Total duration:</li>
                  <li class="md:pb-8 pb-6">{{ formatDuration(customTour?.total_duration) }}</li>
                  <li class="text-grey-light-4 mb-1">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ customTour?.total_price }} EUR</li>
                  <li class="text-grey-light-4 mb-1">Price per person:</li>
                  <li>{{ calculatePricePerPerson() }} EUR</li>
                </ul>

                <!-- Column 3 -->
                <ul>
                  <li class="text-grey-light-4 mb-1">List of services:</li>
                  <li v-for="service in customTour?.addons" :key="service.id">{{ service.name }}</li>
                </ul>
              </div>
            </div>
          </div>

          <hr class="my-8 border-grey-light-29 rounded-full" />

          <!-- Accordion for service details -->
          <TrustyAccordion :title="'Show details'">
            <div
              v-for="service in customTour?.addons"
              :key="service.id"
              class="flex flex-col w-full gap-6 mt-8 p-[1.125rem] bg-grey-dark rounded-[1rem]"
            >
              <div class="flex xl:flex-row flex-col gap-4">
                <NuxtImg
                  :src="service.media[0]"
                  alt="Service image"
                  class="overflow-hidden rounded-[1rem] xl:min-w-[19.063rem] h-[7.563rem] object-cover"
                />
                <div class="flex flex-col gap-[0.625rem]">
                  <h3 class="font-normal leading-[1.875rem] text-[1.25rem]">{{ service.name }}</h3>
                  <span class="text-grey-light-6 text-[0.75rem] font-normal leading-[140%]">
                    {{ service.description }}
                  </span>
                </div>
                <TrustyButton
                  class="min-w-[12.563rem] h-[3.688rem] md:!text-[1.625rem] max-xl:w-full self-center xl:ml-[2.563rem] items-center"
                  type="black"
                  color="black"
                >
                  {{ calculateServicePrice(service) }} EUR
                </TrustyButton>
              </div>
            </div>
          </TrustyAccordion>
        </div>
      </div>

      <hr class="my-8 border-under-line" />

      <!-- Payment Form -->
      <div>
        <form
          id="payment-form"
          class="payment_form form mt-[-38px] bg-grey-dark p-[1.125rem] rounded-[1rem]"
          @submit.prevent="handleSubmit"
        >
          <input type="hidden" name="stripeToken" id="stripe-token-id" />

          <!-- Guest User Form -->
          <div v-if="!isAuthenticated" class="flex xl:flex-row flex-col w-full gap-4">
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.firstName"
              placeholder="First name"
              :error="validationErrors.firstName"
              @update:modelValue="clearValidationError('firstName')"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.lastName"
              placeholder="Last name"
              :error="validationErrors.lastName"
              @update:modelValue="clearValidationError('lastName')"
            />
            <trusty-field
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              v-model="formData.email"
              placeholder="example@gmail.com"
              :error="validationErrors.email"
              @update:modelValue="clearValidationError('email')"
            />
            <trusty-field
              class="w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              type="tel"
              v-model="formData.phone"
              @country-changed="handleCountryChanged"
              placeholder="44 44 44 44"
              :error="validationErrors.phone"
              @update:modelValue="clearValidationError('phone')"
            />
          </div>

          <!-- Create Account Toggle for Guest Users -->
          <label
            v-if="!isAuthenticated"
            class="relative my-[28px] flex gap-4 justify-center xl:items-center items-start w-full cursor-pointer"
          >
            <input v-model="formData.createAccount" type="checkbox" class="peer sr-only" />
            <div
              class="bg-grey-light-1 peer-checked:bg-main peer h-6 w-[39px] min-w-[3.5rem] rounded-full after:absolute after:left-[2px] after:top-[2px] md:after:left-[4px] md:after:top-[4px] xl:after:top-[13px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-[160%] peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 md:h-[31px] md:w-[56px] md:after:h-[24px] md:after:w-[24px] md:peer-checked:after:translate-x-[100%]"
            ></div>
            <span class="account_toggler_text text-grey-light-6">
              Create Personal Account After Payment, it will facilitate you a lot if you book other services,
              and it requires no further data entry, only 1 click! Please
              <a href="/auth/sign-in" class="underline text-white">Login</a> if you already have an account
            </span>
          </label>

          <!-- Stripe Payment Element -->
          <div id="payment-element">
            <!-- Stripe.js injects the Payment Element here -->
          </div>

          <!-- Payment Error Message -->
          <div v-if="paymentError" class="mt-4 text-red-500 text-sm">
            {{ paymentError }}
          </div>

          <div class="next_step_button_wrapper mt-[40px] flex xl:h-[4rem] mt-[30px] gap-6 justify-center items-center xl:flex-row flex-col">
            <!-- Notes Textarea -->
            <textarea
              ref="textareaRef"
              maxlength="230"
              class="input text-[0.875rem] md:text-[1.125rem] ym-record-keys mb-0 w-full resize-none overflow-hidden h-[4rem] p-5 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem]"
              rows="1"
              v-model="formData.notes"
              placeholder="Here you can leave any notes…"
            ></textarea>

            <!-- Submit Button -->
            <trusty-button
              class="btn w-full xl:w-1/4 btn-primary items-center"
              id="submit"
              type="submit"
              data-testid="paymentPage-submit"
              :disabled="isProcessingPayment"
            >
              <div v-if="isProcessingPayment" class="flex items-center justify-center">
                <PreloaderAnimIcon class="size-5 mr-2" theme="black" />
                <span>Processing...</span>
              </div>
              <span v-else>Pay now</span>
            </trusty-button>
          </div>
        </form>
      </div>

      <!-- Payment Timer -->
      <div class="inline-flex gap-1 flex-wrap xl:text-[1.125rem] text-[0.75rem] pt-8 justify-center items-center text-grey-light-6">
        <span>This offer will expire within the next </span>
        <Timer
          v-if="stripe"
          class="text-white"
          :minutes="4"
          :seconds="30"
          @time-up="handleTimerExpired"
        />
        <span>after which the price might be different</span>
      </div>
    </div>
  </div>

  <!-- Timer Expired Modal -->
  <TrustyModal
    v-model="showTimerExpiredModal"
    :show-close-button="false"
    :show-default-footer="true"
    :close-on-backdrop="true"
    action-button-text="Return to Home"
    @confirm="redirectToHomePage"
    @close="redirectToHomePage"
  >
    <template #header>
      <h2 class="text-[40px] font-bold text-center text-white">Payment Time Expired</h2>
    </template>
    <div class="text-center py-4 px-6">
      <p class="text-white text-18 mb-4">
        Your payment session has expired. Please restart the booking process to ensure the latest pricing and availability.
      </p>
    </div>
  </TrustyModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyModal from '@/components/ui/TrustyModal.vue';
import Timer from '@/components/payment/Timer.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { useToursStore } from '@/store/toursStore';
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useRuntimeConfig } from 'nuxt/app';
import { PaymentService } from '@/utils/paymentService';
import { validatePaymentForm, formatCreditCardError } from '@/utils/paymentValidation';
import type { PaymentValidationErrors, PaymentResponse, PaymentError } from '@/types/payment';

// Composables
const router = useRouter();
const config = useRuntimeConfig();
const toursStore = useToursStore();
const authStore = useAuthStore();

// Store references
const { customTour }:any = storeToRefs(toursStore);
const { isAuthenticated, token } = storeToRefs(authStore);

// State
const isLoading = ref(true);
const isProcessingPayment = ref(false);
const tourData = ref<any>(null);
const stripe = ref<any>(null);
const elements = ref<any>(null);
const paymentIntentSecret = ref<string | null>(null);
const orderId = ref<string | null>(null);
const paymentCode = ref<string | null>(null);
const paymentError = ref<string>('');
const showTimerExpiredModal = ref<boolean>(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dialCode: '',
  iso2: '',
  country: '',
  notes: '',
  createAccount: false,
});

// Validation errors
const validationErrors:any = reactive<PaymentValidationErrors>({});

// Create payment service
const paymentService = new PaymentService(
  //@ts-ignore
  config.public.apiUrl,
  token.value
);

// Computed properties
const isPaymentFormValid = computed(() => {
  return !isAuthenticated.value ?
    formData.firstName && formData.lastName && formData.email && formData.phone && formData.country :
    true;
});

// Methods
const handleCountryChanged = (event: any) => {
  formData.country = event.name;
  formData.dialCode = event.dialCode;
  formData.iso2 = event.iso2;
};

const clearValidationError = (field: keyof PaymentValidationErrors) => {
  if (validationErrors[field]) {
    validationErrors[field] = undefined;
  }
};

const formatDate = (date: string | Date | null) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A';
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}` : `${mins} min`;
};

const calculateServicePrice = (service: any) => {
  if (!service || !service.price || !customTour.value) {
    return 0;
  }

  const participants = customTour.value.participants || 1;
  const priceIndex = Math.min(participants - 1, service.price.length - 1);

  // Return integer price
  return Math.round(service.price[priceIndex] || 0);
};

const calculatePricePerPerson = () => {
  if (!customTour.value || !customTour.value.participants || customTour.value.participants === 0) {
    return 0;
  }

  // Return integer price per person
  return Math.round(customTour.value.total_price / customTour.value.participants);
};

// Calculate the total price as an integer
const calculateTotalPrice = () => {
  let total = 0;

  if (customTour.value?.addons) {
    for (const addon of customTour.value.addons) {
      if (addon && addon.price && Array.isArray(addon.price)) {
        const participants = customTour.value.participants || 1;
        const priceIndex = Math.min(participants - 1, addon.price.length - 1);
        const price = addon.price[priceIndex] || 0;
        total += Math.round(price * participants);
      }
    }
  }

  // Ensure we return an integer
  return Math.round(total);
};

// Update the custom tour data
const updateCustomTourData = () => {
  const totalPrice = calculateTotalPrice();

  if (customTour.value) {
    console.log(`Updating total price from ${customTour.value.total_price} to ${totalPrice}`);

    // Update with integer values
    toursStore.updateCustomTour({
      ...customTour.value,
      total_price: totalPrice, // Ensure this is an integer
    });
  }
};

const fetchTourData = async () => {
  try {
    tourData.value = await toursStore.getTourById(customTour.value?.tour_id || 0);
  } catch (error) {
    console.error('Error fetching tour data:', error);
  }
};

const createOrder = async () => {
  try {
    const response = await paymentService.createOrder(
      customTour.value,
      isAuthenticated.value
    );

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const initStripe = async (paymentResponse: PaymentResponse) => {
  try {
    //@ts-ignore
    stripe.value = await loadStripe(config.public.stripeKey);

    if (!stripe.value) {
      throw new Error('Failed to load Stripe');
    }

    // Save payment details for later use
    paymentIntentSecret.value = paymentResponse.data.payment.client_secret;
    orderId.value = paymentResponse.data.order.id;
    paymentCode.value = paymentResponse.data.payment.id;

    // Configure Stripe elements
    elements.value = stripe.value.elements({
      clientSecret: paymentIntentSecret.value,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#FFFFFF',
          colorBackground: '#313131',
          colorText: '#FFFFFF',
          colorDanger: '#FA4141',
          fontFamily: 'Involve, Arial, sans-serif',
          spacingUnit: '4px',
          borderRadius: '16px',
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
          },
        },
      },
    });

    // Create and mount payment element
    const paymentElement = elements.value.create('payment');

    // Wait for the payment element container to be ready
    await new Promise((resolve) => {
      const checkElement = () => {
        const element = document.getElementById('payment-element');
        if (element) {
          resolve(true);
        } else {
          setTimeout(checkElement, 100);
        }
      };
      checkElement();
    });

    paymentElement.mount('#payment-element');

    // Handle payment element changes
    paymentElement.on('change', (event: any) => {
      const submitButton = document.querySelector('#submit') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = !event.complete;
      }
    });

  } catch (error) {
    console.error('Error initializing Stripe:', error);
    paymentError.value = 'Failed to initialize payment system. Please try again.';
  }
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  if (isProcessingPayment.value) {
    return;
  }

  // Validate form for non-authenticated users
  if (!isAuthenticated.value) {
    const { isValid, errors } = await validatePaymentForm(formData);

    if (!isValid) {
      Object.assign(validationErrors, errors);
      return;
    }
  }

  // Start payment processing
  try {
    isProcessingPayment.value = true;
    paymentError.value = '';

    if (!stripe.value || !elements.value) {
      paymentError.value = 'Payment system is not initialized. Please refresh the page and try again.';
      return;
    }

    // Prepare query parameters for redirect
    const queryParams = new URLSearchParams({
      order_id: orderId.value || '',
      payment_code: paymentCode.value || '',
      notes: formData.notes || '',
    });

    // Add user data for non-authenticated users
    if (!isAuthenticated.value) {
      queryParams.append('firstName', formData.firstName);
      queryParams.append('lastName', formData.lastName);
      queryParams.append('email', formData.email);
      queryParams.append('phone', formData.phone);
      queryParams.append('dialCode', formData.dialCode);
      queryParams.append('iso2', formData.iso2);
      queryParams.append('country', formData.country);
      queryParams.append('createAccount', formData.createAccount.toString());
    }

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?${queryParams.toString()}`,
      },
      redirect: 'if_required',
    });

    // Handle payment errors
    if (error) {
      paymentError.value = formatCreditCardError(error);
      isProcessingPayment.value = false;
      return;
    }

    // Handle different payment intent statuses
    if (paymentIntent) {
      switch (paymentIntent.status) {
        case 'succeeded':
          router.push(`/payment/success?${queryParams.toString()}`);
          break;
        case 'processing':
          router.push(`/payment/pending?${queryParams.toString()}`);
          break;
        case 'requires_payment_method':
          paymentError.value = 'Your payment was not successful, please try again.';
          break;
        default:
          paymentError.value = 'Something went wrong with your payment. Please try again.';
          break;
      }
    }
  } catch (err) {
    console.error('Payment error:', err);
    paymentError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isProcessingPayment.value = false;
  }
};

const handleTimerExpired = () => {
  showTimerExpiredModal.value = true;
};

const redirectToHomePage = () => {
  router.push('/');
};

// Lifecycle hooks
onMounted(async () => {
  if (!customTour.value) {
    router.push('/');
    return;
  }

  try {
    isLoading.value = true;

    await fetchTourData();

    // Ensure the total_price is an integer before creating the order
    updateCustomTourData();

    const paymentResponse = await createOrder();
    await initStripe(paymentResponse);

    // Fill form data for authenticated users
    if (isAuthenticated.value && authStore.user) {
      formData.firstName = authStore.user.name || '';
      formData.lastName = authStore.user.last_name || '';
      formData.email = authStore.user.email || '';
      formData.phone = authStore.user.phone || '';
    }
  } catch (error) {
    console.error('Error initializing payment page:', error);
    paymentError.value = 'Failed to initialize payment. Please try again.';
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  // Cleanup if needed
  if (elements.value) {
    elements.value = null;
  }
});

// Auto-adjust textarea height
watch(() => formData.notes, (newValue) => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
});
</script>

<style scoped>
.field-input {
  height: 4rem;
}

/* Payment Element Styles */
:deep(.StripeElement) {
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.29);
  border-radius: 16px;
  background-color: #313131;
  color: white;
}

:deep(.StripeElement--focus) {
  border-color: white;
}

:deep(.StripeElement--invalid) {
  border-color: #FA4141;
}
</style>