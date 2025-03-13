<template>
  <div
    class="mt-9 bg-secondary-black p-6 rounded-[12px] flex flex-col lg:flex-row space-y-4 lg:space-x-6 lg:space-y-0 lg:justify-between lg:items-end"
  >
    <!-- Цикл по всем фильтрам из конфигурации -->
    <div v-for="(filter, index) in filters" :key="index" class="flex flex-col w-full">
      <!--
        Лейбл фильтра - отображается только если:
        1) Включен показ лейблов (showLabels=true)
        2) У фильтра есть лейбл (filter.label существует)
      -->
      <span
        v-if="showLabels && filter.label"
        class="text-[#B3B3B3] font-medium leading-6 text-[13px] mb-[6px]"
      >
        {{ filter.label }}
      </span>

      <!--
        Компонент выбора значения (TrustyComplete)
        - options: список вариантов для выбора
        - v-model: использование двусторонней привязки данных с defineModel
        - placeholder: текст-подсказка (если передан)
      -->
      <trusty-complete
        :options="filter.options"
        v-model="values[filter.name]"
        itemClass="p-[6px]"
        :placeholder="filter.placeholder"
        @change="handleChange(filter.name, $event)"
        select-class="p-[13px] h-[50px]"
      />
    </div>

    <!--
      Кнопка поиска/применения фильтра
      Отображается только если showButton=true
    -->
    <trusty-button v-if="showButton" @click="handleSubmit" class="text-nowrap">
      {{ buttonText }}
    </trusty-button>
  </div>
</template>

<script setup lang="ts">
import TrustyComplete from '@/components/ui/TrustyComplete.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { PropType, watch } from 'vue';

// Тип для варианта выбора в фильтре
export interface FilterOption {
  value: string | number; // Значение варианта (используется для отправки на сервер)
  label: string; // Отображаемый текст варианта (показывается пользователю)
}

// Тип для конфигурации одного фильтра
export interface FilterConfig {
  name: string; // Уникальное имя фильтра (например, 'area', 'price')
  label?: string; // Текст лейбла (необязательно)
  placeholder?: string; // Текст-подсказка внутри поля (необязательно)
  options: FilterOption[]; // Список вариантов для выбора
  defaultValue?: string | number; // Значение по умолчанию (необязательно)
}

const props = defineProps({
  // Массив с конфигурацией фильтров
  filters: {
    type: Array as PropType<FilterConfig[]>,
    required: true, // Обязательный параметр
  },

  // Текст кнопки
  buttonText: {
    type: String,
    default: 'Search', // Значение по умолчанию
  },

  // Показывать ли лейблы полей
  showLabels: {
    type: Boolean,
    default: true, // По умолчанию показываем лейблы
  },

  // Показывать ли кнопку поиска
  showButton: {
    type: Boolean,
    default: true, // По умолчанию показываем кнопку
  },

  initialValues: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({}), // По умолчанию пустой объект
  },
});

const values = defineModel<Record<string, string | number>>('values', {
  default: () => ({}),
});

// Определяем событие для кнопки поиска
const emit = defineEmits(['submit']);

// Следим за изменениями начальных значений (initialValues)
watch(
  () => props.initialValues,
  (newValues) => {
    // Копируем все значения из initialValues в values
    Object.assign(values.value, newValues);
  },
  { immediate: true }
);

// Следим за изменениями конфигурации фильтров
watch(
  () => props.filters,
  (newFilters) => {
    // Проходим по всем фильтрам
    newFilters.forEach((filter) => {
      // Если у фильтра есть defaultValue и значение для этого фильтра еще не установлено
      if (filter.defaultValue !== undefined && values.value[filter.name] === undefined) {
        // Устанавливаем значение по умолчанию
        values.value[filter.name] = filter.defaultValue;
      }
    });
  },
  { immediate: true }
);

// Обработчик изменения значения в фильтре
const handleChange = (name: string, value: string | number) => {
  values.value[name] = value;
};

// Обработчик нажатия на кнопку поиска
const handleSubmit = () => {
  emit('submit', { ...values.value });
};
</script>
