import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useRuntimeConfig } from 'nuxt/app';
import {
  AuthResponse,
  EmailVerificationData,
  LoginData,
  LogoutResponse,
  RegistrationData,
} from '@/types/user';

interface AppRuntimeConfig {
  public: {
    apiUrl: string;
  };
}

export const createApiClient = (): AxiosInstance => {
  const config = useRuntimeConfig() as unknown as AppRuntimeConfig;
  const baseURL: string = config.public.apiUrl || 'https://dev-api.inspiritaly.trustyone.dev/';

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Добавляем интерцептор для логирования запросов
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log('Sending a request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    (e) => {
      console.error('Error sending request:', e);
      return Promise.reject(e);
    }
  );

  // Добавляем интерцептор для логирования ответов
  axiosInstance.interceptors.response.use(
    (res) => {
      console.log('Response received:', {
        status: res.status,
        headers: res.headers,
        data: res.data,
      });
      return res;
    },
    (e) => {
      console.error(
        'Response error:',
        e.response
          ? {
              status: e.response.status,
              data: e.response.data,
            }
          : e.message
      );
      return Promise.reject(e);
    }
  );

  return axiosInstance;
};

// API для аутентификации
export const authAPI = {
  login(loginData: LoginData): Promise<AxiosResponse<AuthResponse>> {
    return createApiClient().post<AuthResponse>('/api/v1/auth/login', loginData);
  },

  logout(): Promise<AxiosResponse<LogoutResponse>> {
    return createApiClient().post<LogoutResponse>('/api/v1/auth/logout');
  },

  register(userData: RegistrationData): Promise<AxiosResponse<AuthResponse>> {
    return createApiClient().post<AuthResponse>('/api/v1/auth/register', userData);
  },

  sendVerificationCode(email: string): Promise<AxiosResponse> {
    return createApiClient().post('/api/v1/auth/send-verification', { email });
  },

  verifyEmail(verificationData: EmailVerificationData): Promise<AxiosResponse> {
    return createApiClient().post('/api/v1/auth/verify-email', verificationData);
  },
};

export default createApiClient;
