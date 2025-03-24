import { computed, Ref, ref, watch } from 'vue';
import { dialCodeToIsoMap } from '@/constants/countries';

export const useDefaultCountry = (dialCodeRef: Ref<string | null | undefined>) => {
  const ready = ref(false);

  const defaultCountry = computed(() => {
    const code = dialCodeRef.value?.replace('+', '');
    return dialCodeToIsoMap[code ?? ''] || null;
  });

  watch(
    defaultCountry,
    (val) => {
      if (val) {
        ready.value = true;
      }
    },
    { immediate: true }
  );

  return { defaultCountry, ready };
};
