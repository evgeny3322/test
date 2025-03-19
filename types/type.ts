export interface VueTelInputCountryObject {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes: any;
}

export type ResponseStatus = 'error' | 'success';

export interface ResponseInterface<T = any> {
  status: ResponseStatus;
  message: string;
  data?: T;
}
