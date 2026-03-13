import React from 'react';
import { Save, Send, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ApplicationStatus, ValidationError } from '../../../types';

interface FormActionsProps {
  status: ApplicationStatus;
  errors: ValidationError[];
  saving: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
  onPreview?: () => void;
  isFormDisabled?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  status,
  errors,
  saving,
  hasUnsavedChanges,
  onSave,
  onSubmit,
  onPreview,
  isFormDisabled = false
}) => {
  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.COMPLETE:
        return '✅';
      case ApplicationStatus.PENDING:
        return '⏳';
      case ApplicationStatus.REJECTED:
        return '❌';
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.GRANTED:
        return '✅';
      default:
        return '⚪';
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="relative p-8">
        {/* Error Summary */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400">
                Please fix {errors.length} error{errors.length > 1 ? 's' : ''} before submitting
              </h3>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Review the highlighted fields above and correct any issues.
            </p>
          </div>
        )}

        {/* Main Action Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4 shadow-lg">
            <Send className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to Submit?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Review your application carefully before submitting. You can save as draft to continue later.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            onClick={onSubmit}
            loading={saving}
            disabled={isFormDisabled || errors.length > 0}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Application
          </Button>

          <Button
            variant="secondary"
            onClick={onSave}
            loading={saving}
            disabled={isFormDisabled}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="h-5 w-5 mr-2" />
            Save as Draft
          </Button>

          {onPreview && (
            <Button
              variant="outline"
              onClick={onPreview}
              disabled={isFormDisabled}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Eye className="h-5 w-5 mr-2" />
              Preview Form
            </Button>
          )}
        </div>

        {/* Status Information */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{getStatusIcon(status)}</span>
              <span>Status: {status.replace('_', ' ')}</span>
            </div>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};