export interface OrphanApplicationSummaryDTO {
  id: string;
  fullName: string;
  fathersName: string;
  dateOfBirth: string;
  gender: string;
  permanentDistrict: string;
  status: string;
  rejectionMessage?: string;
  createdAt?: string;
  lastModifiedAt?: string;
  createdBy?: string;
  lastReviewedBy?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export interface OrphanApplicationFilters {
  status?: string;
  createdBy?: string;
  lastReviewedBy?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  lastModifiedStartDate?: string;
  lastModifiedEndDate?: string;
  dateOfBirthStartDate?: string;
  dateOfBirthEndDate?: string;
  id?: string;
  fullName?: string;
  bcRegistration?: string;
  fathersName?: string;
  gender?: string;
  physicalCondition?: string;
  residenceStatus?: string;
  permanentDistrict?: string;
  permanentSubDistrict?: string;
  sortField?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export { Gender, ApplicationStatus } from './application';