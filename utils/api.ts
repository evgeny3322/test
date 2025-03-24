import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useRuntimeConfig } from 'nuxt/app';
import {
  AgencyInformation,
  AuthResponse,
  LoginData,
  LogoutResponse,
  RegistrationData,
  updatedUser,
} from '@/types/user';
import { TourApiResponse, TourFilters, ToursApiResponse } from '@/types/tours';
import { sendVerificationCodeInterface } from '@/types/auth';
import { Area, AreasResponse } from '@/types/areas';
import { ResponseInterface } from '@/types/type';

interface AppRuntimeConfig {
  public: {
    apiUrl: string;
  };
}

const AUTH_TOKEN_KEY = 'auth-token';

export const createApiClient = (): AxiosInstance => {
  const config = useRuntimeConfig() as unknown as AppRuntimeConfig;
  const baseURL = config.public.apiUrl;

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (process.client) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  instance.interceptors.request.use((config) => {
    if (process.client) {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });

  return instance;
};

// API для аутентификации
export const authAPI = {
  login(loginData: LoginData): Promise<AxiosResponse<AuthResponse>> {
    return createApiClient().post<AuthResponse>('/auth/login', loginData);
  },

  logout(): Promise<AxiosResponse<LogoutResponse>> {
    return createApiClient().post<LogoutResponse>('/auth/logout');
  },

  register(userData: RegistrationData): Promise<AxiosResponse<AuthResponse>> {
    return createApiClient().post<AuthResponse>('/auth/register', userData);
  },

  sendVerificationCode(
    data: sendVerificationCodeInterface
  ): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/send_code', data);
  },

  acceptVerificationCode(data: {
    email: string;
    code: string | number;
  }): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/accept_code', data);
  },

  resendVerificationCode(email: string): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/resend_code', { email });
  },

  setPassword(data: any): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/set_password', data);
  },

  requestPasswordReset(email: string): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/reset_password_mail', { email });
  },

  resetPassword(hash: string, password: string): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/auth/reset_password', {
      hash,
      password,
      password_confirmation: password,
    });
  },
};

// API для туров
export const toursAPI = {
  getTourById(id: number): Promise<AxiosResponse<TourApiResponse>> {
    return createApiClient().get<TourApiResponse>(`/tours/${id}`);
  },

  getTours(filters: TourFilters): Promise<AxiosResponse<ToursApiResponse>> {
    return createApiClient().get<ToursApiResponse>('/tours', { params: filters });
  },
  getDiscount() {
    return createApiClient().get('/baseDiscounts');
  },
};

//API для областей
export const areasAPI = {
  getAreas(): Promise<AxiosResponse<AreasResponse>> {
    return createApiClient().get<AreasResponse>('/areas');
  },

  getAreaById(id: number): Promise<AxiosResponse<Area>> {
    return createApiClient().get<Area>(`/areas/${id}`);
  },
};

//API для агентства
export const agencyAPI = {
  createAgency(data: AgencyInformation): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/agencies/store', data);
  },
  updateAgency(data: AgencyInformation): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post('/agencies/update', data);
  },
  getAgencyInfo(): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().get('/agencies/show');
  },
};

//API для пользователя
export const userAPI = {
  updateUser(userData: updatedUser): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().patch('/users/update', userData);
  },
  fetchUser(): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().get('/users/showIm');
  },
};
export default createApiClient;
