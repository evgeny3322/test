export interface User {
  id: number;
  name: string;
  first_name?: string | null;
  last_name: string;
  phone: string;
  email: string;
  zoho_id?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  type: string;
  country?: string | null;
  reset_password_hash?: string | null;
}

export interface updatedUser {
  name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  country?: string | null;
}

export interface RegistrationData {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileUpdateData {
  name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

export interface PasswordChangeData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface EmailVerificationData {
  email: string;
  code: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AgencyInformation {
  prefix: string;
  company_name: string;
  iata_code: string;
  alternative_industry_code: string;
  vat: string;
  fiscal_code: string;
  tax_id_code: string;
  sdi_code: string;
  country: string;
  region: string;
  city: string;
  cap_zip: string;
  address: string;
  internal_number: string;
  company_main_phone: string;
  company_main_phone_code: string;
  company_main_email: string;
  operations_phone: string;
  operations_phone_code: string | number;
  operations_email: string;
  booking_phone: string;
  booking_phone_code: string;
  booking_email: string;
  administration_phone: string;
  administration_phone_code: string;
  administration_email: string;
  erp: string;
  notes: string;
}
