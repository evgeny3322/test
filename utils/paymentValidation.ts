import * as yup from 'yup';
import { PaymentValidationErrors } from '@/types/payment';

export const userFormSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test(
      'email-dot',
      'The email address must contain a dot (.) after the @ symbol',
      (value) => value.includes('.') && value.indexOf('.') > value.indexOf('@')
    ),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().required('Country is required'),
});

export const validatePaymentForm = async (
  formData: any
): Promise<{
  isValid: boolean;
  errors: PaymentValidationErrors;
}> => {
  try {
    await userFormSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: PaymentValidationErrors = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path as keyof PaymentValidationErrors] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { email: 'Validation failed' } };
  }
};

export const formatCreditCardError = (error: any): string => {
  if (!error) return '';

  const errorMessages: Record<string, string> = {
    card_error:
      'There was an issue with your credit card. Please check your card details and try again.',
    validation_error: 'Please check your payment information and try again.',
    rate_limit_error: 'Too many requests. Please try again later.',
    invalid_request_error: 'The payment request was invalid. Please try again.',
    authentication_error: 'Authentication with the payment service failed.',
    api_error: 'Payment service is temporarily unavailable. Please try again later.',
    expired_card: 'Your card has expired. Please use a different card.',
    incorrect_cvc: "Your card's security code is incorrect. Please check the code.",
    insufficient_funds: 'Your card has insufficient funds. Please use a different payment method.',
    payment_intent_authentication_failure: 'Authentication for this payment failed.',
    'incorrect-zip': "Your card's zip code failed validation. Please check the zip code.",
    'card-declined': 'Your card was declined. Please use a different card or contact your bank.',
  };

  if (error.type && errorMessages[error.type]) {
    return errorMessages[error.type];
  }

  if (error.decline_code && errorMessages[error.decline_code]) {
    return errorMessages[error.decline_code];
  }

  return error.message || 'An error occurred while processing your payment. Please try again.';
};
