import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  gradient = 'from-primary-500 to-primary-600'
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm ${className}`}>
      <div className="flex items-center space-x-4 mb-8">
        {Icon && (
          <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};