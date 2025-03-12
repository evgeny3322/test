<template>
  <div class="flex gap-3">
    <input
      type="radio"
      :name="props.name"
      :value="props.value"
      :id="radioId"
      class="hidden"
      v-model="model"
      :class="[inputClasses]"
      :checked="model == props.value"
    />
    <label
      :for="radioId"
      class="flex w-[25px] h-[25px] bg-transparent border border-white rounded-[50%] relative items-center cursor-pointer"
      :class="[labelClasses]"
    >
      <p class="ml-[calc(24px+12px)] text-white text-20">{{ props.text }}</p>
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  value: string | number;
  text: string;
  inputClasses?: string;
  labelClasses?: string;
}>();

const model = defineModel();

const radioId = `trustyRadio_${props.name}_${props.value}`;
</script>

<style scoped lang="scss">
label {
  box-sizing: border-box;
  &::after {
    content: '';
    position: absolute;
    display: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: white;
    top: 49%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

input {
  &:checked + label::after {
    display: block;
  }
}
</style>
