#!/usr/bin/env bash

# Установка и настройка Husky
echo "🔧 Настраиваем Husky..."

# Создание директории .husky, если она еще не существует
mkdir -p .husky

# Инициализация Husky
npx husky

# Создание pre-commit хука
echo 'echo "🔍 Начинаем проверку и автоисправление кода..."

# Форматируем все файлы в проекте с помощью Prettier
echo "🎨 Форматирование кода с помощью Prettier..."
npx prettier --write "**/*.{js,ts,vue,json,css,scss,md}" || exit 1

# Запускаем ESLint с автоисправлением для всех JS/TS/Vue файлов в проекте
echo "🛠️ Исправление проблем с помощью ESLint..."
npx eslint --fix "**/*.{js,ts,vue}" || exit 1

# Запускаем lint-staged для проверки измененных файлов
echo "✅ Финальная проверка с lint-staged..."
npx lint-staged

echo "✨ Файлы успешно отформатированы и исправлены!"' > .husky/pre-commit

# Создание pre-push хука
echo 'echo "🚀 Проверяем код перед отправкой в репозиторий..."

# Запускаем ESLint для проверки всего проекта
echo "🔍 Проверка кода с помощью ESLint..."
npx eslint . || exit 1

# Проверка типов TypeScript
echo "🔎 Проверка типов TypeScript..."
npx vue-tsc --noEmit || exit 1

echo "✨ Все проверки пройдены успешно! Код готов к отправке."' > .husky/pre-push

# Делаем скрипты исполняемыми
chmod +x .husky/pre-commit
chmod +x .husky/pre-push

echo "✅ Husky успешно настроен!"
echo "📌 Проверка форматирования и линтинга будет выполняться автоматически при коммите."
echo "📌 Проверка ESLint и типов TypeScript будет выполняться при push."