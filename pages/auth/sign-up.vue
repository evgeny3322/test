<template>
  <div class="my-[62px] flex flex-col gap-[62px]">
    <h1 class="text-40 font-medium text-center text-white">Enter Details</h1>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-8 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <div class="flex flex-col gap-6">
          <!-- First Name -->
          <TrustyField
            v-model="firstName"
            label="First Name"
            placeholder="First Name"
            inputClass="!bg-[#313131] text-18"
          />
          <!-- Last Name -->
          <TrustyField
            v-model="lastName"
            label="Last Name"
            placeholder="Last Name"
            inputClass="!bg-[#313131] text-18"
          />
          <!-- Password -->
          <TrustyField
            v-model="email"
            label="E-mail Address"
            placeholder="E-mail Address"
            inputClass="!bg-[#313131] text-18"
          />
          <!-- Mobile -->
          <TrustyField
            type="tel"
            v-model="phone"
            label="Mobile Phone Number"
            inputClass="!bg-[#313131] text-18"
          />
        </div>

        <!-- Submit Button -->
        <TrustyButton title="Next" size="large">
          <p class="text-18 font-medium">Next</p>
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
const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const authStore = useAuthStore();

const signUpValidatedErrors = ref({}) as { [key: string]: any };

const signUpValidateRules = yup.object({
  first_name: yup.string().required().max(255).min(2),
  last_name: yup.string().required().max(255).min(2),
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
  phone: yup.string().required(),
});

const handleSubmit = async () => {
  const signUpValidated = await signUpValidateRules
    .validate({
      email: email.value,
      first_name: firstName.value,
      last_name: lastName.value,
      phone: phone.value,
    })
    .then((values) => values)
    .catch((errors) => {
      signUpValidatedErrors.value = errors;
      return false;
    });

  if (!signUpValidated) return;

  router.push('/auth/email-verification');

  // try {
  //   await authStore.login(email.value, password.value);
  // } catch (error) {
  //   console.error('Ошибка входа', error);
  // }
};
</script>
