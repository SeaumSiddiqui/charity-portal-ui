import {
  MedicalApplication,
  MedicalApplicationSummaryDTO,
  MedicalApplicationFilters,
  MedicalApplicationCreateDTO,
  MedicalApplicationUpdateDTO,
  SurgeryType,
  createEmptyMedicalApplication,
  PageResponse
} from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

class MedicalApplicationServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'MedicalApplicationServiceError';
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

    throw new MedicalApplicationServiceError(response.status, errorMessage);
  }

  try {
    return await response.json();
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError);
    throw new MedicalApplicationServiceError(500, 'Invalid JSON response from server');
  }
};

const getEndpoint = (type: SurgeryType): string => {
  return type === SurgeryType.HEART_SURGERY
    ? `${API_BASE_URL}/application/heart`
    : `${API_BASE_URL}/application/eye`;
};

export const heartSurgeryService = {
  async createApplication(application: MedicalApplication): Promise<MedicalApplication> {
    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.HEART_SURGERY);

    try {
      const requestBody: MedicalApplicationCreateDTO = {
        status: application.status,
        patientInformation: application.patientInformation,
        householdInformation: application.householdInformation,
        patientAddress: application.patientAddress,
        contactInformation: application.contactInformation,
        patientFamilyMemberDTOList: application.patientFamilyMembers,
      };

      const response = await fetch(endpoint, {
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
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplication(applicationId: string, application: MedicalApplication): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.HEART_SURGERY);

    try {
      const requestBody: MedicalApplicationUpdateDTO = {
        status: application.status,
        rejectionMessage: application.rejectionMessage,
        patientInformation: application.patientInformation,
        householdInformation: application.householdInformation,
        patientAddress: application.patientAddress,
        contactInformation: application.contactInformation,
        patientFamilyMemberDTOList: application.patientFamilyMembers,
      };

      const response = await fetch(`${endpoint}/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(requestBody),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('updateApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getApplication(applicationId: string): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.HEART_SURGERY);

    try {
      const response = await fetch(`${endpoint}/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      const data = await handleResponse(response);
      return {
        ...data,
        surgeryType: SurgeryType.HEART_SURGERY,
        patientFamilyMembers: data.patientFamilyMembers || [],
        householdInformation: data.householdInformation || createEmptyMedicalApplication(SurgeryType.HEART_SURGERY).householdInformation,
        patientAddress: data.patientAddress || createEmptyMedicalApplication(SurgeryType.HEART_SURGERY).patientAddress,
        contactInformation: data.contactInformation || createEmptyMedicalApplication(SurgeryType.HEART_SURGERY).contactInformation,
      };
    } catch (error) {
      console.error('getApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getAllApplications(filters: MedicalApplicationFilters = {}): Promise<PageResponse<MedicalApplicationSummaryDTO>> {
    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.HEART_SURGERY);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('getAllApplications error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplicationStatus(applicationId: string, status: string, rejectionMessage?: string): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    try {
      const application = await this.getApplication(applicationId);
      const updatedApplication = {
        ...application,
        status: status as any,
        rejectionMessage: rejectionMessage || application.rejectionMessage,
      };

      return await this.updateApplication(applicationId, updatedApplication);
    } catch (error) {
      console.error('updateApplicationStatus error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteApplication(applicationId: string): Promise<void> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.HEART_SURGERY);

    try {
      const response = await fetch(`${endpoint}/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      if (!response.ok) {
        throw new MedicalApplicationServiceError(response.status, 'Failed to delete application');
      }
    } catch (error) {
      console.error('deleteApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async exportToExcel(filters: MedicalApplicationFilters, headers: string[]): Promise<Blob> {
    const authHeaders = keycloakService.getAuthHeader();
    const EXPORT_URL = `${API_BASE_URL}/application/heart/export`;

    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);

    if (filters.createdStartDate) params.append('createdStartDate', filters.createdStartDate);
    if (filters.createdEndDate) params.append('createdEndDate', filters.createdEndDate);
    if (filters.lastModifiedStartDate) params.append('lastModifiedStartDate', filters.lastModifiedStartDate);
    if (filters.lastModifiedEndDate) params.append('lastModifiedEndDate', filters.lastModifiedEndDate);
    if (filters.dobStart) params.append('dobStart', filters.dobStart);
    if (filters.dobEnd) params.append('dobEnd', filters.dobEnd);

    if (filters.fullName) params.append('fullName', filters.fullName);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.fathersName) params.append('fathersName', filters.fathersName);
    if (filters.mothersName) params.append('mothersName', filters.mothersName);

    if (filters.permanentDistrict) params.append('permanentDistrict', filters.permanentDistrict);
    if (filters.permanentSubDistrict) params.append('permanentSubDistrict', filters.permanentSubDistrict);
    if (filters.permanentUnion) params.append('permanentUnion', filters.permanentUnion);
    if (filters.presentDistrict) params.append('presentDistrict', filters.presentDistrict);
    if (filters.presentSubDistrict) params.append('presentSubDistrict', filters.presentSubDistrict);
    if (filters.presentUnion) params.append('presentUnion', filters.presentUnion);

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
        throw new MedicalApplicationServiceError(response.status, 'Failed to export applications');
      }

      return await response.blob();
    } catch (error) {
      console.error('exportToExcel error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },
};

export const eyeSurgeryService = {
  async createApplication(application: MedicalApplication): Promise<MedicalApplication> {
    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.EYE_SURGERY);

    try {
      const requestBody: MedicalApplicationCreateDTO = {
        status: application.status,
        patientInformation: application.patientInformation,
        householdInformation: application.householdInformation,
        patientAddress: application.patientAddress,
        contactInformation: application.contactInformation,
        patientFamilyMemberDTOList: application.patientFamilyMembers,
      };

      const response = await fetch(endpoint, {
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
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplication(applicationId: string, application: MedicalApplication): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.EYE_SURGERY);

    try {
      const requestBody: MedicalApplicationUpdateDTO = {
        status: application.status,
        rejectionMessage: application.rejectionMessage,
        patientInformation: application.patientInformation,
        householdInformation: application.householdInformation,
        patientAddress: application.patientAddress,
        contactInformation: application.contactInformation,
        patientFamilyMemberDTOList: application.patientFamilyMembers,
      };

      const response = await fetch(`${endpoint}/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(requestBody),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('updateApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getApplication(applicationId: string): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.EYE_SURGERY);

    try {
      const response = await fetch(`${endpoint}/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      const data = await handleResponse(response);
      return {
        ...data,
        surgeryType: SurgeryType.EYE_SURGERY,
        patientFamilyMembers: data.patientFamilyMembers || [],
        householdInformation: data.householdInformation || createEmptyMedicalApplication(SurgeryType.EYE_SURGERY).householdInformation,
        patientAddress: data.patientAddress || createEmptyMedicalApplication(SurgeryType.EYE_SURGERY).patientAddress,
        contactInformation: data.contactInformation || createEmptyMedicalApplication(SurgeryType.EYE_SURGERY).contactInformation,
      };
    } catch (error) {
      console.error('getApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getAllApplications(filters: MedicalApplicationFilters = {}): Promise<PageResponse<MedicalApplicationSummaryDTO>> {
    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.EYE_SURGERY);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('getAllApplications error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplicationStatus(applicationId: string, status: string, rejectionMessage?: string): Promise<MedicalApplication> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    try {
      const application = await this.getApplication(applicationId);
      const updatedApplication = {
        ...application,
        status: status as any,
        rejectionMessage: rejectionMessage || application.rejectionMessage,
      };

      return await this.updateApplication(applicationId, updatedApplication);
    } catch (error) {
      console.error('updateApplicationStatus error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteApplication(applicationId: string): Promise<void> {
    if (!applicationId) {
      throw new MedicalApplicationServiceError(400, 'Application ID is required');
    }

    const authHeaders = keycloakService.getAuthHeader();
    const endpoint = getEndpoint(SurgeryType.EYE_SURGERY);

    try {
      const response = await fetch(`${endpoint}/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      if (!response.ok) {
        throw new MedicalApplicationServiceError(response.status, 'Failed to delete application');
      }
    } catch (error) {
      console.error('deleteApplication error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async exportToExcel(filters: MedicalApplicationFilters, headers: string[]): Promise<Blob> {
    const authHeaders = keycloakService.getAuthHeader();
    const EXPORT_URL = `${API_BASE_URL}/application/eye/export`;

    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);

    if (filters.createdStartDate) params.append('createdStartDate', filters.createdStartDate);
    if (filters.createdEndDate) params.append('createdEndDate', filters.createdEndDate);
    if (filters.lastModifiedStartDate) params.append('lastModifiedStartDate', filters.lastModifiedStartDate);
    if (filters.lastModifiedEndDate) params.append('lastModifiedEndDate', filters.lastModifiedEndDate);
    if (filters.dobStart) params.append('dobStart', filters.dobStart);
    if (filters.dobEnd) params.append('dobEnd', filters.dobEnd);

    if (filters.fullName) params.append('fullName', filters.fullName);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.fathersName) params.append('fathersName', filters.fathersName);
    if (filters.mothersName) params.append('mothersName', filters.mothersName);

    if (filters.permanentDistrict) params.append('permanentDistrict', filters.permanentDistrict);
    if (filters.permanentSubDistrict) params.append('permanentSubDistrict', filters.permanentSubDistrict);
    if (filters.permanentUnion) params.append('permanentUnion', filters.permanentUnion);
    if (filters.presentDistrict) params.append('presentDistrict', filters.presentDistrict);
    if (filters.presentSubDistrict) params.append('presentSubDistrict', filters.presentSubDistrict);
    if (filters.presentUnion) params.append('presentUnion', filters.presentUnion);

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
        throw new MedicalApplicationServiceError(response.status, 'Failed to export applications');
      }

      return await response.blob();
    } catch (error) {
      console.error('exportToExcel error:', error);
      if (error instanceof MedicalApplicationServiceError) {
        throw error;
      }
      throw new MedicalApplicationServiceError(500, 'Network error or server unavailable');
    }
  },
};
