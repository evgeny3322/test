import axios from 'axios';
import { OrderData, PaymentResponse } from '@/types/payment';
import { PriceCalculationService } from './priceCalculationService';

export class PaymentService {
  private readonly apiUrl: string;
  private readonly authToken: string | null;

  constructor(apiUrl: string, authToken: string | null = null) {
    this.apiUrl = apiUrl;
    this.authToken = authToken;
  }

  async createOrder(tourData: any, isAuthenticated: boolean): Promise<PaymentResponse> {
    const endpoint = `${this.apiUrl}/orders/${isAuthenticated ? 'auth' : 'guest'}/order/store`;

    const totalPrice = PriceCalculationService.roundPrice(tourData?.total_price || 0);

    const totalPriceInteger = Math.round(totalPrice);

    console.log('Price conversion:', {
      original: tourData?.total_price,
      rounded: totalPrice,
      asInteger: totalPriceInteger,
    });

    const payload = {
      assembled_tours: {
        tour_id: tourData?.tour_id,
        date: tourData?.date?.slice(0, 19),
        participants: Number(tourData?.participants),
        total_duration: Math.round(Number(tourData?.total_duration)),
        total_price: totalPriceInteger,
      },
      addons: tourData?.addons.map((addon: any) => addon?.id),
      order: {
        total_sum: totalPriceInteger,
        description: tourData?.description || '',
      },
    };

    console.log('Sending order payload:', JSON.stringify(payload, null, 2));

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
}
