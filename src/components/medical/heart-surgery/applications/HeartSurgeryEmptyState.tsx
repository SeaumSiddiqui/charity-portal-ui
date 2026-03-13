import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { MedicalApplicationFilters } from '../../../../types';

interface HeartSurgeryEmptyStateProps {
  filters: MedicalApplicationFilters;
  onCreateNew: () => void;
}

export const HeartSurgeryEmptyState: React.FC<HeartSurgeryEmptyStateProps> = ({
  filters,
  onCreateNew
}) => {
  const hasActiveFilters = filters.status || filters.fullName || filters.fathersName || filters.gender;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full mb-4">
          <Heart className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {hasActiveFilters ? 'No Applications Match Your Filters' : 'No Applications Yet'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasActiveFilters
            ? 'Try adjusting your search criteria or clearing filters to see more results.'
            : 'Get started by creating your first heart surgery application.'}
        </p>

        {!hasActiveFilters && (
          <Button
            variant="primary"
            onClick={onCreateNew}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Application
          </Button>
        )}
      </div>
    </div>
  );
};
