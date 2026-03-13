import React from 'react';
import { FormikProps } from 'formik';
import { Heart } from 'lucide-react';
import { PhysicalCondition, OrphanApplication } from '../../../types';
import { FormCard, getFieldError } from '../shared';

interface PhysicalHealthSectionProps {
  formik: FormikProps<OrphanApplication>;
}

export const PhysicalHealthSection: React.FC<PhysicalHealthSectionProps> = ({ formik }) => {
  const hasCriticalIllness = formik.values.basicInformation?.hasCriticalIllness;

  return (
    <FormCard
      icon={Heart}
      title="শারীরিক তথ্যাবলী"
      subtitle="স্বাস্থ্য ও শারীরিক অবস্থার বিবরণ"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            শারীরিক অবস্থা <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="basicInformation.physicalCondition"
              value={formik.values.basicInformation?.physicalCondition || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-lg text-sm appearance-none cursor-pointer transition-colors ${
                getFieldError(formik, 'basicInformation.physicalCondition')
                  ? 'border-red-300 dark:border-red-700 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500'
              }`}
            >
              <option value="">নির্বাচন করুন</option>
              <option value={PhysicalCondition.HEALTHY}>সুস্থ</option>
              <option value={PhysicalCondition.SICK}>অসুস্থ</option>
              <option value={PhysicalCondition.DISABLED}>প্রতিবন্ধী</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {getFieldError(formik, 'basicInformation.physicalCondition') && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {getFieldError(formik, 'basicInformation.physicalCondition')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            গুরুতর অসুস্থতা আছে?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => formik.setFieldValue('basicInformation.hasCriticalIllness', true)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                hasCriticalIllness === true
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              হ্যাঁ
            </button>
            <button
              type="button"
              onClick={() => formik.setFieldValue('basicInformation.hasCriticalIllness', false)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                hasCriticalIllness === false
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              না
            </button>
          </div>
        </div>
      </div>

      {hasCriticalIllness && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            অসুস্থতার বিস্তারিত বর্ণনা
          </label>
          <textarea
            name="basicInformation.typeOfIllness"
            value={formik.values.basicInformation?.typeOfIllness || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none"
            placeholder="অসুস্থতার ধরন, কতদিন ধরে, চিকিৎসা চলছে কিনা ইত্যাদি বিস্তারিত লিখুন..."
          />
        </div>
      )}
    </FormCard>
  );
};
