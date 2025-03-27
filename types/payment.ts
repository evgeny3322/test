export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export interface OrderData {
  order_id: string;
  payment_code: string;
  notes?: string;
}

export interface PaymentResponse {
  status: string;
  data: {
    order: {
      id: string;
      total_sum: number;
      description?: string;
    };
    payment: {
      id: string;
      client_secret: string;
    };
  };
}

export interface PaymentValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
}
