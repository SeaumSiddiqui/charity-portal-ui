import React from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { AlertCircle } from 'lucide-react';

interface FormCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  disabled = false,
  className = '',
  helpText,
}) => {
  return (
    <div className="space-y-2">
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
            <input
              {...field}
              type="checkbox"
              checked={field.value || false}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </label>
        )}
      </Field>
      
      <ErrorMessage name={name}>
        {(msg) => (
          <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{msg}</span>
          </div>
        )}
      </ErrorMessage>
      
      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};