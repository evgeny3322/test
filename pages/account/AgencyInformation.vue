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
      label="SDI Codee"
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
      :disabled="disabledForm"
      type="tel"
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
      :disabled="disabledForm"
      type="tel"
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
      :disabled="disabledForm"
      type="tel"
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
      :disabled="disabledForm"
      type="tel"
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
      v-if="alreadyAgency"
      :disabled="disabledForm"
      class="col-span-12 mt-6"
      @click="updateAgency"
    >
      Save
    </trusty-button>
    <trusty-button v-else :disabled="disabledForm" class="col-span-12 mt-6" @click="createAgency">
      Create
    </trusty-button>
  </div>
</template>
<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import { onMounted, ref } from 'vue';
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useAuthStore } from '@/store/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user, alreadyAgency } = storeToRefs(authStore);
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
const countries = [
  {
    label: 'Åland Islands',
    value: 'Åland Islands',
  },
  {
    label: 'Afghanistan',
    value: 'Afghanistan',
  },
  {
    label: 'Akrotiri',
    value: 'Akrotiri',
  },
  {
    label: 'Albania',
    value: 'Albania',
  },
  {
    label: 'Algeria',
    value: 'Algeria',
  },
  {
    label: 'American Samoa',
    value: 'American Samoa',
  },
  {
    label: 'Andorra',
    value: 'Andorra',
  },
  {
    label: 'Angola',
    value: 'Angola',
  },
  {
    label: 'Anguilla',
    value: 'Anguilla',
  },
  {
    label: 'Antarctica',
    value: 'Antarctica',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'Antigua and Barbuda',
  },
  {
    label: 'Argentina',
    value: 'Argentina',
  },
  {
    label: 'Armenia',
    value: 'Armenia',
  },
  {
    label: 'Aruba',
    value: 'Aruba',
  },
  {
    label: 'Ashmore and Cartier Islands',
    value: 'Ashmore and Cartier Islands',
  },
  {
    label: 'Australia',
    value: 'Australia',
  },
  {
    label: 'Austria',
    value: 'Austria',
  },
  {
    label: 'Azerbaijan',
    value: 'Azerbaijan',
  },
  {
    label: 'Bahrain',
    value: 'Bahrain',
  },
  {
    label: 'Bangladesh',
    value: 'Bangladesh',
  },
  {
    label: 'Barbados',
    value: 'Barbados',
  },
  {
    label: 'Bassas Da India',
    value: 'Bassas Da India',
  },
  {
    label: 'Belarus',
    value: 'Belarus',
  },
  {
    label: 'Belgium',
    value: 'Belgium',
  },
  {
    label: 'Belize',
    value: 'Belize',
  },
  {
    label: 'Benin',
    value: 'Benin',
  },
  {
    label: 'Bermuda',
    value: 'Bermuda',
  },
  {
    label: 'Bhutan',
    value: 'Bhutan',
  },
  {
    label: 'Bolivia',
    value: 'Bolivia',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'Bosnia and Herzegovina',
  },
  {
    label: 'Botswana',
    value: 'Botswana',
  },
  {
    label: 'Bouvet Island',
    value: 'Bouvet Island',
  },
  {
    label: 'Brazil',
    value: 'Brazil',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'British Indian Ocean Territory',
  },
  {
    label: 'British Virgin Islands',
    value: 'British Virgin Islands',
  },
  {
    label: 'Brunei',
    value: 'Brunei',
  },
  {
    label: 'Bulgaria',
    value: 'Bulgaria',
  },
  {
    label: 'Burkina Faso',
    value: 'Burkina Faso',
  },
  {
    label: 'Burma',
    value: 'Burma',
  },
  {
    label: 'Burundi',
    value: 'Burundi',
  },
  {
    label: 'Cambodia',
    value: 'Cambodia',
  },
  {
    label: 'Cameroon',
    value: 'Cameroon',
  },
  {
    label: 'Canada',
    value: 'Canada',
  },
  {
    label: 'Cape Verde',
    value: 'Cape Verde',
  },
  {
    label: 'Caribbean Netherlands',
    value: 'Caribbean Netherlands',
  },
  {
    label: 'Cayman Islands',
    value: 'Cayman Islands',
  },
  {
    label: 'Central African Republic',
    value: 'Central African Republic',
  },
  {
    label: 'Chad',
    value: 'Chad',
  },
  {
    label: 'Chile',
    value: 'Chile',
  },
  {
    label: 'China',
    value: 'China',
  },
  {
    label: 'Christmas Island',
    value: 'Christmas Island',
  },
  {
    label: 'Clipperton Island',
    value: 'Clipperton Island',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'Cocos (Keeling) Islands',
  },
  {
    label: 'Colombia',
    value: 'Colombia',
  },
  {
    label: 'Comoros',
    value: 'Comoros',
  },
  {
    label: 'Cook Islands',
    value: 'Cook Islands',
  },
  {
    label: 'Coral Sea Islands',
    value: 'Coral Sea Islands',
  },
  {
    label: 'Costa Rica',
    value: 'Costa Rica',
  },
  {
    label: 'Cote D’Ivoire',
    value: 'Cote D’Ivoire',
  },
  {
    label: 'Croatia',
    value: 'Croatia',
  },
  {
    label: 'Cuba',
    value: 'Cuba',
  },
  {
    label: 'Curaçao',
    value: 'Curaçao',
  },
  {
    label: 'Cyprus',
    value: 'Cyprus',
  },
  {
    label: 'Czech Republic',
    value: 'Czech Republic',
  },
  {
    label: 'Democratic Republic of the Congo',
    value: 'Democratic Republic of the Congo',
  },
  {
    label: 'Denmark',
    value: 'Denmark',
  },
  {
    label: 'Dhekelia',
    value: 'Dhekelia',
  },
  {
    label: 'Djibouti',
    value: 'Djibouti',
  },
  {
    label: 'Dominica',
    value: 'Dominica',
  },
  {
    label: 'Dominican Republic',
    value: 'Dominican Republic',
  },
  {
    label: 'Ecuador',
    value: 'Ecuador',
  },
  {
    label: 'Egypt',
    value: 'Egypt',
  },
  {
    label: 'El Salvador',
    value: 'El Salvador',
  },
  {
    label: 'Equatorial Guinea',
    value: 'Equatorial Guinea',
  },
  {
    label: 'Eritrea',
    value: 'Eritrea',
  },
  {
    label: 'Estonia',
    value: 'Estonia',
  },
  {
    label: 'Ethiopia',
    value: 'Ethiopia',
  },
  {
    label: 'Europa Island',
    value: 'Europa Island',
  },
  {
    label: 'Falkland Islands (Islas Malvinas)',
    value: 'Falkland Islands (Islas Malvinas)',
  },
  {
    label: 'Faroe Islands',
    value: 'Faroe Islands',
  },
  {
    label: 'Federated States of Micronesia',
    value: 'Federated States of Micronesia',
  },
  {
    label: 'Fiji',
    value: 'Fiji',
  },
  {
    label: 'Finland',
    value: 'Finland',
  },
  {
    label: 'France',
    value: 'France',
  },
  {
    label: 'French Guiana',
    value: 'French Guiana',
  },
  {
    label: 'French Polynesia',
    value: 'French Polynesia',
  },
  {
    label: 'French Southern and Antarctic Lands',
    value: 'French Southern and Antarctic Lands',
  },
  {
    label: 'Gabon',
    value: 'Gabon',
  },
  {
    label: 'Gaza Strip',
    value: 'Gaza Strip',
  },
  {
    label: 'Georgia',
    value: 'Georgia',
  },
  {
    label: 'Germany',
    value: 'Germany',
  },
  {
    label: 'Ghana',
    value: 'Ghana',
  },
  {
    label: 'Gibraltar',
    value: 'Gibraltar',
  },
  {
    label: 'Glorioso Islands',
    value: 'Glorioso Islands',
  },
  {
    label: 'Greece',
    value: 'Greece',
  },
  {
    label: 'Greenland',
    value: 'Greenland',
  },
  {
    label: 'Grenada',
    value: 'Grenada',
  },
  {
    label: 'Guadeloupe',
    value: 'Guadeloupe',
  },
  {
    label: 'Guam',
    value: 'Guam',
  },
  {
    label: 'Guatemala',
    value: 'Guatemala',
  },
  {
    label: 'Guernsey',
    value: 'Guernsey',
  },
  {
    label: 'Guinea',
    value: 'Guinea',
  },
  {
    label: 'Guinea-bissau',
    value: 'Guinea-bissau',
  },
  {
    label: 'Guyana',
    value: 'Guyana',
  },
  {
    label: 'Haiti',
    value: 'Haiti',
  },
  {
    label: 'Heard Island and Mcdonald Islands',
    value: 'Heard Island and Mcdonald Islands',
  },
  {
    label: 'Holy See (Vatican City)',
    value: 'Holy See (Vatican City)',
  },
  {
    label: 'Honduras',
    value: 'Honduras',
  },
  {
    label: 'Hong Kong',
    value: 'Hong Kong',
  },
  {
    label: 'Hungary',
    value: 'Hungary',
  },
  {
    label: 'Iceland',
    value: 'Iceland',
  },
  {
    label: 'India',
    value: 'India',
  },
  {
    label: 'Indonesia',
    value: 'Indonesia',
  },
  {
    label: 'Iran',
    value: 'Iran',
  },
  {
    label: 'Iraq',
    value: 'Iraq',
  },
  {
    label: 'Ireland',
    value: 'Ireland',
  },
  {
    label: 'Isle of Man',
    value: 'Isle of Man',
  },
  {
    label: 'Israel',
    value: 'Israel',
  },
  {
    label: 'Italy',
    value: 'Italy',
  },
  {
    label: 'Jamaica',
    value: 'Jamaica',
  },
  {
    label: 'Jan Mayen',
    value: 'Jan Mayen',
  },
  {
    label: 'Japan',
    value: 'Japan',
  },
  {
    label: 'Jersey',
    value: 'Jersey',
  },
  {
    label: 'Jordan',
    value: 'Jordan',
  },
  {
    label: 'Juan De Nova Island',
    value: 'Juan De Nova Island',
  },
  {
    label: 'Kazakhstan',
    value: 'Kazakhstan',
  },
  {
    label: 'Kenya',
    value: 'Kenya',
  },
  {
    label: 'Kiribati',
    value: 'Kiribati',
  },
  {
    label: 'Kosovo',
    value: 'Kosovo',
  },
  {
    label: 'Kuwait',
    value: 'Kuwait',
  },
  {
    label: 'Kyrgyzstan',
    value: 'Kyrgyzstan',
  },
  {
    label: 'Laos',
    value: 'Laos',
  },
  {
    label: 'Latvia',
    value: 'Latvia',
  },
  {
    label: 'Lebanon',
    value: 'Lebanon',
  },
  {
    label: 'Lesotho',
    value: 'Lesotho',
  },
  {
    label: 'Liberia',
    value: 'Liberia',
  },
  {
    label: 'Libya',
    value: 'Libya',
  },
  {
    label: 'Liechtenstein',
    value: 'Liechtenstein',
  },
  {
    label: 'Lithuania',
    value: 'Lithuania',
  },
  {
    label: 'Luxembourg',
    value: 'Luxembourg',
  },
  {
    label: 'Macau',
    value: 'Macau',
  },
  {
    label: 'Macedonia',
    value: 'Macedonia',
  },
  {
    label: 'Madagascar',
    value: 'Madagascar',
  },
  {
    label: 'Malawi',
    value: 'Malawi',
  },
  {
    label: 'Malaysia',
    value: 'Malaysia',
  },
  {
    label: 'Maldives',
    value: 'Maldives',
  },
  {
    label: 'Mali',
    value: 'Mali',
  },
  {
    label: 'Malta',
    value: 'Malta',
  },
  {
    label: 'Marshall Islands',
    value: 'Marshall Islands',
  },
  {
    label: 'Martinique',
    value: 'Martinique',
  },
  {
    label: 'Mauritania',
    value: 'Mauritania',
  },
  {
    label: 'Mauritius',
    value: 'Mauritius',
  },
  {
    label: 'Mayotte',
    value: 'Mayotte',
  },
  {
    label: 'Mexico',
    value: 'Mexico',
  },
  {
    label: 'Moldova',
    value: 'Moldova',
  },
  {
    label: 'Monaco',
    value: 'Monaco',
  },
  {
    label: 'Mongolia',
    value: 'Mongolia',
  },
  {
    label: 'Montenegro',
    value: 'Montenegro',
  },
  {
    label: 'Montserrat',
    value: 'Montserrat',
  },
  {
    label: 'Morocco',
    value: 'Morocco',
  },
  {
    label: 'Mozambique',
    value: 'Mozambique',
  },
  {
    label: 'Myanmar',
    value: 'Myanmar',
  },
  {
    label: 'Namibia',
    value: 'Namibia',
  },
  {
    label: 'Nauru',
    value: 'Nauru',
  },
  {
    label: 'Navassa Island',
    value: 'Navassa Island',
  },
  {
    label: 'Nepal',
    value: 'Nepal',
  },
  {
    label: 'Netherlands',
    value: 'Netherlands',
  },
  {
    label: 'Netherlands Antilles',
    value: 'Netherlands Antilles',
  },
  {
    label: 'New Caledonia',
    value: 'New Caledonia',
  },
  {
    label: 'New Zealand',
    value: 'New Zealand',
  },
  {
    label: 'Nicaragua',
    value: 'Nicaragua',
  },
  {
    label: 'Niger',
    value: 'Niger',
  },
  {
    label: 'Nigeria',
    value: 'Nigeria',
  },
  {
    label: 'Niue',
    value: 'Niue',
  },
  {
    label: 'Norfolk Island',
    value: 'Norfolk Island',
  },
  {
    label: 'North Korea',
    value: 'North Korea',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'Northern Mariana Islands',
  },
  {
    label: 'Norway',
    value: 'Norway',
  },
  {
    label: 'Oman',
    value: 'Oman',
  },
  {
    label: 'Pakistan',
    value: 'Pakistan',
  },
  {
    label: 'Palau',
    value: 'Palau',
  },
  {
    label: 'Palestine',
    value: 'Palestine',
  },
  {
    label: 'Panama',
    value: 'Panama',
  },
  {
    label: 'Papua New Guinea',
    value: 'Papua New Guinea',
  },
  {
    label: 'Paracel Islands',
    value: 'Paracel Islands',
  },
  {
    label: 'Paraguay',
    value: 'Paraguay',
  },
  {
    label: 'Peru',
    value: 'Peru',
  },
  {
    label: 'Philippines',
    value: 'Philippines',
  },
  {
    label: 'Pitcairn Islands',
    value: 'Pitcairn Islands',
  },
  {
    label: 'Poland',
    value: 'Poland',
  },
  {
    label: 'Portugal',
    value: 'Portugal',
  },
  {
    label: 'Puerto Rico',
    value: 'Puerto Rico',
  },
  {
    label: 'Qatar',
    value: 'Qatar',
  },
  {
    label: 'Republic of the Congo',
    value: 'Republic of the Congo',
  },
  {
    label: 'Reunion',
    value: 'Reunion',
  },
  {
    label: 'Romania',
    value: 'Romania',
  },
  {
    label: 'Russia',
    value: 'Russia',
  },
  {
    label: 'Rwanda',
    value: 'Rwanda',
  },
  {
    label: 'Saint BarthÃ©lemy',
    value: 'Saint BarthÃ©lemy',
  },
  {
    label: 'Saint Helena',
    value: 'Saint Helena',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'Saint Kitts and Nevis',
  },
  {
    label: 'Saint Lucia',
    value: 'Saint Lucia',
  },
  {
    label: 'Saint Martin',
    value: 'Saint Martin',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'Saint Pierre and Miquelon',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  {
    label: 'Samoa',
    value: 'Samoa',
  },
  {
    label: 'San Marino',
    value: 'San Marino',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'Sao Tome and Principe',
  },
  {
    label: 'Saudi Arabia',
    value: 'Saudi Arabia',
  },
  {
    label: 'Senegal',
    value: 'Senegal',
  },
  {
    label: 'Serbia',
    value: 'Serbia',
  },
  {
    label: 'Seychelles',
    value: 'Seychelles',
  },
  {
    label: 'Sierra Leone',
    value: 'Sierra Leone',
  },
  {
    label: 'Singapore',
    value: 'Singapore',
  },
  {
    label: 'Sint Maarten',
    value: 'Sint Maarten',
  },
  {
    label: 'Slovakia',
    value: 'Slovakia',
  },
  {
    label: 'Slovenia',
    value: 'Slovenia',
  },
  {
    label: 'Solomon Islands',
    value: 'Solomon Islands',
  },
  {
    label: 'Somalia',
    value: 'Somalia',
  },
  {
    label: 'South Africa',
    value: 'South Africa',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'South Georgia and the South Sandwich Islands',
  },
  {
    label: 'South Korea',
    value: 'South Korea',
  },
  {
    label: 'South Sudan',
    value: 'South Sudan',
  },
  {
    label: 'Spain',
    value: 'Spain',
  },
  {
    label: 'Spratly Islands',
    value: 'Spratly Islands',
  },
  {
    label: 'Sri Lanka',
    value: 'Sri Lanka',
  },
  {
    label: 'Sudan',
    value: 'Sudan',
  },
  {
    label: 'Suriname',
    value: 'Suriname',
  },
  {
    label: 'Svalbard',
    value: 'Svalbard',
  },
  {
    label: 'Swaziland',
    value: 'Swaziland',
  },
  {
    label: 'Sweden',
    value: 'Sweden',
  },
  {
    label: 'Switzerland',
    value: 'Switzerland',
  },
  {
    label: 'Syria',
    value: 'Syria',
  },
  {
    label: 'Taiwan',
    value: 'Taiwan',
  },
  {
    label: 'Tajikistan',
    value: 'Tajikistan',
  },
  {
    label: 'Tanzania',
    value: 'Tanzania',
  },
  {
    label: 'Thailand',
    value: 'Thailand',
  },
  {
    label: 'The Bahamas',
    value: 'The Bahamas',
  },
  {
    label: 'The Gambia',
    value: 'The Gambia',
  },
  {
    label: 'Timor-leste',
    value: 'Timor-leste',
  },
  {
    label: 'Togo',
    value: 'Togo',
  },
  {
    label: 'Tokelau',
    value: 'Tokelau',
  },
  {
    label: 'Tonga',
    value: 'Tonga',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'Trinidad and Tobago',
  },
  {
    label: 'Tromelin Island',
    value: 'Tromelin Island',
  },
  {
    label: 'Tunisia',
    value: 'Tunisia',
  },
  {
    label: 'Turkey',
    value: 'Turkey',
  },
  {
    label: 'Turkmenistan',
    value: 'Turkmenistan',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'Turks and Caicos Islands',
  },
  {
    label: 'Tuvalu',
    value: 'Tuvalu',
  },
  {
    label: 'Uganda',
    value: 'Uganda',
  },
  {
    label: 'Ukraine',
    value: 'Ukraine',
  },
  {
    label: 'United Arab Emirates',
    value: 'United Arab Emirates',
  },
  {
    label: 'United Kingdom',
    value: 'United Kingdom',
  },
  {
    label: 'United States',
    value: 'United States',
  },
  {
    label: 'Uruguay',
    value: 'Uruguay',
  },
  {
    label: 'Uzbekistan',
    value: 'Uzbekistan',
  },
  {
    label: 'Vanuatu',
    value: 'Vanuatu',
  },
  {
    label: 'Venezuela',
    value: 'Venezuela',
  },
  {
    label: 'Vietnam',
    value: 'Vietnam',
  },
  {
    label: 'Virgin Islands',
    value: 'Virgin Islands',
  },
  {
    label: 'Wake Island',
    value: 'Wake Island',
  },
  {
    label: 'Wallis and Futuna',
    value: 'Wallis and Futuna',
  },
  {
    label: 'West Bank',
    value: 'West Bank',
  },
  {
    label: 'Western Sahara',
    value: 'Western Sahara',
  },
  {
    label: 'Yemen',
    value: 'Yemen',
  },
  {
    label: 'Zambia',
    value: 'Zambia',
  },
  {
    label: 'Zimbabwe',
    value: 'Zimbabwe',
  },
];

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
    disabledForm.value = false;
  } catch (err) {
    console.log(err);
  }
};
onMounted(async () => {
  await showAgencyInfo();
});
</script>
