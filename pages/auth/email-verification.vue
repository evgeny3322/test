<template>
  <div
    class="my-[41px] md:my-[62px] flex flex-col md:gap-[62px] min-h-[calc(100vh-88px-41px)] md:min-h-auto justify-between"
  >
    <div class="relative">
      <div
        class="px-[9.5%] absolute -top-9 md:inset-0 md:ml-4 flex items-center gap-4 cursor-pointer"
        @click="goBack"
      >
        <ArrowDownOutlinedIcon class="rotate-90 stroke-[1.5px] h-3 w-[18px]" />
        <p>Go Back</p>
      </div>
      <h1 class="text-40 font-medium text-center text-white">Check Your Email</h1>
    </div>
    <div class="flex justify-center sticky">
      <form @submit.prevent="{}" class="bg-[#262626] p-6 w-[552px] flex flex-col gap-8 rounded-2xl">
        <p class="text-white text-14 md:text-18">
          We sent a confirmation email to the email {{ registerInfo?.email || '' }}, it will be delivered soon,
          please check your inbox and spam folder, if you didn't receive a confirmation email,
          please double check your address, you could change it on previous step.
        </p>
        <!-- First Name -->
        <TrustyField
          v-model="emailCode"
          placeholder="Enter verification code"
          inputClass="!bg-[#313131] text-18"
        />

        <div class="flex justify-between">
          <p
            class="text-white/60 text-18 font-semibold cursor-pointer hover:text-white duration-200 w-fit"
            @click="resendCode"
            :class="resendButtonOff ? '!text-white/20 !hover:text-white/20 !cursor-default' : ''"
          >
            Resend code
            <span v-if="resendButtonOff">{{ timeLeft }}</span>
          </p>
          <p v-if="errorResend" class="text-white/50">{{ errorResend }}</p>
        </div>

        <!-- Submit Button -->
        <TrustyButton title="Next" size="large" @click="acceptCode">
          <p class="text-18 font-medium">Next</p>
        </TrustyButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useAuthStore } from '@/store/authStore';
import TrustyField from '@/components/ui/TrustyField.vue';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlinedIcon.vue';
import TrustyButton from '@/components/ui/TrustyButton.vue';
import { useRouter } from 'vue-router';
import { authAPI } from '@/utils/api';
import { storeToRefs } from 'pinia';
import * as yup from 'yup';

const router = useRouter();

const emailCode = ref('');
const timeLeft = ref(60);
const resendButtonOff = ref(true);
const authStore = useAuthStore();
const errorResend = ref('');
const errorAccept = ref('');
const validationError = ref({}) as { [key: string]: any };
const { registerInfo } = storeToRefs(authStore);

const goBack = () => {
  router.push('/auth/sign-up');
};

const resendCode = async () => {
  startTimer();
  errorResend.value = '';
  if (registerInfo.value) {
    await authAPI.resendVerificationCode(registerInfo.value.email).catch((error) => {
      if (error?.status == 429) {
        errorResend.value = error.response.data.message;
      }
    });
  }
};

const acceptValidationRule = yup.object({
  code: yup.string().matches(/^\d+$/).max(6).min(6).required(),
  email: yup.string().required(),
});

const acceptCode = async () => {
  errorResend.value = '';

  let acceptValidated = await acceptValidationRule
    .validate({
      code: emailCode.value,
      email: registerInfo.value?.email,
    })
    .then((values) => values)
    .catch((errors: yup.ValidationError) => {
      errors.inner.forEach((error) => {
        if (error.path) {
          validationError.value[error.path] = true;
        }
      });
    });
  if (!acceptValidated) return false;
  acceptValidated.code = acceptValidated.code.toString();

  if (registerInfo.value) {
    await authAPI
      .acceptVerificationCode(acceptValidated)
      .then((response) => {
        if (response.status == 200) {
          authStore.updateRegisterInfo({ hash: response.data.data.hash, step: 3 });
        }
        router.push('/auth/finalize-registration');
      })
      .catch((error: any) => {
        if ([400, 404].includes(error?.status)) {
          errorAccept.value == error.response.data.message;
        }
      });
  }
};

const startTimer = (seconds: number = 60) => {
  resendButtonOff.value = true;
  timeLeft.value = seconds;

  let timerInterval = setInterval(() => {
    timeLeft.value--;
    if (process.client) sessionStorage.setItem('resend-timer', `${timeLeft.value}`);

    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      timerCompleted();
    }
  }, 1000);
};

const timerCompleted = () => {
  resendButtonOff.value = false;
};

onBeforeMount(() => {
  if (process.client) {
    let timerSeconds = parseInt(sessionStorage.getItem('resend-timer') || '-1');
    if (!isNaN(timerSeconds) && timerSeconds != -1) {
      startTimer(timerSeconds);
    } else {
      sessionStorage.setItem('resend-timer', '60');
      startTimer(60);
    }
  }
});
</script>
