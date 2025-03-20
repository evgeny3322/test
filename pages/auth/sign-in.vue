<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <h1 class="text-40 font-medium text-center text-white">Sign in</h1>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-8 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <!-- Email -->
        <TrustyField
          v-model="email"
          label="E-mail Address"
          placeholder="E-mail Address"
          inputClass="!bg-[#313131] text-18"
          :error="!!authErrors.email"
        />
        <!-- Password -->
        <TrustyField
          type="password"
          v-model="password"
          label="Password"
          placeholder="Password"
          inputClass="!bg-[#313131] text-18"
          :error="!!authErrors.password"
        />

        <!-- Error message -->
        <p v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</p>

        <!-- Recover Password -->
        <p class="text-white/60 cursor-pointer hover:text-white duration-200">Recover password</p>

        <!-- Submit Button -->
        <TrustyButton
          title="Sign in"
          size="large"
          :disabled="authStore.loading"
          class="relative h-[50px] flex justify-center items-center"
        >
          <div v-if="authStore.loading" class="absolute inset-0 flex items-center justify-center">
            <PreloaderAnimIcon class="size-6" theme="black" />
          </div>
          <p v-else class="text-18 font-medium">Sign in</p>
        </TrustyButton>

        <!-- Register link -->
        <p class="text-center text-white/60">
          Don't have an account?
          <span
            @click="router.push('/auth/sign-up')"
            class="text-white cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const authErrors = reactive({
  email: false,
  password: false,
});

const loginError = ref('');

const authValidateRules = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test('email-dot', 'The email address must contain a dot (.) after the @ symbol', (value) => {
      return value.includes('.') && value.indexOf('.') > value.indexOf('@');
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const validateForm = async () => {
  try {
    await authValidateRules.validate(
      { email: email.value, password: password.value },
      { abortEarly: false }
    );
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      authErrors.email = false;
      authErrors.password = false;

      err.inner.forEach((error) => {
        if (error.path === 'email') {
          authErrors.email = true;
          loginError.value = error.message;
        }
        if (error.path === 'password') {
          authErrors.password = true;
          loginError.value = error.message;
        }
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  loginError.value = '';

  const isValid = await validateForm();
  if (!isValid) return;

  try {
    const success = await authStore.login(email.value, password.value);

    if (success) {
      const redirectTo = authStore.getIntendedRoute();
      router.push(redirectTo);
    } else {
      loginError.value = 'Invalid email or password';
    }
  } catch (error: any) {
    loginError.value = error?.message || 'An error occurred during login';
  }
};
</script>
