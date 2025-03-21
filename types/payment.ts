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

export interface PaymentStoreState {
  loading: boolean;
  error: string | null;
  paymentStatus: PaymentStatus | null;
  clientSecret: string | null;
  paymentIntentId: string | null;
  orderId: number | null;
  userDetails: PaymentUser | null;
}