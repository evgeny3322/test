<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <div class="relative">
      <div
        class="px-[9.5%] absolute -top-9 md:inset-0 md:ml-4 flex items-center gap-4 cursor-pointer"
        @click="goBack()"
      >
        <ArrowDownOutlinedIcon class="rotate-90 stroke-[1.5px] h-3 w-[18px]" />
        <p>Go Back</p>
      </div>
      <h1 class="text-40 font-medium text-center text-white">Finalize Registration</h1>
    </div>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-6 w-[552px] flex flex-col gap-8 rounded-2xl"
        autocomplete="off"
      >
        <!-- Error message -->
        <p v-if="registrationError" class="text-red-500 text-sm text-center">
          {{ registrationError }}
        </p>

        <!-- password -->
        <div class="relative">
          <TrustyField
            type="password"
            v-model="passwords.password"
            placeholder="Password"
            inputClass="!bg-[#313131] text-18"
            :error="passwordsError?.params?.path == 'password'"
            @update:modelValue="passwordsError = null"
          />
          <div
            class="tooltip_input_info tooltip bg-[#FFFFFF] text-[#2B2D32] dark:bg-[#3D4043] dark:text-[#878787]"
            v-if="passwordsError?.params?.path == 'password'"
          >
            <p>
              At least 8 characters, at least one capital and small letter, number and special
              character.
            </p>
          </div>
        </div>
        <!-- passwordConfirm -->
        <div class="relative">
          <TrustyField
            type="password"
            v-model="passwords.password_confirmation"
            placeholder="Confirm password"
            inputClass="!bg-[#313131] text-18"
            :error="passwordsError?.params?.path == 'password_confirmation'"
            @update:modelValue="passwordsError = null"
          />
          <div
            class="tooltip_input_info tooltip bg-[#FFFFFF] text-[#2B2D32] dark:bg-[#3D4043] dark:text-[#878787]"
            v-if="passwordsError?.params?.path == 'password_confirmation'"
          >
            <p>Your password and confirmation password must match.</p>
          </div>
        </div>
        <!-- Radio Buttons -->
        <div class="flex flex-col gap-4">
          <TrustyRadio v-model="accountType" name="accountType" value="private" text="Private" />
          <TrustyRadio
            v-model="accountType"
            name="accountType"
            value="request_for_agency"
            text="Agency"
          />
        </div>
        <div v-if="accountType == 'request_for_agency'" class="flex flex-col gap-6">
          <div class="flex gap-6">
            <TrustyField
              v-model="agencyData.company_name"
              label="Company name*"
              placeholder="Company name"
              inputClass="!bg-[#313131] text-18"
              :error="agencyErrors['company_name']"
              @update:modelValue="changeModel('company_name')"
            />
            <TrustyField
              v-model="agencyData.invoice_vat"
              label="VAT number*"
              placeholder="VAT number*"
              inputClass="!bg-[#313131] text-18"
              :error="agencyErrors['invoice_vat']"
              @update:modelValue="changeModel('invoice_vat')"
            />
          </div>
          <div class="flex gap-6">
            <TrustyComplete
              v-model="agencyData.invoice_country"
              variant="outlined"
              selectClass="h-[64px] !bg-[#313131] text-18 px-5"
              ulClass="top-full"
              containerClass="flex flex-col justify-between"
              :options="countries.map((e) => ({ value: e, label: e }))"
              placeholder="Select Country"
              label="Country*"
              :error="agencyErrors['invoice_country']"
              @update:modelValue="changeModel('invoice_country')"
            />
            <TrustyField
              v-model="agencyData.invoice_state"
              label="Region/State/Province*"
              placeholder="Region/State/Province"
              inputClass="!bg-[#313131] text-18 !w-[15rem]"
              :error="agencyErrors['invoice_state']"
              @update:modelValue="changeModel('invoice_state')"
            />
          </div>

          <TrustyField
            v-model="agencyData.invoice_city"
            label="City*"
            placeholder="City"
            inputClass="!bg-[#313131] text-18 !w-[15rem]"
            :error="agencyErrors['invoice_city']"
            @update:modelValue="changeModel('invoice_city')"
          />
          <TrustyField
            v-model="agencyData.invoice_address"
            label="Address*"
            placeholder="Address"
            inputClass="!bg-[#313131] text-18 !w-[15rem]"
            :error="agencyErrors['invoice_address']"
            @update:modelValue="changeModel('invoice_address')"
          />
          <TrustyField
            type="tel"
            v-model="agencyData.office_phone"
            label="Company Main Phone*"
            @country-changed="countryChanged"
            inputClass="!bg-[#313131] text-18 !w-[15rem]"
            :error="agencyErrors['office_phone']"
            @update:modelValue="changeModel('office_phone')"
          />
          <TrustyField
            v-model="agencyData.company_email"
            label="Company Main Email*"
            placeholder="Company Main Email"
            inputClass="!bg-[#313131] text-18 !w-[15rem]"
            :error="agencyErrors['company_email']"
            @update:modelValue="changeModel('company_email')"
          />
          <TrustyField
            v-model="agencyData.invoice_zip"
            label="Postal/ZIP code*"
            placeholder="Postal/ZIP code"
            inputClass="!bg-[#313131] text-18 !w-[15rem]"
            :error="agencyErrors['invoice_zip']"
            @update:modelValue="changeModel('invoice_zip')"
          />
        </div>

        <!-- Submit Button -->
        <TrustyButton title="Complete Registration" size="large" :disabled="authStore.loading">
          <PreloaderAnimIcon class="size-6" theme="black" v-if="authStore.loading" />
          <p v-else class="text-18 font-medium">Complete Registration</p>
        </TrustyButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive, computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import TrustyRadio from '@/components/ui/TrustyRadio.vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import PreloaderAnimIcon from '@/components/icons/PreloaderAnimIcon.vue';
import { useRouter } from 'vue-router';
import { VueTelInputCountryObject } from '@/types/type';
import { countries } from '@/constants';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const agencyData = reactive({
  company_name: '',
  invoice_vat: '',
  invoice_country: '',
  invoice_state: '',
  invoice_city: '',
  invoice_address: '',
  office_phone: '',
  company_email: '',
  invoice_zip: '',
});

const passwords = reactive({
  password: '',
  password_confirmation: '',
});

const passwordsError = ref(null) as Ref<yup.ValidationError | null>;
const agencyErrors: any = reactive({});
const officePhoneCode = ref('');
const accountType = ref('private');
const registrationError: any = ref('');

// Computed property to check if we can proceed
const canProceed = computed(() => {
  return authStore.registerInfo?.email && authStore.registerInfo?.hash;
});

// Redirect if there's no registration info or required hash
if (process.client && !canProceed.value) {
  router.push('/auth/sign-up');
}

const countryChanged = (country: VueTelInputCountryObject) => {
  officePhoneCode.value = country.dialCode;
};

const goBack = () => {
  router.push('/auth/email-verification');
};

const validatePasswords = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one special character'),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const validateAgency = yup.object({
  company_name: yup.string().required(),
  invoice_vat: yup.string().required(),
  invoice_country: yup.string().required(),
  invoice_state: yup.string().required(),
  invoice_city: yup.string().required(),
  invoice_address: yup.string().required(),
  company_email: yup
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
  invoice_zip: yup.string().required(),
  office_phone: yup.string().required(),
});

type PasswordData = yup.InferType<typeof validatePasswords>;
type AgencyData = yup.InferType<typeof validateAgency> & { office_phone_code: string };
type CombinedData = PasswordData & Partial<AgencyData>;

const changeModel = (fieldName: string) => {
  agencyErrors[fieldName] = false;
};

const handleSubmit = async () => {
  registrationError.value = '';

  // Validate passwords
  const passwordsValidate = await validatePasswords
    .validate(passwords)
    .then(() => {
      passwordsError.value = null;
      return true;
    })
    .catch((errors) => {
      passwordsError.value = errors;
      return false;
    });

  if (!passwordsValidate) return;

  // Prepare data for API
  let data: any = {
    password: passwords.password,
    password_confirmation: passwords.password_confirmation,
    type: accountType.value,
    hash: authStore.registerInfo?.hash,
    email: authStore.registerInfo?.email,
  };

  // Validate and add agency data if needed
  if (accountType.value !== 'private') {
    const agencyValidate = await validateAgency
      .validate(agencyData, { abortEarly: false })
      .then((values) => values)
      .catch((errors: yup.ValidationError) => {
        errors.inner.forEach((error) => {
          if (error.path) {
            agencyErrors[error.path] = true;
          }
        });
        return false;
      });

    if (typeof agencyValidate === 'object' && agencyValidate) {
      data = {
        ...data,
        ...agencyValidate,
        countryCode: officePhoneCode.value,
      };
    } else {
      return;
    }
  }

  try {
    const response = await authStore.setPassword(data);

    if (response && response.data && response.data.status === 'success') {
      // After successful registration, we can login the user
      await authStore.login(authStore.registerInfo!.email, passwords.password);

      // Redirect to account or dashboard
      router.push('/account');
    } else {
      if (typeof response !== 'boolean') {
        registrationError.value =
          response?.data?.message || 'Registration failed. Please try again.';
      }
    }
  } catch (error: any) {
    registrationError.value = error?.message || 'An error occurred during registration';
  }
};
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
