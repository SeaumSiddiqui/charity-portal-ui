export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresAt: number; 
  tokenType: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  preferred_username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

// Qatar Charity Bangladesh specific roles
export enum UserRole {
  USER = 'app-user',
  AGENT = 'app-agent',
  AUTHENTICATOR = 'app-authenticator',
  ADMIN = 'app-admin'
}

export interface RolePermissions {
  [UserRole.USER]: string[];
  [UserRole.AGENT]: string[];
  [UserRole.AUTHENTICATOR]: string[];
  [UserRole.ADMIN]: string[];
}