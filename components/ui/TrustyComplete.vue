<template>
  <div :id="componentId" :class="['relative w-full cursor-pointer', containerClass]">
    <label v-if="label" class="block mb-2 text-sm font-medium text-grey-light-6" v-html="label" />
    <div
      :class="[
        'flex flex-row justify-between items-center w-full border rounded-main-sm focus:outline-none text-16 leading-24 font-medium',
        selectClass,
        variantClass,
        { '!border-red-500 border': error },
      ]"
      @click="toggleDropdown"
    >
      <p class="w-full text-white">
        {{ selectedLabel || placeholder }}
      </p>
      <arrow-down-outlined-icon
        class="duration-300"
        :class="{ 'rotate-180 duration-300': isOpen }"
      />
    </div>
    <ul
      v-if="isOpen"
      class="absolute p-[13px] left-0 mt-2 w-full bg-[#323232] border-none rounded-md shadow-md z-10 overflow-hidden space-y-[10px] overflow-y-scroll max-h-[200px]"
      :class="ulClass"
    >
      <li
        v-for="option in options"
        :key="option.value"
        :class="[
          'cursor-pointer hover:bg-[#414141] rounded-[4px] font-medium text-white',
          itemClass,
        ]"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';
import { useDropdownStore } from '@/store/dropdownStore';

const modelValue = defineModel('modelValue');

const props = defineProps<{
  options: any[];
  placeholder?: string;
  label?: string;
  selectClass?: string;
  error?: boolean;
  containerClass?: string;
  itemClass?: string;
  ulClass?: string;
  variant?: 'default' | 'outlined';
  id?: string;
}>();

const emit = defineEmits(['change']);

const dropdownStore = useDropdownStore();

const componentId = computed(
  () => props.id || `dropdown-${Math.random().toString(36).substring(2, 9)}`
);

const isOpen = computed(() => dropdownStore.isDropdownOpen(componentId.value));

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === modelValue.value);
  return selected ? selected.label : '';
});

const toggleDropdown = () => {
  dropdownStore.toggleDropdown(componentId.value);
};

const selectOption = (option: { value: string | number; label: string }) => {
  modelValue.value = option.value;
  emit('change', option.value);
  dropdownStore.closeDropdown();
};

const variantClass = computed(() =>
  props.variant === 'outlined'
    ? 'border-[#FFFFFF4A] bg-transparent text-white'
    : 'bg-[#323232] border-[#484848]'
);

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return;

  const element = event.target as HTMLElement;
  const dropdown = document.getElementById(componentId.value);

  if (dropdown && !dropdown.contains(element)) {
    dropdownStore.closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
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
  background-color: #888;
}
</style>
