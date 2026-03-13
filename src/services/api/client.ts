import { keycloakService } from '../authService';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

const parseErrorResponse = async (response: Response): Promise<string> => {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return errorData.message || errorData.error || `HTTP ${response.status}`;
    } else {
      const errorText = await response.text();
      if (errorText.includes('<!doctype') || errorText.includes('<html')) {
        return response.status === 404
          ? 'API endpoint not found. Please check your backend server.'
          : 'Server returned an unexpected response.';
      }
      return errorText || `HTTP ${response.status}`;
    }
  } catch {
    return `HTTP ${response.status}`;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response);
    throw new ApiError(response.status, errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(500, 'Invalid JSON response from server');
  }
};

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
}

const buildUrl = (endpoint: string, params?: RequestConfig['params']): string => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

const getHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
  const authHeaders = keycloakService.getAuthHeader();
  return {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...customHeaders,
  };
};

export const apiClient = {
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(config?.headers),
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(config?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(config?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(config?.headers),
    });
    return handleResponse<T>(response);
  },

  async postBlob(endpoint: string, data?: unknown, config?: RequestConfig): Promise<Blob> {
    const url = buildUrl(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(config?.headers),
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response);
      throw new ApiError(response.status, errorMessage);
    }

    return response.blob();
  },

  getBaseUrl(): string {
    return API_BASE_URL;
  },
};
