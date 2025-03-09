<template>
  <div class="flex flex-col gap-y-6">
    <tour-info-card v-for="tour in tours" :data="tour" />
  </div>
</template>

<script setup lang="ts">
import TourInfoCard from '@/components/tours/TourInfoCard.vue';
import { ref } from 'vue';

const tours = ref([
  {
    title: 'Adventure Tour in Eastern Europe',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    area: 'Eastern Europe',
    duration: '7 days',
    services: [
      { name: 'Excursions', included: true },
      { name: 'Transfers', included: true },
      { name: 'Meals', included: false },
    ],
    date: '2025-05-15',
    participants: 12,
    price: 1200,
    cars: [
      { model: 'Mercedes Benz Sprinter', seats: 15, available: true },
      { model: 'Volkswagen Crafter', seats: 16, available: false },
    ],
  },
  {
    title: 'Gastronomic Tour in Italy',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    area: 'Italy',
    duration: '10 days',
    services: [
      { name: 'Excursions', included: true },
      { name: 'Transfers', included: true },
      { name: 'Meals', included: true },
    ],
    date: '2025-06-10',
    participants: 8,
    price: 1500,
    cars: [
      { model: 'Ford Transit', seats: 12, available: true },
      { model: 'Mercedes Benz Vito', seats: 9, available: true },
    ],
  },
]);
</script>

<style scoped></style>
