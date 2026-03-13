import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { TabData } from '../../../types';

interface FormNavigationProps {
  tabs: TabData[];
  currentTabIndex: number;
  onPreviousTab: () => void;
  onNextTab: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  tabs,
  currentTabIndex,
  onPreviousTab,
  onNextTab,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPreviousTab}
          disabled={!canGoPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Step {currentTabIndex + 1} of {tabs.length}
          </span>
          <div className="flex items-center gap-1.5">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentTabIndex
                    ? 'bg-primary-500 w-6'
                    : index < currentTabIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                title={tab.label}
              />
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onNextTab}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};