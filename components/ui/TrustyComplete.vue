<template>
  <div class="relative w-full cursor-pointer">
    <div
      class="flex flex-row justify-between items-center w-full h-[50px] bg-[#323232] border-[#484848] p-[13px] border rounded-lg focus:outline-none text-16 leading-24 font-medium"
      @click="toggleDropdown"
    >
      <p class="w-full">{{ selectedLabel || placeholder }}</p>
      <arrow-down-outlined-icon
        class="duration-300"
        :class="{ 'rotate-180 duration-300': isOpen }"
      />
    </div>
    <ul
      v-if="isOpen"
      class="absolute p-[13px] left-0 mt-2 w-full bg-[#323232] border-none rounded-lg shadow-md z-10 overflow-hidden space-y-[10px] overflow-y-scroll max-h-[200px]"
    >
      <li
        v-for="option in options"
        :key="option.value"
        class="p-[6px] cursor-pointer hover:bg-[#414141] rounded-[4px] font-medium"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';

const props = defineProps<{
  modelValue: string | number;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected ? selected.label : '';
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: { value: string | number; label: string }) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
};
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 8px;
}

ul::-webkit-scrollbar-track {
  background: #323232e5;
  border-radius: 10px;
}

ul::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 99px;
}

ul::-webkit-scrollbar-thumb:hover {
  background-color: #888; /* цвет скроллбара при наведении */
}
</style>
