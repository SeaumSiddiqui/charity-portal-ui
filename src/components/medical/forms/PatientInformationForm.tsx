import React from 'react';
import { FormikProps } from 'formik';
import { User, Users, DollarSign } from 'lucide-react';
import { MedicalApplication, Gender, createEmptyPatientFamilyMember } from '../../../types';
import { FormCard, getFieldError } from '../../forms/shared';

interface PatientInformationFormProps {
  formik: FormikProps<MedicalApplication>;
}

export const PatientInformationForm: React.FC<PatientInformationFormProps> = ({ formik }) => {
  const handleFamilyMemberCountChange = (count: string) => {
    formik.setFieldValue('patientInformation.familyMemberCount', count);

    const numCount = parseInt(count) || 0;
    const currentMembers = formik.values.patientFamilyMembers || [];
    let updatedMembers = [...currentMembers];

    if (numCount > currentMembers.length) {
      for (let i = currentMembers.length; i < numCount; i++) {
        updatedMembers.push(createEmptyPatientFamilyMember());
      }
    } else if (numCount < currentMembers.length) {
      updatedMembers = updatedMembers.slice(0, numCount);
    }

    formik.setFieldValue('patientFamilyMembers', updatedMembers);
  };

  return (
    <div className="space-y-6">
      <FormCard
        icon={User}
        title="Patient Details"
        subtitle="Basic information about the patient"
        colorVariant="teal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Code
            </label>
            <input
              type="text"
              name="patientInformation.code"
              value={formik.values.patientInformation?.code || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter code (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patientInformation.fullName"
              value={formik.values.patientInformation?.fullName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter patient's full name"
            />
            {getFieldError(formik, 'patientInformation.fullName') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.fullName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Birth Certificate Registration
            </label>
            <input
              type="text"
              name="patientInformation.bcRegistration"
              value={formik.values.patientInformation?.bcRegistration || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter BC registration number"
            />
            {getFieldError(formik, 'patientInformation.bcRegistration') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.bcRegistration')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="patientInformation.dateOfBirth"
              value={formik.values.patientInformation?.dateOfBirth || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
            />
            {getFieldError(formik, 'patientInformation.dateOfBirth') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.dateOfBirth')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="patientInformation.gender"
                value={formik.values.patientInformation?.gender || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="">Select gender</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {getFieldError(formik, 'patientInformation.gender') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.gender')}</p>
            )}
          </div>
        </div>
      </FormCard>

      <FormCard
        icon={Users}
        title="Parents Information"
        subtitle="Information about the patient's parents"
        colorVariant="teal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patientInformation.fathersName"
              value={formik.values.patientInformation?.fathersName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter father's name"
            />
            {getFieldError(formik, 'patientInformation.fathersName') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.fathersName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Father's Profession
            </label>
            <div className="relative">
              <select
                name="patientInformation.fathesProfession"
                value={formik.values.patientInformation?.fathesProfession || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="">Select father's profession</option>
                <option value="Business">Business</option>
                <option value="Begger">Begger</option>
                <option value="Barber">Barber</option>
                <option value="Cobbler">Cobbler</option>
                <option value="Disabled">Disabled</option>
                <option value="Driver">Driver</option>
                <option value="Electrician">Electrician</option>
                <option value="Helper">Helper</option>
                <option value="Imam/Muezzin">Imam/Muezzin</option>
                <option value="Job holder">Job holder</option>
                <option value="Jobless">Jobless</option>
                <option value="Labour">Labour</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Massion">Massion</option>
                <option value="Plumber">Plumber</option>
                <option value="Security Guard">Security Guard</option>
                <option value="Shop keeper">Shop keeper</option>
                <option value="Sweeper">Sweeper</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {getFieldError(formik, 'patientInformation.fathesProfession') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.fathesProfession')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mother's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patientInformation.mothersName"
              value={formik.values.patientInformation?.mothersName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter mother's name"
            />
            {getFieldError(formik, 'patientInformation.mothersName') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.mothersName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mother's Profession
            </label>
            <div className="relative">
              <select
                name="patientInformation.mothersProfession"
                value={formik.values.patientInformation?.mothersProfession || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
              >
                <option value="">Select mother's profession</option>
                <option value="Babysitter">Babysitter</option>
                <option value="Business">Business</option>
                <option value="Begger">Begger</option>
                <option value="Caretacker">Caretacker</option>
                <option value="Disabled">Disabled</option>
                <option value="Housewife">Housewife</option>
                <option value="Job holder">Job holder</option>
                <option value="Labour">Labour</option>
                <option value="Shop keeper">Shop keeper</option>
                <option value="Sweeper">Sweeper</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {getFieldError(formik, 'patientInformation.mothersProfession') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.mothersProfession')}</p>
            )}
          </div>
        </div>
      </FormCard>

      <FormCard
        icon={DollarSign}
        title="Financial & Family"
        subtitle="Financial information and family details"
        colorVariant="teal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Annual Income
            </label>
            <input
              type="text"
              name="patientInformation.annualIncome"
              value={formik.values.patientInformation?.annualIncome || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter annual income"
            />
            {getFieldError(formik, 'patientInformation.annualIncome') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.annualIncome')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Family Members
            </label>
            <input
              type="text"
              value={formik.values.patientInformation?.familyMemberCount || ''}
              onChange={(e) => handleFamilyMemberCountChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
              placeholder="Enter family member count"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This will automatically add/remove rows in the Family Members section
            </p>
            {getFieldError(formik, 'patientInformation.familyMemberCount') && (
              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(formik, 'patientInformation.familyMemberCount')}</p>
            )}
          </div>
        </div>
      </FormCard>
    </div>
  );
};
