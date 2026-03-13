import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RejectionAlertProps {
  message: string;
}

export const RejectionAlert: React.FC<RejectionAlertProps> = ({ message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Application Rejected
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
