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
import { User } from '@/types/user';

const REGISTER_INFO_SESSION = 'reg-info';
const AUTH_TOKEN_KEY = 'auth-token';
const USER_DATA_KEY = 'user-data';
const INTENDED_ROUTE_KEY = 'intended-route';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false) as Ref<boolean>;
  const error = ref<string | boolean>(false);
  const registerInfo = ref<RegisterInfoInterface | null>(null);
  const isAuthenticated = ref(false);
  const token = ref<string | null>(null);
  const initialized = ref(false);
  const intendedRoute = ref<string | null>(null);

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = false;

    try {
      const response = await authAPI.login({ email, password });

      if (response.data.token && response.data.user) {
        setToken(response.data.token);
        setUser(response.data.user);
        isAuthenticated.value = true;
        return true;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Register function (final step)
  const register = async (data: any) => {
    loading.value = true;
    error.value = false;

    try {
      const response = await authAPI.register(data);

      if (response.data.token && response.data.user) {
        setToken(response.data.token);
        setUser(response.data.user);
        isAuthenticated.value = true;
        deleteRegisterInfo();
        return true;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const setPassword = async (data: any) => {
    loading.value = true;
    error.value = false;

    try {
      const response = await authAPI.setPassword(data);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to set password';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Send verification code for registration
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

  // Logout function
  const logout = async () => {
    loading.value = true;

    try {
      if (token.value) {
        await authAPI.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
      loading.value = false;
    }
  };

  // Helper functions for auth state management
  const setToken = (newToken: string) => {
    token.value = newToken;
    if (process.client) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    }
  };

  const setUser = (userData: User) => {
    user.value = userData;
    if (process.client) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    }
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    if (process.client) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      localStorage.removeItem(INTENDED_ROUTE_KEY);
    }
  };

  // Store the route the user was trying to access before being redirected to login
  const setIntendedRoute = (route: string) => {
    intendedRoute.value = route;
    if (process.client) {
      localStorage.setItem(INTENDED_ROUTE_KEY, route);
    }
  };

  // Get the intended route and clear it
  const getIntendedRoute = () => {
    const route = intendedRoute.value;
    intendedRoute.value = null;
    if (process.client) {
      localStorage.removeItem(INTENDED_ROUTE_KEY);
    }
    return route || '/account';
  };

  const updateRegisterInfo = (data: Partial<RegisterInfoInterface>) => {
    if (registerInfo.value) {
      registerInfo.value = { ...registerInfo.value, ...data };
    } else {
      registerInfo.value = data as RegisterInfoInterface;
    }

    if (process.client) {
      sessionStorage.setItem(REGISTER_INFO_SESSION, JSON.stringify(registerInfo.value));
    }
  };

  const deleteRegisterInfo = () => {
    registerInfo.value = null;
    if (process.client) {
      sessionStorage.removeItem(REGISTER_INFO_SESSION);
    }
  };

  // Initialize auth state from localStorage
  const initAuth = () => {
    if (process.client) {
      // Load auth token
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (savedToken) {
        token.value = savedToken;
        isAuthenticated.value = true;
      }

      // Load user data
      const savedUser = localStorage.getItem(USER_DATA_KEY);
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser);
        } catch (e) {
          console.error('Failed to parse user data', e);
          clearAuth();
        }
      }

      // Load intended route
      const savedIntendedRoute = localStorage.getItem(INTENDED_ROUTE_KEY);
      if (savedIntendedRoute) {
        intendedRoute.value = savedIntendedRoute;
      }

      // Load registration info
      let registerInfoSession = sessionStorage.getItem(REGISTER_INFO_SESSION);
      if (registerInfoSession) {
        try {
          const parsedInfo = JSON.parse(registerInfoSession);
          IsRegisterInfoInterface(parsedInfo)
            .then((validatedData) => {
              registerInfo.value = validatedData;
            })
            .catch((error) => {
              registerInfo.value = null;
            });
        } catch (e) {
          console.error('Failed to parse register info', e);
          registerInfo.value = null;
        }
      }

      initialized.value = true;
    }
  };

  // Initialize auth state on store creation (client-side only)
  if (process.client) {
    initAuth();
  }

  return {
    user,
    loading,
    error,
    registerInfo,
    isAuthenticated,
    token,
    initialized,
    login,
    logout,
    register,
    setPassword,
    sendCode,
    updateRegisterInfo,
    deleteRegisterInfo,
    initAuth,
    setIntendedRoute,
    getIntendedRoute,
  };
});