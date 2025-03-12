<template>
  <button
    :class="`btn btn-${props.variant} btn-${props.size} btn-${props.color}`"
    :disabled="props.disabled"
    :title="props.title"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'outlined'].includes(value),
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
  color: {
    type: String,
    default: 'light',
    validator: (value: string) => ['light', 'dark', 'black', 'white'].includes(value),
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
  transition: opacity 0.3s ease-in-out;
  &:hover {
    opacity: 0.8;
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

  &.btn-black {
    background-color: #000;
    color: #fff;
  }

  &.btn-white {
    background-color: #fff;
    color: #000;
  }

  &.btn-primary {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  &.btn-outlined {
    border: 1px solid #737373;
    background: transparent;
    color: inherit;
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
