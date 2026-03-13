import React from 'react';
import { FormikProps } from 'formik';
import { GraduationCap } from 'lucide-react';
import { OrphanApplication } from '../../../types';
import { FormCard, getFieldError } from '../shared';

interface EducationSectionProps {
  formik: FormikProps<OrphanApplication>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ formik }) => {
  return (
    <FormCard
      icon={GraduationCap}
      title="শিক্ষাগত তথ্য"
      subtitle="এতিমের বর্তমান শিক্ষাগত তথ্য প্রদান করুন"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            শিক্ষা প্রতিষ্ঠান
          </label>
          <input
            type="text"
            name="primaryInformation.academicInstitution"
            value={formik.values.primaryInformation?.academicInstitution || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter school/institution name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            শ্রেণী <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="primaryInformation.grade"
            value={formik.values.primaryInformation?.grade ?? ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min={0}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter current grade/class"
          />
          {getFieldError(formik, 'primaryInformation.grade') && (
            <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'primaryInformation.grade')}</p>
          )}
        </div>
      </div>
    </FormCard>
  );
};
