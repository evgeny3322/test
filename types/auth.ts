import * as yup from 'yup';

export interface sendVerificationCodeInterface {
  email: string;
  name: string;
  last_name: string;
  phone?: string;
  country_code?: string;
}

export interface RegisterInfoInterface {
  step: 1 | 2 | 3; // 1 = signUp, 2 = emailVerification, 3 = setPassword
  email: string;
  name: string;
  last_name: string;
  phone?: string;
  country_code?: string;
  hash?: string;
}

export interface ResetPasswordMailInterface {
  email: string;
}

export interface ResetPasswordInterface {
  hash: string;
  password: string;
}

export async function IsRegisterInfoInterface(data: any): Promise<RegisterInfoInterface> {
  let schema: yup.ObjectSchema<RegisterInfoInterface> = yup.object({
    step: yup.number<1 | 2 | 3>().required(),
    email: yup.string().required(),
    name: yup.string().required(),
    last_name: yup.string().required(),
    phone: yup.string(),
    country_code: yup.string(),
    hash: yup.string(),
  });
  return await schema.validate(data);
}
