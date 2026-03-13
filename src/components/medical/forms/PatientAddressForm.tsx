import React from 'react';
import { FormikProps } from 'formik';
import { MapPin, Copy } from 'lucide-react';
import { MedicalApplication } from '../../../types';
import { Button } from '../../ui/Button';
import { LocationSelector } from '../../forms/LocationSelector';

interface PatientAddressFormProps {
  formik: FormikProps<MedicalApplication>;
}

export const PatientAddressForm: React.FC<PatientAddressFormProps> = ({ formik }) => {
  const copyPermanentToPresent = () => {
    const permanentAddress = formik.values.patientAddress;
    if (permanentAddress) {
      formik.setFieldValue('patientAddress.isSameAsPermanent', true);
      formik.setFieldValue('patientAddress.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('patientAddress.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('patientAddress.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('patientAddress.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('patientAddress.presentArea', permanentAddress.permanentArea);
    }
  };

  React.useEffect(() => {
    if (formik.values.patientAddress?.isSameAsPermanent) {
      const permanentAddress = formik.values.patientAddress;
      formik.setFieldValue('patientAddress.presentDistrict', permanentAddress.permanentDistrict);
      formik.setFieldValue('patientAddress.presentSubDistrict', permanentAddress.permanentSubDistrict);
      formik.setFieldValue('patientAddress.presentUnion', permanentAddress.permanentUnion);
      formik.setFieldValue('patientAddress.presentVillage', permanentAddress.permanentVillage);
      formik.setFieldValue('patientAddress.presentArea', permanentAddress.permanentArea);
    }
  }, [
    formik.values.patientAddress?.permanentDistrict,
    formik.values.patientAddress?.permanentSubDistrict,
    formik.values.patientAddress?.permanentUnion,
    formik.values.patientAddress?.permanentVillage,
    formik.values.patientAddress?.permanentArea,
    formik.values.patientAddress?.isSameAsPermanent
  ]);

  const isSameAsPermanent = formik.values.patientAddress?.isSameAsPermanent || false;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permanent Address</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Permanent address details</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LocationSelector
              formik={formik as any}
              fieldPrefix="patientAddress.permanent"
              required={true}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Village
              </label>
              <input
                type="text"
                name="patientAddress.permanentVillage"
                value={formik.values.patientAddress?.permanentVillage || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
                placeholder="Enter village"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Area Details
              </label>
              <textarea
                name="patientAddress.permanentArea"
                value={formik.values.patientAddress?.permanentArea || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors resize-none"
                placeholder="Enter detailed area information"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Present Address</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Present address details</p>
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
                  formik.setFieldValue('patientAddress.isSameAsPermanent', isChecked);
                  if (isChecked) {
                    copyPermanentToPresent();
                  }
                }}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
              formik={formik as any}
              fieldPrefix="patientAddress.present"
              disabled={isSameAsPermanent}
              required={false}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Village
              </label>
              <input
                type="text"
                name="patientAddress.presentVillage"
                value={formik.values.patientAddress?.presentVillage || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsPermanent}
                className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors ${
                  isSameAsPermanent ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
                }`}
                placeholder="Enter village"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Area Details
              </label>
              <textarea
                name="patientAddress.presentArea"
                value={formik.values.patientAddress?.presentArea || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSameAsPermanent}
                rows={3}
                className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors resize-none ${
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
