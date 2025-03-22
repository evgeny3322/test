<template>
  <div class="field">
    <label v-if="label" class="field-label" v-html="label" />
    <div class="input-wrapper">
      <!-- :disable="disabled" -->
      <vue-tel-input
        v-if="type === 'tel'"
        v-bind="props"
        v-model="model"
        class="field-input-tel"
        :dropdownOptions="{
          showDialCodeInSelection: true,
          showDialCodeInList: true,
          showFlags: true,
        }"
        @country-changed="(country: VueTelInputCountryObject) => emit('country-changed', country)"
        :class="[inputClass, { '!border-red-500 border': error }, { '!text-gray-400': disabled }]"
        :placeholder="placeholder"
      />
      <!-- :disabled="disabled" -->
      <input
        v-else
        v-bind="props"
        v-model="model"
        class="field-input"
        :class="[
          inputClass,
          { '!border-red-500 border': error },
          { '!text-gray-400 cursor-not-allowed': disabled },
        ]"
        :type="inputType"
        :placeholder="placeholder"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="toggle-password"
        @click="togglePassword"
      >
        <eye-icon class="w-[24px]" v-if="!showPassword" />
        <eye-closed-icon class="w-[24px]" v-else />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, defineModel, watch } from 'vue';
//@ts-ignore
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import EyeIcon from '@/components/icons/EyeIcon.vue';
import EyeClosedIcon from '@/components/icons/EyeOffIcon.vue';
import { VueTelInputCountryObject } from '@/types/type';

const model = defineModel();

const props = defineProps<{
  label?: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  inputClass?: string;
  error?: boolean;
}>();

const emit = defineEmits(['country-changed']);
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password';
  return props.type === 'email' ? 'email' : 'text';
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 14px;
  color: #ffffff99;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  max-height: 64px;
  flex: 1;
  width: 100%;
  color: #ffffff;
  padding: 19px 22px;
  border: 1px solid #ffffff4a !important;
  border-radius: 16px;
  background: transparent;
  outline: none;
  box-shadow: none !important;
}
.field-input-tel {
  max-height: 64px;
  flex: 1;
  width: 100%;
  color: #ffffff;
  padding: 19px 8px;
  border: 1px solid #ffffff4a !important;
  border-radius: 16px;
  background: transparent;
  outline: none;
  box-shadow: none !important;
}

.toggle-password {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ffffff99;
}

.toggle-password:hover {
  color: #ffffff;
}

.vue-tel-input .vti__dropdown {
  background-color: transparent !important;
}

.vue-tel-input .vti__dropdown .vti__dropdown-list {
  background-color: #262626 !important;
}

.vti__country-code {
  color: #ffffff !important;
  margin-right: 5px;
}
.highlighted {
  background: #ffffff99 !important;
}
</style>
