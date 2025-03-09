<template>
  <div>
    <div class="relative h-max">
      <button
        @click.stop="isLanguagesListShown = !isLanguagesListShown"
        class="flex flex-row items-center gap-x-1.5 cursor-pointer w-16 justify-center"
        type="button"
        translate="no"
      >
        <globe-icon class="size-4" />
        <span class="uppercase font-semibold text-14">{{ currentLanguage }}</span>
        <arrow-down-icon :class="{ 'rotate-180': isLanguagesListShown }" />
      </button>

      <div
        v-show="isLanguagesListShown"
        class="languages absolute flex w-max right-0 lg:left-0 top-[calc(100%+12px)] flex-col gap-y-1.5 rounded-xs *:cursor-pointer bg-[#1A1A1A] font-semibold text-white/20 pt-1.5 pb-3"
        translate="no"
      >
        <button
          v-for="(name, key) in includedLanguages"
          :key="key"
          class="before:size-[5px] before:rounded flex gap-x-1.5 items-center pl-1.5 pr-3 w-full"
          :class="{ 'before:bg-white !cursor-default text-white': currentLanguage === key }"
          @click="changeLanguage(key)"
        >
          <span class="languageKey uppercase rounded-xs text-12 text-white bg-white/10 w-6 h-4">{{
            key
          }}</span>
          <span class="text-14/none">{{ name }}</span>
        </button>
      </div>
    </div>
    <div ref="googleTranslateElement" class="hidden"></div>
  </div>
</template>

<script setup lang="ts">
import ArrowDownIcon from '@/components/icons/ArrowDownIcon.vue';
import GlobeIcon from '@/components/icons/GlobeIcon.vue';
import { onMounted, ref, onBeforeUnmount } from 'vue';

const isLanguagesListShown = ref(false);
const currentLanguage = ref('en');
const googleTranslateElement = ref<HTMLElement | null>(null);
const googleTranslateInitialized = ref(false);

const includedLanguages = {
  it: 'Italian',
  en: 'English',
};

const getLastSelectedLanguage = (): string => {
  const googtransCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('googtrans='));

  if (googtransCookie) {
    const parts = googtransCookie.split('/');
    if (parts.length >= 3) {
      return parts[2];
    }
  }

  return 'en';
};

const initGoogleTranslate = () => {
  if (googleTranslateInitialized.value) return;

  const initFunction = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: '',
          includedLanguages: Object.keys(includedLanguages).join(','),
          autoDisplay: false,
        },
        googleTranslateElement.value
      );

      googleTranslateInitialized.value = true;
      currentLanguage.value = getLastSelectedLanguage();
    }
  };

  // Функцию инициализации для колбэка
  window.googleTranslateElementInit = initFunction;

  // Добавляем скрипт только если его еще нет
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.id = 'google-translate-script';
    script.async = true;
    document.head.appendChild(script);
  } else {
    // Если скрипт уже загружен, просто вызываем инициализацию
    initFunction();
  }
};

const changeLanguage = (lang: string) => {
  if (currentLanguage.value === lang) return;

  currentLanguage.value = lang;
  isLanguagesListShown.value = false;

  // Найти и изменить значение выпадающего списка Google Translate
  const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
  if (selectElement) {
    selectElement.value = lang;
    selectElement.dispatchEvent(new Event('change'));
  }
};

// Закрыть языковое меню при клике снаружи
const clickOutsideHandler = () => {
  isLanguagesListShown.value = false;
};

onMounted(() => {
  initGoogleTranslate();
  document.addEventListener('click', clickOutsideHandler);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutsideHandler);
});

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}
</script>
