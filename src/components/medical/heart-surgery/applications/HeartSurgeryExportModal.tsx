import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportColumn {
  field: string;
  label: string;
  defaultSelected: boolean;
  category: string;
}

const AVAILABLE_COLUMNS: ExportColumn[] = [
  // Application Fields
  { field: 'id', label: 'Application ID', defaultSelected: true, category: 'Application' },
  { field: 'status', label: 'Status', defaultSelected: true, category: 'Application' },
  { field: 'surgeryType', label: 'Surgery Type', defaultSelected: false, category: 'Application' },
  { field: 'createdBy', label: 'Created By', defaultSelected: false, category: 'Application' },
  { field: 'lastReviewedBy', label: 'Last Reviewed By', defaultSelected: false, category: 'Application' },
  { field: 'createdAt', label: 'Created At', defaultSelected: true, category: 'Application' },
  { field: 'lastModifiedAt', label: 'Last Modified At', defaultSelected: true, category: 'Application' },

  // Patient Information
  { field: 'patientInformation.code', label: 'Patient Code', defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.fullName', label: 'Full Name', defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.dateOfBirth', label: 'Date of Birth', defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.fathersName', label: "Father's Name", defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.mothersName', label: "Mother's Name", defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.annualIncome', label: 'Annual Income', defaultSelected: true, category: 'Patient Information' },
  { field: 'patientInformation.gender', label: 'Gender', defaultSelected: true, category: 'Patient Information' },

  // Patient Address - Permanent
  { field: 'patientAddress.permanentDistrict', label: 'Permanent District', defaultSelected: true, category: 'Patient Address' },
  { field: 'patientAddress.permanentSubDistrict', label: 'Permanent Sub District', defaultSelected: true, category: 'Patient Address' },
  { field: 'patientAddress.permanentUnion', label: 'Permanent Union', defaultSelected: true, category: 'Patient Address' },
  { field: 'patientAddress.permanentVillage', label: 'Permanent Village', defaultSelected: true, category: 'Patient Address' },
  { field: 'patientAddress.permanentArea', label: 'Permanent Area', defaultSelected: false, category: 'Patient Address' },

  // Patient Address - Present
  { field: 'patientAddress.presentDistrict', label: 'Present District', defaultSelected: false, category: 'Patient Address' },
  { field: 'patientAddress.presentSubDistrict', label: 'Present Sub District', defaultSelected: false, category: 'Patient Address' },
  { field: 'patientAddress.presentUnion', label: 'Present Union', defaultSelected: false, category: 'Patient Address' },
  { field: 'patientAddress.presentVillage', label: 'Present Village', defaultSelected: false, category: 'Patient Address' },
  { field: 'patientAddress.presentArea', label: 'Present Area', defaultSelected: false, category: 'Patient Address' },

  // Household Information
  { field: 'householdInformation.houseStatus', label: 'House Status', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.houseType', label: 'House Type', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.numOfRooms', label: 'Number of Rooms', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.houseSize', label: 'House Size', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.plotSize', label: 'Plot Size', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.landSize', label: 'Land Size', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.hasTubeWell', label: 'Has Tube Well', defaultSelected: false, category: 'Household Information' },
  { field: 'householdInformation.hasLatrine', label: 'Has Latrine', defaultSelected: false, category: 'Household Information' },

  // Contact Information
  { field: 'contactInformation.relativeContacts', label: 'Relative Contacts', defaultSelected: true, category: 'Contact Information' },
  { field: 'contactInformation.email', label: 'Email', defaultSelected: false, category: 'Contact Information' },
  { field: 'contactInformation.additionalComment', label: 'Additional Comment', defaultSelected: false, category: 'Contact Information' },
];

interface HeartSurgeryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (selectedHeaders: string[]) => void;
  isExporting: boolean;
}

export const HeartSurgeryExportModal: React.FC<HeartSurgeryExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting,
}) => {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(AVAILABLE_COLUMNS.filter(col => col.defaultSelected).map(col => col.field))
  );

  if (!isOpen) return null;

  const toggleColumn = (field: string) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const toggleCategory = (category: string) => {
    const categoryColumns = AVAILABLE_COLUMNS.filter(col => col.category === category);
    const allSelected = categoryColumns.every(col => selectedColumns.has(col.field));

    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      categoryColumns.forEach(col => {
        if (allSelected) {
          newSet.delete(col.field);
        } else {
          newSet.add(col.field);
        }
      });
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedColumns.size === AVAILABLE_COLUMNS.length) {
      setSelectedColumns(new Set());
    } else {
      setSelectedColumns(new Set(AVAILABLE_COLUMNS.map(col => col.field)));
    }
  };

  const handleExport = () => {
    onExport(Array.from(selectedColumns));
  };

  const categories = Array.from(new Set(AVAILABLE_COLUMNS.map(col => col.category)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export to Excel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isExporting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the columns you want to include in the Excel export. The export will include all filtered results.
          </p>

          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={toggleAll}
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
              disabled={isExporting}
            >
              {selectedColumns.size === AVAILABLE_COLUMNS.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedColumns.size} of {AVAILABLE_COLUMNS.length} columns selected
            </span>
          </div>

          <div className="space-y-6">
            {categories.map(category => {
              const categoryColumns = AVAILABLE_COLUMNS.filter(col => col.category === category);
              const selectedInCategory = categoryColumns.filter(col => selectedColumns.has(col.field)).length;

              return (
                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-sm font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                      disabled={isExporting}
                    >
                      {category}
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedInCategory}/{categoryColumns.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoryColumns.map(column => (
                      <label
                        key={column.field}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.has(column.field)}
                          onChange={() => toggleColumn(column.field)}
                          disabled={isExporting}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {column.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export ({selectedColumns.size} columns)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
