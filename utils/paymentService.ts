// utils/paymentService.ts

import axios from 'axios';
import { PaymentResponse, OrderData, UserFormData } from '@/types/payment';

export class PaymentService {
  private readonly apiUrl: string;
  private readonly authToken: string | null;

  constructor(apiUrl: string, authToken: string | null = null) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
  }

  /**
   * Create a payment order in the backend
   */
  async createOrder(tourData: any, isAuthenticated: boolean): Promise<PaymentResponse> {
    const endpoint = `${this.apiUrl}/orders/${isAuthenticated ? 'auth' : 'guest'}/order/store`;

    // Ensure total_price is an integer (convert from float if needed)
    const totalPrice = Math.round(tourData?.total_price || 0);

    const payload = {
      assembled_tours: {
        tour_id: tourData?.tour_id,
        date: tourData?.date?.slice(0, 19),
        participants: tourData?.participants,
        total_duration: tourData?.total_duration,
        total_price: totalPrice, // Ensure integer
      },
      addons: tourData?.addons.map((addon: any) => addon?.id),
      order: {
        total_sum: totalPrice, // Ensure integer
        description: tourData?.description,
      },
    };

    console.log('Sending order payload:', JSON.stringify(payload));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await axios.post(endpoint, payload, { headers });

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Failed to create order');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Order creation error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to create order');
      }
      throw error;
    }
  }

  /**
   * Update payment status after completion
   */
  async updatePaymentStatus(orderData: OrderData): Promise<any> {
    const endpoint = `${this.apiUrl}/orders/payment/update`;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      const response = await axios.post(endpoint, orderData, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update payment status');
      }
      throw error;
    }
  }

  /**
   * Store user information for non-authenticated users
   */
  async storeUserInfo(orderData: OrderData, userData: UserFormData): Promise<any> {
    const endpoint = `${this.apiUrl}/orders/payment/order/user/store`;

    const payload = {
      order_id: orderData.order_id,
      name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      country: userData.country,
      phone: `+${userData.dialCode} ${userData.phone}`,
    };

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      const response = await axios.post(endpoint, payload, { headers });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to store user information');
      }
      throw error;
    }
  }
}