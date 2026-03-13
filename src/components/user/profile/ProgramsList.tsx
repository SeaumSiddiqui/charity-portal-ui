import React from 'react';
import { Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ProgramDTO, ProgramStatus } from '../../../types';
import { ApplicationStatus } from '../../../types';

interface ProgramsListProps {
  programs: ProgramDTO[];
}

export const ProgramsList: React.FC<ProgramsListProps> = ({ programs }) => {
  // Handle null or undefined programs
  const safePrograms = programs || [];

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case ApplicationStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case ApplicationStatus.GRANTED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return 'success';
      case ApplicationStatus.REJECTED:
        return 'error';
      case ApplicationStatus.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProgramStatusVariant = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.ACTIVE:
        return 'success';
      case ProgramStatus.SUSPENDED:
        return 'error';
      case ProgramStatus.COMPLETED:
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (safePrograms.length === 0) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Programs
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your enrolled charity programs
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No programs enrolled</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Contact your agent to apply for charity programs
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Programs
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your enrolled charity programs and their status
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {safePrograms.map((program) => (
            <div
              key={program.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-200 dark:hover:border-secondary-600 transition-colors duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(program.status)}
                  <span className="font-medium text-gray-900 dark:text-white">
                    Program #{program.id.slice(-8)}
                  </span>
                </div>
                <Badge variant={getStatusVariant(program.status)}>
                  {program.status.replace('_', ' ')}
                </Badge>
              </div>

              {program.status === ApplicationStatus.REJECTED && program.rejectionMessage && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    <strong>Rejection Reason:</strong> {program.rejectionMessage}
                  </p>
                </div>
              )}

              {program.enrollment && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Amount</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${program.enrollment.monthlyAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Payment Status</p>
                      <Badge 
                        variant={program.enrollment.isPaid ? 'success' : 'warning'}
                        size="sm"
                      >
                        {program.enrollment.isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(program.enrollment.enrolledAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${
                        program.enrollment.status === ProgramStatus.ACTIVE 
                          ? 'bg-green-500' 
                          : program.enrollment.status === ProgramStatus.SUSPENDED
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <Badge 
                        variant={getProgramStatusVariant(program.enrollment.status)}
                        size="sm"
                      >
                        {program.enrollment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};