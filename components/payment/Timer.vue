<template>
  <div>
    <p>{{ formattedTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

const props = defineProps<{
  minutes: number;
  seconds: number;
}>();

const totalTimeInSeconds = ref(props.minutes * 60 + props.seconds);

const timer = ref<NodeJS.Timeout | null>(null);

const formattedTime = computed(() => {
  const minutes = Math.floor(totalTimeInSeconds.value / 60);
  const seconds = totalTimeInSeconds.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const startTimer = () => {
  timer.value = setInterval(() => {
    if (totalTimeInSeconds.value > 0) {
      totalTimeInSeconds.value -= 1;
    } else {
      clearInterval(timer.value!);
      emit('time-up');
    }
  }, 1000);
};

onMounted(() => {
  if (process.client) {
    totalTimeInSeconds.value = totalTimeInSeconds.value;
    startTimer();
  }
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value!);
  }
});

const emit = defineEmits<{
  (e: 'time-up'): void;
}>();
</script>
