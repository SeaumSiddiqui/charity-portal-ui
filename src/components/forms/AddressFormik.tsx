import React from 'react';
import { FormikProps } from 'formik';
import { MapPin, Copy } from 'lucide-react';
import { OrphanApplication } from '../../types';
import { Button } from '../ui/Button';
import { LocationSelector } from './LocationSelector';

interface AddressFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const AddressFormik: React.FC<AddressFormikProps> = ({ formik }) => {
  const copyPermanentToPresent = () => {
    const permanentAddress = formik.values.address;
    if (permanentAddress) {
      formik.setFieldValue('address.isSameAsPermanent', true);
      formik.setFieldValue('address.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('address.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('address.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('address.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('address.presentArea', permanentAddress.permanentArea);
    }
  };

  React.useEffect(() => {
    if (formik.values.address?.isSameAsPermanent) {
      const permanentAddress = formik.values.address;
      formik.setFieldValue('address.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('address.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('address.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('address.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('address.presentArea', permanentAddress.permanentArea);
    }
  }, [
    formik.values.address?.permanentDistrict,
    formik.values.address?.permanentSubDistrict,
    formik.values.address?.permanentUnion,
    formik.values.address?.permanentVillage,
    formik.values.address?.permanentArea,
    formik.values.address?.isSameAsPermanent
  ]);

  const isSameAsPermanent = formik.values.address?.isSameAsPermanent || false;

  const getFieldError = (fieldName: string) => {
    const keys = fieldName.split('.');
    let error: any = formik.errors;
    let touched: any = formik.touched;

    for (const key of keys) {
      error = error?.[key];
      touched = touched?.[key];
    }

    return touched && error ? error : null;
  };

  return (
    <div className="space-y-6">
      {/* Permanent Address */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">স্থায়ী ঠিকানা</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">স্থায়ী ঠিকানার বিস্তারিত বিবরণ</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationSelector
              formik={formik}
              fieldPrefix="permanent"
              required={true}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                গ্রাম
              </label>
              <input
                type="text"
                name="address.permanentVillage"
                value={formik.values.address?.permanentVillage || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                placeholder="Enter village"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                বিস্তারিত/এলাকা
              </label>
              <textarea
                name="address.permanentArea"
                value={formik.values.address?.permanentArea || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none"
                placeholder="Enter detailed area information"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Present Address */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">বর্তমান ঠিকানা</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">বর্তমান ঠিকানার বিস্তারিত বিবরণ</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-start gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSameAsPermanent}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  formik.setFieldValue('address.isSameAsPermanent', isChecked);
                  if (isChecked) {
                    copyPermanentToPresent();
                  }
                }}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Same as permanent address
              </span>
            </label>

            {!isSameAsPermanent && (
              <Button
                type="button"
                onClick={copyPermanentToPresent}
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy from permanent
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationSelector
              formik={formik}
              fieldPrefix="present"
              disabled={isSameAsPermanent}
              required={false}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                গ্রাম
              </label>
              <input
                type="text"
                name="address.presentVillage"
                value={formik.values.address?.presentVillage || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsPermanent}
                className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
                  isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
                }`}
                placeholder="Enter village"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                বিস্তারিত/এলাকা
              </label>
              <textarea
                name="address.presentArea"
                value={formik.values.address?.presentArea || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsPermanent}
                rows={3}
                className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors resize-none ${
                  isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
                }`}
                placeholder="Enter detailed area information"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
