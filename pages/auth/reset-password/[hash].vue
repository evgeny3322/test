<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <h1 class="text-40 font-medium text-center text-white">Creat a new password</h1>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-8 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <div v-if="!resetSuccess">
          <div class="relative mb-4">
            <TrustyField
              type="password"
              v-model="password"
              label="New Password"
              placeholder="Enter new password"
              inputClass="!bg-[#313131] text-18"
              :error="passwordsError?.params?.path === 'password'"
              @update:modelValue="passwordsError = null"
            />
            <div
              class="tooltip_input_info tooltip bg-[#FFFFFF] text-[#2B2D32] dark:bg-[#3D4043] dark:text-[#878787]"
              v-if="passwordsError?.params?.path === 'password'"
            >
              <p>
                At least 8 characters, at least one capital and small letter, number and special
                character.
              </p>
            </div>
          </div>

          <div class="relative mb-4">
            <TrustyField
              type="password"
              v-model="passwordConfirmation"
              label="Confirm New Password"
              placeholder="Confirm new password"
              inputClass="!bg-[#313131] text-18"
              :error="passwordsError?.params?.path === 'passwordConfirmation'"
              @update:modelValue="passwordsError = null"
            />
            <div
              class="tooltip_input_info tooltip bg-[#FFFFFF] text-[#2B2D32] dark:bg-[#3D4043] dark:text-[#878787]"
              v-if="passwordsError?.params?.path === 'passwordConfirmation'"
            >
              <p>Your password and confirmation password must match.</p>
            </div>
          </div>

          <p v-if="resetError" class="text-red-500 text-sm">{{ resetError }}</p>

          <TrustyButton
            title="Reset Password"
            size="large"
            :disabled="authStore.loading"
            class="relative h-[50px] flex justify-center items-center mt-4"
          >
            <div v-if="authStore.loading" class="absolute inset-0 flex items-center justify-center">
              <PreloaderAnimIcon class="size-6" theme="black" />
            </div>
            <p v-else class="text-18 font-medium">Reset Password</p>
          </TrustyButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { useRouter, useRoute } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const hash = ref(route.params.hash as string);
const password = ref('');
const passwordConfirmation = ref('');
const resetError = ref('');
const resetSuccess = ref(false);
const passwordsError = ref(null) as Ref<yup.ValidationError | null>;

const validatePasswords = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one special character'),
  passwordConfirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const handleSubmit = async () => {
  resetError.value = '';

  try {
    await validatePasswords.validate({
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      passwordsError.value = err;
    }
    return;
  }

  try {
    const response = await authStore.resetPassword(hash.value, password.value);

    if (response?.data?.status === 'success') {
      resetSuccess.value = true;
    } else {
      resetError.value = response?.data?.message || 'Password reset failed. Please try again.';
    }
  } catch (error) {
    resetError.value = 'Something went wrong. Please try again later.';
    console.error('Password reset error:', error);
  }
};

onMounted(() => {
  if (!hash.value) {
    router.push('/auth/forgot-password');
  }
});
</script>

<style>
.tooltip_input_info {
  position: absolute;
  width: 240px;
  top: -70px;
  right: -40%;
}
.tooltip {
  border-radius: 16px;
  padding: 16px 19px;
  font-size: 14px;
  line-height: 15px;
  cursor: help;
}
</style>
