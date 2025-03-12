<template>
  <div class="my-[62px] flex flex-col gap-[62px]">
    <h1 class="text-40 font-medium text-center text-white">Check Your Email</h1>
    <div class="flex justify-center">
      <form
        @submit.prevent="handleSubmit"
        class="bg-[#262626] p-6 w-[552px] flex flex-col gap-8 rounded-2xl"
      >
        <!-- TODO: replace mail@gmail.com -->
        <p class="text-white text-18">
          We sent a confirmation email to the email mail@gmail.com, it will be delivered soon,
          please check your inbox and spam folder, if you didn't receive a confirmation email,
          please double check your address, you could change it on previous step.
        </p>
        <!-- First Name -->
        <TrustyField
          v-model="emailCode"
          placeholder="Enter verification code"
          inputClass="!bg-[#313131] text-18"
        />

        <p
          class="text-white/60 text-18 font-semibold cursor-pointer hover:text-white duration-200 w-fit"
        >
          Resend code
        </p>

        <!-- Submit Button -->
        <TrustyButton title="Next" size="large">
          <p class="text-18 font-medium">Next</p>
        </TrustyButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore'; // Pinia Store
import TrustyField from '@/components/ui/TrustyField.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const emailCode = ref('');
const authStore = useAuthStore();

const handleSubmit = async () => {
  router.push('/auth/finalize-registration');

  // try {
  //   await authStore.login(email.value, password.value);
  // } catch (error) {
  //   console.error('Ошибка входа', error);
  // }
};
</script>
