<template>
  <div
    class="bg-tertiary-black px-6 py-8 lg:p-8 grid grid-row-28 lg:grid-row-13 grid-cols-12 gap-4 items-end rounded-2xl"
  >
    <trusty-complete
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-2"
      variant="outlined"
      selectClass="p-[22px] h-[64px] rounded-2xl"
      :options="options"
      v-model="agency.prefix"
    />
    <trusty-field
      disabled
      class="col-span-12 lg:col-span-5"
      v-model="first_name"
      label="Contact Person"
    />
    <trusty-field disabled class="col-span-12 lg:col-span-5" v-model="last_name" />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.company_name"
      label="Company name"
    />
    <trusty-field disabled class="lg:col-span-6 col-span-12" v-model="email" />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.iata_code"
      label="IATA Code"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.alternative_industry_code"
      label="Alternative Industry Code"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.vat"
      :label="`VAT number<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.fiscal_code"
      label="Fiscal Code"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.tax_id_code"
      label="Tax ID code"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.sdi_code"
      label="SDI Code"
    />
    <trusty-complete
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-4"
      variant="outlined"
      selectClass="p-[22px] h-[64px] rounded-2xl"
      :options="countries"
      v-model="agency.country"
      :label="`Country <span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-4"
      v-model="agency.region"
      :label="`Region/State/Province<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-4"
      v-model="agency.city"
      :label="`City<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.cap_zip"
      :label="`CAP/ZIP<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.address"
      :label="`Address<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12 lg:col-span-3"
      v-model="agency.internal_number"
      label="Internal number"
    />
    <trusty-field
      :ready="mainPhoneReady"
      :disabled="disabledForm"
      type="tel"
      :default-country="mainPhoneCountry"
      class="lg:col-span-6 col-span-12"
      v-model="agency.company_main_phone"
      @country-changed="(c) => (agency.company_main_phone_code = c.dialCode)"
      :label="`Company Main Phone<span style='color:red'>*</span>`"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.company_main_email"
      :label="`Company Main email<span style='color:red'>*</span>`"
    />
    <trusty-field
      :ready="opsReady"
      :disabled="disabledForm"
      type="tel"
      :defaultCountry="opsCountry"
      class="lg:col-span-6 col-span-12"
      v-model="agency.operations_phone"
      @country-changed="(c) => (agency.operations_phone_code = c.dialCode)"
      label="Operations Phone"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.operations_email"
      label="Operations email"
    />
    <trusty-field
      :ready="bookingReady"
      :disabled="disabledForm"
      type="tel"
      :defaultCountry="bookingCountry"
      class="lg:col-span-6 col-span-12"
      v-model="agency.booking_phone"
      @country-changed="(c) => (agency.booking_phone_code = c.dialCode)"
      label="Booking Phone"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.booking_email"
      label="Booking Email"
    />
    <trusty-field
      :ready="adminReady"
      :disabled="disabledForm"
      type="tel"
      :defaultCountry="adminCountry"
      class="lg:col-span-6 col-span-12"
      v-model="agency.administration_phone"
      @country-changed="(c) => (agency.administration_phone_code = c.dialCode)"
      label="Administration Phone"
    />
    <trusty-field
      :disabled="disabledForm"
      class="lg:col-span-6 col-span-12"
      v-model="agency.administration_email"
      label="Administration email"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12"
      v-model="agency.erp"
      label="ERP Enterprise resource planning used"
    />
    <trusty-field
      :disabled="disabledForm"
      class="col-span-12"
      v-model="agency.notes"
      label="Additional notes"
    />
    <trusty-button
      v-if="!disabledForm"
      :disabled="disabledForm"
      class="col-span-12 mt-6"
      :loading="loading"
      @click="updateAgency"
    >
      Save
    </trusty-button>
    <trusty-button v-else class="col-span-12 mt-6" @click="disabledForm = !disabledForm">
      Edit
    </trusty-button>
  </div>
</template>
<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import { computed, onMounted, ref } from 'vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';
import { useDefaultCountry } from '@/composables/useDefaultCountry';
import { countries } from '@/constants/countries';

const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);
const first_name = ref(user?.value?.first_name || '');
const last_name = ref(user?.value?.last_name || '');
const email = ref(user?.value?.email || '');
const disabledForm = ref<boolean>(true);
const options = [
  {
    label: 'Mr.',
    value: 'Mr',
  },
  {
    label: 'Mrs.',
    value: 'Mrs',
  },
  {
    label: 'Ms.',
    value: 'Ms',
  },
  {
    label: 'Miss.',
    value: 'Miss',
  },
  {
    label: 'Mx.',
    value: 'Mx',
  },
  {
    label: 'Dr.',
    value: 'Dr',
  },
  {
    label: 'Prof.',
    value: 'Prof',
  },
];
const agency = ref({
  prefix: '',
  company_name: '',
  iata_code: '',
  alternative_industry_code: '',
  vat: '',
  fiscal_code: '',
  tax_id_code: '',
  sdi_code: '',
  country: '',
  region: '',
  city: '',
  cap_zip: '',
  address: '',
  internal_number: '',
  company_main_phone: '',
  company_main_phone_code: '',
  company_main_email: '',
  operations_phone: '',
  operations_phone_code: '',
  operations_email: '',
  booking_phone: '',
  booking_phone_code: '',
  booking_email: '',
  administration_phone: '',
  administration_phone_code: '',
  administration_email: '',
  erp: '',
  notes: '',
});

const { defaultCountry: mainPhoneCountry, ready: mainPhoneReady } = useDefaultCountry(
  computed(() => agency.value.company_main_phone_code)
);

const { defaultCountry: bookingCountry, ready: bookingReady } = useDefaultCountry(
  computed(() => agency.value.booking_phone_code)
);

const { defaultCountry: opsCountry, ready: opsReady } = useDefaultCountry(
  computed(() => agency.value.operations_phone_code)
);

const { defaultCountry: adminCountry, ready: adminReady } = useDefaultCountry(
  computed(() => agency.value.administration_phone_code)
);

const cleanPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

const createAgency = async () => {
  const cleanedData = {
    ...agency.value,
    company_main_phone: cleanPhone(agency.value.company_main_phone),
    booking_phone: cleanPhone(agency.value.booking_phone),
    administration_phone: cleanPhone(agency.value.administration_phone),
    operations_phone: cleanPhone(agency.value.operations_phone),
  };

  try {
    const response = await authStore.createAgency(cleanedData);
    await showAgencyInfo();
  } catch (err) {
    console.error(err);
  }
};
const updateAgency = async () => {
  const cleanedData = {
    ...agency.value,
    company_main_phone: cleanPhone(agency.value.company_main_phone),
    booking_phone: cleanPhone(agency.value.booking_phone),
    administration_phone: cleanPhone(agency.value.administration_phone),
    operations_phone: cleanPhone(agency.value.operations_phone),
  };

  try {
    const response = await authStore.updateAgency(cleanedData);
    await showAgencyInfo();
  } catch (err) {
    console.error(err);
  }
};
const showAgencyInfo = async () => {
  try {
    const response = await authStore.getAgencyInfo();
    if (response.status === 'success') {
      agency.value = response.data;
    }
    disabledForm.value = true;
  } catch (err) {
    console.log(err);
  }
};
onMounted(async () => {
  await showAgencyInfo();
});
</script>
