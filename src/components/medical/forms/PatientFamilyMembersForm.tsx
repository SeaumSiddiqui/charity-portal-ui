import React from 'react';
import { FormikProps, FieldArray } from 'formik';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MedicalApplication, MaritalStatus, createEmptyPatientFamilyMember } from '../../../types';
import { FormCard, getFieldError } from '../../forms/shared';

interface PatientFamilyMembersFormProps {
  formik: FormikProps<MedicalApplication>;
}

export const PatientFamilyMembersForm: React.FC<PatientFamilyMembersFormProps> = ({ formik }) => {
  const maritalStatusOptions = [
    { value: MaritalStatus.UNMARRIED, label: 'Unmarried' },
    { value: MaritalStatus.MARRIED, label: 'Married' },
    { value: MaritalStatus.DIVORCED, label: 'Divorced' },
    { value: MaritalStatus.WIDOWED, label: 'Widowed' },
  ];

  const familyMembers = formik.values.patientFamilyMembers || [];
  const familyMemberCount = formik.values.patientInformation?.familyMemberCount || 0;

  const updateFamilyMemberCount = (newCount: number) => {
    formik.setFieldValue('patientInformation.familyMemberCount', newCount);
  };

  return (
    <div className="space-y-6">
      <FormCard
        icon={Users}
        title="Family Members"
        subtitle={`${familyMembers.length} of ${familyMemberCount} members added`}
        colorVariant="teal"
      >
        <FieldArray name="patientFamilyMembers">
          {({ push, remove }) => (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Family Members: {familyMembers.length} / {familyMemberCount}
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    push(createEmptyPatientFamilyMember());
                    updateFamilyMemberCount(familyMembers.length + 1);
                  }}
                  variant="outline"
                  size="sm"
                  className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-600 dark:text-teal-400 dark:hover:bg-teal-900/20"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {familyMembers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-base font-medium mb-2">
                    {familyMemberCount === 0
                      ? 'No family members specified'
                      : 'No family members added yet'}
                  </p>
                  <p className="text-sm">
                    {familyMemberCount === 0
                      ? 'Set number of family members in Patient Information first'
                      : 'Click "Add Member" to add family members'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {familyMembers.map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/30"
                    >
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Family Member - {index + 1}
                        </h4>
                        <Button
                          type="button"
                          onClick={() => {
                            remove(index);
                            updateFamilyMemberCount(familyMembers.length - 1);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name={`patientFamilyMembers.${index}.name`}
                            value={formik.values.patientFamilyMembers?.[index]?.name || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 transition-colors"
                            placeholder="Enter name"
                          />
                          {getFieldError(formik, `patientFamilyMembers.${index}.name`) && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {getFieldError(formik, `patientFamilyMembers.${index}.name`)}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Age <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name={`patientFamilyMembers.${index}.age`}
                              value={formik.values.patientFamilyMembers?.[index]?.age ?? ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                            >
                              <option value="">Select age</option>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(age => (
                                <option key={age} value={age}>{age}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          {getFieldError(formik, `patientFamilyMembers.${index}.age`) && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {getFieldError(formik, `patientFamilyMembers.${index}.age`)}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Marital Status <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name={`patientFamilyMembers.${index}.maritalStatus`}
                              value={formik.values.patientFamilyMembers?.[index]?.maritalStatus || MaritalStatus.UNMARRIED}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                            >
                              {maritalStatusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Grade/Class
                          </label>
                          <div className="relative">
                            <select
                              name={`patientFamilyMembers.${index}.grade`}
                              value={formik.values.patientFamilyMembers?.[index]?.grade ?? ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                            >
                              <option value="">Select class</option>
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          {getFieldError(formik, `patientFamilyMembers.${index}.grade`) && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {getFieldError(formik, `patientFamilyMembers.${index}.grade`)}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Occupation
                          </label>
                          <div className="relative">
                            <select
                              name={`patientFamilyMembers.${index}.occupation`}
                              value={formik.values.patientFamilyMembers?.[index]?.occupation || ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900/50 focus:border-teal-500 appearance-none cursor-pointer transition-colors"
                            >
                              <option value="">Select occupation</option>
                              <option value="Business">Business</option>
                              <option value="Job Holder">Job Holder</option>
                              <option value="Labor">Labor</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          {getFieldError(formik, `patientFamilyMembers.${index}.occupation`) && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {getFieldError(formik, `patientFamilyMembers.${index}.occupation`)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </FieldArray>
      </FormCard>
    </div>
  );
};
