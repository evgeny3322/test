import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { paymentsAPI } from './paymentApi';
import { CustomTour } from '@/types/tours';
import { PaymentUser } from '@/types/payment';

/**
 * Service for handling Stripe payments
 */
export class StripeService {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;
  private publicKey: string | null = null;

  /**
   * Get Stripe public key from server
   */
  async getPublicKey(): Promise<string | null> {
    if (this.publicKey) return this.publicKey;

    try {
      const response: any = await paymentsAPI.getPublicKey();
      // Handle possible different response structures
      if (response.data && response.data.data && response.data.data.publicKey) {
        this.publicKey = response.data.data.publicKey;
      } else if (response.data && response.data.publicKey) {
        this.publicKey = response.data.publicKey;
      } else {
        // Fallback to hardcoded key for development
        this.publicKey =
          'pk_test_51QFZCWEFcBt0NGMG3Z8dSfot6WiiCdLvdyjtw2rMj8P6Ct6KWLJuaRcvzAywIhB3ox899bpCcOHw3t8YRjSy4wni00iPfOMnzO';
        console.warn('Using fallback Stripe public key');
      }
      return this.publicKey;
    } catch (error) {
      console.error('Failed to get Stripe public key:', error);
      // Fallback to hardcoded key for development
      this.publicKey =
        'pk_test_51QFZCWEFcBt0NGMG3Z8dSfot6WiiCdLvdyjtw2rMj8P6Ct6KWLJuaRcvzAywIhB3ox899bpCcOHw3t8YRjSy4wni00iPfOMnzO';
      console.warn('Using fallback Stripe public key due to error');
      return this.publicKey;
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
   * Initialize Stripe Card Element
   * @param elementId DOM ID where to mount the card element
   */
  async initCardElement(elementId: string = '#card-element'): Promise<boolean> {
    if (!this.stripe) {
      await this.initStripe();
    }

    if (!this.stripe) {
      console.error('Stripe failed to initialize');
      return false;
    }

    try {
      // First try to clear any existing content in the element
      const elementContainer = document.querySelector(elementId);
      if (!elementContainer) {
        console.error(`Element with id ${elementId} not found`);
        return false;
      }

      // Make sure the element is empty
      elementContainer.innerHTML = '';

      // Create new elements instance
      this.elements = this.stripe.elements();

      // Create and configure the card element
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            color: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: 'rgba(255, 255, 255, 0.4)',
            },
            backgroundColor: 'transparent',
          },
          invalid: {
            color: '#FF5252',
            iconColor: '#FF5252',
          },
        },
        hidePostalCode: true,
      }) as StripeCardElement;

      // Add an event listener to log any errors
      this.cardElement.on('change', (event) => {
        if (event.error) {
          console.error('Stripe element error:', event.error.message);
        }
      });

      // Mount the element
      this.cardElement.mount(elementId);
      console.log('Stripe card element mounted successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Stripe Card Element:', error);
      return false;
    }
  }

  /**
   * Create a card token for payment
   */
  async createCardToken(): Promise<{
    success: boolean;
    token?: string;
    tokenDetails?: any;
    error?: any;
  }> {
    if (!this.stripe || !this.cardElement) {
      return { success: false, error: { message: 'Stripe not properly initialized' } };
    }

    try {
      const result = await this.stripe.createToken(this.cardElement);

      console.log('Stripe Token Creation Result:', {
        success: result.token ? true : false,
        tokenDetails: result.token,
        error: result.error,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          tokenDetails: null,
        };
      } else if (result.token) {
        return {
          success: true,
          token: result.token.id,
          tokenDetails: result.token,
        };
      } else {
        return {
          success: false,
          error: { message: 'Could not create token' },
          tokenDetails: null,
        };
      }
    } catch (error) {
      console.error('Error creating card token:', error);
      return {
        success: false,
        error,
        tokenDetails: null,
      };
    }
  }

  /**
   * Submit payment with card token
   * @param token Card token
   * @param orderId Order ID
   */
  async submitPaymentWithToken(
    token: string,
    orderId: number
  ): Promise<{ success: boolean; error?: any; paymentResult?: any }> {
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
          message: error.response?.data?.message || error.message || 'Payment processing error',
        },
      };
    }
  }

  /**
   * Create order and setup payment
   * @param tourData Tour data for order
   * @param userDetails User details
   * @param isAuthenticated Flag if user is authenticated
   */
  async createOrder(
    tourData: CustomTour,
    userDetails: PaymentUser,
    isAuthenticated: boolean
  ): Promise<{ success: boolean; orderId?: number; error?: string }> {
    try {
      // Log the data being sent to the API for debugging
      console.log('Creating order with data:', {
        tourData,
        userDetails,
        isAuthenticated,
      });

      // Create order through appropriate endpoint
      const response: any = await paymentsAPI.createOrder(tourData, userDetails, isAuthenticated);

      // Log the response for debugging
      console.log('Order creation response:', response);

      // Handle successful response
      if (response.data && response.data.status === 'success') {
        // Different APIs might return the order ID in different paths
        let orderId = null;

        if (response.data.data && response.data.data.order_id) {
          orderId = response.data.data.order_id;
        } else if (response.data.data && response.data.data.id) {
          orderId = response.data.data.id;
        } else if (response.data.order_id) {
          orderId = response.data.order_id;
        } else if (response.data.id) {
          orderId = response.data.id;
        }

        if (orderId) {
          console.log('Order created successfully with ID:', orderId);
          return {
            success: true,
            orderId,
          };
        } else {
          console.error('Order ID not found in response:', response.data);
          return {
            success: false,
            error: 'Order was created but no order ID was returned',
          };
        }
      } else if (response.data && response.data.error) {
        // Handle API error response
        console.error('API returned error:', response.data.error);
        return {
          success: false,
          error: response.data.error,
        };
      } else {
        // Handle unexpected response format
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          error: 'Unexpected response from server',
        };
      }
    } catch (error: any) {
      // Handle exceptions
      console.error('Failed to create order:', error);

      // Try to extract useful information from the error
      let errorMessage = 'An error occurred while creating your order';

      if (error.response && error.response.data) {
        // API error with response
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
        console.error('API error response:', error.response.data);
      } else if (error.message) {
        // Standard error object
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Process complete payment flow
   * @param tourData Tour data
   * @param userDetails User details
   * @param isAuthenticated Flag if user is authenticated
   */
  async processPayment(
    tourData: CustomTour,
    userDetails: PaymentUser,
    isAuthenticated: boolean
  ): Promise<{
    success: boolean;
    orderId?: number;
    error?: string;
    paymentResult?: any;
    tokenDetails?: any;
  }> {
    try {
      // 1. Create order
      const orderResult = await this.createOrder(tourData, userDetails, isAuthenticated);
      if (!orderResult.success) {
        return { success: false, error: orderResult.error };
      }

      // 2. Create card token
      const tokenResult = await this.createCardToken();
      if (!tokenResult.success) {
        return {
          success: false,
          error: tokenResult.error?.message,
          tokenDetails: tokenResult.tokenDetails,
        };
      }

      console.log('Stripe Token Created:', {
        tokenId: tokenResult.token,
        tokenDetails: tokenResult.tokenDetails,
      });

      // 3. Process payment
      const paymentResult = await this.submitPaymentWithToken(
        tokenResult.token!,
        orderResult.orderId!
      );

      if (paymentResult.success) {
        return {
          success: true,
          orderId: orderResult.orderId,
          paymentResult: paymentResult.paymentResult,
          tokenDetails: tokenResult.tokenDetails,
        };
      } else {
        return {
          success: false,
          error: paymentResult.error?.message,
          tokenDetails: tokenResult.tokenDetails,
        };
      }
    } catch (error: any) {
      console.error('Error in payment process:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during payment processing',
      };
    }
  }

  /**
   * Clean up Stripe resources
   */
  cleanup() {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    if (this.elements) {
      this.elements = null;
    }
    this.stripe = null;
    this.publicKey = null;
  }
}

// Create singleton instance
export const stripeService = new StripeService();
