import React from 'react';
import { AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { TabData } from '../../../types';
import { Button } from '../../ui/Button';

interface FormTabsProps {
  tabs: TabData[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onPreview?: () => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onPreview
}) => {
  return (
    <div className="sticky top-20 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Application Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-secondary-500 dark:border-secondary-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.hasErrors && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {tab.isValid && !tab.hasErrors && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </button>
            ))}
          </nav>

          {onPreview && (
            <Button
              variant="primary"
              size="sm"
              onClick={onPreview}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Form</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
