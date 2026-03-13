import React, { useEffect } from 'react';
import { FormikProps } from 'formik';
import { MedicalApplication, PatientRelation } from '../../../types';
import { FormCard } from '../../forms/shared/FormCard';
import { Phone } from 'lucide-react';

interface ContactInformationFormProps {
  formik: FormikProps<MedicalApplication>;
}

const RELATIVE_OPTIONS = [
  PatientRelation.SELF,
  PatientRelation.FATHER,
  PatientRelation.MOTHER,
  PatientRelation.BROTHER,
  PatientRelation.SISTER,
  PatientRelation.OTHERS,
];

const RELATION_LABELS: Record<PatientRelation, string> = {
  [PatientRelation.SELF]: 'Self',
  [PatientRelation.FATHER]: 'Father',
  [PatientRelation.MOTHER]: 'Mother',
  [PatientRelation.BROTHER]: 'Brother',
  [PatientRelation.SISTER]: 'Sister',
  [PatientRelation.OTHERS]: 'Others',
};

export const ContactInformationForm: React.FC<ContactInformationFormProps> = ({ formik }) => {
  useEffect(() => {
    if (!formik.values.contactInformation?.relativeContacts) {
      formik.setFieldValue('contactInformation.relativeContacts', {});
    }
  }, []);

  const relativeContacts = formik.values.contactInformation?.relativeContacts || {};
  const contactEntries = Object.entries(relativeContacts) as [PatientRelation, string][];

  const slots = [0, 1, 2];

  const handleRelationChange = (slotIndex: number, newRelation: PatientRelation) => {
    const updated = { ...relativeContacts };
    const entries = Object.entries(updated) as [PatientRelation, string][];

    if (slotIndex < entries.length) {
      const [oldRelation, cell] = entries[slotIndex];
      delete updated[oldRelation];
      updated[newRelation] = cell;
    } else {
      updated[newRelation] = '';
    }

    formik.setFieldValue('contactInformation.relativeContacts', updated);
  };

  const formatPhoneNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length === 0) return '';
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7) {
      return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
    }

    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7, 11)}`;
  };

  const handleCellChange = (slotIndex: number, value: string) => {
    const formatted = formatPhoneNumber(value);
    const updated = { ...relativeContacts };
    const entries = Object.entries(updated) as [PatientRelation, string][];

    if (slotIndex < entries.length) {
      const [relation] = entries[slotIndex];
      updated[relation] = formatted;
    }

    formik.setFieldValue('contactInformation.relativeContacts', updated);
  };

  const getPhoneError = (slotIndex: number): string | null => {
    const entries = Object.entries(relativeContacts) as [PatientRelation, string][];
    if (slotIndex >= entries.length) return null;

    const [_, phone] = entries[slotIndex];
    if (!phone) return null;

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length > 0 && digitsOnly.length !== 11) {
      return 'Must be exactly 11 digits';
    }

    return null;
  };

  return (
    <FormCard icon={Phone} title="Contact Information" colorVariant="teal">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Relative Contacts <span className="text-red-500">*</span> (3 Required)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slots.map((slotIndex) => {
              const entry = contactEntries[slotIndex];
              const relation = entry ? entry[0] : '';
              const cell = entry ? entry[1] : '';

              const usedRelations = contactEntries
                .map(([r]) => r)
                .filter((_, idx) => idx !== slotIndex);

              return (
                <div key={slotIndex} className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Relative {slotIndex + 1} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={relation as string}
                      onChange={(e) => handleRelationChange(slotIndex, e.target.value as PatientRelation)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
                    >
                      <option value="">Select relation</option>
                      {RELATIVE_OPTIONS.map((rel) => (
                        <option
                          key={rel}
                          value={rel}
                          disabled={usedRelations.includes(rel)}
                        >
                          {RELATION_LABELS[rel]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cell Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={cell}
                      onChange={(e) => handleCellChange(slotIndex, e.target.value)}
                      placeholder="017 0602 0534"
                      disabled={!relation}
                      maxLength={14}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {getPhoneError(slotIndex) && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {getPhoneError(slotIndex)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="contactInformation.email"
            value={formik.values.contactInformation?.email || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Comment
          </label>
          <textarea
            name="contactInformation.additionalComment"
            value={formik.values.contactInformation?.additionalComment || ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors resize-none"
            placeholder="Any additional information..."
          />
        </div>
      </div>
    </FormCard>
  );
};