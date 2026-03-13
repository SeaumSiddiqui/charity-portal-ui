import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PageResponse } from '../../../types';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';

interface ApplicationsPaginationProps {
  pageData: PageResponse<any>;
  onPageChange: (page: number) => void;
}

export const ApplicationsPagination: React.FC<ApplicationsPaginationProps> = ({
  pageData,
  onPageChange
}) => {
  const [jumpToPage, setJumpToPage] = useState('');

  if (pageData.totalPages <= 1) {
    return null;
  }

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage) - 1; // Convert to 0-based
    if (page >= 0 && page < pageData.totalPages) {
      onPageChange(page);
      setJumpToPage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Results Info */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {pageData.number * pageData.size + 1} to{' '}
            {Math.min((pageData.number + 1) * pageData.size, pageData.totalElements)} of{' '}
            {pageData.totalElements} results
          </div>

          {/* Center: Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {/* First Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={pageData.first}
              className="flex items-center space-x-1"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="hidden sm:inline">First</span>
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageData.number - 1)}
              disabled={pageData.first}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pageData.totalPages) }, (_, i) => {
                const pageNum = Math.max(0, Math.min(
                  pageData.totalPages - 5,
                  pageData.number - 2
                )) + i;
                
                if (pageNum >= pageData.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      pageNum === pageData.number
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageData.number + 1)}
              disabled={pageData.last}
              className="flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageData.totalPages - 1)}
              disabled={pageData.last}
              className="flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Last</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Jump to Page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Jump to:
            </span>
            <input
              type="number"
              min={1}
              max={pageData.totalPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Page"
              className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleJumpToPage}
              disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > pageData.totalPages}
            >
              Go
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};