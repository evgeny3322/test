<template>
  <div class="field">
    <label v-if="label" class="field-label">{{ label }}</label>
    <div class="input-wrapper">
      <vue-tel-input
        v-if="type === 'tel'"
        v-bind="props"
        v-model="model"
        class="field-input"
        :placeholder="placeholder"
      />
      <input
        v-else
        v-bind="props"
        v-model="model"
        class="field-input"
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import EyeIcon from '@/components/icons/EyeIcon.vue';
import EyeClosedIcon from '@/components/icons/EyeOffIcon.vue';

const props = defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue);
const showPassword = ref(false);

const inputType = computed(() => {
  if (props.type === 'password') return showPassword.value ? 'text' : 'password';
  return props.type === 'email' ? 'email' : 'text';
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

watch(model, (newValue: string) => {
  emit('update:modelValue', newValue);
});
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
</style>
