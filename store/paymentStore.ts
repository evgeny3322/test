// store/paymentStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { paymentsAPI } from '@/utils/paymentApi';
import { paymentService } from '@/utils/paymentService';
import { PaymentUser, PaymentStatus } from '@/types/payment';
import { CustomTour } from '@/types/tours';

export const usePaymentStore = defineStore('payment', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const paymentStatus = ref<PaymentStatus | null>(null);
  const stripeToken = ref<string | null>(null);
  const orderId = ref<number | null>(null);
  const userDetails = ref<PaymentUser | null>(null);

  /**
   * Инициализировать Stripe
   */
  const initStripe = async () => {
    return await paymentService.initStripe();
  };

  /**
   * Инициализировать элемент карты Stripe
   */
  const initCardElement = async (elementId: string = '#card-element') => {
    return await paymentService.initCardElement(elementId);
  };

  /**
   * Создать заказ для оплаты
   */
  const createOrder = async (tourData: CustomTour, user: PaymentUser, isAuthenticated: boolean = false) => {
    loading.value = true;
    error.value = null;

    try {
      userDetails.value = user;
      // Инициализировать Stripe, если ещё не инициализирован
      await initStripe();

      // Создать заказ на сервере
      const result = await paymentService.createOrder(tourData, user, isAuthenticated);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Сохранить ID заказа
      if (result.orderId) {
        orderId.value = result.orderId;
        return { success: true, orderId: result.orderId };
      } else {
        throw new Error('Order ID not returned from server');
      }

    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Failed to create order';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Создать токен карты для оплаты
   */
  const createCardToken = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await paymentService.createCardToken();

      if (result.success && result.token) {
        stripeToken.value = result.token;
        return { success: true, token: result.token };
      } else {
        throw new Error(result.error?.message || 'Failed to create card token');
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create card token';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Обработать платеж используя токен карты
   */
  const processPayment = async () => {
    if (!stripeToken.value || !orderId.value) {
      error.value = 'Cannot process payment: missing token or order ID';
      return { success: false, error: error.value };
    }

    loading.value = true;
    error.value = null;

    try {
      const result = await paymentService.submitPaymentWithToken(stripeToken.value, orderId.value);

      if (result.success) {
        paymentStatus.value = 'succeeded';
        return result;
      } else {
        error.value = result.error?.message || 'Payment failed';
        return result;
      }
    } catch (err: any) {
      error.value = err?.message || 'Payment processing failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Сброс состояния платежа
   */
  const resetPayment = () => {
    stripeToken.value = null;
    orderId.value = null;
    paymentStatus.value = null;
    error.value = null;

    // Очистка ресурсов Stripe
    paymentService.cleanup();
  };

  return {
    loading,
    error,
    paymentStatus,
    stripeToken,
    orderId,
    userDetails,
    initStripe,
    initCardElement,
    createOrder,
    createCardToken,
    processPayment,
    resetPayment
  };
});