import React from 'react';
import { RefreshCw, Filter, Download } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { PageResponse } from '../../../../types';
import { MedicalApplicationSummaryDTO } from '../../../../types/application/medicalApplication';

interface HeartSurgeryApplicationsHeaderProps {
  applications: PageResponse<MedicalApplicationSummaryDTO> | null;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreateNew: () => void;
  onRefresh: () => void;
  onExport?: () => void;
  loading?: boolean;
}

export const HeartSurgeryApplicationsHeader: React.FC<HeartSurgeryApplicationsHeaderProps> = ({
  applications,
  showFilters,
  onToggleFilters,
  onCreateNew,
  onRefresh,
  onExport,
  loading = false
}) => {
  return (
    <div className="sticky top-20 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Heart Surgery Applications
            </h1>
            {applications && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {applications.numberOfElements} applications out of {applications.totalElements} total
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={onCreateNew}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
            >
              <span>New Application</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
