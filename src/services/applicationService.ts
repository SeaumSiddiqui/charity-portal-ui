import { OrphanApplication, OrphanApplicationSummaryDTO, PageResponse, OrphanApplicationFilters } from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/applications/orphan`;

class ApplicationServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApplicationServiceError';
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
        if (errorText.includes('<!doctype') || errorText.includes('<html')) {
          errorMessage = response.status === 404 
            ? 'Application API endpoint not found. Please check your backend server.' 
            : 'Server returned an unexpected response.';
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    
    throw new ApplicationServiceError(response.status, errorMessage);
  }
  
  try {
    return await response.json();
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError);
    throw new ApplicationServiceError(500, 'Invalid JSON response from server');
  }
};

export const applicationService = {
  // Single Application CRUD Operations
  async createApplication(application: OrphanApplication): Promise<OrphanApplication> {
    const authHeaders = keycloakService.getAuthHeader();

    try {
      console.log('Creating orphan application');
      console.log(`API URL: ${API_BASE_URL}`);

      const requestBody = {
        beneficiaryUserId: application.beneficiaryUserId,
        status: application.status,
        primaryInformation: application.primaryInformation,
        address: application.address,
        familyMembers: application.familyMembers,
        basicInformation: application.basicInformation
      };
      
      console.log('Application request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(requestBody),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('createApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplication(applicationId: string, application: OrphanApplication): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Updating orphan application ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(application),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('updateApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getApplication(applicationId: string): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching orphan application ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteApplication(applicationId: string): Promise<void> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Deleting orphan application: ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      if (!response.ok) {
        throw new ApplicationServiceError(response.status, 'Failed to delete application');
      }
    } catch (error) {
      console.error('deleteApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplicationStatus(applicationId: string, status: string, rejectionMessage?: string): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }

    try {
      console.log(`Updating application ${applicationId} status to ${status}`);

      const application = await this.getApplication(applicationId);
      const updatedApplication = {
        ...application,
        status: status as any
      };

      if (rejectionMessage) {
        updatedApplication.rejectionMessage = rejectionMessage;
      }

      return await this.updateApplication(applicationId, updatedApplication);
    } catch (error) {
      console.error('updateApplicationStatus error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  // Application List Operations
  async getAllApplications(filters: OrphanApplicationFilters = {}): Promise<PageResponse<OrphanApplicationSummaryDTO>> {
    const authHeaders = keycloakService.getAuthHeader();

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    try {
      console.log(`Fetching orphan applications with filters:`, filters);
      console.log(`API URL: ${API_BASE_URL}?${params.toString()}`);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('getAllApplications error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async exportToExcel(filters: OrphanApplicationFilters, headers: string[]): Promise<Blob> {
    const authHeaders = keycloakService.getAuthHeader();
    const EXPORT_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/orphan/export`;

    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.lastReviewedBy) params.append('lastReviewedBy', filters.lastReviewedBy);

    if (filters.createdStartDate) params.append('createdStartDate', filters.createdStartDate);
    if (filters.createdEndDate) params.append('createdEndDate', filters.createdEndDate);
    if (filters.lastModifiedStartDate) params.append('lastModifiedStartDate', filters.lastModifiedStartDate);
    if (filters.lastModifiedEndDate) params.append('lastModifiedEndDate', filters.lastModifiedEndDate);
    if (filters.dateOfBirthStartDate) params.append('dateOfBirthStartDate', filters.dateOfBirthStartDate);
    if (filters.dateOfBirthEndDate) params.append('dateOfBirthEndDate', filters.dateOfBirthEndDate);

    if (filters.id) params.append('id', filters.id);
    if (filters.fullName) params.append('fullName', filters.fullName);
    if (filters.bcRegistration) params.append('bcRegistration', filters.bcRegistration);
    if (filters.fathersName) params.append('fathersName', filters.fathersName);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.physicalCondition) params.append('physicalCondition', filters.physicalCondition);
    if (filters.permanentDistrict) params.append('permanentDistrict', filters.permanentDistrict);
    if (filters.permanentSubDistrict) params.append('permanentSubDistrict', filters.permanentSubDistrict);

    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

    try {
      const response = await fetch(`${EXPORT_URL}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ headers }),
      });

      if (!response.ok) {
        throw new ApplicationServiceError(response.status, 'Failed to export applications');
      }

      return await response.blob();
    } catch (error) {
      console.error('exportToExcel error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },
};