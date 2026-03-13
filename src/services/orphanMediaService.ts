import { DocumentType } from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/orphan/documents`;

class OrphanMediaServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'OrphanMediaServiceError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    
    throw new OrphanMediaServiceError(response.status, errorMessage);
  }
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new OrphanMediaServiceError(500, 'Invalid response from server');
  }
};

export const orphanMediaService = {
  async getAllDocumentUrls(applicationId: string): Promise<Record<DocumentType, string>> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching all document URLs for application: ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getAllDocumentUrls error:', error);
      if (error instanceof OrphanMediaServiceError) {
        throw error;
      }
      throw new OrphanMediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async getDocumentUrl(applicationId: string, docType: DocumentType): Promise<string> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching document URL for application: ${applicationId}, type: ${docType}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}/document/${docType}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getDocumentUrl error:', error);
      if (error instanceof OrphanMediaServiceError) {
        throw error;
      }
      throw new OrphanMediaServiceError(500, 'Network error or server unavailable');
    }
  },

  async uploadDocument(applicationId: string, file: File, docType: DocumentType): Promise<string> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Uploading document for application: ${applicationId}, type: ${docType}`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}/document/${docType}`, {
        method: 'POST',
        headers: {
          ...authHeaders,
        },
        body: formData,
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('uploadDocument error:', error);
      if (error instanceof OrphanMediaServiceError) {
        throw error;
      }
      throw new OrphanMediaServiceError(500, 'Network error or server unavailable');
    }
  },
};