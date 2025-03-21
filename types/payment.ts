// types/payment.ts

export interface PaymentUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  createAccount?: boolean;
  notes?: string;
}

export type PaymentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface StripeError {
  type: string;
  code?: string;
  message: string;
  param?: string;
}

export interface StripeTokenResult {
  token?: {
    id: string;
    object: string;
    card: any;
    client_ip: string;
    created: number;
    livemode: boolean;
    type: string;
    used: boolean;
  };
  error?: StripeError;
}

export interface StripeCardElement {
  mount(element: string | HTMLElement): void;
  unmount(): void;
  destroy(): void;
  on(event: string, handler: (event: any) => void): void;
  update(options: any): void;
}

export interface Payment {
  id: number;
  img: string;
  title: string;
  area: string;
  date: string;
  participants_number: number;
  total_duration: number;
  total_price: number;
  transportation: string;
  services: PaymentService[];
  orderId?: number;
  paymentIntentId?: string;
}

export interface PaymentService {
  id: number;
  title: string;
  description: string;
  price: number;
  img: string;
}

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus | null;
  isSuccessful: boolean;
  orderId: number | null;
}
