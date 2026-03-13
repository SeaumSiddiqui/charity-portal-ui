import React, { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { geoService, District, Upazila, Union } from '../../services/geoService';

interface LocationSelectorProps {
  formik: FormikProps<any>;
  fieldPrefix: string;
  disabled?: boolean;
  required?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  formik,
  fieldPrefix,
  disabled = false,
  required = false
}) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);
  const [loading, setLoading] = useState(false);

  const isFullPath = fieldPrefix.includes('.');
  const districtFieldName = isFullPath ? `${fieldPrefix}District` : `address.${fieldPrefix}District`;
  const subDistrictFieldName = isFullPath ? `${fieldPrefix}SubDistrict` : `address.${fieldPrefix}SubDistrict`;
  const unionFieldName = isFullPath ? `${fieldPrefix}Union` : `address.${fieldPrefix}Union`;

  const getNestedValue = (path: string) => {
    const keys = path.split('.');
    let value: any = formik.values;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || '';
  };

  const selectedDistrict = getNestedValue(districtFieldName);
  const selectedSubDistrict = getNestedValue(subDistrictFieldName);
  const selectedUnion = getNestedValue(unionFieldName);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        setLoading(true);
        const data = await geoService.getAllDistricts();
        setDistricts(data);
      } catch (error) {
        console.error('Failed to load districts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDistricts();
  }, []);

  useEffect(() => {
    const loadUpazilas = async () => {
      if (!selectedDistrict) {
        setUpazilas([]);
        return;
      }

      const district = districts.find(d => d.name === selectedDistrict);
      if (!district) return;

      try {
        setLoading(true);
        const data = await geoService.getUpazilasByDistrict(district.id);
        setUpazilas(data);
      } catch (error) {
        console.error('Failed to load upazilas:', error);
        setUpazilas([]);
      } finally {
        setLoading(false);
      }
    };

    loadUpazilas();
  }, [selectedDistrict, districts]);

  useEffect(() => {
    const loadUnions = async () => {
      if (!selectedSubDistrict) {
        setUnions([]);
        return;
      }

      const upazila = upazilas.find(u => u.name === selectedSubDistrict);
      if (!upazila) return;

      try {
        setLoading(true);
        const data = await geoService.getUnionsByUpazila(upazila.id);
        setUnions(data);
      } catch (error) {
        console.error('Failed to load unions:', error);
        setUnions([]);
      } finally {
        setLoading(false);
      }
    };

    loadUnions();
  }, [selectedSubDistrict, upazilas]);

  useEffect(() => {
    if (selectedDistrict && !upazilas.find(u => u.name === selectedSubDistrict)) {
      formik.setFieldValue(subDistrictFieldName, '');
      formik.setFieldValue(unionFieldName, '');
    }
  }, [selectedDistrict, upazilas]);

  useEffect(() => {
    if (selectedSubDistrict && !unions.find(u => u.name === selectedUnion)) {
      formik.setFieldValue(unionFieldName, '');
    }
  }, [selectedSubDistrict, unions]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    formik.setFieldValue(districtFieldName, value);
    formik.setFieldValue(subDistrictFieldName, '');
    formik.setFieldValue(unionFieldName, '');
  };

  const handleSubDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    formik.setFieldValue(subDistrictFieldName, value);
    formik.setFieldValue(unionFieldName, '');
  };

  const handleUnionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    formik.setFieldValue(unionFieldName, value);
  };

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
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          District {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={districtFieldName}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          onBlur={formik.handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
            disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
          }`}
        >
          <option value="">জেলা নির্বাচন করুন</option>
          {districts.map((district) => (
            <option key={district.id} value={district.name}>
              {district.name}
            </option>
          ))}
        </select>
        {getFieldError(districtFieldName) && (
          <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(districtFieldName)}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sub District {required && <span className="text-red-500">*</span>}
        </label>
        <select
          name={subDistrictFieldName}
          value={selectedSubDistrict}
          onChange={handleSubDistrictChange}
          onBlur={formik.handleBlur}
          disabled={disabled || !selectedDistrict}
          className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
            disabled || !selectedDistrict ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
          }`}
        >
          <option value="">
            {!selectedDistrict ? 'প্রথমে জেলা নির্বাচন করুন' : 'উপজেলা নির্বাচন করুন'}
          </option>
          {upazilas.map((upazila) => (
            <option key={upazila.id} value={upazila.name}>
              {upazila.name}
            </option>
          ))}
        </select>
        {getFieldError(subDistrictFieldName) && (
          <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(subDistrictFieldName)}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Union
        </label>
        <select
          name={unionFieldName}
          value={selectedUnion}
          onChange={handleUnionChange}
          onBlur={formik.handleBlur}
          disabled={disabled || !selectedSubDistrict}
          className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors ${
            disabled || !selectedSubDistrict ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900'
          }`}
        >
          <option value="">
            {!selectedSubDistrict ? 'প্রথমে উপজেলা নির্বাচন করুন' : 'ইউনিয়ন নির্বাচন করুন'}
          </option>
          {unions.map((union) => (
            <option key={union.id} value={union.name}>
              {union.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
