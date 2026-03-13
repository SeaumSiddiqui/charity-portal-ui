import React from 'react';
import { AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { ApplicationStatus } from '../../../types';
import { Badge } from '../../ui/Badge';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  showIcon?: boolean;
}

export const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.COMPLETE:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case ApplicationStatus.PENDING:
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case ApplicationStatus.REJECTED:
      return <X className="h-4 w-4 text-red-500" />;
    case ApplicationStatus.ACCEPTED:
    case ApplicationStatus.GRANTED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

export const getStatusVariant = (status: ApplicationStatus): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case ApplicationStatus.COMPLETE:
      return 'success';
    case ApplicationStatus.PENDING:
      return 'warning';
    case ApplicationStatus.REJECTED:
      return 'error';
    case ApplicationStatus.ACCEPTED:
    case ApplicationStatus.GRANTED:
      return 'success';
    default:
      return 'default';
  }
};

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  showIcon = true,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {showIcon && getStatusIcon(status)}
      <Badge variant={getStatusVariant(status)}>
        {status.replace('_', ' ')}
      </Badge>
    </div>
  );
};
