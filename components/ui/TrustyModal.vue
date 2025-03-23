<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        @click="closeOnBackdrop && close()"
      >
        <div class="relative" :class="[containerClass]" @click.stop>
          <div class="bg-[#2A2A2A] rounded-2xl overflow-hidden" :class="[modalClass]">
            <!-- Header -->
            <div v-if="$slots.header || title" class="p-6" :class="[headerClass]">
              <slot name="header">
                <h2 class="text-[28px] font-medium text-center text-white">{{ title }}</h2>
              </slot>
            </div>

            <!-- Close button -->
            <button
              v-if="showCloseButton"
              @click="close"
              class="absolute top-4 right-4 text-gray-400 hover:text-white"
              :class="[closeButtonClass]"
            >
              <slot name="close-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6L18 18"></path>
                </svg>
              </slot>
            </button>

            <!-- Body -->
            <div class="p-1" :class="[bodyClass]">
              <slot>
                <p class="text-gray-300">Modal content goes here</p>
              </slot>
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer || showDefaultFooter" class="p-6" :class="[footerClass]">
              <slot name="footer">
                <TrustyButton
                  v-if="showDefaultFooter"
                  class="w-full"
                  :class="[actionButtonClass]"
                  @click="confirm"
                >
                  <p class="text-18 font-medium">{{ actionButtonText }}</p>
                </TrustyButton>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  showDefaultFooter: {
    type: Boolean,
    default: false,
  },
  actionButtonText: {
    type: String,
    default: 'OK',
  },
  modalClass: {
    type: String,
    default: 'w-full max-w-md',
  },
  containerClass: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: String,
    default: '',
  },
  footerClass: {
    type: String,
    default: '',
  },
  closeButtonClass: {
    type: String,
    default: '',
  },
  actionButtonClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'confirm']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const confirm = () => {
  emit('confirm');
  close();
};

// Handle ESC key press
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close();
  }
};

const preventScroll = () => {
  if (props.modelValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  preventScroll();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
