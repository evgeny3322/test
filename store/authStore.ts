import { defineStore } from 'pinia';
import {
  IsRegisterInfoInterface,
  RegisterInfoInterface,
  sendVerificationCodeInterface,
} from '@/types/auth';
import { ref, Ref } from 'vue';
import { authAPI } from '@/utils/api';
import { ResponseInterface } from '@/types/type';
import { AxiosResponse } from 'axios';

const REGISTER_INFO_SESSION = 'reg-info';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false) as Ref<boolean>;
  const error = ref(false) as Ref<string | boolean>;
  const registerInfo = ref<RegisterInfoInterface | null>(null);

  // const login = async (email: string, password: string) => {
  //   try {

  //     // Симуляция API-запроса
  //     if (email === 'user@example.com' && password === 'password123') {
  //       user.value = { email };
  //       return true;
  //     } else {
  //       throw new Error('Неверный email или пароль');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return {success: false, error: error as Error}
  //   }
  // }

  const sendCode = async (
    data: sendVerificationCodeInterface
  ): Promise<AxiosResponse<ResponseInterface>> => {
    loading.value = true;
    error.value = false;

    try {
      const response: AxiosResponse<ResponseInterface> = await authAPI.sendVerificationCode(data);
      return response;
    } catch (error: any) {
      return error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    user.value = null;
  };

  const updateRegisterInfo = (data: Partial<RegisterInfoInterface>) => {
    if (registerInfo.value) {
      registerInfo.value = { ...registerInfo.value, ...data };
      sessionStorage.setItem(REGISTER_INFO_SESSION, JSON.stringify(registerInfo.value));
    }
  };

  const deleteRegisterInfo = () => {
    registerInfo.value = null;
    sessionStorage.removeItem(REGISTER_INFO_SESSION);
  };

  const loadDefaultDataSession = () => {
    if (process.client) {
      let registerInfoSession = sessionStorage.getItem(REGISTER_INFO_SESSION);

      if (registerInfoSession) {
        registerInfoSession = JSON.parse(registerInfoSession);
        IsRegisterInfoInterface(registerInfoSession)
          .then((validatedData) => {
            registerInfo.value = validatedData;
          })
          .catch((error) => {
            registerInfo.value = null;
          });
        // registerInfo.value = registerInfoSession as RegisterInfoInterface
      } else {
        if (registerInfo.value) {
          sessionStorage.setItem(REGISTER_INFO_SESSION, JSON.stringify(registerInfo.value));
        }
      }
    }
  };

  loadDefaultDataSession();

  return {
    loading,
    error,
    registerInfo,
    sendCode,
    updateRegisterInfo,
    deleteRegisterInfo,
  };
});
