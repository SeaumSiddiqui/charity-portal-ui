import React from 'react';
import { Filter, Download } from 'lucide-react';
import { Button } from '../../ui/Button';
import { PageResponse, OrphanApplicationSummaryDTO } from '../../../types';

interface ApplicationsHeaderProps {
  applications: PageResponse<OrphanApplicationSummaryDTO> | null;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreateNew: () => void;
  onExport?: () => void;
}

export const ApplicationsHeader: React.FC<ApplicationsHeaderProps> = ({
  applications,
  showFilters,
  onToggleFilters,
  onCreateNew,
  onExport
}) => {
  return (
    <div className="sticky top-20 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Orphan Applications
            </h1>
            {applications && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {applications.numberOfElements} applications out of {applications.totalElements} total
              </span>
            )}
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
              className="flex items-center space-x-2"
            >
              <span>New Application</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};