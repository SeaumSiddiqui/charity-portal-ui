// Keycloak configuration from environment variables
export const authConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

// Keycloak URLs
export const keycloakUrls = {
  auth: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/auth`,
  token: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/token`,
  userInfo: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/userinfo`,
  logout: `${authConfig.url}/realms/${authConfig.realm}/protocol/openid-connect/logout`
};

// OAuth2 configuration
export const oauthConfig = {
  clientId: authConfig.clientId,
  redirectUri: `${window.location.origin}/auth/callback`,
  responseType: 'code',
  scope: 'openid profile email',
  grantType: 'authorization_code'
};

// Qatar Charity Bangladesh roles
export const roles = {
  USER: 'app-user',
  AGENT: 'app-agent',
  AUTHENTICATOR: 'app-authenticator',
  ADMIN: 'app-admin'
};

// ✅ Environment info
export const envInfo = {
  mode: import.meta.env.MODE, // "development" or "production"
  keycloakUrl: authConfig.url,
  realm: authConfig.realm,
  clientId: authConfig.clientId
};

// ✅ Safe logging — only in development
if (import.meta.env.DEV) {
  console.group('🔐 Keycloak Configuration');
  console.log('Environment:', envInfo.mode);
  console.log('Keycloak URL:', authConfig.url);
  console.log('Realm:', authConfig.realm);
  console.log('Client ID:', authConfig.clientId);
  console.groupEnd();
}
