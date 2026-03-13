import React from 'react';
import { FormikProps } from 'formik';
import { Building2 } from 'lucide-react';
import { OrphanApplication } from '../../../types';
import { FormCard } from '../shared';

interface HouseholdSectionProps {
  formik: FormikProps<OrphanApplication>;
}

const FACILITIES = [
  { key: 'balcony', label: 'বারান্দা' },
  { key: 'kitchen', label: 'রান্নাঘর' },
  { key: 'store', label: 'স্টোর রুম' },
  { key: 'hasTubeWell', label: 'টিউবয়েল' },
  { key: 'toilet', label: 'শৌচাগার' },
] as const;

export const HouseholdSection: React.FC<HouseholdSectionProps> = ({ formik }) => {
  const toggleFacility = (key: string) => {
    const currentValue = formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation];
    formik.setFieldValue(`basicInformation.${key}`, !currentValue);
  };

  const isFacilityActive = (key: string): boolean => {
    return !!formik.values.basicInformation?.[key as keyof typeof formik.values.basicInformation];
  };

  return (
    <FormCard
      icon={Building2}
      title="বাড়ির বিবরণ"
      subtitle="ঘর ও সুবিধাসমূহের তথ্য"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ঘরের সংখ্যা
          </label>
          <input
            type="number"
            name="basicInformation.bedroom"
            value={formik.values.basicInformation?.bedroom || 0}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                বাড়ির সুবিধাসমূহ
              </label>
            </div>
            {FACILITIES.slice(0, 2).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFacility(key)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isFacilityActive(key)
                    ? 'bg-primary-600 text-white shadow-sm'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FACILITIES.slice(2).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleFacility(key)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isFacilityActive(key)
                    ? 'bg-primary-600 text-white shadow-sm'
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
        </div>
      </div>
    </FormCard>
  );
};
