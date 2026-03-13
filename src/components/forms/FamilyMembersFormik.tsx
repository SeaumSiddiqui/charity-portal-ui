import React from 'react';
import { FormikProps, FieldArray } from 'formik';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Gender, MaritalStatus, OrphanApplication, FamilyMember } from '../../types';

interface FamilyMembersFormikProps {
  formik: FormikProps<OrphanApplication>;
}

export const FamilyMembersFormik: React.FC<FamilyMembersFormikProps> = ({
  formik
}) => {
  const genderOptions = [
    { value: Gender.MALE, label: 'ছেলে' },
    { value: Gender.FEMALE, label: 'মেয়ে' },
  ];

  const maritalStatusOptions = [
    { value: MaritalStatus.UNMARRIED, label: 'অবিবাহিত' },
    { value: MaritalStatus.MARRIED, label: 'বিবাহিত' },
    { value: MaritalStatus.DIVORCED, label: 'তালাকপ্রাপ্ত' },
    { value: MaritalStatus.WIDOWED, label: 'বিধবা' },
  ];

  const familyMembers = formik.values.familyMembers || [];
  const numOfSiblings = formik.values.primaryInformation?.numOfSiblings || 0;

  const updateSiblingsCount = (newCount: number) => {
    formik.setFieldValue('primaryInformation.numOfSiblings', newCount);
  };

  const createEmptyFamilyMember = (): FamilyMember => ({
    name: '',
    age: 0,
    siblingsGrade: 0,
    occupation: '',
    siblingsGender: Gender.MALE,
    maritalStatus: MaritalStatus.UNMARRIED,
  });

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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ভাইবোন এর বিবরণী</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {familyMembers.length} of {numOfSiblings} siblings added
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <FieldArray name="familyMembers">
            {({ push, remove }) => (
              <>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Family Members: {familyMembers.length} / {numOfSiblings}
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      push(createEmptyFamilyMember());
                      updateSiblingsCount(familyMembers.length + 1);
                    }}
                    variant="outline"
                    size="sm"
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
                      {numOfSiblings === 0
                        ? 'No siblings specified'
                        : 'No family members added yet'
                      }
                    </p>
                    <p className="text-sm">
                      {numOfSiblings === 0
                        ? 'Set number of siblings in Primary Information first'
                        : 'Click "Add Member" to add family members'
                      }
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
                            ভাই/বোন - {index + 1}
                          </h4>
                          <Button
                            type="button"
                            onClick={() => {
                              remove(index);
                              updateSiblingsCount(familyMembers.length - 1);
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
                              নাম <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name={`familyMembers.${index}.name`}
                              value={formik.values.familyMembers?.[index]?.name || ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                              placeholder="Enter name"
                            />
                            {getFieldError(`familyMembers.${index}.name`) && (
                              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(`familyMembers.${index}.name`)}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              বয়স <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name={`familyMembers.${index}.age`}
                              value={formik.values.familyMembers?.[index]?.age ?? ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              min={0}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                              placeholder="Enter age"
                            />
                            {getFieldError(`familyMembers.${index}.age`) && (
                              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(`familyMembers.${index}.age`)}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              লিঙ্গ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name={`familyMembers.${index}.siblingsGender`}
                                value={formik.values.familyMembers?.[index]?.siblingsGender || Gender.MALE}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                              >
                                {genderOptions.map(option => (
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
                              শ্রেণী
                            </label>
                            <input
                              type="number"
                              name={`familyMembers.${index}.siblingsGrade`}
                              value={formik.values.familyMembers?.[index]?.siblingsGrade || 0}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              min={0}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                              placeholder="Enter grade"
                            />
                            {getFieldError(`familyMembers.${index}.siblingsGrade`) && (
                              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(`familyMembers.${index}.siblingsGrade`)}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              পেশা
                            </label>
                            <input
                              type="text"
                              name={`familyMembers.${index}.occupation`}
                              value={formik.values.familyMembers?.[index]?.occupation || ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 transition-colors"
                              placeholder="Enter occupation"
                            />
                            {getFieldError(`familyMembers.${index}.occupation`) && (
                              <p className="text-xs text-red-600 dark:text-red-400">{getFieldError(`familyMembers.${index}.occupation`)}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              বৈবাহিক অবস্থা <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name={`familyMembers.${index}.maritalStatus`}
                                value={formik.values.familyMembers?.[index]?.maritalStatus || MaritalStatus.UNMARRIED}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 focus:border-primary-500 appearance-none cursor-pointer transition-colors"
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </FieldArray>
        </div>
      </div>
    </div>
  );
};
