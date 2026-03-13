import React from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  helpText?: string;
  autoFilled?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  helpText,
  autoFilled = false,
  rows,
  min,
  max,
  step,
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg transition-all duration-200 
    dark:text-white focus:outline-none focus:ring-0
  `;

  const getInputClasses = (hasError: boolean) => {
    let classes = baseInputClasses;
    
    if (readOnly || disabled) {
      classes += ' bg-gray-50 dark:bg-gray-600 border-gray-200 dark:border-gray-500 cursor-not-allowed';
    } else {
      classes += ' dark:bg-gray-700 focus:ring-1 focus:ring-primary-500 focus:border-primary-500';
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
        {autoFilled && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2 font-normal">
            (Auto-filled)
          </span>
        )}
      </label>
      
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <>
            {type === 'textarea' ? (
              <textarea
                {...field}
                rows={rows || 3}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className={getInputClasses(meta.touched && !!meta.error)}
              />
            ) : (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                min={min}
                max={max}
                step={step}
                className={getInputClasses(meta.touched && !!meta.error)}
              />
            )}
          </>
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