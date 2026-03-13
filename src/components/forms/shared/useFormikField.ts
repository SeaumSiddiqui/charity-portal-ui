import { FormikProps } from 'formik';

export const getFieldError = <T>(formik: FormikProps<T>, fieldName: string): string | null => {
  const keys = fieldName.split('.');
  let error: unknown = formik.errors;
  let touched: unknown = formik.touched;

  for (const key of keys) {
    error = (error as Record<string, unknown>)?.[key];
    touched = (touched as Record<string, unknown>)?.[key];
  }

  return touched && typeof error === 'string' ? error : null;
};

export const getNestedValue = <T>(obj: T, path: string): unknown => {
  const keys = path.split('.');
  let value: unknown = obj;
  for (const key of keys) {
    value = (value as Record<string, unknown>)?.[key];
  }
  return value;
};
