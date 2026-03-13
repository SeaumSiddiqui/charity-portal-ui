import React from 'react';
import { FormikProps } from 'formik';
import { Home } from 'lucide-react';
import { ResidenceStatus, HouseType, OrphanApplication } from '../../../types';
import { FormCard } from '../shared';

interface ResidenceSectionProps {
  formik: FormikProps<OrphanApplication>;
}

export const ResidenceSection: React.FC<ResidenceSectionProps> = ({ formik }) => {
  const isResident = formik.values.basicInformation?.isResident === true ||
    (formik.values.basicInformation as any)?.resident === true;

  const handleResidentChange = (value: boolean) => {
    formik.setFieldValue('basicInformation.isResident', value);
    formik.setFieldValue('basicInformation.resident', value);
    if (value) {
      formik.setFieldValue('basicInformation.isIsResident', true);
    }
  };

  return (
    <FormCard
      icon={Home}
      title="আবাসিক তথ্য"
      subtitle="বাসস্থান ও বসবাসের অবস্থা"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            আবাসিক?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleResidentChange(true)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isResident
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              হ্যাঁ
            </button>
            <button
              type="button"
              onClick={() => handleResidentChange(false)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                formik.values.basicInformation?.isResident === false ||
                (formik.values.basicInformation as any)?.resident === false
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              না
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            আবাসিক অবস্থান
          </label>
          <div className="relative">
            <select
              name="basicInformation.residenceStatus"
              value={formik.values.basicInformation?.residenceStatus || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
            >
              <option value="">নির্বাচন করুন</option>
              <option value={ResidenceStatus.OWN}>নিজ</option>
              <option value={ResidenceStatus.RENTED}>ভাড়া</option>
              <option value={ResidenceStatus.SHELTERED}>আশ্রয়প্রাপ্ত</option>
              <option value={ResidenceStatus.HOMELESS}>গৃহহীন</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            বাড়ির ধরন
          </label>
          <div className="relative">
            <select
              name="basicInformation.houseType"
              value={formik.values.basicInformation?.houseType || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
            >
              <option value="">নির্বাচন করুন</option>
              <option value={HouseType.CONCRETE_HOUSE}>পাকা বাড়ি</option>
              <option value={HouseType.SEMI_CONCRETE_HOUSE}>আধপাকা বাড়ি</option>
              <option value={HouseType.MUD_HOUSE}>কাঁচা বাড়ি</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
};
