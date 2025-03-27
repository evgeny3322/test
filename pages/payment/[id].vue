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
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4 mb-1">Area:</li>
                  <li class="md:pb-8 pb-6">{{ tourData?.area?.name }}</li>
                  <li class="text-grey-light-4 mb-1">Date:</li>
                  <li class="md:pb-8 pb-6">
                    {{ formatDate(customTour?.date) }}
                  </li>
                  <li class="text-grey-light-4 mb-1">Number of participants:</li>
                  <li>
                    {{ customTour?.participants }}
                    {{ customTour?.participants === 1 ? 'Person' : 'People' }}
                  </li>
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
                  <li v-for="service in customTour?.addons" :key="service.id">
                    {{ service.name }}
                  </li>
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

          <form
            @submit.prevent="confirmAccountCreation"
            class="flex flex-col w-full bg-grey-dark rounded-[1rem]"
          >
            <div class="flex xl:flex-row flex-col w-full gap-4 p-[1.125rem]">
              <TrustyField
                class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
                v-model="accountData.firstName"
                placeholder="First name"
                :error="!!validationErrors.firstName"
              />
              <TrustyField
                class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
                v-model="accountData.lastName"
                placeholder="Last name"
                :error="!!validationErrors.lastName"
              />
              <TrustyField
                class="w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
                v-model="accountData.email"
                placeholder="example@gmail.com"
                :error="!!validationErrors.email"
              />
            </div>
            <div class="flex xl:flex-row flex-col w-full gap-4 px-[1.125rem] pb-[1.125rem]">
              <TrustyField
                class="xl:w-1/2 w-full h-[4rem] bg-grey-light-1 rounded-[1rem]"
                v-model="accountData.country"
                placeholder="Country"
                :error="!!validationErrors.country"
              />
              <TrustyField
                class="xl:w-1/2 w-full !*:h-[4rem] bg-grey-light-1 rounded-[1rem]"
                type="tel"
                v-model="accountData.phone"
                @country-changed="handleCountryChanged"
                :default-country="accountData.iso2"
                placeholder="44 44 44 44"
                :error="!!validationErrors.phone"
              />
              <TrustyButton
                type="submit"
                class="w-full !font-semibold h-[4rem] bg-grey-light-1 rounded-[1rem] items-center xl:w-[87.7%]"
                :loading="isProcessingAccount"
              >
                <span>Confirm account creation</span>
              </TrustyButton>
            </div>

            <div
              v-if="accountCreationError"
              class="text-red-500 text-sm px-[1.125rem] pb-[1.125rem]"
            >
              {{ accountCreationError }}
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mt-8">
        <TrustyButton @click="router.push('/')" color="black" class="w-full md:w-auto px-8">
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

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const toursStore = useToursStore();
const authStore = useAuthStore();

const { customTour }: any = storeToRefs(toursStore);

const paymentStatus = route.params.id as string;
const orderData = {
  order_id: route.query.order_id as string,
  payment_code: route.query.payment_code as string,
  notes: route.query.notes as string,
};

const isLoading = ref(true);
const isProcessingAccount = ref(false);
const tourData = ref<any>(null);
const accountCreationError = ref('');
const validationErrors = reactive<Record<string, boolean>>({});
const shouldShowAccountCreation = computed(
  () => isSuccess.value && route.query.createAccount === 'true' && !authStore.isAuthenticated
);

const accountData = reactive({
  firstName: (route.query.firstName as string) || '',
  lastName: (route.query.lastName as string) || '',
  email: (route.query.email as string) || '',
  phone: (route.query.phone as string) || '',
  dialCode: (route.query.dialCode as string) || '',
  iso2: (route.query.iso2 as string) || '',
  country: (route.query.country as string) || '',
});

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
      return "We're checking the status of your order.";
  }
});

const formatDate = (date: string | Date | null) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'N/A';
};

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0
    ? `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`
    : `${mins} min`;
};

const getTransportationName = () => {
  if (!customTour.value?.addons || customTour.value.addons.length === 0) {
    return 'N/A';
  }

  const transportAddon = customTour.value.addons.find(
    (addon: any) => addon.segmentType === 'Transportation'
  );

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
      Object.keys(validationErrors).forEach((key) => {
        validationErrors[key] = false;
      });

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

  const isValid = await validateAccountData();
  if (!isValid) return;

  try {
    isProcessingAccount.value = true;

    const userData = {
      name: accountData.firstName,
      last_name: accountData.lastName,
      email: accountData.email,
      phone: accountData.phone,
      country_code: accountData.dialCode,
    };

    authStore.updateRegisterInfo({
      step: 1,
      ...userData,
    });

    const response = await authStore.sendCode(userData);

    console.log('Verification code response:', response);

    if (response.status === 200 || response.status === 208) {
      authStore.updateRegisterInfo({
        step: 2,
        ...userData,
      });

      router.push('/auth/email-verification');
    } else if (
      response.status === 422 ||
      (response.data?.message && response.data.message.toLowerCase().includes('already'))
    ) {
      console.log('User already exists - sending password reset link');
    } else {
      throw new Error(response.data?.message || 'Failed to send verification code');
    }
  } catch (error: any) {
    console.error('Error in account creation flow:', error);
    accountCreationError.value = error?.message || 'Failed to create account. Please try again.';
  } finally {
    isProcessingAccount.value = false;
  }
};

const retryPayment = () => {
  router.push('/payment');
};

onMounted(async () => {
  if (!customTour.value) {
    router.push('/');
    return;
  }

  try {
    isLoading.value = true;

    await Promise.all([fetchTourData(), updatePaymentStatus()]);
  } catch (error) {
    console.error('Error initializing payment result page:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>
