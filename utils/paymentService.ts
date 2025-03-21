// utils/paymentService.ts
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { paymentsAPI } from './paymentApi';
import { CustomTour } from '@/types/tours';
import { PaymentUser } from '@/types/payment';

/**
 * Payment service for handling Stripe payments
 */
export class PaymentService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: any = null;
  private publicKey: string | null = null;

  /**
   * Получить публичный ключ Stripe с сервера
   */
  async getPublicKey(): Promise<string | null> {
    if (this.publicKey) return this.publicKey;

    try {
      const response = await paymentsAPI.getPublicKey();
      this.publicKey = response.data.data.publicKey;
      return this.publicKey;
    } catch (error) {
      console.error('Failed to get Stripe public key:', error);

      // Fallback на ключ из env переменных
      return process.env.VITE_APP_STRIPE_KEY || 'pk_test_51QFZCWEFcBt0NGMG3Z8dSfot6WiiCdLvdyjtw2rMj8P6Ct6KWLJuaRcvzAywIhB3ox899bpCcOHw3t8YRjSy4wni00iPfOMnzO';
    }
  }

  /**
   * Initialize Stripe with the public key
   */
  async initStripe(): Promise<Stripe | null> {
    if (this.stripe) return this.stripe;

    try {
      const publicKey = await this.getPublicKey();
      if (!publicKey) {
        throw new Error('No Stripe public key available');
      }

      this.stripe = await loadStripe(publicKey);
      return this.stripe;
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      return null;
    }
  }

  /**
   * Создать заказ и настроить оплату
   * @param tourData Данные тура для заказа
   * @param userDetails Детали пользователя
   * @param isAuthenticated Флаг, авторизован ли пользователь
   */
  async createOrder(
    tourData: CustomTour,
    userDetails: PaymentUser,
    isAuthenticated: boolean
  ): Promise<{ success: boolean; orderId?: number; error?: string }> {
    try {
      // Создаем заказ через соответствующий эндпоинт
      const response = await paymentsAPI.createOrder(tourData, userDetails, isAuthenticated);

      if (response.data.status === 'success') {
        // Получаем ID заказа
        const orderId = response.data.data.order_id;
        return {
          success: true,
          orderId
        };
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Failed to create order:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while creating your order'
      };
    }
  }

  /**
   * Инициализировать элементы Stripe
   * @param elementId DOM ID элемента, куда монтировать карточный элемент Stripe
   */
  async initCardElement(elementId: string = '#card-element'): Promise<boolean> {
    if (!this.stripe) {
      await this.initStripe();
    }

    if (!this.stripe) {
      return false;
    }

    try {
      const elementContainer = document.querySelector(elementId);
      if (!elementContainer) {
        console.error(`Element with id ${elementId} not found`);
        return false;
      }

      this.elements = this.stripe.elements();

      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            color: '#FFFFFF',
            fontFamily: 'Involve, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: 'rgba(255, 255, 255, 0.4)',
            },
            backgroundColor: '#313131',
          },
          invalid: {
            color: '#FF5252',
            iconColor: '#FF5252',
          },
        },
        hidePostalCode: true
      });

      this.cardElement.mount(elementId);
      return true;
    } catch (error) {
      console.error('Error initializing Stripe Card Element:', error);
      return false;
    }
  }

  /**
   * Создать токен карты для оплаты
   */
  async createCardToken(): Promise<{ success: boolean; token?: string; error?: any }> {
    if (!this.stripe || !this.cardElement) {
      return { success: false, error: { message: 'Stripe not properly initialized' } };
    }

    try {
      const result = await this.stripe.createToken(this.cardElement);

      if (result.error) {
        return { success: false, error: result.error };
      } else if (result.token) {
        return { success: true, token: result.token.id };
      } else {
        return { success: false, error: { message: 'Could not create token' } };
      }
    } catch (error) {
      console.error('Error creating card token:', error);
      return { success: false, error };
    }
  }

  /**
   * Отправить платеж с токеном карты
   * @param token Токен карты
   * @param orderId ID заказа
   */
  async submitPaymentWithToken(token: string, orderId: number): Promise<{ success: boolean; error?: any; paymentResult?: any }> {
    try {
      const response = await paymentsAPI.processPayment(token, orderId);

      if (response.data.status === 'success') {
        return { success: true, paymentResult: response.data.data };
      } else {
        return { success: false, error: { message: response.data.message || 'Payment failed' } };
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: {
          message: error.response?.data?.message || error.message || 'Payment processing error'
        }
      };
    }
  }

  /**
   * Clean up resources when done
   */
  cleanup() {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.elements = null;
  }
}

// Create singleton instance
export const paymentService:any = new PaymentService();