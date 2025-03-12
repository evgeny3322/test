<template>
  <div
    @mouseenter="isMouseOnVideo = true"
    @mouseleave="isMouseOnVideo = false"
    class="video-player relative overflow-hidden"
  >
    <video
      ref="video"
      :src="src"
      @ended="onEnded"
      :controls="controls"
      v-if="src"
      :class="{ 'opacity-50': isMouseOnVideo }"
    />
    <div v-if="isMouseOnVideo" class="play-button" @click="togglePlay">
      <svg
        v-if="!isPlaying"
        class="icon backdrop-opacity-5"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="46"
        viewBox="0 0 40 46"
        fill="none"
      >
        <path
          d="M38 19.5359C40.6667 21.0755 40.6667 24.9245 38 26.4641L6.5 44.6506C3.83333 46.1902 0.500002 44.2657 0.500002 41.1865L0.500003 4.81346C0.500003 1.73426 3.83334 -0.190237 6.5 1.34936L38 19.5359Z"
          fill="black"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon backdrop-opacity-5"
      >
        <rect x="6" y="3" width="4" height="18" fill="black" />
        <rect x="14" y="3" width="4" height="18" fill="black" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
const isMouseOnVideo = ref(true);
const props = defineProps<{
  src?: string;
  controls?: boolean;
}>();

const video = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);

const togglePlay = () => {
  if (video.value) {
    if (isPlaying.value) {
      video.value.pause();
    } else {
      video.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const onEnded = () => {
  isPlaying.value = false;
};
</script>

<style scoped>
.video-player {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 30px;
  height: 30px;
}

@media screen {
  @media (max-width: 768px) {
    .play-button {
      width: 40px;
      height: 40px;
    }
    .icon {
      width: 15px;
      height: 15px;
    }
  }
}
</style>
