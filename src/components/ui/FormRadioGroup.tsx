import React from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { AlertCircle } from 'lucide-react';

interface RadioOption {
  value: string | number | boolean;
  label: string;
}

interface FormRadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  inline?: boolean;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  className = '',
  helpText,
  inline = true,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <div className={`${inline ? 'flex items-center space-x-4' : 'space-y-2'} ${className}`}>
            {options.map((option) => (
              <label
                key={String(option.value)}
                className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  {...field}
                  type="radio"
                  value={String(option.value)}
                  checked={String(field.value) === String(option.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
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