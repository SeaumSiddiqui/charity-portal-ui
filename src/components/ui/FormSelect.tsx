import React from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  helpText,
}) => {
  const baseSelectClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200 
    dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-0
    focus:ring-1 focus:ring-primary-500 focus:border-primary-500
  `;

  const getSelectClasses = (hasError: boolean) => {
    let classes = baseSelectClasses;
    
    if (disabled) {
      classes += ' bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed';
    }
    
    if (hasError) {
      classes += ' border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10';
    } else {
      classes += ' border-gray-300 dark:border-gray-600';
    }
    
    return `${classes} ${className}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <select
            {...field}
            disabled={disabled}
            className={getSelectClasses(meta.touched && !!meta.error)}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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