import { MedicalDocumentType } from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

class MediaServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'MediaServiceError';
  }
}

export interface MedicalReport {
  id: string;
  name: string;
  url: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
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
            ? 'Media API endpoint not found.'
            : 'Server returned an unexpected response.';
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    throw new MediaServiceError(response.status, errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text() as unknown as T;
};

export const heartSurgeryMediaService = {
  async getAllDocuments(applicationId: string): Promise<Record<MedicalDocumentType, string>> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/documents`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse<Record<MedicalDocumentType, string>>(response);
    } catch (error) {
      console.error('getAllDocuments error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async getAllReports(applicationId: string): Promise<MedicalReport[]> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/reports`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      const data = await handleResponse<Array<Record<string, string>>>(response);
      return data.map(item => ({
        id: item.id || item.reportId || '',
        name: item.name || item.reportName || '',
        url: item.url || '',
      }));
    } catch (error) {
      console.error('getAllReports error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async getDocument(applicationId: string, docType: MedicalDocumentType): Promise<string> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/${docType}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse<string>(response);
    } catch (error) {
      console.error('getDocument error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async uploadDocument(applicationId: string, docType: MedicalDocumentType, file: File): Promise<string> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/documents/${docType}`, {
        method: 'POST',
        headers: {
          ...authHeaders,
        },
        body: formData,
      });

      return await handleResponse<string>(response);
    } catch (error) {
      console.error('uploadDocument error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async uploadReport(applicationId: string, file: File, reportName: string): Promise<string> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportName', reportName);

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/reports`, {
        method: 'POST',
        headers: {
          ...authHeaders,
        },
        body: formData,
      });

      return await handleResponse<string>(response);
    } catch (error) {
      console.error('uploadReport error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteReport(applicationId: string, reportId: string): Promise<string> {
    if (!applicationId) {
      throw new MediaServiceError(400, 'Application ID is required');
    }
    if (!reportId) {
      throw new MediaServiceError(400, 'Report ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();

    try {
      const response = await fetch(`${API_BASE_URL}/application/heart/${applicationId}/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse<string>(response);
    } catch (error) {
      console.error('deleteReport error:', error);
      if (error instanceof MediaServiceError) {
        throw error;
      }
      throw new MediaServiceError(500, 'Network error or server unavailable');
    }
  },
};
