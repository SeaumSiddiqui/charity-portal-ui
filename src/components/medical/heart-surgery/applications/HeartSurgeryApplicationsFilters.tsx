import React from 'react';
import { X } from 'lucide-react';
import { MedicalApplicationFilters, ApplicationStatus, Gender } from '../../../../types';
import { Button } from '../../../ui/Button';

interface HeartSurgeryApplicationsFiltersProps {
  filters: MedicalApplicationFilters;
  onFilterChange: (key: keyof MedicalApplicationFilters, value: any) => void;
  onClearFilters: () => void;
}

const FilterInput: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  type?: string;
}> = ({ label, value, onChange, onClear, placeholder, type = "text" }) => (
  <div className="relative">
    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  </div>
);

const FilterSelect: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onClear: () => void;
  options: { value: string; label: string }[];
  placeholder: string;
}> = ({ label, value, onChange, onClear, options, placeholder }) => (
  <div className="relative">
    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || '')}
        className="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {value && (
        <button
          onClick={onClear}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  </div>
);

export const HeartSurgeryApplicationsFilters: React.FC<HeartSurgeryApplicationsFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const clearField = (field: keyof MedicalApplicationFilters) => {
    onFilterChange(field, undefined);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-slide-down">
      <div className="px-6 py-4">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Filter Applications
          </h3>
        </div>

        <div className="space-y-4">
          {/* Row 1: Patient Information */}
          <div className="grid grid-cols-3 gap-4">
            <FilterInput
              label="Patient Name"
              value={filters.fullName}
              onChange={(value) => onFilterChange('fullName', value)}
              onClear={() => clearField('fullName')}
              placeholder="Search by patient name..."
            />
            <FilterInput
              label="Father's Name"
              value={filters.fathersName}
              onChange={(value) => onFilterChange('fathersName', value)}
              onClear={() => clearField('fathersName')}
              placeholder="Search by father's name..."
            />
            <FilterInput
              label="Mother's Name"
              value={filters.mothersName}
              onChange={(value) => onFilterChange('mothersName', value)}
              onClear={() => clearField('mothersName')}
              placeholder="Search by mother's name..."
            />
          </div>

          {/* Row 2: Status and Demographics */}
          <div className="grid grid-cols-3 gap-4">
            <FilterSelect
              label="Application Status"
              value={filters.status}
              onChange={(value) => onFilterChange('status', value)}
              onClear={() => clearField('status')}
              placeholder="All Statuses"
              options={[
                { value: ApplicationStatus.INCOMPLETE, label: 'Incomplete' },
                { value: ApplicationStatus.COMPLETE, label: 'Complete' },
                { value: ApplicationStatus.PENDING, label: 'Pending' },
                { value: ApplicationStatus.REJECTED, label: 'Rejected' },
                { value: ApplicationStatus.ACCEPTED, label: 'Accepted' },
                { value: ApplicationStatus.GRANTED, label: 'Granted' },
              ]}
            />
            <FilterSelect
              label="Gender"
              value={filters.gender}
              onChange={(value) => onFilterChange('gender', value)}
              onClear={() => clearField('gender')}
              placeholder="All Genders"
              options={[
                { value: Gender.MALE, label: 'Male' },
                { value: Gender.FEMALE, label: 'Female' },
              ]}
            />
            <FilterSelect
              label="Created By"
              value={filters.createdBy}
              onChange={(value) => onFilterChange('createdBy', value)}
              onClear={() => clearField('createdBy')}
              placeholder="All Users"
              options={[]}
            />
          </div>

          {/* Row 3: Permanent Address */}
          <div className="grid grid-cols-3 gap-4">
            <FilterInput
              label="Permanent District"
              value={filters.permanentDistrict}
              onChange={(value) => onFilterChange('permanentDistrict', value)}
              onClear={() => clearField('permanentDistrict')}
              placeholder="Search by district..."
            />
            <FilterInput
              label="Permanent Sub-District"
              value={filters.permanentSubDistrict}
              onChange={(value) => onFilterChange('permanentSubDistrict', value)}
              onClear={() => clearField('permanentSubDistrict')}
              placeholder="Search by sub-district..."
            />
            <FilterInput
              label="Permanent Union"
              value={filters.permanentUnion}
              onChange={(value) => onFilterChange('permanentUnion', value)}
              onClear={() => clearField('permanentUnion')}
              placeholder="Search by union..."
            />
          </div>

          {/* Row 4: Present Address */}
          <div className="grid grid-cols-3 gap-4">
            <FilterInput
              label="Present District"
              value={filters.presentDistrict}
              onChange={(value) => onFilterChange('presentDistrict', value)}
              onClear={() => clearField('presentDistrict')}
              placeholder="Search by district..."
            />
            <FilterInput
              label="Present Sub-District"
              value={filters.presentSubDistrict}
              onChange={(value) => onFilterChange('presentSubDistrict', value)}
              onClear={() => clearField('presentSubDistrict')}
              placeholder="Search by sub-district..."
            />
            <FilterInput
              label="Present Union"
              value={filters.presentUnion}
              onChange={(value) => onFilterChange('presentUnion', value)}
              onClear={() => clearField('presentUnion')}
              placeholder="Search by union..."
            />
          </div>

          {/* Row 5: Date From Fields */}
          <div className="grid grid-cols-3 gap-4">
            <FilterInput
              label="DOB From"
              value={filters.dobStart}
              onChange={(value) => onFilterChange('dobStart', value)}
              onClear={() => clearField('dobStart')}
              placeholder=""
              type="date"
            />
            <FilterInput
              label="Created Date From"
              value={filters.createdStartDate}
              onChange={(value) => onFilterChange('createdStartDate', value)}
              onClear={() => clearField('createdStartDate')}
              placeholder=""
              type="datetime-local"
            />
            <FilterInput
              label="Last Modified Date From"
              value={filters.lastModifiedStartDate}
              onChange={(value) => onFilterChange('lastModifiedStartDate', value)}
              onClear={() => clearField('lastModifiedStartDate')}
              placeholder=""
              type="datetime-local"
            />
          </div>

          {/* Row 6: Date To Fields */}
          <div className="grid grid-cols-3 gap-4">
            <FilterInput
              label="DOB To"
              value={filters.dobEnd}
              onChange={(value) => onFilterChange('dobEnd', value)}
              onClear={() => clearField('dobEnd')}
              placeholder=""
              type="date"
            />
            <FilterInput
              label="Created Date To"
              value={filters.createdEndDate}
              onChange={(value) => onFilterChange('createdEndDate', value)}
              onClear={() => clearField('createdEndDate')}
              placeholder=""
              type="datetime-local"
            />
            <FilterInput
              label="Last Modified Date To"
              value={filters.lastModifiedEndDate}
              onChange={(value) => onFilterChange('lastModifiedEndDate', value)}
              onClear={() => clearField('lastModifiedEndDate')}
              placeholder=""
              type="datetime-local"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="px-4"
            >
              Clear All Filters
            </Button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Filters are applied automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
