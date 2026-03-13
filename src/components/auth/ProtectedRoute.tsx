import React from 'react';
import { RoleBasedAccess } from './RoleBasedAccess';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { UnauthorizedAccess } from './UnauthorizedAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAnyRole?: boolean; // If true, user needs ANY of the roles, if false, user needs ALL roles
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAnyRole = true,
  fallback
}) => {
  const { isAuthenticated, loading, login } = useAuth();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-900 dark:text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please sign in to access Qatar Charity Bangladesh services
            </p>
          </div>
          <button
            onClick={login}
            className="w-full bg-primary-900 dark:bg-secondary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-800 dark:hover:bg-secondary-400 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Use RoleBasedAccess for role checking
  return (
    <RoleBasedAccess
      requiredRoles={requiredRoles}
      requireAnyRole={requireAnyRole}
      fallback={fallback || <UnauthorizedAccess requiredRoles={requiredRoles} />}
    >
      {children}
    </RoleBasedAccess>
  );
};