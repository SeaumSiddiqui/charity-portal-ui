import React, { useEffect } from 'react';
import { FormikProps } from 'formik';
import { User } from 'lucide-react';
import { Gender, OrphanApplication, UserProfile } from '../../../types';
import { FormCard, getFieldError } from '../shared';
import { calculateAge } from '../../../utils/formatting';

interface PersonalDetailsSectionProps {
  formik: FormikProps<OrphanApplication>;
  userProfile?: UserProfile | null;
  isEditing?: boolean;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  formik,
  userProfile,
  isEditing = false,
}) => {
  useEffect(() => {
    const dateOfBirth = formik.values.primaryInformation?.dateOfBirth;
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth);
      if (calculatedAge !== formik.values.primaryInformation?.age) {
        formik.setFieldValue('primaryInformation.age', calculatedAge);
      }
    }
  }, [formik.values.primaryInformation?.dateOfBirth]);

  return (
    <FormCard
      icon={User}
      title="প্রাথমিক তথ্য"
      subtitle="এতিমের জন্মনিবন্ধন সদৃশ তথ্য প্রদান করুন"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            সম্পূর্ণ নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="primaryInformation.fullName"
            value={formik.values.primaryInformation?.fullName || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter full name"
          />
          {getFieldError(formik, 'primaryInformation.fullName') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.fullName')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            জন্মতারিখ <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="primaryInformation.dateOfBirth"
            value={formik.values.primaryInformation?.dateOfBirth || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
          />
          {getFieldError(formik, 'primaryInformation.dateOfBirth') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.dateOfBirth')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            জন্মনিবন্ধন নম্বর <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="primaryInformation.bcRegistration"
            value={formik.values.primaryInformation?.bcRegistration || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            readOnly={isEditing || !!userProfile}
            className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
              (isEditing || userProfile) ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
            }`}
            placeholder="Enter BC registration number"
          />
          {(isEditing || userProfile) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">BC Registration cannot be modified after creation.</p>
          )}
          {getFieldError(formik, 'primaryInformation.bcRegistration') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.bcRegistration')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            বয়স <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="primaryInformation.age"
            value={formik.values.primaryInformation?.age ?? ''}
            readOnly
            min={0}
            max={18}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm cursor-not-allowed text-gray-600 dark:text-gray-400"
            placeholder="Auto-calculated from date of birth"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Age is automatically calculated from date of birth</p>
          {getFieldError(formik, 'primaryInformation.age') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.age')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            লিঙ্গ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="primaryInformation.gender"
              value={formik.values.primaryInformation?.gender || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
            >
              <option value="">নির্বাচন করুন</option>
              <option value={Gender.MALE}>ছেলে</option>
              <option value={Gender.FEMALE}>মেয়ে</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {getFieldError(formik, 'primaryInformation.gender') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.gender')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            জন্মস্থান
          </label>
          <input
            type="text"
            name="primaryInformation.placeOfBirth"
            value={formik.values.primaryInformation?.placeOfBirth || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter place of birth"
          />
        </div>
      </div>
    </FormCard>
  );
};
