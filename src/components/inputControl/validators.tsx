/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import moment from 'moment';

export type ErrorMessage = string | undefined;
export type Validator = (value: any, formValues?: any) => ErrorMessage;

export const validateValue = (
  key: string,
  value: any,
  formValues: any,
  validators: any = [],
): string | undefined => {
  if (validators.length > 0) {
    const errors: string[] = [];
    validators.forEach((validator: any) => {
      const error = validator(value, { ...formValues });
      if (error) {
        errors.push(error);
      }
    });
    if (errors.length > 0) {
      return errors[0];
    }
    return undefined;
  }
  return undefined;
};

export const required = (
  errMessage: string,
): Validator => (
  value: any,
): ErrorMessage => (
  !value || value.length === 0
    ? errMessage : undefined);

export const requiredIf = (
  errMessage: string,
  callback: (formValues: any) => boolean,
): Validator => (value: any, formValues: any): ErrorMessage => {
  if (callback(formValues)) {
    return required(errMessage)(value);
  }
  return undefined;
};

export const validPhone = (errMessage: string):
  Validator => (value: any):
    ErrorMessage => {
  if (value?.phone) {
    if (value?.phone && value?.dialCode && !/^[0-9]\d*$/i.test(value?.phone)) {
      return 'createPatient.form.errors.validNumberRequired';
    }
    return undefined;
  }
  return errMessage;
};
export const emailValidator = (value?: string): ErrorMessage => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i.test(value)
  ? 'Please enter a valid email'
  : undefined);

export const number = (value: any) => {
  if (/^[0-9]\d*$/i.test(value)) {
    return undefined;
  }
  return 'Please enter valid zip code';
};
export const fax = (value: any) => {
  if (/^[0-9]\d*$/i.test(value)) {
    return undefined;
  }
  return 'Please enter valid fax number';
};

export const ValidExpiryDate = (value?: any) => {
  const today = moment().format('YYYY-MM-DD');
  const y = moment(value).format('y');
  const dateIsValid = moment(y, 'YYYY', true).isValid();
  const selected = moment(value).isSameOrBefore(today);
  const selectedFullDate = moment(value?._i, 'YYYY-M-D', true).isValid();
  if (value) {
    if (selected !== true) {
      return 'PatientLogin.errors.dobInvalid';
    }
    if (!dateIsValid || !selectedFullDate) {
      return 'PatientLogin.errors.dobInvalid';
    }
  } return undefined;
};
export const validPhoneNumber = (errMessage: string):
  Validator => (value: any):
    ErrorMessage => {
  if (value?.phone && value?.dialCode && !/^[0-9]\d*$/i.test(value?.phone)) {
    return errMessage;
  }
  return undefined;
};

export const validFax = (errMessage: string):
  Validator => (value: any):
    ErrorMessage => {
  if (value && !/^[0-9]\d*$/i.test(value)) {
    return errMessage;
  }
  return undefined;
};
export const otpValidator = (value: string) => {
  if (value?.length === 6) {
    return undefined;
  }
  return 'resetPassword.form.otpValid';
};

export const phoneRequired = (errMessage: string):
  Validator => (value: any):
    ErrorMessage => (!value?.phone || value?.phone.length < 1 ? errMessage : undefined);
export const domainValidator = (domains: string[] = []) => (value?: string) => {
  if (value) {
    const domain = value.split('@')?.[1];
    if (domains.indexOf(domain) === -1) {
      return 'general.errors.domainInvalid';
    }
  }
  return undefined;
};

export const validExpDate = (errMessage: string):
  Validator => (value: any):
    ErrorMessage => {
  const today = moment().format('YYYY-MM-DD');
  const y = moment(value).format('y');
  const dateIsValid = moment(y, 'YYYY', true).isValid();
  const selected = moment(value).isAfter(today);
  const selectedFullDate = moment(value?._i, 'YYYY-M-D', true).isValid();
  if (value) {
    if (selected !== true) {
      return errMessage;
    }
    if (!dateIsValid || !selectedFullDate) {
      return errMessage;
    }
  } return undefined;
};

export const zipcode = ():
  Validator => (value: any):
    ErrorMessage => (!value?.zipcode || value?.zipcode.length < 1 ? 'ssss' : undefined);

export const amountValidator = (
  errMessage: string,
  skipValidation?: (formValues: any) => boolean,
): Validator => (value?: string, formValues?: any): ErrorMessage => {
  if (skipValidation && skipValidation(formValues)) {
    return undefined;
  }

  return value && !/^-?\d*[.]?\d{0,2}$/.test(value) ? errMessage : undefined;
};

export const positiveInteger = (errMessage: string): Validator => (value?: string): ErrorMessage => (value && !/^\+?[1-9]\d*$/.test(value) ? errMessage : undefined);

export const confirmPassword = (errMessage: string, validateWith = 'password'): Validator => (value: any, formValues: any): ErrorMessage => (value && formValues?.[validateWith]?.value !== value
  ? errMessage
  : undefined);
