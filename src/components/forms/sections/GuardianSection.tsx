import React, { useEffect } from 'react';
import { FormikProps } from 'formik';
import { User, Phone } from 'lucide-react';
import { OrphanApplication } from '../../../types';
import { FormCard, getFieldError } from '../shared';
import { formatPhoneNumber, normalizePhoneInput, PHONE_PREFIX, formatNID } from '../../../utils/formatting';

interface GuardianSectionProps {
  formik: FormikProps<OrphanApplication>;
}

const GUARDIAN_RELATIONS = [
  { value: 'মা', label: 'মা' },
  { value: 'ভাই/বোন', label: 'ভাই/বোন' },
  { value: 'দাদা/দাদী', label: 'দাদা/দাদী' },
  { value: 'নানা/নানী', label: 'নানা/নানী' },
  { value: 'চাচা/চাচী', label: 'চাচা/চাচী' },
  { value: 'ফুফা/ফুফু', label: 'ফুফা/ফুফু' },
  { value: 'খালা/খালু', label: 'খালা/খালু' },
  { value: 'মামা/মামী', label: 'মামা/মামী' },
  { value: 'প্রতিবেশী', label: 'প্রতিবেশী' },
];

export const GuardianSection: React.FC<GuardianSectionProps> = ({ formik }) => {
  useEffect(() => {
    if (!formik.values.basicInformation?.cell1) {
      formik.setFieldValue('basicInformation.cell1', PHONE_PREFIX);
    }
    if (!formik.values.basicInformation?.cell2) {
      formik.setFieldValue('basicInformation.cell2', PHONE_PREFIX);
    }
  }, []);

  const handlePhoneChange = (value: string, fieldName: string) => {
    const normalized = normalizePhoneInput(value);
    const formatted = formatPhoneNumber(normalized);
    formik.setFieldValue(fieldName, formatted);
  };

  const handleNIDChange = (value: string) => {
    const formatted = formatNID(value);
    formik.setFieldValue('basicInformation.NID', formatted);
    formik.setFieldValue('basicInformation.nid', formatted);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if ((e.key === 'Backspace' || e.key === 'Delete') &&
        input.selectionStart !== null &&
        input.selectionStart <= 4) {
      e.preventDefault();
    }
  };

  return (
    <FormCard
      icon={User}
      title="অভিভাবকের তথ্য"
      subtitle="গার্ডিয়ানের পরিচয় ও যোগাযোগ"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            অভিভাবকের নাম
          </label>
          <input
            type="text"
            name="basicInformation.guardiansName"
            value={formik.values.basicInformation?.guardiansName || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
            placeholder="পূর্ণ নাম লিখুন"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            সম্পর্ক
          </label>
          <select
            name="basicInformation.guardiansRelation"
            value={formik.values.basicInformation?.guardiansRelation || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
          >
            <option value="">নির্বাচন করুন</option>
            {GUARDIAN_RELATIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            জাতীয় পরিচয়পত্র (NID)
          </label>
          <input
            type="text"
            name="basicInformation.NID"
            value={formik.values.basicInformation?.NID || (formik.values.basicInformation as any)?.nid || ''}
            onChange={(e) => handleNIDChange(e.target.value)}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-lg text-sm focus:ring-2 transition-colors ${
              getFieldError(formik, 'basicInformation.NID')
                ? 'border-red-300 dark:border-red-700 focus:ring-red-200 dark:focus:ring-red-900/50 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500'
            }`}
            placeholder="xxx-xxx-xxxx or xxxx-xx-x-xx-xx-xxxxxx"
          />
          {getFieldError(formik, 'basicInformation.NID') && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {getFieldError(formik, 'basicInformation.NID')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            যোগাযোগের নম্বর (primary)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              name="basicInformation.cell1"
              value={formik.values.basicInformation?.cell1 || PHONE_PREFIX}
              onChange={(e) => handlePhoneChange(e.target.value, 'basicInformation.cell1')}
              onBlur={formik.handleBlur}
              onKeyDown={handlePhoneKeyDown}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              placeholder="+88017-0602-0534"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            যোগাযোগের নম্বর (optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              name="basicInformation.cell2"
              value={formik.values.basicInformation?.cell2 || PHONE_PREFIX}
              onChange={(e) => handlePhoneChange(e.target.value, 'basicInformation.cell2')}
              onBlur={formik.handleBlur}
              onKeyDown={handlePhoneKeyDown}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
              placeholder="+88017-0602-0534"
            />
          </div>
        </div>
      </div>
    </FormCard>
  );
};
