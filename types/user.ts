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
