/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontSize: {
        10: '0.625rem', // 10px = 0.625rem
        12: '0.75rem', // 12px = 0.75rem
        13: '0.8125rem', // 13px = 0.8125rem
        14: '0.875rem', // 14px = 0.875rem
        16: '1rem', // 16px = 1rem
        18: '1.125rem', // 18px = 1.125rem
        20: '1.25rem', // 20px = 1.25rem
        23: '1.4375rem', // 23px = 1.4375rem
        26: '1.625rem', // 26px = 1.625rem
        24: '1.5rem', // 24px = 1.5rem
        28: '1.75rem', // 28px = 1.75rem
        32: '2rem', // 32px = 2rem
        36: '2.25rem', // 36px = 2.25rem
        40: '2.5rem', // 40px = 2.5rem
        62: '3.875rem', // 62px = 3.875rem
        64: '4rem', // 64px = 4rem
        74: '4.625rem', // 74px = 4.625rem
      },
      lineHeight: {
        18: '1.125rem', // 18px = 1.125rem
        24: '1.5rem', // 24px = 1.5rem
        40: '2.5rem', // 40px = 2.5rem
        20: '1.25rem', // 20px = 1.25rem
        22: '1.375rem', // 22px = 1.375rem
        56: '3.5rem', // 56px = 3.5rem
        59: '3.6875rem', // 59px = 3.6875rem
        30: '1.875rem', // 30px = 1.875rem
        28: '1.75rem', // 28px = 1.75rem
        17: '1.0625rem', // 17px = 1.0625rem
        36: '2.25rem', // 36px = 2.25rem
      },
      colors: {
        'main-black': '#000000',
        'secondary-black': '#0E0E0E',
        'thirdary-black': '#222222',
        'fourthary-black': '#404040',
        'tertiary-black': '#262626',
        'main-yellow': '#C4B07C',
        'main-grey': '#737373',
        'text-grey': '#939393',
        'grey-light-1': 'rgba(255, 255, 255, 0.1)', // (10% прозрачности)
        'grey-light-2': 'rgba(255, 255, 255, 0.2)', // (20% прозрачности)
        'grey-light-3': 'rgba(255, 255, 255, 0.3)', // (30% прозрачности)
        'grey-light-4': 'rgba(255, 255, 255, 0.4)', // (40% прозрачности)
        'grey-light-5': 'rgba(255, 255, 255, 0.5)', // (50% прозрачности)
        'grey-light-6': 'rgba(255, 255, 255, 0.6)', // (60% прозрачности)
        'grey-light-7': 'rgba(255, 255, 255, 0.7)', // (70% прозрачности)
        'grey-light-8': 'rgba(255, 255, 255, 0.8)', // (80% прозрачности)
        'grey-light-9': 'rgba(255, 255, 255, 0.9)', // (90% прозрачности)
        'grey-dark': '#1B1B1B',
        'grey-light-29': 'rgba(255, 255, 255, 0.29)', // (29% прозрачности)
        'under-line': '#313131',
      },
      spacing: {
        7.5: '30px',
      },
    },
  },
};
