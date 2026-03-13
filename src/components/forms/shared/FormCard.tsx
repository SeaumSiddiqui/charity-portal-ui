import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

type ColorVariant = 'primary' | 'teal';

interface FormCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  colorVariant?: ColorVariant;
}

const colorClasses: Record<ColorVariant, { bg: string; icon: string }> = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    icon: 'text-primary-600 dark:text-primary-400',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    icon: 'text-teal-600 dark:text-teal-400',
  },
};

export const FormCard: React.FC<FormCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  children,
  colorVariant = 'primary',
}) => {
  const colors = colorClasses[colorVariant];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 ${colors.bg} rounded-lg`}>
            <Icon className={`h-5 w-5 ${colors.icon}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};
