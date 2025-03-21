<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex w-full">
        <h1 class="font-normal text-[2.5rem] leading-[90%]">Payment</h1>
        <span class="ml-auto font-semi-bold text-[3rem] leading-[110%]">{{ totalAmount }} EUR</span>
      </div>
      <hr class="my-8 border-under-line" />
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
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">{{ pay.title }}</h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="md:pb-8 pb-6">{{ pay.area }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="md:pb-8 pb-6">{{ pay.date }}</li>
                  <li class="text-grey-light-4">Number of participants::</li>
                  <li>{{ pay.participants_number }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration::</li>
                  <li class="md:pb-8 pb-6">{{ pay.total_duration }} Hours</li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ pay.total_price }} Eur</li>
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
          <!-- accordion show more -->
          <TrustyAccordion :title="'Show details'">
            <div
              v-for="service in pay.services"
              class="flex flex-col w-full gap-6 mt-8 p-[1.125rem] bg-grey-dark rounded-[1rem]"
            >
              <div class="flex xl:flex-row flex-col gap-4">
                <NuxtImg
                  :src="service.img"
                  alt="Payment icon"
                  class="overflow-hidden rounded-[1rem] xl:min-w-[19.063rem] h-[7.563rem] object-cover"
                />
                <div class="flex flex-col gap-[0.625rem]">
                  <h3 class="font-normal leading-[1.875rem] text-[1.25rem]">{{ service.title }}</h3>
                  <span class="text-grey-light-6 text-[0.75rem] font-normal leading-[140%]">{{
                      service.description
                    }}</span>
                </div>
                <TrustyButton
                  class="min-w-[12.563rem] h-[3.688rem] md:!text-[1.625rem] max-xl:w-full self-center xl:ml-[2.563rem]"
                  type="black"
                  color="black"
                >{{ service.price }} EUR</TrustyButton>
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
          @submit.prevent="handleSubmit"
          class="payment_form form mt-[-38px] bg-grey-dark p-[1.125rem] rounded-[1rem]"
        >
          <div class="flex xl:flex-row flex-col w-full gap-4">
            <trusty-field
              v-model="formData.firstName"
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              placeholder="First name"
              :error="!!formErrors.firstName"
            />
            <trusty-field
              v-model="formData.lastName"
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              placeholder="Last name"
              :error="!!formErrors.lastName"
            />
            <trusty-field
              v-model="formData.email"
              class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
              placeholder="example@gmail.com"
              :error="!!formErrors.email"
            />
            <trusty-field
              v-model="formData.phone"
              type="tel"
              class="w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
              placeholder="44 44 44 44"
              :error="!!formErrors.phone"
              @country-changed="countryChanged"
            />
          </div>
          <label
            class="relative mt-[28px] flex gap-4 justify-center xl:items-center items-start w-full cursor-pointer"
          >
            <input
              v-model="formData.createAccount"
              type="checkbox"
              class="peer sr-only"
              :true-value="true"
              :false-value="false"
            />
            <div
              class="bg-grey-light-1 peer-checked:bg-main peer h-6 w-[39px] min-w-[3.5rem] rounded-full after:absolute after:left-[2px] after:top-[2px] md:after:left-[4px] md:after:top-[4px] xl:after:top-[13px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-[160%] peer-checked:after:border-white peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 md:h-[31px] md:w-[56px] md:after:h-[24px] md:after:w-[24px] md:peer-checked:after:translate-x-[100%]"
            ></div>
            <span class="account_toggler_text text-grey-light-6">
              Create Personal Account After Payment, it will facilitate you a lot if you book other
              services, and it requires no further data entry, only 1 click! Please
              <a href="" @click.prevent="redirectToLogin" class="underline text-white">Login</a> if you already have an account
            </span>
          </label>

          <!-- Stripe Card Element -->
          <div class="mt-6 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem] p-5">
            <div id="payment-element" class="h-12 empty-element"></div>
          </div>

          <!-- Payment error message -->
          <div v-if="paymentError" class="text-red-500 mt-2">
            {{ paymentError }}
          </div>

          <div
            class="next_step_button_wrapper mt-[40px] flex xl:h-[4rem] mt-[30px] gap-6 justify-center item-center xl:flex-row flex-col"
          >
            <textarea
              v-model="formData.notes"
              ref="textarea"
              maxlength="230"
              class="input text-[0.875rem] md:text-[1.125rem] ym-record-keys mb-0 w-full resize-none overflow-hidden h-[4rem] p-5 border-1 border-grey-light-29 bg-grey-light-1 rounded-[1rem]"
              rows="1"
              placeholder="Here you can leave any notes…"
            ></textarea>
            <trusty-button
              class="btn w-full xl:w-1/4 btn-primary"
              :disabled="isProcessing"
              @click="handleSubmit"
            >
              <PreloaderAnimIcon class="size-6" theme="black" v-if="isProcessing" />
              <span v-else>Pay now</span>
            </trusty-button>
          </div>
        </form>
      </div>
      <div
        class="inline-flex gap-1 flex-wrap xl:text-[1.125rem] text-[0.75rem] pt-8 justify-center items-center text-grey-light-6"
      >
        <span>This offer will expire within the next </span>
        <Timer class="text-white" :minutes="4" :seconds="30" @time-up="handleTimerExpired" />
        <span>after which the price might be different</span>
      </div>
    </div>
  </div>

  <!-- Success modal -->
  <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div class="bg-tertiary-black rounded-2xl p-8 max-w-lg w-full">
      <h2 class="text-2xl font-medium mb-4">Payment Successful!</h2>
      <p class="text-grey-light-7 mb-6">
        Your payment has been processed successfully. You'll receive a confirmation email shortly.
      </p>
      <div class="flex justify-end">
        <trusty-button @click="redirectToAccount">
          Go to My Account
        </trusty-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyAccordion from '@/components/payment/Accordion.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import Timer from '@/components/payment/Timer.vue';
import { useToursStore } from '@/store/toursStore';
import { useAuthStore } from '@/store/authStore';
import { navigateTo } from 'nuxt/app';
import { stripeService } from '@/utils/stripeService';
import { VueTelInputCountryObject } from '@/types/type';
import * as yup from 'yup';

// Store access
const toursStore = useToursStore();
const authStore = useAuthStore();

// Get tour data
const customTour = computed(() => toursStore.customTour);
const payment = ref([
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    title: customTour.value?.tour_id ? `Tour #${customTour.value.tour_id}` : 'Tour Chianti',
    area: 'Florence',
    date: customTour.value?.date
      ? new Date(customTour.value.date.toString()).toLocaleDateString()
      : '29/02/2024 21:49',
    participants_number: customTour.value?.participants || 2,
    total_duration: customTour.value?.total_duration
      ? Math.floor(customTour.value.total_duration / 60)
      : 2,
    total_price: customTour.value?.total_price || 1000,
    transportation: 'Mercedes "S Class"',
    services: customTour.value?.addons.map(addon => ({
      id: addon.id,
      title: addon.name,
      description: addon.description,
      price: addon.price[0] || 200,
      img: addon.media && addon.media.length > 0
        ? addon.media[0]
        : 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
    })) || [
      {
        id: 1,
        title: 'S class',
        description: 'Premium transportation service',
        price: 800,
        img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
      },
      {
        id: 2,
        title: 'Light lunch',
        description: 'Gourmet Italian lunch experience',
        price: 200,
        img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963',
      },
    ],
  }
]);

// Form state
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'Italy',
  notes: '',
  createAccount: false
});

const formErrors = reactive({
  firstName: false,
  lastName: false,
  email: false,
  phone: false,
  country: false,
  cardElement: false
});

// Processing states
const isProcessing = ref(false);
const paymentError = ref('');
const showSuccessModal = ref(false);
const countryCode = ref('');

// Computed values
const totalAmount = computed(() => {
  return customTour.value?.total_price || 1100;
});

// Country code handler for phone field
const countryChanged = (country: VueTelInputCountryObject) => {
  countryCode.value = country.dialCode;
  formData.country = country.name;
};

// Validation schema
const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required')
});

// Validate form
const validateForm = async () => {
  try {
    // Reset errors
    Object.keys(formErrors).forEach(key => {
      formErrors[key as keyof typeof formErrors] = false;
    });

    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach(error => {
        if (error.path) {
          formErrors[error.path as keyof typeof formErrors] = true;
        }
      });

      paymentError.value = err.errors[0];
    }
    return false;
  }
};

// Submit handler
const handleSubmit = async () => {
  if (isProcessing.value) return;

  paymentError.value = '';
  const isValid = await validateForm();

  if (!isValid) return;

  isProcessing.value = true;

  try {
    if (!customTour.value) {
      throw new Error('Tour data not available');
    }

    // Process payment
    const result = await stripeService.processPayment(
      customTour.value,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        createAccount: formData.createAccount,
        notes: formData.notes
      },
      authStore.isAuthenticated
    );

    if (result.success) {
      // Payment successful
      showSuccessModal.value = true;

      // Reset the custom tour in the store
      toursStore.updateCustomTour(null);
    } else {
      paymentError.value = result.error || 'Payment processing failed';
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    paymentError.value = error.message || 'An error occurred while processing payment';
  } finally {
    isProcessing.value = false;
  }
};

// Timer expiration handler
const handleTimerExpired = () => {
  alert('Your payment session has expired. The page will refresh with updated pricing information.');
  window.location.reload();
};

// Redirects
const redirectToLogin = () => {
  navigateTo('/auth/sign-in');
};

const redirectToAccount = () => {
  navigateTo('/account');
};

// Lifecycle hooks
onMounted(async () => {
  // Initialize Stripe card element
  await stripeService.initStripe();
  await stripeService.initCardElement('#payment-element');

  // If user is authenticated, pre-fill form with user data
  if (authStore.isAuthenticated && authStore.user) {
    formData.firstName = authStore.user.first_name || authStore.user.name || '';
    formData.lastName = authStore.user.last_name || '';
    formData.email = authStore.user.email || '';
    formData.phone = authStore.user.phone || '';
  }

  // If no custom tour data, redirect to home
  if (!customTour.value) {
    navigateTo('/');
  }
});

onBeforeUnmount(() => {
  // Clean up Stripe resources
  stripeService.cleanup();
});
</script>

<style>
/* Card element styles */
#payment-element {
  background-color: #313131;
}

.StripeElement {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: transparent;
}

.StripeElement--focus {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.StripeElement--invalid {
  border-color: #fa755a;
}

/* Timer styles */
.dp__input {
  font-size: 26px;
  font-weight: 600;
  font-family: 'Involve', sans-serif;
  color: black;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0;
  outline: none;
  box-shadow: none;
}
</style>