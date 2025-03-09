<template>
  <div class="tour-slider">
    <!-- Основной слайдер -->
    <div ref="mainSliderContainer" class="main-slider mb-4 relative rounded-lg overflow-hidden">
      <div class="slider-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(slide, index) in slides" :key="index" class="slide w-full flex-shrink-0">
          <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
          <div
            v-if="slide.hasVideo"
            class="play-button absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <button
              class="bg-white bg-opacity-80 rounded-full w-16 h-16 flex items-center justify-center"
            >
              <span class="text-black text-2xl ml-1">▶</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Стрелки навигации -->
      <button
        @click="prevSlide"
        class="nav-arrow left-2 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10"
      >
        &lt;
      </button>
      <button
        @click="nextSlide"
        class="nav-arrow right-2 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10"
      >
        &gt;
      </button>

      <!-- Информация о туре -->
      <div class="tour-info absolute top-0 right-0 p-4">
        <span class="bg-gray-800 text-white px-3 py-1 rounded-full mr-2">{{ duration }}</span>
        <span class="bg-gray-800 text-white px-3 py-1 rounded-full">{{ hours }}</span>
      </div>
    </div>

    <!-- Миниатюры снизу -->
    <div class="thumbnails-slider flex space-x-2 overflow-x-auto">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="thumbnail-slide cursor-pointer rounded-lg overflow-hidden"
        :class="{ 'border-2 border-blue-500': index === currentIndex }"
        @click="goToSlide(index)"
      >
        <img
          :src="slide.thumbnail"
          :alt="`thumbnail-${index}`"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Slide {
  image: string;
  thumbnail: string;
  title: string;
  hasVideo: boolean;
}

const props = defineProps<{
  slides: Slide[];
  duration?: string;
  hours?: string;
}>();

const currentIndex = ref(0);
const mainSliderContainer = ref<HTMLElement | null>(null);
let touchStartX = 0;
let autoplayInterval: number | null = null;

// Методы для переключения слайдов
const nextSlide = () => {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // Циклическая навигация
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.slides.length - 1; // Циклическая навигация
  }
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

// Обработчики для сенсорных событий (свайпов)
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;

  // Определение направления свайпа
  if (Math.abs(diff) > 50) {
    // Минимальное расстояние для свайпа
    if (diff > 0) {
      nextSlide(); // Свайп влево - следующий слайд
    } else {
      prevSlide(); // Свайп вправо - предыдущий слайд
    }
  }
};

// Автоматическое переключение слайдов
const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000); // Переключение каждые 5 секунд
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
};

// Работа с DOM и событиями
onMounted(() => {
  if (mainSliderContainer.value) {
    mainSliderContainer.value.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainSliderContainer.value.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  startAutoplay();
});

onUnmounted(() => {
  if (mainSliderContainer.value) {
    mainSliderContainer.value.removeEventListener('touchstart', handleTouchStart);
    mainSliderContainer.value.removeEventListener('touchend', handleTouchEnd);
  }

  stopAutoplay();
});
</script>

<style scoped>
.main-slider {
  height: 500px;
}

.slider-wrapper {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
  height: 100%;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.thumbnail-slide {
  flex: 0 0 auto;
  width: 100px;
  height: 80px;
  transition: all 0.2s ease;
}

.thumbnail-slide:hover {
  opacity: 0.8;
}

.nav-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-arrow:hover {
  background-opacity: 0.7;
}
</style>
