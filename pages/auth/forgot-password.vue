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
          <p v-else class="text-18 font-medium">Send</p>
        </TrustyButton>
      </form>
    </div>

    <TrustyModal
      v-model="showSuccessModal"
      :show-close-button="false"
      :show-default-footer="true"
      :close-on-backdrop="true"
      action-button-text="OK"
      @confirm="router.push('/auth/sign-in')"
      @close="router.push('/auth/sign-in')"
    >
      <template #header>
        <h2 class="text-[40px] font-bold text-center text-white">Confirm your email</h2>
      </template>

      <div class="flex flex-col items-center py-4 px-6 text-center">
        <p class="text-white text-18">
          A message is sent to your e-mail address for confirmation of password reset
        </p>
      </div>
    </TrustyModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import TrustyModal from '@/components/ui/TrustyModal.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const emailError = ref('');
const resetError = ref('');
const showSuccessModal = ref(false);

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

const handleSubmit = async () => {
  clearErrors();

  if (!validateEmail()) {
    return;
  }

  try {
    const response = await authStore.requestPasswordReset(email.value);

    if (response?.data?.status === 'success' || response?.data?.status === 'error') {
      showSuccessModal.value = true;
    } else {
      resetError.value = 'Something went wrong. Please try again later.';
    }
  } catch (error) {
    resetError.value = 'Something went wrong. Please try again later.';
    console.error('Password reset request error:', error);
  }
};
</script>
