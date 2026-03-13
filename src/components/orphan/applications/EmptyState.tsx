import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { OrphanApplicationFilters } from '../../../types';

interface EmptyStateProps {
  filters: OrphanApplicationFilters;
  onCreateNew: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filters, onCreateNew }) => {
  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof OrphanApplicationFilters] && 
    key !== 'page' && key !== 'size' && key !== 'sortField' && key !== 'sortDirection'
  );

  return (
    <Card>
      <CardContent className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Applications Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasActiveFilters
            ? 'No applications match your current filters.'
            : 'No orphan applications have been created yet.'
          }
        </p>
        <Button variant="primary" onClick={onCreateNew}>
          Create First Application
        </Button>
      </CardContent>
    </Card>
  );
};