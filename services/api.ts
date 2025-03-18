import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useRuntimeConfig } from 'nuxt/app';
import {
  AuthResponse,
  EmailVerificationData,
  LoginData,
  LogoutResponse,
  RegistrationData,
} from '@/types/user';
import { TourApiResponse, TourFilters, ToursApiResponse } from '@/types/tours';
import { Area, AreasResponse } from '@/types/areas';

interface AppRuntimeConfig {
  public: {
    apiUrl: string;
  };
}

export const createApiClient = (): AxiosInstance => {
  const config = useRuntimeConfig() as unknown as AppRuntimeConfig;
  const baseURL = config.public.apiUrl;

  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
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

  sendVerificationCode(email: string): Promise<AxiosResponse> {
    return createApiClient().post('/auth/send-verification', { email });
  },

  verifyEmail(verificationData: EmailVerificationData): Promise<AxiosResponse> {
    return createApiClient().post('/auth/verify-email', verificationData);
  },
};

// API для туров
export const toursAPI = {
  getTourById(id: number): Promise<AxiosResponse<TourApiResponse>> {
    return createApiClient().get<TourApiResponse>(`/v1/tours/${id}`);
  },

  getTours(filters: TourFilters): Promise<AxiosResponse<ToursApiResponse>> {
    return createApiClient().get<ToursApiResponse>('/v1/tours', { params: filters });
  },
  getDiscount() {
    return createApiClient().get('/v1/baseDiscounts');
  },
};

//API для областей
export const areasAPI = {
  getAreas(): Promise<AxiosResponse<AreasResponse>> {
    return createApiClient().get<AreasResponse>('/v1/areas');
  },

  getAreaById(id: number): Promise<AxiosResponse<Area>> {
    return createApiClient().get<Area>(`/v1/areas/${id}`);
  },
};

export default createApiClient;
