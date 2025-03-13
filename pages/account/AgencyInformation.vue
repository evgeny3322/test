<template>
  <div class="bg-tertiary-black p-8 grid grid-row-13 grid-cols-12 gap-4 items-end rounded-main-sm">
    <trusty-complete
      class="col-span-2"
      variant="outlined"
      selectClass="p-[22px] h-[64px]"
      :options="options"
      v-model="agency.title"
    />
    <trusty-field class="col-span-5" v-model="agency.first_name" label="Contact Person" />
    <trusty-field class="col-span-5" v-model="agency.last_name" />
    <trusty-field class="col-span-6" v-model="agency.company_name" label="Company name" />
    <trusty-field class="col-span-6" v-model="agency.email" />
    <trusty-field class="col-span-6" v-model="agency.iata_code" />
    <trusty-field
      class="col-span-6"
      v-model="agency.alternative_industry_code"
      label="Alternative Industry Code"
    />
    <trusty-field class="col-span-3" v-model="agency.vat" />
    <trusty-field class="col-span-3" v-model="agency.fiscal_code" />
    <trusty-field class="col-span-3" v-model="agency.tax_id_code" />
    <trusty-field class="col-span-3" v-model="agency.sdi_code" />
    <trusty-complete
      class="col-span-4"
      variant="outlined"
      selectClass="p-[22px] h-[64px]"
      :options="options"
      v-model="agency.country"
      :label="`Country <span style='color:red'>*</span>`"
    />
    <trusty-complete
      class="col-span-4"
      variant="outlined"
      selectClass="p-[22px] h-[64px]"
      :options="options"
      v-model="agency.country"
      :label="`Region/State/Province<span style='color:red'>*</span>`"
    />
    <trusty-complete
      class="col-span-4"
      variant="outlined"
      selectClass="p-[22px] h-[64px]"
      :options="options"
      v-model="agency.country"
      :label="`City<span style='color:red'>*</span>`"
    />
    <trusty-field
      class="col-span-3"
      v-model="agency.cap_zip"
      :label="`CAP/ZIP<span style='color:red'>*</span>`"
    />
    <trusty-field
      class="col-span-6"
      v-model="agency.address"
      :label="`Address<span style='color:red'>*</span>`"
    />
    <trusty-field class="col-span-3" v-model="agency.internal_number" label="Internal number" />
    <trusty-field
      type="tel"
      class="col-span-6"
      v-model="agency.company_main_phone"
      :label="`Company Main Phone<span style='color:red'>*</span>`"
    />
    <trusty-field
      class="col-span-6"
      v-model="agency.company_main_email"
      :label="`Company Main email<span style='color:red'>*</span>`"
    />
    <trusty-field
      type="tel"
      class="col-span-6"
      v-model="agency.operations_phone"
      label="Operations Phone"
    />
    <trusty-field class="col-span-6" v-model="agency.operations_email" label="Operations email" />
    <trusty-field
      type="tel"
      class="col-span-6"
      v-model="agency.operations_phone"
      label="Operations Phone"
    />
    <trusty-field class="col-span-6" v-model="agency.booking_phone" label="Booking Phone" />
    <trusty-field
      type="tel"
      class="col-span-6"
      v-model="agency.administration_phone"
      label="Administration Phone"
    />
    <trusty-field
      class="col-span-6"
      v-model="agency.administration_email"
      label="Administration email"
    />
    <trusty-field
      class="col-span-12"
      v-model="agency.erp_enterprise"
      label="ERP Enterprise resource planning used"
    />
    <trusty-field class="col-span-12" v-model="agency.additional_notes" label="Additional notes" />
    <trusty-button class="col-span-12 mt-6"> Save </trusty-button>
  </div>
</template>
<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import { ref } from 'vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';

const options = [
  {
    label: 'Mr.',
    value: 'Mr.',
  },
  {
    label: 'Mrs.',
    value: 'Mrs.',
  },
  {
    label: 'Ms.',
    value: 'Ms.',
  },
  {
    label: 'Miss.',
    value: 'Miss.',
  },
  {
    label: 'Dr.',
    value: 'Dr.',
  },
  {
    label: 'Prof.',
    value: 'Prof.',
  },
];
const agency = ref({
  company_name: '',
  title: '',
  first_name: '',
  last_name: '',
  email: '',
  vat: '',
  fiscal_code: '',
  tax_id_code: '',
  sdi_code: '',
  country: '',
  address: '',
  cap_zip: '',
  region: '',
  city: '',
  iata_code: '',
  internal_number: '',
  alternative_industry_code: '',
  company_main_phone: '',
  company_main_phone_code: '',
  company_main_email: '',
  operations_phone: '',
  operations_phone_code: '',
  operations_email: '',
  booking_email: '',
  booking_phone: '',
  booking_phone_code: '',
  administration_phone: '',
  administration_phone_code: '',
  administration_email: '',
  erp_enterprise: '',
  additional_notes: '',
});
</script>
