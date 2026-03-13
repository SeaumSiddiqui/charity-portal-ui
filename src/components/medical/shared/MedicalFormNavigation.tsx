import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';

interface TabData {
  id: string;
  label: string;
}

interface MedicalFormNavigationProps {
  tabs: TabData[];
  currentTabIndex: number;
  onPreviousTab: () => void;
  onNextTab: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const MedicalFormNavigation: React.FC<MedicalFormNavigationProps> = ({
  tabs,
  currentTabIndex,
  onPreviousTab,
  onNextTab,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPreviousTab}
          disabled={!canGoPrevious}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentTabIndex + 1} of {tabs.length}
          </span>
          <div className="flex gap-1">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < currentTabIndex
                    ? 'bg-green-500'
                    : index === currentTabIndex
                    ? 'bg-teal-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onNextTab}
          disabled={!canGoNext}
          className="w-full sm:w-auto"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
