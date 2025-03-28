<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <h1 class="text-40 font-medium text-center text-white">Enter Details</h1>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-8 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <div class="flex flex-col gap-6">
          <!-- First Name -->
          <TrustyField
            v-model="name"
            label="First Name"
            :disabled="loading"
            placeholder="First Name"
            inputClass="!bg-[#313131] text-18"
            :error="signUpValidatedErrors?.name"
            @update:modelValue="changeModel('name')"
          />
          <!-- Last Name -->
          <TrustyField
            v-model="lastName"
            label="Last Name"
            :disabled="loading"
            placeholder="Last Name"
            inputClass="!bg-[#313131] text-18"
            :error="signUpValidatedErrors?.last_name"
            @update:modelValue="changeModel('last_name')"
          />
          <!-- Email -->
          <TrustyField
            v-model="email"
            label="E-mail Address"
            :disabled="loading"
            placeholder="E-mail Address"
            inputClass="!bg-[#313131] text-18"
            :error="signUpValidatedErrors?.email"
            @update:modelValue="changeModel('email')"
          />
          <!-- Mobile -->
          <TrustyField
            type="tel"
            v-model="phone"
            :disabled="loading"
            @country-changed="countryChanged"
            label="Mobile Phone Number"
            inputClass="!bg-[#313131] text-18"
            @update:modelValue="changeModel('phone')"
          />
        </div>

        <p v-if="errorResponse" class="text-red-400">{{ errorResponse }}</p>

        <!-- Submit Button -->
        <TrustyButton title="Next" size="large" class="grid place-items-center" :disabled="loading">
          <PreloaderAnimIcon class="size-6" theme="black" v-if="loading" />
          <p class="text-18 font-medium" v-else>Next</p>
        </TrustyButton>

        <!-- Sign In Link -->
        <p class="text-center text-white/60">
          Already have an account?
          <span
            @click="router.push('/auth/sign-in')"
            class="text-white cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { VueTelInputCountryObject } from '@/types/type';
import { storeToRefs } from 'pinia';

const router = useRouter();

const email = ref('');
const name = ref('');
const lastName = ref('');
const phone = ref('');
const authStore = useAuthStore();
const { loading } = storeToRefs(authStore);
const errorResponse = ref('');
const dialCode = ref('');

const signUpValidatedErrors = ref({}) as { [key: string]: any };

const countryChanged = (country: VueTelInputCountryObject) => {
  dialCode.value = country.dialCode;
};

const changeModel = (fieldName: string) => {
  errorResponse.value = '';
  signUpValidatedErrors.value[fieldName] = false;
};

const signUpValidateRules = yup.object({
  name: yup
    .string()
    .required('First name is required')
    .max(255)
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .max(255)
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test(
      'email-dot',
      'The email address must contain a dot (.) in the second part (after the @ symbol)',
      (value) => {
        return value.includes('.') && value.indexOf('.') > value.indexOf('@');
      }
    ),
  phone: yup.string(),
  country_code: yup.string(),
});

const handleSubmit = async () => {
  errorResponse.value = '';
  signUpValidatedErrors.value = {};

  const signUpValidated = await signUpValidateRules
    .validate(
      {
        email: email.value,
        name: name.value,
        last_name: lastName.value,
        phone: phone.value,
        country_code: dialCode.value,
      },
      { abortEarly: false }
    )
    .then((values) => values)
    .catch((errors: yup.ValidationError) => {
      errors.inner.forEach((error) => {
        if (error.path) {
          signUpValidatedErrors.value[error.path] = true;
          errorResponse.value = error.message;
        }
      });

      return false;
    });

  if (typeof signUpValidated === 'boolean') return;

  try {
    const response = await authStore.sendCode(signUpValidated);

    if ([203, 429].includes(response.status)) {
      errorResponse.value = response.data.message;
    } else if ([200, 208].includes(response.status)) {
      authStore.updateRegisterInfo({
        step: 2,
        name: signUpValidated.name,
        last_name: signUpValidated.last_name,
        phone: signUpValidated?.phone || '',
        country_code: signUpValidated?.country_code || '',
        email: signUpValidated.email,
      });

      router.push('/auth/email-verification');
    } else {
      errorResponse.value = 'Failed. Try again later';
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    errorResponse.value = 'Failed. Try again later';
  }
};
</script>
