<template>
  <button
    :class="`btn btn-${props.type} btn-${props.size} btn-${props.theme}`"
    :disabled="props.disabled"
    :title="props.title"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'light',
    validator: (value: string) => ['light', 'dark'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.btn {
  border-radius: 44px;
  padding: 13px 28px;
  cursor: pointer;
  border: none;
  &:hover {
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
  }

  &.btn-small {
    padding: 8px 16px;
    font-size: 14px;
  }

  &.btn-medium {
    padding: 13px 28px;
    font-size: 16px;
  }

  &.btn-large {
    padding: 18px 36px;
    font-size: 18px;
  }

  &.btn-light {
    background-color: #f0f0f0;
    color: #333;
  }

  &.btn-dark {
    background-color: #333;
    color: #fff;
  }

  &.btn-outlined {
    border: 1px solid #737373;
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  &.btn-primary {
    background-color: #ffffff;
    color: #000000;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  &.btn-black {
    background-color: #000000;
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
