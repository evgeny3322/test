// utils/paymentApi.ts
import { AxiosResponse } from 'axios';
import { createApiClient } from './api';
import { CustomTour } from '@/types/tours';
import { PaymentIntent, PaymentUser, PaymentStatus } from '@/types/payment';
import { ResponseInterface } from '@/types/type';

export interface PaymentData {
  tour: CustomTour;
  user: PaymentUser;
}

export interface PaymentResponse extends ResponseInterface {
  data: {
    payment: PaymentIntent;
    orderId: number;
  };
}

export interface PaymentStatusResponse extends ResponseInterface {
  data: {
    status: PaymentStatus;
    orderId: number;
  };
}

export const paymentsAPI = {
  /**
   * Получить публичный ключ Stripe с сервера
   */
  getPublicKey(): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/orders/public-key');
  },

  /**
   * Создать заказ для неавторизованного пользователя
   */
  createGuestOrder(tourData: CustomTour, userData: PaymentUser): Promise<AxiosResponse<ResponseInterface>> {
    const payload = {
      assembled_tours: {
        tour_id: tourData.tour_id,
        date: tourData.date,
        participants: tourData.participants,
        total_duration: tourData.total_duration,
        total_price: tourData.total_price
      },
      addons: tourData.addons.map(addon => addon.id),
      order: {
        total_sum: tourData.total_price,
        description: userData.notes || '',
        source: "architecto"
      },
      user: {
        name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country
      }
    };

    return createApiClient().post<ResponseInterface>('/orders/guest/order/store', payload);
  },

  /**
   * Создать заказ для авторизованного пользователя
   */
  createAuthenticatedOrder(tourData: CustomTour, userData: PaymentUser): Promise<AxiosResponse<ResponseInterface>> {
    const payload = {
      assembled_tours: {
        tour_id: tourData.tour_id,
        date: tourData.date,
        participants: tourData.participants,
        total_duration: tourData.total_duration,
        total_price: tourData.total_price
      },
      addons: tourData.addons.map(addon => addon.id),
      order: {
        total_sum: tourData.total_price,
        description: userData.notes || '',
        source: "architecto"
      }
    };

    return createApiClient().post<ResponseInterface>('/orders/auth/order/store', payload);
  },

  /**
   * Создать заказ - общий метод, который выбирает нужный эндпоинт
   */
  createOrder(tourData: CustomTour, userData: PaymentUser, isAuthenticated: boolean): Promise<AxiosResponse<ResponseInterface>> {
    return isAuthenticated
      ? this.createAuthenticatedOrder(tourData, userData)
      : this.createGuestOrder(tourData, userData);
  },

  /**
   * Обработать платеж с токеном Stripe
   */
  processPayment(stripeToken: string, orderId: number): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/process', {
      stripeToken,
      orderId
    });
  },

  /**
   * Проверить статус платежа
   */
  getPaymentStatus(paymentIntentId: string): Promise<AxiosResponse<PaymentStatusResponse>> {
    return createApiClient().get<PaymentStatusResponse>(`/payments/status/${paymentIntentId}`);
  },

  /**
   * Подтвердить завершение платежа
   */
  confirmPayment(paymentIntentId: string, orderId: number): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/confirm', {
      paymentIntentId,
      orderId
    });
  },

  /**
   * Отменить платеж
   */
  cancelPayment(paymentIntentId: string, orderId: number): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/cancel', {
      paymentIntentId,
      orderId
    });
  }
};