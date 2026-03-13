import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ExitWarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  saving: boolean;
}

export const ExitWarningModal: React.FC<ExitWarningModalProps> = ({
  isOpen,
  onCancel,
  onSaveAndExit,
  onExitWithoutSaving,
  saving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unsaved Changes
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You have unsaved changes that will be lost if you leave this page. What would you like to do?
        </p>
        <div className="flex items-center justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSaveAndExit} loading={saving}>
            Save & Exit
          </Button>
          <Button variant="primary" onClick={onExitWithoutSaving}>
            Exit Without Saving
          </Button>
        </div>
      </div>
    </div>
  );
};
