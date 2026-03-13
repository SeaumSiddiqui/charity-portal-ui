import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAnyRole?: boolean; // If true, user needs ANY of the roles, if false, user needs ALL roles
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * RoleBasedAccess Component
 * 
 * Controls visibility of content based on user roles.
 * Uses frontend client roles (app-*) for access control.
 * 
 * @param requiredRoles - Array of frontend roles required (e.g., ['app-admin', 'app-agent'])
 * @param requireAnyRole - If true, user needs ANY role; if false, user needs ALL roles
 * @param fallback - Component to show when access is denied
 * @param children - Content to show when access is granted
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requiredRoles = [],
  requireAnyRole = true,
  fallback = null,
  className = ''
}) => {
  const { hasRole, hasAnyRole, isAuthenticated } = useAuth();

  // If not authenticated, don't show content
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // If no roles required, show content
  if (requiredRoles.length === 0) {
    return <div className={className}>{children}</div>;
  }

  // Check role-based access
  const hasAccess = requireAnyRole 
    ? hasAnyRole(requiredRoles)
    : requiredRoles.every(role => hasRole(role));

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  return <>{fallback}</>;
};

// Convenience components for specific roles
export const AdminOnly: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-admin']} />
);

export const AgentOnly: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-agent']} />
);

export const AuthenticatorOnly: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-authenticator']} />
);

export const UserOnly: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-user']} />
);

export const StaffOnly: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-admin', 'app-agent', 'app-authenticator']} />
);

export const AdminOrAgent: React.FC<Omit<RoleBasedAccessProps, 'requiredRoles'>> = (props) => (
  <RoleBasedAccess {...props} requiredRoles={['app-admin', 'app-agent']} />
);