import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface UnauthorizedAccessProps {
  requiredRoles?: string[];
  message?: string;
  onGoBack?: () => void;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  requiredRoles = [],
  message,
  onGoBack
}) => {
  const defaultMessage = requiredRoles.length > 0 
    ? `This page requires one of the following roles: ${requiredRoles.join(', ')}`
    : 'You do not have permission to access this page';

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message || defaultMessage}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoBack}
              variant="primary"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};