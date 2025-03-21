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
   * Get Stripe public key from server
   */
  getPublicKey(): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/orders/public-key');
  },

  /**
   * Create order for guest user
   */
  createGuestOrder(
    tourData: CustomTour,
    userData: PaymentUser,
    stripeToken?: string
  ): Promise<AxiosResponse<ResponseInterface>> {
    const payload = {
      assembled_tours: {
        tour_id: tourData.tour_id,
        date: tourData.date,
        participants: tourData.participants,
        total_duration: tourData.total_duration,
        total_price: tourData.total_price,
      },
      addons: tourData.addons.map((addon) => addon.id),
      order: {
        total_sum: tourData.total_price,
        description: userData.notes || '',
        source: stripeToken || 'default_source',
      },
      user: {
        name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
      },
    };

    return createApiClient().post<ResponseInterface>('/orders/guest/order/store', payload);
  },

  /**
   * Create order for authenticated user
   */
  createAuthenticatedOrder(
    tourData: CustomTour,
    userData: PaymentUser,
    stripeToken?: string
  ): Promise<AxiosResponse<ResponseInterface>> {
    const payload = {
      assembled_tours: {
        tour_id: tourData.tour_id,
        date: tourData.date,
        participants: tourData.participants,
        total_duration: tourData.total_duration,
        total_price: tourData.total_price,
      },
      addons: tourData.addons.map((addon) => addon.id),
      order: {
        total_sum: tourData.total_price,
        description: userData.notes || '',
        source: stripeToken || 'default_source',
      },
    };

    return createApiClient().post<ResponseInterface>('/orders/auth/order/store', payload);
  },

  /**
   * Create order - general method that chooses the right endpoint
   */
  createOrder(
    tourData: CustomTour,
    userData: PaymentUser,
    isAuthenticated: boolean,
    stripeToken?: string
  ): Promise<AxiosResponse<ResponseInterface>> {
    return isAuthenticated
      ? this.createAuthenticatedOrder(tourData, userData, stripeToken)
      : this.createGuestOrder(tourData, userData, stripeToken);
  },

  /**
   * Process payment with Stripe token
   */
  processPayment(stripeToken: string, orderId: number): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/process', {
      stripeToken,
      orderId,
    });
  },

  /**
   * Check payment status
   */
  getPaymentStatus(paymentIntentId: string): Promise<AxiosResponse<PaymentStatusResponse>> {
    return createApiClient().get<PaymentStatusResponse>(`/payments/status/${paymentIntentId}`);
  },

  /**
   * Confirm payment completion
   */
  confirmPayment(
    paymentIntentId: string,
    orderId: number
  ): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/confirm', {
      paymentIntentId,
      orderId,
    });
  },

  /**
   * Cancel payment
   */
  cancelPayment(
    paymentIntentId: string,
    orderId: number
  ): Promise<AxiosResponse<ResponseInterface>> {
    return createApiClient().post<ResponseInterface>('/payments/cancel', {
      paymentIntentId,
      orderId,
    });
  },
};
