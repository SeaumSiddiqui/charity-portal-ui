import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '../../../types';
import { Button } from '../../ui/Button';

interface StatusChangeModalProps {
  isOpen: boolean;
  currentStatus: ApplicationStatus;
  onClose: () => void;
  onConfirm?: (newStatus: ApplicationStatus, rejectionMessage?: string) => Promise<void>;
  onStatusChange?: (newStatus: string, rejectionMessage?: string) => Promise<void>;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  currentStatus,
  onClose,
  onConfirm,
  onStatusChange
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState('');

  const getAvailableStatuses = (): ApplicationStatus[] => {
    switch (currentStatus) {
      case ApplicationStatus.PENDING:
        return [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED];
      case ApplicationStatus.ACCEPTED:
        return [ApplicationStatus.GRANTED];
      default:
        return [];
    }
  };

  const getStatusColor = (status: ApplicationStatus): string => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusDescription = (status: ApplicationStatus): string => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return 'Application has been reviewed and accepted. Can be moved to GRANTED status.';
      case ApplicationStatus.REJECTED:
        return 'Application has been reviewed and rejected. Agent can edit and resubmit.';
      case ApplicationStatus.GRANTED:
        return 'Benefits have been granted to the applicant. This is a final status.';
      default:
        return '';
    }
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;
    if (selectedStatus === ApplicationStatus.REJECTED && !rejectionMessage.trim()) {
      return;
    }

    try {
      setLoading(true);
      const message = selectedStatus === ApplicationStatus.REJECTED ? rejectionMessage : undefined;
      if (onConfirm) {
        await onConfirm(selectedStatus, message);
      } else if (onStatusChange) {
        await onStatusChange(selectedStatus, message);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableStatuses = getAvailableStatuses();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Change Application Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <span>Current Status: <span className="font-semibold text-gray-900 dark:text-white">{currentStatus}</span></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select the new status for this application:
            </p>
          </div>

          <div className="space-y-3">
            {availableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedStatus === status
                    ? 'ring-2 ring-primary-500 dark:ring-secondary-500'
                    : ''
                } ${getStatusColor(status)}`}
              >
                <div className="text-left">
                  <div className="font-semibold mb-1">{status}</div>
                  <div className="text-xs opacity-90">
                    {getStatusDescription(status)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {availableStatuses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No status changes available for {currentStatus} status.
              </p>
            </div>
          )}

          {selectedStatus === ApplicationStatus.REJECTED && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionMessage}
                onChange={(e) => setRejectionMessage(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-secondary-500 focus:border-transparent resize-none"
                disabled={loading}
              />
              {!rejectionMessage.trim() && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Rejection message is required
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedStatus || loading || (selectedStatus === ApplicationStatus.REJECTED && !rejectionMessage.trim())}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Confirm Change'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
