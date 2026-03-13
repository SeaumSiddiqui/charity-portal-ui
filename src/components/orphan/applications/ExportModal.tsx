import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportColumn {
  field: string;
  label: string;
  defaultSelected: boolean;
  category: string;
}

const AVAILABLE_COLUMNS: ExportColumn[] = [
  // Parent Fields
  { field: 'id', label: 'Application ID', defaultSelected: true, category: 'Application' },
  { field: 'status', label: 'Status', defaultSelected: true, category: 'Application' },
  { field: 'rejectionMessage', label: 'Rejection Message', defaultSelected: false, category: 'Application' },
  { field: 'createdBy', label: 'Created By', defaultSelected: false, category: 'Application' },
  { field: 'lastReviewedBy', label: 'Last Reviewed By', defaultSelected: false, category: 'Application' },
  { field: 'createdAt', label: 'Created At', defaultSelected: false, category: 'Application' },
  { field: 'lastModifiedAt', label: 'Last Modified At', defaultSelected: false, category: 'Application' },

  // Primary Information
  { field: 'primaryInformation.fullName', label: 'Full Name', defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.dateOfBirth', label: 'Date of Birth', defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.bcRegistration', label: 'BC Registration', defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.nationality', label: 'Nationality', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.placeOfBirth', label: 'Place of Birth', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.age', label: 'Age', defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.gender', label: 'Gender', defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.religion', label: 'Religion', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.fathersName', label: "Father's Name", defaultSelected: true, category: 'Primary Information' },
  { field: 'primaryInformation.dateOfDeath', label: "Father's Date of Death", defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.causeOfDeath', label: 'Cause of Death', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.mothersName', label: "Mother's Name", defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.mothersOccupation', label: "Mother's Occupation", defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.mothersStatus', label: "Mother's Status", defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.fixedAssets', label: 'Fixed Assets', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.annualIncome', label: 'Annual Income', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.numOfSiblings', label: 'Number of Siblings', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.academicInstitution', label: 'Academic Institution', defaultSelected: false, category: 'Primary Information' },
  { field: 'primaryInformation.grade', label: 'Grade', defaultSelected: false, category: 'Primary Information' },

  // Address
  { field: 'address.isSameAsPermanent', label: 'Address Same As Permanent', defaultSelected: false, category: 'Address' },
  { field: 'address.permanentDistrict', label: 'Permanent District', defaultSelected: true, category: 'Address' },
  { field: 'address.permanentSubDistrict', label: 'Permanent Sub District', defaultSelected: true, category: 'Address' },
  { field: 'address.permanentUnion', label: 'Permanent Union', defaultSelected: false, category: 'Address' },
  { field: 'address.permanentVillage', label: 'Permanent Village', defaultSelected: false, category: 'Address' },
  { field: 'address.permanentArea', label: 'Permanent Area', defaultSelected: false, category: 'Address' },
  { field: 'address.presentDistrict', label: 'Present District', defaultSelected: false, category: 'Address' },
  { field: 'address.presentSubDistrict', label: 'Present Sub District', defaultSelected: false, category: 'Address' },
  { field: 'address.presentUnion', label: 'Present Union', defaultSelected: false, category: 'Address' },
  { field: 'address.presentVillage', label: 'Present Village', defaultSelected: false, category: 'Address' },
  { field: 'address.presentArea', label: 'Present Area', defaultSelected: false, category: 'Address' },

  // Basic Information
  { field: 'basicInformation.physicalCondition', label: 'Physical Condition', defaultSelected: true, category: 'Basic Information' },
  { field: 'basicInformation.hasCriticalIllness', label: 'Has Critical Illness', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.typeOfIllness', label: 'Type of Illness', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.isResident', label: 'Is Resident', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.residenceStatus', label: 'Residence Status', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.houseType', label: 'House Type', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.bedroom', label: 'Bedroom', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.balcony', label: 'Balcony', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.kitchen', label: 'Kitchen', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.store', label: 'Store', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.hasTubeWell', label: 'Has Tube Well', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.toilet', label: 'Toilet', defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.guardiansName', label: "Guardian's Name", defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.guardiansRelation', label: "Guardian's Relation", defaultSelected: false, category: 'Basic Information' },
  { field: 'basicInformation.NID', label: 'NID', defaultSelected: true, category: 'Basic Information' },
  { field: 'basicInformation.cell1', label: 'Cell 1', defaultSelected: true, category: 'Basic Information' },
  { field: 'basicInformation.cell2', label: 'Cell 2', defaultSelected: false, category: 'Basic Information' },
];

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (selectedHeaders: string[]) => void;
  isExporting: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
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
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
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
                      className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
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
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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
