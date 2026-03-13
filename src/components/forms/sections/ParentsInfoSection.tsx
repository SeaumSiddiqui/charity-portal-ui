import React from 'react';
import { FormikProps } from 'formik';
import { Heart } from 'lucide-react';
import { MothersStatus, OrphanApplication } from '../../../types';
import { FormCard, getFieldError } from '../shared';

interface ParentsInfoSectionProps {
  formik: FormikProps<OrphanApplication>;
}

const MOTHERS_OCCUPATIONS = [
  { value: 'গৃহিণী', label: 'গৃহিণী' },
  { value: 'শ্রমিক', label: 'শ্রমিক' },
  { value: 'গৃহপরিচারিকা', label: 'গৃহপরিচারিকা' },
  { value: 'চাকরিজীবী', label: 'চাকরিজীবী' },
  { value: 'ব্যাবসায়ী', label: 'ব্যাবসায়ী' },
  { value: 'অন্যান্য', label: 'অন্যান্য' },
];

export const ParentsInfoSection: React.FC<ParentsInfoSectionProps> = ({ formik }) => {
  return (
    <FormCard
      icon={Heart}
      title="পিতা-মাতার তথ্য"
      subtitle="পিতা-মাতার জাতীয়তা পরিচয়পত্র সদৃশ তথ্য প্রদান করুন"
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            পিতার তথ্যাবলি
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                পিতার নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primaryInformation.fathersName"
                value={formik.values.primaryInformation?.fathersName || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter father's name"
              />
              {getFieldError(formik, 'primaryInformation.fathersName') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.fathersName')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                মৃত্যু তারিখ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="primaryInformation.dateOfDeath"
                value={formik.values.primaryInformation?.dateOfDeath || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                মৃত্যুর কারণ
              </label>
              <input
                type="text"
                name="primaryInformation.causeOfDeath"
                value={formik.values.primaryInformation?.causeOfDeath || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Describe the cause of death"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            মাতার তথ্যাবলি
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                মাতার নাম
              </label>
              <input
                type="text"
                name="primaryInformation.mothersName"
                value={formik.values.primaryInformation?.mothersName || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter mother's name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                মাতার পেশা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="primaryInformation.mothersOccupation"
                  value={formik.values.primaryInformation?.mothersOccupation || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">নির্বাচন করুন</option>
                  {MOTHERS_OCCUPATIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {getFieldError(formik, 'primaryInformation.mothersOccupation') && (
                <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.mothersOccupation')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                মাতার অবস্থা
              </label>
              <div className="relative">
                <select
                  name="primaryInformation.mothersStatus"
                  value={formik.values.primaryInformation?.mothersStatus || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value={MothersStatus.WIDOWED}>বিধবা</option>
                  <option value={MothersStatus.REMARRIED}>পুনর্বিবাহিত</option>
                  <option value={MothersStatus.DEAD}>মৃত</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormCard>
  );
};
