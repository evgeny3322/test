<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex flex-col w-full items-center">
        <h1 class="text-32 md:text-48 font-medium text-center text-white mb-6">{{ pageTitle }}</h1>

        <div class="mb-8">
          <SuccessfullyIcon v-if="isSuccess" class="w-16 h-16 mx-auto" />
        </div>

        <p class="text-18 md:text-24 text-center text-grey-light-8 max-w-2xl mb-8">
          {{ statusMessage }}
        </p>
      </div>

      <hr class="my-8 border-under-line" />

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
        <PreloaderAnimIcon class="size-12" theme="white" />
        <p class="mt-4 text-16 text-grey-light-7">Loading your order details...</p>
      </div>

      <div v-else class="w-full flex flex-col gap-8">
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="tourData?.media?.[0]"
              alt="Tour image"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] xl:h-auto xl:w-[38.7%] object-cover"
            />

            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ tourData?.name }}
              </h2>
              <div class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]">
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

                <ul>
                  <li class="text-grey-light-4 mb-1">Total duration:</li>
                  <li class="md:pb-8 pb-6">{{ formatDuration(customTour?.total_duration) }}</li>
                  <li class="text-grey-light-4 mb-1">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ customTour?.total_price }} EUR</li>
                  <li class="text-grey-light-4 mb-1">Transportation:</li>
                  <li>{{ getTransportationName() }}</li>
                </ul>

                <ul>
                  <li class="text-grey-light-4 mb-1">List of services:</li>
                  <li v-for="service in customTour?.addons" :key="service.id">{{ service.name }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!authStore.isAuthenticated && shouldShowAccountCreation"
        class="flex w-full flex-col mt-8"
      >
        <hr class="my-8 border-under-line" />
        <div class="flex flex-col gap-6">
          <h3 class="text-24 font-medium text-white">Create Your Account</h3>
          <span class="text-grey-light-8 text-16">
            Your payment was successful! Complete your account creation to access your tour history
            and manage your bookings in the future.
          </span>

          <form @submit.prevent="confirmAccountCreation" class="bg-grey-dark p-6 rounded-2xl mt-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TrustyField
                v-model="accountData.firstName"
                label="First Name"
                placeholder="First Name"
                inputClass="!bg-[#313131] text-18"
                :error="!!validationErrors.firstName"
              />
              <TrustyField
                v-model="accountData.lastName"
                label="Last Name"
                placeholder="Last Name"
                inputClass="!bg-[#313131] text-18"
                :error="!!validationErrors.lastName"
              />
              <TrustyField
                v-model="accountData.email"
                label="Email Address"
                placeholder="Email Address"
                inputClass="!bg-[#313131] text-18"
                :error="!!validationErrors.email"
              />
              <TrustyField
                type="tel"
                v-model="accountData.phone"
                label="Mobile Phone Number"
                @country-changed="(c) => handleCountryChanged(c)"
                :default-country="accountData.iso2"
                inputClass="!bg-[#313131] text-18"
                :error="!!validationErrors.phone"
              />
              <TrustyField
                v-model="accountData.country"
                label="Country"
                placeholder="Country"
                inputClass="!bg-[#313131] text-18"
                :error="!!validationErrors.country"
              />
            </div>

            <div v-if="accountCreationError" class="text-red-500 text-sm mb-4">
              {{ accountCreationError }}
            </div>

            <TrustyButton
              type="submit"
              color="black"
              class="w-full md:w-auto px-8"
              :loading="isProcessingAccount"
            >
              Confirm Account Creation
            </TrustyButton>
          </form>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mt-8">
        <TrustyButton
          @click="router.push('/')"
          color="black"
          class="w-full md:w-auto px-8"
        >
          Return to Home
        </TrustyButton>

        <TrustyButton
          v-if="authStore.isAuthenticated"
          @click="router.push('/account')"
          color="black"
          class="w-full md:w-auto px-8"
        >
          Go to My Account
        </TrustyButton>

        <TrustyButton
          v-if="!isSuccess"
          @click="retryPayment"
          color="black"
          class="w-full md:w-auto px-8"
        >
          Try Again
        </TrustyButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import SuccessfullyIcon from '@/components/icons/SuccessfullyIcon.vue';
import { useToursStore } from '@/store/toursStore';
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useRuntimeConfig } from 'nuxt/app';
import { PaymentService } from '@/utils/paymentService';
import * as yup from 'yup';
import axios from 'axios';

// Composables
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const toursStore = useToursStore();
const authStore = useAuthStore();

// Store references
const { customTour }:any = storeToRefs(toursStore);

// Route params and query
const paymentStatus = route.params.id as string;
const orderData = {
  order_id: route.query.order_id as string,
  payment_code: route.query.payment_code as string,
  notes: route.query.notes as string,
};

// State
const isLoading = ref(true);
const isProcessingAccount = ref(false);
const tourData = ref<any>(null);
const accountCreationError = ref('');
const validationErrors = reactive<Record<string, boolean>>({});
const shouldShowAccountCreation = computed(() =>
  isSuccess.value && route.query.createAccount === 'true' && !authStore.isAuthenticated
);

// Account data form
const accountData = reactive({
  firstName: route.query.firstName as string || '',
  lastName: route.query.lastName as string || '',
  email: route.query.email as string || '',
  phone: route.query.phone as string || '',
  dialCode: route.query.dialCode as string || '',
  iso2: route.query.iso2 as string || '',
  country: route.query.country as string || '',
});

// Computed properties
const isSuccess = computed(() => paymentStatus === 'success');

const pageTitle = computed(() => {
  switch (paymentStatus) {
    case 'success':
      return 'Thank You for Your Order!';
    case 'pending':
      return 'Your Payment is Being Processed';
    case 'failure':
      return 'Payment Unsuccessful';
    default:
      return 'Order Status';
  }
});

const statusMessage = computed(() => {
  switch (paymentStatus) {
    case 'success':
      return 'Your payment has been processed successfully. You will receive a confirmation email shortly with all the details of your tour.';
    case 'pending':
      return 'Your payment is currently being processed. Once completed, you will receive a confirmation email with all the details of your tour.';
    case 'failure':
      return 'We were unable to process your payment. Please check your payment details and try again, or contact our support team for assistance.';
    default:
      return 'We\'re checking the status of your order.';
  }
});

// Methods
const formatDate = (date: string | Date | null) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A';
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}` : `${mins} min`;
};

const getTransportationName = () => {
  if (!customTour.value?.addons || customTour.value.addons.length === 0) {
    return 'N/A';
  }

  const transportAddon = customTour.value.addons.find((addon: any) =>
    addon.segmentType === 'Transportation');

  return transportAddon?.name || 'N/A';
};

const handleCountryChanged = (country: any) => {
  accountData.country = country.name;
  accountData.dialCode = country.dialCode;
  accountData.iso2 = country.iso2;
};

const fetchTourData = async () => {
  try {
    tourData.value = await toursStore.getTourById(customTour.value?.tour_id || 0);
  } catch (error) {
    console.error('Error fetching tour data:', error);
  }
};

const updatePaymentStatus = async () => {
  if (isSuccess.value && orderData.order_id && orderData.payment_code) {
    try {
      //@ts-ignore
      const paymentService = new PaymentService(config.public.apiUrl);
      await paymentService.updatePaymentStatus(orderData);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }
};

const validateAccountData = async () => {
  const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('Email is required')
      .test(
        'email-dot',
        'The email address must contain a dot (.) after the @ symbol',
        (value) => value.includes('.') && value.indexOf('.') > value.indexOf('@')
      ),
    phone: yup.string().required('Phone number is required'),
    country: yup.string().required('Country is required'),
  });

  try {
    await schema.validate(accountData, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      // Reset all validation errors
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key] = false;
      });

      // Set new validation errors
      err.inner.forEach((error) => {
        if (error.path) {
          validationErrors[error.path] = true;
          accountCreationError.value = error.message;
        }
      });
    }
    return false;
  }
};

const confirmAccountCreation = async () => {
  if (isProcessingAccount.value) return;

  accountCreationError.value = '';

  // Validate account data
  const isValid = await validateAccountData();
  if (!isValid) return;

  try {
    isProcessingAccount.value = true;

    // Store user information for registration
    const userData = {
      name: accountData.firstName,
      last_name: accountData.lastName,
      email: accountData.email,
      phone: accountData.phone,
      country_code: accountData.dialCode,
    };

    // Save registration info to auth store for the verification process
    authStore.updateRegisterInfo({
      step: 1,
      ...userData,
    });

    // If we have order data, also save the user to the backend
    if (orderData.order_id) {
      //@ts-ignore
      const paymentService = new PaymentService(config.public.apiUrl);

      await paymentService.storeUserInfo(orderData, {
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        phone: accountData.phone,
        dialCode: accountData.dialCode,
        iso2: accountData.iso2,
        country: accountData.country,
        createAccount: true,
      });
    }

    // Send verification code
    await authStore.sendCode(userData);

    // Navigate to email verification page
    router.push('/auth/email-verification');
  } catch (error: any) {
    console.error('Error creating account:', error);
    accountCreationError.value = error?.message || 'Failed to create account. Please try again.';
  } finally {
    isProcessingAccount.value = false;
  }
};

const retryPayment = () => {
  router.push('/payment');
};

// Lifecycle hooks
onMounted(async () => {
  if (!customTour.value) {
    router.push('/');
    return;
  }

  try {
    isLoading.value = true;

    // Parallel operations
    await Promise.all([
      fetchTourData(),
      updatePaymentStatus()
    ]);
  } catch (error) {
    console.error('Error initializing payment result page:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Add any needed styles here */
</style>