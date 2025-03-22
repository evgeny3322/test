<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <div class="relative">
      <div
        class="px-[9.5%] absolute -top-9 md:inset-0 md:ml-4 flex items-center gap-4 cursor-pointer"
        @click="router.push('/auth/sign-in')"
      >
        <ArrowDownOutlinedIcon class="rotate-90 stroke-[1.5px] h-3 w-[18px]" />
        <p>Go Back</p>
      </div>
      <h1 class="text-40 font-medium text-center text-white">Recover Password</h1>
    </div>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-8 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <p v-if="!sent" class="text-white text-14 md:text-18">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        <div v-if="sent" class="flex flex-col items-center text-center">
          <p class="text-white text-14 md:text-18 mb-4">
            If an account with this email exists, we've sent a password reset link. Please check
            your inbox and spam folder.
          </p>
          <p class="text-white/60 text-14">
            Didn't receive the email? Check your spam folder or
            <span class="text-white cursor-pointer hover:underline" @click="resetForm"
              >try again</span
            >.
          </p>
        </div>

        <template v-if="!sent">
          <TrustyField
            v-model="email"
            label="Email Address"
            placeholder="Enter your email address"
            inputClass="!bg-[#313131] text-18"
            :error="!!resetError || !!emailError"
            @update:modelValue="clearErrors"
          />

          <p v-if="resetError || emailError" class="text-red-500 text-sm">
            {{ emailError || resetError }}
          </p>

          <TrustyButton
            title="Send Reset Link"
            size="large"
            :disabled="authStore.loading"
            class="relative h-[50px] flex justify-center items-center"
          >
            <div v-if="authStore.loading" class="absolute inset-0 flex items-center justify-center">
              <PreloaderAnimIcon class="size-6" theme="black" />
            </div>
            <p v-else class="text-18 font-medium">Send Reset Link</p>
          </TrustyButton>
        </template>

        <TrustyButton
          v-if="sent"
          title="Back to Sign In"
          size="large"
          @click="router.push('/auth/sign-in')"
        >
          <p class="text-18 font-medium">Back to Sign In</p>
        </TrustyButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const emailError = ref('');
const resetError = ref('');
const sent = ref(false);

const validateEmail = () => {
  try {
    yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address')
      .test('email-dot', 'The email address must contain a dot (.) after the @ symbol', (value) => {
        return value.includes('.') && value.indexOf('.') > value.indexOf('@');
      })
      .validateSync(email.value);
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      emailError.value = err.message;
    }
    return false;
  }
};

const clearErrors = () => {
  emailError.value = '';
  resetError.value = '';
};

const resetForm = () => {
  email.value = '';
  sent.value = false;
  clearErrors();
};

const handleSubmit = async () => {
  clearErrors();

  if (!validateEmail()) {
    return;
  }

  try {
    const response = await authStore.requestPasswordReset(email.value);

    if (response?.data?.status === 'success') {
      sent.value = true;
    } else if (response?.data?.status === 'error') {
      sent.value = true;
    } else {
      resetError.value = 'Something went wrong. Please try again later.';
    }
  } catch (error) {
    resetError.value = 'Something went wrong. Please try again later.';
    console.error('Password reset request error:', error);
  }
};
</script>
