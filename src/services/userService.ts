import { UserProfile, UserCreateRequest, UserMediaType } from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

class UserServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('API call returned 401, user might need to re-authenticate');
    }
    
    let errorMessage = `HTTP ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText.includes('<!doctype') || errorText.includes('<html')) {
          errorMessage = response.status === 404 
            ? 'User API endpoint not found. Please check your backend server.' 
            : 'Server returned an unexpected response.';
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    
    throw new UserServiceError(response.status, errorMessage);
  }
  
  try {
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    if (contentLength === '0' || !contentType) {
      return null;
    }
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new UserServiceError(500, 'Invalid response from server');
  }
};

export const userService = {
  // User Profile Operations
  async getUserProfile(userId: string): Promise<UserProfile> {
    if (!userId) {
      throw new UserServiceError(400, 'User ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching user profile for ID: ${userId}`);
      console.log(`API URL: ${API_BASE_URL}/users/${userId}`);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getUserProfile error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  // User CRUD Operations
  async createUser(request: UserCreateRequest): Promise<string> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log('Creating user:', request);
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(request),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('createUser error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateUser(userId: string, request: UserCreateRequest): Promise<string> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log('Updating user:', userId, request);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(request),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('updateUser error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  async updatePassword(userId: string, request: { password: string }): Promise<void> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log('Updating password for user:', userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(request),
      });
      
      await handleResponse(response);
    } catch (error) {
      console.error('updatePassword error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteUser(userId: string): Promise<void> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log('Deleting user:', userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      await handleResponse(response);
    } catch (error) {
      console.error('deleteUser error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  // User Media Operations
  async uploadUserMedia(userId: string, file: File, type: UserMediaType): Promise<string> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Uploading ${type} for user: ${userId}`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/users/media/${userId}/file/${type.toUpperCase()}`, {
        method: 'POST',
        headers: {
          ...authHeaders,
        },
        body: formData,
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('uploadUserMedia error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  async getUserSignatureUrl(userId: string): Promise<string> {
    if (!userId) {
      throw new UserServiceError(400, 'User ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching signature URL for user: ${userId}`);
      
      const response = await fetch(`${API_BASE_URL}/users/media/${userId}/file/SIGNATURE`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getUserSignatureUrl error:', error);
      if (error instanceof UserServiceError) {
        throw error;
      }
      throw new UserServiceError(500, 'Network error or server unavailable');
    }
  },

  // Generic authenticated fetch
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeaders = keycloakService.getAuthHeader();
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });
  },
};