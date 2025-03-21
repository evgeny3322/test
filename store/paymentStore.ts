// store/paymentStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { paymentsAPI } from '@/utils/paymentApi';
import { stripeService } from '@/utils/stripeService';
import { PaymentUser, PaymentStatus } from '@/types/payment';
import { CustomTour } from '@/types/tours';

export const usePaymentStore = defineStore('payment', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const paymentStatus = ref<PaymentStatus | null>(null);
  const stripeToken = ref<string | null>(null);
  const orderId: any = ref<number | null>(null);
  const userDetails = ref<PaymentUser | null>(null);
  const paymentSuccessful = ref(false);

  /**
   * Initialize payment process
   * @param tourData Tour data
   * @param userData User data
   * @param isAuthenticated Authentication status
   */
  const initializePayment = async (
    tourData: CustomTour,
    userData: PaymentUser,
    isAuthenticated: boolean = false
  ) => {
    loading.value = true;
    error.value = null;
    paymentSuccessful.value = false;

    try {
      userDetails.value = userData;

      // Initialize Stripe
      await stripeService.initStripe();

      // Create order
      const orderResult = await stripeService.createOrder(tourData, userData, isAuthenticated);

      if (!orderResult.success) {
        throw new Error(orderResult.error || 'Failed to create order');
      }

      // Save order ID
      orderId.value = orderResult.orderId;

      return { success: true, orderId: orderId.value };
    } catch (err: any) {
      error.value = err?.message || 'Failed to initialize payment';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Process payment
   * @param tourData Tour data
   * @param userData User data
   * @param isAuthenticated Authentication status
   */
  const processPayment = async (
    tourData: CustomTour,
    userData: PaymentUser,
    isAuthenticated: boolean = false
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Process the full payment flow using the stripe service
      const result = await stripeService.processPayment(tourData, userData, isAuthenticated);

      if (result.success) {
        paymentSuccessful.value = true;
        paymentStatus.value = 'succeeded';

        if (result.orderId) {
          orderId.value = result.orderId;
        }

        return {
          success: true,
          orderId: orderId.value,
          paymentResult: result.paymentResult,
        };
      } else {
        error.value = result.error || 'Payment processing failed';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      error.value = err?.message || 'An error occurred during payment processing';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create card token
   */
  const createCardToken = async () => {
    loading.value = true;
    error.value = null;

    try {
      const result = await stripeService.createCardToken();

      if (result.success && result.token) {
        stripeToken.value = result.token;
        return { success: true, token: result.token };
      } else {
        error.value = result.error?.message || 'Failed to create card token';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create card token';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Submit payment with token
   */
  const submitPaymentWithToken = async () => {
    if (!stripeToken.value || !orderId.value) {
      error.value = 'Cannot process payment: missing token or order ID';
      return { success: false, error: error.value };
    }

    loading.value = true;
    error.value = null;

    try {
      const result = await stripeService.submitPaymentWithToken(stripeToken.value, orderId.value);

      if (result.success) {
        paymentSuccessful.value = true;
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
   * Check payment status
   * @param paymentIntentId Payment intent ID
   */
  const checkPaymentStatus = async (paymentIntentId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await paymentsAPI.getPaymentStatus(paymentIntentId);

      if (response.data.status === 'success') {
        const status = response.data.data.status;
        paymentStatus.value = status;

        if (status === 'succeeded') {
          paymentSuccessful.value = true;
        }

        return { success: true, status };
      } else {
        error.value = response.data.message || 'Failed to check payment status';
        return { success: false, error: error.value };
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to check payment status';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Reset payment state
   */
  const resetPayment = () => {
    stripeToken.value = null;
    orderId.value = null;
    paymentStatus.value = null;
    error.value = null;
    paymentSuccessful.value = false;

    // Clean up Stripe resources
    stripeService.cleanup();
  };

  /**
   * Get current payment state
   */
  const getPaymentState = () => {
    return {
      isLoading: loading.value,
      error: error.value,
      paymentStatus: paymentStatus.value,
      isSuccessful: paymentSuccessful.value,
      orderId: orderId.value,
    };
  };

  return {
    loading,
    error,
    paymentStatus,
    stripeToken,
    orderId,
    userDetails,
    paymentSuccessful,
    initializePayment,
    processPayment,
    createCardToken,
    submitPaymentWithToken,
    checkPaymentStatus,
    resetPayment,
    getPaymentState,
  };
});
