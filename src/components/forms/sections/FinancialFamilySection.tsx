import React from 'react';
import { FormikProps } from 'formik';
import { DollarSign } from 'lucide-react';
import { Gender, OrphanApplication } from '../../../types';
import { FormCard } from '../shared';

interface FinancialFamilySectionProps {
  formik: FormikProps<OrphanApplication>;
}

export const FinancialFamilySection: React.FC<FinancialFamilySectionProps> = ({ formik }) => {
  const handleSiblingsChange = (count: number) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', count);

    const currentMembers = formik.values.familyMembers || [];
    let updatedMembers = [...currentMembers];

    if (count > currentMembers.length) {
      for (let i = currentMembers.length; i < count; i++) {
        updatedMembers.push({
          name: '',
          age: 0,
          siblingsGrade: 0,
          occupation: '',
          siblingsGender: Gender.MALE,
          maritalStatus: 'UNMARRIED' as any,
        });
      }
    } else if (count < currentMembers.length) {
      updatedMembers = updatedMembers.slice(0, count);
    }

    formik.setFieldValue('familyMembers', updatedMembers);
  };

  return (
    <FormCard
      icon={DollarSign}
      title="অর্থনৈতিক ও পারিবারিক তথ্য"
      subtitle="পরিবারের আর্থিক অবস্থা ও সদস্যদের তথ্য প্রদান করুন"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            বার্ষিক আয়
          </label>
          <input
            type="text"
            name="primaryInformation.annualIncome"
            value={formik.values.primaryInformation?.annualIncome || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter annual income"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ভাইবোনের সংখ্যা
          </label>
          <input
            type="number"
            value={formik.values.primaryInformation?.numOfSiblings || 0}
            onChange={(e) => handleSiblingsChange(parseInt(e.target.value) || 0)}
            min={0}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="Enter number of siblings"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This will automatically add/remove rows in the Family Members section
          </p>
        </div>

        <div className="space-y-2 md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            স্থাবর সম্পত্তি
          </label>
          <textarea
            name="primaryInformation.fixedAssets"
            value={formik.values.primaryInformation?.fixedAssets || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none"
            placeholder="Describe fixed assets"
          />
        </div>
      </div>
    </FormCard>
  );
};
