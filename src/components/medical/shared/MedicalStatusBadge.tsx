import React from 'react';
import { ApplicationStatus } from '../../../types';

interface MedicalStatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  [ApplicationStatus.NEW]: {
    label: 'New',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  [ApplicationStatus.INCOMPLETE]: {
    label: 'Incomplete',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [ApplicationStatus.COMPLETE]: {
    label: 'Complete',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [ApplicationStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  [ApplicationStatus.ACCEPTED]: {
    label: 'Accepted',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  [ApplicationStatus.GRANTED]: {
    label: 'Granted',
    className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
};

export const MedicalStatusBadge: React.FC<MedicalStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig[ApplicationStatus.NEW];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
