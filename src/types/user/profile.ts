import { ApplicationStatus } from '../application/application';

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  isEnabled: boolean;
  userRoles: string[];
  userPermissions: string[];
  cell: string;
  address: string;
  bcregistration: string;
  accountTitle: string;
  accountNumber: string;
  bankTitle: string;
  branch: string;
  routingNumber: string;
  programs: ProgramDTO[];
}

export interface ProgramDTO {
  id: string;
  status: ApplicationStatus;
  rejectionMessage?: string;
  enrollment: ProgramEnrollmentDTO;
}

export interface ProgramEnrollmentDTO {
  id: string;
  status: ProgramStatus;
  monthlyAmount: number;
  isPaid: boolean;
  enrolledAt: string;
  lastUpdatedAt: string;
}

export enum ProgramStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED'
}