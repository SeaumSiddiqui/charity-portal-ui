import React from 'react';
import { FormikProps } from 'formik';
import { Home } from 'lucide-react';
import { MedicalApplication, HouseType, ResidenceStatus } from '../../../types';
import { FormSelect } from '../../ui/FormSelect';
import { FormCard } from '../../forms/shared/FormCard';

interface HouseholdInformationFormProps {
  formik: FormikProps<MedicalApplication>;
}

const FACILITIES = [
  { key: 'hasTubeWell', label: 'Has Tube Well' },
  { key: 'hasLatrine', label: 'Has Latrine' },
] as const;

export const HouseholdInformationForm: React.FC<HouseholdInformationFormProps> = ({ formik }) => {
  const houseStatusOptions = Object.values(ResidenceStatus).map(status => ({
    value: status,
    label: status.replace(/_/g, ' '),
  }));

  const houseTypeOptions = Object.values(HouseType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' '),
  }));

  const toggleFacility = (key: string) => {
    const currentValue = formik.values.householdInformation?.[key as keyof typeof formik.values.householdInformation];
    formik.setFieldValue(`householdInformation.${key}`, !currentValue);
  };

  const isFacilityActive = (key: string): boolean => {
    return !!formik.values.householdInformation?.[key as keyof typeof formik.values.householdInformation];
  };

  return (
    <FormCard icon={Home} title="Household Information" colorVariant="teal">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="House Status"
            name="householdInformation.houseStatus"
            options={houseStatusOptions}
          />

          <FormSelect
            label="House Type"
            name="householdInformation.houseType"
            options={houseTypeOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Rooms
            </label>
            <input
              type="number"
              name="householdInformation.numOfRooms"
              value={formik.values.householdInformation?.numOfRooms || 0}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="0"
              min="0"
            />
          </div>

          {FACILITIES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleFacility(key)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all self-end h-[42px] ${
                isFacilityActive(key)
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {label}
              {isFacilityActive(key) && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              House Size (sq ft)
            </label>
            <input
              type="text"
              name="householdInformation.houseSize"
              value={formik.values.householdInformation?.houseSize || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter house size"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Plot Size (decimal)
            </label>
            <input
              type="text"
              name="householdInformation.plotSize"
              value={formik.values.householdInformation?.plotSize || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter plot size"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Land Size (decimal)
            </label>
            <input
              type="text"
              name="householdInformation.landSize"
              value={formik.values.householdInformation?.landSize || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter land size"
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
};
