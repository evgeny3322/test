<template>
  <div class="my-[62px] flex flex-col gap-[62px]">
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
        />
        <!-- Password -->
        <TrustyField
          type="password"
          v-model="password"
          label="Password"
          placeholder="Password"
          inputClass="!bg-[#313131] text-18"
        />
        <!-- Recover Password -->
        <p class="text-white/60 cursor-pointer hover:text-white duration-200">Recover password</p>

        <!-- Submit Button -->

        <TrustyButton title="Sign in" size="large">
          <p class="text-18 font-medium">Sign in</p>
        </TrustyButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore'; // Pinia Store
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const router = useRouter();

const email = ref('');
const password = ref('');
const authErrors = ref({}) as { [key: string]: any };
const authStore = useAuthStore();

const authValidateRules = yup.object({
  email: yup
    .string()
    .email()
    .required()
    .test(
      'email-dot',
      'The email address must contain a dot (.) in the second part (after the @ symbol), as addresses without a dot will not be accepted',
      (value) => {
        return value.includes('.');
      }
    ),
  password: yup.string().required().min(8),
});

const handleSubmit = async () => {
  const authValidate = await authValidateRules
    .validate({ email: email.value, password: password.value }, { abortEarly: false })
    .then((values) => values)
    .catch((errors) => {
      authErrors.value = errors;
      return false;
    });

  if (!authValidate) return;

  // router.push('')

  // try {
  //   await authStore.login(email.value, password.value);
  // } catch (error) {
  //   console.error('Ошибка входа', error);
  // }
};
</script>
