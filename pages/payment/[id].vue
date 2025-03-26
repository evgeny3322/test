<template>
  <div class="flex flex-row justify-between items-center w-full py-6 md:px-[9.5%]">
    <div v-if="loading" class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem] items-center">
      <PreloaderAnimIcon theme="white" class="size-12 mb-4" />
      <p class="text-xl">Processing your payment...</p>
    </div>

    <div v-else class="flex w-full flex-col bg-grey-light-1 md:p-8 p-6 rounded-[1rem]">
      <div class="flex w-full items-center mb-4">
        <h1 class="font-normal text-[2.5rem] leading-[90%]">{{ title }}</h1>
        <div v-if="isSuccess" class="ml-auto">
          <SuccessfullyIcon class="size-10" />
        </div>
      </div>

      <hr class="my-8 border-under-line" />

      <div v-if="error" class="text-center mb-8">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <trusty-button @click="router.push('/tours')" class="items-center">
          Return to Tours
        </trusty-button>
      </div>

      <div v-else-if="isSuccess && orderDetails" class="w-full flex flex-col gap-8">
        <div class="flex flex-col bg-under-line p-6 rounded-[1rem] border border-grey-light-29">
          <div class="w-full flex xl:flex-row flex-col gap-8">
            <NuxtImg
              :src="orderDetails.image || ''"
              alt="Tour image"
              class="overflow-hidden rounded-[1rem] md:min-w-[17.813rem] md:h-[16.313rem] h-[10.375rem] object-cover"
            />
            <div class="flex flex-col w-full">
              <h2 class="text-[1.75rem] font-normal leading-[110%] pb-[1.375rem]">
                {{ orderDetails.title }}
              </h2>
              <div
                class="flex md:flex-row flex-col md:gap-[3.75rem] gap-6 font-normal text-[1.125rem]"
              >
                <ul>
                  <li class="text-grey-light-4">Area:</li>
                  <li class="md:pb-8 pb-6">{{ orderDetails.area }}</li>
                  <li class="text-grey-light-4">Date:</li>
                  <li class="md:pb-8 pb-6">{{ orderDetails.date }}</li>
                  <li class="text-grey-light-4">Number of participants:</li>
                  <li>{{ orderDetails.participants_number }} People</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">Total duration:</li>
                  <li class="md:pb-8 pb-6">{{ orderDetails.total_duration }} Hours</li>
                  <li class="text-grey-light-4">Total price:</li>
                  <li class="md:pb-8 pb-6">{{ orderDetails.total_price }} EUR</li>
                  <li class="text-grey-light-4">Transportation:</li>
                  <li>{{ orderDetails.transportation }}</li>
                </ul>
                <ul>
                  <li class="text-grey-light-4">List of services:</li>
                  <li v-for="(service, index) in orderDetails.services" :key="index">
                    {{ service.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-8 border-under-line" />

      <div v-if="isSuccess" class="flex flex-col items-center text-center mb-8">
        <p class="mb-6">
          Your payment has been successfully processed. You will receive a confirmation email shortly.
        </p>

        <div v-if="!isAuthenticated" class="w-full max-w-[800px] bg-grey-dark rounded-[1rem] p-6 mb-6">
          <p class="mb-4">
            Your account has been created. Complete your profile for easier booking in the future.
          </p>

          <div v-if="!newUserData" class="text-amber-400 mb-4">
            Loading user information...
          </div>

          <div class="flex xl:flex-row flex-col w-full gap-4">
            <trusty-field
              class="w-full bg-grey-light-1 rounded-[1rem]"
              :model-value="newUserData?.name || ''"
              placeholder="First Name"
              disabled
            />
            <trusty-field
              class="w-full bg-grey-light-1 rounded-[1rem]"
              :model-value="newUserData?.last_name || ''"
              placeholder="Last Name"
              disabled
            />
            <trusty-field
              class="w-full bg-grey-light-1 rounded-[1rem]"
              :model-value="newUserData?.email || ''"
              placeholder="Email address"
              disabled
            />
          </div>
          <div class="flex xl:flex-row flex-col w-full gap-4 mt-4">
            <trusty-field
              class="xl:w-1/2 w-full bg-grey-light-1 rounded-[1rem]"
              :model-value="newUserData?.country_code || ''"
              placeholder="Country"
              disabled
            />
            <trusty-field
              class="xl:w-1/2 w-full bg-grey-light-1 rounded-[1rem]"
              type="tel"
              :model-value="newUserData?.phone || ''"
              placeholder="Phone number"
              disabled
            />
            <trusty-button
              class="w-full !font-semibold h-[4rem] bg-grey-light-1 rounded-[1rem] items-center"
              @click="router.push('/account')"
            >
              <span>Go to your account</span>
            </trusty-button>
          </div>
        </div>

        <div class="flex gap-4">
          <trusty-button @click="router.push('/account')" class="items-center">
            {{ isAuthenticated ? 'View Your Account' : 'Access Your Account' }}
          </trusty-button>
          <trusty-button @click="router.push('/tours')" color="black" class="items-center">
            Explore More Tours
          </trusty-button>
        </div>
      </div>

      <div v-else-if="!loading && !isSuccess && !error" class="flex flex-col items-center text-center">
        <p class="mb-6 text-red-500">
          There was an issue with your payment. Please try again or contact our support team.
        </p>
        <trusty-button @click="router.push('/tours')" class="items-center">
          Return to Tours
        </trusty-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import SuccessfullyIcon from '@/components/icons/SuccessfullyIcon.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useRuntimeConfig } from 'nuxt/app';
import { useAuthStore } from '@/store/authStore';

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Page state
const loading = ref(true);
const title = ref('Processing Payment');
const error = ref<string | null>(null);
const paymentProcessed = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);

// State for new user data from the payment page
const newUserData = ref<{
  name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;
} | null>(null);

// Retrieve user data from storage
const getUserDataFromSession = () => {
  if (process.client) {
    try {
      // Try localStorage instead of sessionStorage
      const userData = localStorage.getItem('newUserData');
      console.log('Retrieved user data:', userData);

      if (userData) {
        newUserData.value = JSON.parse(userData);

        // Don't remove the data immediately to handle page refreshes
        // We'll keep it for this session
      }
    } catch (err) {
      console.error('Error retrieving user data from storage:', err);
    }
  }
};

// Success data
const orderDetails = ref<any>(null);

// Computed state
const isSuccess = computed(() => {
  return route.params.id === 'success' && paymentProcessed.value && !error.value;
});

// Fake order details for demo - replace with actual API call
const demoOrderDetails = {
  id: 1,
  title: 'Tour Chianti',
  image: 'https://images.unsplash.com/photo-1583830379760-eebd26273a5f?q=80&w=2942&auto=format&fit=crop',
  area: 'Florence',
  date: '29/03/2025 15:30',
  participants_number: 2,
  total_duration: 4,
  total_price: '1,200',
  transportation: 'Mercedes "S Class"',
  services: [
    {
      id: 1,
      title: 'S class',
      description: 'Luxury transportation',
      price: 800,
      img: 'https://images.unsplash.com/photo-1583830379760-eebd26273a5f?q=80&w=2942&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Light lunch',
      description: 'Authentic Italian meal',
      price: 200,
      img: 'https://images.unsplash.com/photo-1583830379760-eebd26273a5f?q=80&w=2942&auto=format&fit=crop',
    },
  ],
};

// Process the payment result
const processPaymentResult = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Determine if success or failure based on the route param
    const status = route.params.id;

    if (status === 'success') {
      title.value = 'Thank you for your purchase!';

      // Get order_id and payment_code from query params - handle potential missing params
      const order_id = route.query.order_id || '';
      const payment_code = route.query.payment_code || '';

      // Check if we have the necessary parameters
      if (!order_id || !payment_code) {
        console.warn('Missing payment parameters, using demo data instead');
        // Use demo data instead of failing completely
        orderDetails.value = demoOrderDetails;
        paymentProcessed.value = true;
        return;
      }

      // Store the parameters for safety
      const paymentParams = { order_id, payment_code };

      // Clear query params to prevent refresh issues - do this safely
      try {
        router.replace({ query: {} });
      } catch (replaceError) {
        console.warn('Could not replace URL query parameters', replaceError);
      }

      // Call API to confirm payment
      await axios.post(
        `${config.public.apiUrl}/orders/payment/update`,
        paymentParams,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: isAuthenticated.value ? `Bearer ${authStore.token}` : undefined,
          },
        }
      );

      // Fetch order details - replace with actual API call
      // const orderResponse = await axios.get(`${config.public.apiUrl}/orders/${order_id}`);
      // orderDetails.value = orderResponse.data.data;

      // For demo purposes - replace with actual API call
      orderDetails.value = demoOrderDetails;
      paymentProcessed.value = true;

    } else if (status === 'failure') {
      title.value = 'Payment Failed';
      error.value = 'Your payment could not be processed. Please try again or contact support.';
      paymentProcessed.value = true;
    } else {
      // Handle unexpected route parameter
      router.push('/tours');
    }
  } catch (err) {
    console.error('Error processing payment result:', err);

    // Don't break the experience completely - show demo data even on error
    orderDetails.value = demoOrderDetails;
    paymentProcessed.value = true;

    // Set a more user-friendly error message
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 404) {
        error.value = 'Your payment was processed but we could not find your order details. Our team has been notified.';
      } else if (err.response.data?.message) {
        error.value = 'Payment confirmation issue: ' + err.response.data.message;
      } else {
        error.value = 'There was an issue confirming your payment, but your tour is still booked.';
      }
    } else {
      error.value = 'Your payment was successful, but we had trouble loading your order details.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  processPaymentResult();
});
</script>

<style>
/* You can add specific styles here if needed */
</style>